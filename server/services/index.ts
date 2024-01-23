import { SQSClient } from '@aws-sdk/client-sqs'

import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerDownloadService from './prisonerDownloadService'
import config from '../config'
import { auditService as AuditService } from './auditService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient, prisonerDownloadApiClient } = dataAccess

  const auditService = AuditService({
    sqsClient: new SQSClient({ region: config.apis.audit.region }),
    queueUrl: config.apis.audit.queueUrl,
    serviceName: config.apis.audit.serviceName,
    enabled: config.apis.audit.enabled,
  })

  return {
    applicationInfo,
    auditService,
    userService: new UserService(manageUsersApiClient),
    prisonerDownloadService: new PrisonerDownloadService(prisonerDownloadApiClient),
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
