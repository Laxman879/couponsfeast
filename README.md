# CouponsFeast - Full Stack Coupon Management Platform

## Tech Stack

### Backend
- Node.js + Express
- MongoDB Atlas
- Mongoose

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Material UI
- Tailwind CSS
- Redux Toolkit
- Axios

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend will run on http://localhost:5000

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on http://localhost:3000

## Project Structure

```
couponsfeast/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── Store.js
│   │   │   ├── Coupon.js
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   ├── couponController.js
│   │   │   └── storeController.js
│   │   └── routes/
│   │       └── index.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── client/
    ├── app/
    │   ├── store/[slug]/
    │   ├── admin/
    │   │   ├── dashboard/
    │   │   ├── stores/
    │   │   └── coupons/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── Container.tsx
    │   ├── coupon/
    │   │   ├── CouponCard.tsx
    │   │   └── CouponGrid.tsx
    │   └── store/
    │       ├── StoreCard.tsx
    │       └── StoreGrid.tsx
    ├── store/
    │   ├── index.ts
    │   ├── couponSlice.ts
    │   └── storeSlice.ts
    ├── services/
    │   └── api.ts
    └── package.json
```

## API Endpoints

### Coupons
- GET /api/coupons - Get all coupons
- GET /api/coupons/:id - Get coupon by ID
- POST /api/coupons - Create coupon
- PUT /api/coupons/:id - Update coupon
- DELETE /api/coupons/:id - Delete coupon
- POST /api/coupons/:id/click - Track click

### Stores
- GET /api/stores - Get all stores
- GET /api/stores/:slug - Get store by slug
- POST /api/stores - Create store
- PUT /api/stores/:id - Update store
- DELETE /api/stores/:id - Delete store

## Features

✅ Homepage with trending coupons
✅ Store detail pages
✅ Admin dashboard
✅ Store management (CRUD)
✅ Coupon management (CRUD)
✅ Click tracking
✅ Redux state management
✅ Material UI + Tailwind CSS
✅ Responsive design
✅ React.memo optimization

## Access Points

- Homepage: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin/dashboard
- Manage Stores: http://localhost:3000/admin/stores
- Manage Coupons: http://localhost:3000/admin/coupons

## 🧪 Testing Backend APIs (No Postman Required!)

### Quick Test Methods:

**Method 1: HTML Dashboard (Easiest)**
```bash
# Start server first
cd server
npm run dev

# Then open in browser:
server/api-tester.html
```

**Method 2: Browser URLs**
- API Status: http://localhost:5000/api/test
- All Stores: http://localhost:5000/api/stores
- All Coupons: http://localhost:5000/api/coupons
- Trending: http://localhost:5000/api/coupons/trending

**Method 3: Double-click**
```
test-apis.bat (Windows)
```

**Method 4: VS Code REST Client**
```
Open: server/api-tests.http
Click "Send Request" above each API
```

### All 16 APIs Implemented ✅

**Store APIs (5):** GET, POST, PUT, DELETE stores  
**Coupon APIs (7):** CRUD + filter by store/category  
**Analytics (2):** Reveal code, track clicks  
**Search (1):** Search coupons  
**Trending (1):** Most clicked coupons  

See `TESTING_GUIDE.md` for detailed instructions.
