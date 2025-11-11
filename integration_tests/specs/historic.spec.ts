import { expect, test } from '@playwright/test'

import IndexPage from '../pages/indexPage'
import HistoricPage from '../pages/historicPage'
import { resetStubs } from '../mockApis/wiremock'
import { login } from '../testUtils'
import prisonerLocationApi from '../mockApis/prisonerLocationApi'

test.describe('Historic files', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Will provide link for user to download file', async ({ page }) => {
    await login(page, { roles: ['ROLE_PRISONER_LOCATION_DOWNLOAD'] })

    const indexPage = await IndexPage.verifyOnPage(page)

    await prisonerLocationApi.stubHistoricFiles()
    await indexPage.clickHistoric()
    const historicPage = await HistoricPage.verifyOnPage(page)
    await expect(historicPage.download1Link).toHaveAttribute('href', '/download/today.zip')
    await expect(historicPage.noFiles).toBeHidden()
  })

  test('Will provide link for multiple files', async ({ page }) => {
    await login(page, { roles: ['ROLE_PRISONER_LOCATION_DOWNLOAD'] })

    const indexPage = await IndexPage.verifyOnPage(page)

    await prisonerLocationApi.stubHistoricFiles(['today.zip', 'yesterday.zip'])
    await indexPage.clickHistoric()
    const historicPage = await HistoricPage.verifyOnPage(page)
    await expect(historicPage.download1Link).toHaveAttribute('href', '/download/today.zip')
    await expect(historicPage.download2Link).toHaveAttribute('href', '/download/yesterday.zip')
    await expect(historicPage.noFiles).toBeHidden()
  })

  test('Will not provide link if no file exists', async ({ page }) => {
    await login(page, { roles: ['ROLE_PRISONER_LOCATION_DOWNLOAD'] })

    const indexPage = await IndexPage.verifyOnPage(page)

    await prisonerLocationApi.stubHistoricFiles([])
    await indexPage.clickHistoric()
    const historicPage = await HistoricPage.verifyOnPage(page)
    await expect(historicPage.download1Link).toBeHidden()
    await expect(historicPage.noFiles).toHaveText('No NOMIS Reports found for the last 14 days.')
  })

  test('Will provide link back to home', async ({ page }) => {
    await login(page, { roles: ['ROLE_PRISONER_LOCATION_DOWNLOAD'] })

    const indexPage = await IndexPage.verifyOnPage(page)

    await prisonerLocationApi.stubHistoricFiles([])
    await indexPage.clickHistoric()
    const historicPage = await HistoricPage.verifyOnPage(page)
    await historicPage.backLink.click()
    await IndexPage.verifyOnPage(page)
  })
})
