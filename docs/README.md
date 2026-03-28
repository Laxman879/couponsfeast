# CouponsFeast Admin Panel — Complete Documentation

**Admin URL:** `http://localhost:3000/admin`  
**Auto-redirects to:** `http://localhost:3000/admin/dashboard`

---

## Admin Sidebar Menu → Documentation Index

| # | Menu Item | Admin URL | Doc File | What It Controls |
|---|-----------|-----------|----------|-----------------|
| 1 | **Dashboard** | `/admin/dashboard` | [01-dashboard.md](./01-dashboard.md) | KPI overview, quick actions, system status |
| 2 | **Stores** | `/admin/stores` | [02-stores.md](./02-stores.md) | Store CRUD + Header, Promo, Sales, About, Sidebar editors |
| 3 | **Coupons** | `/admin/coupons` | [03-coupons.md](./03-coupons.md) | Coupon CRUD with codes, discounts, badges, featured toggle |
| 4 | **Deals** | `/admin/deals` | [04-deals.md](./04-deals.md) | March Madness Deals grid + Today's Top Deals carousel |
| 5 | **Blog Articles** | `/admin/blog` | [05-blog-articles.md](./05-blog-articles.md) | "THE REAL DEAL" blog section + `/blog/{slug}` pages |
| 6 | **Promo Banners** | `/admin/promo-banners` | [06-promo-banners.md](./06-promo-banners.md) | Inline + sticky purple promo banners with deal modals |
| 7 | **Popular Links** | `/admin/popular-links` | [07-popular-links.md](./07-popular-links.md) | Popular Categories & Popular Stores accordion (above footer) |
| 8 | **Categories** | `/admin/categories` | [08-categories.md](./08-categories.md) | Navbar dropdown categories |
| 9 | **Banners** | `/admin/banners` | [09-banners.md](./09-banners.md) | Hero carousel slides with coupon details + image upload |
| 10 | **Pages** | `/admin/pages` | [10-pages.md](./10-pages.md) | Custom pages with dynamic sections |
| 11 | **CMS & Config** | `/admin/cms` | [11-cms-config.md](./11-cms-config.md) | Site config, navbar, footer, FAQs, navigation, popular stores |

---

## Homepage Section Order (What Admin Controls What)

| # | Homepage Section | Managed From |
|---|-----------------|-------------|
| 1 | Hero Carousel | `/admin/banners` |
| 2 | Featured Coupons | `/admin/coupons` (toggle `isFeatured`) |
| 3 | Cash Back Section | Hardcoded (static) |
| 4 | Video Promo Card | Hardcoded (static) |
| 5 | Promo Banner (inline) | `/admin/promo-banners` |
| 6 | March Madness Deals | `/admin/deals` |
| 7 | Blog Section ("THE REAL DEAL") | `/admin/blog` |
| 8 | Today's Top Deals Carousel | `/admin/deals` (toggle `isFeatured`) |
| 9 | Top Deals Grid | `/admin/deals` |
| 10 | Popular Categories/Stores | `/admin/popular-links` |
| 11 | Sticky Promo Banner (bottom) | `/admin/promo-banners` |

---

## Store Page (`/view/{domain}`) — What Admin Controls What

| Section | Managed From |
|---------|-------------|
| Page Header (logo, date) | `/admin/stores` → Header editor |
| Coupon List | `/admin/coupons` (coupons linked to this store) |
| Promo Code Info | `/admin/stores` → Promo editor |
| Store Info / Sales | `/admin/stores` → Sales editor |
| About Section | `/admin/stores` → About editor |
| Left Sidebar | `/admin/stores` → Sidebar editor |
| FAQ Section | `/admin/cms` → Global FAQ |

---

## Navbar & Footer — What Admin Controls What

| Element | Managed From |
|---------|-------------|
| Navbar menu items | `/admin/cms` → Navigation Menu |
| Navbar colors/style | `/admin/cms` → Site Config → Navbar Config |
| Navbar logo | `/admin/cms` → Site Config → Logos |
| Navbar dropdown categories | `/admin/cms` → Categories Management |
| Navbar dropdown popular stores | `/admin/cms` → Popular Stores Management |
| Footer links | `/admin/cms` → Footer Links Management |
| Footer style/layout | `/admin/cms` → Site Config → Footer Config |
| Footer content/columns | `/admin/cms` → Site Config → Footer Content |
| Social media links | `/admin/cms` → Site Config → Social Media |

---

## API Architecture

```
Base URL: http://localhost:5000/api

Public (read-only):    /api/public/*
Admin (full CRUD):     /api/admin/*
```

### All Admin API Endpoints Summary

| Resource | List | Create | Update | Delete |
|----------|------|--------|--------|--------|
| Stores | `GET /admin/stores/list` | `POST /admin/stores/create` | `PUT /admin/stores/update/:id` | `DELETE /admin/stores/delete/:id` |
| Coupons | `GET /admin/coupons/list` | `POST /admin/coupons/create` | `PUT /admin/coupons/update/:id` | `DELETE /admin/coupons/delete/:id` |
| Deals | `GET /admin/deals` | `POST /admin/deals/create` | `PUT /admin/deals/update/:id` | `DELETE /admin/deals/delete/:id` |
| Blog Articles | `GET /admin/blog` | `POST /admin/blog/create` | `PUT /admin/blog/update/:id` | `DELETE /admin/blog/delete/:id` |
| Promo Banners | `GET /admin/promo-banners` | `POST /admin/promo-banners/create` | `PUT /admin/promo-banners/update/:id` | `DELETE /admin/promo-banners/delete/:id` |
| Popular Links | `GET /admin/popular-links` | `POST /admin/popular-links/create` | `PUT /admin/popular-links/update/:id` | `DELETE /admin/popular-links/delete/:id` |
| Categories | `GET /admin/categories/list` | `POST /admin/categories/create` | `PUT /admin/categories/update/:id` | `DELETE /admin/categories/delete/:id` |
| Banners | `GET /admin/banner` | `POST /admin/banner/create` | `PUT /admin/banner/update/:id` | `DELETE /admin/banner/delete/:id` |
| Pages | `GET /admin/pages` | `POST /admin/pages/create` | `PUT /admin/pages/:id` | `DELETE /admin/pages/:id` |
| Footer Links | `GET /admin/footer/links/list` | `POST /admin/footer/links/create` | `PUT /admin/footer/links/update/:id` | `DELETE /admin/footer/links/delete/:id` |
| Site Config | `GET /admin/pages/site-config` | — | `PUT /admin/pages/site-config/update` | — |
| Navigation | `GET /admin/navbar/navigation` | — | `PUT /admin/navbar/navigation/update` | — |
| Upload | — | `POST /admin/upload/logo` | — | `DELETE /admin/upload/logo/delete/:filename` |

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Material UI, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose
- **Image Upload:** Multer → local `/uploads/` directory
- **State:** Redux Toolkit + React hooks
- **Notifications:** react-hot-toast
