/* SPONSIFY shared site script: language switch, WhatsApp, forms, spotlight, work filters, lightbox. */
(function () {
  if (window.ScrollCraft) ScrollCraft.mount(document.body);

  var WA_NUMBER = "97433029577";
  var html = document.documentElement;
  var btn = document.getElementById("lang");

  // ---- language switch (remembered across pages) ----
  function setLang(l) {
    html.lang = l;
    html.dir = l === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-" + l + "]").forEach(function (el) { el.innerHTML = el.getAttribute("data-" + l); });
    document.querySelectorAll("[data-ph-" + l + "]").forEach(function (el) { el.placeholder = el.getAttribute("data-ph-" + l); });
    document.querySelectorAll("[data-aria-" + l + "]").forEach(function (el) { el.setAttribute("aria-label", el.getAttribute("data-aria-" + l)); });
    if (btn) btn.textContent = l === "ar" ? "English" : "العربية";
    var wa = document.querySelector(".wa-float");
    if (wa) wa.href = waLink(l);
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  function waLink(l) {
    var msg = l === "ar" ? "مرحباً سبونسيفاي، أريد تدقيقاً مجانياً لنشاطي." : "Hi SPONSIFY, I'd like a free audit for my business.";
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  }
  if (btn) btn.addEventListener("click", function () { setLang(html.lang === "ar" ? "en" : "ar"); });
  var saved = "en";
  try { saved = localStorage.getItem("lang") || "en"; } catch (e) {}
  setLang(saved);

  // ---- contact form: opens the visitor's email app ----
  var form = document.getElementById("f");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = Object.fromEntries(new FormData(form));
    var body = "Name: " + d.name + "\nBusiness: " + d.business + "\nPhone: " + d.phone + "\nService: " + d.service + "\n\n" + d.msg;
    location.href = "mailto:aliboussella@gmail.com?subject=" + encodeURIComponent("Free audit request - " + d.business) + "&body=" + encodeURIComponent(body);
  });

  // ---- spotlight follows the pointer on cards ----
  document.addEventListener("pointermove", function (e) {
    var c = e.target.closest && e.target.closest(".svc,.step,.client");
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px");
    c.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  // ---- work page: category tabs ----
  var tabs = document.querySelectorAll("[data-tab]");
  var items = document.querySelectorAll(".work__item");
  function showTab(f) {
    tabs.forEach(function (t) { var on = t.getAttribute("data-tab") === f; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", on); });
    items.forEach(function (i) { i.hidden = !(f === "all" || i.getAttribute("data-cat") === f); });
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { showTab(t.getAttribute("data-tab")); history.replaceState(null, "", "#" + t.getAttribute("data-tab")); }); });
  if (tabs.length) {
    var h = location.hash.slice(1);
    showTab(document.querySelector('[data-tab="' + h + '"]') ? h : "all");
  }

  // ---- video cards: play while hovered or in view (muted previews) ----
  var vids = document.querySelectorAll(".work__item video");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { var v = en.target; if (en.isIntersecting) { v.play().catch(function () {}); } else { v.pause(); } });
    }, { threshold: 0.5 });
    vids.forEach(function (v) { io.observe(v); });
  }

  // ---- negative CTA: a playful second chance ----
  var toast = document.getElementById("toast"), toastT;
  function showToast(htmlStr) {
    if (!toast) return;
    toast.innerHTML = htmlStr; toast.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("is-on"); }, 5000);
  }
  document.querySelectorAll(".nope").forEach(function (b) {
    b.addEventListener("click", function () {
      var ar = html.lang === "ar";
      showToast(ar
        ? 'خطوة جريئة. منافسوك يشكرونك. <a href="' + waLink("ar") + '" target="_blank" rel="noopener">غيّرت رأيك؟ راسلنا</a>'
        : 'Bold move. Your competitors say thanks. <a href="' + waLink("en") + '" target="_blank" rel="noopener">Changed your mind? WhatsApp us</a>');
    });
  });

  // ---- creative playground: image trail that follows the cursor or finger ----
  var trail = document.getElementById("playground");
  if (trail) {
    var srcs = (trail.getAttribute("data-imgs") || "").split(",").filter(Boolean);
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var idx = 0, last = null, lastUser = 0, visible = false;
    srcs.forEach(function (u) { var i = new Image(); i.src = u; }); // warm the cache
    function spawn(x, y) {
      var img = document.createElement("img");
      img.className = "trail__img"; img.src = srcs[idx++ % srcs.length]; img.alt = "";
      img.style.left = x + "px"; img.style.top = y + "px";
      img.style.rotate = (Math.random() * 16 - 8).toFixed(1) + "deg";
      trail.appendChild(img);
      setTimeout(function () { img.remove(); }, 1300);
    }
    function move(x, y) {
      if (!last || Math.hypot(x - last.x, y - last.y) > 90) { spawn(x, y); last = { x: x, y: y }; }
    }
    trail.addEventListener("pointermove", function (e) {
      var r = trail.getBoundingClientRect(); lastUser = performance.now(); move(e.clientX - r.left, e.clientY - r.top);
    });
    if (reduce) {
      // calm fallback: a still fan of five pieces
      [[30, 50, -8], [42, 46, -3], [50, 52, 2], [58, 47, 6], [70, 51, 10]].forEach(function (p, i) {
        var img = document.createElement("img"); img.className = "trail__img"; img.src = srcs[i % srcs.length]; img.alt = "";
        img.style.cssText = "left:" + p[0] + "%;top:" + p[1] + "%;rotate:" + p[2] + "deg;animation:none;opacity:.9";
        trail.appendChild(img);
      });
    } else {
      // idle demo: when nobody is touching it, the trail draws a loop by itself
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.3 }).observe(trail);
      (function tick(t) {
        if (visible && t - lastUser > 2500) {
          var w = trail.clientWidth, h = trail.clientHeight, k = t / 1600;
          move(w / 2 + Math.sin(k) * w * 0.34, h / 2 + Math.sin(k * 2) * h * 0.26);
        }
        requestAnimationFrame(tick);
      })(0);
    }
  }

  // ---- lightbox for images and videos ----
  var lb = document.getElementById("lb");
  if (lb) {
    var stage = lb.querySelector(".lb__stage");
    function close() { lb.classList.remove("is-open"); stage.innerHTML = ""; }
    items.forEach(function (i) {
      i.addEventListener("click", function () {
        var src = i.getAttribute("data-full");
        if (/\.mp4$/.test(src)) {
          stage.innerHTML = '<video src="' + src + '" controls autoplay playsinline poster="' + (i.getAttribute("data-poster") || "") + '"></video>';
        } else {
          stage.innerHTML = '<img src="' + src + '" alt="">';
          stage.querySelector("img").alt = i.getAttribute("aria-label") || "";
        }
        lb.classList.add("is-open");
      });
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lb__x")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
})();
