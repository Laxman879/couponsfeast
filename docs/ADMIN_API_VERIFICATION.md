# 🔍 Complete Admin Panel API Verification Guide

## 🎯 **Test ALL Admin Panel APIs Systematically**

### **🏪 STORES MANAGEMENT APIs**

#### **Basic Store Operations:**
1. **GET All Stores**: `http://localhost:5000/api/stores`
2. **GET Store by Slug**: `http://localhost:5000/api/stores/amazon` (test with any store slug)
3. **POST Create Store**: Test via admin panel or Postman
4. **PUT Update Store**: Test via admin panel 
5. **DELETE Store**: Test via admin panel

#### **Store Upload APIs:**
6. **GET Upload Test**: `http://localhost:5000/api/upload/test`
7. **POST Upload Logo**: Test via admin panel file upload
8. **DELETE Logo**: Test via admin panel

**Expected Results**: Store data, upload capabilities, CRUD operations

---

### **🎫 COUPONS MANAGEMENT APIs**

#### **Basic Coupon Operations:**
9. **GET All Coupons**: `http://localhost:5000/api/coupons`
10. **GET Coupon by ID**: `http://localhost:5000/api/coupons/[coupon-id]`
11. **GET Trending Coupons**: `http://localhost:5000/api/coupons/trending`
12. **GET Search Coupons**: `http://localhost:5000/api/coupons/search?q=test`
13. **POST Create Coupon**: Test via admin panel
14. **PUT Update Coupon**: Test via admin panel
15. **DELETE Coupon**: Test via admin panel

#### **Coupon Analytics:**
16. **POST Track Click**: `http://localhost:5000/api/coupons/[id]/click`
17. **POST Reveal Coupon**: `http://localhost:5000/api/coupons/reveal/[id]`

**Expected Results**: Coupon data, analytics tracking, CRUD operations

---

### **🏷️ CATEGORIES MANAGEMENT APIs**

#### **Category Operations:**
18. **GET All Categories**: `http://localhost:5000/api/categories`
19. **POST Create Category**: Test via admin panel
20. **PUT Update Category**: Test via admin panel
21. **DELETE Category**: Test via admin panel

#### **Popular Stores Operations:**
22. **GET Popular Stores**: `http://localhost:5000/api/popular-stores`
23. **POST Create Popular Store**: Test via admin panel
24. **PUT Update Popular Store**: Test via admin panel
25. **DELETE Popular Store**: Test via admin panel

**Expected Results**: Categories and popular stores data, CRUD operations

---

### **🎨 CMS SETTINGS APIs**

#### **Site Configuration:**
26. **GET Site Config**: `http://localhost:5000/api/site-config`
27. **PUT Update Site Config**: Test via admin panel

#### **Navigation Menu:**
28. **GET Navigation**: `http://localhost:5000/api/navigation`
29. **PUT Update Navigation**: Test via admin panel

#### **Banners:**
30. **GET Banners**: `http://localhost:5000/api/banners`
31. **POST Create Banner**: Test via admin panel

#### **Footer Links:**
32. **GET Footer Links**: `http://localhost:5000/api/footer-links`
33. **GET Footer Links Admin**: `http://localhost:5000/api/footer-links/admin`
34. **POST Create Footer Link**: Test via admin panel
35. **PUT Update Footer Link**: Test via admin panel
36. **DELETE Footer Link**: Test via admin panel

**Expected Results**: CMS configuration data, navigation, footer management

---

### **📄 PAGES MANAGEMENT APIs**

#### **Page Operations:**
37. **GET All Pages**: `http://localhost:5000/api/pages`
38. **GET Specific Page**: `http://localhost:5000/api/pages/home`
39. **POST Create Page**: Test via admin panel
40. **PUT Update Page**: Test via admin panel
41. **DELETE Page**: Test via admin panel

**Expected Results**: Page data, dynamic content sections, SEO metadata

---

