-- =====================================================
-- Marketplace System Views
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete Marketplace Listings
-- Shows listings with seller details and category information
CREATE VIEW `v_marketplace_listings_complete` AS
SELECT
    ml.listing_id,
    ml.title,
    ml.description,
    ml.price,
    ml.currency,
    ml.listing_type,
    ml.status,
    ml.images,
    ml.location,
    ml.contact_phone,
    ml.contact_email,
    ml.is_featured,
    ml.views_count,
    ml.saves_count,
    ml.contacts_count,
    ml.tags,
    ml.created_at,
    ml.updated_at,
    ml.expires_at,
    -- Seller information
    u.user_id as seller_id,
    u.user_type as seller_type,
    prof.full_name as seller_name,
    prof.district as seller_district,
    prof.upazila as seller_upazila,
    u.phone as seller_phone,
    prof.profile_photo_url as seller_photo,
    -- Category information
    mc.category_id,
    mc.category_name,
    mc.category_name_bn,
    mc.icon_url as category_icon,
    -- Parent category info
    parent_cat.category_name as parent_category_name,
    parent_cat.category_name_bn as parent_category_name_bn
FROM
    marketplace_listings ml
    INNER JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
    LEFT JOIN marketplace_categories parent_cat ON mc.parent_category_id = parent_cat.category_id
WHERE
    ml.status != 'draft';

-- View: Active Marketplace Listings
-- Shows only active listings with seller contact info
CREATE VIEW `v_active_marketplace_listings` AS
SELECT
    ml.listing_id,
    ml.title,
    ml.description,
    ml.price,
    ml.currency,
    ml.listing_type,
    ml.location,
    ml.contact_phone,
    ml.contact_email,
    ml.is_featured,
    ml.views_count,
    ml.saves_count,
    ml.created_at,
    ml.expires_at,
    DATEDIFF(ml.expires_at, NOW()) as days_until_expiry,
    -- Seller information
    prof.full_name as seller_name,
    prof.district as seller_district,
    prof.upazila as seller_upazila,
    -- Category information
    mc.category_name,
    mc.category_name_bn
FROM
    marketplace_listings ml
    INNER JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
WHERE
    ml.status = 'active'
    AND ml.expires_at > NOW();

-- View: Marketplace Categories with Listing Counts
-- Shows categories with the number of listings in each
CREATE VIEW `v_marketplace_categories_with_counts` AS
SELECT
    mc.category_id,
    mc.category_name,
    mc.category_name_bn,
    mc.description,
    mc.icon_url,
    mc.parent_category_id,
    mc.is_active,
    mc.sort_order,
    -- Parent category info
    parent_cat.category_name as parent_category_name,
    -- Listing counts
    COUNT(ml.listing_id) as total_listings,
    COUNT(
        CASE
            WHEN ml.status = 'active' THEN ml.listing_id
        END
    ) as active_listings,
    COUNT(
        CASE
            WHEN ml.status = 'sold' THEN ml.listing_id
        END
    ) as sold_listings,
    COUNT(
        CASE
            WHEN ml.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN ml.listing_id
        END
    ) as listings_last_30_days
FROM
    marketplace_categories mc
    LEFT JOIN marketplace_listings ml ON mc.category_id = ml.category_id
    LEFT JOIN marketplace_categories parent_cat ON mc.parent_category_id = parent_cat.category_id
GROUP BY
    mc.category_id,
    mc.category_name,
    mc.category_name_bn,
    mc.description,
    mc.icon_url,
    mc.parent_category_id,
    mc.is_active,
    mc.sort_order,
    parent_cat.category_name
ORDER BY mc.sort_order, mc.category_name;

-- View: Popular Marketplace Listings
-- Shows most viewed and saved listings
CREATE VIEW `v_popular_marketplace_listings` AS
SELECT
    ml.listing_id,
    ml.title,
    ml.price,
    ml.currency,
    ml.listing_type,
    ml.location,
    ml.views_count,
    ml.saves_count,
    ml.contacts_count,
    ml.created_at,
    (
        ml.views_count + ml.saves_count * 3 + ml.contacts_count * 5
    ) as popularity_score,
    -- Seller information
    prof.full_name as seller_name,
    prof.district as seller_district,
    -- Category information
    mc.category_name,
    mc.category_name_bn
FROM
    marketplace_listings ml
    INNER JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
WHERE
    ml.status = 'active'
    AND ml.expires_at > NOW()
ORDER BY popularity_score DESC, ml.views_count DESC;

-- View: User Saved Listings
-- Shows listings saved by users with seller and category info
CREATE VIEW `v_user_saved_listings` AS
SELECT
    mls.save_id,
    mls.saved_at,
    -- User who saved
    u.user_id as saver_id,
    prof.full_name as saver_name,
    -- Listing information
    ml.listing_id,
    ml.title,
    ml.price,
    ml.currency,
    ml.listing_type,
    ml.location,
    ml.status,
    ml.created_at as listing_created_at,
    ml.expires_at,
    -- Seller information
    seller_prof.full_name as seller_name,
    seller_prof.district as seller_district,
    -- Category information
    mc.category_name,
    mc.category_name_bn
