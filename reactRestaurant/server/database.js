import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { seedMenuIfEmpty } from './seedMenu.js'

dotenv.config()

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/aiden_restaurant'

let connectionPromise

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
      .then(async () => {
        await seedMenuIfEmpty()
        return mongoose.connection
      })
      .catch((error) => {
        connectionPromise = undefined
        throw error
      })
  }

  return connectionPromise
}
