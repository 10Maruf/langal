# Marketplace Setup & Testing Guide

## Quick Setup (5 Minutes)

### Step 1: Database Setup

```bash
# Navigate to your MySQL/XAMPP
mysql -u root -p langol_krishi_sahayak

# Or via phpMyAdmin, run this SQL:
```

```sql
-- 1. Populate marketplace categories
INSERT INTO `marketplace_categories` (`category_id`, `category_name`, `category_name_bn`, `description`, `icon_url`, `is_active`, `sort_order`) VALUES
(1, 'crops', 'ফসল ও শাকসবজি', 'সব ধরনের ফসল, শাকসবজি এবং কৃষিপণ্য', '🌾', 1, 1),
(2, 'machinery', 'যন্ত্রপাতি', 'কৃষি যন্ত্রপাতি, ট্রাক্টর, পাওয়ার টিলার ইত্যাদি', '🚜', 1, 2),
(3, 'fertilizer', 'সার ও কীটনাশক', 'রাসায়নিক সার, জৈব সার, কীটনাশক', '🧪', 1, 3),
(4, 'seeds', 'বীজ ও চারা', 'উন্নত জাতের বীজ, চারা, কলম', '🌱', 1, 4),
(5, 'livestock', 'গবাদি পশু', 'গরু, ছাগল, মুরগি, হাঁস ইত্যাদি', '🐄', 1, 5),
(6, 'tools', 'হাতিয়ার', 'কোদাল, কাস্তে, লাঙল ও অন্যান্য হাতিয়ার', '🔧', 1, 6),
(7, 'other', 'অন্যান্য', 'অন্যান্য কৃষি সম্পর্কিত পণ্য ও সেবা', '📦', 1, 7);

-- 2. Create a test listing (optional)
INSERT INTO `marketplace_listings`
(`seller_id`, `category_id`, `title`, `description`, `price`, `currency`, `listing_type`, `location`, `contact_phone`, `status`, `tags`, `images`)
VALUES
(1, 2, 'পাওয়ার টিলার ভাড়া', '৮ হর্স পাওয়ার পাওয়ার টিলার। চলমান অবস্থায় আছে। খুব কম ব্যবহার হয়েছে।', 1500.00, 'BDT', 'rent', 'নোয়াখালী', '01712-345678', 'active', '["পাওয়ার টিলার", "ভাড়া", "চাষাবাদ"]', '[]');
```

### Step 2: Backend Verification

```bash
# Test the API endpoint
curl http://127.0.0.1:8000/api/marketplace

# You should see JSON response with listings
```

### Step 3: Frontend Testing

```bash
# Make sure frontend is running
npm run dev

# Navigate to: http://localhost:5174/farmer-dashboard
# Click on "কেন্দ্রীয় বাজার" menu item
```

---

## Testing Checklist

### 1. View Listings ✓

- [ ] Navigate to Central Marketplace
- [ ] See listings displayed in grid
- [ ] Categories show Bengali names
- [ ] Prices display correctly

### 2. Filters ✓

- [ ] Search by text works
- [ ] Category filter works
- [ ] Type filter (sell/rent) works
- [ ] Location filter works
- [ ] Sort options work

### 3. Create Listing ✓

- [ ] Click "বিজ্ঞাপন দিন" button
- [ ] Form opens
- [ ] Select category and type
- [ ] Fill title, description, price
- [ ] Add tags
- [ ] Upload images (currently preview only)
- [ ] Submit creates listing

### 4. User's Listings ✓

- [ ] Click "আমার বিজ্ঞাপন"
- [ ] See only your listings
- [ ] Edit button works
- [ ] Delete button works
- [ ] Status toggle works

### 5. Interactions ✓

- [ ] Save/bookmark listing
- [ ] Contact seller (shows phone)
- [ ] View count increments

---

## Common Test Scenarios

### Scenario 1: Farmer Creates Listing

```
1. Login as farmer (phone: 01712345678)
2. Go to "কেন্দ্রীয় বাজার"
3. Click "বিজ্ঞাপন দিন"
4. Fill form:
   - Type: বিক্রি
   - Category: ফসল ও শাকসবজি
   - Title: "তাজা ধান বিক্রয়"
   - Description: "BRRI-28 জাত, প্রতি কেজি ২৮ টাকা"
   - Price: 28
   - Location: কুমিল্লা
   - Phone: 01812567890
   - Tags: ধান, BRRI-28, নতুন
5. Submit
6. Verify listing appears in feed
```

### Scenario 2: Customer Searches & Contacts

```
1. Login as customer
2. Go to marketplace
3. Search: "ধান"
4. Filter: Category = ফসল ও শাকসবজি
5. Click on listing
6. Click "যোগাযোগ করুন"
7. Verify phone number shows
8. Verify contact count increments
```

