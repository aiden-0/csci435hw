import dotenv from 'dotenv'
import app from './app.js'
import { connectToDatabase } from './database.js'

dotenv.config()

const port = process.env.PORT ?? 5000

connectToDatabase()
  .then(async () => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB.')
    console.error(error)
    process.exit(1)
  })
