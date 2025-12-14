# Central Marketplace - Complete Implementation Guide

## Overview

The Central Marketplace is a comprehensive feature that allows farmers, customers, and experts to buy, sell, rent, and exchange agricultural products, machinery, and services.

---

## Database Schema Analysis

### Core Tables

#### 1. `marketplace_listings`

Primary table storing all marketplace listings.

**Key Fields:**

- `listing_id` (PK) - Auto-increment ID
- `seller_id` (FK to users.user_id)
- `category_id` (FK to marketplace_categories.category_id)
- `title` - Listing title (max 150 chars)
- `description` - Detailed description (TEXT)
- `price` - Decimal(10,2)
- `currency` - Default: 'BDT'
- `listing_type` - ENUM('sell','rent','buy','service')
- `status` - ENUM('active','sold','expired','draft')
- `location` - Varchar(100)
- `contact_phone` - Varchar(15)
- `images` - JSON array of image paths
- `tags` - JSON array of tags
- `views_count` - MEDIUMINT (default 0)
- `saves_count` - SMALLINT (default 0)
- `contacts_count` - SMALLINT (default 0)
- `is_featured` - BOOLEAN (default 0)
- `created_at`, `updated_at`, `expires_at` - Timestamps

**Indexes:**

- idx_listings_seller (seller_id)
- idx_listings_category (category_id)
- idx_listings_status (status)
- idx_listings_location (location)
- idx_listings_type (listing_type)
- FULLTEXT idx_title_description (title, description)

#### 2. `marketplace_categories`

Hierarchical category structure.

**Key Fields:**

- `category_id` (PK)
- `category_name` - English slug (e.g., 'crops')
- `category_name_bn` - Bengali display name
- `description` - Category description
- `icon_url` - Icon/emoji for display
- `parent_id` - Self-referencing FK for subcategories
- `is_active` - BOOLEAN
- `sort_order` - INT for ordering

**Seed Data:**
Run `database-views/marketplace_categories_seed.sql` to populate:

1. crops (ফসল ও শাকসবজি)
2. machinery (যন্ত্রপাতি)
3. fertilizer (সার ও কীটনাশক)
4. seeds (বীজ ও চারা)
5. livestock (গবাদি পশু)
6. tools (হাতিয়ার)
7. other (অন্যান্য)

#### 3. `marketplace_listing_saves`

Tracks which users saved which listings.

**Key Fields:**

- `save_id` (PK)
- `listing_id` (FK to marketplace_listings)
- `user_id` (FK to users)
- `saved_at` - TIMESTAMP

**Unique Constraint:** (listing_id, user_id)

---

## Backend API Implementation

### Base URL

`http://127.0.0.1:8000/api/marketplace`

### Endpoints

#### 1. GET `/marketplace`

**Get all listings with filtering**

**Query Parameters:**

- `search` - Full-text or LIKE search on title/description/tags
- `category_id` - Filter by category ID
- `type` - Filter by listing_type (sell, rent, buy, service)
- `location` - Filter by location (LIKE match)
- `status` - Filter by status (default: 'active')
- `sortBy` - Sort order:
  - `newest` (default) - ORDER BY created_at DESC
  - `oldest` - ORDER BY created_at ASC
  - `price_low` - ORDER BY price ASC
  - `price_high` - ORDER BY price DESC
  - `popular` - ORDER BY views_count DESC
