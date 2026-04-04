# CouponsFeast - Complete API Development Checklist

## 📁 Backend Folder Structure

```
backend/
├── config/
│   └── db.js                      # MongoDB connection
├── models/
│   ├── store.model.js             # Store schema
│   ├── coupon.model.js            # Coupon schema
│   └── couponClick.model.js       # Click tracking schema
├── controllers/
│   ├── store.controller.js        # Store business logic
│   ├── coupon.controller.js       # Coupon business logic
│   └── analytics.controller.js    # Analytics & tracking logic
├── routes/
│   ├── store.routes.js            # Store endpoints
│   ├── coupon.routes.js           # Coupon endpoints
│   └── analytics.routes.js        # Analytics endpoints
├── services/
│   ├── store.service.js           # Store data operations
│   ├── coupon.service.js          # Coupon data operations
│   └── click.service.js           # Click tracking operations
├── middleware/
│   └── errorHandler.js            # Error handling middleware
├── utils/
│   └── generateSlug.js            # Slug generation utility
├── app.js                         # Express app configuration
├── server.js                      # Server entry point
├── .env                           # Environment variables
└── package.json                   # Dependencies
```

---

## 🗄️ Database Schemas (3 Schemas)

### 1. Store Schema

**Fields:**
- `storeName` - String, required
- `slug` - String, unique
- `logo` - String (URL)
- `websiteUrl` - String
- `description` - String
- `category` - String
- `timestamps` - Auto-generated (createdAt, updatedAt)

**Implementation:**

```javascript
import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeName: { 
      type: String, 
      required: true 
    },
    slug: { 
      type: String, 
      unique: true 
    },
    logo: String,
    websiteUrl: String,
    description: String,
    category: String
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
```

---

### 2. Coupon Schema

**Fields:**
- `title` - String
- `code` - String (coupon code)
- `description` - String
- `storeId` - ObjectId (ref: Store)
- `discountType` - String (percentage/fixed)
- `discountValue` - Number
- `expiryDate` - Date
- `clickCount` - Number (default: 0)
- `category` - String
- `tags` - Array of Strings
- `timestamps` - Auto-generated

**Implementation:**

```javascript
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    title: String,
    code: String,
    description: String,
    storeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Store" 
    },
    discountType: String,
    discountValue: Number,
    expiryDate: Date,
    clickCount: { 
      type: Number, 
      default: 0 
    },
    category: String,
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
```

---

### 3. CouponClick Schema

**Purpose:** Track coupon reveal/click analytics

**Fields:**
- `couponId` - ObjectId (ref: Coupon)
- `storeId` - ObjectId (ref: Store)
- `clickedAt` - Date (default: now)
- `ipAddress` - String

**Implementation:**

```javascript
import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  couponId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Coupon" 
  },
  storeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Store" 
  },
  clickedAt: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: String
});

export default mongoose.model("CouponClick", clickSchema);
```

---

## 📊 API Summary

| Feature | Count |
|---------|-------|
| Store APIs | 5 |
| Coupon APIs | 8 |
| Click/Reveal APIs | 2 |
| Search APIs | 1 |
| Trending API | 1 |
| **TOTAL** | **17 APIs** |

---

## 🏪 Store APIs (5 APIs)

### 1. GET /api/stores
**Purpose:** Get all stores

**Checklist:**
- [ ] Create route in `store.routes.js`
- [ ] Create `getStores` controller function
- [ ] Query database: `Store.find()`
- [ ] Return list of stores with status 200
- [ ] Handle errors

**Implementation:**
```javascript
// Controller
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/stores', getStores);
```

---

### 2. GET /api/stores/:slug
**Purpose:** Get store details by slug

**Checklist:**
- [ ] Create route with slug parameter
- [ ] Read `slug` from `req.params`
- [ ] Query: `Store.findOne({ slug })`
- [ ] Return store details
- [ ] Handle "not found" case

