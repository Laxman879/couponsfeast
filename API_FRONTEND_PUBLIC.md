# 🌐 FRONTEND/PUBLIC APIs (15 endpoints)
**Read-only access for website visitors**  
**Base URL**: `/api/public`  
**Purpose**: Frontend consumption, public data access  
**Access Level**: Public (no authentication required)  
**Operations**: Read-only operations for website visitors

---

## Store APIs (3 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/public/stores/list` | GET | Get all active stores with basic information |
| `/api/public/stores/details/:slug` | GET | Get detailed store information by slug |
| `/api/public/stores/popular` | GET | Get list of popular/featured stores |

### Example Usage:
```javascript
// Get all stores
fetch('/api/public/stores/list')

// Get specific store
fetch('/api/public/stores/details/amazon')

// Get popular stores
fetch('/api/public/stores/popular')
```

---

## Coupon APIs (7 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/public/coupons/list` | GET | Get all active coupons with pagination |
| `/api/public/coupons/details/:id` | GET | Get detailed coupon information by ID |
| `/api/public/coupons/search` | GET | Search coupons with filters (query, category, store) |
| `/api/public/coupons/trending` | GET | Get trending/most popular coupons |
| `/api/public/coupons/by-store/:storeSlug` | GET | Get all coupons for a specific store |
| `/api/public/coupons/by-category/:category` | GET | Get coupons filtered by category |
| `/api/public/coupons/reveal/:id` | POST | Reveal coupon code and track usage |

### Example Usage:
```javascript
// Get all coupons
fetch('/api/public/coupons/list?page=1&limit=20')

// Search coupons
fetch('/api/public/coupons/search?q=discount&category=electronics')

// Get store coupons
fetch('/api/public/coupons/by-store/amazon')

// Reveal coupon code
fetch('/api/public/coupons/reveal/123', { method: 'POST' })
```

---

## Site Content APIs (5 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/public/site/config` | GET | Get site configuration (title, description, settings) |
| `/api/public/site/navigation` | GET | Get navigation menu structure |
| `/api/public/site/footer-links` | GET | Get footer links and social media |
| `/api/public/site/banners` | GET | Get active promotional banners |
| `/api/public/site/pages/:pageName` | GET | Get static page content (about, privacy, terms) |

### Example Usage:
```javascript
// Get site config
fetch('/api/public/site/config')

// Get navigation
fetch('/api/public/site/navigation')

// Get page content
fetch('/api/public/site/pages/about-us')
```

---

## Response Format

All public APIs return data in this format:

```json
{
  "success": true,
  "data": {
    // Actual response data
  },
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Frontend Integration

### React/Next.js Example:
```javascript
// services/publicApi.js
const BASE_URL = '/api/public';

export const publicApi = {
  // Stores
  getStores: () => fetch(`${BASE_URL}/stores/list`).then(r => r.json()),
  getStore: (slug) => fetch(`${BASE_URL}/stores/details/${slug}`).then(r => r.json()),
  
  // Coupons
  getCoupons: (params) => fetch(`${BASE_URL}/coupons/list?${new URLSearchParams(params)}`).then(r => r.json()),
  searchCoupons: (query) => fetch(`${BASE_URL}/coupons/search?q=${query}`).then(r => r.json()),
  revealCoupon: (id) => fetch(`${BASE_URL}/coupons/reveal/${id}`, { method: 'POST' }).then(r => r.json()),
  
  // Site Content
  getSiteConfig: () => fetch(`${BASE_URL}/site/config`).then(r => r.json()),
  getNavigation: () => fetch(`${BASE_URL}/site/navigation`).then(r => r.json())
};
```

---

## Security & Rate Limiting

- **No Authentication Required**: All endpoints are publicly accessible
- **Rate Limiting**: 100 requests per minute per IP
- **CORS Enabled**: For frontend consumption
- **Data Sanitization**: All responses are sanitized for XSS protection
- **Cache Headers**: Appropriate caching headers for performance

---

## Performance Optimization

- **Caching**: Responses cached for 5-15 minutes
- **Pagination**: Large datasets are paginated
- **Compression**: Gzip compression enabled
- **CDN Ready**: Responses optimized for CDN caching

---

**Total Frontend/Public APIs: 15 endpoints**