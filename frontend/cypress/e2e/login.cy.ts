describe('login page test', () => {
  it('visits the login page url and authenticate the user in successfully', () => {

    cy.visit('/login') 


    cy.url().should('include', '/login')

    // Fill the login form
    cy.get('[data-test="email"]').type('john@test.com')
    cy.get('[data-test="password"]').type('password')

    // Submit the form
    cy.get('[data-test="login-btn"]').click()

    // Assert successful login
    cy.url().should('not.include', '/login') // redirect occurred
    cy.contains('Task Manager 1.2') // or some protected content
  })
})
