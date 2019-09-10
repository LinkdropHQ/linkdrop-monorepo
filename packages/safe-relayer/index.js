import connectDB from './config/db'
import logger from './src/utils/logger'
import express from 'express'
import cors from 'cors'
import safesRouter from './src/routes/safes'
import transactionsRouter from './src/routes/transactions'

const app = express()

// Init middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))
app.use(cors())

// connect to database
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5050

    app.listen(PORT, () => {
      logger.info(`Safe relay service is up at http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    logger.error(`${err}\n`)
    process.exit(1)
  })

// Define routes
app.get('/', (req, res) => res.send('Safe Relay Service'))
app.use('/api/v1/safes', safesRouter)
app.use('/api/v1/safes/execute', transactionsRouter)

// Boom error handling middleware
app.use((err, req, res, next) => {
  if (err.isBoom) {
    // Log the error
    logger.error(err.output.payload.message)
    res.status(err.output.statusCode).json(err.output.payload)
  } else {
    logger.error(err.message)
    res.status(500).json({ error: err.message })
  }
})
