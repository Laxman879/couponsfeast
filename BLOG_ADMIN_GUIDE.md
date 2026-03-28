# 📝 Blog Section - Admin Guide

## ✅ Step 1: Open Blog Admin

Go to: **http://localhost:3000/admin/blog**

You'll see:
- Blog cards
- ✏️ Edit icon
- ➕ Add Article button

---

## ✅ Step 2: Understand How Your UI Works (IMPORTANT)

Your homepage `BlogSection` shows:

### 🟡 1. Featured Article (Big Card)
- The article with **⭐ Featured = ON**
- Only **ONE** should be featured

### 🔵 2. Sidebar Articles (3 small cards)
- Remaining articles (max 3)
- Automatically selected

---

## ✅ Step 3: Create Featured Article (Example 1)

Click **➕ Add Article**

Fill this 👇

### 🔹 Main Fields

| Field       | Value                                                              |
|-------------|--------------------------------------------------------------------|
| Title       | Tax Season Survival Guide                                          |
| Category    | BE A TAX PRO                                                       |
| Subtitle    | Everything you need to file taxes easily this year                 |
| Description | Learn how to maximize your tax returns with simple strategies.     |
| Image       | `https://images.unsplash.com/photo-1554224155-6726b3ff858f`        |

### ⭐ IMPORTANT
> Toggle **Featured → ON**

👉 Click **Create**

---

## ✅ Step 4: Create Sidebar Articles (Example 2)

Create 3 more articles (**Featured OFF ❌**)

### 🔵 Article 2

| Field    | Value                                                          |
|----------|----------------------------------------------------------------|
| Title    | Hair Goals for Summer                                          |
| Category | BEAUTY                                                         |
| Subtitle | Best products for shiny hair                                   |
| Image    | `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9` |

### 🔵 Article 3

| Field    | Value                                                          |
|----------|----------------------------------------------------------------|
| Title    | CVS Beauty Haul                                                |
| Category | BEAUTY                                                         |
| Subtitle | Affordable skincare picks                                      |
| Image    | `https://images.unsplash.com/photo-1596462502278-27bfdc403348` |

### 🔵 Article 4

| Field    | Value                                                          |
|----------|----------------------------------------------------------------|
| Title    | Epic Beauty Sale                                               |
| Category | SALE                                                           |
| Subtitle | Grab deals before they end                                     |
| Image    | `https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da` |

👉 Make sure:
- ❌ **Featured = OFF** for all 3

---

## ✅ Step 5: Edit Existing Article (Optional)

If you already have articles:

1. Click ✏️ **Edit**
2. Update:
   - Title / Category / Image
   - Toggle **⭐ Featured ON** (only for one article)
3. Click **Update**

---

## 🔄 How It Maps to Homepage

| Homepage Element          | Admin Field                          |
|---------------------------|--------------------------------------|
| Featured big card         | Article with ⭐ Featured = ON        |
| Featured image            | Image field                          |
| Featured category label   | Category field (e.g., "BE A TAX PRO")|
| Featured title            | Title field                          |
| Featured description      | Description or Subtitle field        |
| Sidebar cards (3 small)   | Remaining articles (Featured OFF)    |
| Sidebar title             | Title (auto uppercased)              |
| Sidebar subtitle          | Subtitle or Description field        |
| "by {SiteName}" header    | Site Name in CMS → Site Config       |