**Implementation:**
```javascript
// Controller
export const getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const store = await Store.findOne({ slug });
    
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/stores/:slug', getStoreBySlug);
```

---

### 3. POST /api/stores
**Purpose:** Create new store

**Checklist:**
- [ ] Validate request body
- [ ] Generate slug from storeName
- [ ] Create store: `Store.create()`
- [ ] Return created store with status 201
- [ ] Handle validation errors

**Implementation:**
```javascript
// Controller
export const createStore = async (req, res) => {
  try {
    const { storeName, logo, websiteUrl, description, category } = req.body;
    
    // Generate slug
    const slug = storeName.toLowerCase().replace(/\s+/g, '-');
    
    const store = await Store.create({
      storeName,
      slug,
      logo,
      websiteUrl,
      description,
      category
    });
    
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.post('/stores', createStore);
```

---

### 4. PUT /api/stores/:id
**Purpose:** Update existing store

**Checklist:**
- [ ] Get `id` from params
- [ ] Validate request body
- [ ] Update: `Store.findByIdAndUpdate()`
- [ ] Return updated store
- [ ] Handle "not found" case

**Implementation:**
```javascript
// Controller
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const store = await Store.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.put('/stores/:id', updateStore);
```

---

### 5. DELETE /api/stores/:id
**Purpose:** Delete store

**Checklist:**
- [ ] Get `id` from params
- [ ] Delete: `Store.findByIdAndDelete()`
- [ ] Return success message
- [ ] Handle "not found" case
- [ ] Consider deleting associated coupons

**Implementation:**
```javascript
// Controller
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    
    const store = await Store.findByIdAndDelete(id);
    
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.delete('/stores/:id', deleteStore);
```

---

## 🎟️ Coupon APIs (8 APIs)

### 1. GET /api/coupons
**Purpose:** Get all coupons

**Checklist:**
- [ ] Create route `/coupons`
- [ ] Create `getCoupons` controller
- [ ] Query: `Coupon.find()`
- [ ] Populate store data: `.populate('storeId')`
- [ ] Return coupons list
- [ ] Add pagination (optional)

**Implementation:**
```javascript
// Controller
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('storeId', 'storeName logo slug');
    
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/coupons', getCoupons);
```

---

### 2. GET /api/coupons/:id
**Purpose:** Get coupon by ID

**Checklist:**
- [ ] Get `id` from params
- [ ] Query: `Coupon.findById(id)`
- [ ] Populate store details
- [ ] Return coupon
- [ ] Handle "not found"

**Implementation:**
```javascript
// Controller
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id)
      .populate('storeId');
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/coupons/:id', getCouponById);
```

---

### 3. GET /api/coupons/store/:storeId
**Purpose:** Get all coupons for a specific store

**Checklist:**
- [ ] Get `storeId` from params
- [ ] Query: `Coupon.find({ storeId })`
- [ ] Populate store data
- [ ] Return filtered coupons
- [ ] Handle empty results

**Implementation:**
```javascript
// Controller
export const getCouponsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const coupons = await Coupon.find({ storeId })
      .populate('storeId', 'storeName logo');
    
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/coupons/store/:storeId', getCouponsByStore);
```

---

### 4. GET /api/coupons/category/:category
**Purpose:** Get coupons by category

**Checklist:**
- [ ] Get `category` from params
- [ ] Query: `Coupon.find({ category })`
- [ ] Populate store data
- [ ] Return filtered coupons
- [ ] Handle case sensitivity

**Implementation:**
```javascript
// Controller
export const getCouponsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const coupons = await Coupon.find({ 
      category: { $regex: category, $options: 'i' } 
    }).populate('storeId');
    
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/coupons/category/:category', getCouponsByCategory);
```

---

### 5. GET /api/coupons/tag/:tag
**Purpose:** Get coupons by tag

