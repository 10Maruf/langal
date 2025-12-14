# Marketplace Quick Fix Commands

## Problem: Categories not in database

**Symptoms:**

- 422 error: "category_id is invalid"
- Listings don't save to database

**Solution:**

```bash
cd langal-backend
php artisan db:seed --class=MarketplaceCategorySeeder
```

## Problem: Backend server not running

**Symptoms:**

- Network errors in console
- API calls fail

**Solution:**

```bash
cd langal-backend
php artisan serve
```

## Problem: Frontend not running

**Solution:**

```bash
npm run dev
```

## Verify Categories Exist

```bash
cd langal-backend
php artisan tinker --execute="echo DB::table('marketplace_categories')->count() . ' categories found';"
```

Should output: `7 categories found`

## Delete All Listings (for testing)

```bash
cd langal-backend
php artisan tinker --execute="DB::table('marketplace_listings')->delete(); echo 'All listings deleted';"
```

## Check Latest Listing

```bash
cd langal-backend
php artisan tinker --execute="print_r(DB::table('marketplace_listings')->latest()->first());"
```
