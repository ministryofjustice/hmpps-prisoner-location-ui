import { Readable } from 'stream'
import { ApiConfig, RestClient, SanitisedError, asSystem } from '@ministryofjustice/hmpps-rest-client'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export interface Download {
  name: string
  size: number
  lastModified: string
}
export interface Downloads {
  files: Download[]
}

export default class PrisonerLocationApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prisoner Location Api Client', config.apis.prisonerLocationApi as ApiConfig, logger, authenticationClient)
  }

  todaysFile(username: string): Promise<Download> {
    return this.get<Download>({ path: '/today', errorHandler: this.handleNotFoundError }, asSystem(username))
  }

  historicFiles(username: string): Promise<Downloads> {
    return this.get<Downloads>({ path: '/list' }, asSystem(username))
  }

  download(username: string, filename: string): Promise<Readable> {
    return this.stream({ path: `/download/${filename}` }, asSystem(username))
  }

  private handleNotFoundError<Response, ErrorData>(
    path: string,
    method: string,
    error: SanitisedError<ErrorData>,
  ): Response {
    if (error.status === 404) {
      logger.info(`Returned null for 404 not found when calling ${this.name}: ${path}`)
      return null
    }
    return this.handleError<Response, ErrorData>(path, method, error)
  }
}
