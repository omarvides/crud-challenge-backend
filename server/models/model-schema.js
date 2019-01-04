const { Schema, model } = require('mongoose')

const accountSchema = new Schema({
  email: { type: String, required: true, unique: true },
})

const Account = model('account', accountSchema)

module.exports = {
  Account,
}
