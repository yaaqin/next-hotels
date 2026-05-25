declare namespace Cypress {
  interface Chainable {
    loginByApi(): Chainable<void>;
  }
}