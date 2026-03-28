describe('API Integration', () => {
  const apiUrl = Cypress.env('apiUrl');

  it('should fetch all stores', () => {
    cy.request(`${apiUrl}/stores`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should fetch all coupons', () => {
    cy.request(`${apiUrl}/coupons`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should create a store', () => {
    cy.request('POST', `${apiUrl}/stores`, {
      name: 'Cypress Test Store',
      slug: 'cypress-test',
      website: 'https://cypress.io',
      description: 'Test store',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
    });
  });

  it('should create a coupon', () => {
    cy.request(`${apiUrl}/stores`).then((storesResponse) => {
      const storeId = storesResponse.body[0]._id;
      
      cy.request('POST', `${apiUrl}/coupons`, {
        title: 'Cypress Test Coupon',
        code: 'CYPRESS50',
        discount: '50% OFF',
        store: storeId,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('_id');
      });
    });
  });
});
