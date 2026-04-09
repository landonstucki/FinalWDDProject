console.log("NEW GOOGLE TESTIMONIALS FILE LOADED");
let currentSlide = 0;
let reviewsData = [];
let initialized = false;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "G";
}

function createStars(rating) {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return `${"★".repeat(safeRating)}${"☆".repeat(5 - safeRating)}`;
}

function truncateText(text = "", maxLength = 320) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function updateSummary(data) {
  const averageRatingEl = document.getElementById("average-rating");
  const reviewCountEl = document.getElementById("review-count");
  const summaryStarsEl = document.getElementById("summary-stars");

  if (!averageRatingEl || !reviewCountEl || !summaryStarsEl) return;

  averageRatingEl.textContent = data.rating ? Number(data.rating).toFixed(1) : "0.0";
  reviewCountEl.textContent = data.user_ratings_total ?? 0;
  summaryStarsEl.textContent = createStars(data.rating || 0);
}

function updateSlider(track, dotsContainer) {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  dotsContainer.querySelectorAll(".testimonial-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function renderSlides(reviews, track, dotsContainer) {
  reviewsData = reviews.slice(0, 3);

  if (!reviewsData.length) {
    track.innerHTML = `
      <div class="testimonial-slide">
        <div class="testimonial-empty">No reviews available yet.</div>
      </div>
    `;
    dotsContainer.innerHTML = "";
    return;
  }

  track.innerHTML = reviewsData.map(review => `
    <div class="testimonial-slide">
      <article class="testimonial-card">
        <div class="testimonial-top">
          <div class="testimonial-avatar">${getInitials(review.author_name)}</div>
          <div class="testimonial-author">
            ${
              review.author_url
                ? `<a href="${review.author_url}" target="_blank" rel="noopener"><strong>${escapeHtml(review.author_name)}</strong></a>`
                : `<strong>${escapeHtml(review.author_name)}</strong>`
            }
            <span class="testimonial-date">${escapeHtml(review.relative_time_description)}</span>
          </div>
        </div>

        <div class="testimonial-stars">${createStars(review.rating)}</div>
        <p class="testimonial-text">${escapeHtml(truncateText(review.text))}</p>
        <div class="testimonial-source">Google Review</div>
      </article>
    </div>
  `).join("");

  dotsContainer.innerHTML = reviewsData.map((_, index) => `
    <button
      type="button"
      class="testimonial-dot ${index === 0 ? "active" : ""}"
      data-index="${index}"
      aria-label="Go to testimonial ${index + 1}"
    ></button>
  `).join("");

  currentSlide = 0;
  updateSlider(track, dotsContainer);
}

async function fetchReviews() {
  const response = await fetch("/google-reviews.php");

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function initTestimonials() {
  if (initialized) return;
  initialized = true;

  const track = document.getElementById("testimonials-track");
  const dotsContainer = document.getElementById("testimonial-dots");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");
  const reviewLink = document.getElementById("google-review-link");

  if (!track || !dotsContainer || !prevBtn || !nextBtn) return;

  track.innerHTML = `
    <div class="testimonial-slide">
      <div class="testimonial-loading">Loading Google reviews...</div>
    </div>
  `;
  dotsContainer.innerHTML = "";

  try {
    const data = await fetchReviews();

    updateSummary(data);
    renderSlides(data.reviews || [], track, dotsContainer);

    if (reviewLink) {
      reviewLink.href = data.url || "https://google.com/";
    }
  } catch (error) {
    console.error("Testimonials error:", error);

    updateSummary({
      rating: 0,
      user_ratings_total: 0
    });

    track.innerHTML = `
      <div class="testimonial-slide">
        <div class="testimonial-empty">Could not load Google reviews right now.</div>
      </div>
    `;
    dotsContainer.innerHTML = "";

    if (reviewLink) {
      reviewLink.href = "https://google.com/";
    }
  }

  prevBtn.addEventListener("click", () => {
    if (!reviewsData.length) return;
    currentSlide = (currentSlide - 1 + reviewsData.length) % reviewsData.length;
    updateSlider(track, dotsContainer);
  });

  nextBtn.addEventListener("click", () => {
    if (!reviewsData.length) return;
    currentSlide = (currentSlide + 1) % reviewsData.length;
    updateSlider(track, dotsContainer);
  });

  dotsContainer.addEventListener("click", e => {
    const dot = e.target.closest(".testimonial-dot");
    if (!dot) return;

    currentSlide = Number(dot.dataset.index);
    updateSlider(track, dotsContainer);
  });
}