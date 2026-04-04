# 🔍 Complete API Testing Guide

## 📋 **Test ALL APIs Systematically**

### **Step 1: Basic System Status**
Open these URLs in your browser:

1. **Main API Status**: `http://localhost:5000/api/status`
2. **API Documentation**: `http://localhost:5000/api/docs`
3. **Upload Test**: `http://localhost:5000/api/upload/test`

**Expected Result**: All should return JSON responses without errors.

---

### **Step 2: CMS APIs (The Problem Area)**

#### **Site Configuration APIs:**
1. **GET Site Config**: `http://localhost:5000/api/site-config`
2. **GET Site Config (Public)**: `http://localhost:5000/api/public/site/config`
3. **GET Site Config (Admin)**: `http://localhost:5000/api/admin/cms/site-config`

#### **Navigation APIs:**
1. **GET Navigation**: `http://localhost:5000/api/navigation`
2. **GET Navigation (Public)**: `http://localhost:5000/api/public/site/navigation`
3. **GET Navigation (Admin)**: `http://localhost:5000/api/admin/cms/navigation`

**Expected Result**: All should return configuration data.

---

### **Step 3: Store APIs**
1. **GET All Stores**: `http://localhost:5000/api/stores`
2. **GET Stores (Public)**: `http://localhost:5000/api/public/stores/list`
3. **GET Stores (Admin)**: `http://localhost:5000/api/admin/stores/list`

---

### **Step 4: Coupon APIs**
1. **GET All Coupons**: `http://localhost:5000/api/coupons`
2. **GET Coupons (Public)**: `http://localhost:5000/api/public/coupons/list`
3. **GET Coupons (Admin)**: `http://localhost:5000/api/admin/coupons/list`
4. **GET Trending**: `http://localhost:5000/api/coupons/trending`

---

### **Step 5: Category APIs**
1. **GET Categories**: `http://localhost:5000/api/categories`
2. **GET Categories (Public)**: `http://localhost:5000/api/public/categories/list`
3. **GET Categories (Admin)**: `http://localhost:5000/api/admin/categories/list`

---

### **Step 6: Popular Stores APIs**
1. **GET Popular Stores**: `http://localhost:5000/api/popular-stores`
2. **GET Popular Stores (Public)**: `http://localhost:5000/api/public/popular-stores/list`
3. **GET Popular Stores (Admin)**: `http://localhost:5000/api/admin/popular-stores/list`

---

### **Step 7: Footer Links APIs**
1. **GET Footer Links**: `http://localhost:5000/api/footer-links`
2. **GET Footer Links (Public)**: `http://localhost:5000/api/public/footer/links`
3. **GET Footer Links (Admin)**: `http://localhost:5000/api/admin/footer-links/list`

---

### **Step 8: Featured Coupons APIs**
1. **GET Featured Coupons**: `http://localhost:5000/api/featured-coupons`
2. **GET Featured Coupons (Public)**: `http://localhost:5000/api/public/featured-coupons/list`
3. **GET Featured Coupons (Admin)**: `http://localhost:5000/api/admin/featured-coupons/list`

---

### **Step 9: Pages APIs**
1. **GET All Pages**: `http://localhost:5000/api/pages`
2. **GET Home Page**: `http://localhost:5000/api/pages/home`
3. **GET Home Page (Public)**: `http://localhost:5000/api/public/site/pages/home`
4. **GET Home Page (Admin)**: `http://localhost:5000/api/admin/cms/pages/home`

---

## 🚨 **Critical Test Results Needed**

### **For Each URL Above, Tell Me:**

1. **✅ SUCCESS**: Returns JSON data
2. **❌ ERROR**: Shows error message
3. **🔄 LOADING**: Takes too long or hangs
4. **❓ NOT FOUND**: 404 error

---

## 📝 **Quick Test Template**

Copy this and fill in results:

```
SYSTEM STATUS:
- http://localhost:5000/api/status: [✅/❌]
- http://localhost:5000/api/docs: [✅/❌]

CMS APIS:
- http://localhost:5000/api/site-config: [✅/❌]
- http://localhost:5000/api/navigation: [✅/❌]

STORE APIS:
- http://localhost:5000/api/stores: [✅/❌]

COUPON APIS:
- http://localhost:5000/api/coupons: [✅/❌]

CATEGORY APIS:
- http://localhost:5000/api/categories: [✅/❌]

POPULAR STORES:
- http://localhost:5000/api/popular-stores: [✅/❌]

FOOTER LINKS:
- http://localhost:5000/api/footer-links: [✅/❌]

PAGES:
- http://localhost:5000/api/pages: [✅/❌]
```

---

## 🎯 **Priority Testing Order**

**Test these FIRST (most important for CMS):**

1. `http://localhost:5000/api/status`
2. `http://localhost:5000/api/site-config`
3. `http://localhost:5000/api/navigation`
4. `http://localhost:5000/api/categories`
5. `http://localhost:5000/api/popular-stores`

**If these 5 work, your CMS should work!**

---

## 🔧 **What to Look For**

### **✅ Good Response:**
```json
{
  "status": "operational",
  "message": "API is working"
}
```

### **❌ Bad Response:**
- Blank page
- Error messages
- "Cannot GET /api/..."
- Connection refused

---

## 📞 **Next Steps**

1. **Test the Priority 5 URLs first**
2. **Copy the results** (✅ or ❌ for each)
3. **Tell me which ones fail**
4. **I'll fix the specific failing endpoints**

**Start testing now and report back with results!**