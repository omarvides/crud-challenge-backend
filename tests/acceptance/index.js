const request = require('supertest')
const app = require('../../server/index')

describe('API', () => {
  it('should answer with 200 Ok on GET when calling / with no arguments', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
})
