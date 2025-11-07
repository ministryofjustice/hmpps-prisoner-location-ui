import { expect, Locator, Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class NotFoundPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Not Found' })
  }

  static async verifyOnPage(page: Page): Promise<NotFoundPage> {
    const notFoundPage = new NotFoundPage(page)
    await expect(notFoundPage.header).toBeVisible()
    return notFoundPage
  }
}
