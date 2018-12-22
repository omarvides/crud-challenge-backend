const request = require('supertest')
const app = require('../../server/index')

describe('Testing root', () => {
  test('It should answer with 200 Ok on GET', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
})
