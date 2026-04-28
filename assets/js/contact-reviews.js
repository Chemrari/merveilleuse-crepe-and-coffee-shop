(function () {
  var STORAGE_KEY = "merveilleuse_reviews_v1";
  var MAX_REVIEWS = 50;
  var HOME_LIMIT = 3;
  var DEFAULT_REVIEWS = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      message: "Beautiful presentation, rich coffee, and one of the best crepes we've had in Destin.",
      createdAt: "2026-04-12T10:00:00.000Z"
    },
    {
      id: 2,
      name: "Daniel R.",
      rating: 5,
      message: "The Pistache Royale is exceptional and the cafe feels calm, elegant, and welcoming.",
      createdAt: "2026-04-08T10:00:00.000Z"
    },
    {
      id: 3,
      name: "Nadia K.",
      rating: 5,
      message: "Perfect spot for dessert and conversation. The staff was lovely and the waffles were fresh and crisp.",
      createdAt: "2026-04-04T10:00:00.000Z"
    },
    {
      id: 4,
      name: "Marcus T.",
      rating: 4,
      message: "Great cappuccino, generous portions, and a premium feel without being too formal.",
      createdAt: "2026-03-30T10:00:00.000Z"
    }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("review-form");
    var list = document.getElementById("review-list");
    var homeList = document.getElementById("review-list-home");
    var status = document.getElementById("review-status");

    var reviews = loadReviews();
    if (list) {
      renderReviews(list, reviews);
    }
    if (homeList) {
      renderReviews(homeList, reviews.slice(0, HOME_LIMIT), "No reviews yet. Add one from the Contact page.");
    }

    if (!form || !list || !status) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameInput = document.getElementById("review-name");
      var ratingInput = document.getElementById("review-rating");
      var messageInput = document.getElementById("review-message");

      var name = nameInput.value.trim();
      var rating = parseInt(ratingInput.value, 10);
      var message = messageInput.value.trim();

      if (!name || !message || Number.isNaN(rating) || rating < 1 || rating > 5) {
        status.textContent = "Please fill all fields correctly.";
        return;
      }

      var review = {
        id: Date.now(),
        name: name,
        rating: rating,
        message: message,
        createdAt: new Date().toISOString()
      };

      reviews.unshift(review);
      reviews = reviews.slice(0, MAX_REVIEWS);
      saveReviews(reviews);
      renderReviews(list, reviews);
      if (homeList) {
        renderReviews(homeList, reviews.slice(0, HOME_LIMIT), "No reviews yet. Add one from the Contact page.");
      }

      form.reset();
      ratingInput.value = "5";
      status.textContent = "Thanks! Your review has been added.";
    });
  });

  function loadReviews() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return DEFAULT_REVIEWS.slice();
      }

      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      var cleaned = parsed.filter(function (item) {
        return item && typeof item.name === "string" && typeof item.message === "string";
      });
      return cleaned.length ? cleaned : DEFAULT_REVIEWS.slice();
    } catch (error) {
      return DEFAULT_REVIEWS.slice();
    }
  }

  function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  function renderReviews(container, reviews, emptyMessage) {
    container.innerHTML = "";

    if (!reviews.length) {
      var empty = document.createElement("p");
      empty.className = "font-body-md text-on-surface-variant";
      empty.textContent = emptyMessage || "No reviews yet. Be the first to share your experience.";
      container.appendChild(empty);
      return;
    }

    reviews.forEach(function (review) {
      var card = document.createElement("article");
      card.className = "review-card border border-stone-200 rounded-xl p-md bg-surface-container-lowest";
      card.style.cssText = "position:relative;overflow:hidden;transition:transform 0.24s ease,box-shadow 0.24s ease;";

      // Decorative quote icon
      var quoteIcon = document.createElement("span");
      quoteIcon.className = "material-symbols-outlined";
      quoteIcon.textContent = "format_quote";
      quoteIcon.style.cssText = "position:absolute;top:-4px;right:12px;font-size:48px;color:var(--color-primary);opacity:0.07;font-variation-settings:'FILL' 1;pointer-events:none;";
      card.appendChild(quoteIcon);

      // Stars row
      var starsRow = document.createElement("div");
      starsRow.className = "flex items-center gap-1 mb-sm";
      starsRow.innerHTML = makeStars(review.rating);

      // Message
      var message = document.createElement("p");
      message.className = "font-body-md text-on-surface-variant";
      message.style.cssText = "line-height:1.6;margin-bottom:16px;";
      message.textContent = review.message;

      // Bottom row: name + date
      var bottom = document.createElement("div");
      bottom.className = "flex items-center justify-between";
      bottom.style.cssText = "border-top:1px solid var(--color-surface-variant);padding-top:12px;";

      var nameWrap = document.createElement("div");

      var name = document.createElement("p");
      name.className = "font-label-md text-on-background";
      name.style.fontWeight = "700";
      name.textContent = review.name;

      var date = document.createElement("p");
      date.className = "font-label-sm text-stone-400";
      date.style.cssText = "margin-top:2px;";
      date.textContent = formatDate(review.createdAt);

      nameWrap.appendChild(name);
      nameWrap.appendChild(date);

      // Rating badge
      var badge = document.createElement("span");
      badge.style.cssText = "display:inline-flex;align-items:center;gap:4px;background:var(--color-surface-container-low);border:1px solid var(--color-surface-variant);border-radius:9999px;padding:4px 10px;font-size:12px;font-weight:600;color:var(--color-on-surface);";
      badge.textContent = review.rating + ".0";

      var badgeStar = document.createElement("span");
      badgeStar.className = "material-symbols-outlined";
      badgeStar.textContent = "star";
      badgeStar.style.cssText = "font-size:14px;color:#d97706;font-variation-settings:'FILL' 1;";
      badge.prepend(badgeStar);

      bottom.appendChild(nameWrap);
      bottom.appendChild(badge);

      card.appendChild(starsRow);
      card.appendChild(message);
      card.appendChild(bottom);
      container.appendChild(card);
    });
  }

  function makeStars(value) {
    var rating = Math.max(1, Math.min(5, Number(value) || 1));
    var html = "";
    var filledStyle = "font-size:18px;color:#d97706;font-variation-settings:'FILL' 1;line-height:1;";
    var emptyStyle = "font-size:18px;color:#d4d4d4;font-variation-settings:'FILL' 0;line-height:1;";
    for (var i = 0; i < 5; i++) {
      if (i < rating) {
        html += '<span class="material-symbols-outlined" style="' + filledStyle + '">star</span>';
      } else {
        html += '<span class="material-symbols-outlined" style="' + emptyStyle + '">star</span>';
      }
    }
    return html;
  }

  function formatDate(isoDate) {
    var date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
})();
