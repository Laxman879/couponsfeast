Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('createStore', (storeData) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/stores`, storeData);
});

Cypress.Commands.add('createCoupon', (couponData) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/coupons`, couponData);
});
