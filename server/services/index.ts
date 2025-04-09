import { dataAccess } from '../data'
import PrisonerLocationService from './prisonerLocationService'

export const services = () => {
  const { applicationInfo, prisonerLocationApiClient } = dataAccess()

  return {
    applicationInfo,
    prisonerLocationService: new PrisonerLocationService(prisonerLocationApiClient),
  }
}

export type Services = ReturnType<typeof services>
