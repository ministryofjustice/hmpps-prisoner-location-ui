import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { ApiAction } from '../services/auditService'

export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    const { clientToken } = res.locals
    const download = await service.prisonerDownloadService.todaysFile(clientToken)
    res.render('pages/index', { latestFileName: download?.name })
  })
  get('/historic-reports', async (req, res, next) => {
    const { clientToken } = res.locals
    const downloads = await service.prisonerDownloadService.historicFiles(clientToken)
    res.render('pages/historic', { nomisReports: downloads?.files })
  })
  get('/download/:filename', async (req, res, next) => {
    const { filename } = req.params

    // want the audit to be async anyway so is a fire and forget
    // noinspection ES6MissingAwait
    service.auditService.sendEvent({
      who: res.locals.user.username,
      subjectId: filename,
      correlationId: req.id,
      what: `API_${ApiAction.Download}`,
    })
    const { clientToken } = res.locals
    const download = await service.prisonerDownloadService.download(clientToken, filename)
    res.type('application/x-zip-compressed')
    download.pipe(res)
  })

  return router
}
