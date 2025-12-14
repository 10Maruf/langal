-- =====================================================
-- Marketplace Location-Based Filtering Enhancement
-- For Langol Krishi Sahayak System
-- =====================================================

-- This file adds enhanced location-based filtering for marketplace
-- Prioritizes listings from same post_office, then upazila, then district

-- View: Marketplace Listings with Location Priority
-- Shows listings ordered by location proximity to a given user location
CREATE OR REPLACE VIEW `v_marketplace_listings_with_location_priority` AS
SELECT
    ml.listing_id,
    ml.seller_id,
    ml.title,
    ml.description,
    ml.price,
    ml.currency,
    ml.category_id,
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
    -- Seller location details
    up.district as seller_district,
    up.upazila as seller_upazila,
    up.post_office as seller_post_office,
    up.full_name as seller_name,
    up.profile_photo_url as seller_photo,
    u.phone as seller_phone,
    u.user_type as seller_type,
    u.is_verified as seller_verified,
    -- Category details
    mc.category_name,
    mc.category_name_bn,
    mc.icon_url as category_icon,
    -- Calculate location match score (higher = closer match)
    -- 3 = same post_office, 2 = same upazila, 1 = same district, 0 = different
    CASE
        WHEN CONCAT(
            up.district,
            '-',
            up.upazila,
            '-',
            up.post_office
        ) = ml.location THEN 3
        WHEN CONCAT(up.district, '-', up.upazila) = ml.location THEN 2
        WHEN up.district = ml.location THEN 1
        ELSE 0
    END as location_match_score
FROM
    marketplace_listings ml
    INNER JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles up ON u.user_id = up.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
WHERE
    ml.status = 'active'
    AND ml.expires_at > NOW();

-- Stored Procedure: Get Marketplace Listings by User Location
-- Returns listings prioritized by proximity to user's location
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS `sp_get_marketplace_by_location`(
    IN p_user_id INT,
    IN p_category_id INT,
    IN p_listing_type VARCHAR(20),
    IN p_limit INT
)
BEGIN
    DECLARE v_district VARCHAR(100);
    DECLARE v_upazila VARCHAR(100);
    DECLARE v_post_office VARCHAR(100);
    
    -- Get user's location details
    SELECT district, upazila, post_office
    INTO v_district, v_upazila, v_post_office
    FROM user_profiles
    WHERE user_id = p_user_id
    LIMIT 1;
    
    -- Return listings ordered by location proximity
    SELECT
        ml.listing_id,
        ml.title,
        ml.description,
        ml.price,
        ml.currency,
        ml.listing_type,
        ml.location,
        ml.contact_phone,
        ml.images,
        ml.is_featured,
        ml.views_count,
        ml.saves_count,
        ml.created_at,
        -- Seller info
        up.full_name as seller_name,
        up.profile_photo_url as seller_photo,
        up.district as seller_district,
        up.upazila as seller_upazila,
        u.is_verified as seller_verified,
        -- Category info
        mc.category_name,
        mc.category_name_bn,
        -- Location proximity score
        CASE
            WHEN up.post_office = v_post_office THEN 3
            WHEN up.upazila = v_upazila THEN 2
            WHEN up.district = v_district THEN 1
            ELSE 0
        END as proximity_score
    FROM
        marketplace_listings ml
        INNER JOIN users u ON ml.seller_id = u.user_id
        LEFT JOIN user_profiles up ON u.user_id = up.user_id
        LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
    WHERE
        ml.status = 'active'
        AND ml.expires_at > NOW()
        AND (p_category_id IS NULL OR ml.category_id = p_category_id)
        AND (p_listing_type IS NULL OR ml.listing_type = p_listing_type)
    ORDER BY
        proximity_score DESC,
        ml.is_featured DESC,
        ml.created_at DESC
    LIMIT p_limit;
END$$

DELIMITER;

-- Function: Get Location Match Score
-- Returns a score indicating how closely two locations match
DELIMITER $$

CREATE FUNCTION IF NOT EXISTS `fn_location_match_score`(
    p_district1 VARCHAR(100),
    p_upazila1 VARCHAR(100),
    p_post_office1 VARCHAR(100),
    p_district2 VARCHAR(100),
    p_upazila2 VARCHAR(100),
    p_post_office2 VARCHAR(100)
)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE score INT DEFAULT 0;
    
    -- Same post office (highest priority)
    IF p_post_office1 = p_post_office2 AND p_post_office1 IS NOT NULL THEN
        SET score = 3;
    -- Same upazila
    ELSEIF p_upazila1 = p_upazila2 AND p_upazila1 IS NOT NULL THEN
        SET score = 2;
    -- Same district
    ELSEIF p_district1 = p_district2 AND p_district1 IS NOT NULL THEN
        SET score = 1;
    END IF;
    
    RETURN score;
END$$

DELIMITER;

-- Index for improved location filtering performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles (
    district,
    upazila,
    post_office
);

CREATE INDEX IF NOT EXISTS idx_marketplace_location_status ON marketplace_listings (location, status, expires_at);

-- View: Nearby Marketplace Listings
-- Get listings from nearby locations based on a reference location
CREATE OR REPLACE VIEW `v_nearby_marketplace_listings` AS
SELECT DISTINCT
    ml.*,
    up.district as seller_district,
    up.upazila as seller_upazila,
    up.post_office as seller_post_office,
    up.full_name as seller_name,
    up.profile_photo_url as seller_photo,
    mc.category_name,
    mc.category_name_bn
FROM
    marketplace_listings ml
    INNER JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles up ON u.user_id = up.user_id
    LEFT JOIN marketplace_categories mc ON ml.category_id = mc.category_id
WHERE
    ml.status = 'active'
    AND ml.expires_at > NOW()
ORDER BY ml.created_at DESC;

-- Comment for documentation
/*
 * Usage Instructions:
 * 
 * 1. To get listings prioritized by user location:
 *    CALL sp_get_marketplace_by_location(user_id, category_id, listing_type, limit);
 *    Example: CALL sp_get_marketplace_by_location(1, NULL, 'sell', 20);
 * 
 * 2. To calculate location match score:
 *    SELECT fn_location_match_score('ঢাকা', 'সাভার', 'আশুলিয়া', 'ঢাকা', 'সাভার', 'আশুলিয়া');
 * 
 * 3. To view listings with location priority:
 *    SELECT * FROM v_marketplace_listings_with_location_priority
 *    WHERE seller_district = 'ঢাকা'
 *    ORDER BY location_match_score DESC, created_at DESC;
 */