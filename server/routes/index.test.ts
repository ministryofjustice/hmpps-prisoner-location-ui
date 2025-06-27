import type { Express } from 'express'
import request from 'supertest'
import { Readable } from 'stream'
import { appWithAllRoutes } from './testutils/appSetup'
import PrisonerLocationService from '../services/prisonerLocationService'
import { Download, Downloads } from '../data/prisonerLocationApiClient'

jest.mock('../services/prisonerLocationService.ts')

const prisonerLocationService = new PrisonerLocationService(null) as jest.Mocked<PrisonerLocationService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ services: { prisonerLocationService } })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render download if download available', () => {
    prisonerLocationService.todaysFile.mockResolvedValue({ name: 'hello.zip' } as Download)
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('hello.zip')
        expect(res.text).not.toContain('No report for today')
      })
  })
  it('should render no report found if download not available', () => {
    prisonerLocationService.todaysFile.mockResolvedValue(null)
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).not.toContain('hello.zip')
        expect(res.text).toContain('No report for today')
      })
  })

  it('service errors are handled', () => {
    prisonerLocationService.todaysFile.mockRejectedValue(new Error('Some problem calling external api!'))

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(500)
      .expect(res => {
        expect(res.text).toContain('Some problem calling external api!')
      })
  })
})

describe('GET /historic-reports', () => {
  it('should render downloads if available', () => {
    prisonerLocationService.historicFiles.mockResolvedValue({ files: [{ name: 'hello.zip' }] } as Downloads)
    return request(app)
      .get('/historic-reports')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('hello.zip')
        expect(res.text).not.toContain('No NOMIS Reports found')
      })
  })
  it('should render no files found if download not available', () => {
    prisonerLocationService.historicFiles.mockResolvedValue({ files: [] } as Downloads)
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
    prisonerLocationService.download.mockResolvedValue(Readable.from('john smith'))
    await request(app)
      .get('/download/file.zip')
      .expect('Content-Type', /x-zip/)
      .expect(res => {
        expect(res.text).toContain('john smith')
      })
    expect(prisonerLocationService.download).toHaveBeenCalledWith('user1', 'file.zip')
  })
  it('should render not found page if download not available', () => {
    prisonerLocationService.download.mockRejectedValue(new Error('Not Found'))
    return request(app)
      .get('/download/file.zip')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Not Found')
      })
  })
})
