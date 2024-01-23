import { Readable } from 'stream'
import config from '../config'
import RestClient from './restClient'

export interface Download {
  name: string
  size: number
  lastModified: string
}
export interface Downloads {
  files: Download[]
}

export default class PrisonerDownloadApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Download Api Client', config.apis.prisonerDownloadApi, token)
  }

  todaysFile(token: string): Promise<Download> {
    return PrisonerDownloadApiClient.restClient(token).get<Download>({ path: '/today', ignore404: true })
  }

  historicFiles(token: string): Promise<Downloads> {
    return PrisonerDownloadApiClient.restClient(token).get<Downloads>({ path: '/list' })
  }

  download(token: string, filename: string): Promise<Readable> {
    return PrisonerDownloadApiClient.restClient(token).stream({ path: `/download/${filename}` })
  }
}
