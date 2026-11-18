/*
 * SPONSIFY Telegram bot — one Cloudflare Worker, no build step, no packages.
 *
 * What it does
 *   1. Website leads   POST /lead       the "Free audit" form on the site lands in your Telegram.
 *   2. Chat bot        POST /telegram   visitors book a free audit, read services/FAQ (EN + AR),
 *                                       or message you; you reply from Telegram and it relays back.
 *   3. Meta ads        cron + commands  daily report at 9:00 Doha, alert check at 16:00 Doha,
 *                                       /ads /today /week /alerts on demand.
 *
 * Setup is in README.md next to this file. Secrets live in Cloudflare, never in this file:
 *   TELEGRAM_BOT_TOKEN  (secret)  from @BotFather
 *   ADMIN_KEY           (secret)  a long password you choose; used by /setup and /claim
 *   META_ACCESS_TOKEN   (secret, optional)  Meta system-user token with ads_read
 * Plain variables (all optional):
 *   META_AD_ACCOUNT_IDS   "act_123,act_456"
 *   ALLOWED_ORIGINS       sites allowed to post leads, default https://alieeb.github.io
 *   ALERT_MAX_CPA         "50" for all accounts, or "act_123:50,act_456:120"
 *   ALERT_MIN_ROAS        "2", or per account like ALERT_MAX_CPA
 *   ALERT_MIN_CTR         default 0.8 (%)
 *   ALERT_MAX_FREQ        default 3.5 (checked on the 7-day report)
 *   ALERT_ZERO_RESULT_SPEND  default 100 (spend with 0 results that triggers an alert)
 *   RESULT_ACTIONS        override which Meta action types count as results
 *   META_API_VERSION      default v24.0
 *   OWNER_CHAT_ID         skip /claim and send everything to this chat
 * KV namespace binding: BOT
 */

const WA_NUMBER = "97433029577";
const SITE = "https://alieeb.github.io/sponsify/";
const DEFAULT_ORIGINS = "https://alieeb.github.io";
const DAY = 86400;
const TZ = "Asia/Qatar";

// ---------------------------------------------------------------- copy (EN + AR)

