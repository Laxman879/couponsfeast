# CouponsFeast Admin Panel Documentation

> **Admin URL:** http://localhost:3000/admin  
> **Auto-redirects to:** http://localhost:3000/admin/dashboard

---

## Table of Contents

1. [Dashboard](#1-dashboard)
2. [Store Management](#2-store-management)
3. [Coupon Management](#3-coupon-management)
4. [Deals Management](#4-deals-management)
5. [Blog Articles](#5-blog-articles)
6. [Promo Banners](#6-promo-banners)
7. [Popular Links](#7-popular-links)
8. [Categories](#8-categories)
9. [Hero Carousel Banners](#9-hero-carousel-banners)
10. [Pages Management](#10-pages-management)
11. [CMS & Site Config](#11-cms--site-config)

---

## 1. Dashboard

**URL:** `/admin/dashboard`

Overview page showing KPI cards, quick actions, recent activity, and system status. No CRUD operations — serves as the landing page after login.

---

## 2. Store Management

**URL:** `/admin/stores`

### What It Controls
- Store pages at `/view/[domain]` (e.g., `/view/amazon.com`)
- Store logos, names, and descriptions shown across the site
- Store-specific page sections: Header, Promo Info, Sales Info, About Section, Sidebar Data

### CRUD Operations

| Action | How |
|--------|-----|
| **Create** | Click "Add Store" → Fill store name, slug, logo (upload or URL), website URL, description → Click "Create Store" |
| **Edit** | Click "Edit" on any store row → Modify fields → Click "Update Store" |
| **Delete** | Click "Delete" on any store row → Confirm in dialog |

### Store Sub-Editors (per store)

Each store row has additional editor buttons:

#### Header Settings
- **Button:** "Header" (green)
- **Fields:** Logo background color, custom date label
- **Live Preview:** Shows real-time header preview
- **Affects:** The header banner on `/view/[domain]` page

#### Promo Info
- **Button:** "Promo" (yellow)
- **Fields:** Heading, logo text, logo card background color, content sections (title + body pairs)
- **Affects:** "Promo Codes" section on store page

#### Sales Info
- **Button:** "Sales" (purple)
- **Fields:** Section heading, subheading, sales entries (title + description pairs)
- **Affects:** "Store Info" section on store page

#### About Section
- **Button:** "About" (pink)
- **Fields:** Heading, content paragraphs (add/remove dynamically)
- **Affects:** "About" section on store page

#### Sidebar Data
- **Button:** "Sidebar" (blue)
- **Fields:**
  - Author: name, role, image (upload), bio, bio URL
  - Trust: last verified date, commission note, trust text
  - How-To Steps: dynamic list of steps
  - Featured Article: title, author, image (upload), URL, description
  - Store Info: address, rating (0-5), rating count, in-store coupons count
- **Affects:** Left sidebar on `/view/[domain]` page

### API Endpoints
```
GET    /api/admin/stores/list
GET    /api/admin/stores/details/:id
POST   /api/admin/stores/create
PUT    /api/admin/stores/update/:id
DELETE /api/admin/stores/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/stores/page.tsx` | Admin UI for store CRUD + sub-editors |
| `server/src/models/Store.js` | Store schema (storeName, slug, logo, websiteUrl, promoInfo, storeInfo, aboutSection, sidebarData) |
| `server/src/routes/admin/stores/store.routes.js` | Admin API routes |
| `client/app/view/[domain]/page.tsx` | Public store page that renders all store data |

---

## 3. Coupon Management

**URL:** `/admin/coupons`

### What It Controls
- Coupons displayed on store pages (`/view/[domain]`)
- Featured coupons on homepage
- Coupon codes, discounts, and click tracking

### CRUD Operations

| Action | How |
|--------|-----|
| **Create** | Click "Add Coupon" → Fill title, code (auto-uppercase), description, discount, select store, expiry date, type, label type, interested users, added by, details → Toggle: limited time, expiring today, exclusive, featured → Click "Create Coupon" |
| **Edit** | Click "Edit" on any coupon row → Modify fields → Click "Update Coupon" |
| **Delete** | Click "Delete" on any coupon row → Confirm in dialog |

### Coupon Fields

| Field | Description |
|-------|-------------|
| Title | Coupon display title |
| Code | Promo code (auto-uppercase) |
| Description | Brief description |
| Discount | e.g., "20% OFF", "$10 OFF" |
| Store | Select from existing stores |
| Expiry Date | Date picker |
| Type | code / sale / cashback / freeshipping |
| Label Type | Display label (e.g., "Code", "Deal") |
| Interested Users | Number shown as social proof |
| Added By | Staff name |
| Details | Extra details shown on expand |
| Limited Time | Toggle — shows "Limited Time" badge |
| Expiring Today | Toggle — shows "Expiring Today" badge |
| Exclusive | Toggle — shows "Exclusive" badge |
| Featured | Toggle — shows on homepage featured section |
| Featured Image | Upload image for featured card (only when featured is ON) |

### API Endpoints
```
GET    /api/admin/coupons/list
GET    /api/admin/coupons/details/:id
POST   /api/admin/coupons/create
PUT    /api/admin/coupons/update/:id
DELETE /api/admin/coupons/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/coupons/page.tsx` | Admin UI for coupon CRUD |
| `server/src/models/Coupon.js` | Coupon schema |
| `server/src/routes/admin/coupons/coupon.routes.js` | Admin API routes |
| `client/components/coupon/CouponCard.tsx` | Public coupon card component |

---

## 4. Deals Management

**URL:** `/admin/deals`

### What It Controls
- "March Madness Deals" grid section on homepage
- "Today's Top Deals" carousel on homepage
- "Top Deals" grid section on homepage

### CRUD Operations

| Action | How |
|--------|-----|
| **Create** | Click "Add Deal" → Fill title, description, discount, select store, category, type, link, expiry date → Upload deal image → Toggle: active, featured → Click "Create Deal" |
| **Edit** | Click edit icon on any deal card → Modify fields → Click "Update Deal" |
| **Delete** | Click delete icon on any deal card → Confirm in dialog |

### How Deals Appear on Homepage

| Homepage Section | Which Deals Show |
|-----------------|-----------------|
| March Madness Deals (DealsSection) | All active deals (limit 10) |
| Today's Top Deals carousel | Featured active deals first, then all active deals |
| Top Deals grid | Same data as carousel |

### Deal Fields

| Field | Description |
|-------|-------------|
| Title | Deal display title |
| Description | Brief description |
| Discount | e.g., "30% Off" |
| Store | Select from existing stores |
| Category | e.g., "Fashion", "Electronics" |
| Type | deal / offer / clearance / flash |
| Link | URL to deal page |
| Image | Upload or paste URL — shown on deal cards |
| Expiry Date | Date picker |
| Active | Toggle — controls visibility |
| Featured | Toggle — prioritized in Top Deals carousel |

### API Endpoints
```
GET    /api/admin/deals
POST   /api/admin/deals/create
PUT    /api/admin/deals/update/:id
DELETE /api/admin/deals/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/deals/page.tsx` | Admin UI for deal CRUD |
| `server/src/models/Deal.js` | Deal schema |
| `server/src/routes/admin/deals/deal.routes.js` | Admin API routes |
| `client/components/sections/DealsSection.tsx` | "March Madness Deals" grid |
| `client/components/home/TopDealsCarousel.tsx` | "Today's Top Deals" carousel + "Top Deals" grid |
| `client/components/home/TopDealCard.tsx` | Individual deal card in carousel |

---

## 5. Blog Articles

**URL:** `/admin/blog`

### What It Controls
- "THE REAL DEAL" blog section on homepage (featured article + sidebar cards)
- Individual blog post pages at `/blog/[slug]`

### CRUD Operations

| Action | How |
|--------|-----|
| **Create** | Click "Add Article" → Fill title (slug auto-generates), category, subtitle, description → Upload image → Add content paragraphs → Toggle: active, featured → Click "Create" |
| **Edit** | Click edit icon on any article card → Modify fields → Click "Update" |
| **Delete** | Click delete icon on any article card → Confirm in dialog |

### How Blog Section Works on Homepage

- The **first featured article** (or first article if none featured) becomes the large left card
- The **next 3 articles** become the sidebar cards on the right
- If no articles exist in the database, hardcoded fallback data is shown

### Blog Article Fields

| Field | Description |
|-------|-------------|
| Title | Article title |
| Slug | URL-friendly slug (auto-generated from title) |
| Category | e.g., "BEAUTY", "BE A TAX PRO" |
| Subtitle | Short subtitle |
| Description | Brief description (shown on homepage card) |
| Image | Upload or paste URL — shown as article hero image |
| Content | Multiple paragraphs (add/remove dynamically) |
| Order | Display order |
| Active | Toggle — controls visibility |
| Featured | Toggle — becomes the large featured card on homepage |

### API Endpoints
```
GET    /api/admin/blog
POST   /api/admin/blog/create
PUT    /api/admin/blog/update/:id
DELETE /api/admin/blog/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/blog/page.tsx` | Admin UI for blog CRUD |
| `server/src/models/BlogArticle.js` | BlogArticle schema |
| `server/src/routes/admin/blog/blog.routes.js` | Admin API routes |
| `client/components/sections/BlogSection.tsx` | Homepage blog section (fetches from API) |
| `client/components/common/FeaturedArticle.tsx` | Large featured article card |
| `client/components/common/SidebarCard.tsx` | Small sidebar article card |
| `client/components/common/BlogPost.tsx` | Full blog post page component |
| `client/app/blog/[slug]/page.tsx` | Blog post route (fetches from API) |

---

## 6. Promo Banners

**URL:** `/admin/promo-banners`

### What It Controls
- Purple gradient promo banner below the video section on homepage (inline, no close button)
- Sticky promo banner at the bottom of the page (closable with X)
- "Get Deal" button opens PromoModal + navigates to store URL

### CRUD Operations

| Action | How |
|--------|-----|
| **Create** | Click "Add Banner" → Fill banner text, logo tag, button label, store name, store URL, coupon code, discount, expiry date, gradient CSS, placement, details → Toggle: active → Click "Create" |
| **Edit** | Click edit icon on any banner card → Modify fields → Click "Update" |
| **Delete** | Click delete icon on any banner card → Confirm in dialog |

### Placement Options

| Placement | Where It Shows |
|-----------|---------------|
| `inline` | Only below video section (no close button) |
| `sticky` | Only as sticky bar at page bottom (with close button) |
| `both` | Shows in both locations |

### Promo Banner Fields

| Field | Description |
|-------|-------------|
| Banner Text | Main text (e.g., "TODAY'S DEAL IS LIVE!") |
| Logo Tag | Brand tag shown in white pill (e.g., "amazon") |
| Button Label | CTA button text (default: "Get Deal") |
| Store Name | Store name shown in PromoModal |
| Store URL | URL opened on "Get Deal" click (e.g., `/view/amazon.com?u=...`) |
| Coupon Code | Code shown in PromoModal (optional) |
| Discount | Discount badge in PromoModal (optional) |
| Expiry Date | Shown in PromoModal footer |
| Details | Extra details in PromoModal |
| Gradient CSS | Background gradient (e.g., `linear-gradient(90deg, #a855f7, #9333ea)`) — live preview shown |
| Placement | inline / sticky / both |
| Order | Display priority |
| Active | Toggle — controls visibility |

### API Endpoints
```
GET    /api/admin/promo-banners
POST   /api/admin/promo-banners/create
PUT    /api/admin/promo-banners/update/:id
DELETE /api/admin/promo-banners/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/promo-banners/page.tsx` | Admin UI for promo banner CRUD |
| `server/src/models/PromoBanner.js` | PromoBanner schema |
| `server/src/routes/admin/promo-banners/promoBanner.routes.js` | Admin API routes |
| `client/components/common/PromoBanner.tsx` | Reusable promo banner component (fetches from API) |
| `client/components/common/StickyPromoBanner.tsx` | Sticky bottom wrapper |
| `client/components/coupon/PromoModal.tsx` | Modal shown on "Get Deal" click |

---

## 7. Popular Links

**URL:** `/admin/popular-links`

### What It Controls
- "Popular Categories" accordion section above footer on homepage
- "Popular Stores" accordion section above footer on homepage

### CRUD Operations

| Action | How |
|--------|-----|
| **Create** | Click "Add Link" → Fill name, link URL, select type (category/store), order → Toggle: active → Click "Create" |
| **Edit** | Click edit icon on any link card → Modify fields → Click "Update" |
| **Delete** | Click delete icon on any link card → Confirm in dialog |

### Filter Chips
- **All** — shows all links
- **Categories** — shows only category type links
- **Stores** — shows only store type links

### Popular Link Fields

| Field | Description |
|-------|-------------|
| Name | Display name (e.g., "Electronics", "Amazon") |
| Link URL | Where it navigates (e.g., `/category/electronics`, `#`) |
| Type | `category` → appears in "Popular Categories" accordion; `store` → appears in "Popular Stores" accordion |
| Order | Display order within its type |
| Active | Toggle — controls visibility |

### API Endpoints
```
GET    /api/admin/popular-links
POST   /api/admin/popular-links/create
PUT    /api/admin/popular-links/update/:id
DELETE /api/admin/popular-links/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/popular-links/page.tsx` | Admin UI for popular links CRUD |
| `server/src/models/PopularLink.js` | PopularLink schema |
| `server/src/routes/admin/popular-links/popularLink.routes.js` | Admin API routes |
| `client/components/common/PopularAccordion.tsx` | Homepage accordion (fetches from API) |

---

## 8. Categories

**URL:** `/admin/categories`

### What It Controls
- Category pages and filtering
- Navbar dropdown categories

### CRUD Operations

Managed from the dedicated categories admin page. Create, edit, delete categories with name, slug, color, icon, description, and navbar link settings.

### API Endpoints
```
GET    /api/admin/categories/list
POST   /api/admin/categories/create
PUT    /api/admin/categories/update/:id
DELETE /api/admin/categories/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/categories/page.tsx` | Admin UI |
| `server/src/models/Category.js` | Category schema |
| `server/src/routes/admin/categories/category.routes.js` | Admin API routes |

---

## 9. Hero Carousel Banners

**URL:** `/admin/banners`

### What It Controls
- Homepage hero carousel (the large sliding banners at the top)
- Each banner can link to a store and show a PromoModal on CTA click

### CRUD Operations

| Action | How |
|--------|-----|
| **Create** | Click "Add Banner" → Fill label, title, CTA text, button link, background color, text panel BG, text panel margin, store URL, coupon code → Fill coupon details (discount, store, expiry, type, label type, details, toggles) → Upload banner image → Toggle: active → Click "Create Banner" |
| **Edit** | Click edit icon on any banner → Modify fields in right-side drawer → Click "Update Banner" |
| **Delete** | Click delete icon on any banner → Confirm in dialog |

### Banner Fields

| Field | Description |
|-------|-------------|
| Label | Small text above title (e.g., "THE DAILY DROP") |
| Title | Main banner headline |
| CTA Text | Button text (e.g., "SHOP TODAY'S SAVINGS") |
| Button Link | Internal navigation link |
| Background Color | Banner background (hex) |
| Text Panel BG | Text overlay background — white = black text, dark = white text |
| Text Panel Margin | Left margin of text panel in pixels |
| Store URL | Opens in new tab on CTA click |
| Coupon Code | Code shown in PromoModal |
| Image | Banner background image (upload or URL) |
| **Coupon Details:** | |
| Discount | e.g., "20% OFF" |
| Store | Select from stores |
| Expiry Date | Date picker |
| Type | code / sale / cashback / freeshipping |
| Label Type | Display label |
| Details | Extra details |
| Limited Time | Toggle |
| Expiring Today | Toggle |
| Exclusive | Toggle |
| Active | Toggle — controls visibility |

### Live Preview
The drawer shows a scaled-down live preview of the banner as you edit.

### API Endpoints
```
GET    /api/admin/banner
POST   /api/admin/banner/create
PUT    /api/admin/banner/update/:id
DELETE /api/admin/banner/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/banners/page.tsx` | Admin UI for banner CRUD |
| `server/src/models/Banner.js` | Banner schema |
| `server/src/routes/admin/banner/banner.routes.js` | Admin API routes |
| `client/components/home/HeroCarousel.tsx` | Homepage carousel component |
| `client/components/banner/BannerLayouts.tsx` | Banner rendering layouts |

---

## 10. Pages Management

**URL:** `/admin/pages`

### What It Controls
- Custom pages (e.g., About Us, Contact, etc.)
- Homepage section ordering

### CRUD Operations
Managed from the dedicated pages admin page or from CMS panel.

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/pages/page.tsx` | Admin UI |
| `server/src/models/Page.js` | Page schema |
| `server/src/routes/admin/pages/page.routes.js` | Admin API routes |

---

## 11. CMS & Site Config

**URL:** `/admin/cms`

### What It Controls
Everything that isn't a specific content type — site-wide settings, navigation, footer, and more.

### Sections (Accordion Panels)

#### Site Configuration (SiteConfigAdmin component)
- Site name, description, contact email
- SEO: meta title, description, keywords, OG tags, Twitter card
- Theme: primary/secondary/background/text/accent colors
- Typography: heading, body, mono fonts
- Logos: navbar, footer, favicon, OG image (all uploadable)
- Social media: Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok (URL + enable/disable)
- Navbar config: layout, style, colors, search toggle, theme toggle, sticky, CTA, banner text
- Footer config: layout, style, colors, app download toggle, contact info toggle
- Footer content: tagline, columns with headings and links

#### Navigation Menu
- **Edit:** Change menu item names and URLs inline
- **Theme:** Background color and text color for navbar
- **Save:** Click "Save Navigation" — triggers live refresh on frontend

#### Homepage Sections
- **Edit:** Reorder sections by changing order numbers, edit titles
- **Save:** Click "Save Homepage"

#### Categories Management
- **Create:** Fill name, color class, navigation link setting, dropdown section → Click "Add Category"
- **Delete:** Click "Delete" on any category
- **Nav Link Options:** No Link / Navbar Only / Footer Only / Both
- **Dropdown Section:** Categories Section / Popular Section

#### Popular Stores Management
- **Create:** Fill name, color class, navigation link setting, dropdown section → Click "Add Store"
- **Delete:** Click "Delete" on any store
- Same nav link and dropdown options as categories

#### Pages Management
- **Create:** Fill page title (slug auto-generates), select template, add description → Click "Create Page"
- **Edit Content:** Click "Edit Content" → Add/remove/reorder sections (text, hero banner, featured coupons, trending coupons, top stores, categories, image gallery, custom HTML)
- **Preview:** Click "Preview" to open page in new tab
- **Delete:** Click "Delete" on any page

#### Footer Links Management
- **Create:** Fill label, URL, select section (Main Links / My RMN / Bottom Links), order → Click "Add Link"
- **Edit:** Click "Edit" on any link → Modify inline → Click "Save"
- **Delete:** Click "Delete" on any link
- Links grouped by section for easy management

#### Global FAQ Section
- **Add:** Click "+ Add FAQ" → Fill question and answer
- **Edit:** Modify question/answer inline
- **Remove:** Click "Remove" on any FAQ
- **Save:** Click "Save FAQs"
- These FAQs appear on all store pages (`/view/[domain]`)

### API Endpoints
```
GET    /api/admin/pages/site-config
PUT    /api/admin/pages/site-config/update
GET    /api/admin/navbar/navigation
PUT    /api/admin/navbar/navigation/update
GET    /api/admin/footer/links/list
POST   /api/admin/footer/links/create
PUT    /api/admin/footer/links/update/:id
DELETE /api/admin/footer/links/delete/:id
```

### Files
| File | Purpose |
|------|---------|
| `client/app/admin/cms/page.tsx` | CMS admin page with all accordion panels |
| `client/components/admin/SiteConfigAdmin.tsx` | Site configuration component |
| `server/src/models/SiteConfig.js` | Site config schema |
| `server/src/models/Navigation.js` | Navigation schema |
| `server/src/models/FooterLink.js` | Footer link schema |
| `server/src/models/Page.js` | Page schema |

---

## Homepage Section Order (controlled by DynamicHomepage.tsx)

```
1. Hero Carousel Banners     → /admin/banners
2. Featured Coupons           → /admin/coupons (isFeatured toggle)
3. Cash Back Section          → Hardcoded UI
4. Video Promo Card           → Hardcoded UI
5. Promo Banner (inline)      → /admin/promo-banners
6. March Madness Deals        → /admin/deals
7. Blog Section               → /admin/blog
8. Today's Top Deals Carousel → /admin/deals (isFeatured toggle)
9. Top Deals Grid             → /admin/deals
10. Popular Accordion          → /admin/popular-links
11. Sticky Promo Banner        → /admin/promo-banners
```

**File:** `client/components/DynamicHomepage.tsx`

---

## Admin Sidebar Navigation

| Menu Item | URL | Icon |
|-----------|-----|------|
| Dashboard | `/admin/dashboard` | LayoutDashboard |
| Stores | `/admin/stores` | Store |
| Coupons | `/admin/coupons` | Tag |
| Deals | `/admin/deals` | Flame |
| Blog Articles | `/admin/blog` | BookOpen |
| Promo Banners | `/admin/promo-banners` | Megaphone |
| Popular Links | `/admin/popular-links` | Link2 |
| Categories | `/admin/categories` | LayoutGrid |
| Banners | `/admin/banners` | Image |
| Pages | `/admin/pages` | FileText |
| CMS & Config | `/admin/cms` | Settings |

**File:** `client/components/admin/AdminSidebar.tsx`

---

## Shared Components

| Component | File | Used By |
|-----------|------|---------|
| AdminShell | `components/admin/AdminShell.tsx` | All admin pages (sidebar + main layout) |
| AdminSidebar | `components/admin/AdminSidebar.tsx` | AdminShell |
| ImageUploadField | `components/admin/ImageUploadField.tsx` | Stores, Deals, Blog, Banners, Coupons |
| SiteConfigAdmin | `components/admin/SiteConfigAdmin.tsx` | CMS page |

---

## API Service (Frontend)

**File:** `client/services/api.ts`

All API calls are centralized here. Each feature has:
- Public `get*` functions (read-only, used by frontend components)
- Admin `create*`, `update*`, `delete*` functions (used by admin pages)
- Upload functions for image handling
