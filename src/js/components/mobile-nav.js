export function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const backdrop = document.querySelector("[data-nav-backdrop]");

  if (!toggle || !nav) return;

  const open = () => {
    nav.classList.add("is-open");
    toggle.classList.add("is-open");
    backdrop?.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  };

  const isOpen = () => nav.classList.contains("is-open");

  toggle.addEventListener("click", () => {
    isOpen() ? close() : open();
  });

  backdrop?.addEventListener("click", close);

  // close when clicking a link
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    close();
  });

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });

  // if resized back to desktop, ensure closed + unlock scroll
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && isOpen()) close();
  });
}