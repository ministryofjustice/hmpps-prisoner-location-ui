import { expect, test } from '@playwright/test'

import IndexPage from '../pages/indexPage'
import HistoricPage from '../pages/historicPage'
import { resetStubs } from '../mockApis/wiremock'
import prisonerLocationApi from '../mockApis/prisonerLocationApi'
import { login } from '../testUtils'

test.describe("Today's file", () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Will provide link for user to download latest file', async ({ page }) => {
    await prisonerLocationApi.stubTodaysFile()
    await login(page)

    const indexPage = await IndexPage.verifyOnPage(page)

    await expect(indexPage.downloadLink).toHaveAttribute('href', '/download/today.zip')
    await expect(indexPage.noFiles).toBeHidden()
  })

  test('Will not provide link if no file exists', async ({ page }) => {
    await prisonerLocationApi.stubTodaysFileMissing()
    await login(page)

    const indexPage = await IndexPage.verifyOnPage(page)

    await expect(indexPage.downloadLink).toBeHidden()
    await expect(indexPage.noFiles).toHaveText('No report for today is available at present.')
  })

  test('Will allow user to access historical reports', async ({ page }) => {
    await login(page)

    const indexPage = await IndexPage.verifyOnPage(page)

    await prisonerLocationApi.stubHistoricFiles()
    await indexPage.clickHistoric()
    await HistoricPage.verifyOnPage(page)
  })
})
