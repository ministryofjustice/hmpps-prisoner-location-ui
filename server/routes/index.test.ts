import type { Express } from 'express'
import request from 'supertest'
import { Readable } from 'stream'
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
        expect(res.text).not.toContain('No report for today')
      })
  })
  it('should render no report found if download not available', () => {
    prisonerDownloadService.todaysFile.mockResolvedValue(null)
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain('hello.zip')
        expect(res.text).toContain('No report for today')
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

describe('GET /download', () => {
  it('should return download if available', async () => {
    prisonerDownloadService.download.mockResolvedValue(Readable.from('john smith'))
    await request(app)
      .get('/download/file.zip')
      .expect('Content-Type', /x-zip/)
      .expect(res => {
        expect(res.text).toContain('john smith')
      })
    expect(prisonerDownloadService.download).toHaveBeenCalledWith(undefined, 'file.zip')
  })
  it('should render not found page if download not available', () => {
    prisonerDownloadService.download.mockRejectedValue(new Error('Not Found'))
    return request(app)
      .get('/download/file.zip')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Not Found')
      })
  })
})
