import type { Download } from '../data/prisonerDownloadApiClient'
import PrisonerDownloadApiClient from '../data/prisonerDownloadApiClient'

export default class PrisonerDownloadService {
  constructor(private readonly prisonerDownloadApiClient: PrisonerDownloadApiClient) {}

  async todaysFile(token: string): Promise<Download> {
    return this.prisonerDownloadApiClient.todaysFile(token)
  }
}
