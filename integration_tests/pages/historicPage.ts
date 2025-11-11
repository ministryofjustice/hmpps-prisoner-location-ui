import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class HistoricPage extends AbstractPage {
  readonly header: Locator

  readonly download1Link: Locator

  readonly download2Link: Locator

  readonly backLink: Locator

  readonly noFiles: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'NOMIS Reports from the last 14 days' })
    this.download1Link = page.getByTestId('download1')
    this.download2Link = page.getByTestId('download2')
    this.backLink = page.locator('a', { hasText: 'Back' })
    this.noFiles = page.getByTestId('no-files')
  }

  static async verifyOnPage(page: Page): Promise<HistoricPage> {
    const historicPage = new HistoricPage(page)
    await expect(historicPage.header).toBeVisible()
    return historicPage
  }
}
