# Pages — Admin Documentation

**URL:** `http://localhost:3000/admin/pages`

---

## Overview

Manage custom pages on the website. Each page has a URL slug and can contain multiple sections of different types (text, hero banner, featured coupons, etc.). The homepage is a special page managed here.

---

## CRUD Operations

### Create Page

Managed from **CMS & Config** page (`/admin/cms`) → "Pages Management" accordion.

1. Fill the "Create New Page" form:

| Field | Required | Description |
|-------|----------|-------------|
| Page Title | ✅ | Display title (e.g., "About Us") |
| Page URL (Slug) | ✅ | Auto-generated from title (e.g., `about-us`) |
| Page Template | ❌ | `Default` / `Landing Page` / `Blog Style` / `Contact Page` |
| Page Description | ❌ | SEO meta description |

2. Click **"Create Page"**

### Edit Page Content

1. Click **"Edit Content"** on any page card
2. In the Page Editor modal:
   - Modify page title, slug, description
   - Add sections using the "Add New Section" form
   - Edit existing section titles, order, content
   - Remove sections
3. Click **"Save Page Content"**

### Add Section to Page

| Field | Description |
|-------|-------------|
| Section Type | `Text Content` / `Hero Banner` / `Featured Coupons` / `Trending Coupons` / `Top Stores` / `Categories` / `Image Gallery` / `Custom HTML` |
| Section Title | Display title for the section |
| Order | Numeric order (sections sorted by this) |

Section-specific fields appear based on type:
- **Text/Custom HTML:** Content textarea
- **Hero Banner:** Image URL, Background Color, Content
- **Featured/Trending/Top Stores:** Items Limit number

### Delete Page

Click **"Delete"** → confirm. ⚠️ Cannot be undone.

### Preview Page

Click **"Preview"** to open the page in a new tab at `/{slug}`.

---

## Homepage Configuration

The homepage (`page: 'home'`) is the most important page. Its sections control what appears on the public homepage.

The homepage currently renders these section types:
- `heroBanner` → HeroBanner component (triggers all other homepage sections below it)

After the hero banner, these components are hardcoded in order:
1. FeaturedCoupons
2. CashBackSection
3. PromoCard (video)
4. PromoBanner (inline)
5. DealsSection
6. BlogSection
7. TopDealsCarousel
8. PopularAccordion
9. StickyPromoBanner (fixed bottom)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/site/:pageName` | Get page by name |
| GET | `/api/admin/pages` | List all pages |
| POST | `/api/admin/pages/create` | Create page |
| PUT | `/api/admin/pages/:pageName/update` | Update page by name |
| PUT | `/api/admin/pages/:id` | Update page by ID |
| DELETE | `/api/admin/pages/:id` | Delete page |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/cms/page.tsx` | CMS page (Pages accordion) |
| `client/app/admin/pages/page.tsx` | Dedicated pages admin |
| `server/src/models/Page.js` | Page mongoose model |
| `server/src/routes/admin/pages/page.routes.js` | Admin routes |
| `server/src/routes/public/pages/page.routes.js` | Public routes |
| `client/components/DynamicHomepage.tsx` | Homepage renderer |

---

## Database Schema

```
page          String (required, unique)
title         String (required)
slug          String (required, unique)
description   String
isActive      Boolean (default: true)
template      String (default: "default")
seoTitle      String
seoDescription String
sections      [{
  id          String (required)
  order       Number (required)
  type        Enum: heroBanner, textContent, featuredCoupons, trendingCoupons, topStores, latestCoupons, categories, imageGallery, contactForm, customHTML, storeGrid, couponGrid
  title       String
  content     String
  image       String
  images      [String]
  limit       Number (default: 10)
  backgroundColor String
  textColor   String
  customCSS   String
  settings    Mixed
}]
```
