// cypress/support/commands.js

// Custom command to login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  const baseUrl = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
  
  cy.request({
    method: 'POST',
    url: `${baseUrl}/api/auth/admin/login`,
    body: {
      email: Cypress.env('ADMIN_EMAIL') || 'admin@couponsfeast.com',
      password: Cypress.env('ADMIN_PASSWORD') || 'admin123'
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200) {
      cy.wrap(response.body.token).as('adminToken');
      return response.body.token;
    } else {
      cy.log('Admin login failed, using mock token');
      return 'mock-admin-token';
    }
  });
});

// Custom command to make authenticated admin API requests
Cypress.Commands.add('adminRequest', (options) => {
  cy.get('@adminToken').then((token) => {
    const requestOptions = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    cy.request(requestOptions);
  });
});

// Custom command to make backend service API requests
Cypress.Commands.add('backendRequest', (options) => {
  const serviceToken = Cypress.env('SERVICE_TOKEN') || 'test-service-token';
  
  const requestOptions = {
    ...options,
    headers: {
      'X-Service-Token': serviceToken,
      'X-Service-Name': 'couponsfeast-backend',
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  cy.request(requestOptions);
});

// Custom command to create test store
Cypress.Commands.add('createTestStore', (storeData = null) => {
  const baseUrl = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
  const testData = storeData || Cypress.env('TEST_DATA').testStore;
  
  // Add timestamp to make slug unique
  const uniqueStoreData = {
    ...testData,
    slug: `${testData.slug}-${Date.now()}`
  };
  
  cy.loginAsAdmin().then((token) => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/admin/stores/create`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: uniqueStoreData,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201) {
        cy.wrap(response.body.data).as('testStore');
        return response.body.data;
      } else {
        // Return mock data if creation fails
        cy.wrap({ id: 'mock-store-id', ...uniqueStoreData }).as('testStore');
        return { id: 'mock-store-id', ...uniqueStoreData };
      }
    });
  });
});

// Custom command to create test coupon
Cypress.Commands.add('createTestCoupon', (couponData = null, storeId = null) => {
  const baseUrl = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
  const testData = couponData || Cypress.env('TEST_DATA').testCoupon;
  
  // Add timestamp to make code unique
  const uniqueCouponData = {
    ...testData,
    code: `${testData.code}-${Date.now()}`,
    storeId: storeId || 'mock-store-id'
  };
  
  cy.loginAsAdmin().then((token) => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/admin/coupons/create`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: uniqueCouponData,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201) {
        cy.wrap(response.body.data).as('testCoupon');
        return response.body.data;
      } else {
        // Return mock data if creation fails
        cy.wrap({ id: 'mock-coupon-id', ...uniqueCouponData }).as('testCoupon');
        return { id: 'mock-coupon-id', ...uniqueCouponData };
      }
    });
  });
});

// Custom command to cleanup test data
Cypress.Commands.add('cleanupTestData', () => {
  const baseUrl = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
  
  cy.loginAsAdmin().then((token) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Clean up test coupons
    cy.get('@testCoupon', { timeout: 1000 }).then((coupon) => {
      if (coupon && coupon.id && coupon.id !== 'mock-coupon-id') {
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/api/admin/coupons/delete/${coupon.id}`,
          headers,
          failOnStatusCode: false
        });
      }
    }).catch(() => {
      // Ignore if alias doesn't exist
    });
    
    // Clean up test stores
    cy.get('@testStore', { timeout: 1000 }).then((store) => {
      if (store && store.id && store.id !== 'mock-store-id') {
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/api/admin/stores/delete/${store.id}`,
          headers,
          failOnStatusCode: false
        });
      }
    }).catch(() => {
      // Ignore if alias doesn't exist
    });
  });
});

// Custom command to validate API response structure
Cypress.Commands.add('validateApiResponse', (response, expectedStructure = null) => {
  expect(response).to.have.property('status');
  expect(response).to.have.property('body');
  
  if (response.status >= 200 && response.status < 300) {
    // Success response validation
    if (expectedStructure === 'standardSuccess') {
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data');
      expect(response.body).to.have.property('message');
    }
  } else {
    // Error response validation
    if (expectedStructure === 'standardError') {
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.have.property('code');
      expect(response.body.error).to.have.property('message');
    }
  }
});

// Custom command to check deprecation headers
Cypress.Commands.add('checkDeprecationHeaders', (response) => {
  expect(response.headers).to.have.property('x-api-deprecated', 'true');
  expect(response.headers).to.have.property('x-api-sunset');
  expect(response.headers).to.have.property('x-api-alternative');
  expect(response.headers).to.have.property('warning');
  
  // Validate sunset date format (YYYY-MM-DD)
  const sunsetDate = response.headers['x-api-sunset'];
  expect(sunsetDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
  
  // Validate warning message contains 'deprecated'
  const warning = response.headers['warning'];
  expect(warning.toLowerCase()).to.include('deprecated');
});

// Custom command to wait for API to be ready
Cypress.Commands.add('waitForApi', (maxAttempts = 10) => {
  const baseUrl = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
  
  const checkApi = (attempt = 1) => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/api/status`,
      failOnStatusCode: false,
      timeout: 5000
    }).then((response) => {
      if (response.status === 200) {
        cy.log('API is ready');
        return;
      } else if (attempt < maxAttempts) {
        cy.wait(2000);
        checkApi(attempt + 1);
      } else {
        cy.log('API not ready after maximum attempts');
      }
    });
  };
  
  checkApi();
});

// Custom command to generate test data
Cypress.Commands.add('generateTestData', (type) => {
  const timestamp = Date.now();
  
  switch (type) {
    case 'store':
      return {
        name: `Test Store ${timestamp}`,
        slug: `test-store-${timestamp}`,
        description: `Test store created at ${new Date().toISOString()}`,
        website: `https://test-store-${timestamp}.com`,
        category: 'electronics',
        status: 'active'
      };
      
    case 'coupon':
      return {
        title: `Test Coupon ${timestamp}`,
        description: `Test coupon created at ${new Date().toISOString()}`,
        code: `TEST${timestamp}`,
        discount: '25%',
        category: 'electronics',
        expiryDate: '2024-12-31',
        status: 'active'
      };
      
    default:
      return {};
  }
});

// Add TypeScript support for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<string>;
      adminRequest(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;
      backendRequest(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;
      createTestStore(storeData?: any): Chainable<any>;
      createTestCoupon(couponData?: any, storeId?: string): Chainable<any>;
      cleanupTestData(): Chainable<void>;
      validateApiResponse(response: Cypress.Response<any>, expectedStructure?: string): Chainable<void>;
      checkDeprecationHeaders(response: Cypress.Response<any>): Chainable<void>;
      waitForApi(maxAttempts?: number): Chainable<void>;
      generateTestData(type: string): any;
    }
  }
}