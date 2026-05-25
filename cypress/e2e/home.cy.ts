describe("Home Page", () => {
  it("should load the homepage", () => {
    cy.visit("/");
    cy.url().should("include", "/");
  });
});