**Checklist:**
- [ ] Get `tag` from params
- [ ] Query: `Coupon.find({ tags: tag })`
- [ ] Populate store data
- [ ] Return filtered coupons
- [ ] Handle case sensitivity

**Implementation:**
```javascript
// Controller
export const getCouponsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    
    const coupons = await Coupon.find({ 
      tags: { $regex: tag, $options: 'i' } 
    }).populate('storeId', 'storeName logo slug');
    
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/coupons/tag/:tag', getCouponsByTag);
```

---

### 6. POST /api/coupons
**Purpose:** Create new coupon

**Checklist:**
- [ ] Validate request body
- [ ] Check if store exists
- [ ] Create coupon: `Coupon.create()`
- [ ] Return created coupon with status 201
- [ ] Handle validation errors

**Implementation:**
```javascript
// Controller
export const createCoupon = async (req, res) => {
  try {
    const couponData = req.body;
    
    // Verify store exists
    const store = await Store.findById(couponData.storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    const coupon = await Coupon.create(couponData);
    
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.post('/coupons', createCoupon);
```

---

### 7. PUT /api/coupons/:id
**Purpose:** Update existing coupon

**Checklist:**
- [ ] Get `id` from params
- [ ] Validate request body
- [ ] Update: `Coupon.findByIdAndUpdate()`
- [ ] Return updated coupon
- [ ] Handle "not found"

**Implementation:**
```javascript
// Controller
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('storeId');
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.put('/coupons/:id', updateCoupon);
```

---

### 8. DELETE /api/coupons/:id
**Purpose:** Delete coupon

**Checklist:**
- [ ] Get `id` from params
- [ ] Delete: `Coupon.findByIdAndDelete()`
- [ ] Return success message
- [ ] Handle "not found"
- [ ] Consider deleting click records

**Implementation:**
```javascript
// Controller
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.delete('/coupons/:id', deleteCoupon);
```

---

## 📊 Click/Reveal APIs (2 APIs)

### 1. POST /api/coupons/reveal/:couponId
**Purpose:** Reveal coupon code and track click

**Checklist:**
- [ ] Get `couponId` from params
- [ ] Find coupon by ID
- [ ] Increment `clickCount`
- [ ] Save coupon
- [ ] Create click record in CouponClick
- [ ] Return coupon code
- [ ] Handle "not found"

**Implementation:**
```javascript
// Controller
export const revealCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    
    // Find and update coupon
    const coupon = await Coupon.findById(couponId);
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    // Increment click count
    coupon.clickCount += 1;
    await coupon.save();
    
    // Track click
    await CouponClick.create({
      couponId: coupon._id,
      storeId: coupon.storeId,
      ipAddress: req.ip
    });
    
    res.status(200).json({ 
      code: coupon.code,
      clickCount: coupon.clickCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.post('/coupons/reveal/:couponId', revealCoupon);
```

---

### 2. POST /api/coupons/click
**Purpose:** Store coupon click analytics

**Checklist:**
- [ ] Get `couponId` from body
- [ ] Get `storeId` from body
- [ ] Capture IP address: `req.ip`
- [ ] Create click record: `CouponClick.create()`
- [ ] Return success response
- [ ] Handle errors

**Implementation:**
```javascript
// Controller
export const trackClick = async (req, res) => {
  try {
    const { couponId, storeId } = req.body;
    
    const clickRecord = await CouponClick.create({
      couponId,
      storeId,
      ipAddress: req.ip,
      clickedAt: new Date()
    });
    
    res.status(201).json({ 
      message: "Click tracked successfully",
      data: clickRecord 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.post('/coupons/click', trackClick);
```

---

## 🔍 Search API (1 API)

### GET /api/search?query=keyword
**Purpose:** Search coupons and stores by keyword

**Checklist:**
- [ ] Read query param: `req.query.query`
- [ ] Search in coupon titles: `$regex`
- [ ] Search in store names: `$regex`
- [ ] Use case-insensitive search: `$options: 'i'`
- [ ] Return combined results
- [ ] Handle empty query

