# Marketplace API Integration Guide

This document explains how to connect the Central Marketplace frontend to the Laravel backend and database.

## 1. Database Setup

Import the provided SQL dump (`Langal_xampp.sql`) into a MariaDB/MySQL database. Example (PowerShell):

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS langol_krishi_sahayak;"
mysql -u root -p langol_krishi_sahayak < Langal_xampp.sql
```

Update `.env` in `langal-backend/`:

```
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=langol_krishi_sahayak
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

Then clear and cache config:

```powershell
php artisan config:clear; php artisan config:cache
```

## 2. New Models

Added:

-   `MarketplaceCategory` -> `marketplace_categories`
-   `MarketplaceListing` -> `marketplace_listings`
-   `MarketplaceListingSave` -> `marketplace_listing_saves`

Adjust `$fillable` if your table contains different column names.

## 3. Controller & Routes

Controller: `App/Http/Controllers/Api/MarketplaceController.php`
Routes registered in `routes/api.php` under prefix `/api/marketplace`:

-   `GET    /api/marketplace` (list + filters)
-   `GET    /api/marketplace/{id}` (single)
-   `POST   /api/marketplace` (create)
-   `PUT    /api/marketplace/{id}` (update)
-   `DELETE /api/marketplace/{id}` (delete)
-   `GET    /api/marketplace/user/{userId}` (list user listings)
-   `POST   /api/marketplace/{id}/view` (increment view)
-   `POST   /api/marketplace/{id}/contact` (increment contact)
-   `POST   /api/marketplace/{id}/save` (toggle save)

## 4. Frontend Service Refactor

`src/services/marketplaceService.ts` now calls the backend. Set `VITE_API_BASE` in your frontend `.env` (e.g. `VITE_API_BASE=http://localhost:8000/api`).

If the API is unreachable, it falls back to local dummy data so the UI remains functional.

## 5. Auth & Security (Next Steps)

Currently create/update/delete endpoints are public. Apply middleware soon:

```php
Route::middleware('auth:sanctum')->group(function() {
  Route::post('/', ...);
  Route::put('/{id}', ...);
  Route::delete('/{id}', ...);
  Route::post('/{id}/save', ...);
  Route::post('/{id}/contact', ...); // optionally public
});
```

## 6. Data Column Alignment

If your DB schema uses different column names (e.g. `views` instead of `views_count`), update the `$fillable` array and mapping logic in the controller and service.

## 7. Testing Quickly

Start backend:

```powershell
php artisan serve
```

Test endpoint:

```powershell
Invoke-RestMethod http://localhost:8000/api/marketplace
```

## 8. Future Enhancements

-   Validation & policies (prevent editing others' listings)
-   Category management endpoints
-   Image upload (Laravel storage + presigned URLs)
-   Fulltext search tuning
-   Expiry job for listings (`expires_at`)
-   Caching popular listings

## 9. Troubleshooting

| Issue                 | Fix                                                                  |
| --------------------- | -------------------------------------------------------------------- |
| 404 on routes         | Run `php artisan route:list` to confirm; clear route cache.          |
| SQL errors            | Ensure DB_CONNECTION matches (mariadb vs mysql) and schema imported. |
| TypeScript complaints | Adjust union mapping in `mapDbListingToUi`.                          |
| CORS errors           | Configure `app/Http/Middleware` or install `fruitcake/laravel-cors`. |

## 10. Safe Rollback

Remove marketplace code by deleting the three model files, the controller, and route block from `api.php`.

---

Feel free to request additional endpoints or refinements.
