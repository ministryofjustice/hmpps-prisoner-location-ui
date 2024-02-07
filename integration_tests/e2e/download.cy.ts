import path from 'path'
import IndexPage from '../pages/index'
import Page from '../pages/page'
import HistoricPage from '../pages/historic'
import NotFoundPage from '../pages/notFoundPage'

context('Download files', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', ['ROLE_PRISONER_LOCATION'])
    cy.task('stubManageUser')
  })

  it("Will allow user to download today's file", () => {
    cy.task('stubTodaysFile')
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.downloadLink().should('exist').should('have.attr', 'href', '/download/today.zip')
    cy.task('stubDownload', 'today.zip')
    indexPage.downloadLink().click()

    const filename = path.join(downloadsFolder, 'today.zip')
    cy.readFile(filename, 'utf-8').should('equal', 'today file response content')
  })

  it('Will return 404 if file not found', () => {
    cy.task('stubTodaysFile')
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.downloadLink().should('exist').should('have.attr', 'href', '/download/today.zip')

    cy.task('stubDownloadMissing', 'today.zip')
    indexPage.downloadLink().click()

    Page.verifyOnPage(NotFoundPage)
  })

  it('Will allow user to download historical file', () => {
    cy.signIn()
    cy.task('stubHistoricFiles', ['yesterday.zip'])
    Page.verifyOnPage(IndexPage).historic().click()
    const historicPage = Page.verifyOnPage(HistoricPage)
    historicPage.downloadLink(1).should('exist').should('have.attr', 'href', '/download/yesterday.zip')

    cy.task('stubDownload', 'yesterday.zip')
    historicPage.downloadLink(1).click()

    const filename = path.join(downloadsFolder, 'yesterday.zip')
    cy.readFile(filename, 'utf-8').should('equal', 'today file response content')
  })
})
