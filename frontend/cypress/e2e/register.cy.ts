describe('registration page test', () => {
    it('visits the register page url and register the user with correct credentials and navigate to home', () => {

        cy.visit('/register')

        cy.url().should('include', '/register')

        // complete the registration form
        cy.get('[data-test="name"]').type('arthur')
        cy.get('[data-test="email"]').type('arthurverycoolll@test.com')
        cy.get('[data-test="password"]').type('password')
        cy.get('[data-test="password_confirmation"]').type('password')

        // Submit the form
        cy.get('[data-test="register-btn"]').click()

        // Mock successful login
        cy.url().should('not.include', '/register') // successully logged
        cy.contains('arthurverycoolll@test.com') // User email displayed in side bar check it
    })
})
