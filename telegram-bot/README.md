# SPONSIFY Telegram bot

One small Cloudflare Worker (free plan is enough) that does three jobs:

| Job | What you get in Telegram |
|---|---|
| **🧠 AI assistant (Claude)** | Chat with your bot like you chat with Claude: ad copy, hooks, captions, reel scripts, campaign plans, client replies, competitor research (it searches the web). Send a photo of an ad and you get a score out of 10 with fixes and rewritten copy. Works in Arabic, English and French, remembers the conversation (`/new` starts fresh), and only works in your chat, never for strangers. |
| **Website leads** | Every "Free audit" form on the site arrives instantly, with a **WhatsApp** button that opens a ready-written reply in Arabic or English, plus **Mark as contacted**. |
| **Chat bot** | Visitors get a menu in Arabic or English: free audit booking (service → business → budget → WhatsApp → goal), services, work, FAQ and prices. Each booking reaches you scored 🔥 HOT / 🌤 WARM / ❄️ COLD. Anything else they type is forwarded to you. **Reply to it and the bot sends your answer back**, including text, photos and voice notes. |
| **Meta ads** | 9:00 Doha: yesterday's leads + an ads report for each account (spend, results, cost per result, ROAS, CTR, CPC, CPM, top campaigns), plus a 7-day report every Sunday. 16:00 Doha: an alert only if something is wrong, such as spend with 0 results, CPA over your limit, ROAS under target, low CTR, high frequency or a payment problem on the account. |

Your commands: `/new` `/usage` `/leads` `/ads` `/today` `/week` `/alerts` `/help`. Anything else you type goes to the AI.

> 🔒 The bot token is never in this repo or the website. It lives only in Cloudflare as a secret.

---

## Setup (about 10 minutes, no coding)

### 1. Create the Worker
1. Sign up / log in at **dash.cloudflare.com**.
2. **Workers & Pages → Create → Create Worker**. Name it `sponsify-bot` → **Deploy**.
3. Click **Edit code**, delete everything, paste the whole of [`worker.js`](worker.js) → **Deploy**.

### 2. Add storage
1. **Storage & Databases → KV → Create** a namespace called `sponsify-bot`.
2. Back in the Worker: **Settings → Bindings → Add → KV namespace**. Variable name: `BOT`. Pick the namespace you just made.

### 3. Add your secrets
Worker → **Settings → Variables and Secrets → Add** (type **Secret**):

| Name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | your token from @BotFather |
| `ADMIN_KEY` | any long password you invent, e.g. `sponsify-7Kq9-xT2m-Doha` |
| `ANTHROPIC_API_KEY` | your Claude API key (step 7) |

### 4. Turn on the daily reports
Worker → **Settings → Triggers → Cron Triggers → Add**:
- `0 6 * * *` (9:00 Doha: morning report)
- `0 13 * * *` (16:00 Doha: alert check)

### 5. Connect the bot
Open this in your browser (use your own worker address and admin key):

```
https://sponsify-bot.YOUR-NAME.workers.dev/setup?key=YOUR_ADMIN_KEY
```

It should say **✅ Bot @yourbot is connected**. Then in Telegram, open your bot and send:

```
/claim YOUR_ADMIN_KEY
```

The bot deletes that message (so the key doesn't stay in the chat), and from then on this chat gets everything.
**Team tip:** send `/claim` inside a Telegram group instead, and your whole team sees the leads and can reply.

### 6. Connect the website form
In `index.html`, find `data-endpoint=""` on the form and put your worker address + `/lead`:

```html
<form id="f" data-sc-in data-endpoint="https://sponsify-bot.YOUR-NAME.workers.dev/lead">
```

Until you do this, the form keeps working the old way (opens the visitor's email app). If the bot is ever down, it falls back to email too, so you never lose a lead.
Moving to your own domain later? Add it in Worker → Variables: `ALLOWED_ORIGINS` = `https://alieeb.github.io,https://www.yourdomain.com`.

### 7. Turn on the AI (Claude)
The AI uses the Claude API. It is **separate from a Claude.ai subscription** and you pay per message.
1. Go to **console.anthropic.com** and sign up.
2. **Billing → add credit** (start with $10).
3. **API keys → Create key** → copy it.
4. Worker → **Settings → Variables and Secrets → Add** (type **Secret**): `ANTHROPIC_API_KEY` = that key.
5. Send any message to your bot. Send `/usage` to see what today cost.

**Cost:** about 2 to 6 US cents per message on the default model (Claude Opus 5.5), a little more with photos or web search.

Optional settings (Worker → Variables):

| Variable | Example | Meaning |
|---|---|---|
| `AI_CONTEXT` | `Clients: Kaza Store (perfume, luxury tone)...` | private notes the AI always knows: clients, brand voices, your prices. Kept in Cloudflare, not in this public code. |
| `CLAUDE_MODEL` | `claude-sonnet-5-5` | a cheaper model (about half the price) |
| `AI_EFFORT` | `low` / `medium` / `high` | how hard it thinks: `low` is faster and cheaper, `high` is deeper. Default `medium`. |
| `AI_WEB_SEARCH` | `off` | turn off web search |

### 8. (Optional) Meta ads reports
1. **business.facebook.com → Settings → Users → System users → Add** (Admin).
2. **Assign assets** → your ad accounts (and clients' accounts you manage) → *View performance*.
3. **Generate new token** → choose your app → tick **`ads_read`** → token expiration **Never**.
4. In the Worker add:
   - Secret `META_ACCESS_TOKEN` = that token
   - Variable `META_AD_ACCOUNT_IDS` = `act_1234567890,act_9876543210` (Ads Manager → account dropdown shows the IDs)
5. Send `/ads` to the bot to test.

**Your alert limits** (Worker → Variables, all optional):

| Variable | Example | Meaning |
|---|---|---|
| `ALERT_MAX_CPA` | `50` or `act_123:40,act_456:120` | alert when cost per result is above this (one limit for all, or per client) |
| `ALERT_MIN_ROAS` | `3` or `act_123:4` | alert when ROAS on sales campaigns drops under this |
| `ALERT_MIN_CTR` | `0.8` | alert when CTR % is under this (after 1,000 impressions) |
| `ALERT_MAX_FREQ` | `3.5` | creative fatigue warning on the 7-day report |
| `ALERT_ZERO_RESULT_SPEND` | `100` | alert when a campaign spends this much with 0 results |

"Results" are picked per campaign in this order: purchases → leads → WhatsApp/Messenger chats → sign-ups.

---

## Free plan limits
Cloudflare Workers free: 100,000 requests/day. KV free: 1,000 writes/day. Each bot step or lead uses one write, which is plenty for an agency.

## Deploying with the CLI instead (optional)
```
cd telegram-bot
npx wrangler kv namespace create BOT     # paste the id into wrangler.toml
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put ADMIN_KEY
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```
Then do steps 5 and 6.
