import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class HistoricPage extends AbstractPage {
  readonly header: Locator

  readonly downloadLink: Locator

  readonly backLink: Locator

  readonly noFiles: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'NOMIS Reports from the last 14 days' })
    this.downloadLink = page.getByTestId('download')
    this.backLink = page.locator('a', { hasText: 'Back' })

    this.noFiles = page.getByTestId('nofiles')
  }

  static async verifyOnPage(page: Page): Promise<HistoricPage> {
    const historicPage = new HistoricPage(page)
    await expect(historicPage.header).toBeVisible()
    return historicPage
  }
}
