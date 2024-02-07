import { Readable } from 'stream'
import PrisonerLocationService from './prisonerLocationService'
import PrisonerLocationApiClient, { type Download, Downloads } from '../data/prisonerLocationApiClient'
import createUserToken from '../testutils/createUserToken'

jest.mock('../data/prisonerLocationApiClient')

describe('Prisoner Location service', () => {
  let prisonerLocationApiClient: jest.Mocked<PrisonerLocationApiClient>
  let prisonerLocationService: PrisonerLocationService

  describe('todaysFile', () => {
    beforeEach(() => {
      prisonerLocationApiClient = new PrisonerLocationApiClient() as jest.Mocked<PrisonerLocationApiClient>
      prisonerLocationService = new PrisonerLocationService(prisonerLocationApiClient)
    })

    it("Retrieves today's file", async () => {
      const token = createUserToken([])
      prisonerLocationApiClient.todaysFile.mockResolvedValue({ name: 'john smith' } as Download)

      const result = await prisonerLocationService.todaysFile(token)

      expect(result.name).toEqual('john smith')
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      prisonerLocationApiClient.todaysFile.mockRejectedValue(new Error('some error'))

      await expect(prisonerLocationService.todaysFile(token)).rejects.toEqual(new Error('some error'))
    })
  })

  describe('historicFiles', () => {
    beforeEach(() => {
      prisonerLocationApiClient = new PrisonerLocationApiClient() as jest.Mocked<PrisonerLocationApiClient>
      prisonerLocationService = new PrisonerLocationService(prisonerLocationApiClient)
    })

    it("Retrieves today's file", async () => {
      const token = createUserToken([])
      prisonerLocationApiClient.historicFiles.mockResolvedValue({ files: [{ name: 'john smith' }] } as Downloads)

      const result = await prisonerLocationService.historicFiles(token)

      expect(result.files).toHaveLength(1)
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      prisonerLocationApiClient.historicFiles.mockRejectedValue(new Error('some error'))

      await expect(prisonerLocationService.historicFiles(token)).rejects.toEqual(new Error('some error'))
    })
  })

  describe('download', () => {
    beforeEach(() => {
      prisonerLocationApiClient = new PrisonerLocationApiClient() as jest.Mocked<PrisonerLocationApiClient>
      prisonerLocationService = new PrisonerLocationService(prisonerLocationApiClient)
    })

    it("Retrieves today's file", async () => {
      const token = createUserToken([])
      prisonerLocationApiClient.download.mockResolvedValue(Readable.from('john smith'))

      const result = await prisonerLocationService.download(token, 'file.zip')

      expect(result.read()).toEqual('john smith')
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      prisonerLocationApiClient.download.mockRejectedValue(new Error('some error'))

      await expect(prisonerLocationService.download(token, 'file.zip')).rejects.toEqual(new Error('some error'))
    })
  })
})