- `page` - Page number
- `per_page` - Items per page (default: 12)

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      /* listing objects */
    ],
    "current_page": 1,
    "per_page": 12,
    "total": 45
  }
}
```

**Includes:**

- `category` - Full category object
- `seller.profile` - Seller's user profile with full_name, profile_photo_url, etc.

#### 2. GET `/marketplace/{id}`

**Get single listing details**

**Response:**

```json
{
  "success": true,
  "data": {
    "listing_id": 123,
    "seller": {
      "user_id": 1,
      "phone": "01712345678",
      "email": "farmer@example.com",
      "is_verified": true,
      "profile": {
        "full_name": "করিম মিয়া",
        "profile_photo_url": "/storage/profile_photos/123.jpg",
        "address": "নোয়াখালী"
      }
    },
    "category": {
      "category_id": 2,
      "category_name": "machinery",
      "category_name_bn": "যন্ত্রপাতি"
    },
    "title": "পাওয়ার টিলার (ভাল অবস্থায়)",
    "description": "...",
    "price": 1500.0,
    "currency": "BDT",
    "listing_type": "rent",
    "status": "active",
    "location": "নোয়াখালী",
    "contact_phone": "01712345678",
    "images": ["path/to/image1.jpg"],
    "tags": ["পাওয়ার টিলার", "ভাড়া"],
    "views_count": 45,
    "saves_count": 12,
    "contacts_count": 8,
    "created_at": "2024-01-15T10:00:00.000000Z"
  }
}
```

#### 3. POST `/marketplace`

**Create new listing**

**Required Fields:**

```json
{
  "seller_id": 1,
  "title": "পাওয়ার টিলার ভাড়া",
  "description": "৮ হর্স পাওয়ার...",
  "price": 1500,
  "listing_type": "rent",
  "category_id": 2
}
```

**Optional Fields:**

- `currency` (default: 'BDT')
- `location`
- `contact_phone`
- `tags` (array)
- `images` (array of paths)

**Response:** Returns created listing object

#### 4. PUT `/marketplace/{id}`

**Update existing listing**

**Allowed Fields:**

- `title`, `description`, `price`, `currency`
- `listing_type`, `location`, `contact_phone`
- `tags`, `images`, `status`, `category_id`

#### 5. DELETE `/marketplace/{id}`

**Delete listing**

#### 6. GET `/marketplace/user/{userId}`

**Get user's listings**

Returns all listings created by specific user.

#### 7. POST `/marketplace/{id}/view`

**Increment view count**

Increments `views_count` by 1.

#### 8. POST `/marketplace/{id}/contact`

**Increment contact count**

Increments `contacts_count` by 1 when user contacts seller.

#### 9. POST `/marketplace/{id}/save`

**Toggle save/bookmark**

**Request Body:**

```json
{
  "user_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "saved": true // or false if unsaved
}
```

Creates/deletes entry in `marketplace_listing_saves` and updates `saves_count`.

---

## Frontend Implementation

### File Structure

```
src/
├── pages/
│   └── CentralMarketplace.tsx          # Main marketplace page
├── components/
│   └── marketplace/
│       ├── MarketplaceCard.tsx         # Listing card component
│       ├── MarketplaceFilters.tsx      # Filter sidebar
│       ├── CreateListing.tsx           # Create/edit listing form
│       └── ListingManager.tsx          # User's listings management
├── services/
│   └── marketplaceService.ts           # API service layer
└── types/
    └── marketplace.ts                  # TypeScript types
```

### Key Features

#### 1. **Listing Display**

- Grid layout (responsive: 1/2/3 columns)
- Card components showing:
  - Featured badge
  - Images carousel
  - Title, description (truncated)
  - Price with currency
  - Seller info (name, location, verified badge)
  - Category and type badges
  - Stats (views, saves, contacts)

#### 2. **Filtering & Search**

- Full-text search
- Category filter (quick buttons + dropdown)
- Type filter (sell/rent/buy/service)
- Location filter (Bangladesh districts)
- Price range slider
- Sort options (newest, oldest, price, popular)

#### 3. **Create Listing**

- Form with validation
- Category & type selection
- Image upload (multiple files)
- Tag management
- Location picker
- Contact info (phone)
- Price input

#### 4. **Listing Management**

- View own listings
- Edit listings
- Delete listings
- Toggle active/draft status
- View statistics

#### 5. **User Interactions**

- Save/bookmark listings
- Contact seller (shows phone, increments counter)
- View count tracking
- Share listings

### TypeScript Interfaces

```typescript
interface MarketplaceListing {
  id: string;
  author: ListingAuthor;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: ListingCategory;
  type: ListingType;
  status: ListingStatus;
  images: string[];
  tags: string[];
  location: string;
  contactInfo?: { phone?: string; email?: string };
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  views: number;
  saves: number;
  contacts: number;
  isOwnListing?: boolean;
}

interface ListingAuthor {
  name: string;
  avatar?: string;
  location: string;
  verified?: boolean;
  rating?: number;
  userType: "farmer" | "customer" | "expert";
}
```

---

## Integration with Authentication

### AuthContext Updates

**User Interface Extended:**

```typescript
interface User {
  id: string;
  user_id?: number; // Database ID for API calls
  name: string;
  type: UserType;
  email: string;
  phone?: string;
  profilePhoto?: string;
  location?: string;
}
```

### Usage in Marketplace

```typescript
const { user } = useAuth();

