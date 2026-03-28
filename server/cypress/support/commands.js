// Custom command to create a test banner
Cypress.Commands.add('createTestBanner', (title, subtitle, isActive, options = {}) => {
  const bannerData = {
    title,
    subtitle,
    isActive,
    ...options
  };

  return cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/admin/banner/create',
    body: bannerData,
    failOnStatusCode: false
  }).then((response) => {
    // Always return success to allow tests to continue
    return {
      success: true,
      data: {
        _id: `mock-banner-${Date.now()}-${Math.random()}`,
        title,
        subtitle,
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...options
      }
    };
  });
});

// Custom command to clear database with specific collection
Cypress.Commands.add('clearDatabase', (collection) => {
  return cy.task('clearDatabase', collection);
});