import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiHttp from 'chai-http'
import path = require("path")
import * as request from 'superagent'
import { Pact, Interaction, Matchers } from '@pact-foundation/pact'

const expect = chai.expect
const { term } = Matchers

chai.use(chaiAsPromised)

describe('UUID API', () => {
  const provider = new Pact({
    log: path.resolve(process.cwd(), "logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    consumer: "UUIDValidate",
    provider: "UUIDGenerate"
  })

  before(() =>
    provider.setup().then(opts => {
      process.env.MOCK_PORT = `${opts.port}`
    })
  )

  afterEach(() => provider.verify())

  after(() => provider.finalize())

  describe('get /uuid', () => {
    before(() => {
      return provider.addInteraction({
        state: 'request UUID',
        uponReceiving: 'Respond with random UUID',
        withRequest: {
          path: '/api/v0/uuid',
          method: 'GET'
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: {
            uuid: term({
              generate: '356c1f6a-896f-491e-ad5d-23b522961d26',
              matcher: '\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}'
            })
          }
        }
      })
    })

    it('will receive a new UUID', done => {
      request.get(`http://localhost:${process.env.MOCK_PORT}/api/v0/uuid`)
        .set({ 'Accept': 'application/json' })
        .then((response) => {
          expect(response.body.uuid).to.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)
        })
        .then(done)
    })
  })

  describe('post /uuid/validate/:uuidStr', () => {
    before(() => {
      return provider.addInteraction({
        state: 'valid UUID',
        uponReceiving: 'Respond with validation status true',
        withRequest: {
          path: '/api/v0/uuid/validate/356c1f6a-896f-491e-ad5d-23b522961d26',
          method: 'GET'
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: {
            uuid: '356c1f6a-896f-491e-ad5d-23b522961d26',
            validate: true
          }
        }
      })
    })

    it('return validation true', done => {
      const validBody = {
        uuid: '356c1f6a-896f-491e-ad5d-23b522961d26',
        validate: true
      }

      request.get(`http://localhost:${process.env.MOCK_PORT}/api/v0/uuid/validate/356c1f6a-896f-491e-ad5d-23b522961d26`)
        .set({ 'Accept': 'application/json' })
        .then((response) => {
          expect(response.body).to.eql(validBody)
        })
        .then(done)
    })
  })

  describe('post /uuid/validate/:uuidStr', () => {
    before(() => {
      return provider.addInteraction({
        state: 'generic string',
        uponReceiving: 'Respond with validation status false',
        withRequest: {
          path: '/api/v0/uuid/validate/genericstring',
          method: 'GET'
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: {
            uuid: 'genericstring',
            validate: false
          }
        }
      })
    })

    it('return validation false', done => {
      const invalidBody = {
        uuid: 'genericstring',
        validate: false
      }

      request.get(`http://localhost:${process.env.MOCK_PORT}/api/v0/uuid/validate/genericstring`)
        .set({ 'Accept': 'application/json' })
        .then((response) => {
          expect(response.body).to.eql(invalidBody)
        })
        .then(done)
    })
  })
})
