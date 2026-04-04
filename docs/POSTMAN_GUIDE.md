# Complete Postman API Testing Guide

## Base URL
```
http://localhost:5000
```

---

## 1. STORE APIs (5 endpoints)

### 1.1 GET All Stores
- **Method:** GET
- **URL:** `http://localhost:5000/api/stores`
- **Headers:** None required
- **Body:** None

### 1.2 GET Store by Slug
- **Method:** GET
- **URL:** `http://localhost:5000/api/stores/amazon`
- **Headers:** None required
- **Body:** None
- **Note:** Replace `amazon` with actual store slug

### 1.3 CREATE Store
- **Method:** POST
- **URL:** `http://localhost:5000/api/stores`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Amazon",
  "slug": "amazon",
  "description": "World's largest online retailer",
  "logo": "https://logo.clearbit.com/amazon.com",
  "website": "https://www.amazon.com",
  "category": "General",
  "featured": true
}
```

### 1.4 UPDATE Store
- **Method:** PUT
- **URL:** `http://localhost:5000/api/stores/STORE_ID_HERE`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Amazon Updated",
  "description": "Updated description",
  "featured": false
}
```
- **Note:** Replace `STORE_ID_HERE` with actual MongoDB ObjectId

### 1.5 DELETE Store
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/stores/STORE_ID_HERE`
- **Headers:** None required
- **Body:** None
- **Note:** Replace `STORE_ID_HERE` with actual MongoDB ObjectId

---

## 2. COUPON APIs (7 endpoints)

### 2.1 GET All Coupons
- **Method:** GET
- **URL:** `http://localhost:5000/api/coupons`
- **Headers:** None required
- **Body:** None

### 2.2 GET Coupon by ID
- **Method:** GET
- **URL:** `http://localhost:5000/api/coupons/COUPON_ID_HERE`
- **Headers:** None required
- **Body:** None
- **Note:** Replace `COUPON_ID_HERE` with actual MongoDB ObjectId

### 2.3 GET Coupons by Store
- **Method:** GET
- **URL:** `http://localhost:5000/api/coupons?store=STORE_ID_HERE`
- **Headers:** None required
- **Body:** None
- **Note:** Replace `STORE_ID_HERE` with actual store's MongoDB ObjectId

### 2.4 GET Coupons by Category
- **Method:** GET
- **URL:** `http://localhost:5000/api/coupons?category=Electronics`
- **Headers:** None required
- **Body:** None
- **Note:** Replace `Electronics` with desired category

### 2.5 CREATE Coupon
- **Method:** POST
- **URL:** `http://localhost:5000/api/coupons`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "50% Off Electronics",
  "description": "Get 50% discount on all electronics",
  "code": "SAVE50",
  "discount": "50%",
  "store": "STORE_ID_HERE",
  "category": "Electronics",
  "expiryDate": "2024-12-31",
  "link": "https://www.amazon.com/deals",
  "featured": true,
  "verified": true
}
```
- **Note:** Replace `STORE_ID_HERE` with actual store's MongoDB ObjectId

### 2.6 UPDATE Coupon
- **Method:** PUT
- **URL:** `http://localhost:5000/api/coupons/COUPON_ID_HERE`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "60% Off Electronics - Updated",
  "discount": "60%",
  "verified": false
}
```
- **Note:** Replace `COUPON_ID_HERE` with actual MongoDB ObjectId

### 2.7 DELETE Coupon
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/coupons/COUPON_ID_HERE`
- **Headers:** None required
- **Body:** None
- **Note:** Replace `COUPON_ID_HERE` with actual MongoDB ObjectId

---

## 3. ANALYTICS APIs (2 endpoints)

### 3.1 Reveal Coupon Code (Track View)
- **Method:** POST
- **URL:** `http://localhost:5000/api/coupons/COUPON_ID_HERE/reveal`
- **Headers:** None required
- **Body:** None
- **Note:** Increments `views` count

### 3.2 Track Coupon Click
- **Method:** POST
- **URL:** `http://localhost:5000/api/coupons/COUPON_ID_HERE/click`
- **Headers:** None required
- **Body:** None
- **Note:** Increments `clicks` count

---

## 4. SEARCH API (1 endpoint)

### 4.1 Search Coupons
- **Method:** GET
- **URL:** `http://localhost:5000/api/coupons/search?q=electronics`
- **Headers:** None required
- **Body:** None
- **Note:** Searches in title, description, and code fields