**Implementation:**
```javascript
// Controller
export const searchCoupons = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }
    
    const searchRegex = { $regex: query, $options: 'i' };
    
    // Search coupons
    const coupons = await Coupon.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    }).populate('storeId');
    
    // Search stores
    const stores = await Store.find({
      $or: [
        { storeName: searchRegex },
        { description: searchRegex }
      ]
    });
    
    res.status(200).json({ coupons, stores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/search', searchCoupons);
```

---

## 🔥 Trending API (1 API)

### GET /api/coupons/trending
**Purpose:** Get most clicked/popular coupons

**Checklist:**
- [ ] Query all coupons
- [ ] Sort by `clickCount` descending
- [ ] Limit results (e.g., top 10)
- [ ] Populate store data
- [ ] Return trending coupons
- [ ] Add time filter (optional)

**Implementation:**
```javascript
// Controller
export const getTrendingCoupons = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const trendingCoupons = await Coupon.find()
      .sort({ clickCount: -1 })
      .limit(limit)
      .populate('storeId', 'storeName logo slug');
    
    res.status(200).json(trendingCoupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route
router.get('/coupons/trending', getTrendingCoupons);
```

---

## 🚀 Backend Development Order

Follow this step-by-step order for systematic development:

### Step 1: Project Setup
- [ ] Initialize Node.js project: `npm init -y`
- [ ] Install dependencies:
  ```bash
  npm install express mongoose dotenv cors
  npm install --save-dev nodemon
  ```
- [ ] Create folder structure
- [ ] Setup `.env` file with MongoDB URI
- [ ] Create `.gitignore`

---

### Step 2: Database Connection
- [ ] Create `config/db.js`
- [ ] Write MongoDB connection function
- [ ] Test connection in `server.js`
- [ ] Handle connection errors

**db.js Example:**
```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

---

### Step 3: Create Schemas
- [ ] Create `models/store.model.js`
- [ ] Create `models/coupon.model.js`
- [ ] Create `models/couponClick.model.js`
- [ ] Test schema creation

---

### Step 4: Create Routes
- [ ] Create `routes/store.routes.js`
- [ ] Create `routes/coupon.routes.js`
- [ ] Create `routes/analytics.routes.js`
- [ ] Setup route imports in `app.js`

---

### Step 5: Create Controllers
- [ ] Create `controllers/store.controller.js`
- [ ] Create `controllers/coupon.controller.js`
- [ ] Create `controllers/analytics.controller.js`

---

### Step 6: Implement APIs (In Order)

#### Phase 1: Store APIs (Day 1)
- [ ] GET /api/stores
- [ ] GET /api/stores/:slug
- [ ] POST /api/stores
- [ ] PUT /api/stores/:id
- [ ] DELETE /api/stores/:id

#### Phase 2: Coupon APIs (Day 2-3)
- [ ] GET /api/coupons
- [ ] GET /api/coupons/:id
- [ ] GET /api/coupons/store/:storeId
- [ ] GET /api/coupons/category/:category
- [ ] GET /api/coupons/tag/:tag
- [ ] POST /api/coupons
- [ ] PUT /api/coupons/:id
- [ ] DELETE /api/coupons/:id

#### Phase 3: Analytics APIs (Day 4)
- [ ] POST /api/coupons/reveal/:couponId
- [ ] POST /api/coupons/click

#### Phase 4: Search & Trending (Day 5)
- [ ] GET /api/search
- [ ] GET /api/coupons/trending

---

### Step 7: Testing
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Verify data validation
- [ ] Test error handling
- [ ] Check database records

---

### Step 8: Middleware & Utils
- [ ] Create error handler middleware
- [ ] Create slug generator utility
- [ ] Add request logging (optional)
- [ ] Add CORS configuration

---

## 📝 Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/couponsfeast
NODE_ENV=development
```

