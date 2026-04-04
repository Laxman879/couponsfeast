# 🔍 COMPLETE ADMIN PANEL API TESTING

## 🎯 **ALL ADMIN APIs - SYSTEMATIC TESTING**

Based on your admin routes, here are ALL the APIs that need to work for your admin panel:

---

## 🏪 **STORE MANAGEMENT APIs**

### **Test These URLs:**
1. **GET Store List**: `http://localhost:5000/api/admin/stores/list`
2. **GET Store Details**: `http://localhost:5000/api/admin/stores/details/amazon`
3. **Legacy Store List**: `http://localhost:5000/api/stores`
4. **Legacy Store Details**: `http://localhost:5000/api/stores/amazon`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **CREATE Store**: POST `/api/admin/stores/create` OR `/api/stores`
- ✅ **UPDATE Store**: PUT `/api/admin/stores/update/:id` OR `/api/stores/:id`  
- ✅ **DELETE Store**: DELETE `/api/admin/stores/delete/:id` OR `/api/stores/:id`

---

## 🎫 **COUPON MANAGEMENT APIs**

### **Test These URLs:**
5. **GET Coupon List**: `http://localhost:5000/api/admin/coupons/list`
6. **GET Coupon Details**: `http://localhost:5000/api/admin/coupons/details/[coupon-id]`
7. **Legacy Coupon List**: `http://localhost:5000/api/coupons`
8. **Legacy Trending**: `http://localhost:5000/api/coupons/trending`
9. **Legacy Search**: `http://localhost:5000/api/coupons/search`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **CREATE Coupon**: POST `/api/admin/coupons/create` OR `/api/coupons`
- ✅ **UPDATE Coupon**: PUT `/api/admin/coupons/update/:id` OR `/api/coupons/:id`
- ✅ **DELETE Coupon**: DELETE `/api/admin/coupons/delete/:id` OR `/api/coupons/:id`

---

## 🏷️ **CATEGORY MANAGEMENT APIs**

### **Test These URLs:**
10. **GET Categories**: `http://localhost:5000/api/admin/categories/list`
11. **Legacy Categories**: `http://localhost:5000/api/categories`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **CREATE Category**: POST `/api/admin/categories/create` OR `/api/categories`
- ✅ **UPDATE Category**: PUT `/api/admin/categories/update/:id` OR `/api/categories/:id`
- ✅ **DELETE Category**: DELETE `/api/admin/categories/delete/:id` OR `/api/categories/:id`

---

## 🌟 **POPULAR STORES MANAGEMENT APIs**

### **Test These URLs:**
12. **GET Popular Stores**: `http://localhost:5000/api/admin/popular-stores/list`
13. **Legacy Popular Stores**: `http://localhost:5000/api/popular-stores`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **CREATE Popular Store**: POST `/api/admin/popular-stores/create` OR `/api/popular-stores`
- ✅ **UPDATE Popular Store**: PUT `/api/admin/popular-stores/update/:id` OR `/api/popular-stores/:id`
- ✅ **DELETE Popular Store**: DELETE `/api/admin/popular-stores/delete/:id` OR `/api/popular-stores/:id`

---

## 🎨 **CMS SETTINGS APIs**

### **Site Configuration:**
14. **GET Site Config**: `http://localhost:5000/api/admin/cms/site-config`
15. **Legacy Site Config**: `http://localhost:5000/api/site-config`

### **Navigation Menu:**
16. **GET Navigation**: `http://localhost:5000/api/admin/cms/navigation`
17. **Legacy Navigation**: `http://localhost:5000/api/navigation`

### **Banners:**
18. **GET Banners**: `http://localhost:5000/api/admin/cms/banners/list`
19. **Legacy Banners**: `http://localhost:5000/api/banners`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **UPDATE Site Config**: PUT `/api/admin/cms/site-config/update` OR `/api/site-config`
- ✅ **UPDATE Navigation**: PUT `/api/admin/cms/navigation/update` OR `/api/navigation`
- ✅ **CREATE Banner**: POST `/api/admin/cms/banners/create` OR `/api/banners`

---

## 📄 **PAGES MANAGEMENT APIs**

### **Test These URLs:**
20. **GET Home Page**: `http://localhost:5000/api/admin/cms/pages/home`
21. **Legacy Home Page**: `http://localhost:5000/api/pages/home`
22. **Legacy All Pages**: `http://localhost:5000/api/pages`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **UPDATE Page**: PUT `/api/admin/cms/pages/:pageName/update` OR `/api/pages/:pageName`
- ✅ **CREATE Page**: POST `/api/pages`
- ✅ **DELETE Page**: DELETE `/api/pages/:id`

---

## 🔗 **FOOTER LINKS MANAGEMENT APIs**

### **Test These URLs:**
23. **GET Footer Links Admin**: `http://localhost:5000/api/admin/footer-links/list`
24. **Legacy Footer Links**: `http://localhost:5000/api/footer-links`
25. **Legacy Footer Admin**: `http://localhost:5000/api/footer-links/admin`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **CREATE Footer Link**: POST `/api/admin/footer-links/create` OR `/api/footer-links`
- ✅ **UPDATE Footer Link**: PUT `/api/admin/footer-links/update/:id` OR `/api/footer-links/:id`
- ✅ **DELETE Footer Link**: DELETE `/api/admin/footer-links/delete/:id` OR `/api/footer-links/:id`

---

