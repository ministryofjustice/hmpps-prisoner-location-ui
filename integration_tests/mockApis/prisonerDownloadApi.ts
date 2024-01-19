import { stubFor } from './wiremock'

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner-download-api/health/ping',
    },
    response: {
      status: 200,
    },
  })

export default {
  stubPrisonerDownloadPing: ping,
}
