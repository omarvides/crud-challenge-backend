const { connect } = require('mongoose')
const modelSchema = require('../model-schema')
const mongoose = require('mongoose')

const Account = modelSchema.Account

function createModel(connectionString) {
  const model = {}
  model.connectionString = connectionString

  function createAccount(options, callback) {
    mongoose
      .connect(
        connectionString,
        { useNewUrlParser: true },
      )
      .then(() => {
        const newAccount = new Account({
          email: options.email,
        })
        newAccount.save().then(
          object => {
            return callback(null, object)
          },
          saveErr => {
            return callback(saveErr)
          },
        )
      })
      .catch(reason => callback(reason))
  }
  function getAccount(options, callback) {
    mongoose
      .connect(
        connectionString,
        { useNewUrlParser: true },
      )
      .then(() => {
        Account.find(options.query)
          .exec()
          .then(results => {
            mongoose.connection.close()
            return callback(null, results)
          })
          .catch(reason => callback(reason))
      })
      .catch(reason => callback(reason))
  }
  function updateAccount(options, callback) {
    mongoose
      .connect(
        connectionString,
        { useNewUrlParser: true },
      )
      .then(() => {
        Account.findOne(options.id)
          .exec()
          .then(results => {
            results.email = options.email
            results.save(function onSave(err) {
              mongoose.connection.close()
              return callback(err, results)
            })
          })
          .catch(reason => callback(reason))
      })
      .catch(reason => callback(reason))
  }
  function deleteAccount(options, callback) {
    mongoose
      .connect(
        connectionString,
        { useNewUrlParser: true },
      )
      .then(() => {
        Account.deleteOne({ id: options.id })
          .exec()
          .then(results => {
            mongoose.connection.close()
            return callback(null, results)
          })
          .catch(reason => callback(reason))
      })
      .catch(reason => callback(reason))
  }

  model.createAccount = createAccount
  model.getAccount = getAccount
  model.updateAccount = updateAccount
  model.deleteAccount = deleteAccount
  return Object.freeze(model)
}

module.exports = {
  createModel,
}