FROM
    marketplace_listing_saves mls
    INNER JOIN users u ON mls.user_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    INNER JOIN marketplace_listings ml ON mls.listing_id = ml.listing_id
    INNER JOIN users seller_u ON ml.seller_id = seller_u.user_id
    LEFT JOIN user_profiles seller_prof ON seller_u.user_id = seller_prof.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
ORDER BY mls.saved_at DESC;

-- View: Marketplace Activity by Location
-- Shows marketplace activity grouped by location
CREATE VIEW `v_marketplace_activity_by_location` AS
SELECT
    ml.location,
    COUNT(*) as total_listings,
    COUNT(DISTINCT ml.seller_id) as unique_sellers,
    COUNT(
        CASE
            WHEN ml.status = 'active' THEN ml.listing_id
        END
    ) as active_listings,
    COUNT(
        CASE
            WHEN ml.status = 'sold' THEN ml.listing_id
        END
    ) as sold_listings,
    AVG(ml.price) as average_price,
    MIN(ml.price) as min_price,
    MAX(ml.price) as max_price,
    SUM(ml.views_count) as total_views,
    SUM(ml.saves_count) as total_saves,
    MAX(ml.created_at) as latest_listing_date
FROM marketplace_listings ml
WHERE
    ml.location IS NOT NULL
    AND ml.location != ''
    AND ml.status != 'draft'
GROUP BY
    ml.location
ORDER BY total_listings DESC;

-- View: Seller Performance
-- Shows performance metrics for sellers
CREATE VIEW `v_seller_performance` AS
SELECT
    u.user_id as seller_id,
    prof.full_name as seller_name,
    prof.district as seller_district,
    prof.upazila as seller_upazila,
    u.user_type,
    u.created_at as seller_joined_date,
    -- Listing statistics
    COUNT(*) as total_listings,
    COUNT(
        CASE
            WHEN ml.status = 'active' THEN ml.listing_id
        END
    ) as active_listings,
    COUNT(
        CASE
            WHEN ml.status = 'sold' THEN ml.listing_id
        END
    ) as sold_listings,
    COUNT(
        CASE
            WHEN ml.status = 'expired' THEN ml.listing_id
        END
    ) as expired_listings,
    COUNT(
        CASE
            WHEN ml.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN ml.listing_id
        END
    ) as listings_last_30_days,
    -- Performance metrics
    AVG(ml.views_count) as avg_views_per_listing,
    AVG(ml.saves_count) as avg_saves_per_listing,
    AVG(ml.contacts_count) as avg_contacts_per_listing,
    SUM(ml.views_count) as total_views,
    SUM(ml.saves_count) as total_saves,
    SUM(ml.contacts_count) as total_contacts,
    -- Success rate
    CASE
        WHEN COUNT(*) > 0 THEN ROUND(
            (
                COUNT(
                    CASE
                        WHEN ml.status = 'sold' THEN ml.listing_id
                    END
                ) / COUNT(*)
            ) * 100,
            2
        )
        ELSE 0
    END as success_rate_percent
FROM
    users u
    INNER JOIN user_profiles prof ON u.user_id = prof.user_id
    INNER JOIN marketplace_listings ml ON u.user_id = ml.seller_id
WHERE
    ml.status != 'draft'
GROUP BY
    u.user_id,
    prof.full_name,
    prof.district,
    prof.upazila,
    u.user_type,
    u.created_at
ORDER BY total_listings DESC;

-- View: Recent Marketplace Activity
-- Shows recent marketplace activities across all users
CREATE VIEW `v_recent_marketplace_activity` AS
SELECT
    'listing_created' as activity_type,
    ml.listing_id as entity_id,
    ml.title as entity_title,
    ml.created_at as activity_date,
    prof.full_name as user_name,
    prof.district as user_district,
    mc.category_name
FROM
    marketplace_listings ml
    INNER JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
WHERE
    ml.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
UNION ALL
SELECT
    'listing_saved' as activity_type,
    mls.listing_id as entity_id,
    ml.title as entity_title,
    mls.saved_at as activity_date,
    prof.full_name as user_name,
    prof.district as user_district,
    mc.category_name
FROM
    marketplace_listing_saves mls
    INNER JOIN marketplace_listings ml ON mls.listing_id = ml.listing_id
    INNER JOIN users u ON mls.user_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
WHERE
    mls.saved_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY activity_date DESC
LIMIT 100;

-- View: Expired Listings Report
-- Shows listings that have expired or are about to expire
CREATE VIEW `v_expired_listings_report` AS
SELECT
    ml.listing_id,
    ml.title,
    ml.price,
    ml.currency,
    ml.location,
    ml.created_at,
    ml.expires_at,
    ml.status,
    DATEDIFF(ml.expires_at, NOW()) as days_until_expiry,
    -- Seller information
    prof.full_name as seller_name,
    prof.district as seller_district,
    u.phone as seller_phone,
    -- Category information
    mc.category_name,
    -- Performance metrics
    ml.views_count,
    ml.saves_count,
    ml.contacts_count
FROM
    marketplace_listings ml
    INNER JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
WHERE (
        ml.status = 'expired'
        OR ml.expires_at <= DATE_ADD(NOW(), INTERVAL 7 DAY)
    )
    AND ml.status != 'sold'
ORDER BY ml.expires_at ASC;