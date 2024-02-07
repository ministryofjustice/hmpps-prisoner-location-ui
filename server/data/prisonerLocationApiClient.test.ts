import nock from 'nock'

import config from '../config'
import PrisonerLocationApiClient from './prisonerLocationApiClient'

jest.mock('./tokenStore/redisTokenStore')

const token = { access_token: 'token-1', expires_in: 300 }

describe('prisonerLocationApiClient', () => {
  let fakePrisonerLocationApiClient: nock.Scope
  let prisonerLocationApiClient: PrisonerLocationApiClient

  beforeEach(() => {
    fakePrisonerLocationApiClient = nock(config.apis.prisonerLocationApi.url)
    prisonerLocationApiClient = new PrisonerLocationApiClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('todaysFile', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakePrisonerLocationApiClient
        .get('/today')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await prisonerLocationApiClient.todaysFile(token.access_token)
      expect(output).toEqual(response)
    })
  })

  describe('historicFiles', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakePrisonerLocationApiClient
        .get('/list')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await prisonerLocationApiClient.historicFiles(token.access_token)
      expect(output).toEqual(response)
    })
  })

  describe('download', () => {
    it('should return data from api', async () => {
      fakePrisonerLocationApiClient
        .get('/download/file.zip')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, 'some response', { 'Content-Type': 'application/x-zip-compressed' })
      const stream = await prisonerLocationApiClient.download(token.access_token, 'file.zip')
      expect(stream.read()).toEqual(Buffer.from('some response'))
    })
  })
})
