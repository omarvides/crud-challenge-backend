const { createLogger, format, transports } = require('winston')
const { combine, timestamp, json, prettyPrint } = format
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(json(), timestamp(), prettyPrint()),
  transports: [new transports.Console()],
})

module.exports = logger
