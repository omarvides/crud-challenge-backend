const expressJoi = require('express-joi')

const createSchema = {
  id: expressJoi.Joi.string().guid({ version: ['uuidv4'] }),
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
