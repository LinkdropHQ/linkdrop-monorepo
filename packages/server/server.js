require('newrelic')
import connectDB from './src/models/connectDB'
import logger from './src/utils/logger'
const express = require('express')
const app = express()
const cors = require('cors')
const buildRouter = require('./src/routes')
const morgan = require('morgan')

// Apply middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body, null, 2)
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms \n:body',
    { stream: logger.stream }
  )
)

// connect to database
connectDB()
  .then(() => {
    // Run server
    const PORT = process.env.PORT || process.env.CUSTOM_PORT || 5000
    app.listen(PORT, () => {
      logger.info(`Server is up on port ${PORT}\n`)
    })
  })
  .catch(err => {
    logger.error(`${err}\n`)
    process.exit(1)
  })

// Define routes
app.get('/', (req, res) => res.send('👋  Hello from linkdrop server'))
app.use('/api/v1/', buildRouter('routes'))

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error(error.message)
  if (error.isOperational) {
    res.status(error.statusCode)
    res.send({
      success: false,
      error: error.message,
      errors: ['SERVER_ERROR_OCCURED']
    })
  } else if (error.reason) {
    // error for contract or ethers.js
    logger.json(error)
    const errors = error.reason
    res.status(400)
    res.send({ success: false, errors })
  } else {
    // don't send error details to the scary external world
    logger.error(error.stack)
    const errors = ['SERVER_ERROR_OCCURED']
    res.status(500)
    res.send({ success: false, errors })
  }
  return null
})
