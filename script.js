const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
const navLinks = nav ? Array.from(nav.querySelectorAll("a")) : [];
const slides = Array.from(document.querySelectorAll(".gallery-slide"));
const dotsContainer = document.querySelector(".slider-dots");
const controls = document.querySelectorAll(".slider-button");

if (menuToggle && nav) {
  function closeMenu() {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

if (slides.length && dotsContainer) {
  let currentIndex = 0;

  const dots = slides.map((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slider-dot";
    button.setAttribute("aria-label", `Show gallery image ${index + 1}`);
    button.addEventListener("click", () => {
      showSlide(index);
    });
    dotsContainer.appendChild(button);
    return button;
  });

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  }

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      const direction = control.dataset.direction === "prev" ? -1 : 1;
      showSlide(currentIndex + direction);
    });
  });

  showSlide(0);
}
