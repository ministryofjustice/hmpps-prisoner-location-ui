import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import PrisonerDownloadService from '../services/prisonerDownloadService'
import { Download } from '../data/prisonerDownloadApiClient'

jest.mock('../services/prisonerDownloadService.ts')

const prisonerDownloadService = new PrisonerDownloadService(null) as jest.Mocked<PrisonerDownloadService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ services: { prisonerDownloadService } })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page if download available', () => {
    prisonerDownloadService.todaysFile.mockResolvedValue({ name: 'hello.zip' } as Download)
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('hello.zip')
        expect(res.text).not.toContain('No files found')
      })
  })
  it('should render index page if download available', () => {
    prisonerDownloadService.todaysFile.mockResolvedValue(null)
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain('hello.zip')
        expect(res.text).toContain('No files found')
      })
  })
})
