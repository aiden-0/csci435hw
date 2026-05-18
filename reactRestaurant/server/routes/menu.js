import express from 'express'
import MenuItem from '../models/MenuItem.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 })
    res.json(menuItems)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const menuItem = await MenuItem.create(req.body)
    res.status(201).json(menuItem)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' })
    }

    return res.json(menuItem)
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id)

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' })
    }

    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
})

export default router
