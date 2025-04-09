import { Readable } from 'stream'
import type { Download, Downloads } from '../data/prisonerLocationApiClient'
import PrisonerLocationApiClient from '../data/prisonerLocationApiClient'

export default class PrisonerLocationService {
  constructor(private readonly prisonerLocationApiClient: PrisonerLocationApiClient) {}

  async todaysFile(username: string): Promise<Download> {
    return this.prisonerLocationApiClient.todaysFile(username)
  }

  async historicFiles(username: string): Promise<Downloads> {
    return this.prisonerLocationApiClient.historicFiles(username)
  }

  async download(username: string, filename: string): Promise<Readable> {
    return this.prisonerLocationApiClient.download(username, filename)
  }
}
