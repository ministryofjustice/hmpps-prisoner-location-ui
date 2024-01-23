import { Readable } from 'stream'
import type { Download, Downloads } from '../data/prisonerDownloadApiClient'
import PrisonerDownloadApiClient from '../data/prisonerDownloadApiClient'

export default class PrisonerDownloadService {
  constructor(private readonly prisonerDownloadApiClient: PrisonerDownloadApiClient) {}

  async todaysFile(token: string): Promise<Download> {
    return this.prisonerDownloadApiClient.todaysFile(token)
  }

  async historicFiles(token: string): Promise<Downloads> {
    return this.prisonerDownloadApiClient.historicFiles(token)
  }

  async download(token: string, filename: string): Promise<Readable> {
    return this.prisonerDownloadApiClient.download(token, filename)
  }
}
