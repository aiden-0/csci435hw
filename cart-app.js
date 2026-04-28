const { useEffect, useMemo, useState } = React;

const MENU_SECTIONS = [
  {
    title: "Appetizers",
    items: [
      { name: "Caeser Salad", price: 6 },
      { name: "Tomato Soup", price: 5 },
      { name: "Breadsticks", price: 4 }
    ]
  },
  {
    title: "Main Dishes",
    items: [
      { name: "Signature Tomato Pasta", price: 12 },
      { name: "Beef Wellington", price: 67 },
      { name: "Cheeseburger", price: 10 }
    ]
  },
  {
    title: "Desserts",
    items: [
      { name: "Ice Cream", price: 4 },
      { name: "Chocolate Cake", price: 5 },
      { name: "Cheesecake", price: 6 }
    ]
  }
];

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function MenuCard({ section, onAddToCart }) {
  return React.createElement(
    "article",
    { className: "menu-card" },
    React.createElement("h3", null, section.title),
    section.items.map((item) =>
      React.createElement(
        "button",
        {
          key: item.name,
          className: "menu-item",
          type: "button",
          onClick: () => onAddToCart(item)
        },
        React.createElement(
          "span",
          { className: "menu-item-info" },
          React.createElement("span", { className: "menu-item-name" }, item.name),
          React.createElement("span", { className: "menu-item-action" }, "Add to cart")
        ),
        React.createElement("span", { className: "menu-item-price" }, formatPrice(item.price))
      )
    )
  );
}

function CartItem({ item, onRemove }) {
  return React.createElement(
    "li",
    { className: "cart-item" },
    React.createElement(
      "div",
      { className: "cart-row" },
      React.createElement(
        "div",
        null,
        React.createElement("p", { className: "cart-item-name" }, item.name),
        React.createElement(
          "p",
          { className: "cart-item-meta" },
          `${formatPrice(item.price)} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
        )
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "cart-item-remove",
          onClick: () => onRemove(item.name),
          "aria-label": `Remove one ${item.name} from cart`
        },
        "Remove"
      )
    )
  );
}

function CartApp() {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    setIsNotificationVisible(true);

    const timeoutId = window.setTimeout(() => {
      setIsNotificationVisible(false);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  function addToCart(itemToAdd) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.name === itemToAdd.name);

      if (existingItem) {
        return currentCart.map((item) =>
          item.name === itemToAdd.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...itemToAdd, quantity: 1 }];
    });

    setNotification(`${itemToAdd.name} added to cart.`);
  }

  function removeFromCart(name) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = cart.length === 0;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "menu-layout" },
      React.createElement(
        "div",
        { className: "menu-grid" },
        MENU_SECTIONS.map((section) =>
          React.createElement(MenuCard, {
            key: section.title,
            section,
            onAddToCart: addToCart
          })
        )
      ),
      React.createElement(
        "aside",
        { className: "cart-card", "aria-labelledby": "cart-heading" },
        React.createElement(
          "div",
          { className: "cart-header" },
          React.createElement("h2", { id: "cart-heading" }, "Shopping Cart"),
          React.createElement(
            "button",
            {
              className: "clear-cart-button",
              type: "button",
              onClick: clearCart,
              disabled: isEmpty
            },
            "Clear Cart"
          )
        ),
        isEmpty
          ? React.createElement("p", { className: "cart-empty-message" }, "Your cart is empty.")
          : null,
        React.createElement(
          "ul",
          { className: "cart-list", "aria-live": "polite" },
          cart.map((item) =>
            React.createElement(CartItem, {
              key: item.name,
              item,
              onRemove: removeFromCart
            })
          )
        ),
        React.createElement(
          "div",
          { className: "cart-footer" },
          React.createElement(
            "div",
            { className: "cart-total-row" },
            React.createElement("span", null, "Total"),
            React.createElement("strong", null, formatPrice(total))
          )
        )
      )
    ),
    React.createElement(
      "div",
      {
        className: `cart-notification${isNotificationVisible ? " is-visible" : ""}`,
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true"
      },
      notification
    )
  );
}

const menuAppRoot = document.querySelector("#menu-app");

if (menuAppRoot) {
  ReactDOM.createRoot(menuAppRoot).render(React.createElement(CartApp));
}
