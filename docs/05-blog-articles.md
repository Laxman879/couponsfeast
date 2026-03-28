# Blog Articles — Admin Documentation

**URL:** `http://localhost:3000/admin/blog`

---

## Overview

Manage blog articles displayed on the homepage in the "THE REAL DEAL" section (BlogSection). Articles are also viewable at `/blog/{slug}`.

The homepage section shows:
- **1 featured article** (large, left 2/3 width) — the article with `isFeatured: true`
- **3 sidebar articles** (small, right 1/3 width) — remaining articles

---

## CRUD Operations

### Create Article

1. Click **"Add Article"** button
2. Fill the right-side drawer form:

| Field | Required | Description |
|-------|----------|-------------|
| Title | ✅ | Article headline (e.g., "Tax Season Survival Guide") |
| Slug | ✅ | URL path (auto-generated from title, e.g., `tax-season-survival-guide`) |
| Category | ❌ | e.g., "BE A TAX PRO", "BEAUTY" |
| Subtitle | ❌ | Short subtitle shown below title |
| Description | ❌ | Brief description for homepage card |
| Image | ❌ | Upload or paste URL — shown as article thumbnail |
| Content Paragraphs | ❌ | Array of text paragraphs (add/remove dynamically) |
| Order | ❌ | Display order (lower = first) |
| Active | ❌ | Toggle visibility |
| Featured ⭐ | ❌ | Toggle — featured article gets the large card on homepage |

3. Click **"Create"**

### Edit Article

1. Click the **Edit** icon on any article card
2. Modify fields → **"Update"**

### Delete Article

1. Click the **Delete** icon → confirm

---

## How Articles Appear on Public Site

### Homepage — BlogSection

| Position | Which Article | Display |
|----------|--------------|---------|
| Left (2/3 width) | First `isFeatured: true` article, or first article | Large image + category + title + description |
| Right sidebar (1/3) | Next 3 articles after featured | Small thumbnail + title + subtitle |

### Blog Detail Page — `/blog/{slug}`

Full article page with:
- SectionHeader ("THE REAL DEAL" branding)
- Back link
- Full-width image
- Category badge
- Title + subtitle
- All content paragraphs
- "Enjoyed this article?" CTA at bottom

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/blog/list` | Get all active articles |
| GET | `/api/public/blog/details/:slug` | Get article by slug |
| GET | `/api/admin/blog` | List all articles (admin) |
| POST | `/api/admin/blog/create` | Create article |
| PUT | `/api/admin/blog/update/:id` | Update article |
| DELETE | `/api/admin/blog/delete/:id` | Delete article |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/blog/page.tsx` | Admin blog management page |
| `server/src/models/BlogArticle.js` | BlogArticle mongoose model |
| `server/src/routes/admin/blog/blog.routes.js` | Admin CRUD routes |
| `server/src/routes/public/blog/blog.routes.js` | Public read routes |
| `client/components/sections/BlogSection.tsx` | Homepage blog section |
| `client/components/common/FeaturedArticle.tsx` | Large featured article card |
| `client/components/common/SidebarCard.tsx` | Small sidebar article card |
| `client/components/common/SectionHeader.tsx` | "THE REAL DEAL" header |
| `client/components/common/BlogPost.tsx` | Full article page component |
| `client/app/blog/[slug]/page.tsx` | Blog detail route |
| `client/services/api.ts` | `getBlogArticles`, `getBlogArticleBySlug`, `createBlogArticle`, `updateBlogArticle`, `deleteBlogArticle` |

---

## Database Schema

```
title         String (required)
slug          String (required, unique)
category      String
subtitle      String
description   String
image         String
content       [String]  — array of paragraphs
isFeatured    Boolean (default: false)
isActive      Boolean (default: true)
order         Number (default: 0)
```
