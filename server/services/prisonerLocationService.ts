import { Readable } from 'stream'
import type { Download, Downloads } from '../data/prisonerLocationApiClient'
import PrisonerLocationApiClient from '../data/prisonerLocationApiClient'

export default class PrisonerLocationService {
  constructor(private readonly prisonerLocationApiClient: PrisonerLocationApiClient) {}

  async todaysFile(token: string): Promise<Download> {
    return this.prisonerLocationApiClient.todaysFile(token)
  }

  async historicFiles(token: string): Promise<Downloads> {
    return this.prisonerLocationApiClient.historicFiles(token)
  }

  async download(token: string, filename: string): Promise<Readable> {
    return this.prisonerLocationApiClient.download(token, filename)
  }
}
