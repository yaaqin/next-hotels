// Password dev/staging semua akun admin disamakan (lihat doc/v2/24-akses-login)
const PASSWORD = "@Hotel123";

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

  it("superadmin should redirect to /config-panel", () => {
    cy.visit("/login");
    cy.get('#username').type("superadmin");
    cy.get('#password').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/config-panel");
  });

  it("superadmin can open /dashboard from config panel", () => {
    cy.visit("/login");
    cy.get('#username').type("superadmin");
    cy.get('#password').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/config-panel");
    cy.get('a[href="/dashboard"][title="Buka dashboard monitoring"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("restaurant owner should redirect to /restaurant", () => {
    cy.visit("/login");
    cy.get('#username').type("owner@sushijapan.com");
    cy.get('#password').type(PASSWORD);
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