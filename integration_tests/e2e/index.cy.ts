import IndexPage from '../pages/index'
import Page from '../pages/page'
import HistoricPage from '../pages/historic'

context("Today's file", () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', ['ROLE_PRISONER_LOCATION_DOWNLOAD'])
    cy.task('stubManageUser')
  })

  it('Will provide link for user to download latest file', () => {
    cy.task('stubTodaysFile')
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.downloadLink().should('exist').should('have.attr', 'href', '/download/today.zip')
    indexPage.noFiles().should('not.exist')
  })

  it('Will not provide link if no file exists', () => {
    cy.signIn()
    cy.task('stubTodaysFileMissing')
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.downloadLink().should('not.exist')
    indexPage.noFiles().should('exist').should('have.text', 'No report for today is available at present.')
  })

  it('Will allow user to access historical reports', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)

    cy.task('stubHistoricFiles')
    indexPage.historic().click()
    Page.verifyOnPage(HistoricPage)
  })
})
