describe('Coupons', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display coupon cards', () => {
    cy.get('[data-testid="coupon-card"]').should('have.length.greaterThan', 0);
  });

  it('should click coupon and track', () => {
    cy.get('[data-testid="coupon-card"]').first().click();
    cy.get('[data-testid="coupon-code"]').should('be.visible');
  });

  it('should copy coupon code', () => {
    cy.get('[data-testid="coupon-card"]').first().click();
    cy.get('[data-testid="copy-button"]').click();
    cy.contains('Copied').should('be.visible');
  });
});
