import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import PrisonerLocationApiClient from './prisonerLocationApiClient'
import logger from '../../logger'
import config from '../config'
import { createRedisClient } from './redisClient'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    prisonerLocationApiClient: new PrisonerLocationApiClient(hmppsAuthClient),
  }
}

export { PrisonerLocationApiClient }
