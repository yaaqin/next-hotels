Cypress.Commands.add("loginByApi", () => {
  cy.setCookie("next-auth.session-token", Cypress.env("SESSION_TOKEN"));
  cy.setCookie("userToken", Cypress.env("USER_TOKEN"));
});