---

## 🧪 Testing Checklist

### Quick Test (Without Postman)

**Method 1: Browser Test Dashboard**
1. Start your server: `cd server && npm run dev`
2. Open `server/api-tester.html` in your browser
3. Click "🚀 Test All APIs" button
4. Test individual APIs by clicking their "Test API" buttons

**Method 2: API Status Endpoint**
1. Start server: `npm run dev`
2. Visit: `http://localhost:5000/api/test`
3. See all 16 APIs status and configuration

**Method 3: Browser Console**
```javascript
// Test in browser console (F12)
fetch('http://localhost:5000/api/stores').then(r => r.json()).then(console.log)
fetch('http://localhost:5000/api/coupons').then(r => r.json()).then(console.log)
fetch('http://localhost:5000/api/coupons/trending').then(r => r.json()).then(console.log)
fetch('http://localhost:5000/api/search?query=test').then(r => r.json()).then(console.log)
```

### Store APIs Testing
- [ ] Create store with valid data
- [ ] Get all stores
- [ ] Get store by slug
- [ ] Update store
- [ ] Delete store
- [ ] Test duplicate slug handling

### Coupon APIs Testing
- [ ] Create coupon with valid storeId
- [ ] Get all coupons
- [ ] Get coupon by ID
- [ ] Get coupons by store
- [ ] Get coupons by category
- [ ] Update coupon
- [ ] Delete coupon
- [ ] Test invalid storeId

### Analytics Testing
- [ ] Reveal coupon and verify click count
- [ ] Track click and verify record
- [ ] Check IP address capture

### Search & Trending Testing
- [ ] Search with valid query
- [ ] Search with empty query
- [ ] Get trending coupons
- [ ] Verify sorting by clickCount

---

## 📊 Final API Count Summary

| Category | APIs | Status |
|----------|------|--------|
| Store APIs | 5 | ⬜ |
| Coupon APIs | 8 | ⬜ |
| Click/Reveal APIs | 2 | ⬜ |
| Search APIs | 1 | ⬜ |
| Trending API | 1 | ⬜ |
| **TOTAL** | **17** | **⬜** |

---

## 🎯 Quick Reference: All Endpoints

```
Store APIs:
├── GET    /api/stores
├── GET    /api/stores/:slug
├── POST   /api/stores
├── PUT    /api/stores/:id
└── DELETE /api/stores/:id

Coupon APIs:
├── GET    /api/coupons
├── GET    /api/coupons/:id
├── GET    /api/coupons/store/:storeId
├── GET    /api/coupons/category/:category
├── GET    /api/coupons/tag/:tag
├── POST   /api/coupons
├── PUT    /api/coupons/:id
└── DELETE /api/coupons/:id

Analytics APIs:
├── POST   /api/coupons/reveal/:couponId
└── POST   /api/coupons/click

Search & Trending:
├── GET    /api/search?query=keyword
└── GET    /api/coupons/trending
```

---

## ✅ Completion Checklist

- [ ] All 3 schemas created
- [ ] All 17 APIs implemented
- [ ] Error handling added
- [ ] Database connection working
- [ ] All endpoints tested
- [ ] Documentation complete
- [ ] Ready for frontend integration

---

**Document Version:** 1.1  
**Last Updated:** 2024  
**Total APIs:** 17  
**Total Schemas:** 3

---

## 📄 Export to PDF

To convert this markdown to PDF:

1. **Using VS Code:**
   - Install "Markdown PDF" extension
   - Right-click this file → "Markdown PDF: Export (pdf)"

2. **Using Online Tools:**
   - Visit: https://www.markdowntopdf.com/
   - Upload this file

3. **Using Pandoc (Command Line):**
   ```bash
   pandoc API_DEVELOPMENT_CHECKLIST.md -o API_CHECKLIST.pdf
   ```

---

**End of Document**
