# 🧪 Cypress API Tests - CouponsFeast

Comprehensive API testing suite for the CouponsFeast platform, organized by API categories.

## 📁 Test Structure

```
cypress/
├── e2e/
│   ├── public/          # 🌐 Public/Frontend API tests (15 endpoints)
│   ├── admin/           # 🔐 Admin API tests (25 endpoints)
│   ├── backend/         # ⚙️ Backend/System API tests (18 endpoints)
│   └── legacy/          # 🔄 Legacy API tests (35 endpoints)
├── support/
│   ├── commands.js      # Custom Cypress commands
│   └── e2e.js          # Global configuration and hooks
└── cypress.config.js    # Cypress configuration
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install cypress --save-dev
# or
yarn add cypress --dev
```

### 2. Environment Setup
Create `.env` file or set environment variables:
```bash
API_BASE_URL=http://localhost:5000
ADMIN_EMAIL=admin@couponsfeast.com
ADMIN_PASSWORD=admin123
SERVICE_TOKEN=your-service-token
```

### 3. Run Tests

#### Open Cypress Test Runner
```bash
npx cypress open
```

#### Run All API Tests
```bash
npm run test:api
```

#### Run Specific Category
```bash
npm run test:public    # Public APIs
npm run test:admin     # Admin APIs  
npm run test:backend   # Backend APIs
npm run test:legacy    # Legacy APIs
```

## 📋 Test Categories

### 🌐 Public/Frontend APIs (15 tests)
**File**: `cypress/e2e/public/public-apis.cy.js`
- ✅ Store APIs (3 endpoints)
- ✅ Coupon APIs (7 endpoints) 
- ✅ Site Content APIs (5 endpoints)
- ✅ Error handling tests

**Run**: `npm run test:public`

### 🔐 Admin APIs (25 tests)
**File**: `cypress/e2e/admin/admin-apis.cy.js`
- ✅ Store Management (5 endpoints)
- ✅ Coupon Management (7 endpoints)
- ✅ CMS Management (8 endpoints)
- ✅ Upload Management (3 endpoints)
- ✅ Dashboard & Analytics (2 endpoints)
- ✅ Authentication & Authorization tests

**Run**: `npm run test:admin`

### ⚙️ Backend/System APIs (18 tests)
**File**: `cypress/e2e/backend/backend-apis.cy.js`
- ✅ Analytics & Reporting (3 endpoints)
- ✅ Data Processing (4 endpoints)
- ✅ System Maintenance (3 endpoints)
- ✅ Cache Management (3 endpoints)
- ✅ Notification System (2 endpoints)
- ✅ Health Check (2 endpoints)
- ✅ System Status (1 endpoint)

**Run**: `npm run test:backend`

### 🔄 Legacy APIs (35 tests)
**File**: `cypress/e2e/legacy/legacy-apis.cy.js`
- ✅ All legacy endpoint categories
- ✅ Deprecation header validation
- ✅ Migration compatibility tests
- ✅ Backward compatibility verification

**Run**: `npm run test:legacy`

## 🛠️ Custom Commands

### Authentication Commands
```javascript
cy.loginAsAdmin()                    // Get admin token
cy.adminRequest(options)             // Make authenticated admin request
cy.backendRequest(options)           // Make backend service request
```

### Test Data Commands
```javascript
cy.createTestStore(storeData)        // Create test store
cy.createTestCoupon(couponData)      // Create test coupon
cy.cleanupTestData()                 // Clean up test data
cy.generateTestData('store')         // Generate test data
```

### Validation Commands
```javascript
cy.validateApiResponse(response)     // Validate API response structure
cy.checkDeprecationHeaders(response) // Check legacy API headers
cy.waitForApi()                      // Wait for API to be ready
```

## 📊 Test Execution Options

### Environment-Specific Testing
```bash
npm run test:dev      # Development environment
npm run test:staging  # Staging environment  
npm run test:prod     # Production environment
```