const T = {
  en: {
    welcome: "<b>Welcome to SPONSIFY</b> 👋\nWe turn scrollers into customers: websites, ads, social media, automation and apps for brands in Qatar.\n\nWhat can we help you with today?",
    btnAudit: "🎯 Free 15-min audit",
    btnServices: "🧩 Services",
    btnWork: "💼 Our work",
    btnFaq: "❓ FAQ",
    btnPrice: "💰 Prices",
    btnWa: "💬 WhatsApp us",
    btnLang: "🌐 العربية",
    btnMenu: "🏠 Menu",
    btnSeeWork: "👀 See the work",
    btnBackFaq: "❓ More questions",
    services: "<b>Five ways to grow</b>\n\n🌐 <b>Website design</b>: fast, modern, mobile-first sites that turn visitors into customers.\n📱 <b>Social media</b>: content, reels and community management that build a brand people follow and trust.\n🎯 <b>Paid ads</b>: Meta, Google and TikTok campaigns built around cost per customer, with full tracking.\n⚡ <b>Automation &amp; leads</b>: Google Maps lead scraping, email campaigns and auto follow-ups so no lead goes cold.\n📲 <b>App development</b>: custom mobile and web apps, from idea to launch.\n\nPick one, or let one team run all five.",
    work: "<b>Brands that trust us</b>\nKaza Store · Sharmax Motors Qatar · PerfUp Qatar · Eat &amp; Lose · UniHealth · Greece Residency Capital · Wady · DARS · Rowwad · Masar\n\nAd creatives, social posts, websites, motion graphics, AI video and app videos.",
    price: "<b>How much does it cost?</b>\nEvery business is different, so we scope each project after a free 15-minute audit. You get a clear price before any work starts, with no lock-in contracts.",
    faqTitle: "<b>Questions, answered</b>\nTap a question:",
    faq: [
      ["What does SPONSIFY do?", "SPONSIFY is a digital marketing agency. We design websites, manage social media, run paid ads on Meta, Google and TikTok, build marketing automation and lead generation systems, and develop mobile and web apps."],
      ["Do you work in Arabic and English?", "Yes. We write and design content, ads and websites in both Arabic and English."],
      ["Where is SPONSIFY based?", "We are based in Qatar. You can reach us on WhatsApp at +974 3302 9577."],
      ["How much does it cost?", "Every business is different, so we scope each project after a free 15-minute audit. You get a clear price before any work starts."],
      ["What work have you done?", "We have worked with Kaza Store, Sharmax Motors Qatar, PerfUp Qatar, Eat &amp; Lose, UniHealth, Greece Residency Capital, Wady, DARS, Rowwad and Masar, on ad creatives, social posts, websites, motion graphics, AI video and app videos."],
      ["How do I get started?", "Tap “Free 15-min audit” below. It takes 30 seconds, and we reply within one business day."],
    ],
    askService: "<b>Free audit · step 1 of 4</b>\nWhich service do you need most?",
    serviceList: ["Website design", "Social media", "Paid ads", "Automation & leads", "App development", "Not sure yet"],
    askBiz: "<b>Step 2 of 4</b>\nWhat's the name of your business? You can add your Instagram or website too.",
    askBudget: "<b>Step 3 of 4</b>\nHow much do you spend on ads per month?",
    budgetList: ["Under 3,000 QAR", "3,000 – 10,000 QAR", "10,000 – 30,000 QAR", "30,000+ QAR", "Not running ads yet"],
    askPhone: "<b>Step 4 of 4</b>\nWhat's your WhatsApp number? Tap the button below to share it, or type it.",
    phoneHint: "+974 5555 5555",
    btnShare: "📱 Share my number",
    badPhone: "That doesn't look like a phone number. Please type it with the country code, for example +974 5555 5555.",
    askGoal: "Last one 🙌\nWhat do you want to achieve in the next 3 months? For example: more bookings, more sales, a new branch launch.",
    btnSkip: "Skip",
    done: "✅ <b>You're booked in, {name}!</b>\nAli will message you on WhatsApp within one business day to set up your free audit.\n\nYou'll leave with clear fixes, even if you never hire us.",
    relayAck: "✅ Message sent to the team. We'll reply right here, usually within a few hours.",
    cancelled: "No problem, cancelled.",
    more: "Anything else we can help with?",
    bizHint: "Business name",
    picked: "✓",
  },
  ar: {
    welcome: "<b>أهلاً بك في سبونسيفاي</b> 👋\nنحوّل المتصفحين إلى عملاء: مواقع وإعلانات وسوشيال ميديا وأتمتة وتطبيقات للعلامات التجارية في قطر.\n\nكيف يمكننا مساعدتك اليوم؟",
    btnAudit: "🎯 تدقيق مجاني 15 دقيقة",
    btnServices: "🧩 خدماتنا",
    btnWork: "💼 أعمالنا",
    btnFaq: "❓ أسئلة شائعة",
    btnPrice: "💰 الأسعار",
    btnWa: "💬 راسلنا واتساب",
    btnLang: "🌐 English",
    btnMenu: "🏠 القائمة",
    btnSeeWork: "👀 شاهد الأعمال",
    btnBackFaq: "❓ أسئلة أخرى",
    services: "<b>خمس طرق للنمو</b>\n\n🌐 <b>تصميم المواقع</b>: مواقع سريعة وحديثة ومتوافقة مع الجوال تحوّل الزوار إلى عملاء.\n📱 <b>إدارة السوشيال ميديا</b>: محتوى وريلز وإدارة مجتمع تبني علامة يتابعها الناس ويثقون بها.\n🎯 <b>الإعلانات المدفوعة</b>: حملات ميتا وجوجل وتيك توك مبنية على تكلفة العميل ومتابعة كاملة للنتائج.\n⚡ <b>الأتمتة وتوليد العملاء</b>: استخراج العملاء من خرائط جوجل، وحملات بريد وردود متابعة تلقائية حتى لا يضيع أي عميل.\n📲 <b>تطوير التطبيقات</b>: تطبيقات جوال وويب مخصصة لنشاطك، من الفكرة حتى الإطلاق.\n\nاختر واحدة، أو دع فريقاً واحداً يدير الخمس.",
    work: "<b>علامات تثق بنا</b>\nمتجر كازا · شارماكس موتورز قطر · بيرف أب قطر · إيت آند لوز · يوني هيلث · غريس ريزيدنسي كابيتال · وادي · درس · رواد · مسار\n\nتصاميم إعلانية ومنشورات ومواقع وموشن جرافيك وفيديو بالذكاء الاصطناعي وفيديوهات تطبيقات.",
    price: "<b>كم التكلفة؟</b>\nكل نشاط مختلف، لذلك نحدد نطاق كل مشروع بعد تدقيق مجاني لمدة 15 دقيقة. تحصل على سعر واضح قبل بدء أي عمل، وبدون عقود إلزامية.",
    faqTitle: "<b>أسئلتك، مُجابة</b>\nاختر سؤالاً:",
    faq: [
      ["ماذا تقدّم سبونسيفاي؟", "سبونسيفاي وكالة تسويق رقمي. نصمم المواقع، وندير السوشيال ميديا، وندير الإعلانات المدفوعة على ميتا وجوجل وتيك توك، ونبني أنظمة الأتمتة وتوليد العملاء، ونطوّر تطبيقات الجوال والويب."],
      ["هل تعملون بالعربية والإنجليزية؟", "نعم. نكتب ونصمم المحتوى والإعلانات والمواقع بالعربية والإنجليزية."],
      ["أين تقع سبونسيفاي؟", "نحن في قطر. يمكنك التواصل معنا عبر واتساب على الرقم ‎+974 3302 9577."],
      ["كم التكلفة؟", "كل نشاط مختلف، لذلك نحدد نطاق كل مشروع بعد تدقيق مجاني لمدة 15 دقيقة. تحصل على سعر واضح قبل بدء أي عمل."],
      ["ما الأعمال التي قدمتموها؟", "عملنا مع متجر كازا وشارماكس موتورز قطر وبيرف أب قطر وإيت آند لوز ويوني هيلث وغريس ريزيدنسي كابيتال ووادي ودرس ورواد ومسار، في التصاميم الإعلانية والمنشورات والمواقع والموشن جرافيك وفيديو الذكاء الاصطناعي وفيديوهات التطبيقات."],
      ["كيف أبدأ؟", "اضغط «تدقيق مجاني 15 دقيقة» بالأسفل. يستغرق 30 ثانية، ونرد خلال يوم عمل واحد."],
    ],
    askService: "<b>التدقيق المجاني · الخطوة 1 من 4</b>\nما الخدمة التي تحتاجها أكثر؟",
    serviceList: ["تصميم موقع", "سوشيال ميديا", "إعلانات مدفوعة", "أتمتة وعملاء", "تطوير تطبيق", "لست متأكداً بعد"],
    askBiz: "<b>الخطوة 2 من 4</b>\nما اسم نشاطك التجاري؟ يمكنك إضافة حساب إنستغرام أو الموقع أيضاً.",
    askBudget: "<b>الخطوة 3 من 4</b>\nكم تصرف على الإعلانات شهرياً؟",
    budgetList: ["أقل من 3,000 ر.ق", "3,000 – 10,000 ر.ق", "10,000 – 30,000 ر.ق", "أكثر من 30,000 ر.ق", "لا أعلن حالياً"],
    askPhone: "<b>الخطوة 4 من 4</b>\nما رقم الواتساب الخاص بك؟ اضغط الزر بالأسفل لمشاركته، أو اكتبه.",
    phoneHint: "+974 5555 5555",
    btnShare: "📱 مشاركة رقمي",
    badPhone: "يبدو أن هذا ليس رقم هاتف. اكتبه مع رمز الدولة، مثال: ‎+974 5555 5555",
    askGoal: "آخر سؤال 🙌\nما الذي تريد تحقيقه خلال الأشهر الثلاثة القادمة؟ مثلاً: حجوزات أكثر، مبيعات أكثر، افتتاح فرع جديد.",
    btnSkip: "تخطي",
    done: "✅ <b>تم تسجيل طلبك يا {name}!</b>\nسيتواصل معك علي عبر واتساب خلال يوم عمل واحد لتحديد موعد التدقيق المجاني.\n\nستخرج بإصلاحات واضحة، حتى لو لم تتعامل معنا.",
    relayAck: "✅ وصلت رسالتك للفريق. سنرد عليك هنا، عادةً خلال ساعات قليلة.",
    cancelled: "لا مشكلة، تم الإلغاء.",
    more: "هل تحتاج شيئاً آخر؟",
    bizHint: "اسم النشاط",
    picked: "✓",
  },
};

const WA_PREFILL = {
  en: (n, b) => `Hi ${n}, this is Ali from SPONSIFY 👋 Thanks for requesting a free audit for ${b}. When is a good time for a quick 15-minute call?`,
  ar: (n, b) => `مرحباً ${n}، معك علي من سبونسيفاي 👋 شكراً لطلبك التدقيق المجاني لـ ${b}. متى يناسبك اتصال سريع لمدة 15 دقيقة؟`,
};

