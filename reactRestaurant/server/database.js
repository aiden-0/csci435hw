import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { seedMenuIfEmpty } from './seedMenu.js'

dotenv.config()

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/aiden_restaurant'

let connectionPromise

function createDatabaseError(error) {
  const databaseError = new Error(
    'Could not connect to MongoDB. Check MONGODB_URI in Vercel and Atlas Network Access.',
  )

  databaseError.statusCode = 503
  databaseError.cause = error
  return databaseError
}

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
        throw createDatabaseError(error)
      })
  }

  return connectionPromise
}
