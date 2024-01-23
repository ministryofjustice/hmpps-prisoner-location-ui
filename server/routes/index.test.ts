import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import PrisonerDownloadService from '../services/prisonerDownloadService'
import { Download, Downloads } from '../data/prisonerDownloadApiClient'

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
  it('should render download if download available', () => {
    prisonerDownloadService.todaysFile.mockResolvedValue({ name: 'hello.zip' } as Download)
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('hello.zip')
        expect(res.text).not.toContain('No files found')
      })
  })
  it('should render no files found if download not available', () => {
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

describe('GET /historic-reports', () => {
  it('should render downloads if available', () => {
    prisonerDownloadService.historicFiles.mockResolvedValue({ files: [{ name: 'hello.zip' }] } as Downloads)
    return request(app)
      .get('/historic-reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('hello.zip')
        expect(res.text).not.toContain('No NOMIS Reports found')
      })
  })
  it('should render no files found if download not available', () => {
    prisonerDownloadService.historicFiles.mockResolvedValue({ files: [] } as Downloads)
    return request(app)
      .get('/historic-reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain('hello.zip')
        expect(res.text).toContain('No NOMIS Reports found')
      })
  })
})
