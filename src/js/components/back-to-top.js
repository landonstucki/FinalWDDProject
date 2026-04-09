// back-to-top.js
// Robust init: works even if the footer/button is injected AFTER this module runs.

function setupBackToTop(btn) {
  if (!btn || btn.dataset.bttInit === "true") return;
  btn.dataset.bttInit = "true";

  const onScroll = () => {
    btn.classList.toggle("show", window.scrollY > 300);
  };

  // Set initial state + keep it updated.
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (btn) return setupBackToTop(btn);

  // If it's not on the page yet (common with injected footers), watch for it.
  const footer = document.getElementById("site-footer") || document.body;
  const obs = new MutationObserver(() => {
    const found = document.getElementById("backToTop");
    if (found) {
      setupBackToTop(found);
      obs.disconnect();
    }
  });

  obs.observe(footer, { childList: true, subtree: true });
}

// Run ASAP, and also after DOM is ready (covers all load orders).
initBackToTop();
document.addEventListener("DOMContentLoaded", initBackToTop);

// Inclusion of Smooth Scrolling
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href === "#") return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();

  const header = document.querySelector(".site-header");
  const headerOffset = header ? header.offsetHeight : 0;

  const targetTop =
    target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: targetTop,
    behavior: "smooth"
  });
});