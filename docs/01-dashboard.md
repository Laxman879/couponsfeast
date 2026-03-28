# Dashboard — Admin Documentation

**URL:** `http://localhost:3000/admin/dashboard`

---

## Overview

The Dashboard is the landing page of the admin panel. It provides a quick overview of platform statistics, management shortcuts, recent activity, and system health.

---

## Sections

### 1. KPI Cards (Top Row)

| Card | Description |
|------|-------------|
| **Total Stores** | Shows total number of stores with monthly growth |
| **Active Coupons** | Shows total active coupons with weekly growth |
| **Categories** | Shows total categories count |
| **Monthly Clicks** | Shows total coupon clicks this month |

Each card displays a progress bar indicating growth percentage.

### 2. Management Cards (Quick Access)

| Card | Links To | Purpose |
|------|----------|---------|
| Manage Stores | `/admin/stores` | Add, edit, delete stores |
| Manage Coupons | `/admin/coupons` | Create and manage coupons |
| CMS & Site Config | `/admin/cms` | Navigation, categories, branding |

### 3. Recent Activity Feed

Shows the latest 5 actions performed in the admin panel (store added, coupon created, banner updated, etc.).

### 4. Quick Actions

| Action | Links To |
|--------|----------|
| Add New Coupon | `/admin/coupons` |
| Add New Store | `/admin/stores` |
| Site Settings | `/admin/cms` |

### 5. System Status

Displays real-time health of:
- API Server
- Database connection
- Frontend status

---

## Files Involved

| File | Purpose |
|------|---------|
| `client/app/admin/dashboard/page.tsx` | Dashboard UI page |
| `client/components/admin/AdminShell.tsx` | Layout wrapper with sidebar |
| `client/components/admin/AdminSidebar.tsx` | Sidebar navigation |

---

## Notes

- Dashboard auto-redirects from `/admin` → `/admin/dashboard`
- KPI values are currently static — connect to `/api/admin/dashboard/stats` for live data
- No create/edit/delete operations on this page — it's read-only overview
