require('dotenv').config()
const express = require('express')
const logger = require('./utils/logger')
const bodyParser = require('body-parser')
const promBundle = require('express-prom-bundle')
const promconfig = require('./utils/promconfig')
const metricsMiddleware = promBundle(promconfig)
const accountControllers = require('./controllers/account-controller')
const accountRoutes = require('./routes/account-routes')
const accountModel = require('./models/account').createModel(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@` +
    `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DATABASE}`,
)
const app = express()

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(metricsMiddleware)

accountRoutes.configureRoutes(app, accountControllers.configure(accountModel))

app.get('/', (req, res) => {
  res.statusCode = 200
  return res.json('')
})

app.listen(app.get('port'), () => {
  logger.log({
    level: 'info',
    message: `Crud challenge API is running in port ${app.get('port')}`,
  })
})

module.exports = app
