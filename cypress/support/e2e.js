// cypress/support/e2e.js

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // Return false to prevent the error from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Global before hook
beforeEach(() => {
  // Set default headers for all requests
  cy.intercept('**', (req) => {
    req.headers['user-agent'] = 'Cypress Test Runner';
    req.headers['x-test-run'] = 'true';
  });
});

// Custom assertions for API responses
chai.use((chai, utils) => {
  utils.addMethod(chai.Assertion.prototype, 'validApiResponse', function () {
    const obj = this._obj;
    
    this.assert(
      obj && typeof obj === 'object',
      'expected #{this} to be an object',
      'expected #{this} not to be an object',
      obj
    );
    
    this.assert(
      obj.hasOwnProperty('success'),
      'expected #{this} to have property success',
      'expected #{this} not to have property success',
      obj
    );
    
    if (obj.success) {
      this.assert(
        obj.hasOwnProperty('data'),
        'expected successful response to have data property',
        'expected successful response not to have data property',
        obj
      );
    } else {
      this.assert(
        obj.hasOwnProperty('error'),
        'expected failed response to have error property',
        'expected failed response not to have error property',
        obj
      );
    }
  });
});

// Global after hook for cleanup
afterEach(() => {
  // Clean up any test data if needed
  // This can be customized based on your needs
});

// Add global constants
Cypress.env('TEST_DATA', {
  testStore: {
    name: 'Cypress Test Store',
    slug: 'cypress-test-store',
    description: 'Store created by Cypress tests',
    website: 'https://cypress-test-store.com',
    category: 'electronics'
  },
  testCoupon: {
    title: 'Cypress Test Coupon 50% Off',
    description: 'Coupon created by Cypress tests',
    code: 'CYPRESS50',
    discount: '50%',
    category: 'electronics',
    expiryDate: '2024-12-31'
  }
});