const OWNER_HELP =
  "<b>Your SPONSIFY bot commands</b>\n\n" +
  "/leads · last 10 leads\n" +
  "/ads · Meta ads report for yesterday\n" +
  "/today · today so far\n" +
  "/week · last 7 days (with frequency check)\n" +
  "/alerts · check today's campaigns for problems now\n" +
  "/help · this list\n\n" +
  "<b>Replying to people</b>\nReply (swipe left) to any lead or message the bot forwards you. Your reply goes straight to that person, text, photos and voice notes included.\n\n" +
  "<b>Automatic</b>\n☀️ 9:00 Doha: leads from yesterday + ads report (plus a 7-day report on Sundays)\n🚨 16:00 Doha: alerts, only if something is off";

// ---------------------------------------------------------------- entry points

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/telegram" && req.method === "POST") return await onTelegram(req, env, ctx);
      if (url.pathname === "/lead") return await onLead(req, env);
      if (url.pathname === "/setup") return await onSetup(env, url);
      if (url.pathname === "/") return text("SPONSIFY bot is running ✅");
      return text("Not found", 404);
    } catch (e) {
      console.log("fetch error", e && e.stack ? e.stack : e);
      return text("Error", 500);
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(onCron(event, env).catch((e) => console.log("cron error", e && e.stack ? e.stack : e)));
  },
};

// ---------------------------------------------------------------- setup

async function onSetup(env, url) {
  if (!env.TELEGRAM_BOT_TOKEN) return text("❌ Add the secret TELEGRAM_BOT_TOKEN first (Settings → Variables and Secrets).", 500);
  if (!env.ADMIN_KEY) return text("❌ Add the secret ADMIN_KEY first (Settings → Variables and Secrets).", 500);
  if (!env.BOT) return text("❌ Add a KV namespace binding named BOT first (Settings → Bindings).", 500);
  if (!safeEqual(url.searchParams.get("key") || "", env.ADMIN_KEY)) return text("❌ Wrong key. Open /setup?key=YOUR_ADMIN_KEY", 403);

  const me = await tg(env, "getMe", {});
  if (!me.ok) return text("❌ Telegram rejected the bot token: " + (me.description || "unknown error"), 500);

  const hook = await tg(env, "setWebhook", {
    url: `${url.origin}/telegram`,
    secret_token: await webhookSecret(env),
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });

  const cmds = (l) => [
    { command: "start", description: l === "ar" ? "القائمة الرئيسية" : "Main menu" },
    { command: "audit", description: l === "ar" ? "احجز تدقيقاً مجانياً" : "Book a free audit" },
    { command: "services", description: l === "ar" ? "خدماتنا" : "Our services" },
    { command: "faq", description: l === "ar" ? "أسئلة شائعة" : "Questions" },
    { command: "lang", description: l === "ar" ? "English" : "العربية" },
  ];
  await tg(env, "setMyCommands", { commands: cmds("en") });
  await tg(env, "setMyCommands", { commands: cmds("ar"), language_code: "ar" });
  await tg(env, "setMyDescription", {
    description: "SPONSIFY · digital marketing agency in Qatar 🇶🇦\nWebsites, Meta / Google / TikTok ads, social media, automation and apps, built for sales, not likes.\n\nTap Start to book a free 15-minute audit.",
  });
  await tg(env, "setMyDescription", {
    language_code: "ar",
    description: "سبونسيفاي · وكالة تسويق رقمي في قطر 🇶🇦\nمواقع، إعلانات ميتا وجوجل وتيك توك، سوشيال ميديا، أتمتة وتطبيقات، مصممة للمبيعات لا للإعجابات.\n\nاضغط «ابدأ» لحجز تدقيق مجاني لمدة 15 دقيقة.",
  });
  await tg(env, "setMyShortDescription", { short_description: "Digital marketing agency in Qatar. Book a free 15-min audit of your website, ads and social media." });
  await tg(env, "setMyShortDescription", { language_code: "ar", short_description: "وكالة تسويق رقمي في قطر. احجز تدقيقاً مجانياً لمدة 15 دقيقة لموقعك وإعلاناتك وحساباتك." });

  const owner = await getOwner(env);
  const lines = [
    hook.ok ? `✅ Bot @${me.result.username} is connected.` : `❌ Webhook failed: ${hook.description}`,
    "",
    owner ? `✅ Owner chat is set (${owner}).` : `👉 Next: open https://t.me/${me.result.username} and send:\n   /claim YOUR_ADMIN_KEY`,
    "",
    `Website form endpoint (put this in index.html, data-endpoint on the form):\n   ${url.origin}/lead`,
    "",
    `Meta ads: ${metaReady(env) ? "✅ connected for " + accountIds(env).join(", ") : "not set up yet (optional, see README)"}`,
  ];
  return text(lines.join("\n"));
}

async function onClaim(m, env, txt) {
  const key = txt.split(/\s+/)[1] || "";
  if (!env.ADMIN_KEY || !safeEqual(key, env.ADMIN_KEY)) return send(env, m.chat.id, "❌ Wrong key.");
  await tg(env, "deleteMessage", { chat_id: m.chat.id, message_id: m.message_id }); // keep the key out of chat history
  await env.BOT.put("owner", String(m.chat.id));
  await tg(env, "setMyCommands", {
    scope: { type: "chat", chat_id: m.chat.id },
    commands: [
      { command: "leads", description: "Last 10 leads" },
      { command: "ads", description: "Ads report: yesterday" },
      { command: "today", description: "Ads report: today so far" },
      { command: "week", description: "Ads report: last 7 days" },
      { command: "alerts", description: "Check campaigns for problems" },
      { command: "help", description: "How this bot works" },
      { command: "start", description: "See the visitor menu" },
    ],
  });
  const waiting = await env.BOT.list({ prefix: "lead:", limit: 100 });
  const n = waiting.keys.length;
  await send(env, m.chat.id, `✅ <b>This chat now gets every SPONSIFY lead, message and ad report.</b>${n ? `\n\n🧲 ${n} lead${n > 1 ? "s" : ""} already waiting: send /leads` : ""}\n\n${OWNER_HELP}`);
}

// ---------------------------------------------------------------- Telegram webhook

async function onTelegram(req, env, ctx) {
  const got = req.headers.get("X-Telegram-Bot-Api-Secret-Token") || "";
  if (!safeEqual(got, await webhookSecret(env))) return text("forbidden", 403);
  const update = await req.json();
  ctx.waitUntil(handleUpdate(update, env).catch((e) => console.log("update error", e && e.stack ? e.stack : e)));
  return text("ok");
}

