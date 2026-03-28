describe('🔐 Admin APIs', () => {
  const baseUrl = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
  let adminToken;
  
  before(() => {
    // Login and get admin token
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/admin/login`,
      body: {
        email: Cypress.env('ADMIN_EMAIL') || 'admin@couponsfeast.com',
        password: Cypress.env('ADMIN_PASSWORD') || 'admin123'
      }
    }).then((response) => {
      adminToken = response.body.token;
    });
  });

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  });

  describe('Store Management APIs', () => {
    let createdStoreId;

    it('should get all stores for admin', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/stores/list`,
        headers: getAuthHeaders()
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should create new store', () => {
      const storeData = {
        name: 'Test Store',
        slug: 'test-store-' + Date.now(),
        description: 'Test store description',
        website: 'https://teststore.com',
        logo: 'https://teststore.com/logo.png',
        category: 'electronics',
        status: 'active'
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/admin/stores/create`,
        headers: getAuthHeaders(),
        body: storeData
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('id');
        createdStoreId = response.body.data.id;
      });
    });

    it('should get store details for editing', () => {
      if (createdStoreId) {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/api/admin/stores/details/${createdStoreId}`,
          headers: getAuthHeaders()
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('id', createdStoreId);
        });
      }
    });

    it('should update store', () => {
      if (createdStoreId) {
        const updateData = {
          name: 'Updated Test Store',
          description: 'Updated description'
        };

        cy.request({
          method: 'PUT',
          url: `${baseUrl}/api/admin/stores/update/${createdStoreId}`,
          headers: getAuthHeaders(),
          body: updateData
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
        });
      }
    });

    it('should delete store', () => {
      if (createdStoreId) {
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/api/admin/stores/delete/${createdStoreId}`,
          headers: getAuthHeaders()
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
        });
      }
    });
  });

  describe('Coupon Management APIs', () => {
    let createdCouponId;
    let testStoreId;

    before(() => {
      // Create a test store first
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/admin/stores/create`,
        headers: getAuthHeaders(),
        body: {
          name: 'Coupon Test Store',
          slug: 'coupon-test-store-' + Date.now(),
          description: 'Store for coupon testing'
        }
      }).then((response) => {
        testStoreId = response.body.data.id;
      });
    });

    it('should get all coupons for admin', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/coupons/list`,
        headers: getAuthHeaders()
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('should create new coupon', () => {
      const couponData = {
        title: 'Test Coupon 50% Off',
        description: 'Test coupon description',
        code: 'TEST50-' + Date.now(),
        discount: '50%',
        storeId: testStoreId,
        category: 'electronics',
        expiryDate: '2024-12-31',
        status: 'active'
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/admin/coupons/create`,
        headers: getAuthHeaders(),
        body: couponData
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('id');
        createdCouponId = response.body.data.id;
      });
    });

    it('should get coupon details for editing', () => {
      if (createdCouponId) {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/api/admin/coupons/details/${createdCouponId}`,
          headers: getAuthHeaders()
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.have.property('id', createdCouponId);
        });
      }
    });

    it('should get coupons by store for admin', () => {
      if (testStoreId) {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/api/admin/coupons/by-store/${testStoreId}`,
          headers: getAuthHeaders()
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
        });
      }
    });

    it('should bulk update coupons', () => {
      if (createdCouponId) {
        cy.request({
          method: 'POST',
          url: `${baseUrl}/api/admin/coupons/bulk-update`,
          headers: getAuthHeaders(),
          body: {
            couponIds: [createdCouponId],
            updates: { status: 'inactive' }
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
        });
      }
    });

    it('should update coupon', () => {
      if (createdCouponId) {
        cy.request({
          method: 'PUT',
          url: `${baseUrl}/api/admin/coupons/update/${createdCouponId}`,
          headers: getAuthHeaders(),
          body: {
            title: 'Updated Test Coupon',
            discount: '60%'
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
        });
      }
    });

    it('should delete coupon', () => {
      if (createdCouponId) {
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/api/admin/coupons/delete/${createdCouponId}`,
          headers: getAuthHeaders()
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
        });
      }
    });

    after(() => {
      // Clean up test store
      if (testStoreId) {
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/api/admin/stores/delete/${testStoreId}`,
          headers: getAuthHeaders()
        });
      }
    });
  });

  describe('CMS Management APIs', () => {
    it('should get site config for admin', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/cms/site-config`,
        headers: getAuthHeaders()
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });

    it('should update site configuration', () => {
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/api/admin/cms/site-config/update`,
        headers: getAuthHeaders(),
        body: {
          siteName: 'CouponsFeast Updated',
          description: 'Updated description'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });

    it('should get navigation for admin', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/cms/navigation`,
        headers: getAuthHeaders()
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });

    it('should get banners for admin', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/cms/banners`,
        headers: getAuthHeaders()
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });

    it('should create banner', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/admin/cms/banners/create`,
        headers: getAuthHeaders(),
        body: {
          title: 'Test Banner',
          image: 'https://example.com/banner.jpg',
          link: '/test-link',
          active: true
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('success', true);
      });
    });
  });

  describe('Dashboard & Analytics APIs', () => {
    it('should get dashboard statistics', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/dashboard/stats`,
        headers: getAuthHeaders()
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('totalStores');
        expect(response.body.data).to.have.property('totalCoupons');
      });
    });

    it('should get admin system health', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/system/health`,
        headers: getAuthHeaders()
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });
  });

  describe('Authentication & Authorization', () => {
    it('should reject requests without token', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/stores/list`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('success', false);
      });
    });

    it('should reject requests with invalid token', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/api/admin/stores/list`,
        headers: {
          'Authorization': 'Bearer invalid-token'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('success', false);
      });
    });
  });
});