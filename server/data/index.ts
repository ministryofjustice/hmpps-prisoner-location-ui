/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import hmppsAuthClient from './hmppsAuthClient'
import ManageUsersApiClient from './manageUsersApiClient'
import PrisonerDownloadApiClient from './prisonerDownloadApiClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'

export const dataAccess = {
  applicationInfo,
  getSystemToken: hmppsAuthClient(
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  ),
  manageUsersApiClient: new ManageUsersApiClient(),
  prisonerDownloadApiClient: new PrisonerDownloadApiClient(),
}

export { ManageUsersApiClient, PrisonerDownloadApiClient }
