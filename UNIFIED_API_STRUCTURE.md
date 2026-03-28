# Unified API Structure - Admin + Public Only

## Architecture Overview

The CouponsFeast API has been restructured into a **unified backend system** with only two main categories:

- **Public APIs** - Read-only access for website visitors
- **Admin APIs** - Full access including CRUD operations and backend management

## Key Benefits

✅ **Simplified Architecture** - Only 2 API categories instead of 4  
✅ **Unified Admin Control** - Admin has access to all operations  
✅ **No Duplicate APIs** - Eliminated 35 duplicate endpoints  
✅ **Clear Separation** - Public (read-only) vs Admin (full access)  
✅ **Backend Integration** - All system operations under admin control  

## API Structure

### 1. Public APIs (`/api/public/`)
**Purpose:** Read-only access for website visitors  
**Total Endpoints:** 15  
**Access Level:** Public

#### Store APIs
- `GET /api/public/stores/list` - Get all stores
- `GET /api/public/stores/details/:slug` - Get store by slug

#### Coupon APIs  
- `GET /api/public/coupons/list` - Get all coupons
- `GET /api/public/coupons/details/:id` - Get coupon by ID
- `GET /api/public/coupons/search` - Search coupons
- `GET /api/public/coupons/trending` - Get trending coupons
- `POST /api/public/coupons/reveal/:id` - Reveal coupon code
- `POST /api/public/coupons/track-click/:id` - Track coupon click

#### Category APIs
- `GET /api/public/categories/list` - Get all categories
- `GET /api/public/popular-stores/list` - Get popular stores

#### Featured Content APIs
- `GET /api/public/featured-coupons/list` - Get featured coupons

#### CMS APIs
- `GET /api/public/site/config` - Get site configuration
- `GET /api/public/site/navigation` - Get navigation menu
- `GET /api/public/site/banners` - Get banners
- `GET /api/public/site/pages/:pageName` - Get page content

#### Footer APIs
- `GET /api/public/footer/links` - Get footer links

### 2. Admin APIs (`/api/admin/`)
**Purpose:** Full CRUD operations + Backend management  
**Total Endpoints:** 43  
**Access Level:** Admin Only

#### Store Management (5 endpoints)
- `GET /api/admin/stores/list` - List all stores
- `GET /api/admin/stores/details/:id` - Get store details
- `POST /api/admin/stores/create` - Create new store
- `PUT /api/admin/stores/update/:id` - Update store
- `DELETE /api/admin/stores/delete/:id` - Delete store

#### Coupon Management (5 endpoints)
- `GET /api/admin/coupons/list` - List all coupons
- `GET /api/admin/coupons/details/:id` - Get coupon details
- `POST /api/admin/coupons/create` - Create new coupon
- `PUT /api/admin/coupons/update/:id` - Update coupon
- `DELETE /api/admin/coupons/delete/:id` - Delete coupon

#### Category Management (4 endpoints)
- `GET /api/admin/categories/list` - List categories
- `POST /api/admin/categories/create` - Create category
- `PUT /api/admin/categories/update/:id` - Update category
- `DELETE /api/admin/categories/delete/:id` - Delete category

#### Popular Stores Management (4 endpoints)
- `GET /api/admin/popular-stores/list` - List popular stores
- `POST /api/admin/popular-stores/create` - Create popular store
- `PUT /api/admin/popular-stores/update/:id` - Update popular store
- `DELETE /api/admin/popular-stores/delete/:id` - Delete popular store

#### Featured Coupons Management (4 endpoints)
- `GET /api/admin/featured-coupons/list` - List featured coupons
- `POST /api/admin/featured-coupons/create` - Create featured coupon
- `PUT /api/admin/featured-coupons/update/:id` - Update featured coupon
- `DELETE /api/admin/featured-coupons/delete/:id` - Delete featured coupon

#### CMS Management (6 endpoints)
- `GET /api/admin/cms/site-config` - Get site configuration
- `PUT /api/admin/cms/site-config/update` - Update site configuration
- `GET /api/admin/cms/navigation` - Get navigation
- `PUT /api/admin/cms/navigation/update` - Update navigation
- `GET /api/admin/cms/banners/list` - List banners
- `POST /api/admin/cms/banners/create` - Create banner
- `GET /api/admin/cms/pages/:pageName` - Get page
- `PUT /api/admin/cms/pages/:pageName/update` - Update page

#### Footer Links Management (4 endpoints)
- `GET /api/admin/footer-links/list` - List footer links
- `POST /api/admin/footer-links/create` - Create footer link
- `PUT /api/admin/footer-links/update/:id` - Update footer link
- `DELETE /api/admin/footer-links/delete/:id` - Delete footer link

