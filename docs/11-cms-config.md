# CMS & Config — Admin Documentation

**URL:** `http://localhost:3000/admin/cms`

---

## Overview

The CMS & Config page is the central hub for managing site-wide settings. It contains multiple accordion sections for different configuration areas.

---

## Accordion Sections

### 1. Site Configuration (SiteConfigAdmin component)

Manages global site settings stored in the SiteConfig model.

| Setting Group | Fields |
|--------------|--------|
| **Basic Info** | Site Name, Site Description, Contact Email, Theme Name |
| **SEO & Meta** | Meta Title, Meta Description, Meta Keywords, Favicon, OG Title, OG Description, OG Image, Twitter Card, Twitter Site |
| **Theme & Colors** | Primary Color, Secondary Color, Background Color, Text Color, Accent Color, Success/Error/Warning Colors |
| **Typography** | Heading Font, Body Font, Mono Font |
| **Logos** | Navbar Logo (upload), Footer Logo (upload), Favicon (upload), OG Image (upload) |
| **Social Media** | Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok — each with label, URL, icon, enabled toggle |
| **Navbar Config** | Layout, Style, BG Color, Text Color, Show Search, Show Theme Toggle, Sticky, CTA Text/Link, Banner Text/Highlight, Show Banner |
| **Footer Config** | Layout, Style, BG Color, Text Color, Show App Download, Show Contact Info |
| **Footer Content** | Tagline, Columns with headings and links |
| **Footer Info** | Copyright, Email, Phone, Address, Show Social Media, Show Newsletter |

### 2. Navigation Menu

Manage the navbar menu items.

| Field | Description |
|-------|-------------|
| Background Color | Navbar background hex color |
| Text Color | Navbar text hex color |
| Menu Items | Array of { name, url } pairs |

Click **"Save Navigation"** to apply. Changes trigger a live refresh on the public site.

### 3. Homepage Sections

Manage the order and titles of homepage sections.

| Field | Description |
|-------|-------------|
| Order | Numeric sort order |
| Type | Section type (read-only) |
| Title | Section display title |

Click **"Save Homepage"** to apply.

### 4. Categories Management

See [Categories Documentation](./08-categories.md) for full details.

- Add new categories with name, color, nav link settings
- Delete existing categories
- Configure dropdown section placement

### 5. Popular Stores Management

Manage popular stores shown in the navbar dropdown.

| Field | Description |
|-------|-------------|
| Store Name | Display name |
| Color Class | Tailwind color class |
| Navigation Link | No Link / Navbar / Footer / Both |
| Dropdown Section | Categories or Popular section |

### 6. Pages Management

See [Pages Documentation](./10-pages.md) for full details.

- Create custom pages with sections
- Edit page content with section editor
- Preview and delete pages

### 7. Footer Links Management

Manage footer links organized by section.

| Section | Description |
|---------|-------------|
| **Main Links** | Primary footer links |
| **My RMN** | Account/user related links |
| **Bottom Links** | Legal/policy links at very bottom |

Each link has: Label, URL, Section, Order, Active status.

Operations: Add, Edit (inline), Delete.

### 8. Global FAQ Section

Manage FAQs that appear on all store pages (`/view/{domain}`).

| Field | Description |
|-------|-------------|
| Section Heading | e.g., "Frequently Asked Questions" |
| FAQ Items | Array of { question, answer } pairs |

Add/remove FAQs dynamically. Click **"Save FAQs"** to apply.

---

## How Changes Propagate

When you save any CMS change, the system:
1. Updates the database via admin API
2. Sets `localStorage('cms-updated')` with timestamp
3. Dispatches a `StorageEvent`
4. The public site listens for this event and re-fetches data (navbar, footer, homepage)

This means changes appear on the public site **within seconds** without page reload.

---

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/site/config` | Get site config |
| PUT | `/api/admin/pages/site-config/update` | Update site config |
| GET | `/api/public/navbar/navigation` | Get navigation |
| PUT | `/api/admin/navbar/navigation/update` | Update navigation |
| GET/PUT | `/api/admin/pages/:pageName/update` | Update page |
| CRUD | `/api/admin/categories/*` | Category management |
| CRUD | `/api/admin/popular-stores/*` | Popular stores management |
| CRUD | `/api/admin/footer/links/*` | Footer links management |

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/cms/page.tsx` | Main CMS admin page |
| `client/components/admin/SiteConfigAdmin.tsx` | Site config editor component |
| `server/src/models/SiteConfig.js` | SiteConfig mongoose model |
| `server/src/models/Navigation.js` | Navigation model |
| `server/src/models/FooterLink.js` | FooterLink model |
| `server/src/models/Category.js` | Category model |
| `server/src/models/PopularStore.js` | PopularStore model |
| `server/src/models/Page.js` | Page model |

---

## Database Schema (SiteConfig)

```
siteName          String
siteDescription   String
contactEmail      String
themeName         String
seo               { metaTitle, metaDescription, metaKeywords[], favicon, ogTitle, ogDescription, ogImage, twitterCard, twitterSite }
theme             { primaryColor, secondaryColor, backgroundColor, textColor, accentColor, successColor, errorColor, warningColor }
fonts             { heading, body, mono }
logos             { navbar, footer, favicon, ogImage }
socialMedia       { facebook, twitter, instagram, linkedin, youtube, tiktok — each: { label, url, icon, enabled } }
navbar            { layout, style, bgColor, textColor, showSearch, showThemeToggle, sticky, ctaText, ctaLink, bannerText, bannerHighlight, showBanner }
footer            { copyright, email, phone, address, showSocialMedia, showNewsletter }
footerConfig      { layout, style, bgColor, textColor, showAppDownload, showContactInfo }
footerContent     { tagline, columns[{ heading, links[{ label, href }] }] }
faqs              { heading, items[{ question, answer }] }
```
