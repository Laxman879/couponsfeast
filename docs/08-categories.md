# Categories — Admin Documentation

**URL:** `http://localhost:3000/admin/categories`

---

## Overview

Manage product/coupon categories that appear in the navbar dropdown menu. Categories can be configured to show in the navbar, footer, or both.

---

## CRUD Operations

### Create Category

Managed from **CMS & Config** page (`/admin/cms`) → "Categories Management" accordion.

1. Expand "Categories Management"
2. Fill the "Add New Category" form:

| Field | Required | Description |
|-------|----------|-------------|
| Category Name | ✅ | e.g., "Electronics", "Fashion" |
| Color Class | ❌ | Tailwind color class (e.g., `text-blue-600`) |
| Navigation Link | ❌ | `No Link` / `Navbar Only` / `Footer Only` / `Both` |
| Dropdown Section | ❌ | `Categories Section` or `Popular Section` in navbar dropdown |

3. Click **"Add Category"**

Slug is auto-generated from the name.

### Delete Category

Click **"Delete"** button next to any category in the list.

---

## Where Categories Appear

| Location | Condition |
|----------|-----------|
| Navbar dropdown → Categories section | `hasNavLink: true` + `dropdownSection: 'categories'` |
| Navbar dropdown → Popular section | `hasNavLink: true` + `dropdownSection: 'popular'` |
| Footer links | `navLocation: 'footer'` or `'both'` |
| Category filter page | `/category` page |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/categories/list` | Get all categories |
| POST | `/api/admin/categories/create` | Create category |
| PUT | `/api/admin/categories/update/:id` | Update category |
| DELETE | `/api/admin/categories/delete/:id` | Delete category |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/cms/page.tsx` | CMS page (Categories accordion) |
| `client/app/admin/categories/page.tsx` | Dedicated categories page |
| `server/src/models/Category.js` | Category mongoose model |
| `server/src/routes/admin/categories/category.routes.js` | Admin routes |
| `server/src/routes/public/categories/category.routes.js` | Public routes |

---

## Database Schema

```
name              String (required)
slug              String (required, unique, auto-lowercase)
color             String (default: "#007bff")
icon              String
description       String
hasNavLink        Boolean (default: false)
navLocation       Enum: navbar, footer, both, no
dropdownSection   Enum: categories, popular
```