## ⭐ **FEATURED COUPONS MANAGEMENT APIs**

### **Test These URLs:**
26. **GET Featured Coupons**: `http://localhost:5000/api/admin/featured-coupons/list`
27. **Legacy Featured**: `http://localhost:5000/api/featured-coupons`

### **CRUD Operations (Test via Admin Panel):**
- ✅ **CREATE Featured**: POST `/api/admin/featured-coupons/create` OR `/api/featured-coupons`
- ✅ **UPDATE Featured**: PUT `/api/admin/featured-coupons/update/:id` OR `/api/featured-coupons/:id`
- ✅ **DELETE Featured**: DELETE `/api/admin/featured-coupons/delete/:id` OR `/api/featured-coupons/:id`

---

## 📤 **FILE UPLOAD MANAGEMENT APIs**

### **Test These URLs:**
28. **GET Upload Test**: `http://localhost:5000/api/admin/upload/test`
29. **Legacy Upload Test**: `http://localhost:5000/api/upload/test`

### **Upload Operations (Test via Admin Panel):**
- ✅ **UPLOAD Logo**: POST `/api/admin/upload/logo` OR `/api/upload/logo`
- ✅ **DELETE Logo**: DELETE `/api/admin/upload/logo/delete/:filename` OR `/api/upload/logo/:filename`

---

## 📊 **DASHBOARD ANALYTICS APIs**

### **Test These URLs:**
30. **GET Dashboard Stats**: `http://localhost:5000/api/admin/dashboard/stats`
31. **GET System Health**: `http://localhost:5000/api/admin/system/health`

---

## 🔧 **SYSTEM STATUS APIs**

### **Test These URLs:**
32. **GET API Status**: `http://localhost:5000/api/status`
33. **GET API Docs**: `http://localhost:5000/api/docs`

---

## 📋 **COMPLETE TESTING CHECKLIST**

### **PHASE 1: SYSTEM STATUS (Test First)**
```
□ http://localhost:5000/api/status
□ http://localhost:5000/api/admin/system/health
□ http://localhost:5000/api/docs
```

### **PHASE 2: CORE DATA APIs**
```
□ http://localhost:5000/api/stores
□ http://localhost:5000/api/admin/stores/list
□ http://localhost:5000/api/coupons
□ http://localhost:5000/api/admin/coupons/list
□ http://localhost:5000/api/categories
□ http://localhost:5000/api/admin/categories/list
```

### **PHASE 3: CMS APIs**
```
□ http://localhost:5000/api/site-config
□ http://localhost:5000/api/admin/cms/site-config
□ http://localhost:5000/api/navigation
□ http://localhost:5000/api/admin/cms/navigation
□ http://localhost:5000/api/popular-stores
□ http://localhost:5000/api/admin/popular-stores/list
```

### **PHASE 4: ADVANCED FEATURES**
```
□ http://localhost:5000/api/footer-links
□ http://localhost:5000/api/admin/footer-links/list
□ http://localhost:5000/api/featured-coupons
□ http://localhost:5000/api/admin/featured-coupons/list
□ http://localhost:5000/api/pages
□ http://localhost:5000/api/admin/cms/pages/home
```

### **PHASE 5: UPLOADS & DASHBOARD**
```
□ http://localhost:5000/api/upload/test
□ http://localhost:5000/api/admin/upload/test
□ http://localhost:5000/api/admin/dashboard/stats
□ http://localhost:5000/api/banners
□ http://localhost:5000/api/admin/cms/banners/list
```

---

## 🚨 **TESTING INSTRUCTIONS**

### **Step 1: Test ALL URLs Above**
- Open each URL in browser
- Mark ✅ PASS if returns JSON data
- Mark ❌ FAIL if shows error

### **Step 2: Test Admin Panel CRUD**
- Go to `http://localhost:3000/admin/stores`
- Try creating a store
- Try editing a store  
- Try deleting a store
- Check for errors in browser console

### **Step 3: Test CMS Settings**
- Go to `http://localhost:3000/admin/cms`
- Try updating site configuration
- Try updating navigation
- Check for errors in browser console

---

## 📞 **REPORT FORMAT**

Copy and fill this out:

```
SYSTEM STATUS:
□ api/status: [PASS/FAIL]
□ api/admin/system/health: [PASS/FAIL]

STORES:
□ api/stores: [PASS/FAIL]
□ api/admin/stores/list: [PASS/FAIL]

COUPONS:
□ api/coupons: [PASS/FAIL]
□ api/admin/coupons/list: [PASS/FAIL]

CATEGORIES:
□ api/categories: [PASS/FAIL]
□ api/admin/categories/list: [PASS/FAIL]

CMS:
□ api/site-config: [PASS/FAIL]
□ api/admin/cms/site-config: [PASS/FAIL]
□ api/navigation: [PASS/FAIL]
□ api/admin/cms/navigation: [PASS/FAIL]

POPULAR STORES:
□ api/popular-stores: [PASS/FAIL]
□ api/admin/popular-stores/list: [PASS/FAIL]

FOOTER LINKS:
□ api/footer-links: [PASS/FAIL]
□ api/admin/footer-links/list: [PASS/FAIL]

UPLOADS:
□ api/upload/test: [PASS/FAIL]
□ api/admin/upload/test: [PASS/FAIL]

DASHBOARD:
□ api/admin/dashboard/stats: [PASS/FAIL]
```

**Test these systematically and report which ones PASS/FAIL!**