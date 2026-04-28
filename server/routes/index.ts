import { Router } from 'express'

import type { Services } from '../services'

export default function routes(service: Services): Router {
  const router = Router()

  router.get('/', async (_req, res, _next) => {
    const { username } = res.locals.user
    const download = await service.prisonerLocationService.todaysFile(username)
    res.render('pages/index', { latestFileName: download?.name })
  })
  router.get('/historic-reports', async (_req, res, _next) => {
    const { username } = res.locals.user
    const downloads = await service.prisonerLocationService.historicFiles(username)
    res.render('pages/historic', { nomisReports: downloads?.files })
  })
  router.get('/download/:filename', async (req, res, _next) => {
    const { filename } = req.params
    const { username } = res.locals.user

    const download = await service.prisonerLocationService.download(username, filename)
    res.type('application/x-zip-compressed')
    download.pipe(res)
  })

  return router
}
