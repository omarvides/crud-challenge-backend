const { Schema, model } = require('mongoose')

const accountSchema = new Schema({
  _id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
})

const Account = model('account', accountSchema)

module.exports = {
  Account,
}
