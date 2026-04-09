import { buildHeaderHTML, buildFooterHTML } from "./components/header-footer.js";
import { initMobileNav } from "./components/mobile-nav.js";
import { initTestimonials } from "./components/testimonials.js";

import "./components/back-to-top.js";
import "./pages/contact.js";
import "./pages/index.js";
import "./pages/gallery.js";

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("site-header");
  if (headerEl) headerEl.innerHTML = buildHeaderHTML();

  const footerEl = document.getElementById("site-footer");
  if (footerEl) footerEl.innerHTML = buildFooterHTML();

  initMobileNav();
  initTestimonials();
});