---

## 5. TRENDING API (1 endpoint)

### 5.1 GET Trending Coupons
- **Method:** GET
- **URL:** `http://localhost:5000/api/coupons/trending`
- **Headers:** None required
- **Body:** None
- **Note:** Returns top 10 most clicked coupons

---

## 6. TEST API (1 endpoint)

### 6.1 API Health Check
- **Method:** GET
- **URL:** `http://localhost:5000/api/test`
- **Headers:** None required
- **Body:** None
- **Response:** `{ "message": "API is working!" }`

---

## Testing Workflow (Step-by-Step)

### Step 1: Start Server
```bash
cd server
npm run dev
```

### Step 2: Test API Health
- Test endpoint: `GET http://localhost:5000/api/test`
- Expected: `{ "message": "API is working!" }`

### Step 3: Create a Store
- Use **1.3 CREATE Store** endpoint
- Copy the returned `_id` from response

### Step 4: Get All Stores
- Use **1.1 GET All Stores** endpoint
- Verify your store appears in the list

### Step 5: Create a Coupon
- Use **2.5 CREATE Coupon** endpoint
- Replace `STORE_ID_HERE` with the store `_id` from Step 3
- Copy the returned coupon `_id` from response

### Step 6: Get All Coupons
- Use **2.1 GET All Coupons** endpoint
- Verify your coupon appears

### Step 7: Test Analytics
- Use **3.1 Reveal Coupon Code** with your coupon ID
- Use **3.2 Track Coupon Click** with your coupon ID
- Use **2.2 GET Coupon by ID** to verify counts increased

### Step 8: Test Search
- Use **4.1 Search Coupons** with a keyword from your coupon

### Step 9: Test Trending
- Use **5.1 GET Trending Coupons**
- Your clicked coupon should appear

### Step 10: Test Updates
- Use **1.4 UPDATE Store** to modify your store
- Use **2.6 UPDATE Coupon** to modify your coupon

### Step 11: Test Filters
- Use **2.3 GET Coupons by Store** with your store ID
- Use **2.4 GET Coupons by Category** with your category

---

## Postman Collection Setup

### Option 1: Manual Setup
1. Open Postman
2. Create new Collection: "CouponsFeast API"
3. Add each endpoint above as a new request
4. Save the collection

### Option 2: Import Collection (Recommended)
1. Create a file `CouponsFeast.postman_collection.json` (see below)
2. In Postman: File → Import → Select the JSON file

---

## Common Response Codes

- **200 OK** - Successful GET/PUT request
- **201 Created** - Successful POST request
- **204 No Content** - Successful DELETE request
- **400 Bad Request** - Invalid data sent
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server error

---

## Tips for Testing

1. **Save IDs:** After creating stores/coupons, save their `_id` values
2. **Use Variables:** In Postman, create environment variables for base URL and IDs
3. **Test Order:** Create stores before coupons (coupons need store IDs)
4. **Check Responses:** Verify the response structure matches expectations
5. **Test Errors:** Try invalid IDs to test error handling

---

## Quick Reference Table

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | GET | `/api/stores` | List all stores |
| 2 | GET | `/api/stores/:slug` | Get store by slug |
| 3 | POST | `/api/stores` | Create store |
| 4 | PUT | `/api/stores/:id` | Update store |
| 5 | DELETE | `/api/stores/:id` | Delete store |
| 6 | GET | `/api/coupons` | List all coupons |
| 7 | GET | `/api/coupons/:id` | Get coupon by ID |
| 8 | GET | `/api/coupons?store=ID` | Filter by store |
| 9 | GET | `/api/coupons?category=NAME` | Filter by category |
| 10 | POST | `/api/coupons` | Create coupon |
| 11 | PUT | `/api/coupons/:id` | Update coupon |
| 12 | DELETE | `/api/coupons/:id` | Delete coupon |
| 13 | POST | `/api/coupons/:id/reveal` | Track reveal |
| 14 | POST | `/api/coupons/:id/click` | Track click |
| 15 | GET | `/api/coupons/search?q=TERM` | Search coupons |
| 16 | GET | `/api/coupons/trending` | Get trending |
| 17 | GET | `/api/test` | Health check |

---

**Total APIs: 17 endpoints** ✅
