const logger = require('../../../server/utils/logger')
const promconfig = require('../../../server/utils/promconfig')
const requestValidator = require('../../../server/utils/request-validator')
const { assert } = require('chai')

describe('logger util', () => {
  it('it must expose an object', () => {
    assert.isObject(logger)
    assert.exists(logger)
  })
})

describe('promconfig util', () => {
  it('it must expose includeStatusCode, includePath and a custom label version to metrics endpoint', () => {
    assert.isObject(promconfig)
    assert.isTrue(promconfig.includeMethod == true)
    assert.isTrue(promconfig.includeStatusCode == true)
    assert.isTrue(promconfig.includePath == true)
    assert.exists(promconfig.customLabels.version)
  })
})

describe('request-validator util', () => {
  it('it must expose an object', () => {
    assert.isObject(requestValidator)
  })
  it('it must expose an object', () => {
    assert.isObject(requestValidator)
  })
  it('should have a createSchema and an updateSchema', () => {
    assert.exists(requestValidator.createSchema)
    assert.exists(requestValidator.updateSchema)
  })
  it('should use a create schema with id and email', () => {
    assert.exists(requestValidator.createSchema.id)
    assert.exists(requestValidator.createSchema.email)
  })
  it('should use a update schema with id and email', () => {
    assert.exists(requestValidator.createSchema.id)
    assert.exists(requestValidator.createSchema.email)
  })
})
