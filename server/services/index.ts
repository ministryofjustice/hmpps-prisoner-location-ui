import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerLocationService from './prisonerLocationService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient, prisonerLocationApiClient } = dataAccess

  return {
    applicationInfo,
    userService: new UserService(manageUsersApiClient),
    prisonerLocationService: new PrisonerLocationService(prisonerLocationApiClient),
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
