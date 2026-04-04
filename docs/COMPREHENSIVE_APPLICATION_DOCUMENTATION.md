# CouponsFeast - Comprehensive Application Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [API Documentation](#api-documentation)
4. [Database Models](#database-models)
5. [Admin Panel Capabilities](#admin-panel-capabilities)
6. [Theme System](#theme-system)
7. [Frontend Components](#frontend-components)
8. [Document Flow & Integration](#document-flow--integration)
9. [Navbar & Navigation](#navbar--navigation)
10. [Footer Configuration](#footer-configuration)
11. [Deployment & Setup](#deployment--setup)

---

## Application Overview

**CouponsFeast** is a full-stack coupon management platform that allows users to browse, search, and use discount coupons from various stores. The application features a comprehensive admin panel for managing stores, coupons, categories, and site configuration.

### Key Features
- ✅ **Store Management**: CRUD operations for stores with logos and descriptions
- ✅ **Coupon Management**: Create, update, delete coupons with expiry dates and click tracking
- ✅ **Category System**: Organize coupons by categories with navigation integration
- ✅ **Popular Stores**: Featured stores in navigation dropdown
- ✅ **CMS System**: Complete site configuration including themes, colors, and branding
- ✅ **Analytics**: Google Analytics 4 integration with detailed event tracking
- ✅ **Responsive Design**: Mobile-first design with Material-UI and Tailwind CSS
- ✅ **Real-time Updates**: Live updates across admin panel and frontend
- ✅ **File Upload**: Logo and image management system
- ✅ **Footer Management**: Dynamic footer links and social media configuration

---

## Architecture & Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **File Upload**: Multer for image handling
- **Analytics**: Google Analytics 4 integration
- **CORS**: Cross-origin resource sharing enabled

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React, Material Icons

### Development Tools
- **Testing**: Cypress (E2E testing)
- **API Testing**: Built-in HTML tester, Postman collection
- **Linting**: ESLint
- **Build**: Next.js build system

---

## API Documentation

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: Configure via `NEXT_PUBLIC_API_URL`

### Store APIs (5 endpoints)

#### 1. Get All Stores
```http
GET /api/stores
```
**Response**: Array of store objects
```json
[
  {
    "_id": "store_id",
    "storeName": "Amazon",
    "slug": "amazon",
    "logo": "/uploads/amazon-logo.png",
    "websiteUrl": "https://amazon.com",
    "description": "Online marketplace",
    "category": "E-commerce",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 2. Get Store by Slug
```http
GET /api/stores/:slug
```
**Parameters**: `slug` (string) - URL-friendly store identifier
**Response**: Single store object

#### 3. Create Store
```http
POST /api/stores
```
**Body**:
```json
{
  "storeName": "Target",
  "slug": "target",
  "logo": "/uploads/target-logo.png",
  "websiteUrl": "https://target.com",
  "description": "Retail chain store"
}
```

#### 4. Update Store
```http
PUT /api/stores/:id
```
**Parameters**: `id` (string) - Store MongoDB ObjectId
**Body**: Same as create store

#### 5. Delete Store
```http
DELETE /api/stores/:id
```
**Parameters**: `id` (string) - Store MongoDB ObjectId

### Coupon APIs (9 endpoints)

#### 1. Get All Coupons
```http
GET /api/coupons?sort=clickCount&store=store_id&category=electronics&limit=20
```
**Query Parameters**:
- `sort`: "clickCount" | "createdAt" (default)
- `store`: Store ObjectId filter
- `category`: Category filter
- `tag`: Tag filter (regex search)
- `limit`: Number of results (default: 20)

#### 2. Get Coupon by ID
```http
GET /api/coupons/:id
```

#### 3. Create Coupon
```http
POST /api/coupons
```
**Body**:
```json
{
  "title": "Summer Sale",
  "code": "SUMMER20",
  "description": "20% off on all items",
  "discount": "20% OFF",
  "store": "store_object_id",
  "category": "Fashion",
  "tags": ["summer", "sale"],
  "expiryDate": "2024-12-31T23:59:59.000Z",
  "isFeatured": false
}
```

#### 4. Update Coupon
```http
PUT /api/coupons/:id
```

#### 5. Delete Coupon
```http
DELETE /api/coupons/:id
```

#### 6. Track Coupon Click
```http
POST /api/coupons/:id/click
```
**Purpose**: Increments click count and logs user interaction

#### 7. Search Coupons
```http
GET /api/coupons/search?query=summer
```

#### 8. Get Trending Coupons
```http
GET /api/coupons/trending
```
**Response**: Coupons sorted by click count

#### 9. Reveal Coupon Code
```http
POST /api/coupons/reveal/:id
```
**Purpose**: Analytics tracking for code reveals

### CMS APIs (8 endpoints)

#### 1. Get Site Configuration
```http
GET /api/site-config
```
**Response**: Complete site configuration including theme, logos, social media

#### 2. Update Site Configuration
```http
PUT /api/site-config
```
**Body**:
```json
{
  "siteName": "CouponsFeast",
  "theme": {
    "primaryColor": "#7c3aed",
    "secondaryColor": "#9333ea",
    "backgroundColor": "#ffffff",
    "textColor": "#111827"
  },
  "logos": {
    "navbar": "/uploads/navbar-logo.png",
    "footer": "/uploads/footer-logo.png"
  },
  "socialMedia": {
    "facebook": {
      "url": "https://facebook.com/couponsfeast",
      "enabled": true
    }
  }
}
```

#### 3. Get Navigation
```http
GET /api/navigation
```

#### 4. Update Navigation
```http
PUT /api/navigation
```

#### 5. Get Banners
```http
GET /api/banners
```

#### 6. Create Banner
```http
POST /api/banners
```

#### 7. Get Page Content
```http
GET /api/pages/:pageName
```

#### 8. Update Page Content
```http
PUT /api/pages/:pageName
```

### Category APIs (4 endpoints)

#### 1. Get Categories
```http
GET /api/categories
```

#### 2. Create Category
```http
POST /api/categories
```
**Body**:
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "color": "#007bff",
  "hasNavLink": true,
  "navLocation": "navbar",
  "dropdownSection": "categories"
}
```

#### 3. Update Category
```http
PUT /api/categories/:id
```

#### 4. Delete Category
```http
DELETE /api/categories/:id
```

### Popular Store APIs (4 endpoints)

#### 1. Get Popular Stores
```http
GET /api/popular-stores
```

#### 2. Create Popular Store
```http
POST /api/popular-stores
```

#### 3. Update Popular Store
```http
PUT /api/popular-stores/:id
```

#### 4. Delete Popular Store
```http
DELETE /api/popular-stores/:id
```

### File Upload APIs (3 endpoints)

#### 1. Upload Logo
```http
POST /api/upload/logo
```
**Content-Type**: `multipart/form-data`
**Body**: Form data with `logo` file field

#### 2. Delete Logo
```http
DELETE /api/upload/logo/:filename
```

#### 3. Test Upload Endpoint
```http
GET /api/upload/test
```

### Footer Links APIs (5 endpoints)

#### 1. Get Footer Links (Public)
```http
GET /api/footer-links
```

#### 2. Get All Footer Links (Admin)
```http
GET /api/footer-links/admin
```

#### 3. Create Footer Link
```http
POST /api/footer-links
```

#### 4. Update Footer Link
```http
PUT /api/footer-links/:id
```

#### 5. Delete Footer Link
```http
DELETE /api/footer-links/:id
```

### Featured Coupons APIs (4 endpoints)

#### 1. Get Featured Coupons
```http
GET /api/featured-coupons
```

#### 2. Create Featured Coupon
```http
POST /api/featured-coupons
```

#### 3. Update Featured Coupon
```http
PUT /api/featured-coupons/:id
```

#### 4. Delete Featured Coupon
```http
DELETE /api/featured-coupons/:id
```

---

## Database Models

### Store Model
```javascript
{
  storeName: String (required),
  slug: String (unique, required),
  logo: String,
  websiteUrl: String,
  description: String,
  category: String,
  timestamps: true
}
```

### Coupon Model
```javascript
{
  title: String (required),
  code: String (required, unique),
  description: String,
  discount: String,
  store: ObjectId (ref: Store, required),
  category: String (required),
  tags: [String],
  expiryDate: Date,
  clickCount: Number (default: 0),
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  timestamps: true
}
```

### SiteConfig Model
```javascript
{
  siteName: String,
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    favicon: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String
  },
  theme: {
    primaryColor: String,
    secondaryColor: String,
    backgroundColor: String,
    textColor: String,
    accentColor: String
  },
  logos: {
    navbar: String,
    footer: String,
    favicon: String,
    ogImage: String
  },
  socialMedia: {
    facebook: { label, url, icon, enabled },
    twitter: { label, url, icon, enabled },
    instagram: { label, url, icon, enabled }
  },
  footer: {
    copyright: String,
    email: String,
    phone: String,
    address: String,
    showSocialMedia: Boolean,
    showNewsletter: Boolean
  }
}
```

### Category Model
```javascript
{
  name: String (required),
  slug: String (unique, required),
  color: String,
  icon: String,
  description: String,
  hasNavLink: Boolean,
  navLocation: String (enum: navbar, footer, both, no),
  dropdownSection: String (enum: categories, popular)
}
```

### PopularStore Model
```javascript
{
  name: String (required),
  slug: String (unique, required),
  logo: String (required),
  color: String,
  description: String,
  website: String,
  hasNavLink: Boolean,
  navLocation: String,
  dropdownSection: String
}
```

---

## Admin Panel Capabilities

### Access Points
- **Dashboard**: `http://localhost:3000/admin/dashboard`
- **Store Management**: `http://localhost:3000/admin/stores`
- **Coupon Management**: `http://localhost:3000/admin/coupons`
- **CMS Management**: `http://localhost:3000/admin/cms`

### Store Management Features
- ✅ **Create Stores**: Add new stores with name, slug, logo, website URL, description
- ✅ **Edit Stores**: Update all store information
- ✅ **Delete Stores**: Remove stores with confirmation modal
- ✅ **Auto-slug Generation**: Automatic URL-friendly slug creation
- ✅ **Logo Management**: Upload and manage store logos
- ✅ **Validation**: Form validation with error handling
- ✅ **Toast Notifications**: Success/error feedback
- ✅ **Search & Filter**: Find stores quickly
- ✅ **Responsive Design**: Works on all devices

### Coupon Management Features
- ✅ **Create Coupons**: Add coupons with title, code, discount, store assignment
- ✅ **Edit Coupons**: Update coupon details including expiry dates
- ✅ **Delete Coupons**: Remove coupons with detailed confirmation
- ✅ **Store Assignment**: Link coupons to specific stores
- ✅ **Category Management**: Organize coupons by categories
- ✅ **Expiry Date Tracking**: Set and display expiration dates
- ✅ **Click Tracking**: Monitor coupon usage statistics
- ✅ **Featured Coupons**: Mark coupons as featured
- ✅ **Bulk Operations**: Manage multiple coupons efficiently

### CMS Management Features
- ✅ **Site Configuration**: Complete branding and theme management
- ✅ **Navigation Menu**: Dynamic navbar configuration
- ✅ **Homepage Sections**: Manage homepage layout and content
- ✅ **Category Management**: Create categories with navigation links
- ✅ **Popular Stores**: Manage featured stores in dropdown
- ✅ **Footer Links**: Dynamic footer link management
- ✅ **Theme Customization**: Colors, fonts, and styling
- ✅ **Logo Management**: Upload navbar and footer logos
- ✅ **Social Media**: Configure social media links
- ✅ **SEO Settings**: Meta tags and search optimization

### Real-time Features
- ✅ **Live Updates**: Changes reflect immediately across the application
- ✅ **Storage Events**: Cross-tab communication for instant updates
- ✅ **Auto-refresh**: Periodic data synchronization
- ✅ **Toast Notifications**: Immediate feedback for all operations

---

## Theme System

### Dynamic Theming
The application features a comprehensive theme system that allows complete customization through the admin panel.

#### Theme Configuration
```javascript
theme: {
  primaryColor: "#7c3aed",      // Main brand color
  secondaryColor: "#9333ea",    // Secondary brand color
  backgroundColor: "#ffffff",   // Background color
  textColor: "#111827",         // Text color
  accentColor: "#f59e0b",       // Accent/highlight color
  successColor: "#10b981",      // Success state color
  errorColor: "#ef4444",        // Error state color
  warningColor: "#f59e0b"       // Warning state color
}
```

#### Font Configuration
```javascript
fonts: {
  heading: "Inter",             // Heading font family
  body: "Roboto",              // Body text font family
  mono: "Fira Code"            // Monospace font family
}
```

#### Logo Management
- **Navbar Logo**: Displayed in the navigation bar
- **Footer Logo**: Displayed in the footer
- **Favicon**: Browser tab icon
- **OG Image**: Social media sharing image

#### Theme Application
- **Navbar**: Dynamic background and text colors
- **Footer**: Consistent with primary theme colors
- **Buttons**: Gradient backgrounds using theme colors
- **Cards**: Elevation and color coordination
- **Forms**: Input styling with theme integration

---

## Frontend Components

### Layout Components

#### Navbar (`/components/layout/Navbar.tsx`)
- **Dynamic Theming**: Colors from site configuration
- **Logo Display**: Supports uploaded logos or text fallback
- **Navigation Menu**: Dynamic menu items from CMS
- **Stores Dropdown**: Categories and popular stores
- **Search Bar**: Integrated search functionality
- **Theme Toggle**: Dark/light mode switching
- **Mobile Responsive**: Collapsible mobile menu

#### Footer (`/components/layout/Footer.tsx`)
- **Dynamic Content**: Links from CMS configuration
- **Social Media**: Configurable social media icons
- **Contact Information**: Email, phone, address from config
- **App Download**: App store links
- **Copyright**: Customizable copyright text
- **Multi-column Layout**: Organized link sections

#### StoresDropdown (`/components/layout/StoresDropdown.tsx`)
- **Categories Section**: Dynamic category links
- **Popular Stores**: Featured store links
- **Color Coding**: Custom colors for each item
- **Real-time Updates**: Refreshes when admin makes changes
- **Hover Effects**: Smooth animations and transitions

### Admin Components

#### AdminNav (`/components/admin/AdminNav.tsx`)
- **Gradient Header**: Modern design with user info
- **Icon Navigation**: Material-UI icons for each section
- **Active States**: Visual feedback for current page
- **Responsive**: Works on all screen sizes

#### SiteConfigAdmin (`/components/admin/SiteConfigAdmin.tsx`)
- **Theme Editor**: Color picker for all theme colors
- **Logo Upload**: File upload for all logo types
- **Social Media**: Configure all social platforms
- **SEO Settings**: Meta tags and search optimization
- **Real-time Preview**: See changes immediately

### Coupon Components

#### CouponCard (`/components/coupon/CouponCard.tsx`)
- **Store Integration**: Display store logos and names
- **Click Tracking**: Analytics integration
- **Expiry Display**: Visual expiration indicators
- **Responsive Design**: Mobile-optimized layout

#### CouponGrid (`/components/coupon/CouponGrid.tsx`)
- **Masonry Layout**: Pinterest-style grid
- **Infinite Scroll**: Load more coupons automatically
- **Filter Integration**: Category and store filtering

### Store Components

#### StoreCard (`/components/store/StoreCard.tsx`)
- **Logo Display**: Store branding
- **Coupon Count**: Number of available coupons
- **Link Integration**: Direct store page navigation

#### StoreGrid (`/components/store/StoreGrid.tsx`)
- **Grid Layout**: Responsive store grid
- **Search Integration**: Filter stores by name
- **Alphabetical Sorting**: Organized store listing

---

## Document Flow & Integration

### Data Flow Architecture

#### 1. Frontend → API → Database
```
User Action → React Component → API Service → Express Route → Controller → MongoDB
```

#### 2. Real-time Updates
```
Admin Change → localStorage Event → Component Re-render → API Refresh → UI Update
```

#### 3. Theme Integration
```
CMS Update → Site Config API → Theme Provider → Component Styling → Visual Update
```

### API Integration Pattern

#### Service Layer (`/services/api.ts`)
```typescript
// Centralized API calls
export const getStores = () => api.get('/stores');
export const createStore = (data: any) => api.post('/stores', data);
export const updateStore = (id: string, data: any) => api.put(`/stores/${id}`, data);
```

#### Component Integration
```typescript
// React component usage
const [stores, setStores] = useState([]);

useEffect(() => {
  const fetchStores = async () => {
    try {
      const response = await getStores();
      setStores(response.data);
    } catch (error) {
      toast.error('Failed to load stores');
    }
  };
  fetchStores();
}, []);
```

### State Management

#### Redux Store Structure
```typescript
store: {
  coupons: {
    items: Coupon[],
    loading: boolean,
    error: string | null
  },
  stores: {
    items: Store[],
    loading: boolean,
    error: string | null
  }
}
```

#### Local State Management
- **Component State**: React useState for local data
- **Form State**: Controlled components with validation
- **Modal State**: Dialog and popup management
- **Loading State**: API call status tracking

---

## Navbar & Navigation

### Navigation Structure

#### Main Navigation Menu
```javascript
menu: [
  { name: "Home", url: "/" },
  { name: "All Stores", url: "/stores", hasDropdown: true },
  { name: "Categories", url: "/categories" },
  { name: "Trending", url: "/trending" }
]
```

#### Stores Dropdown Content
- **Categories Section**: Dynamic categories from database
- **Popular Stores Section**: Featured stores from database
- **View All Links**: Links to complete listings

### Dynamic Navigation Features

#### 1. CMS Integration
- **Admin Control**: Complete navigation management from admin panel
- **Real-time Updates**: Changes reflect immediately
- **Theme Integration**: Colors and styling from site config

#### 2. Dropdown Management
- **Hover Activation**: Mouse hover to open dropdown
- **Click Support**: Mobile-friendly click activation
- **Auto-close**: Closes when clicking outside

#### 3. Active State Management
- **Current Page**: Visual indication of current page
- **Breadcrumb Support**: Navigation path tracking
- **Mobile Optimization**: Collapsible mobile menu

### Navigation API Integration

#### Fetch Navigation Data
```typescript
const fetchNavData = async () => {
  const [navResponse, configResponse] = await Promise.all([
    getNavigation(),
    getSiteConfig()
  ]);
  
  setNavigation(navResponse.data);
  setSiteConfig(configResponse.data);
};
```

#### Update Navigation
```typescript
const updateNavigation = async (newNavData) => {
  await updateNavigation(newNavData);
  
  // Trigger real-time updates
  localStorage.setItem('cms-updated', Date.now().toString());
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'cms-updated',
    newValue: Date.now().toString()
  }));
};
```

---

## Footer Configuration

### Footer Structure

#### Link Sections
1. **Main Links**: Primary navigation and features
2. **My RMN**: User account and community links
3. **Bottom Links**: Legal and policy links

#### Contact Information
- **Email**: Configurable contact email
- **Phone**: Business phone number
- **Address**: Physical address

#### Social Media Integration
- **Platforms**: Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok
- **Enable/Disable**: Individual platform control
- **Custom URLs**: Configurable social media links

### Footer Management

#### Admin Configuration
```javascript
footer: {
  copyright: "© CouponsFeast 2026",
  email: "support@couponsfeast.com",
  phone: "+1 (555) 123-4567",
  address: "123 Coupon Street, Deal City, DC 12345",
  showSocialMedia: true,
  showNewsletter: true
}
```

#### Dynamic Footer Links
```javascript
footerLinks: {
  main: [
    { label: "CASH BACK", href: "/cashback" },
    { label: "BROWSE STORES", href: "/stores" },
    { label: "BROWSE CATEGORIES", href: "/categories" }
  ],
  myRmn: [
    { label: "My Account + Rewards", href: "/account" },
    { label: "RMN Community", href: "/community" }
  ],
  bottom: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" }
  ]
}
```

### Footer API Management

#### Get Footer Configuration
```http
GET /api/footer-links
```

#### Create Footer Link
```http
POST /api/footer-links
{
  "label": "Privacy Policy",
  "href": "/privacy",
  "section": "bottom",
  "order": 1
}
```

#### Update Footer Link
```http
PUT /api/footer-links/:id
```

#### Delete Footer Link
```http
DELETE /api/footer-links/:id
```

---

## Deployment & Setup

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/couponsfeast
PORT=5000
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_api_secret
NODE_ENV=production
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Installation Steps

#### 1. Backend Setup
```bash
cd server
npm install
npm run dev
```

#### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

#### 3. Database Setup
- Create MongoDB Atlas cluster
- Configure connection string
- Database will auto-create collections

### Production Deployment

#### Backend Deployment
- Deploy to Heroku, Vercel, or AWS
- Configure environment variables
- Set up MongoDB Atlas connection
- Configure CORS for production domain

#### Frontend Deployment
- Deploy to Vercel or Netlify
- Configure API URL environment variable
- Set up custom domain
- Configure analytics tracking

### Testing

#### API Testing
- **HTML Tester**: `server/api-tester.html`
- **Postman Collection**: `CouponsFeast.postman_collection.json`
- **HTTP Tests**: `server/api-tests.http`

#### E2E Testing
```bash
# Run Cypress tests
npm run cypress:open
npm run cypress:run
```

#### Manual Testing
- **Admin Panel**: Test all CRUD operations
- **Frontend**: Test user interactions
- **Mobile**: Test responsive design
- **Cross-browser**: Test compatibility

---

## Conclusion

CouponsFeast is a comprehensive coupon management platform with extensive admin capabilities, dynamic theming, and real-time updates. The application provides a complete solution for managing stores, coupons, categories, and site configuration through an intuitive admin interface.

### Key Strengths
- **Complete CRUD Operations**: Full management capabilities for all entities
- **Real-time Updates**: Immediate reflection of changes across the application
- **Dynamic Theming**: Complete customization of appearance and branding
- **Responsive Design**: Optimized for all devices and screen sizes
- **Analytics Integration**: Comprehensive tracking and reporting
- **Modern Tech Stack**: Built with latest technologies and best practices

### Future Enhancements
- User authentication and accounts
- Advanced analytics dashboard
- Email notifications
- Multi-language support
- Advanced search and filtering
- Mobile app development

---

*This documentation covers all aspects of the CouponsFeast application as of January 2025. For the most up-to-date information, refer to the codebase and API endpoints.*