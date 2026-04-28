import { useEffect, useMemo, useState } from 'react'
import './App.css'

const menuSections = [
  {
    title: 'Appetizers',
    items: [
      { name: 'Caeser Salad', price: 6 },
      { name: 'Tomato Soup', price: 5 },
      { name: 'Breadsticks', price: 4 },
    ],
  },
  {
    title: 'Main Dishes',
    items: [
      { name: 'Signature Tomato Pasta', price: 12 },
      { name: 'Beef Wellington', price: 67 },
      { name: 'Cheeseburger', price: 10 },
    ],
  },
  {
    title: 'Desserts',
    items: [
      { name: 'Ice Cream', price: 4 },
      { name: 'Chocolate Cake', price: 5 },
      { name: 'Cheesecake', price: 6 },
    ],
  },
]

function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

function App() {
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState('')
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)

  useEffect(() => {
    if (!notification) {
      return undefined
    }

    setIsNotificationVisible(true)

    const timeoutId = window.setTimeout(() => {
      setIsNotificationVisible(false)
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [notification])

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  function addToCart(itemToAdd) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.name === itemToAdd.name)

      if (existingItem) {
        return currentCart.map((item) =>
          item.name === itemToAdd.name
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { ...itemToAdd, quantity: 1 }]
    })

    setNotification(`${itemToAdd.name} added to cart.`)
  }

  function removeFromCart(name) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function clearCart() {
    setCart([])
  }

  const isEmpty = cart.length === 0

  return (
    <>
      <header className="hero-banner">
        <p className="eyebrow">Aiden&apos;s Restaurant</p>
        <h1>Fresh plates, simple ordering, and a React-powered cart</h1>
        <p className="hero-copy">
          Build from this app as your Vercel root and keep the menu and shopping
          cart logic inside the React project.
        </p>
      </header>

      <main className="menu-page-shell">
        <section className="menu-layout" aria-labelledby="menu-heading">
          <div className="menu-column">
            <div className="section-heading">
              <p className="section-kicker">Today&apos;s Menu</p>
              <h2 id="menu-heading">Choose what you want to add</h2>
            </div>

            <div className="menu-grid">
              {menuSections.map((section) => (
                <article className="menu-card" key={section.title}>
                  <h3>{section.title}</h3>
                  <div className="menu-items">
                    {section.items.map((item) => (
                      <button
                        className="menu-item"
                        key={item.name}
                        type="button"
                        onClick={() => addToCart(item)}
                      >
                        <span className="menu-item-info">
                          <span className="menu-item-name">{item.name}</span>
                          <span className="menu-item-action">Add to cart</span>
                        </span>
                        <span className="menu-item-price">
                          {formatPrice(item.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="cart-card" aria-labelledby="cart-heading">
            <div className="cart-header">
              <div>
                <p className="section-kicker">Order Summary</p>
                <h2 id="cart-heading">Shopping Cart</h2>
              </div>
              <button
                className="clear-cart-button"
                type="button"
                onClick={clearCart}
                disabled={isEmpty}
              >
                Clear Cart
              </button>
            </div>

            {isEmpty ? (
              <p className="cart-empty-message">
                Your cart is empty. Add a dish to get started.
              </p>
            ) : (
              <ul className="cart-list" aria-live="polite">
                {cart.map((item) => (
                  <li className="cart-item" key={item.name}>
                    <div className="cart-row">
                      <div>
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-meta">
                          {formatPrice(item.price)} x {item.quantity} ={' '}
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.name)}
                        aria-label={`Remove one ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <div
        className={`cart-notification${isNotificationVisible ? ' is-visible' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notification}
      </div>
    </>
  )
}

export default App
