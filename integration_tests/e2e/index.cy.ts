import IndexPage from '../pages/index'
import Page from '../pages/page'

context('Index', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', ['ROLE_PRISONER_DOWNLOAD'])
    cy.task('stubManageUser')
  })

  it('Will provide link for user to download latest file', () => {
    cy.task('stubTodaysFile')
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.downloadLink().should('exist').should('have.attr', 'href', '/today.zip')
    indexPage.noFiles().should('not.exist')
  })

  it('Will not provide link if no file exists', () => {
    cy.signIn()
    cy.task('stubTodaysFileMissing')
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.downloadLink().should('not.exist')
    indexPage.noFiles().should('exist').should('have.text', 'No files found for download.')
  })
})
