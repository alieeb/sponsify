/* SPONSIFY homepage: nav state, reel sound toggle, scroll reveals. */
(function () {
  var nav = document.getElementById("nav");
  function onScroll() { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var reel = document.getElementById("reel"), um = document.getElementById("unmute");
  if (reel && um) um.addEventListener("click", function () {
    reel.muted = !reel.muted;
    if (!reel.muted) reel.play().catch(function () {});
    um.setAttribute("aria-pressed", String(!reel.muted));
    var ar = document.documentElement.lang === "ar", label = um.querySelector("span");
    label.textContent = reel.muted ? (ar ? "تشغيل الصوت" : "Unmute") : (ar ? "كتم الصوت" : "Mute");
  });

  var rv = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window)) { rv.forEach(function (el) { el.classList.add("is-in"); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  rv.forEach(function (el) { io.observe(el); });
})();
