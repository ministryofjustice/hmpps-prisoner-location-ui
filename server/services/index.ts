import { dataAccess } from '../data'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient, prisonerDownloadApiClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  return {
    applicationInfo,
    userService,
    prisonerDownloadApiClient,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
