import express from 'express'
import Cart from '../models/Cart.js'
import MenuItem from '../models/MenuItem.js'

const router = express.Router()

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

async function hydrateCartItems(items = []) {
  const hydratedItems = []

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId ?? item.menuItem)

    if (!menuItem || !menuItem.isAvailable) {
      continue
    }

    const quantity = Number(item.quantity)

    if (!Number.isInteger(quantity) || quantity < 1) {
      continue
    }

    hydratedItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    })
  }

  return hydratedItems
}

router.get('/:sessionId', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
    const items = cart?.items ?? []

    res.json({
      sessionId: req.params.sessionId,
      items,
      total: calculateTotal(items),
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:sessionId', async (req, res, next) => {
  try {
    const items = await hydrateCartItems(req.body.items)
    const cart = await Cart.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { sessionId: req.params.sessionId, items },
      { new: true, runValidators: true, upsert: true },
    )

    res.json({
      sessionId: cart.sessionId,
      items: cart.items,
      total: calculateTotal(cart.items),
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:sessionId', async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { sessionId: req.params.sessionId, items: [] },
      { new: true, runValidators: true, upsert: true },
    )

    res.json({
      sessionId: cart.sessionId,
      items: cart.items,
      total: 0,
    })
  } catch (error) {
    next(error)
  }
})

export default router
