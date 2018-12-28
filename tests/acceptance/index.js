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

describe('Email endpoint', () => {
  it('should answer with 200 ok when a new valid Email is created via POST: /email', done => {
    request(app)
      .post('/email')
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

  it('retrieve at least one record on GET /emails after a valid POST was performed', done => {
    request(app)
      .get('/emails')
      .expect('200')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.greaterThan(0)
        done(err)
      })
  })

  it('should allow to look for an email by id', done => {
    let currentEmailId

    request(app)
      .post('/email')
      .send({ email: 'samplefoo@samplebar.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('samplefoo@samplebar.com')
        currentEmailId = res.body.docs._id
        done(err)
      })

    request(app)
      .get(`/email/${currentEmailId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs.email).to.equal('samplefoo@samplebar.com')
        done(err)
      })
  })

  it('should allow to update an existing email', done => {
    let currentEmailId

    request(app)
      .post('/email')
      .send({ email: 'abc@def.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('abc@def.com')
        currentEmailId = res.body.docs._id
        done(err)
      })

    request(app)
      .put(`/email/${currentEmailId}`)
      .send({ email: 'different@mail.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('different@mail.com')
        done(err)
      })
  })
})
