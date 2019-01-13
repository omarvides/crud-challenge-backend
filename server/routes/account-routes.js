function name(params) {}
const logger = require('../utils/logger')
const { transformSingleElement } = require('../utils/response-transform')
const {
  expressJoi,
  createSchema,
  updateSchema,
} = require('../utils/request-validator')

function configureRoutes(app, controllers) {
  app.post('/account', expressJoi.joiValidate(createSchema), (req, res) => {
    controllers.create(req.body, (err, docs) => {
      if (err) {
        if (err.errmsg && err.errmsg.includes('E11000')) {
          res.statusCode = 400
          logger.error(`Error: on POST /account ${err}`)
          return res.send(
            `An error ocurred while registering the account, email or id ${
              req.body.id
            } ${req.body.email} already exist`,
          )
        }
        res.statusCode = 500
        logger.error(`Error: on POST /account ${err}`)
        return res.send('An error ocurred while registering the account')
      }
      transformSingleElement(docs, (err, result) => {
        if (err) {
          res.statusCode = 500
          logger.error(
            `Error: while transforming the response on POST /account ${err}`,
          )
          return res.send('An error ocurred while registering the account')
        }
        res.statusCode = 200
        return res.json(result)
      })
    })
  })
  app.get('/account', (req, res) => {
    controllers.get({ query: {} }, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on GET /account ${err}`)
        return res.send('An error ocurred while fetching accounts')
      }
      res.statusCode = 200
      return res.json(docs)
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
      return res.json(docs)
    })
  })
  app.get('/email/:email', expressJoi.joiValidate(createSchema), (req, res) => {
    controllers.getByEmail(req.params, (err, docs) => {
      if (err) {
        res.statusCode = 500
        logger.error(`Error: on GET /email/:email ${err}`)
        return res.send('An error ocurred while querying the email')
      }
      res.statusCode = 200
      if (docs.length > 0) {
        return res.json({ exists: true })
      }
      return res.json({ exists: false })
    })
  })
  app.put('/account/:id', expressJoi.joiValidate(updateSchema), (req, res) => {
    controllers.update(req, (err, docs) => {
      if (err) {
        if (err.errmsg && err.errmsg.includes('E11000')) {
          res.statusCode = 400
          logger.error(`Error: on PUT /account ${err}`)
          return res.send(
            `An error ocurred while updating the account, email or id ${
              req.id
            }, ${req.body.email} already exist`,
          )
        }
        res.statusCode = 500
        logger.error(`Error: on PUT /account ${err}`)
        return res.send('An error ocurred while updating the account')
      }
      res.statusCode = 200
      return res.json(docs)
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
      return res.json(docs)
    })
  })
}

module.exports = {
  configureRoutes,
}
