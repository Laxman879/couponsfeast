# 🚀 Quick Reference - All 16 APIs

## Start Server
```bash
cd server && npm run dev
```

## Test URLs (Copy & Paste in Browser)

```
http://localhost:5000/api/test
http://localhost:5000/api/stores
http://localhost:5000/api/coupons
http://localhost:5000/api/coupons/trending
http://localhost:5000/api/search?query=test
```

## All Endpoints

### Store APIs
```
GET    /api/stores                    # Get all stores
GET    /api/stores/:slug              # Get store by slug
POST   /api/stores                    # Create store
PUT    /api/stores/:id                # Update store
DELETE /api/stores/:id                # Delete store
```

### Coupon APIs
```
GET    /api/coupons                   # Get all coupons
GET    /api/coupons/:id               # Get coupon by ID
GET    /api/coupons/store/:storeId    # Get coupons by store
GET    /api/coupons/category/:cat     # Get coupons by category
POST   /api/coupons                   # Create coupon
PUT    /api/coupons/:id               # Update coupon
DELETE /api/coupons/:id               # Delete coupon
```

### Analytics APIs
```
POST   /api/coupons/reveal/:couponId  # Reveal coupon code
POST   /api/coupons/:id/click         # Track click
```

### Search & Trending
```
GET    /api/search?query=keyword      # Search coupons
GET    /api/coupons/trending          # Get trending coupons
```

## Sample Data

### Create Store
```json
POST /api/stores
{
  "name": "Amazon",
  "slug": "amazon",
  "logo": "https://logo.clearbit.com/amazon.com",
  "description": "Online shopping",
  "website": "https://amazon.com"
}
```

### Create Coupon
```json
POST /api/coupons
{
  "title": "50% Off",
  "code": "SAVE50",
  "description": "Get 50% off",
  "discount": "50% OFF",
  "store": "STORE_ID_HERE",
  "expiryDate": "2024-12-31",
  "isActive": true
}
```

## Browser Console Tests
```javascript
// Copy & paste in browser console (F12)
fetch('http://localhost:5000/api/stores').then(r=>r.json()).then(console.log)
fetch('http://localhost:5000/api/coupons').then(r=>r.json()).then(console.log)
fetch('http://localhost:5000/api/coupons/trending').then(r=>r.json()).then(console.log)
```

## Files to Use

| File | Purpose |
|------|---------|
| `server/api-tester.html` | Browser dashboard |
| `server/api-tests.http` | VS Code tests |
| `test-apis.bat` | Quick launcher |
| `API_TESTING_CHECKLIST.md` | Track progress |

## Quick Commands

```bash
# Start server
cd server && npm run dev

# Test in browser
start server/api-tester.html

# Or use batch file
test-apis.bat
```

## Verify All APIs
```
http://localhost:5000/api/test/status
```

Should show:
```json
{
  "message": "All 16 APIs are configured",
  "apis": {
    "stores": 5,
    "coupons": 7,
    "analytics": 2,
    "search": 1,
    "trending": 1,
    "total": 16
  }
}
```

## 🎯 Testing Order

1. ✅ Start server
2. ✅ Visit `/api/test`
3. ✅ Create 2-3 stores
4. ✅ Create 5-10 coupons
5. ✅ Test reveal API
6. ✅ Test trending API
7. ✅ Test search API

## 📚 Documentation

- `API_DEVELOPMENT_CHECKLIST.md` - Full API details
- `TESTING_GUIDE.md` - Testing instructions
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `COMPLETE_SUMMARY.md` - Overview
- `API_TESTING_CHECKLIST.md` - Track progress
- `QUICK_REFERENCE.md` - This file

---

**Total APIs: 16 | All Implemented ✅**
