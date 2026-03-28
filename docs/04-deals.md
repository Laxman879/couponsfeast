# Deals — Admin Documentation

**URL:** `http://localhost:3000/admin/deals`

---

## Overview

Manage deals shown on the homepage in two sections:
1. **"March Madness Deals"** grid (DealsSection)
2. **"Today's Top Deals"** carousel + **"Top Deals"** grid (TopDealsCarousel)

---

## CRUD Operations

### Create Deal

1. Click **"Add Deal"** button
2. Fill the right-side drawer form:

| Field | Required | Description |
|-------|----------|-------------|
| Title | ✅ | Deal headline |
| Description | ❌ | Brief description |
| Discount | ❌ | e.g., "30% Off" |
| Store | ❌ | Select from stores dropdown |
| Category | ❌ | e.g., "Fashion", "Electronics" |
| Type | ❌ | `deal` / `offer` / `clearance` / `flash` |
| Link | ❌ | URL to deal page |
| Expiry Date | ❌ | Date picker |
| Deal Image | ❌ | Upload or paste URL — shown on deal cards |
| Active | ❌ | Toggle visibility on public site |
| Featured ⭐ | ❌ | Toggle — featured deals show in Top Deals carousel |

3. Click **"Create Deal"**

### Edit Deal

1. Click the **Edit** (pencil) icon on any deal card
2. Modify fields in the drawer → **"Update Deal"**

### Delete Deal

1. Click the **Delete** (trash) icon
2. Confirm in the dialog

---

## How Deals Appear on Homepage

### March Madness Deals (DealsSection)

- Shows **all active deals** (up to 10)
- 5-column grid layout
- Each card shows: image, discount badge, brand name, title, type pill

### Today's Top Deals Carousel (TopDealsCarousel)

- Shows **featured deals first** (`isFeatured: true`), falls back to all active deals
- Horizontal scrollable carousel with prev/next arrows
- Looping navigation

### Top Deals Grid (below carousel)

- Same data as carousel, displayed in 5-column grid
- Same card UI as March Madness Deals

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/deals/list` | Get active deals (supports `?store=`, `?category=`, `?type=`, `?limit=`) |
| GET | `/api/public/deals/details/:id` | Get deal by ID |
| GET | `/api/admin/deals` | List all deals (admin) |
| POST | `/api/admin/deals/create` | Create deal |
| PUT | `/api/admin/deals/update/:id` | Update deal |
| DELETE | `/api/admin/deals/delete/:id` | Delete deal |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/deals/page.tsx` | Admin deals management page |
| `server/src/models/Deal.js` | Deal mongoose model |
| `server/src/routes/admin/deals/deal.routes.js` | Admin CRUD routes |
| `server/src/routes/public/deals/deal.routes.js` | Public read routes |
| `client/components/sections/DealsSection.tsx` | March Madness Deals grid |
| `client/components/home/TopDealsCarousel.tsx` | Top Deals carousel + grid |
| `client/components/home/TopDealCard.tsx` | Individual deal card (carousel) |
| `client/services/api.ts` | `getDeals`, `createDeal`, `updateDeal`, `deleteDeal` |

---

## Database Schema

```
title         String (required)
description   String
discount      String
store         ObjectId → Store
category      String
image         String
link          String
type          Enum: deal, offer, clearance, flash
expiryDate    Date
isActive      Boolean (default: true)
isFeatured    Boolean (default: false)
clickCount    Number (default: 0)
```