async function handleUpdate(u, env) {
  if (u.callback_query) return onCallback(u.callback_query, env);
  const m = u.message;
  if (!m || !m.chat || !m.from || m.from.is_bot) return;
  const txt = (m.text || "").trim();
  const cmd = txt.startsWith("/") ? txt.split(/\s+/)[0].split("@")[0].toLowerCase() : "";

  if (cmd === "/claim") return onClaim(m, env, txt);
  if (cmd === "/id") return send(env, m.chat.id, `Chat ID: <code>${m.chat.id}</code>`);

  const owner = await getOwner(env);
  const isOwner = owner && String(m.chat.id) === String(owner);
  if (isOwner && (await onOwnerMessage(m, env, cmd))) return;
  if (m.chat.type !== "private") return;
  return onVisitorMessage(m, env, owner, cmd, txt, isOwner);
}

// ---- owner

async function onOwnerMessage(m, env, cmd) {
  if (m.reply_to_message) {
    const target = await env.BOT.get(`r:${m.reply_to_message.message_id}`);
    if (target) {
      const c = await tg(env, "copyMessage", { chat_id: target, from_chat_id: m.chat.id, message_id: m.message_id });
      if (c.ok) {
        const r = await tg(env, "setMessageReaction", { chat_id: m.chat.id, message_id: m.message_id, reaction: [{ type: "emoji", emoji: "👍" }] });
        if (!r.ok) await send(env, m.chat.id, "✅ Sent");
      } else {
        await send(env, m.chat.id, "⚠️ Couldn't deliver it: " + esc(c.description || "unknown error") + "\n(They may have blocked the bot.)");
      }
      return true;
    }
  }
  switch (cmd) {
    case "/help":
      await send(env, m.chat.id, OWNER_HELP);
      return true;
    case "/leads":
      await send(env, m.chat.id, await leadsList(env));
      return true;
    case "/ads":
    case "/today":
    case "/week":
    case "/alerts": {
      if (!metaReady(env)) {
        await send(env, m.chat.id, "Meta ads aren't connected yet. Add META_ACCESS_TOKEN (secret) and META_AD_ACCOUNT_IDS in Cloudflare. Steps are in the README.");
        return true;
      }
      await tg(env, "sendChatAction", { chat_id: m.chat.id, action: "typing" });
      const preset = { "/ads": "yesterday", "/today": "today", "/week": "last_7d", "/alerts": "today" }[cmd];
      const msgs = await adsReport(env, preset, { alertsOnly: cmd === "/alerts" });
      if (!msgs.length) msgs.push("✅ No alerts. Every campaign is inside your limits today.");
      for (const s of msgs) await sendLong(env, m.chat.id, s);
      return true;
    }
  }
  return false; // let the owner try the visitor flow (/start etc.)
}

// ---- visitors

async function onVisitorMessage(m, env, owner, cmd, txt, isOwner) {
  const chatId = m.chat.id;
  const s = await getState(env, chatId);
  if (!s.lang) s.lang = detectLang(m.from);
  const t = T[s.lang];

  if (cmd) {
    const arg = txt.split(/\s+/)[1] || "";
    if (cmd === "/lang") {
      s.lang = s.lang === "ar" ? "en" : "ar";
      await putState(env, chatId, s);
      return sendMenu(env, chatId, s.lang);
    }
    if (cmd === "/audit" || (cmd === "/start" && arg === "audit")) return startAudit(env, chatId, s);
    if (cmd === "/services") return send(env, chatId, t.services, { reply_markup: kb([[btn(t.btnAudit, "audit")], [btn(t.btnMenu, "menu")]]) });
    if (cmd === "/faq") return send(env, chatId, t.faqTitle, { reply_markup: faqKb(t) });
    if (cmd === "/cancel") {
      s.step = null;
      s.lead = null;
      await putState(env, chatId, s);
      await send(env, chatId, t.cancelled, { reply_markup: { remove_keyboard: true } });
      return sendMenu(env, chatId, s.lang);
    }
    if (s.step) {
      s.step = null;
      s.lead = null;
    }
    await putState(env, chatId, s);
    return sendMenu(env, chatId, s.lang);
  }

  const lead = s.lead || {};
  switch (s.step) {
    case "svc": // typed instead of tapping a button
      if (!txt) break;
      lead.service = clip(txt, 60);
      s.lead = lead;
      return askBiz(env, chatId, s);
    case "biz":
      if (!txt) break;
      lead.business = clip(txt, 120);
      s.lead = lead;
      s.step = "budget";
      await putState(env, chatId, s);
      return send(env, chatId, t.askBudget, { reply_markup: kb(t.budgetList.map((b, i) => [btn(b, "bud:" + i)])) });
    case "budget":
      if (!txt) break;
      lead.budget = clip(txt, 60);
      lead.budgetIdx = -1;
      s.lead = lead;
      return askPhone(env, chatId, s);
    case "phone": {
      const raw = (m.contact && m.contact.phone_number) || txt;
      if (digits(raw).length < 7) return send(env, chatId, t.badPhone);
      lead.phone = clip(raw.startsWith("+") || !m.contact ? raw : "+" + raw, 40);
      s.lead = lead;
      s.step = "goal";
      await putState(env, chatId, s);
      return send(env, chatId, t.askGoal, {
        reply_markup: { keyboard: [[{ text: t.btnSkip }]], resize_keyboard: true, one_time_keyboard: true },
      });
    }
    case "goal": {
      if (!txt && !m.contact) break;
      const skip = txt === T.en.btnSkip || txt === T.ar.btnSkip;
      lead.goal = skip ? "" : clip(txt, 600);
      s.lead = lead;
      return finishAudit(env, m, s);
    }
  }

  if (isOwner) return send(env, chatId, "This is your owner chat, so messages here aren't relayed. Send /help for your commands, or /start to see the visitor menu.");
  return relayToOwner(env, m, owner, s);
}

async function startAudit(env, chatId, s) {
  const t = T[s.lang];
  s.step = "svc";
  s.lead = {};
  await putState(env, chatId, s);
  const rows = [];
  for (let i = 0; i < t.serviceList.length; i += 2) {
    rows.push(t.serviceList.slice(i, i + 2).map((x, j) => btn(x, "svc:" + (i + j))));
  }
  return send(env, chatId, t.askService, { reply_markup: kb(rows) });
}

async function askBiz(env, chatId, s) {
  s.step = "biz";
  await putState(env, chatId, s);
  return send(env, chatId, T[s.lang].askBiz, { reply_markup: { force_reply: true, input_field_placeholder: T[s.lang].bizHint } });
}

