# 🔐 ADMIN APIs (25 endpoints)
**Full CRUD operations for admin panel**  
**Base URL**: `/api/admin`  
**Purpose**: Admin panel management and operations  
**Access Level**: Admin only (authentication required)  
**Operations**: Full CRUD operations for all resources

---

## Store Management APIs (5 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/stores/list` | GET | Get all stores with admin details (including inactive) |
| `/api/admin/stores/create` | POST | Create new store with full details |
| `/api/admin/stores/update/:id` | PUT | Update existing store information |
| `/api/admin/stores/delete/:id` | DELETE | Delete store (soft delete) |
| `/api/admin/stores/details/:id` | GET | Get store details for editing |

### Example Usage:
```javascript
// Get all stores for admin
fetch('/api/admin/stores/list', {
  headers: { 'Authorization': 'Bearer ' + adminToken }
})

// Create new store
fetch('/api/admin/stores/create', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Store',
    slug: 'new-store',
    description: 'Store description',
    logo: 'logo-url',
    website: 'https://store.com'
  })
})
```

---

## Coupon Management APIs (7 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/coupons/list` | GET | Get all coupons with admin details |
| `/api/admin/coupons/create` | POST | Create new coupon |
| `/api/admin/coupons/update/:id` | PUT | Update existing coupon |
| `/api/admin/coupons/delete/:id` | DELETE | Delete coupon |
| `/api/admin/coupons/details/:id` | GET | Get coupon details for editing |
| `/api/admin/coupons/by-store/:storeId` | GET | Get coupons by store for admin |
| `/api/admin/coupons/bulk-update` | POST | Bulk update multiple coupons |

### Example Usage:
```javascript
// Create new coupon
fetch('/api/admin/coupons/create', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Coupon',
    description: 'Coupon description',
    code: 'SAVE20',
    discount: '20%',
    storeId: 'store-id',
    expiryDate: '2024-12-31'
  })
})

// Bulk update coupons
fetch('/api/admin/coupons/bulk-update', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    couponIds: ['id1', 'id2', 'id3'],
    updates: { status: 'active' }
  })
})
```

---

## CMS Management APIs (8 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/cms/site-config` | GET | Get site configuration for admin |
| `/api/admin/cms/site-config/update` | PUT | Update site configuration |
| `/api/admin/cms/navigation` | GET | Get navigation structure for admin |
| `/api/admin/cms/navigation/update` | PUT | Update navigation menu |
| `/api/admin/cms/banners` | GET | Get all banners for admin |
| `/api/admin/cms/banners/create` | POST | Create new promotional banner |
| `/api/admin/cms/pages/:pageName` | GET | Get page content for editing |
| `/api/admin/cms/pages/:pageName/update` | PUT | Update page content |

### Example Usage:
```javascript
// Update site configuration
fetch('/api/admin/cms/site-config/update', {
  method: 'PUT',
  headers: { 
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    siteName: 'CouponsFeast',
    description: 'Best deals and coupons',
    logo: 'new-logo-url'
  })
})

// Create banner
fetch('/api/admin/cms/banners/create', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer ' + adminToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Holiday Sale',
    image: 'banner-image-url',
    link: '/holiday-deals',
    active: true
  })
})
```

---

## Upload Management APIs (3 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/upload/logo` | POST | Upload store logo or site images |
| `/api/admin/upload/logo/:filename` | DELETE | Delete uploaded image |
| `/api/admin/upload/test` | GET | Test upload functionality |

### Example Usage:
```javascript
// Upload logo
const formData = new FormData();
formData.append('logo', fileInput.files[0]);

fetch('/api/admin/upload/logo', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + adminToken },
  body: formData
})
```

---

## Dashboard & Analytics APIs (2 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/dashboard/stats` | GET | Get dashboard statistics and metrics |
| `/api/admin/system/health` | GET | Get admin system health status |

### Example Usage:
```javascript
// Get dashboard stats
fetch('/api/admin/dashboard/stats', {
  headers: { 'Authorization': 'Bearer ' + adminToken }
})
.then(response => response.json())
.then(data => {
  console.log('Total Stores:', data.totalStores);
  console.log('Total Coupons:', data.totalCoupons);
  console.log('Active Users:', data.activeUsers);
});
```

---

## Authentication & Authorization

### Required Headers:
```javascript
{
  'Authorization': 'Bearer ' + adminToken,
  'Content-Type': 'application/json'
}
```

### Admin Token Structure:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-id",
    "email": "admin@couponsfeast.com",
    "role": "admin",
    "permissions": ["read", "write", "delete"]
  },
  "expiresAt": "2024-01-01T00:00:00Z"
}
```

---

## Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Admin access required",
    "details": "Invalid or expired token"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Admin Panel Integration

### React Admin Panel Example:
```javascript
// services/adminApi.js
const BASE_URL = '/api/admin';
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json'
});

export const adminApi = {
  // Stores
  getStores: () => fetch(`${BASE_URL}/stores/list`, { headers: getAuthHeaders() }),
  createStore: (data) => fetch(`${BASE_URL}/stores/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  }),
  
  // Coupons
  getCoupons: () => fetch(`${BASE_URL}/coupons/list`, { headers: getAuthHeaders() }),
  createCoupon: (data) => fetch(`${BASE_URL}/coupons/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  }),
  
  // Dashboard
  getDashboardStats: () => fetch(`${BASE_URL}/dashboard/stats`, { headers: getAuthHeaders() })
};
```

---

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin-only access control
- **Input Validation**: All inputs validated and sanitized
- **Rate Limiting**: 200 requests per minute for admin users
- **Audit Logging**: All admin actions are logged
- **CSRF Protection**: Cross-site request forgery protection

---

## Validation Rules

### Store Creation:
```javascript
{
  name: { required: true, minLength: 2, maxLength: 100 },
  slug: { required: true, unique: true, pattern: /^[a-z0-9-]+$/ },
  description: { maxLength: 500 },
  website: { url: true },
  logo: { url: true }
}
```

### Coupon Creation:
```javascript
{
  title: { required: true, minLength: 5, maxLength: 200 },
  code: { required: true, minLength: 3, maxLength: 50 },
  discount: { required: true },
  storeId: { required: true, exists: 'stores' },
  expiryDate: { date: true, future: true }
}
```

---

**Total Admin APIs: 25 endpoints**