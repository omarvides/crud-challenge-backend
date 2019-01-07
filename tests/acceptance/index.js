const request = require('supertest')
const { expect } = require('chai')
const app = require('../../server/index')
const uuidv4 = require('uuid/v4')

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

  it('should have a /metrics endpoint that works propperly', done => {
    request(app)
      .get('/metrics')
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })
})

describe('/account endpoint', () => {
  it('should answer with 200 ok when a new valid Account is created via POST: /account', done => {
    request(app)
      .post('/account')
      .send({ id: uuidv4(), email: 'foo@bar.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('foo@bar.com')
        done(err)
      })
  }).timeout(500)

  it('should answer with 400: Bad request when a non valid email is sent to POST: /account', done => {
    request(app)
      .post('/account')
      .send({ id: uuidv4(), email: 'non_valid_email' })
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.text).to.equal(
          '{"message":"The value of email must be a valid email"}',
        )
        done()
      })
  }).timeout(500)

  it('retrieve at least one record on GET /accounts after a valid POST was performed', done => {
    request(app)
      .get('/accounts')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        expect(res.body.docs.length).to.be.greaterThan(0)
        done(err)
      })
  })

  it('should allow to look for an created account by id', done => {
    let currentAccountId = uuidv4()
    request(app)
      .post('/account')
      .send({ id: currentAccountId, email: 'samplefoo@samplebar.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('samplefoo@samplebar.com')

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
    let currentAccountId = uuidv4()
    request(app)
      .post('/account')
      .send({ id: currentAccountId, email: 'abc@def.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('abc@def.com')

        request(app)
          .put(`/account/${currentAccountId}`)
          .send({ id: currentAccountId, email: 'different@mail.com' })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.body.docs.email).to.equal('different@mail.com')
            done(err)
          })
      })
  })

  it('should answer with 400: Bad request when trying to update with a non valid email via PUT: /account', done => {
    let currentAccountId = uuidv4()
    request(app)
      .post('/account')
      .send({ id: currentAccountId, email: 'yetanother@email.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('yetanother@email.com')

        request(app)
          .put(`/account/${currentAccountId}`)
          .send({ email: 'non_valid_email' })
          .expect(400)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.text).to.equal(
              '{"message":"The value of email must be a valid email"}',
            )
            done()
          })
      })
  })

  it('should allow to delete an existing account', done => {
    let currentAccountId = uuidv4()
    request(app)
      .post('/account')
      .send({ id: currentAccountId, email: 'delete@me.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('delete@me.com')

        request(app)
          .delete(`/account/${currentAccountId}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            done(err)
          })
      })
  })

  it('should not allow to create an account with an email already registered', done => {
    let currentAccountId = uuidv4()
    request(app)
      .post('/account')
      .send({ id: currentAccountId, email: 'duplicated@email.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('duplicated@email.com')

        request(app)
          .post('/account')
          .send({ id: uuidv4(), email: 'duplicated@email.com' })
          .expect(400)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(err).to.exist
            done()
          })
      })
  })
})

it('should not allow to create an account with an id already registered', done => {
  let currentAccountId = uuidv4()
  request(app)
    .post('/account')
    .send({ id: currentAccountId, email: 'anew@email.com' })
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      expect(res.body.docs).to.exist
      expect(res.body.docs).to.be.an('object')
      expect(res.body.docs.email).to.equal('anew@email.com')

      request(app)
        .post('/account')
        .send({ id: currentAccountId, email: 'anew@email.com' })
        .expect(400)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(err).to.exist
          done()
        })
    })
})

it('should not allow to update an account with an email that is already registered', done => {
  let firstAccountId = uuidv4()
  let secondAccountId = uuidv4()
  request(app)
    .post('/account')
    .send({ id: firstAccountId, email: 'first@email.com' })
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      expect(res.body.docs).to.exist
      expect(res.body.docs).to.be.an('object')
      expect(res.body.docs.email).to.equal('first@email.com')

      request(app)
        .post('/account')
        .send({ id: secondAccountId, email: 'second@email.com' })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body.docs).to.exist
          expect(res.body.docs).to.be.an('object')
          expect(res.body.docs.email).to.equal('second@email.com')

          request(app)
            .put(`/account/${secondAccountId}`)
            .send({ email: 'fist@email.com' })
            .expect(400)
            .expect('Content-Type', /json/)
            .end((err, res) => {
              expect(err).to.exist
              done()
            })
        })
    })
})

describe('/email endpoint', () => {
  it('should allow to query if an email exists', done => {
    let currentAccountId = uuidv4()
    request(app)
      .post('/account')
      .send({ id: currentAccountId, email: 'samplequery@email.com' })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.docs).to.exist
        expect(res.body.docs).to.be.an('object')
        expect(res.body.docs.email).to.equal('samplequery@email.com')

        request(app)
          .get(`/email/samplequery@email.com`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.body.exists).to.equal(true)
            done(err)
          })
      })
  })
})
