import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectToDatabase } from './database.js'
import cartRouter from './routes/cart.js'
import menuRouter from './routes/menu.js'
import ordersRouter from './routes/orders.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', async (req, res, next) => {
  try {
    await connectToDatabase()
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api/menu', menuRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', ordersRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

app.use((error, req, res, next) => {
  void next
  console.error(error)

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message })
  }

  return res.status(500).json({ message: 'Something went wrong on the server.' })
})

export default app
