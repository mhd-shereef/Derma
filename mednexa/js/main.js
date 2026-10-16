/* MedNexa — interactions: theme, nav, reveals, nexus canvas, BMI, pricing, FAQ, forms. No dependencies. */
(function () {
  "use strict";
  const CFG = window.MEDNEXA || {};
  const root = document.documentElement;

  /* ---------- Theme (light/dark) ---------- */
  const themeBtns = document.querySelectorAll("[data-theme-toggle]");
  const saved = (() => { try { return localStorage.getItem("mednexa-theme"); } catch { return null; } })();
  const initial =
    saved || CFG?.theme?.defaultMode ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.setAttribute("data-theme", initial);
  const syncThemeLabel = () =>
    themeBtns.forEach((b) => {
      const dark = root.getAttribute("data-theme") === "dark";
      b.setAttribute("aria-pressed", String(dark));
      const label = b.querySelector(".theme-label");
      if (label) label.textContent = dark ? "Light" : "Dark";
    });
  syncThemeLabel();
  themeBtns.forEach((b) =>
    b.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mednexa-theme", next); } catch {}
      syncThemeLabel();
      paintStaticNexus(); // repaint motif for new theme
    })
  );

  /* ---------- Mobile nav ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Footer year + config copy ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  document.querySelectorAll("[data-disclaimer]").forEach(
    (el) => (el.textContent = CFG?.copy?.diagnoxDisclaimer || el.textContent)
  );

  /* ---------- Scroll reveals ---------- */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- "The nexus" animated network ---------- */
  const canvas = document.getElementById("nexus-canvas");
  let nodes = [], raf = null;
  function themeColors() {
    const dark = root.getAttribute("data-theme") === "dark";
    return {
      line: dark ? CFG?.motif?.lineColorDark : CFG?.motif?.lineColorLight,
      node: CFG?.motif?.nodeColor || "#ff4d3d",
    };
  }
  function seedNodes() {
    if (!canvas) return;
    const w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    const h = (canvas.height = canvas.offsetHeight * devicePixelRatio);
    const isMobile = canvas.offsetWidth < 760;
    const n = isMobile ? CFG?.motif?.nodeCountMobile ?? 34 : CFG?.motif?.nodeCountDesktop ?? 70;
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * (CFG?.motif?.driftSpeed ?? 0.22) * devicePixelRatio,
      vy: (Math.random() - 0.5) * (CFG?.motif?.driftSpeed ?? 0.22) * devicePixelRatio,
      r: (Math.random() * 1.6 + 1) * devicePixelRatio,
      hub: Math.random() < 0.12, // a few larger "vein junctions"
    }));
  }
  function paintStaticNexus() {
    if (!canvas) return;
    seedNodes();
    drawFrame(true);
    if (!reduceMotion) restartLoop();
  }
  function drawFrame(staticOnly) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const { line, node } = themeColors();
    const maxD = (CFG?.motif?.linkDistance ?? 130) * devicePixelRatio;
    ctx.clearRect(0, 0, w, h);
    // links — vein-like: only nearest pairs, thin lines
    ctx.strokeStyle = line; ctx.lineWidth = 1 * devicePixelRatio;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < maxD) {
          ctx.globalAlpha = 1 - d / maxD;
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    // nodes
    nodes.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = p.hub ? node : line;
      ctx.arc(p.x, p.y, p.hub ? p.r * 2.2 : p.r, 0, Math.PI * 2);
      ctx.fill();
      if (p.hub) { // halo ring on hubs
        ctx.beginPath(); ctx.strokeStyle = node; ctx.globalAlpha = 0.5;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      }
    });
    if (!staticOnly) {
      nodes.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });
    }
  }
  function restartLoop() {
    cancelAnimationFrame(raf);
    if (reduceMotion) return;
    const loop = () => { drawFrame(false); raf = requestAnimationFrame(loop); };
    loop();
  }
  if (canvas) {
    seedNodes();
    if (reduceMotion) drawFrame(true); else restartLoop();
    let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(paintStaticNexus, 200); });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion) restartLoop();
    });
  }

  /* ---------- BMI calculator ---------- */
  const bmiForm = document.getElementById("bmi-form");
  if (bmiForm) {
    const hEl = document.getElementById("bmi-height");
    const wEl = document.getElementById("bmi-weight");
    const out = document.getElementById("bmi-value");
    const cat = document.getElementById("bmi-cat");
    const note = document.getElementById("bmi-note");
    const bands = [...document.querySelectorAll(".bmi-scale span")];
    bmiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const h = parseFloat(hEl.value), w = parseFloat(wEl.value);
      const err = document.getElementById("bmi-error");
      if (!h || !w || h < 50 || h > 250 || w < 10 || w > 400) {
        err.textContent = "Enter a height (50–250 cm) and weight (10–400 kg).";
        return;
      }
      err.textContent = "";
      const bmi = w / Math.pow(h / 100, 2);
      out.textContent = bmi.toFixed(1);
      let label = "", idx = 0;
      if (bmi < 18.5) { label = "Below range"; idx = 0; }
      else if (bmi < 25) { label = "Healthy range"; idx = 1; }
      else if (bmi < 30) { label = "Above range"; idx = 2; }
      else { label = "Well above range"; idx = 3; }
      cat.textContent = label;
      note.textContent = "BMI is a general screening signal only — it does not assess body composition or health on its own.";
      bands.forEach((s, i) => s.classList.toggle("on", i === idx));
    });
  }

  /* ---------- Pricing toggle ---------- */
  const billBtns = document.querySelectorAll("[data-billing]");
  const priceEls = document.querySelectorAll("[data-price]");
  const perEls = document.querySelectorAll("[data-per]");
  function setBilling(mode) {
    billBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.billing === mode)));
    priceEls.forEach((el) => {
      const key = el.dataset.price; // e.g. "diagnox"
      const plan = CFG?.pricing?.[key];
      if (!plan) return;
      el.textContent = "$" + (mode === "yearly" ? plan.yearly : plan.monthly);
    });
    perEls.forEach((el) => {
      el.textContent = mode === "yearly" ? "per year, billed annually" : "per month, billed monthly";
    });
    document.querySelectorAll("[data-save-note]").forEach((el) => {
      el.style.visibility = mode === "yearly" ? "visible" : "hidden";
    });
    try { localStorage.setItem("mednexa-billing", mode); } catch {}
  }
  if (billBtns.length) {
    let savedBill = "monthly";
    try { savedBill = localStorage.getItem("mednexa-billing") || "monthly"; } catch {}
    setBilling(savedBill);
    billBtns.forEach((b) => b.addEventListener("click", () => setBilling(b.dataset.billing)));
  }

  /* ---------- FAQ accordion (keyboard-friendly buttons) ---------- */
  document.querySelectorAll(".faq-item > button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Demo / contact form (front-end validation + placeholder submit) ---------- */
  const demoForm = document.getElementById("demo-form");
  if (demoForm) {
    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      demoForm.querySelectorAll("[required]").forEach((f) => {
        const err = document.getElementById(f.id + "-error");
        const bad = !f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        if (err) err.textContent = bad ? "This field needs attention." : "";
        f.setAttribute("aria-invalid", String(bad));
        if (bad) ok = false;
      });
      if (!ok) { demoForm.querySelector("[aria-invalid='true']").focus(); return; }
      document.getElementById("demo-success").classList.add("show");
      demoForm.reset();
      document.getElementById("demo-success").setAttribute("tabindex", "-1");
      document.getElementById("demo-success").focus({ preventScroll: false });
    });
  }
})();
