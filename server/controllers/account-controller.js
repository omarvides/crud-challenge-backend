function configure(model) {
  return {
    create(params, callback) {
      model.createAccount(params, (err, object) => {
        if (err) {
          return callback(err)
        }
        return callback(null, object)
      })
    },
    get(params, callback) {
      model.getAccount(params, (err, object) => {
        if (err) {
          return callback(err)
        }
        return callback(null, object)
      })
    },
    getById(params, callback) {
      const query = {
        _id: params.id,
      }
      model.getAccount({ query: query }, (err, object) => {
        if (err) {
          return callback(err)
        }
        return callback(null, object)
      })
    },
    getByEmail(params, callback) {
      const query = {
        email: params.email,
      }
      model.getAccount({ query: query }, (err, object) => {
        if (err) {
          return callback(err)
        }
        return callback(null, object)
      })
    },
    update(params, callback) {
      model.updateAccount(
        { id: params.id, email: params.body.email },
        (err, object) => {
          if (err) {
            return callback(err)
          }
          return callback(null, object)
        },
      )
    },
    delete(params, callback) {
      model.deleteAccount({ id: params.id }, (err, object) => {
        if (err) {
          return callback(err)
        }
        return callback(null, object)
      })
    },
  }
}

module.exports = { configure }
