import Table from 'cli-table'
const { createLogger, format, transports } = require('winston')

const loggerFormat = format.combine(format.colorize(), format.simple())

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: loggerFormat,
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.Console({ level: process.env.LOG_LEVEL })
  ]
})

logger.table = (obj, logLevel = 'debug') => {
  const table = new Table()
  for (const key in obj) {
    if (key !== '_id' && key !== '__v') {
      table.push([key, obj[key]])
    }
  }
  logger[logLevel](`\n${table.toString()}`)
}

logger.json = (obj, logLevel = 'debug') => {
  logger[logLevel](JSON.stringify(obj, null, 2))
}

logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
}

export default logger
