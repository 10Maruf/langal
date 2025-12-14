# 🚀 Marketplace Quick Start - 2 Minutes

## Step 1: Database (30 seconds)

Open phpMyAdmin or MySQL terminal:

```sql
USE langol_krishi_sahayak;

INSERT INTO marketplace_categories (category_id, category_name, category_name_bn, icon_url, is_active, sort_order) VALUES
(1, 'crops', 'ফসল ও শাকসবজি', '🌾', 1, 1),
(2, 'machinery', 'যন্ত্রপাতি', '🚜', 1, 2),
(3, 'fertilizer', 'সার ও কীটনাশক', '🧪', 1, 3),
(4, 'seeds', 'বীজ ও চারা', '🌱', 1, 4),
(5, 'livestock', 'গবাদি পশু', '🐄', 1, 5),
(6, 'tools', 'হাতিয়ার', '🔧', 1, 6),
(7, 'other', 'অন্যান্য', '📦', 1, 7);
```

## Step 2: Test (30 seconds)

### Backend Test:

```bash
curl http://127.0.0.1:8000/api/marketplace
```

Should return `{"success":true,"data":[]}`

### Frontend Test:

1. Open browser: `http://localhost:5174/`
2. Login as farmer (01712345678)
3. Click "কেন্দ্রীয় বাজার"
4. See marketplace page ✓

## Step 3: Create Listing (1 minute)

1. Click **"বিজ্ঞাপন দিন"**
2. Fill form:
   - **ধরন:** বিক্রি
   - **ক্যাটেগরি:** 🌾 ফসল ও শাকসবজি
   - **শিরোনাম:** তাজা ধান বিক্রয়
   - **বিবরণ:** BRRI-28 জাত, ভাল মানের
   - **দাম:** 28
   - **স্থান:** কুমিল্লা
   - **যোগাযোগ:** 01812567890
   - **ট্যাগ:** ধান, BRRI-28
3. Click **"বিজ্ঞাপন দিন"**
4. See your listing appear! ✓

---

## What Changed?

✅ **AuthContext** - Now stores `user_id` from database  
✅ **Marketplace Service** - Maps categories correctly (crops → 1, machinery → 2...)  
✅ **Backend API** - Returns seller profile with name and photo  
✅ **Database** - Categories table populated with 7 categories

---

## Quick Troubleshooting

**Problem:** "Category not found"  
**Fix:** Run the SQL above (Step 1)

**Problem:** "Seller name shows as phone number"  
**Fix:** Check user has profile: `SELECT * FROM user_profiles WHERE user_id=1;`

**Problem:** "Can't create listing"  
**Fix:** Make sure you're logged in and have `user_id` in AuthContext

---

## Full Documentation

📚 **Complete Guide:** See `MARKETPLACE_IMPLEMENTATION_GUIDE.md`  
🧪 **Testing Guide:** See `MARKETPLACE_TESTING_GUIDE.md`  
📝 **Changes Summary:** See `MARKETPLACE_CHANGES_SUMMARY.md`

---

## Features Working Now

✅ View all listings (grid layout)  
✅ Search listings (full-text)  
✅ Filter by category, type, location  
✅ Sort by price, date, popularity  
✅ Create new listing  
✅ Edit own listings  
✅ Delete own listings  
✅ Save/bookmark listings  
✅ Contact seller (shows phone)  
✅ View/save/contact counters  
✅ Seller profile display (name, photo, verified badge)

⏳ **Coming Soon:** Image upload to server (currently local preview only)

---

**You're ready to test! 🎉**

Total setup time: ~2 minutes
