import { stubFor } from './wiremock'

const urlPrefix = '/manage-users-api'

const stubUser = (name: string = 'john smith') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `${urlPrefix}/users/me`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        username: 'USER1',
        active: true,
        name,
      },
    },
  })

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

export default {
  stubManageUser: stubUser,
  stubManageUsersPing: ping,
}
