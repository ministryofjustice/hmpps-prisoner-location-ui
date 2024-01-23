import Page, { PageElement } from './page'

export default class HistoricPage extends Page {
  constructor() {
    super('NOMIS Reports from the last 14 days')
  }

  downloadLink = (index: number): PageElement => cy.get(`[data-qa=download${index}]`)

  noFiles = (): PageElement => cy.get('[data-qa=no-files]')
}
