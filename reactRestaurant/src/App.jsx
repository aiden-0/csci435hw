import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
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

const galleryImages = [
  { src: '/food1.jpg', alt: 'Plated restaurant dish with garnish' },
  { src: '/food2.jpg', alt: 'Prepared entree served on a dinner plate' },
  { src: '/food3.jpg', alt: 'Restaurant food presented for guests' },
  { src: '/desssert1.jfif', alt: "Dessert served at Aiden's Restaurant" },
  { src: '/insiderest.png', alt: 'Interior seating area of the restaurant' },
  { src: '/inside2.jpg', alt: 'Another view of the restaurant interior' },
]

const pageTitles = {
  '/': "Aiden's Restaurant | Home",
  '/menu': "Aiden's Restaurant | Menu",
  '/about': "Aiden's Restaurant | About",
  '/contact': "Aiden's Restaurant | Contact",
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

function SiteHeader() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <header id="top">
      <div className="nav-bar">
        <NavLink className="logo" to="/" aria-label="Aiden's Restaurant home">
          <span className="logo-mark">AR</span>
          <span className="logo-text">Aiden&apos;s Restaurant</span>
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-nav"
          aria-label="Open navigation menu"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="primary-nav" className={isOpen ? 'is-open' : ''} aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'current-page' : '')}>
            Home
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => (isActive ? 'current-page' : '')}>
            Menu
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'current-page' : '')}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'current-page' : '')}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer>
      <h2>Business Hours</h2>
      <p>Monday - Friday: 11:00 AM - 9:00 PM</p>
      <p>Saturday: 12:00 PM - 10:00 PM</p>
      <p>Sunday: Closed</p>

      <h2>Social Media</h2>
      <p><a href="#">Facebook</a></p>
      <p><a href="#">Instagram</a></p>
      <p><a href="#">Twitter</a></p>
    </footer>
  )
}

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0)

  function showSlide(index) {
    setCurrentIndex((index + galleryImages.length) % galleryImages.length)
  }

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-overlay">
          <p className="hero-kicker">Welcome</p>
          <h1 id="hero-title">Aiden&apos;s Restaurant</h1>
          <p>The greatest food in New York City. Must check out!</p>
        </div>
      </section>

      <main>
        <section>
          <h2>Welcome</h2>
          <p>
            Explore our menu, learn more about the restaurant, and get in touch
            through the pages above.
          </p>
        </section>

        <section id="gallery">
          <h2>Gallery</h2>
          <div className="gallery-slider" aria-label="Restaurant photo gallery">
            <button
              className="slider-button"
              type="button"
              aria-label="Previous image"
              onClick={() => showSlide(currentIndex - 1)}
            >
              &#10094;
            </button>

            <div className="gallery-track">
              {galleryImages.map((image, index) => (
                <figure
                  className={`gallery-slide${index === currentIndex ? ' is-active' : ''}`}
                  key={image.src}
                  aria-hidden={index !== currentIndex}
                >
                  <img src={image.src} alt={image.alt} />
                </figure>
              ))}
            </div>

            <button
              className="slider-button"
              type="button"
              aria-label="Next image"
              onClick={() => showSlide(currentIndex + 1)}
            >
              &#10095;
            </button>
          </div>

          <div className="slider-dots" aria-label="Gallery navigation">
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={`slider-dot${index === currentIndex ? ' is-active' : ''}`}
                aria-label={`Show gallery image ${index + 1}`}
                aria-pressed={index === currentIndex}
                onClick={() => showSlide(index)}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

function MenuPage({ cart, total, onAddToCart, onRemoveFromCart, onClearCart }) {
  const isEmpty = cart.length === 0

  return (
    <main className="menu-page-main">
      <section id="menu">
        <h1>Menu</h1>
        <div className="menu-layout">
          <div className="menu-grid">
            {menuSections.map((section) => (
              <article className="menu-card" key={section.title}>
                <h3>{section.title}</h3>
                {section.items.map((item) => (
                  <button
                    className="menu-item"
                    key={item.name}
                    type="button"
                    onClick={() => onAddToCart(item)}
                  >
                    <span className="menu-item-info">
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-action">Add to cart</span>
                    </span>
                    <span className="menu-item-price">{formatPrice(item.price)}</span>
                  </button>
                ))}
              </article>
            ))}
          </div>

          <aside className="cart-card" aria-labelledby="cart-heading">
            <div className="cart-header">
              <h2 id="cart-heading">Shopping Cart</h2>
              <button
                className="clear-cart-button"
                type="button"
                onClick={onClearCart}
                disabled={isEmpty}
              >
                Clear Cart
              </button>
            </div>

            {isEmpty ? (
              <p className="cart-empty-message">Your cart is empty.</p>
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
                        aria-label={`Remove one ${item.name} from cart`}
                        onClick={() => onRemoveFromCart(item.name)}
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
        </div>
      </section>
    </main>
  )
}

function AboutPage() {
  return (
    <main>
      <section id="about">
        <h1>About Us</h1>
        <p>
          This restaurant has been producing the best beef wellington in New York
          City since 1999. Our main purpose is for everyone that visits New York
          to be able to say that they ate the best beef wellington here. We also
          have other great dishes like our signature pastas and we have amazing
          homemade dessert. We are so confident in our ability to cook that if
          you don&apos;t have a great experience here we will refund your whole
          order!
        </p>
      </section>
    </main>
  )
}

function ContactPage() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <main>
      <section id="contact">
        <h1>Contact</h1>
        <div className="contact-layout">
          <div className="contact-info">
            <p>Address: 160 Broadway, New York, NY 10038</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: aiden@bestfood.com</p>
            <iframe
              className="map-embed"
              title="Google map showing a McDonald's in New York City"
              src="https://www.google.com/maps?q=160%20Broadway%2C%20New%20York%2C%20NY%2010038%20McDonald's&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  )
}

function AppShell() {
  const location = useLocation()
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState('')
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)

  useEffect(() => {
    document.title = pageTitles[location.pathname] ?? "Aiden's Restaurant"
  }, [location.pathname])

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

  return (
    <div className={location.pathname === '/menu' ? 'menu-page' : ''}>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/menu"
          element={
            <MenuPage
              cart={cart}
              total={total}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onClearCart={clearCart}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <SiteFooter />

      <div
        className={`cart-notification${isNotificationVisible ? ' is-visible' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notification}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
