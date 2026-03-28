# Popular Links — Admin Documentation

**URL:** `http://localhost:3000/admin/popular-links`

---

## Overview

Manage the "Popular Categories" and "Popular Stores" accordion section that appears above the footer on the homepage. Each link is either a category or a store type.

---

## CRUD Operations

### Create Link

1. Click **"Add Link"** button
2. Fill the right-side drawer form:

| Field | Required | Description |
|-------|----------|-------------|
| Name | ✅ | Display name (e.g., "Electronics", "Amazon") |
| Link URL | ❌ | Where it links to (e.g., `/category/electronics`, default: `#`) |
| Type | ✅ | `Popular Category` or `Popular Store` |
| Order | ❌ | Display order within its type group |
| Active | ❌ | Toggle visibility |

3. Click **"Create"**

### Edit Link

1. Click **Edit** icon → modify → **"Update"**

### Delete Link

1. Click **Delete** icon → confirm

---

## Filter Chips

The admin page has filter chips at the top:
- **All** — shows all links
- **Categories** — shows only category type links
- **Stores** — shows only store type links

Each chip shows the count.

---

## How Links Appear on Homepage

### PopularAccordion Component (above footer)

| Section | Default State | Content |
|---------|--------------|---------|
| **Popular Categories** | Open (expanded) | All links with `type: 'category'` |
| **Popular Stores** | Closed (collapsed) | All links with `type: 'store'` |

Links are displayed in a 5-column grid layout. Each link is clickable.

**Fallback:** If no links exist in the database, hardcoded fallback data is shown (27 categories, 25 stores).

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/popular-links/list` | Get all active links |
| GET | `/api/admin/popular-links` | List all links (admin) |
| POST | `/api/admin/popular-links/create` | Create link |
| PUT | `/api/admin/popular-links/update/:id` | Update link |
| DELETE | `/api/admin/popular-links/delete/:id` | Delete link |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/popular-links/page.tsx` | Admin popular links page |
| `server/src/models/PopularLink.js` | PopularLink mongoose model |
| `server/src/routes/admin/popular-links/popularLink.routes.js` | Admin CRUD routes |
| `server/src/routes/public/popular-links/popularLink.routes.js` | Public read routes |
| `client/components/common/PopularAccordion.tsx` | Homepage accordion component |
| `client/services/api.ts` | `getPopularLinks`, `createPopularLink`, `updatePopularLink`, `deletePopularLink` |

---

## Database Schema

```
name       String (required)
href       String (default: "#")
type       Enum: category, store (required)
isActive   Boolean (default: true)
order      Number (default: 0)
```
