import { stubFor } from './wiremock'

const urlPrefix = '/prisoner-download-api'

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `${urlPrefix}/health/ping`,
    },
    response: {
      status: 200,
    },
  })

const stubTodaysFile = (filename: string = 'today.zip') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `${urlPrefix}/today`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        name: filename,
        size: 100,
      },
    },
  })

const stubTodaysFileMissing = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `${urlPrefix}/today`,
    },
    response: { status: 404 },
  })

export default {
  stubPrisonerDownloadPing: ping,
  stubTodaysFile,
  stubTodaysFileMissing,
}
