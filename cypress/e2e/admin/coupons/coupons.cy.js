// ==========================================
// ADMIN COUPON API TESTS
// ==========================================

describe('Admin Coupon APIs', () => {
  const baseUrl = Cypress.env('API_BASE_URL') || 'http://localhost:5000/api';
  let authToken = 'test-admin-token'; // In real tests, get from login

  beforeEach(() => {
    // Setup any required data or authentication
  });

  describe('GET /api/admin/coupons/list', () => {
    it('should get all coupons for admin', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/admin/coupons/list`,
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property('_id');
          expect(response.body[0]).to.have.property('title');
          expect(response.body[0]).to.have.property('code');
          expect(response.body[0]).to.have.property('discountType');
          expect(response.body[0]).to.have.property('discountValue');
        }
      });
    });

    it('should require authentication', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/admin/coupons/list`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('POST /api/admin/coupons/create', () => {
    it('should create a new coupon', () => {
      const newCoupon = {
        title: 'Test Coupon',
        code: 'TEST20',
        description: 'Test coupon description',
        discountType: 'percentage',
        discountValue: 20,
        store: '507f1f77bcf86cd799439011',
        category: 'electronics',
        expiryDate: '2024-12-31',
        isActive: true
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/admin/coupons/create`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: newCoupon
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('_id');
        expect(response.body.title).to.eq(newCoupon.title);
        expect(response.body.code).to.eq(newCoupon.code);
      });
    });

    it('should validate required fields', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/admin/coupons/create`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          title: 'Incomplete Coupon'
          // Missing required fields
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('PUT /api/admin/coupons/update/:id', () => {
    it('should update an existing coupon', () => {
      // First create a coupon to update
      const newCoupon = {
        title: 'Update Test Coupon',
        code: 'UPDATE20',
        description: 'Test coupon for update',
        discountType: 'percentage',
        discountValue: 20,
        store: '507f1f77bcf86cd799439011',
        category: 'electronics',
        expiryDate: '2024-12-31',
        isActive: true
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/admin/coupons/create`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: newCoupon
      }).then((createResponse) => {
        const couponId = createResponse.body._id;
        
        // Now update the coupon
        const updatedData = {
          title: 'Updated Coupon Title',
          discountValue: 25
        };

        cy.request({
          method: 'PUT',
          url: `${baseUrl}/admin/coupons/update/${couponId}`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: updatedData
        }).then((updateResponse) => {
          expect(updateResponse.status).to.eq(200);
          expect(updateResponse.body.title).to.eq(updatedData.title);
          expect(updateResponse.body.discountValue).to.eq(updatedData.discountValue);
        });
      });
    });
  });

  describe('DELETE /api/admin/coupons/delete/:id', () => {
    it('should delete a coupon', () => {
      // First create a coupon to delete
      const newCoupon = {
        title: 'Delete Test Coupon',
        code: 'DELETE20',
        description: 'Test coupon for deletion',
        discountType: 'percentage',
        discountValue: 20,
        store: '507f1f77bcf86cd799439011',
        category: 'electronics',
        expiryDate: '2024-12-31',
        isActive: true
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/admin/coupons/create`,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: newCoupon
      }).then((createResponse) => {
        const couponId = createResponse.body._id;
        
        // Now delete the coupon
        cy.request({
          method: 'DELETE',
          url: `${baseUrl}/admin/coupons/delete/${couponId}`,
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
          expect(deleteResponse.body).to.have.property('message');
        });
      });
    });
  });

  describe('Admin Coupon API Performance', () => {
    it('should respond within acceptable time limits', () => {
      const startTime = Date.now();
      
      cy.request({
        method: 'GET',
        url: `${baseUrl}/admin/coupons/list`,
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }).then((response) => {
        const responseTime = Date.now() - startTime;
        
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(3000); // Should respond within 3 seconds
      });
    });
  });
});