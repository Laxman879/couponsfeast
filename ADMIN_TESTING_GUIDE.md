# Admin Panel Testing Guide

## 🧪 Step-by-Step Testing Plan

### 1. **Site Configuration** ✅
**URL**: `http://localhost:3000/admin/cms`
**Test Steps**:
- [ ] Change site name and logo
- [ ] Update primary/secondary colors
- [ ] Modify social media links
- [ ] Save changes and verify frontend updates

### 2. **Navigation Menu** ✅
**URL**: `http://localhost:3000/admin/cms` (Navigation Menu accordion)
**Test Steps**:
- [ ] Change navbar background color
- [ ] Change navbar text color
- [ ] Edit menu item names and URLs
- [ ] Save and check navbar updates

### 3. **Categories Management** ✅
**URL**: `http://localhost:3000/admin/cms` (Categories Management accordion)
**Test Steps**:
- [ ] Create new category (e.g., "Electronics")
- [ ] Set color class (e.g., "text-blue-600")
- [ ] Choose navigation link option
- [ ] Verify category appears in dropdown
- [ ] Delete a category

### 4. **Popular Stores Management** ✅
**URL**: `http://localhost:3000/admin/cms` (Popular Stores accordion)
**Test Steps**:
- [ ] Create new popular store (e.g., "Amazon")
- [ ] Set color class (e.g., "text-orange-600")
- [ ] Choose navigation link option
- [ ] Verify store appears in dropdown
- [ ] Delete a popular store

### 5. **Stores CRUD** ✅
**URL**: `http://localhost:3000/admin/stores`
**Test Steps**:
- [ ] Create new store with all fields
- [ ] Edit existing store
- [ ] Delete store (with confirmation modal)
- [ ] Verify toast notifications work
- [ ] Check store appears on frontend

### 6. **Coupons CRUD** ✅
**URL**: `http://localhost:3000/admin/coupons`
**Test Steps**:
- [ ] Create new coupon with all fields
- [ ] Edit existing coupon
- [ ] Delete coupon (with confirmation modal)
- [ ] Verify toast notifications work
- [ ] Check coupon appears on frontend

### 7. **Pages Management** ✅
**URL**: `http://localhost:3000/admin/cms` (Pages Management accordion)
**Test Steps**:
- [ ] Create new page (e.g., "About Us")
- [ ] Add different section types:
  - [ ] Text Content
  - [ ] Hero Banner
  - [ ] Featured Coupons
- [ ] Edit page content
- [ ] Preview page
- [ ] Delete page

### 8. **Footer Links Management** ✅
**URL**: `http://localhost:3000/admin/cms` (Footer Links accordion)
**Test Steps**:
- [ ] Create footer link in "Main Links" section
- [ ] Create footer link in "My RMN" section
- [ ] Create footer link in "Bottom Links" section
- [ ] Verify links appear in footer
- [ ] Delete footer links

### 9. **Dashboard Analytics** ✅
**URL**: `http://localhost:3000/admin/dashboard`
**Test Steps**:
- [ ] Check total counts display correctly
- [ ] Verify recent activity shows
- [ ] Check all navigation links work

## 🚀 Quick Start Testing

1. **Start Backend**:
```bash
cd server
npm run dev
```

2. **Start Frontend**:
```bash
cd client
npm run dev
```

3. **Access Admin Panel**:
- Dashboard: `http://localhost:3000/admin/dashboard`
- Stores: `http://localhost:3000/admin/stores`
- Coupons: `http://localhost:3000/admin/coupons`
- CMS: `http://localhost:3000/admin/cms`

## 🔍 What to Look For

### ✅ Success Indicators:
- Toast notifications appear for all actions
- Confirmation modals for delete operations
- Real-time updates in dropdowns/navbar
- Data persists after page refresh
- Frontend reflects admin changes

### ❌ Issues to Report:
- Error messages in console
- Failed API calls
- UI not updating
- Missing toast notifications
- Broken links or navigation

## 📝 Testing Checklist

- [ ] All CRUD operations work
- [ ] Toast notifications appear
- [ ] Confirmation modals work
- [ ] Real-time updates work
- [ ] Frontend reflects changes
- [ ] No console errors
- [ ] All forms validate properly
- [ ] Navigation works correctly

## 🛠️ Common Issues & Solutions

**Issue**: "Failed to compile" error
**Solution**: Check for missing imports or syntax errors

**Issue**: API calls fail
**Solution**: Ensure backend server is running on port 5000

**Issue**: Changes don't appear on frontend
**Solution**: Check if localStorage events are triggering updates

**Issue**: Toast notifications don't show
**Solution**: Verify react-hot-toast is properly imported