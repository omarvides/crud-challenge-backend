const { Schema, model } = require('mongoose')

const emailSchema = new Schema({
  email: { type: String, required: true, unique: true },
})

const Email = model('Email', emailSchema)

module.exports = {
  Email,
}
