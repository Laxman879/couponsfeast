const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    env: {
      // API Configuration
      API_BASE_URL: 'http://localhost:5000',
      
      // Admin Credentials (use environment variables in CI/CD)
      ADMIN_EMAIL: 'admin@couponsfeast.com',
      ADMIN_PASSWORD: 'admin123',
      
      // Service Token for Backend APIs
      SERVICE_TOKEN: 'test-service-token-12345',
      
      // Test Configuration
      TEST_TIMEOUT: 30000,
      RETRY_ATTEMPTS: 2
    },

    setupNodeEvents(on, config) {
      // Custom tasks and plugins can be added here
      
      // Task to generate test reports
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Custom task to validate API responses
        validateApiResponse(response) {
          const isValid = response && 
                          typeof response.status === 'number' && 
                          response.body !== undefined;
          return isValid;
        }
      });

      // Plugin to handle different environments
      if (config.env.ENVIRONMENT) {
        switch (config.env.ENVIRONMENT) {
          case 'development':
            config.env.API_BASE_URL = 'http://localhost:5000';
            break;
          case 'staging':
            config.env.API_BASE_URL = 'https://staging-api.couponsfeast.com';
            break;
          case 'production':
            config.env.API_BASE_URL = 'https://api.couponsfeast.com';
            break;
        }
      }

      return config;
    },

    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0
    }
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js'
  }
});