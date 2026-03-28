const BASE = Cypress.env('API_BASE_URL') || 'http://localhost:5000';
const api = (path) => `${BASE}/api/public${path}`;

describe('Public Store APIs', () => {

  let realSlug;

  before(() => {
    cy.request(api('/stores/list')).then((res) => {
      realSlug = res.body[0]?.slug;
    });
  });

  describe('GET /stores/list', () => {
    it('returns 200 with array of stores', () => {
      cy.request(api('/stores/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array').and.have.length.greaterThan(0);
      });
    });

    it('each store has required fields', () => {
      cy.request(api('/stores/list')).then((res) => {
        res.body.forEach((store) => {
          expect(store).to.have.property('storeName');
          expect(store).to.have.property('slug');
          expect(store).to.have.property('isActive');
        });
      });
    });

    it('responds within 2 seconds', () => {
      const start = Date.now();
      cy.request(api('/stores/list')).then((res) => {
        expect(res.status).to.eq(200);
        expect(Date.now() - start).to.be.lessThan(2000);
      });
    });
  });

  describe('GET /stores/details/:slug', () => {
    it('returns store details by real slug', () => {
      cy.request(api(`/stores/details/${realSlug}`)).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('slug', realSlug);
        expect(res.body).to.have.property('storeName');
        expect(res.body).to.have.property('logo');
        expect(res.body).to.have.property('description');
      });
    });

    it('returns store details dynamically from list', () => {
      cy.request(api('/stores/list')).then((res) => {
        const slug = res.body[0]?.slug;
        if (!slug) return;
        cy.request(api(`/stores/details/${slug}`)).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.body.slug).to.eq(slug);
        });
      });
    });

    it('returns 404 for non-existent slug', () => {
      cy.request({ url: api('/stores/details/no-such-store-xyz'), failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property('error');
      });
    });
  });

});
