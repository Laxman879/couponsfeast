# 🚀 Quick Start - Test All APIs

## Step 1: Start the Server

```bash
cd server
npm run dev
```

You should see:
```
✅ Server running on http://localhost:5000
📊 Test all APIs: http://localhost:5000/api/test
📋 API Status: http://localhost:5000/api/test/status
```

## Step 2: Test APIs (Choose One Method)

### Method 1: HTML Test Dashboard (Easiest) ⭐

1. Open `server/api-tester.html` in your browser
2. Click "🚀 Test All APIs" button
3. See results for each API instantly

### Method 2: Browser URL

Open these URLs in your browser:

```
http://localhost:5000/api/test
http://localhost:5000/api/stores
http://localhost:5000/api/coupons
http://localhost:5000/api/coupons/trending
http://localhost:5000/api/search?query=test
```

### Method 3: Browser Console (F12)

```javascript
// Copy and paste in browser console
fetch('http://localhost:5000/api/stores').then(r => r.json()).then(console.log)
fetch('http://localhost:5000/api/coupons').then(r => r.json()).then(console.log)
fetch('http://localhost:5000/api/coupons/trending').then(r => r.json()).then(console.log)
```

### Method 4: VS Code REST Client

Create a file `test.http`:

```http
### Get All Stores
GET http://localhost:5000/api/stores

### Get All Coupons
GET http://localhost:5000/api/coupons

### Get Trending Coupons
GET http://localhost:5000/api/coupons/trending

### Search
GET http://localhost:5000/api/search?query=test

### Create Store
POST http://localhost:5000/api/stores
Content-Type: application/json

{
  "name": "Amazon",
  "slug": "amazon",
  "logo": "https://logo.clearbit.com/amazon.com",
  "description": "Online shopping",
  "website": "https://amazon.com"
}
```

## Step 3: Verify All 16 APIs

Visit: `http://localhost:5000/api/test/status`

You should see:
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

## ✅ API Checklist

### Store APIs (5)
- [ ] GET /api/stores - Get all stores
- [ ] GET /api/stores/:slug - Get store by slug
- [ ] POST /api/stores - Create store
- [ ] PUT /api/stores/:id - Update store
- [ ] DELETE /api/stores/:id - Delete store

### Coupon APIs (7)
- [ ] GET /api/coupons - Get all coupons
- [ ] GET /api/coupons/:id - Get coupon by ID
- [ ] GET /api/coupons/store/:storeId - Get coupons by store
- [ ] GET /api/coupons/category/:category - Get coupons by category
- [ ] POST /api/coupons - Create coupon
- [ ] PUT /api/coupons/:id - Update coupon
- [ ] DELETE /api/coupons/:id - Delete coupon

### Analytics APIs (2)
- [ ] POST /api/coupons/reveal/:couponId - Reveal coupon code
- [ ] POST /api/coupons/:id/click - Track click

### Search & Trending (2)
- [ ] GET /api/search?query=keyword - Search coupons
- [ ] GET /api/coupons/trending - Get trending coupons

## 🎯 Quick Test Commands

```bash
# Test from command line (Windows)
curl http://localhost:5000/api/stores
curl http://localhost:5000/api/coupons
curl http://localhost:5000/api/coupons/trending

# Test from command line (PowerShell)
Invoke-WebRequest http://localhost:5000/api/stores
Invoke-WebRequest http://localhost:5000/api/coupons
```

## 📝 Sample Data for Testing

### Create a Store
```json
{
  "name": "Amazon",
  "slug": "amazon",
  "logo": "https://logo.clearbit.com/amazon.com",
  "description": "World's largest online retailer",
  "website": "https://amazon.com"
}
```

### Create a Coupon (after creating store)
```json
{
  "title": "50% Off Electronics",
  "code": "SAVE50",
  "description": "Get 50% off on all electronics",
  "discount": "50% OFF",
  "store": "STORE_ID_HERE",
  "expiryDate": "2024-12-31",
  "isActive": true
}
```

## 🐛 Troubleshooting

**Server not starting?**
- Check if MongoDB is connected
- Verify .env file has MONGODB_URI

**APIs returning empty arrays?**
- Database is empty, create some stores and coupons first
- Use the HTML tester to create sample data

**CORS errors?**
- Server has CORS enabled by default
- Check if server is running on port 5000

## 🎉 Success!

If you can access `http://localhost:5000/api/test` and see all 16 APIs listed, you're ready to go!
