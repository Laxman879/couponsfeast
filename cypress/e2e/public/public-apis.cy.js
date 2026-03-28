const BASE = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
const api = (path) => `${BASE}/api/public${path}`;

describe('Public APIs', () => {

  // ── Stores ──────────────────────────────────────────────────────────────
  describe('Stores', () => {
    it('GET /stores/list - returns array', () => {
      cy.request(api('/stores/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });

    it('GET /stores/details/:slug - returns store for valid slug', () => {
      cy.request(api('/stores/list')).then((res) => {
        const slug = res.body.data[0]?.slug;
        if (!slug) return;
        cy.request(api(`/stores/details/${slug}`)).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.body.success).to.be.true;
          expect(r.body.data).to.have.property('slug', slug);
        });
      });
    });

    it('GET /stores/details/:slug - 404 for unknown slug', () => {
      cy.request({ url: api('/stores/details/no-such-store-xyz'), failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.success).to.be.false;
      });
    });
  });

  // ── Coupons ──────────────────────────────────────────────────────────────
  describe('Coupons', () => {
    it('GET /coupons/list - returns array', () => {
      cy.request(api('/coupons/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });

    it('GET /coupons/details/:id - returns coupon for valid id', () => {
      cy.request(api('/coupons/list')).then((res) => {
        const id = res.body.data[0]?._id || res.body.data[0]?.id;
        if (!id) return;
        cy.request(api(`/coupons/details/${id}`)).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.body.success).to.be.true;
        });
      });
    });

    it('GET /coupons/details/:id - 404 for invalid id', () => {
      cy.request({ url: api('/coupons/details/000000000000000000000000'), failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.success).to.be.false;
      });
    });

    it('GET /coupons/search - returns array', () => {
      cy.request(api('/coupons/search?q=discount')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });

    it('GET /coupons/trending - returns array', () => {
      cy.request(api('/coupons/trending')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });

    it('POST /coupons/reveal/:id - reveals code for valid id', () => {
      cy.request(api('/coupons/list')).then((res) => {
        const id = res.body.data[0]?._id || res.body.data[0]?.id;
        if (!id) return;
        cy.request({ method: 'POST', url: api(`/coupons/reveal/${id}`) }).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.body.success).to.be.true;
        });
      });
    });

    it('POST /coupons/track-click/:id - tracks click for valid id', () => {
      cy.request(api('/coupons/list')).then((res) => {
        const id = res.body.data[0]?._id || res.body.data[0]?.id;
        if (!id) return;
        cy.request({ method: 'POST', url: api(`/coupons/track-click/${id}`) }).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.body.success).to.be.true;
        });
      });
    });
  });

  // ── Categories ───────────────────────────────────────────────────────────
  describe('Categories', () => {
    it('GET /categories/list - returns array', () => {
      cy.request(api('/categories/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });
  });

  // ── Popular Stores ────────────────────────────────────────────────────────
  describe('Popular Stores', () => {
    it('GET /popular-stores/list - returns array', () => {
      cy.request(api('/popular-stores/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });
  });

  // ── Featured Coupons ──────────────────────────────────────────────────────
  describe('Featured Coupons', () => {
    it('GET /featured-coupons/list - returns array', () => {
      cy.request(api('/featured-coupons/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });
  });

  // ── Banners ───────────────────────────────────────────────────────────────
  describe('Banners', () => {
    it('GET /site/banners/list - returns array', () => {
      cy.request(api('/site/banners/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });
  });

  // ── Navbar ────────────────────────────────────────────────────────────────
  describe('Navbar', () => {
    it('GET /navbar/navigation - returns navigation data', () => {
      cy.request(api('/navbar/navigation')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
      });
    });
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  describe('Footer', () => {
    it('GET /footer/links - returns array', () => {
      cy.request(api('/footer/links')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
      });
    });
  });

  // ── Pages / Site Config ───────────────────────────────────────────────────
  describe('Pages', () => {
    it('GET /site/config - returns site config', () => {
      cy.request(api('/site/config')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
      });
    });

    it('GET /site/:pageName - returns page content for valid page', () => {
      cy.request({ url: api('/site/about-us'), failOnStatusCode: false }).then((res) => {
        expect([200, 404]).to.include(res.status);
        expect(res.body).to.have.property('success');
      });
    });

    it('GET /site/:pageName - 404 for unknown page', () => {
      cy.request({ url: api('/site/no-such-page-xyz'), failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.success).to.be.false;
      });
    });
  });

});
