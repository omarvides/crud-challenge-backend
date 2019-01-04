function name(params) {}
const logger = require('../utils/logger')

function configureRoutes(app, controllers) {
  app.post('/account', (req, res) => {
    controllers.create(req.body, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on POST /account ${err}`)
        return res.send('An error ocurred while registering the account')
      }
      res.statusCode = 200
      return res.json({ result: 'success', docs })
    })
  })
  app.get('/accounts', (req, res) => {
    controllers.get({ query: {} }, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on GET /accounts ${err}`)
        return res.send('An error ocurred while fetching accounts')
      }
      res.statusCode = 200
      return res.json({ result: 'success', docs })
    })
  })
  app.get('/account/:id', (req, res) => {
    controllers.getById(req.params, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on GET /account/:id ${err}`)
        return res.send('An error ocurred while fetching accounts')
      }
      res.statusCode = 200
      return res.json({ result: 'success', docs })
    })
  })
  app.put('/account/:id', (req, res) => {
    controllers.update(req, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on GET /account/:id ${err}`)
        return res.send('An error ocurred while fetching accounts')
      }
      res.statusCode = 200
      return res.json({ result: 'success', docs })
    })
  })
}

module.exports = {
  configureRoutes,
}
