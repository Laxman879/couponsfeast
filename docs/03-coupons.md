# Coupons — Admin Documentation

**URL:** `http://localhost:3000/admin/coupons`

---

## Overview

Manage all discount coupons. Coupons are linked to stores and displayed on store pages (`/view/{domain}`) and the homepage featured section.

---

## CRUD Operations

### Create Coupon

1. Click **"Add Coupon"** button
2. Fill in the dialog form:

| Field | Required | Description |
|-------|----------|-------------|
| Title | ✅ | Coupon headline (e.g., "Summer Sale 20% Off") |
| Code | ✅ | Promo code (auto-uppercased, e.g., "SUMMER20") |
| Description | ❌ | What the coupon offers |
| Discount | ✅ | Display text (e.g., "20% OFF", "$10 OFF") |
| Store | ✅ | Select from dropdown of existing stores |
| Expiry Date | ❌ | Date picker |
| Type | ❌ | `code` / `sale` / `cashback` / `freeshipping` |
| Label Type | ❌ | Display label (e.g., "Code", "Deal", "Offer") |
| Interested Users | ❌ | Number shown as social proof |
| Added By | ❌ | Staff name who added it |
| Details | ❌ | Extra details shown on expand |
| Limited Time | ❌ | Toggle — shows "Limited Time" badge |
| Expiring Today | ❌ | Toggle — shows "Expiring Today" badge |
| Exclusive | ❌ | Toggle — shows "Exclusive" badge |
| Featured | ❌ | Toggle — shows on homepage featured section |
| Featured Image | ❌ | Image for featured card (only when Featured is ON) |

3. Click **"Create Coupon"**

### Edit Coupon

1. Find coupon in the table
2. Click **"Edit"** → modify fields → **"Update Coupon"**

### Delete Coupon

1. Click **"Delete"** → confirm in dialog

---

## Where Coupon Data Appears

| Location | What Shows |
|----------|-----------|
| `/view/{domain}` | All coupons for that store (CouponCard component) |
| Homepage Featured Section | Coupons with `isFeatured: true` |
| Homepage Trending | Most clicked coupons |
| Coupon reveal modal | Code, discount, store info on click |

---

## Coupon Card Display Logic

| Field | How It's Used |
|-------|--------------|
| `type: 'code'` | Shows "Get Code" button |
| `type: 'sale'` | Shows "Get Deal" button |
| `type: 'cashback'` | Shows "Get Cash Back" button |
| `type: 'freeshipping'` | Shows "Free Shipping" button |
| `limitedTime: true` | Shows ⏰ "Limited Time" badge |
| `expiringToday: true` | Shows 🔥 "Expiring Today" badge |
| `exclusive: true` | Shows ⭐ "Exclusive" badge |
| `interestedUsers > 0` | Shows "X people interested" |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/coupons/list` | Get all active coupons |
| GET | `/api/public/coupons/details/:id` | Get coupon by ID |
| GET | `/api/public/coupons/trending` | Get trending (most clicked) |
| POST | `/api/public/coupons/reveal/:id` | Reveal coupon code |
| POST | `/api/public/coupons/track-click/:id` | Track click |
| POST | `/api/admin/coupons/create` | Create coupon |
| PUT | `/api/admin/coupons/update/:id` | Update coupon |
| DELETE | `/api/admin/coupons/delete/:id` | Delete coupon |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/coupons/page.tsx` | Admin coupons page |
| `server/src/models/Coupon.js` | Coupon mongoose model |
| `server/src/routes/admin/coupons/coupon.routes.js` | Admin CRUD routes |
| `server/src/routes/public/coupons/coupon.routes.js` | Public routes |
| `client/components/coupon/CouponCard.tsx` | Public coupon card UI |
| `client/components/coupon/PromoModal.tsx` | Code reveal modal |
| `client/services/api.ts` | `getCoupons`, `createCoupon`, `updateCoupon`, `deleteCoupon` |

---

## Database Schema

```
title             String (required)
code              String
description       String
discount          String
store             ObjectId → Store (required)
category          String
tags              [String]
expiryDate        Date
clickCount        Number (default: 0)
isActive          Boolean (default: true)
isFeatured        Boolean (default: false)
featuredImage     String
type              Enum: code, sale, cashback, freeshipping
labelType         String (default: "Code")
interestedUsers   Number (default: 0)
limitedTime       Boolean
expiringToday     Boolean
addedBy           String
exclusive         Boolean
details           String
```
