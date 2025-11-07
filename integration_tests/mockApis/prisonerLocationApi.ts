import { stubFor } from './wiremock'

const urlPrefix = '/prisoner-location-api'

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

const stubHistoricFiles = (filenames: string[] = ['today.zip']) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `${urlPrefix}/list`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        files: filenames.map(f => ({ name: f, size: 100 })),
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

const stubDownload = (filename: string = 'today.zip') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `${urlPrefix}/download/${filename}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/x-zip-compressed' },
      body: 'today file response content',
    },
  })
const stubDownloadMissing = (filename: string = 'today.zip') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `${urlPrefix}/download/${filename}`,
    },
    response: { status: 404 },
  })

export default {
  stubPing: ping,
  stubTodaysFile,
  stubTodaysFileMissing,
  stubHistoricFiles,
  stubDownload,
  stubDownloadMissing,
}
