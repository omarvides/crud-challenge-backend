const request = require('supertest')
const { expect } = require('chai')
const app = require('../../server/index')

describe('API', () => {
  it('should answer with 200 Ok on GET when calling / with no arguments', done => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        done(err)
      })
  })
  it('should be configured to run on port 3000 when no PORT env var is defined', () => {
    expect(app.get('port')).to.equal(3000)
  })
})

describe('/account endpoint', () => {
  it('should answer with 200 ok when a new valid Account is created via POST: /account', done => {
    request(app)
      .post('/account')
      .send({ email: 'foo@bar.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('foo@bar.com')
        done(err)
      })
  })

  it('retrieve at least one record on GET /accounts after a valid POST was performed', done => {
    request(app)
      .get('/accounts')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        expect(res.body.docs.length).to.be.greaterThan(0)
        expect(res.body.docs[0].email).to.equal('foo@bar.com')
        done(err)
      })
  })

  it('should allow to look for an created account by id', done => {
    let currentAccountId
    request(app)
      .post('/account')
      .send({ email: 'samplefoo@samplebar.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('samplefoo@samplebar.com')
        currentAccountId = res.body.docs._id

        request(app)
          .get(`/account/${currentAccountId}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.body.docs[0].email).to.equal('samplefoo@samplebar.com')
            done(err)
          })
      })
  })

  it('should allow to update an existing account', done => {
    let currentAccountId
    request(app)
      .post('/account')
      .send({ email: 'abc@def.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('abc@def.com')
        currentAccountId = res.body.docs._id

        request(app)
          .put(`/account/${currentAccountId}`)
          .send({ email: 'different@mail.com' })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.body.docs.email).to.equal('different@mail.com')
            done(err)
          })
      })
  })
})
