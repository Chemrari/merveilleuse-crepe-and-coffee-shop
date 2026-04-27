(function () {
  var STORAGE_KEY = "merveilleuse_reviews_v1";
  var MAX_REVIEWS = 50;
  var HOME_LIMIT = 3;

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
        return [];
      }

      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(function (item) {
        return item && typeof item.name === "string" && typeof item.message === "string";
      });
    } catch (error) {
      return [];
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
      card.className = "border border-stone-200 rounded-lg p-md bg-surface-container-low";

      var top = document.createElement("div");
      top.className = "flex items-center justify-between gap-sm mb-xs";

      var name = document.createElement("p");
      name.className = "font-label-md text-on-background";
      name.textContent = review.name;

      var stars = document.createElement("p");
      stars.className = "font-label-md text-primary";
      stars.textContent = makeStars(review.rating);

      var message = document.createElement("p");
      message.className = "font-body-md text-on-surface-variant mb-xs";
      message.textContent = review.message;

      var date = document.createElement("p");
      date.className = "font-label-sm text-stone-500";
      date.textContent = formatDate(review.createdAt);

      top.appendChild(name);
      top.appendChild(stars);
      card.appendChild(top);
      card.appendChild(message);
      card.appendChild(date);
      container.appendChild(card);
    });
  }

  function makeStars(value) {
    var rating = Math.max(1, Math.min(5, Number(value) || 1));
    return new Array(rating + 1).join("*") + new Array(6 - rating).join("-");
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
