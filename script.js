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
document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-calc]");
  if (!form) return;
  event.preventDefault();
  const n = name => Number(form.elements[name].value);
  const out = form.querySelector("output");
  let answer = "";
  if (form.dataset.calc === "percent-uncertainty") {
    const value = n("value"), u = Math.abs(n("uncertainty"));
    answer = value === 0 ? "Value cannot be zero." : ((u / Math.abs(value)) * 100).toPrecision(3) + "%";
  }
  if (form.dataset.calc === "half-range") {
    answer = (Math.abs(n("max") - n("min")) / 2).toPrecision(4);
  }
  if (form.dataset.calc === "percent-difference") {
    const experimental = n("experimental"), accepted = n("accepted");
    answer = accepted === 0 ? "Accepted value cannot be zero." : (Math.abs(experimental - accepted) / Math.abs(accepted) * 100).toPrecision(3) + "%";
  }
  out.textContent = answer;
});
