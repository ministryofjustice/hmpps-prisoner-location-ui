import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerDownloadService from './prisonerDownloadService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient, prisonerDownloadApiClient } = dataAccess

  return {
    applicationInfo,
    userService: new UserService(manageUsersApiClient),
    prisonerDownloadService: new PrisonerDownloadService(prisonerDownloadApiClient),
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
