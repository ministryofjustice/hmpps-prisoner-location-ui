import { expect, test } from '@playwright/test'
import { text } from 'stream/consumers'

import prisonerLocationApi from '../mockApis/prisonerLocationApi'
import { login, resetStubs } from '../testUtils'
import IndexPage from '../pages/indexPage'
import HistoricPage from '../pages/historicPage'
import NotFoundPage from '../pages/notFoundPage'

test.describe('Download files', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test("Will allow user to download today's file", async ({ page }) => {
    await prisonerLocationApi.stubTodaysFile()
    await login(page, { roles: ['ROLE_PRISONER_LOCATION_DOWNLOAD'] })

    const indexPage = await IndexPage.verifyOnPage(page)

    await expect(indexPage.downloadLink).toHaveAttribute('href', '/download/today.zip')
    const downloadPromise = page.waitForEvent('download')
    await prisonerLocationApi.stubDownload()
    await indexPage.downloadLink.click()

    const download = await downloadPromise
    expect(download.suggestedFilename()).toEqual('today.zip')
    const contents = await text(await download.createReadStream())
    expect(contents).toEqual('today file response content')
  })

  test('Will return 404 if file not found', async ({ page }) => {
    await prisonerLocationApi.stubTodaysFile()
    await login(page, { roles: ['ROLE_PRISONER_LOCATION_DOWNLOAD'] })

    const indexPage = await IndexPage.verifyOnPage(page)

    await expect(indexPage.downloadLink).toHaveAttribute('href', '/download/today.zip')
    await prisonerLocationApi.stubTodaysFileMissing()
    await indexPage.downloadLink.click()

    await NotFoundPage.verifyOnPage(page)
  })

  test('Will allow user to download historical file', async ({ page }) => {
    await login(page, { roles: ['ROLE_PRISONER_LOCATION_DOWNLOAD'] })

    const indexPage = await IndexPage.verifyOnPage(page)

    await prisonerLocationApi.stubHistoricFiles(['yesterday.zip'])
    await indexPage.clickHistoric()
    const historicPage = await HistoricPage.verifyOnPage(page)

    await expect(historicPage.download1Link).toHaveAttribute('href', '/download/yesterday.zip')
    const downloadPromise = page.waitForEvent('download')
    await prisonerLocationApi.stubDownload('yesterday.zip')
    await historicPage.download1Link.click()

    const download = await downloadPromise
    const contents = await text(await download.createReadStream())
    expect(contents).toEqual('today file response content')
    expect(download.suggestedFilename()).toEqual('yesterday.zip')
  })
})
