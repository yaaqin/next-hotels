describe("Login Page", () => {
  it("should load the login page", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  it("should show login form", () => {
    cy.visit("/login");
    cy.get('#username').should("be.visible");
    cy.get('#password').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("superadmin should redirect to /dashboard", () => {
    cy.visit("/login");
    cy.get('#username').type("superadmin");
    cy.get('#password').type("@Hotel123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("restaurant owner should redirect to /restaurant", () => {
    cy.visit("/login");
    cy.get('#username').type("owner@sushijapan.com");
    cy.get('#password').type("@Resto123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/restaurant");
  });

  it("should stay on /login with wrong credentials", () => {
    cy.visit("/login");
    cy.get('#username').type("wrong_user");
    cy.get('#password').type("wrong_pass");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/login");
  });
});