### **📊 DASHBOARD ANALYTICS APIs**

#### **Dashboard Data:**
42. **GET Dashboard Stats**: `http://localhost:5000/api/admin/dashboard/stats` (if exists)
43. **GET System Health**: `http://localhost:5000/api/admin/system/health` (if exists)

#### **Featured Coupons:**
44. **GET Featured Coupons**: `http://localhost:5000/api/featured-coupons`
45. **POST Create Featured**: Test via admin panel
46. **PUT Update Featured**: Test via admin panel
47. **DELETE Featured**: Test via admin panel

**Expected Results**: Analytics data, featured content management

---

## 🚨 **CRITICAL PRIORITY TESTING**

### **Phase 1: Core System (Test First)**
```
1. http://localhost:5000/api/status
2. http://localhost:5000/api/stores
3. http://localhost:5000/api/coupons
4. http://localhost:5000/api/categories
5. http://localhost:5000/api/site-config
```

### **Phase 2: CMS Features**
```
6. http://localhost:5000/api/navigation
7. http://localhost:5000/api/popular-stores
8. http://localhost:5000/api/footer-links
9. http://localhost:5000/api/pages
10. http://localhost:5000/api/banners
```

### **Phase 3: Advanced Features**
```
11. http://localhost:5000/api/featured-coupons
12. http://localhost:5000/api/upload/test
13. http://localhost:5000/api/coupons/trending
14. http://localhost:5000/api/footer-links/admin
15. http://localhost:5000/api/docs
```

---

## 📋 **TESTING TEMPLATE**

Copy and fill this out:

```
PHASE 1 - CORE SYSTEM:
✅ http://localhost:5000/api/status: [PASS/FAIL]
✅ http://localhost:5000/api/stores: [PASS/FAIL]
✅ http://localhost:5000/api/coupons: [PASS/FAIL]
✅ http://localhost:5000/api/categories: [PASS/FAIL]
✅ http://localhost:5000/api/site-config: [PASS/FAIL]

PHASE 2 - CMS FEATURES:
✅ http://localhost:5000/api/navigation: [PASS/FAIL]
✅ http://localhost:5000/api/popular-stores: [PASS/FAIL]
✅ http://localhost:5000/api/footer-links: [PASS/FAIL]
✅ http://localhost:5000/api/pages: [PASS/FAIL]
✅ http://localhost:5000/api/banners: [PASS/FAIL]

PHASE 3 - ADVANCED:
✅ http://localhost:5000/api/featured-coupons: [PASS/FAIL]
✅ http://localhost:5000/api/upload/test: [PASS/FAIL]
✅ http://localhost:5000/api/coupons/trending: [PASS/FAIL]
✅ http://localhost:5000/api/footer-links/admin: [PASS/FAIL]
✅ http://localhost:5000/api/docs: [PASS/FAIL]
```

---

## 🔧 **What PASS/FAIL Means**

### **✅ PASS**: 
- Returns JSON data
- No error messages
- Status 200 OK

### **❌ FAIL**:
- Error messages
- 404 Not Found
- 500 Server Error
- Blank page
- "Cannot GET /api/..."

---

## 🎯 **ADMIN PANEL FEATURE MAPPING**

### **If These APIs FAIL, These Features Won't Work:**

- **api/stores** → Store Management CRUD
- **api/coupons** → Coupon Management CRUD  
- **api/categories** → Categories Management
- **api/site-config** → Site Configuration
- **api/navigation** → Navigation Menu
- **api/popular-stores** → Popular Stores Dropdown
- **api/footer-links** → Footer Links Management
- **api/pages** → Pages Management
- **api/upload/test** → Logo Upload Features

---

## 📞 **ACTION REQUIRED**

**Test Phase 1 URLs first (5 URLs) and report results immediately.**

**Once I know which APIs are failing, I can fix them one by one!**

**Start testing now: Copy the template above and fill in PASS/FAIL for each URL.**