#### File Upload Management (3 endpoints)
- `GET /api/admin/upload/test` - Test upload endpoint
- `POST /api/admin/upload/logo` - Upload logo
- `DELETE /api/admin/upload/logo/delete/:filename` - Delete logo

#### Analytics & Reporting (3 endpoints)
- `GET /api/admin/analytics/coupon-performance` - Coupon analytics
- `GET /api/admin/analytics/store-performance` - Store analytics
- `GET /api/admin/analytics/user-behavior` - User behavior analytics

#### Data Processing (4 endpoints)
- `POST /api/admin/data/bulk-import/coupons` - Bulk import coupons
- `POST /api/admin/data/bulk-import/stores` - Bulk import stores
- `GET /api/admin/data/export/coupons` - Export coupons
- `GET /api/admin/data/export/stores` - Export stores

#### System Management (3 endpoints)
- `POST /api/admin/system/cleanup/expired-coupons` - Cleanup expired coupons
- `POST /api/admin/system/optimize/database` - Optimize database
- `GET /api/admin/system/logs/errors` - Get error logs

#### Cache Management (3 endpoints)
- `POST /api/admin/cache/clear/all` - Clear all cache
- `POST /api/admin/cache/clear/coupons` - Clear coupon cache
- `POST /api/admin/cache/clear/stores` - Clear store cache

#### Notification System (2 endpoints)
- `POST /api/admin/notifications/send/email` - Send email notification
- `GET /api/admin/notifications/queue/status` - Get notification queue status

#### Health Check (2 endpoints)
- `GET /api/admin/health/database` - Database health check
- `GET /api/admin/health/external-services` - External services health check

#### Dashboard (2 endpoints)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/system/health` - System health status

## Implementation Steps

### Step 1: Route Organization
```javascript
// Main routes file (index.js)
router.use("/public", publicRoutes);   // Read-only APIs
router.use("/admin", adminRoutes);     // Full access APIs
```

### Step 2: Admin Route Integration
```javascript
// adminRoutes.js includes:
// 1. CRUD Operations (stores, coupons, categories, etc.)
// 2. Analytics & Reporting
// 3. Data Processing (import/export)
// 4. System Management
// 5. Cache Management
// 6. Notification System
// 7. Health Checks
```

### Step 3: Access Control
```javascript
// Public routes - no authentication required
// Admin routes - require admin authentication
router.use(adminAuthMiddleware); // Apply to admin routes
```

### Step 4: Frontend Integration
```javascript
// Frontend API calls
// Public: /api/public/stores/list
// Admin: /api/admin/stores/create
```

## Migration Guide

### From Legacy APIs
| Legacy API | New API |
|------------|---------|
| `GET /api/stores` | `GET /api/public/stores/list` |
| `POST /api/stores` | `POST /api/admin/stores/create` |
| `GET /api/coupons` | `GET /api/public/coupons/list` |
| `POST /api/coupons` | `POST /api/admin/coupons/create` |

### From Backend APIs
| Backend API | New Admin API |
|-------------|---------------|
| `GET /backend/analytics/coupon-performance` | `GET /api/admin/analytics/coupon-performance` |
| `POST /backend/data/bulk-import/coupons` | `POST /api/admin/data/bulk-import/coupons` |
| `POST /backend/cache/clear/all` | `POST /api/admin/cache/clear/all` |

## Security Considerations

### Public APIs
- Rate limiting
- CORS configuration
- Input validation
- No sensitive data exposure

### Admin APIs
- Authentication required
- Authorization checks
- Audit logging
- Enhanced security headers

## Testing

### Public API Testing
```bash
# Test public endpoints
curl http://localhost:5000/api/public/stores/list
curl http://localhost:5000/api/public/coupons/trending
```

### Admin API Testing
```bash
# Test admin endpoints (with auth)
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/admin/stores/create
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/admin/analytics/coupon-performance
```

## Benefits of Unified Structure

1. **Simplified Management** - Admin controls everything
2. **Clear Boundaries** - Public vs Admin access
3. **No Duplicates** - Single source of truth
4. **Better Security** - Centralized admin authentication
5. **Easier Maintenance** - Fewer route files to manage
6. **Scalable** - Easy to add new admin features

## Total API Count
- **Public APIs:** 15 endpoints
- **Admin APIs:** 43 endpoints
- **Total:** 58 endpoints (reduced from 93)
- **Eliminated:** 35 duplicate endpoints

This unified structure provides a clean, maintainable, and secure API architecture with clear separation between public and administrative functions. 