import express from 'express'
import Cart from '../models/Cart.js'
import MenuItem from '../models/MenuItem.js'
import Order from '../models/Order.js'

const router = express.Router()

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

async function buildOrderItems(items = []) {
  const orderItems = []

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId ?? item.menuItem)

    if (!menuItem || !menuItem.isAvailable) {
      continue
    }

    const quantity = Number(item.quantity)

    if (!Number.isInteger(quantity) || quantity < 1) {
      continue
    }

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    })
  }

  return orderItems
}

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const items = await buildOrderItems(req.body.items)

    if (items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one valid item.' })
    }

    const order = await Order.create({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      items,
      total: calculateTotal(items),
    })

    if (req.body.sessionId) {
      await Cart.findOneAndUpdate(
        { sessionId: req.body.sessionId },
        { sessionId: req.body.sessionId, items: [] },
        { upsert: true },
      )
    }

    return res.status(201).json(order)
  } catch (error) {
    return next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    return res.json(order)
  } catch (error) {
    return next(error)
  }
})

export default router
