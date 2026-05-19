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

router.post('/:id/items', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    const menuItem = await MenuItem.findById(req.body.menuItemId ?? req.body.menuItem)

    if (!menuItem || !menuItem.isAvailable) {
      return res.status(404).json({ message: 'Menu item not found or unavailable.' })
    }

    const quantity = Number(req.body.quantity ?? 1)

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive whole number.' })
    }

    const existingItem = order.items.find(
      (item) => item.menuItem.toString() === menuItem._id.toString(),
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      order.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      })
    }

    order.total = calculateTotal(order.items)
    await order.save()

    return res.json(order)
  } catch (error) {
    return next(error)
  }
})

router.patch('/:id/items/:menuItemId', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    const orderItem = order.items.find(
      (item) => item.menuItem.toString() === req.params.menuItemId,
    )

    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found.' })
    }

    const quantity = Number(req.body.quantity)

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive whole number.' })
    }

    orderItem.quantity = quantity
    order.total = calculateTotal(order.items)
    await order.save()

    return res.json(order)
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id/items/:menuItemId', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    const updatedItems = order.items.filter(
      (item) => item.menuItem.toString() !== req.params.menuItemId,
    )

    if (updatedItems.length === order.items.length) {
      return res.status(404).json({ message: 'Order item not found.' })
    }

    if (updatedItems.length === 0) {
      return res.status(400).json({
        message: 'Cannot remove the last item from an order. Delete the order instead.',
      })
    }

    order.items = updatedItems
    order.total = calculateTotal(updatedItems)
    await order.save()

    return res.json(order)
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
})

export default router
