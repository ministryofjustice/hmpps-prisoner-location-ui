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

export default class PrisonerLocationApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Location Api Client', config.apis.prisonerLocationApi, token)
  }

  todaysFile(token: string): Promise<Download> {
    return PrisonerLocationApiClient.restClient(token).get<Download>({ path: '/today', ignore404: true })
  }

  historicFiles(token: string): Promise<Downloads> {
    return PrisonerLocationApiClient.restClient(token).get<Downloads>({ path: '/list' })
  }

  download(token: string, filename: string): Promise<Readable> {
    return PrisonerLocationApiClient.restClient(token).stream({ path: `/download/${filename}` })
  }
}
