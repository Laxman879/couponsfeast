# Banners (Hero Carousel) — Admin Documentation

**URL:** `http://localhost:3000/admin/banners`

---

## Overview

Manage the hero carousel slides shown at the top of the homepage. Each banner is a full-width slide with image, text, CTA button, and optional coupon details.

When a user clicks the CTA:
- The store URL opens in a new tab
- A PromoModal popup shows the coupon code and discount

---

## CRUD Operations

### Create Banner

1. Click **"Add Banner"** button
2. Fill the right-side drawer form:

| Field | Required | Description |
|-------|----------|-------------|
| Label | ❌ | Small text above title (e.g., "THE DAILY DROP") |
| Title | ✅ | Main headline |
| CTA Text | ❌ | Button text (default: "SHOP NOW") |
| Button Link | ❌ | Internal link path |
| Background Color | ❌ | Hex color for slide background |
| Text Panel BG | ❌ | Background of the text overlay panel |
| Text Panel Margin Left | ❌ | Distance from left edge in pixels |
| Store URL | ❌ | Opens in new tab on CTA click |
| Coupon Code | ❌ | Auto-uppercased, shown in modal |
| **Coupon Details Section:** | | |
| Discount | ❌ | e.g., "20% OFF" |
| Store | ❌ | Select from stores dropdown (auto-fills Store URL) |
| Expiry Date | ❌ | Date picker |
| Type | ❌ | `Code` / `Sale` / `Cash Back` / `Free Shipping` |
| Label Type | ❌ | Display label text |
| Details | ❌ | Extra details for modal |
| Limited Time | ❌ | Toggle |
| Expiring Today | ❌ | Toggle |
| Exclusive | ❌ | Toggle |
| **Banner Image:** | | |
| Image URL | ❌ | Paste URL or upload file |
| Active | ❌ | Toggle visibility |

The drawer includes a **live preview** of the banner at the bottom.

3. Click **"Create Banner"**

### Edit Banner

1. Click **Edit** icon → modify → **"Update Banner"**

### Delete Banner

1. Click **Delete** icon → confirm

---

## Carousel Behavior

- Auto-advances every 5 seconds
- Pauses on hover
- Infinite loop (cloned first/last slides for seamless transition)
- Dot indicators (clickable)
- Prev/Next arrows (visible on hover)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/site/banners/list` | Get active banners |
| GET | `/api/admin/banner` | List all banners (admin) |
| POST | `/api/admin/banner/create` | Create banner |
| PUT | `/api/admin/banner/update/:id` | Update banner |
| DELETE | `/api/admin/banner/delete/:id` | Delete banner |
| POST | `/api/admin/upload/logo` | Upload banner image |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/banners/page.tsx` | Admin banners page |
| `server/src/models/Banner.js` | Banner mongoose model |
| `server/src/routes/admin/banner/banner.routes.js` | Admin routes |
| `server/src/routes/public/banner/banner.routes.js` | Public routes |
| `client/components/home/HeroCarousel.tsx` | Homepage carousel component |
| `client/components/banner/BannerLayouts.tsx` | Banner renderer |
| `client/components/coupon/PromoModal.tsx` | Modal on CTA click |
| `client/services/api.ts` | `getBanners`, `createBanner`, `updateBanner`, `deleteBanner`, `uploadBannerImage` |

---

## Database Schema

```
title            String (required)
label            String
cta              String
image            String
bgColor          String (default: "#ffffff")
textPanelBg      String (default: "#ffffff")
textPanelMargin  Number (default: 100)
buttonLink       String
storeUrl         String
couponCode       String
description      String
discount         String
store            ObjectId → Store
expiryDate       Date
type             Enum: code, sale, cashback, freeshipping
labelType        String
interestedUsers  Number
addedBy          String
details          String
limitedTime      Boolean
expiringToday    Boolean
exclusive        Boolean
isActive         Boolean (default: true)
```
