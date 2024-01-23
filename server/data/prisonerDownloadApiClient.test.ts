import nock from 'nock'

import config from '../config'
import PrisonerDownloadApiClient from './prisonerDownloadApiClient'

jest.mock('./tokenStore/redisTokenStore')

const token = { access_token: 'token-1', expires_in: 300 }

describe('prisonerDownloadApiClient', () => {
  let fakePrisonerDownloadApiClient: nock.Scope
  let prisonerDownloadApiClient: PrisonerDownloadApiClient

  beforeEach(() => {
    fakePrisonerDownloadApiClient = nock(config.apis.prisonerDownloadApi.url)
    prisonerDownloadApiClient = new PrisonerDownloadApiClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('todaysFile', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakePrisonerDownloadApiClient
        .get('/today')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await prisonerDownloadApiClient.todaysFile(token.access_token)
      expect(output).toEqual(response)
    })
  })

  describe('historicFiles', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakePrisonerDownloadApiClient
        .get('/list')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await prisonerDownloadApiClient.historicFiles(token.access_token)
      expect(output).toEqual(response)
    })
  })

  describe('download', () => {
    it('should return data from api', async () => {
      fakePrisonerDownloadApiClient
        .get('/download/file.zip')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, 'some response', { 'Content-Type': 'application/x-zip-compressed' })
      const stream = await prisonerDownloadApiClient.download(token.access_token, 'file.zip')
      expect(stream.read()).toEqual(Buffer.from('some response'))
    })
  })
})
