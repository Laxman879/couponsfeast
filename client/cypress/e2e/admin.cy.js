describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.visit('/admin/dashboard');
  });

  it('should display dashboard stats', () => {
    cy.contains('Total Stores').should('be.visible');
    cy.contains('Total Coupons').should('be.visible');
  });

  it('should navigate to manage stores', () => {
    cy.contains('Manage Stores').click();
    cy.url().should('include', '/admin/stores');
  });

  it('should create new store', () => {
    cy.visit('/admin/stores');
    cy.contains('Add Store').click();
    cy.get('input[name="name"]').type('Test Store');
    cy.get('input[name="slug"]').type('test-store');
    cy.get('input[name="website"]').type('https://test.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Store created successfully').should('be.visible');
  });

  it('should create new coupon', () => {
    cy.visit('/admin/coupons');
    cy.contains('Add Coupon').click();
    cy.get('input[name="title"]').type('Test Coupon');
    cy.get('input[name="code"]').type('TEST50');
    cy.get('input[name="discount"]').type('50% OFF');
    cy.get('button[type="submit"]').click();
    cy.contains('Coupon created successfully').should('be.visible');
  });
});
