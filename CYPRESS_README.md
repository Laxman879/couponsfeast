# Cypress E2E Testing Setup

## Prerequisites
- MongoDB running on localhost:27017
- Node.js installed

## Running Tests

### Option 1: Interactive Mode (Cypress UI)
```bash
# Run the batch file
run-fullstack-cypress.bat

# Or manually:
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev

# Terminal 3: Open Cypress
cd client
npm run cypress:open
```

### Option 2: Headless Mode (CI/CD)
```bash
# Run the batch file
run-tests.bat

# Or manually:
cd client
npm run test:e2e
```

## Test Files
- `cypress/e2e/homepage.cy.js` - Homepage tests
- `cypress/e2e/stores.cy.js` - Stores page tests
- `cypress/e2e/coupons.cy.js` - Coupons functionality tests
- `cypress/e2e/admin.cy.js` - Admin dashboard tests
- `cypress/e2e/api.cy.js` - API integration tests

## Custom Commands
- `cy.login(email, password)` - Login helper
- `cy.createStore(storeData)` - Create store via API
- `cy.createCoupon(couponData)` - Create coupon via API

## Configuration
Edit `client/cypress.config.js` to change:
- `baseUrl` - Frontend URL (default: http://localhost:3000)
- `env.apiUrl` - Backend API URL (default: http://localhost:5000/api)
