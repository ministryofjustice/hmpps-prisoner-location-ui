import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    const { clientToken } = res.locals
    const download = await service.prisonerDownloadService.todaysFile(clientToken)
    res.render('pages/index', { latestFileName: download?.name })
  })

  return router
}
