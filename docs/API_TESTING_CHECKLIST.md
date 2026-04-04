# API Testing Checklist - Track Your Progress

## Instructions
Mark each API as tested by changing [ ] to [x]

---

## Store APIs (5/5)

- [ ] **GET /api/stores** - Get all stores
  - Test: http://localhost:5000/api/stores
  - Expected: Array of stores (may be empty)

- [ ] **GET /api/stores/:slug** - Get store by slug
  - Test: http://localhost:5000/api/stores/amazon
  - Expected: Store object or 404

- [ ] **POST /api/stores** - Create store
  - Test: Use HTML tester or api-tests.http
  - Expected: Created store object

- [ ] **PUT /api/stores/:id** - Update store
  - Test: Use HTML tester with store ID
  - Expected: Updated store object

- [ ] **DELETE /api/stores/:id** - Delete store
  - Test: Use HTML tester with store ID
  - Expected: Success message

---

## Coupon APIs (7/7)

- [ ] **GET /api/coupons** - Get all coupons
  - Test: http://localhost:5000/api/coupons
  - Expected: Array of coupons (may be empty)

- [ ] **GET /api/coupons/:id** - Get coupon by ID
  - Test: http://localhost:5000/api/coupons/COUPON_ID
  - Expected: Coupon object or 404

- [ ] **GET /api/coupons/store/:storeId** - Get coupons by store
  - Test: http://localhost:5000/api/coupons/store/STORE_ID
  - Expected: Array of coupons for that store

- [ ] **GET /api/coupons/category/:category** - Get coupons by category
  - Test: http://localhost:5000/api/coupons/category/electronics
  - Expected: Array of coupons in that category

- [ ] **POST /api/coupons** - Create coupon
  - Test: Use HTML tester or api-tests.http
  - Expected: Created coupon object

- [ ] **PUT /api/coupons/:id** - Update coupon
  - Test: Use HTML tester with coupon ID
  - Expected: Updated coupon object

- [ ] **DELETE /api/coupons/:id** - Delete coupon
  - Test: Use HTML tester with coupon ID
  - Expected: Success message

---

## Analytics APIs (2/2)

- [ ] **POST /api/coupons/reveal/:couponId** - Reveal coupon code
  - Test: Use HTML tester with coupon ID
  - Expected: Coupon code and updated click count

- [ ] **POST /api/coupons/:id/click** - Track coupon click
  - Test: Use HTML tester with coupon ID
  - Expected: Success message

---

## Search & Trending APIs (2/2)

- [ ] **GET /api/search?query=keyword** - Search coupons
  - Test: http://localhost:5000/api/search?query=discount
  - Expected: Object with coupons array

- [ ] **GET /api/coupons/trending** - Get trending coupons
  - Test: http://localhost:5000/api/coupons/trending
  - Expected: Array of coupons sorted by click count

---

## Test Endpoints (Bonus)

- [ ] **GET /api/test** - API dashboard
  - Test: http://localhost:5000/api/test
  - Expected: JSON with all API info

- [ ] **GET /api/test/status** - API status
  - Test: http://localhost:5000/api/test/status
  - Expected: Status of all 16 APIs

---

## Testing Progress

**Total APIs:** 16  
**Tested:** 0  
**Remaining:** 16  

**Progress:** [ ] 0% Complete

---

## Quick Test Steps

1. **Start Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Open HTML Tester**
   - Double-click: `server/api-tester.html`
   - Or run: `test-apis.bat`

3. **Test Each API**
   - Click "Test API" button for each endpoint
   - Mark checkbox above when working

4. **Create Sample Data**
   - Create 2-3 stores first
   - Then create 5-10 coupons
   - Test reveal and trending

---

## Notes

Write any issues or observations here:

- 
- 
- 

---

## Status Legend

- [ ] Not tested yet
- [x] Tested and working
- [!] Tested but has issues

---

**Last Updated:** [Add date when you test]