### Test Filtering
```bash
npm run test:smoke     # Smoke tests only
npm run test:critical  # Critical functionality tests
```

### Parallel Execution
```bash
npm run test:parallel  # Run tests in parallel
npm run test:record    # Record test results
```

### Reporting
```bash
npm run test:report           # Generate test reports
npm run test:report:merge     # Merge multiple reports
npm run test:report:generate  # Generate HTML report
npm run test:ci              # Full CI pipeline
```

## 🔧 Configuration

### Cypress Configuration (`cypress.config.js`)
```javascript
{
  baseUrl: 'http://localhost:3000',
  env: {
    API_BASE_URL: 'http://localhost:5000',
    ADMIN_EMAIL: 'admin@couponsfeast.com',
    ADMIN_PASSWORD: 'admin123',
    SERVICE_TOKEN: 'test-service-token'
  },
  retries: { runMode: 2, openMode: 0 },
  defaultCommandTimeout: 10000
}
```

### Environment Variables
```bash
# Required
API_BASE_URL=http://localhost:5000

# Admin Authentication
ADMIN_EMAIL=admin@couponsfeast.com
ADMIN_PASSWORD=admin123

# Backend Service Authentication
SERVICE_TOKEN=your-backend-service-token

# Optional
ENVIRONMENT=development
TEST_TIMEOUT=30000
RETRY_ATTEMPTS=2
```

## 📈 Test Coverage

### API Endpoint Coverage
- **Public APIs**: 15/15 endpoints (100%)
- **Admin APIs**: 25/25 endpoints (100%)
- **Backend APIs**: 18/18 endpoints (100%)
- **Legacy APIs**: 35/35 endpoints (100%)
- **Total**: 95/95 endpoints (100%)

### Test Types Coverage
- ✅ **Functional Tests**: All CRUD operations
- ✅ **Authentication Tests**: Token validation, permissions
- ✅ **Error Handling**: 4xx/5xx responses, edge cases
- ✅ **Performance Tests**: Response time validation
- ✅ **Security Tests**: Authorization, input validation
- ✅ **Integration Tests**: Cross-API functionality
- ✅ **Regression Tests**: Legacy compatibility

## 🚨 Common Issues & Solutions

### 1. API Server Not Running
```bash
# Error: connect ECONNREFUSED
# Solution: Start the API server
cd server && npm run dev
```

### 2. Authentication Failures
```bash
# Error: 401 Unauthorized
# Solution: Check admin credentials in environment
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD
```

### 3. Service Token Issues
```bash
# Error: Invalid service token
# Solution: Update SERVICE_TOKEN in environment
export SERVICE_TOKEN=your-valid-token
```

### 4. Database Connection Issues
```bash
# Error: Database connection failed
# Solution: Ensure MongoDB is running
mongod --dbpath /path/to/db
```

## 📝 Writing New Tests

### Test Structure Template
```javascript
describe('API Category', () => {
  const baseUrl = Cypress.env('API_BASE_URL');
  
  describe('Endpoint Group', () => {
    it('should perform specific action', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/endpoint`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  });
});
```

### Best Practices
1. **Use descriptive test names**
2. **Group related tests in describe blocks**
3. **Clean up test data after tests**
4. **Use custom commands for common operations**
5. **Validate both success and error scenarios**
6. **Check response structure and data types**
7. **Test authentication and authorization**

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:ci
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

### Docker Integration
```dockerfile
FROM cypress/included:latest
COPY . /app
WORKDIR /app
RUN npm install
CMD ["npm", "run", "test:ci"]
```

## 📞 Support

- 📖 **Documentation**: [Cypress Docs](https://docs.cypress.io)
- 🐛 **Issues**: Create GitHub issue with test failure details
- 💬 **Team Chat**: #testing channel
- 📧 **Email**: qa-team@couponsfeast.com

---

**Total Test Coverage: 95 API endpoints across 4 categories**  
**Last Updated**: January 2024  
**Cypress Version**: 13.x**