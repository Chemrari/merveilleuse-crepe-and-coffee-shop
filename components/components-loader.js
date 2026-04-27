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

    var componentUrl = new URL(target.path, window.location.href);

    return fetch(componentUrl.toString())
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
      link.classList.toggle("border-b-2", isActive);
      link.classList.toggle("border-red-700", isActive);
      link.classList.toggle("pb-1", isActive);
      link.classList.toggle("font-semibold", isActive);

      link.classList.toggle("text-stone-600", !isActive);
      link.classList.toggle("hover:text-stone-900", !isActive);
    });
  }

  function initMobileMenu() {
    var btn = document.getElementById("mobile-menu-btn");
    var menu = document.getElementById("mobile-menu");
    var backdrop = document.getElementById("mobile-menu-backdrop");
    if (!btn || !menu) return;

    var links = menu.querySelectorAll("a");

    function setMenuState(isOpen) {
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menu.classList.toggle("hidden", !isOpen);
      backdrop && backdrop.classList.toggle("hidden", !isOpen);
      backdrop && backdrop.classList.toggle("pointer-events-none", !isOpen);
      menu.classList.toggle("pointer-events-none", !isOpen);
      menu.classList.toggle("opacity-0", !isOpen);
      menu.classList.toggle("opacity-100", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      btn.querySelector(".material-symbols-outlined").textContent = isOpen ? "close" : "menu";
    }

    btn.addEventListener("click", function() {
      var isOpen = btn.getAttribute("aria-expanded") !== "true";
      setMenuState(isOpen);
    });

    if (backdrop) {
      backdrop.addEventListener("click", function() {
        setMenuState(false);
      });
    }

    links.forEach(function(link) {
      link.addEventListener("click", function() {
        setMenuState(false);
      });
    });

    window.addEventListener("resize", function() {
      if (window.innerWidth >= 768) {
        setMenuState(false);
      }
    });
  }

  function initScrollNavbar() {
    var header = document.getElementById("site-header");
    if (!header) return;

    var page = window.location.pathname.split("/").pop().toLowerCase();
    var isHome = page === "index.html" || page === "";

    if (isHome) {
      header.classList.remove("bg-white", "shadow-sm", "border-stone-200");
      header.classList.add("bg-transparent", "border-transparent", "transition-all", "duration-500");

      window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
          header.classList.remove("bg-transparent", "border-transparent");
          header.classList.add("bg-white", "shadow-sm", "border-stone-200");
        } else {
          header.classList.add("bg-transparent", "border-transparent");
          header.classList.remove("bg-white", "shadow-sm", "border-stone-200");
        }
      });
    }
  }

  function getCurrentNavKey() {
    var page = window.location.pathname.split("/").pop().toLowerCase();

    if (page === "index.html" || page === "") {
      return "Home";
    }

    if (page === "menu.html") {
      return "Menu";
    }

    if (page === "gallery.html") {
      return "Gallery";
    }

    if (page === "about.html") {
      return "About";
    }

    if (page === "contact.html") {
      return "Contact";
    }

    return "";
  }
})();
