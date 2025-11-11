import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class IndexPage extends AbstractPage {
  readonly header: Locator

  readonly headerUserName: Locator

  readonly headerPhaseBanner: Locator

  readonly downloadLink: Locator

  readonly noFiles: Locator

  readonly historic: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Download NOMIS Report' })
    this.headerUserName = page.getByTestId('header-user-name')
    this.headerPhaseBanner = page.getByTestId('header-phase-banner')
    this.downloadLink = page.getByTestId('download')
    this.noFiles = page.getByTestId('no-files')
    this.historic = page.getByTestId('historic')
  }

  static async verifyOnPage(page: Page): Promise<IndexPage> {
    const homePage = new IndexPage(page)
    await expect(homePage.header).toBeVisible()
    return homePage
  }

  async clickHistoric() {
    await this.historic.click()
  }
}
