describe('login page test', () => {
  it('visits the login page url and authenticate the user in successfully', () => {

    cy.visit('/login')

    cy.url().should('include', '/login')


    //Fill login with invalid login
    cy.get('[data-test="email"]').type('wronguer@test.com')
    cy.get('[data-test="password"]').type('wrong')
    cy.get('[data-test="login-btn"]').click()

    cy.contains('Invalid Credintials')

    // Fill the login form Correct first clear existing login data
    cy.get('[data-test="email"] input').clear().type('john@test.com')
    cy.get('[data-test="password"] input').clear().type('password')


    cy.get('[data-test="login-btn"]').click()

    // Assert successful login
    cy.url().should('not.include', '/login') // redirect occurred
    cy.contains('Task Manager 1.2') // or some protected content


    // Logout 
    cy.get('[data-test="logout-btn"]').click();
    cy.url().should('not.include', '/login')
    cy.url().should('not.include', 'john@test.com')
    cy.contains('Login')


  })
})