### Scenario 3: Expert Rents Machinery

```
1. Login as expert
2. Go to marketplace
3. Filter: Type = ভাড়া, Category = যন্ত্রপাতি
4. Find "পাওয়ার টিলার"
5. Save listing (bookmark)
6. Verify it appears in saved items
```

---

## API Testing with Postman/Thunder Client

### 1. Get All Listings

```
GET http://127.0.0.1:8000/api/marketplace
```

### 2. Get Listings with Filters

```
GET http://127.0.0.1:8000/api/marketplace?category_id=2&type=rent&sortBy=price_low
```

### 3. Create Listing

```
POST http://127.0.0.1:8000/api/marketplace
Content-Type: application/json

{
  "seller_id": 1,
  "category_id": 2,
  "title": "ট্রাক্টর ভাড়া",
  "description": "৭৫ এইচপি মাহিন্দ্রা ট্রাক্টর",
  "price": 2800,
  "currency": "BDT",
  "listing_type": "rent",
  "location": "যশোর",
  "contact_phone": "01715456789",
  "tags": ["ট্রাক্টর", "ভাড়া"],
  "images": []
}
```

### 4. Update Listing

```
PUT http://127.0.0.1:8000/api/marketplace/1
Content-Type: application/json

{
  "price": 1800,
  "status": "active"
}
```

### 5. Delete Listing

```
DELETE http://127.0.0.1:8000/api/marketplace/1
```

### 6. Save Listing

```
POST http://127.0.0.1:8000/api/marketplace/1/save
Content-Type: application/json

{
  "user_id": 1
}
```

---

## Troubleshooting

### Issue: "No listings found"

**Check:**

1. Database has data: `SELECT * FROM marketplace_listings;`
2. Backend is running: `php artisan serve`
3. API responds: `curl http://127.0.0.1:8000/api/marketplace`
4. Frontend API base is correct in `.env`

### Issue: "Category shows as number"

**Check:**

1. Categories seeded: `SELECT * FROM marketplace_categories;`
2. Backend includes category relation: `with(['category'])`

### Issue: "Seller name shows as 'ব্যবহারকারী #1'"

**Check:**

1. User has profile: `SELECT * FROM user_profiles WHERE user_id=1;`
2. Backend includes seller.profile: `with(['seller.profile'])`
3. Login response includes user_id in AuthContext

### Issue: "Can't create listing - 422 error"

**Check:**

1. All required fields provided
2. category_id exists in marketplace_categories
3. seller_id exists in users table
4. listing_type is one of: sell, rent, buy, service

### Issue: "Images not uploading"

**Note:** Image upload endpoint not yet implemented. Currently using local preview only.
**TODO:** Implement `/api/images/marketplace` endpoint for production.

---

## Database Verification Queries

```sql
-- 1. Check categories exist
SELECT * FROM marketplace_categories ORDER BY sort_order;

-- 2. Check listings
SELECT
  l.listing_id,
  l.title,
  l.price,
  l.listing_type,
  c.category_name_bn,
  u.phone,
  up.full_name
FROM marketplace_listings l
JOIN marketplace_categories c ON l.category_id = c.category_id
JOIN users u ON l.seller_id = u.user_id
LEFT JOIN user_profiles up ON u.user_id = up.user_id
WHERE l.status = 'active';

-- 3. Check saved listings
SELECT
  u.phone as user_phone,
  l.title as listing_title,
  s.saved_at
FROM marketplace_listing_saves s
JOIN users u ON s.user_id = u.user_id
JOIN marketplace_listings l ON s.listing_id = l.listing_id;

-- 4. Top sellers
SELECT
  up.full_name,
  COUNT(*) as total_listings,
  SUM(l.views_count) as total_views,
  SUM(l.contacts_count) as total_contacts
FROM marketplace_listings l
JOIN users u ON l.seller_id = u.user_id
LEFT JOIN user_profiles up ON u.user_id = up.user_id
GROUP BY l.seller_id, up.full_name
ORDER BY total_listings DESC;
```

---

## Next Steps After Testing

1. **Implement Image Upload**

   - Create `/api/images/marketplace` endpoint
   - Store files in `storage/app/public/marketplace/`
   - Return public URLs

2. **Add Authorization**

   - Protect create/update/delete routes
   - Verify user owns listing before edit/delete

3. **Enhance Search**

   - Add more filter options (price range UI)
   - Implement autocomplete for tags

4. **Mobile Optimization**

   - Test responsive layout
   - Optimize for touch interactions

5. **Analytics Dashboard**
   - Show seller statistics
   - Track popular categories
   - Monitor marketplace activity

---

**Ready to Test!**

Start with Step 1 (Database Setup), then test each feature systematically.

For issues, check `MARKETPLACE_IMPLEMENTATION_GUIDE.md` for detailed documentation.
