describe("Booking Flow", () => {
    beforeEach(() => {
        cy.loginByApi();
    });

    it("1. klik PESAN di navbar dan overlay muncul", () => {
        cy.visit("/");
        cy.get('[data-cy="btn-booking"]').click();
        cy.get('[data-cy="btn-reserve"]').should("be.visible");
    });

    it("2. pilih tanggal +3 hari dari hari ini", () => {
        cy.visit("/");
        cy.get('[data-cy="btn-booking"]').click();

        // Tunggu overlay muncul dulu
        cy.get('[data-cy="btn-reserve"]').should("be.visible");

        // Baru buka calendar
        cy.get('[data-cy="btn-open-calendar"]').should("be.visible").click();

        const target = new Date();
        target.setDate(target.getDate() + 3);
        const day = target.getDate().toString();

        cy.get("[role='gridcell'] button:not([disabled])")
            .contains(new RegExp(`^${day}$`))
            .click();

        cy.get('[data-cy="btn-reserve"]').should("not.be.disabled").click();
        cy.url().should("include", "/booking");
        cy.url().should("include", "checkin=");
    });

    it("3. pilih room dan klik Reserve Now", () => {
        const target = new Date();
        target.setDate(target.getDate() + 3);
        const checkin = target.toISOString().split("T")[0];

        cy.visit(`/booking?checkin=${checkin}`);
        cy.get("button").contains(/reserve now/i, { timeout: 10000 }).first().click();
        cy.url().should("include", "/reservation");
    });

    it("4. isi biodata dan pilih payment", () => {
        const target = new Date();
        target.setDate(target.getDate() + 3);
        const checkin = target.toISOString().split("T")[0];

        cy.visit(`/booking?checkin=${checkin}`);
        cy.get("button").contains(/reserve now/i, { timeout: 10000 }).first().click();
        cy.url().should("include", "/reservation");

        // Isi nama
        cy.get('input[type="text"]').first().clear().type("Agus Test");

        // Isi HP
        cy.get('input[type="tel"]').clear().type("081234567890");

        // Pilih ID type
        cy.get("select").select("KTP");

        // Isi nomor ID
        cy.get('input[type="text"]').eq(1).clear().type("3271010101010001");

        // Pilih nomor kamar
        cy.get('[data-cy="btn-select-room"]').should("not.be.disabled").click();
        cy.get('[data-cy="room-option"]').first().click();

        // Pilih Virtual Account
        cy.get('[data-cy="btn-payment-va"]').click();

        // Pilih BCA
        cy.get('[data-cy="btn-select-va"]').click();
        cy.get('[data-cy="va-option-va_bca"]').click();

        // Submit
        cy.get('[data-cy="btn-confirm-booking"]').click();
    });
});