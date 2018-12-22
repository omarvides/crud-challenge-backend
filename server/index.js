const express = require('express')
const logger = require('../utils/logger')
const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => {
  res.statusCode = 200;
  return res.send('Hello')
})

app.listen(app.get('port'), () => {
  logger.log({
    level: 'info',
    message: `Crud challenge API is running in port ${app.get('port')}`,
  })
})

module.exports = app;