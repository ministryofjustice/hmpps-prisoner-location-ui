import PrisonerDownloadService from './prisonerDownloadService'
import PrisonerDownloadApiClient, { type Download, Downloads } from '../data/prisonerDownloadApiClient'
import createUserToken from '../testutils/createUserToken'

jest.mock('../data/prisonerDownloadApiClient')

describe('Prisoner Download service', () => {
  let prisonerDownloadApiClient: jest.Mocked<PrisonerDownloadApiClient>
  let prisonerDownloadService: PrisonerDownloadService

  describe('todaysFile', () => {
    beforeEach(() => {
      prisonerDownloadApiClient = new PrisonerDownloadApiClient() as jest.Mocked<PrisonerDownloadApiClient>
      prisonerDownloadService = new PrisonerDownloadService(prisonerDownloadApiClient)
    })

    it("Retrieves today's file", async () => {
      const token = createUserToken([])
      prisonerDownloadApiClient.todaysFile.mockResolvedValue({ name: 'john smith' } as Download)

      const result = await prisonerDownloadService.todaysFile(token)

      expect(result.name).toEqual('john smith')
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      prisonerDownloadApiClient.todaysFile.mockRejectedValue(new Error('some error'))

      await expect(prisonerDownloadService.todaysFile(token)).rejects.toEqual(new Error('some error'))
    })
  })

  describe('historicFiles', () => {
    beforeEach(() => {
      prisonerDownloadApiClient = new PrisonerDownloadApiClient() as jest.Mocked<PrisonerDownloadApiClient>
      prisonerDownloadService = new PrisonerDownloadService(prisonerDownloadApiClient)
    })

    it("Retrieves today's file", async () => {
      const token = createUserToken([])
      prisonerDownloadApiClient.historicFiles.mockResolvedValue({ files: [{ name: 'john smith' }] } as Downloads)

      const result = await prisonerDownloadService.historicFiles(token)

      expect(result.files).toHaveLength(1)
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      prisonerDownloadApiClient.historicFiles.mockRejectedValue(new Error('some error'))

      await expect(prisonerDownloadService.historicFiles(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
