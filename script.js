document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const checks = [...document.querySelectorAll("[data-check-id]")];
  if (checks.length) {
    const key = "ib-physics-ia-guide-checklist";
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) {}
    checks.forEach(box => {
      if (saved[box.dataset.checkId]) box.checked = true;
      box.addEventListener("change", () => {
        saved[box.dataset.checkId] = box.checked;
        localStorage.setItem(key, JSON.stringify(saved));
        updateProgress();
      });
    });
    function updateProgress() {
      const done = checks.filter(c => c.checked).length;
      const pct = Math.round((done / checks.length) * 100);
      document.querySelectorAll("[data-progress-bar]").forEach(el => el.style.width = pct + "%");
      document.querySelectorAll("[data-progress-text]").forEach(el => el.textContent = done + " of " + checks.length + " complete");
    }
    updateProgress();
  }
});