# Stores — Admin Documentation

**URL:** `http://localhost:3000/admin/stores`

---

## Overview

Manage all stores on the platform. Each store represents a brand/retailer (e.g., Amazon, Nike, Target). Stores are linked to coupons and displayed on the public site at `/view/{domain}`.

---

## CRUD Operations

### Create Store

1. Click **"Add Store"** button (top right)
2. Fill in the dialog form:

| Field | Required | Description |
|-------|----------|-------------|
| Store Name | ✅ | Display name (e.g., "Amazon") |
| Slug | Auto | URL-friendly name, auto-generated from store name |
| Logo | ❌ | Upload image or paste URL |
| Website URL | ❌ | Full URL (e.g., `https://www.amazon.com`) |
| Description | ❌ | Brief store description |

3. Click **"Create Store"**

### Edit Store

1. Find the store in the table
2. Click **"Edit"** button in the Actions column
3. Modify fields in the dialog
4. Click **"Update Store"**

### Delete Store

1. Click **"Delete"** button next to the store
2. Confirm deletion in the popup dialog
3. ⚠️ **Warning:** Deleting a store may affect associated coupons

---

## Advanced Store Editors

Each store has 5 additional editors accessible from the table columns:

### Header Editor (Green "Header" button)

Controls the store page header appearance at `/view/{domain}`.

| Field | Description |
|-------|-------------|
| Logo Background Color | Color behind the store logo (hex code) |
| Custom Date Label | Override the date shown (leave blank for auto) |

Includes a **live preview** of the header.

### Promo Info Editor (Yellow "Promo" button)

Manages the "Promo Codes" content section on the store page.

| Field | Description |
|-------|-------------|
| Heading | Section title (e.g., "Amazon Promo Codes") |
| Logo Text | Fallback text if no logo image |
| Logo Card Background | Background color for the logo card |
| Sections | Array of title + body content blocks (split left/right) |

**To add sections:** Click "+ Add Section" → fill Title and Body → Save.

### Store Info / Sales Editor (Purple "Sales" button)

Manages the "Store Info" section with seasonal sales data.

| Field | Description |
|-------|-------------|
| Section Heading | e.g., "Amazon Store Info" |
| Subheading | e.g., "What are the best Amazon sales?" |
| Sales | Array of sale entries (title + description) |

**To add sales:** Click "+ Add Sale" → fill Title and Description → Save.

### About Section Editor (Pink "About" button)

Manages the "About" content section on the store page.

| Field | Description |
|-------|-------------|
| Heading | e.g., "About Amazon" |
| Paragraphs | Array of text paragraphs |

**To add paragraphs:** Click "+ Add Paragraph" → write content → Save.

### Sidebar Data Editor (Blue "Sidebar" button)

Controls the left sidebar on the store page `/view/{domain}`.

| Section | Fields |
|---------|--------|
| **Author** | Name, Role, Image (upload), Bio, Bio URL |
| **Trust & Verification** | Last Verified Date, Commission Note, Trust Text |
| **How-To Steps** | Ordered list of steps (add/remove dynamically) |
| **Featured Article** | Title, Author, Image (upload), URL, Description |
| **Store Info** | Address, Rating (0-5), Rating Count, In-Store Coupons |

---

## Where Store Data Appears on Public Site

| Data | Appears At |
|------|-----------|
| Store Name, Logo, Description | `/view/{domain}` header |
| Promo Info | `/view/{domain}` promo section |
| Store Info / Sales | `/view/{domain}` sales section |
| About Section | `/view/{domain}` about section |
| Sidebar Data | `/view/{domain}` left sidebar |
| Store in dropdowns | Coupon forms, Banner forms, Deal forms |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/stores/list` | Get all stores (public) |
| GET | `/api/public/stores/details/:slug` | Get store by slug |
| POST | `/api/admin/stores/create` | Create store |
| PUT | `/api/admin/stores/update/:id` | Update store |
| DELETE | `/api/admin/stores/delete/:id` | Delete store |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/stores/page.tsx` | Admin stores page (all editors) |
| `server/src/models/Store.js` | Store mongoose model |
| `server/src/routes/admin/stores/store.routes.js` | Admin CRUD routes |
| `server/src/routes/public/stores/store.routes.js` | Public read routes |
| `client/app/view/[domain]/page.tsx` | Public store page |
| `client/services/api.ts` | API functions: `getStores`, `createStore`, `updateStore`, `deleteStore` |

---

## Database Schema (Store Model)

```
storeName        String (required)
slug             String (unique, required)
logo             String
websiteUrl       String
description      String
category         String
promoInfo        { heading, logoBgColor, logoText, sections[] }
storeInfo        { heading, subheading, sales[] }
aboutSection     { heading, paragraphs[] }
sidebarData      { authorName, authorRole, authorImage, authorBio, ... }
```
