console.log("NEW GALLERY JS LOADED");

let albums = [];

function renderAlbumButtons() {
  const albumButtons = document.getElementById("albumButtons");
  if (!albumButtons) return;

  if (!albums.length) {
    albumButtons.innerHTML = `<li class="gallery-message">No albums yet.</li>`;
    return;
  }

  albumButtons.innerHTML = albums
    .map(
      (album, index) => `
        <li>
          <button
            type="button"
            class="gallery-filter ${index === 0 ? "active" : ""}"
            data-slug="${album.slug}"
          >
            ${album.name}
          </button>
        </li>
      `
    )
    .join("");
}

function renderGallery(items) {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  if (!items.length) {
    galleryGrid.innerHTML = `<p class="gallery-message">No images found in this album yet.</p>`;
    return;
  }

  galleryGrid.innerHTML = items
    .map(
      project => `
        <article class="gallery-card">
          <img
            src="${project.image}"
            data-full="${project.fullImage}"
            alt="${project.alt}"
          >
          <div class="gallery-card-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function loadAlbum(slug) {
  const selectedAlbum = albums.find(album => album.slug === slug);
  if (!selectedAlbum) return;

  renderGallery(selectedAlbum.images);

  document.querySelectorAll(".gallery-filter").forEach(button => {
    button.classList.toggle("active", button.dataset.slug === slug);
  });
}

async function fetchAlbums() {
  const galleryGrid = document.getElementById("galleryGrid");
  const albumButtons = document.getElementById("albumButtons");

  if (galleryGrid) {
    galleryGrid.innerHTML = `<p class="gallery-message">Loading...</p>`;
  }

  if (albumButtons) {
    albumButtons.innerHTML = "";
  }

  try {
    const response = await fetch("/get-albums.php");

    if (!response.ok) {
      throw new Error("Could not fetch albums.");
    }

    const data = await response.json();
    albums = data.albums || [];

    renderAlbumButtons();

    if (albums.length) {
      loadAlbum(albums[0].slug);
    } else if (galleryGrid) {
      galleryGrid.innerHTML = `<p class="gallery-message">No albums yet.</p>`;
    }
  } catch (error) {
    console.error(error);
    if (galleryGrid) {
      galleryGrid.innerHTML = `<p class="gallery-message">Could not load gallery.</p>`;
    }
  }
}

function initGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  const albumButtons = document.getElementById("albumButtons");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  if (!galleryGrid || !albumButtons || !lightbox || !lightboxImg || !lightboxClose) return;

  fetchAlbums();

  albumButtons.addEventListener("click", e => {
    const button = e.target.closest(".gallery-filter");
    if (!button) return;
    loadAlbum(button.dataset.slug);
  });

  document.addEventListener("click", e => {
    const img = e.target.closest(".gallery-card img");
    if (!img) return;

    lightboxImg.src = img.dataset.full || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("active");
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  });

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
      lightboxImg.src = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", initGallery);