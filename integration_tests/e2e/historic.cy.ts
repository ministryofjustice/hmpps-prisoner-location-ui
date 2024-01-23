import IndexPage from '../pages/index'
import Page from '../pages/page'
import HistoricPage from '../pages/historic'

context('Index', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', ['ROLE_PRISONER_DOWNLOAD'])
    cy.task('stubManageUser')
  })

  it('Will provide link for user to download file', () => {
    cy.task('stubHistoricFiles', ['today.zip'])
    cy.signIn()
    Page.verifyOnPage(IndexPage).historic().click()
    const historicPage = Page.verifyOnPage(HistoricPage)
    historicPage.downloadLink(1).should('exist').should('have.attr', 'href', '/today.zip')
    historicPage.noFiles().should('not.exist')
  })

  it('Will provide link for multiple files', () => {
    cy.task('stubHistoricFiles', ['today.zip', 'yesterday.zip'])
    cy.signIn()
    Page.verifyOnPage(IndexPage).historic().click()
    const historicPage = Page.verifyOnPage(HistoricPage)
    historicPage.downloadLink(1).should('exist').should('have.attr', 'href', '/today.zip')
    historicPage.downloadLink(2).should('exist').should('have.attr', 'href', '/yesterday.zip')
    historicPage.noFiles().should('not.exist')
  })

  it('Will not provide link if no file exists', () => {
    cy.signIn()
    cy.task('stubHistoricFiles', [])
    Page.verifyOnPage(IndexPage).historic().click()
    const historicPage = Page.verifyOnPage(HistoricPage)
    historicPage.downloadLink(1).should('not.exist')
    historicPage.noFiles().should('exist').should('have.text', 'No NOMIS Reports found for the last 14 days.')
  })
})
