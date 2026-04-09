function getPrefix() {
  const path = window.location.pathname || "";
  return path.includes("/pages/") ? ".." : ".";
}

export function buildHeaderHTML() {
  const p = getPrefix();

  return `
    <div class="site-header site-header--overlay">
      <a class="brand" href="${p}/index.html" aria-label="Stucki Homes Home">
      </a>

      <button
        class="nav-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="site-nav"
        data-nav-toggle
      >
        <span class="nav-toggle__icon" aria-hidden="true"><span></span></span>
      </button>

      <div class="nav-backdrop" data-nav-backdrop></div>

      <nav class="site-nav" id="site-nav" aria-label="Main navigation" data-site-nav>
        <ul class="site-nav__list">
          <li><a class="site-nav__link" href="${p}/index.html">Home</a></li>
          <li><a class="site-nav__link" href="${p}/pages/services.html">Services</a></li>
          <li><a class="site-nav__link" href="${p}/pages/gallery.html">Projects Gallery</a></li>
          <li><a class="site-nav__link" href="${p}/pages/contact.html">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  `;
}

export function buildFooterHTML() {
  const p = getPrefix();

  return `
    <div class="site-footer">
      <button id="backToTop" type="button" aria-label="Back to top">↑</button>
      <p class="footer-copy">&copy; ${new Date().getFullYear()} Stucki Homes</p>
    </div>
  `;
}