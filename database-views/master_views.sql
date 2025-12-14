-- =====================================================
-- Master Database Views File
-- For Langol Krishi Sahayak System
--
-- This file includes all database views organized by category
-- Execute this file to create all views in the database
-- =====================================================

-- Note: Make sure to execute this after the main database schema is created
-- Usage: mysql -u username -p langol_krishi_sahayak < master_views.sql

USE `langol_krishi_sahayak`;

-- =====================================================
-- 1. USER MANAGEMENT VIEWS
-- =====================================================

-- Complete User Information
CREATE VIEW `v_user_complete_info` AS
SELECT
    u.user_id,
    u.email,
    u.user_type,
    u.phone,
    u.is_verified,
    u.is_active,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,
    p.profile_id,
    p.full_name,
    p.nid_number,
    p.date_of_birth,
    p.father_name,
    p.mother_name,
    p.address,
    p.district,
    p.upazila,
    p.division,
    p.profile_photo_url,
    p.verification_status,
    p.verified_at,
    p.created_at as profile_created_at,
    verifier.full_name as verified_by_name
FROM
    users u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    LEFT JOIN user_profiles verifier ON p.verified_by = verifier.user_id;

-- =====================================================
-- 2. SOCIAL FEED VIEWS
-- =====================================================

-- Posts with Author Information
CREATE VIEW `v_posts_with_author` AS
SELECT
    p.post_id,
    p.content,
    p.post_type,
    p.marketplace_listing_id,
    p.images,
    p.location,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    p.is_pinned,
    p.is_reported,
    p.created_at,
    p.updated_at,
    u.user_id as author_id,
    u.user_type as author_type,
    prof.full_name as author_name,
    prof.district as author_district,
    prof.profile_photo_url as author_photo
FROM
    posts p
    INNER JOIN users u ON p.author_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
WHERE
    p.is_deleted = FALSE;

-- =====================================================
-- 3. MARKETPLACE VIEWS
-- =====================================================

-- Complete Marketplace Listings
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
    u.user_id as seller_id,
    u.user_type as seller_type,
    prof.full_name as seller_name,
    prof.district as seller_district,
    prof.upazila as seller_upazila,
    prof.phone as seller_phone,
    prof.profile_photo_url as seller_photo,
    mc.category_id,
    mc.category_name,
    mc.category_name_bn,
    mc.icon_url as category_icon,
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

-- =====================================================
-- 4. SYSTEM HEALTH DASHBOARD
-- =====================================================

-- System Health Dashboard Summary
CREATE VIEW `v_system_health_dashboard` AS
SELECT (
        SELECT COUNT(*)
        FROM users
        WHERE
            is_active = TRUE
    ) as active_users_count,
    (
        SELECT COUNT(*)
        FROM users
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as new_users_last_7_days,
    (
        SELECT COUNT(*)
        FROM user_sessions
        WHERE
            is_active = TRUE
            AND expires_at > NOW()
    ) as active_sessions_count,
    (
        SELECT COUNT(*)
        FROM posts
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            AND is_deleted = FALSE
    ) as posts_last_24_hours,
    (
        SELECT COUNT(*)
        FROM marketplace_listings
        WHERE
            status = 'active'
    ) as active_marketplace_listings,
    (
        SELECT COUNT(*)
        FROM consultations
        WHERE
            status IN ('pending', 'in_progress')
    ) as active_consultations,
    (
        SELECT COUNT(*)
        FROM diagnoses
        WHERE
            status = 'pending'
    ) as pending_diagnoses,
    (
        SELECT COUNT(*)
        FROM notifications
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ) as notifications_sent_last_24_hours,
    (
        SELECT COUNT(*)
        FROM notifications
        WHERE
            is_read = FALSE
    ) as unread_notifications_count,
    (
        SELECT COUNT(*)
        FROM data_operators
        WHERE
            is_active = TRUE
    ) as active_data_operators,
    (
        SELECT COUNT(*)
        FROM data_operator_activity_logs
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ) as operator_activities_last_24_hours,
    (
        SELECT COUNT(*)
        FROM social_feed_reports
        WHERE
            status = 'pending'
    ) as pending_reports,
    (
        SELECT COUNT(*)
        FROM profile_verification_records
        WHERE
            verification_status = 'pending'
    ) as pending_profile_verifications,
    NOW() as system_current_time,
    DATE(NOW()) as system_current_date;

-- =====================================================
-- View Creation Complete
-- =====================================================

-- Show all created views
SHOW TABLES WHERE Table_type = 'VIEW';