async function askPhone(env, chatId, s) {
  const t = T[s.lang];
  s.step = "phone";
  await putState(env, chatId, s);
  return send(env, chatId, t.askPhone, {
    reply_markup: {
      keyboard: [[{ text: t.btnShare, request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
      input_field_placeholder: t.phoneHint,
    },
  });
}

async function finishAudit(env, m, s) {
  const t = T[s.lang];
  const f = m.from;
  const name = clip([f.first_name, f.last_name].filter(Boolean).join(" ") || "there", 80);
  const lead = {
    src: "bot",
    name,
    username: f.username || "",
    chatId: m.chat.id,
    business: s.lead.business || "",
    service: s.lead.service || "",
    budget: s.lead.budget || "",
    budgetIdx: s.lead.budgetIdx == null ? -1 : s.lead.budgetIdx,
    phone: s.lead.phone || "",
    goal: s.lead.goal || "",
    lang: s.lang,
  };
  s.step = null;
  s.lead = null;
  await putState(env, m.chat.id, s);
  await send(env, m.chat.id, t.done.replace("{name}", esc(f.first_name || name)), { reply_markup: { remove_keyboard: true } });
  await sendMenu(env, m.chat.id, s.lang, true);
  await saveAndNotify(env, lead);
}

async function relayToOwner(env, m, owner, s) {
  const t = T[s.lang];
  if (!owner) return sendMenu(env, m.chat.id, s.lang);
  const head = await send(
    env,
    owner,
    `💬 <b>Message from</b> ${whoLine(m.from)}\n\n${m.text ? esc(m.text) : "<i>sent this ⤵️</i>"}\n\n<i>↩️ Reply to this message to answer.</i>`
  );
  if (head.ok) await env.BOT.put(`r:${head.result.message_id}`, String(m.chat.id), { expirationTtl: 30 * DAY });
  if (!m.text) {
    const c = await tg(env, "copyMessage", { chat_id: owner, from_chat_id: m.chat.id, message_id: m.message_id });
    if (c.ok) await env.BOT.put(`r:${c.result.message_id}`, String(m.chat.id), { expirationTtl: 30 * DAY });
  }
  const now = Date.now();
  if (!s.ackAt || now - s.ackAt > 10 * 60 * 1000) {
    s.ackAt = now;
    await putState(env, m.chat.id, s);
    await send(env, m.chat.id, t.relayAck);
  }
}

// ---- buttons

async function onCallback(q, env) {
  const data = q.data || "";
  const msg = q.message;
  await tg(env, "answerCallbackQuery", { callback_query_id: q.id });
  if (!msg) return;
  const chatId = msg.chat.id;
  const mid = msg.message_id;

  if (data.startsWith("c:")) return markContacted(env, q, data.slice(2));

  const s = await getState(env, chatId);
  if (!s.lang) s.lang = detectLang(q.from);
  if (data.startsWith("lang:")) {
    s.lang = data.slice(5) === "ar" ? "ar" : "en";
    await putState(env, chatId, s);
    return editMenu(env, chatId, mid, s.lang);
  }
  const t = T[s.lang];

  if (data === "menu") return editMenu(env, chatId, mid, s.lang);
  if (data === "services") return edit(env, chatId, mid, t.services, kb([[btn(t.btnAudit, "audit")], [btn(t.btnMenu, "menu")]]));
  if (data === "work") return edit(env, chatId, mid, t.work, kb([[urlBtn(t.btnSeeWork, SITE + "work.html")], [btn(t.btnAudit, "audit")], [btn(t.btnMenu, "menu")]]));
  if (data === "price") return edit(env, chatId, mid, t.price, kb([[btn(t.btnAudit, "audit")], [btn(t.btnMenu, "menu")]]));
  if (data === "faq") return edit(env, chatId, mid, t.faqTitle, faqKb(t));
  if (data.startsWith("faq:")) {
    const item = t.faq[+data.slice(4)];
    if (!item) return;
    return edit(env, chatId, mid, `<b>${item[0]}</b>\n${item[1]}`, kb([[btn(t.btnAudit, "audit")], [btn(t.btnBackFaq, "faq"), btn(t.btnMenu, "menu")]]));
  }
  if (data === "audit") return startAudit(env, chatId, s);
  if (data.startsWith("svc:")) {
    const v = t.serviceList[+data.slice(4)];
    if (!v || s.step !== "svc") return;
    s.lead = Object.assign(s.lead || {}, { service: v });
    await edit(env, chatId, mid, `${t.askService}\n\n${t.picked} <b>${esc(v)}</b>`, null);
    return askBiz(env, chatId, s);
  }
  if (data.startsWith("bud:")) {
    const i = +data.slice(4);
    const v = t.budgetList[i];
    if (!v || s.step !== "budget") return;
    s.lead = Object.assign(s.lead || {}, { budget: v, budgetIdx: i });
    await edit(env, chatId, mid, `${t.askBudget}\n\n${t.picked} <b>${esc(v)}</b>`, null);
    return askPhone(env, chatId, s);
  }
}

function menuKb(t) {
  return kb([
    [btn(t.btnAudit, "audit")],
    [btn(t.btnServices, "services"), btn(t.btnWork, "work")],
    [btn(t.btnFaq, "faq"), btn(t.btnPrice, "price")],
    [urlBtn(t.btnWa, waLink(WA_NUMBER, t === T.ar ? "مرحباً سبونسيفاي، أريد تدقيقاً مجانياً لنشاطي." : "Hi SPONSIFY, I'd like a free audit for my business."))],
    [btn(t.btnLang, "lang:" + (t === T.ar ? "en" : "ar"))],
  ]);
}

function faqKb(t) {
  return kb([...t.faq.map((f, i) => [btn(f[0], "faq:" + i)]), [btn(t.btnAudit, "audit")], [btn(t.btnMenu, "menu")]]);
}

function sendMenu(env, chatId, lang, short) {
  const t = T[lang];
  return send(env, chatId, short ? t.more : t.welcome, { reply_markup: menuKb(t) });
}

async function editMenu(env, chatId, mid, lang) {
  const t = T[lang];
  const r = await edit(env, chatId, mid, t.welcome, menuKb(t));
  if (!r.ok && !/not modified/i.test(r.description || "")) return sendMenu(env, chatId, lang);
}

// ---------------------------------------------------------------- leads

async function onLead(req, env) {
  const origin = req.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(",").map((x) => x.trim().replace(/\/$/, "")).filter(Boolean);
  const okOrigin = allowed.includes("*") || allowed.includes(origin);
  const cors = {
    "Access-Control-Allow-Origin": okOrigin ? origin || "*" : allowed[0] || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405, cors);
  if (!okOrigin) return json({ ok: false, error: "origin" }, 403, cors);

  let d;
  try {
    d = await req.json();
  } catch {
    return json({ ok: false, error: "json" }, 400, cors);
  }
  if (!d || typeof d !== "object") return json({ ok: false, error: "json" }, 400, cors);
  // Spam traps: a hidden field people never fill, and bots that post instantly.
  if (d.website || !(Number(d.elapsed) >= 1500)) return json({ ok: true }, 200, cors);

  const lead = {
    src: "web",
    name: clip(d.name, 80),
    business: clip(d.business, 120),
    phone: clip(d.phone, 40),
    service: clip(d.service, 60),
    msg: clip(d.msg, 1500),
    lang: d.lang === "ar" ? "ar" : "en",
    page: clip(d.page, 200),
  };
  if (!lead.name || !lead.business || digits(lead.phone).length < 7) return json({ ok: false, error: "invalid" }, 400, cors);

  const ip = req.headers.get("CF-Connecting-IP") || "unknown";
  const rk = `rl:${ip}`;
  const count = Number((await env.BOT.get(rk)) || 0);
  if (count >= 5) return json({ ok: false, error: "rate" }, 429, cors);
  await env.BOT.put(rk, String(count + 1), { expirationTtl: 3600 });

  await saveAndNotify(env, lead);
  return json({ ok: true }, 200, cors);
}

function scoreLead(l) {
  if (l.src !== "bot") return "";
  if (l.budgetIdx >= 2) return "🔥 HOT";
  if (l.budgetIdx === 1 || /website|app|موقع|تطبيق/i.test(l.service)) return "🌤 WARM";
  return "❄️ COLD";
}

async function saveAndNotify(env, lead) {
  lead.t = Date.now();
  lead.score = scoreLead(lead);
  const key = `lead:${String(9e15 - lead.t).padStart(16, "0")}:${Math.random().toString(36).slice(2, 6)}`;
  const meta = { t: lead.t, src: lead.src, n: clip(lead.name, 40), b: clip(lead.business, 50), s: clip(lead.service, 30), bu: clip(lead.budget, 24), p: clip(lead.phone, 24), sc: lead.score };
  try {
    await env.BOT.put(key, JSON.stringify(lead), { expirationTtl: 180 * DAY, metadata: meta });
  } catch (e) {
    console.log("lead save error", e);
    await env.BOT.put(key, JSON.stringify(lead), { expirationTtl: 180 * DAY });
  }

  const owner = await getOwner(env);
  if (!owner) return;
  const r = await send(env, owner, leadText(lead), { reply_markup: leadButtons(lead, key) });
  if (r.ok && lead.chatId) await env.BOT.put(`r:${r.result.message_id}`, String(lead.chatId), { expirationTtl: 30 * DAY });
}

function leadText(l) {
  const head = l.src === "bot" ? `🤖 <b>New lead from the Telegram bot</b>  ${l.score}` : "🌐 <b>New lead from the website</b>";
  const rows = [
    head,
    "",
    `👤 ${esc(l.name)}${l.username ? ` (@${esc(l.username)})` : ""}`,
    `🏢 ${esc(l.business)}`,
    `📱 ${esc(l.phone)}`,
    l.service && `🧩 ${esc(l.service)}`,
    l.budget && `💰 ${esc(l.budget)}`,
    l.goal && `🎯 ${esc(l.goal)}`,
    l.msg && `📝 ${esc(l.msg)}`,
    `🗣 ${l.lang === "ar" ? "Arabic" : "English"} · 🕒 ${fmtTime(l.t)}`,
  ].filter(Boolean);
  if (l.src === "bot") rows.push("", "<i>↩️ Reply to this message to answer them in Telegram.</i>");
  return rows.join("\n");
}

function leadButtons(l, key) {
  const row = [];
  const wa = waDigits(l.phone);
  if (wa) {
    const first = (l.name || "").split(" ")[0];
    row.push(urlBtn("💬 WhatsApp", waLink(wa, WA_PREFILL[l.lang === "ar" ? "ar" : "en"](first, l.business))));
  }
  if (l.username) row.push(urlBtn("✈️ Telegram", "https://t.me/" + l.username));
  const rows = [];
  if (row.length) rows.push(row);
  rows.push([btn("✅ Mark as contacted", "c:" + key.slice(5))]);
  return kb(rows);
}

async function markContacted(env, q, suffix) {
  const owner = await getOwner(env);
  const msg = q.message;
  if (!owner || String(msg.chat.id) !== String(owner)) return;
  const key = "lead:" + suffix;
  const { value, metadata } = await env.BOT.getWithMetadata(key);
  const who = q.from.first_name || "you";
  if (value) {
    const meta = Object.assign({}, metadata || {}, { c: clip(who, 20) });
    await env.BOT.put(key, value, { expirationTtl: 180 * DAY, metadata: meta });
  }
  const stamp = `\n\n✅ Contacted by ${who} · ${fmtTime(Date.now())}`;
  const keep = ((msg.reply_markup && msg.reply_markup.inline_keyboard) || [])
    .map((r) => r.filter((b) => !b.callback_data))
    .filter((r) => r.length);
  await tg(env, "editMessageText", {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    text: (msg.text || "") + stamp,
    entities: msg.entities || [],
    link_preview_options: { is_disabled: true },
    reply_markup: { inline_keyboard: keep },
  });
}

async function leadsList(env) {
  const res = await env.BOT.list({ prefix: "lead:", limit: 10 });
  if (!res.keys.length) return "No leads yet. They'll show up here the moment someone fills the form or finishes the bot audit.";
  const lines = res.keys.map((k, i) => {
    const m = k.metadata || {};
    const src = m.src === "bot" ? "🤖" : "🌐";
    const done = m.c ? " ✅" : "";
    return `${i + 1}. ${src} <b>${esc(m.n || "?")}</b> · ${esc(m.b || "")}${m.sc ? " " + m.sc : ""}${done}\n    ${esc(m.p || "")}${m.s ? " · " + esc(m.s) : ""}${m.bu ? " · " + esc(m.bu) : ""} · ${m.t ? fmtTime(m.t) : ""}`;
  });
  return `🗂 <b>Last ${res.keys.length} leads</b>  (🌐 website · 🤖 bot · ✅ contacted)\n\n${lines.join("\n")}`;
}

async function leadsDigest(env) {
  const todayStart = dohaMidnight(Date.now());
  const yStart = todayStart - DAY * 1000;
  const res = await env.BOT.list({ prefix: "lead:", limit: 200 });
  const y = res.keys.map((k) => k.metadata || {}).filter((m) => m.t >= yStart && m.t < todayStart);
  const open = res.keys.map((k) => k.metadata || {}).filter((m) => m.t >= todayStart - 7 * DAY * 1000 && !m.c).length;
  const web = y.filter((m) => m.src === "web").length;
  const bot = y.length - web;
  return (
    `☀️ <b>Good morning!</b>\n\n🧲 Leads yesterday: <b>${y.length}</b>${y.length ? ` (🌐 website ${web} · 🤖 bot ${bot})` : ""}` +
    (open ? `\n⏳ Not marked contacted (last 7 days): <b>${open}</b>. Send /leads` : "")
  );
}

// ---------------------------------------------------------------- Meta ads

const RESULT_TYPES = [
  ["purchase", "purchases"],
  ["offsite_conversion.fb_pixel_purchase", "purchases"],
  ["lead", "leads"],
  ["onsite_conversion.lead_grouped", "leads"],
  ["offsite_conversion.fb_pixel_lead", "leads"],
  ["onsite_conversion.messaging_conversation_started_7d", "chats"],
  ["complete_registration", "sign-ups"],
];

const ACCOUNT_STATUS = { 2: "DISABLED", 3: "UNSETTLED (payment problem)", 7: "PENDING RISK REVIEW", 8: "PENDING SETTLEMENT", 9: "IN GRACE PERIOD (payment due)", 100: "PENDING CLOSURE", 101: "CLOSED" };

const PRESET_LABEL = { yesterday: "Yesterday", today: "Today so far", last_7d: "Last 7 days" };

function metaReady(env) {
  return Boolean(env.META_ACCESS_TOKEN && accountIds(env).length);
}

function accountIds(env) {
  return String(env.META_AD_ACCOUNT_IDS || "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((x) => (x.startsWith("act_") ? x : "act_" + x));
}

async function graph(env, path, params) {
  const v = env.META_API_VERSION || "v24.0";
  const qs = new URLSearchParams(params || {}).toString();
  const r = await fetch(`https://graph.facebook.com/${v}/${path}${qs ? "?" + qs : ""}`, {
    headers: { Authorization: `Bearer ${env.META_ACCESS_TOKEN}` },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error((j.error && j.error.message) || `HTTP ${r.status}`);
  return j;
}

function pickResult(row, env) {
  const acts = row.actions || [];
  const list = env.RESULT_ACTIONS
    ? String(env.RESULT_ACTIONS).split(",").map((x) => [x.trim(), "results"])
    : RESULT_TYPES;
  for (const [type, label] of list) {
    const a = acts.find((x) => x.action_type === type);
    if (a && Number(a.value) > 0) return { n: Number(a.value), label };
  }
  return { n: 0, label: "results" };
}

function revenue(row) {
  const vals = row.action_values || [];
  for (const type of ["purchase", "omni_purchase", "offsite_conversion.fb_pixel_purchase"]) {
    const v = vals.find((x) => x.action_type === type);
    if (v) return Number(v.value) || 0;
  }
  return 0;
}

function threshold(raw, accountId) {
  if (!raw) return 0;
  const s = String(raw).trim();
  if (!s.includes(":")) return Number(s) || 0;
  for (const part of s.split(",")) {
    const [id, val] = part.split(":").map((x) => x.trim());
    if (id && (id === accountId || "act_" + id === accountId)) return Number(val) || 0;
  }
  return 0;
}

function num(raw, dflt) {
  if (raw === undefined || raw === null || raw === "") return dflt;
  const n = Number(raw);
  return Number.isFinite(n) ? n : dflt;
}

async function adsReport(env, preset, opts) {
  const alertsOnly = Boolean(opts && opts.alertsOnly);
  const out = [];
  for (const id of accountIds(env)) {
    try {
      const [acc, ins] = await Promise.all([
        graph(env, id, { fields: "name,currency,account_status" }),
        graph(env, `${id}/insights`, {
          level: "campaign",
          date_preset: preset,
          limit: "200",
          fields: "campaign_name,spend,impressions,clicks,ctr,cpc,cpm,frequency,actions,action_values",
        }),
      ]);
      const rows = (ins.data || []).filter((r) => Number(r.spend) > 0);
      const alerts = adAlerts(env, id, acc, rows, preset);
      if (alertsOnly) {
        if (alerts.length) out.push(`🚨 <b>${esc(acc.name || id)}</b> · ${PRESET_LABEL[preset]}\n\n${alerts.join("\n")}`);
        continue;
      }
      out.push(accountReport(env, acc, id, rows, preset, alerts));
    } catch (e) {
      out.push(`⚠️ <b>${esc(id)}</b>: couldn't read ads. ${esc(e.message || e)}${/token|session|OAuth/i.test(String(e.message)) ? "\nYour Meta token may have expired: make a new one and update META_ACCESS_TOKEN." : ""}`);
    }
  }
  return out;
}

function accountReport(env, acc, id, rows, preset, alerts) {
  const cur = acc.currency || "QAR";
  const tot = { spend: 0, imp: 0, clicks: 0, rev: 0, revSpend: 0 };
  const byLabel = {};
  for (const r of rows) {
    const sp = Number(r.spend) || 0;
    tot.spend += sp;
    tot.imp += Number(r.impressions) || 0;
    tot.clicks += Number(r.clicks) || 0;
    const rv = revenue(r);
    tot.rev += rv;
    if (rv > 0) tot.revSpend += sp; // ROAS only over campaigns that track sales
    const res = pickResult(r, env);
    if (res.n > 0) {
      byLabel[res.label] = byLabel[res.label] || { n: 0, spend: 0 };
      byLabel[res.label].n += res.n;
      byLabel[res.label].spend += sp;
    }
  }
  const lines = [`📊 <b>${esc(acc.name || id)}</b> · ${PRESET_LABEL[preset]}`, ""];
  if (!rows.length) {
    lines.push("No spend in this period.");
  } else {
    lines.push(`💸 Spend: <b>${money(tot.spend, cur)}</b>`);
    const res = Object.entries(byLabel).map(([label, v]) => `${fmtNum(v.n)} ${label} (${money(v.spend / v.n, cur)} each)`);
    lines.push(`🎯 Results: <b>${res.length ? res.join(" · ") : "0"}</b>`);
    if (tot.rev > 0) lines.push(`🛒 Revenue: ${money(tot.rev, cur)} · ROAS <b>${(tot.rev / tot.revSpend).toFixed(2)}x</b> (sales campaigns)`);
    const ctr = tot.imp ? (tot.clicks / tot.imp) * 100 : 0;
    lines.push(`👆 CTR ${ctr.toFixed(2)}% · CPC ${money(tot.clicks ? tot.spend / tot.clicks : 0, cur)} · CPM ${money(tot.imp ? (tot.spend / tot.imp) * 1000 : 0, cur)}`);
    lines.push("", "<b>Campaigns</b>");
    const sorted = rows.slice().sort((a, b) => Number(b.spend) - Number(a.spend));
    sorted.slice(0, 8).forEach((r, i) => {
      const sp = Number(r.spend) || 0;
      const res = pickResult(r, env);
      const cpa = res.n ? ` · ${money(sp / res.n, cur)} each` : "";
      const roas = revenue(r) > 0 ? ` · ROAS ${(revenue(r) / sp).toFixed(2)}x` : "";
      lines.push(`${i + 1}. ${esc(clip(r.campaign_name, 48))}\n    ${money(sp, cur)} · ${fmtNum(res.n)} ${res.label}${cpa}${roas}`);
    });
    if (sorted.length > 8) lines.push(`…and ${sorted.length - 8} more`);
  }
  if (alerts.length) lines.push("", "<b>⚠️ Alerts</b>", ...alerts);
  return lines.join("\n");
}

function adAlerts(env, id, acc, rows, preset) {
  const cur = acc.currency || "QAR";
  const out = [];
  if (acc.account_status && acc.account_status !== 1) out.push(`⛔ Account status: <b>${ACCOUNT_STATUS[acc.account_status] || acc.account_status}</b>. Ads may not be delivering.`);
  const maxCpa = threshold(env.ALERT_MAX_CPA, id);
  const minRoas = threshold(env.ALERT_MIN_ROAS, id);
  const minCtr = num(env.ALERT_MIN_CTR, 0.8);
  const maxFreq = num(env.ALERT_MAX_FREQ, 3.5);
  const zeroSpend = num(env.ALERT_ZERO_RESULT_SPEND, 100);
  for (const r of rows) {
    const sp = Number(r.spend) || 0;
    const name = esc(clip(r.campaign_name, 48));
    const res = pickResult(r, env);
    if (res.n === 0 && zeroSpend && sp >= zeroSpend) out.push(`🚨 <b>${name}</b>: spent ${money(sp, cur)} with 0 results.`);
    if (maxCpa && res.n > 0 && sp / res.n > maxCpa) out.push(`📈 <b>${name}</b>: ${money(sp / res.n, cur)} per ${res.label.replace(/s$/, "")}, above your ${money(maxCpa, cur)} limit.`);
    const rev = revenue(r);
    if (minRoas && rev > 0 && rev / sp < minRoas) out.push(`📉 <b>${name}</b>: ROAS ${(rev / sp).toFixed(2)}x, under your ${minRoas}x target.`);
    if (minCtr && Number(r.impressions) >= 1000 && Number(r.ctr) < minCtr) out.push(`👀 <b>${name}</b>: CTR ${Number(r.ctr).toFixed(2)}%, under ${minCtr}%. Test new hooks or creatives.`);
    if (preset === "last_7d" && maxFreq && Number(r.frequency) > maxFreq) out.push(`🔁 <b>${name}</b>: frequency ${Number(r.frequency).toFixed(1)}. People are seeing the same ads too often, so refresh the creatives.`);
  }
  return out;
}

// ---------------------------------------------------------------- cron

async function onCron(event, env) {
  const owner = await getOwner(env);
  if (!owner) return;
  const when = new Date(event.scheduledTime || Date.now());
  const morning = when.getUTCHours() < 10; // first run of the day = report, later runs = alert check
  const msgs = [];
  if (morning) {
    msgs.push(await leadsDigest(env));
    if (metaReady(env)) {
      msgs.push(...(await adsReport(env, "yesterday")));
      if (when.getUTCDay() === 0) msgs.push(...(await adsReport(env, "last_7d"))); // Sunday: start of the Qatar work week
    }
  } else if (metaReady(env)) {
    msgs.push(...(await adsReport(env, "today", { alertsOnly: true })));
  }
  for (const s of msgs) await sendLong(env, owner, s);
}

// ---------------------------------------------------------------- helpers

async function tg(env, method, payload) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json().catch(() => ({ ok: false, description: `HTTP ${r.status}` }));
    if (!j.ok && !/not modified/i.test(j.description || "")) console.log(`telegram ${method} failed:`, j.description);
    return j;
  } catch (e) {
    console.log(`telegram ${method} error:`, e);
    return { ok: false, description: String(e) };
  }
}

function send(env, chatId, html, extra) {
  return tg(env, "sendMessage", Object.assign({ chat_id: chatId, text: html, parse_mode: "HTML", link_preview_options: { is_disabled: true } }, extra || {}));
}

function edit(env, chatId, mid, html, markup) {
  return tg(env, "editMessageText", {
    chat_id: chatId,
    message_id: mid,
    text: html,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    reply_markup: markup || { inline_keyboard: [] },
  });
}

async function sendLong(env, chatId, html) {
  if (html.length <= 3900) return send(env, chatId, html);
  let chunk = "";
  for (const line of html.split("\n")) {
    if (chunk.length + line.length + 1 > 3900) {
      await send(env, chatId, chunk);
      chunk = "";
    }
    chunk += (chunk ? "\n" : "") + line;
  }
  if (chunk) await send(env, chatId, chunk);
}

const kb = (rows) => ({ inline_keyboard: rows });
const btn = (label, data) => ({ text: label, callback_data: data });
const urlBtn = (label, url) => ({ text: label, url });

async function getOwner(env) {
  if (env.OWNER_CHAT_ID) return String(env.OWNER_CHAT_ID);
  return env.BOT ? env.BOT.get("owner") : null;
}

async function getState(env, chatId) {
  const raw = await env.BOT.get(`u:${chatId}`);
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function putState(env, chatId, s) {
  return env.BOT.put(`u:${chatId}`, JSON.stringify(s), { expirationTtl: 30 * DAY });
}

function detectLang(from) {
  return from && String(from.language_code || "").startsWith("ar") ? "ar" : "en";
}

function whoLine(f) {
  const name = esc([f.first_name, f.last_name].filter(Boolean).join(" ") || "Someone");
  return f.username ? `${name} (@${esc(f.username)})` : name;
}

async function webhookSecret(env) {
  const data = new TextEncoder().encode(`${env.TELEGRAM_BOT_TOKEN}:sponsify-webhook`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 48);
}

function safeEqual(a, b) {
  a = String(a);
  b = String(b);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clip(s, n) {
  return String(s == null ? "" : s).trim().slice(0, n);
}

function digits(s) {
  return String(s || "").replace(/\D/g, "");
}

function waDigits(phone) {
  let d = digits(phone).replace(/^00/, "");
  if (d.length === 8) d = "974" + d; // local Qatar number
  return d.length >= 8 ? d : "";
}

function waLink(number, msg) {
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

function fmtNum(n) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: n < 10 && n % 1 ? 1 : 0 }).format(n);
}

function money(n, cur) {
  const v = Number(n) || 0;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: v >= 100 ? 0 : 2, minimumFractionDigits: v >= 100 ? 0 : 2 }).format(v)} ${cur}`;
}

function fmtTime(ms) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(ms));
}

function dohaMidnight(ms) {
  const offset = 3 * 3600 * 1000; // Qatar is UTC+3 all year
  return Math.floor((ms + offset) / (DAY * 1000)) * DAY * 1000 - offset;
}

function text(body, status) {
  return new Response(body, { status: status || 200, headers: { "content-type": "text/plain; charset=utf-8" } });
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({ "content-type": "application/json" }, headers || {}) });
}
