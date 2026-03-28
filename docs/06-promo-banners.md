# Promo Banners — Admin Documentation

**URL:** `http://localhost:3000/admin/promo-banners`

---

## Overview

Manage the purple promotional banners that appear in two locations:
1. **Inline banner** — below the video section (PromoCard), no close button
2. **Sticky banner** — fixed at the bottom of the page with close (X) button, z-index 1000

When a user clicks "Get Deal":
- The store URL opens in a new tab
- A PromoModal popup appears with coupon code, discount, and cash back offer

---

## CRUD Operations

### Create Promo Banner

1. Click **"Add Banner"** button
2. Fill the right-side drawer form:

| Field | Required | Description |
|-------|----------|-------------|
| Banner Text | ✅ | Main text (e.g., "TODAY'S DEAL IS LIVE! SHOP 20 DAYS OF SAVINGS") |
| Logo Tag | ❌ | Brand tag shown in white pill (e.g., "amazon" → displays ".amazon") |
| Button Label | ❌ | CTA button text (default: "Get Deal") |
| Store Name | ❌ | Store name shown in the modal |
| Store URL | ❌ | URL opened on click (e.g., `/view/amazon.com?u=...`) |
| Coupon Code | ❌ | Code shown in the modal (if any) |
| Discount | ❌ | Discount text shown in modal badge |
| Expiry Date | ❌ | Date picker |
| Order | ❌ | Display priority |
| Gradient CSS | ❌ | Background gradient (default: purple) |
| Placement | ❌ | `inline` / `sticky` / `both` (default: both) |
| Details | ❌ | Extra details shown in modal |
| Active | ❌ | Toggle visibility |

3. Click **"Create"**

The drawer includes a **live gradient preview** bar.

### Edit Promo Banner

1. Click **Edit** icon → modify → **"Update"**

### Delete Promo Banner

1. Click **Delete** icon → confirm

---

## Placement Logic

| Placement Value | Where It Shows |
|----------------|----------------|
| `inline` | Only below video section (no X button) |
| `sticky` | Only at page bottom (with X button, z-index 1000) |
| `both` | Both locations |

The public API supports filtering: `GET /api/public/promo-banners/list?placement=inline` returns banners matching that placement or `both`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/promo-banners/list` | Get active banners (supports `?placement=`) |
| GET | `/api/admin/promo-banners` | List all banners (admin) |
| POST | `/api/admin/promo-banners/create` | Create banner |
| PUT | `/api/admin/promo-banners/update/:id` | Update banner |
| DELETE | `/api/admin/promo-banners/delete/:id` | Delete banner |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/promo-banners/page.tsx` | Admin promo banners page |
| `server/src/models/PromoBanner.js` | PromoBanner mongoose model |
| `server/src/routes/admin/promo-banners/promoBanner.routes.js` | Admin CRUD routes |
| `server/src/routes/public/promo-banners/promoBanner.routes.js` | Public read routes |
| `client/components/common/PromoBanner.tsx` | Reusable promo banner component |
| `client/components/common/StickyPromoBanner.tsx` | Sticky bottom wrapper |
| `client/components/coupon/PromoModal.tsx` | Modal shown on "Get Deal" click |
| `client/services/api.ts` | `getPromoBanners`, `createPromoBanner`, `updatePromoBanner`, `deletePromoBanner` |

---

## Database Schema

```
logo          String (default: "amazon")
text          String (required)
buttonLabel   String (default: "Get Deal")
storeName     String
storeUrl      String
couponCode    String
discount      String
expiryDate    Date
details       String
gradient      String (default: "linear-gradient(90deg, #a855f7 0%, #9333ea 100%)")
placement     Enum: inline, sticky, both (default: both)
isActive      Boolean (default: true)
order         Number (default: 0)
```
