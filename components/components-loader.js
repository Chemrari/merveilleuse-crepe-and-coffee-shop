(function () {
  var componentTargets = [
    { id: "navbar-container", path: "components/navbar.html" },
    { id: "footer-container", path: "components/footer.html" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    Promise.all(componentTargets.map(loadComponent)).then(function () {
      highlightCurrentNavLink();
      initMobileMenu();
      initScrollNavbar();
    });
  });

  function loadComponent(target) {
    var container = document.getElementById(target.id);
    if (!container) {
      return Promise.resolve();
    }

    return fetch(target.path)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Cannot load " + target.path);
        }
        return response.text();
      })
      .then(function (html) {
        container.innerHTML = html;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function highlightCurrentNavLink() {
    var links = document.querySelectorAll(".nav-link");
    if (!links.length) {
      return;
    }

    var activeKey = getCurrentNavKey();

    links.forEach(function (link) {
      var isActive = link.getAttribute("data-nav") === activeKey;
      link.classList.toggle("text-red-700", isActive);
      link.classList.toggle("dark:text-red-500", isActive);
      link.classList.toggle("border-b-2", isActive);
      link.classList.toggle("border-red-700", isActive);
      link.classList.toggle("dark:border-red-500", isActive);
      link.classList.toggle("pb-1", isActive);

      link.classList.toggle("text-stone-600", !isActive);
      link.classList.toggle("dark:text-stone-400", !isActive);
      link.classList.toggle("hover:text-stone-900", !isActive);
      link.classList.toggle("dark:hover:text-stone-200", !isActive);
    });
  }

  function initMobileMenu() {
    var btn = document.getElementById("mobile-menu-btn");
    var menu = document.getElementById("mobile-menu");
    if (btn && menu) {
      btn.addEventListener("click", function() {
        menu.classList.toggle("hidden");
        menu.classList.toggle("flex");
      });
    }
  }

  function initScrollNavbar() {
    var header = document.querySelector("header");
    if (!header) return;

    var page = window.location.pathname.split("/").pop().toLowerCase();
    var isAccueil = page === "index.html" || page === "";

    if (isAccueil) {
      // Initial state
      header.classList.remove("bg-stone-50/90", "dark:bg-stone-950/90", "backdrop-blur-md", "border-b", "shadow-sm");
      header.classList.add("bg-transparent", "border-transparent", "transition-all", "duration-500");

      window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
          header.classList.remove("bg-transparent", "border-transparent");
          header.classList.add("bg-stone-50/90", "dark:bg-stone-950/90", "backdrop-blur-md", "border-b", "shadow-sm");
        } else {
          header.classList.add("bg-transparent", "border-transparent");
          header.classList.remove("bg-stone-50/90", "dark:bg-stone-950/90", "backdrop-blur-md", "border-b", "shadow-sm");
        }
      });
    }
  }

  function getCurrentNavKey() {
    var page = window.location.pathname.split("/").pop().toLowerCase();

    if (page === "index.html" || page === "") {
      return "accueil";
    }

    if (page === "menu.html") {
      return "menu";
    }

    if (page === "gallery.html") {
      return "gallery";
    }

    if (page === "about.html") {
      return "about";
    }

    if (page === "contact.html") {
      return "contact";
    }

    return "";
  }
})();
