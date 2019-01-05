const expressJoi = require('express-joi')

const createSchema = {
  email: expressJoi.Joi.string().email(),
}
const updateSchema = {
  id: expressJoi.Joi.string(),
  email: expressJoi.Joi.string().email(),
}

module.exports = {
  expressJoi,
  createSchema,
  updateSchema,
}
