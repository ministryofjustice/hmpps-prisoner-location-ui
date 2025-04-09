import nock from 'nock'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import config from '../config'
import PrisonerLocationApiClient from './prisonerLocationApiClient'

describe('prisonerLocationApiClient', () => {
  let fakePrisonerLocationApiClient: nock.Scope
  let prisonerLocationApiClient: PrisonerLocationApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    fakePrisonerLocationApiClient = nock(config.apis.prisonerLocationApi.url)
    prisonerLocationApiClient = new PrisonerLocationApiClient(mockAuthenticationClient)
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
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, response)

      const output = await prisonerLocationApiClient.todaysFile('bobuser')
      expect(output).toEqual(response)
      expect(nock.isDone()).toBe(true)
    })

    it('should return null if receive 404', async () => {
      fakePrisonerLocationApiClient
        .get('/today')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(404, { data: 'data' })

      const output = await prisonerLocationApiClient.todaysFile('bobuser')
      expect(output).toBeNull()
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('historicFiles', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakePrisonerLocationApiClient
        .get('/list')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, response)

      const output = await prisonerLocationApiClient.historicFiles('bobuser')
      expect(output).toEqual(response)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('download', () => {
    it('should return data from api', async () => {
      fakePrisonerLocationApiClient
        .get('/download/file.zip')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, 'some response', { 'Content-Type': 'application/x-zip-compressed' })
      const stream = await prisonerLocationApiClient.download('bobuser', 'file.zip')
      expect(stream.read()).toEqual(Buffer.from('some response'))
      expect(nock.isDone()).toBe(true)
    })
  })
})
