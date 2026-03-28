describe('Stores', () => {
  beforeEach(() => {
    cy.visit('/stores');
  });

  it('should display list of stores', () => {
    cy.get('[data-testid="store-card"]').should('have.length.greaterThan', 0);
  });

  it('should filter stores by search', () => {
    cy.get('input[placeholder*="Search"]').type('Amazon');
    cy.get('[data-testid="store-card"]').should('contain', 'Amazon');
  });

  it('should navigate to store detail page', () => {
    cy.get('[data-testid="store-card"]').first().click();
    cy.url().should('include', '/store/');
  });
});
