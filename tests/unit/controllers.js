const accountController = require('../../server/controllers/account-controller')
const { assert } = require('chai')
const sinon = require('sinon')

describe('accountController', () => {
  it('return an object with functions when configured', () => {
    const controllers = accountController.configure({})
    assert.exists(controllers)
    assert.typeOf(controllers, 'object')
  })

  it('Should call each model function at least once', () => {
    const fakeModels = {
      createAccount: sinon.stub(),
      getAccount: sinon.stub(),
      updateAccount: sinon.stub(),
      deleteAccount: sinon.stub(),
    }
    const controllers = accountController.configure(fakeModels)
    for (const controller in controllers) {
      controllers[controller]({
        params: { id: 1 },
        body: { email: 'some@mail.com' },
      })
    }
    for (const model in fakeModels) {
      if (fakeModels.hasOwnProperty(model)) {
        const element = fakeModels[model]
        assert.isTrue(element.called)
      }
    }
  })
})
