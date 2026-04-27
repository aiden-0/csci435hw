const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
const navLinks = nav ? Array.from(nav.querySelectorAll("a")) : [];
const slides = Array.from(document.querySelectorAll(".gallery-slide"));
const dotsContainer = document.querySelector(".slider-dots");
const controls = document.querySelectorAll(".slider-button");
const menuItems = Array.from(document.querySelectorAll(".menu-item"));
const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");
const cartEmptyMessage = document.querySelector("#cart-empty-message");
const cartNotification = document.querySelector("#cart-notification");

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

if (menuItems.length && cartList && cartTotal && clearCartButton && cartEmptyMessage) {
  const cart = new Map();
  let notificationTimeoutId;

  function formatPrice(value) {
    return `$${value.toFixed(2)}`;
  }

  function showCartNotification(message) {
    if (!cartNotification) {
      return;
    }

    window.clearTimeout(notificationTimeoutId);
    cartNotification.textContent = message;
    cartNotification.classList.add("is-visible");

    notificationTimeoutId = window.setTimeout(() => {
      cartNotification.classList.remove("is-visible");
    }, 2200);
  }

  function renderCart() {
    cartList.innerHTML = "";

    const entries = Array.from(cart.values());
    const isEmpty = entries.length === 0;
    cartEmptyMessage.hidden = !isEmpty;
    clearCartButton.disabled = isEmpty;

    let total = 0;

    entries.forEach((item) => {
      total += item.price * item.quantity;

      const listItem = document.createElement("li");
      listItem.className = "cart-item";

      const row = document.createElement("div");
      row.className = "cart-row";

      const details = document.createElement("div");
      const name = document.createElement("p");
      name.className = "cart-item-name";
      name.textContent = item.name;

      const meta = document.createElement("p");
      meta.className = "cart-item-meta";
      meta.textContent = `${formatPrice(item.price)} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`;

      details.append(name, meta);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "cart-item-remove";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", `Remove one ${item.name} from cart`);
      removeButton.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart.delete(item.name);
        }
        renderCart();
      });

      row.append(details, removeButton);
      listItem.appendChild(row);
      cartList.appendChild(listItem);
    });

    cartTotal.textContent = formatPrice(total);
  }

  menuItems.forEach((itemButton) => {
    itemButton.addEventListener("click", () => {
      const { name, price } = itemButton.dataset;
      const parsedPrice = Number(price);

      if (!name || Number.isNaN(parsedPrice)) {
        return;
      }

      const existingItem = cart.get(name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.set(name, { name, price: parsedPrice, quantity: 1 });
      }

      renderCart();
      showCartNotification(`${name} added to cart.`);
    });
  });

  clearCartButton.addEventListener("click", () => {
    cart.clear();
    renderCart();
  });

  renderCart();
}