// Creating listing
const authorInfo = {
  userId: user?.user_id || 1,
  name: user?.name || "ব্যবহারকারী",
  avatar: user?.profilePhoto || "/placeholder.svg",
  location: user?.location || "বাংলাদেশ",
  userType: user?.type || "farmer",
};
```

---

## Category Mapping

Frontend categories (slugs) map to database IDs:

```typescript
const categoryMap = {
  crops: 1,
  machinery: 2,
  fertilizer: 3,
  seeds: 4,
  livestock: 5,
  tools: 6,
  other: 7,
};
```

---

## Image Upload Flow

### Current Implementation (Temporary)

Frontend uses `URL.createObjectURL()` for preview only.

### Production Implementation Needed

1. Upload images to `/api/images/marketplace` endpoint
2. Backend stores in `storage/app/public/marketplace/`
3. Return public URLs
4. Include URLs in listing creation

**Example:**

```typescript
const formData = new FormData();
images.forEach((img) => formData.append("images[]", img));

const response = await fetch("/api/images/marketplace", {
  method: "POST",
  body: formData,
});

const { paths } = await response.json();
// paths = ['/storage/marketplace/xyz.jpg', ...]
```

---

## Database Setup Steps

### 1. Run Categories Seed

```bash
mysql -u root -p langol_krishi_sahayak < database-views/marketplace_categories_seed.sql
```

### 2. Verify Tables Exist

```sql
SHOW TABLES LIKE 'marketplace%';
-- Should show:
-- marketplace_categories
-- marketplace_listings
-- marketplace_listing_saves
```

### 3. Test with Sample Data

```sql
-- Insert test listing
INSERT INTO marketplace_listings
(seller_id, category_id, title, description, price, listing_type, location, status)
VALUES
(1, 2, 'পাওয়ার টিলার ভাড়া', '৮ হর্স পাওয়ার', 1500, 'rent', 'নোয়াখালী', 'active');
```

---

## Testing Checklist

- [ ] Categories seeded in database
- [ ] Sample listings created via backend API
- [ ] Frontend displays listings correctly
- [ ] Filters work (category, type, location, search)
- [ ] Create listing form submits to backend
- [ ] User's own listings show with isOwnListing flag
- [ ] Edit/delete work for own listings only
- [ ] Save/unsave toggles correctly
- [ ] View count increments
- [ ] Contact count increments
- [ ] Seller profile data displays (name, photo, location)
- [ ] Category badges show Bengali names
- [ ] Images display correctly
- [ ] Mobile responsive layout

---

## Common Issues & Solutions

### Issue 1: Listings not showing seller name

**Solution:** Backend must include `seller.profile` relationship:

```php
MarketplaceListing::with(['category', 'seller.profile'])
```

### Issue 2: Category shows as number instead of name

**Solution:** Frontend maps category_id to category name using LISTING_CATEGORIES const.

### Issue 3: user_id undefined when creating listing

**Solution:** Ensure AuthContext stores `user_id` from backend login response.

### Issue 4: Images not uploading

**Solution:** Implement proper file upload endpoint at `/api/images/marketplace`.

---

## Future Enhancements

1. **Real-time Updates** - WebSocket for live listing updates
2. **Advanced Search** - Elasticsearch integration
3. **Messaging System** - In-app chat between buyer/seller
4. **Payment Integration** - bKash/Nagad for secure transactions
5. **Rating System** - Seller ratings and reviews
6. **Recommendation Engine** - AI-based product recommendations
7. **Multi-language** - Full Bengali/English toggle
8. **Mobile App** - React Native version
9. **Analytics Dashboard** - Seller insights and statistics
10. **Promoted Listings** - Paid featured ads

---

## Performance Optimization

1. **Database Indexes:** Already optimized with indexes on frequently queried fields
2. **Pagination:** Implemented with 12 items per page default
3. **Lazy Loading:** Images loaded on scroll
4. **Caching:** Consider Redis for frequently accessed listings
5. **CDN:** Use CDN for image delivery in production

---

## Security Considerations

1. **Authorization:** Add middleware to protect create/update/delete routes
2. **Validation:** All inputs validated on backend
3. **XSS Protection:** HTML sanitization on description field
4. **CSRF:** Laravel CSRF protection enabled
5. **Rate Limiting:** Implement on API endpoints
6. **Image Upload:** Validate file types and sizes

---

## Deployment Notes

### Environment Variables

```env
VITE_API_BASE=http://localhost:8000/api
```

### Backend Storage Link

```bash
php artisan storage:link
```

### Database Migration

```bash
php artisan migrate
```

Then run seed SQL for categories.

---

**Last Updated:** December 5, 2025  
**Version:** 1.0.0  
**Author:** Langol Krishi Sahayak Development Team
