describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load homepage successfully', () => {
    cy.contains('CouponsFeast').should('be.visible');
  });

  it('should display hero carousel', () => {
    cy.get('.hero-carousel').should('exist');
  });

  it('should navigate to stores page', () => {
    cy.contains('Stores').click();
    cy.url().should('include', '/stores');
  });

  it('should search for stores', () => {
    cy.get('input[placeholder*="Search"]').type('Amazon{enter}');
    cy.url().should('include', 'search');
  });
});
