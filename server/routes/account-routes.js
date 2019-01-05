function name(params) {}
const logger = require('../utils/logger')

function configureRoutes(app, controllers) {
  app.post('/account', (req, res) => {
    controllers.create(req.body, (err, docs) => {
      if (err) {
        if (err.errmsg && err.errmsg.includes('E11000')) {
          res.statusCode = 400
          logger.error(`Error: on POST /account ${err}`)
          return res.send(
            `An error ocurred while registering the account, email ${
              req.body.email
            } already exist`,
          )
        }
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
  app.get('/email/:email', (req, res) => {
    controllers.getByEmail(req.params, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on GET /email/:email ${err}`)
        return res.send('An error ocurred while querying the email')
      }
      res.statusCode = 200
      if (docs.length > 0) {
        return res.json({ result: 'success', exists: true })
      }
      return res.json({ result: 'success', exists: false })
    })
  })
  app.put('/account/:id', (req, res) => {
    controllers.update(req, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(
          `Error: on PUT /account/:id ${err} while updating the account ${
            req.param.id
          }`,
        )
        return res.send(
          `An error ocurred while updating the account ${req.param.id}`,
        )
      }
      res.statusCode = 200
      return res.json({ result: 'success', docs })
    })
  })
  app.delete('/account/:id', (req, res) => {
    controllers.delete(req, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on DELETE /account/:id ${err}`)
        return res.send(
          'An error ocurred while deleting the account ${req.param.id}',
        )
      }
      res.statusCode = 200
      return res.json({ result: 'success', docs })
    })
  })
}

module.exports = {
  configureRoutes,
}
