-- =====================================================
-- Langol Krishi Sahayak System - Complete Database Schema
-- Created for XAMPP/MySQL
-- For Farmer, Consultant and Customer
-- Database: langol_krishi_sahayak
-- =====================================================

DROP DATABASE IF EXISTS `langol_krishi_sahayak`;

CREATE DATABASE `langol_krishi_sahayak` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `langol_krishi_sahayak`;

-- =====================================================
-- 1. User Management Tables
-- =====================================================

-- Main users table
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `email` VARCHAR(100) UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `user_type` ENUM(
        'farmer',
        'expert',
        'customer',
        'data_operator'
    ) NOT NULL,
    `phone` VARCHAR(15) UNIQUE NOT NULL, -- Bangladesh mobile: 01xxxxxxxxx (11 digits)
    `is_verified` BOOLEAN DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_phone` (`phone`),
    INDEX `idx_users_type` (`user_type`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- User profiles table
CREATE TABLE `user_profiles` (
    `profile_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user_id` VARCHAR(36) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL, -- Bangla names typically 50-60 chars
    `nid_number` VARCHAR(17) UNIQUE, -- Bangladesh NID: 10 digits (old) or 17 digits (new) - Optional for farmers (Either NID or Krishi Card required)
    `date_of_birth` DATE,
    `father_name` VARCHAR(100),
    `mother_name` VARCHAR(100),
    `address` TEXT,
    `district` VARCHAR(50), -- Bangladesh has 64 districts
    `upazila` VARCHAR(50), -- Upazila names
    `division` VARCHAR(20), -- 8 divisions in Bangladesh
    `profile_photo_url` VARCHAR(255),
    `verification_status` ENUM(
        'pending',
        'verified',
        'rejected'
    ) DEFAULT 'pending',
    `verified_by` VARCHAR(36),
    `verified_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`verified_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    INDEX `idx_profile_verification` (`verification_status`),
    INDEX `idx_profile_district` (`district`),
    INDEX `idx_profile_nid` (`nid_number`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Farmer detailed information
CREATE TABLE `farmer_details` (
    `farmer_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user_id` VARCHAR(36) NOT NULL,
    `farm_size` DECIMAL(8, 2), -- In Bangladesh, most farms are small (0.01-50 bigha)
    `farm_size_unit` ENUM('bigha', 'katha', 'acre') DEFAULT 'bigha',
    `farm_type` VARCHAR(50), -- Rice, Vegetable, Mixed, etc.
    `experience_years` TINYINT UNSIGNED, -- 0-100 years
    `land_ownership` VARCHAR(100), -- Own, Lease, Share, etc.
    `registration_date` DATE,
    `krishi_card_number` VARCHAR(20), -- Government agriculture card - Optional (Either NID or Krishi Card required)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_farmer_farm_size` (`farm_size`),
    INDEX `idx_farmer_experience` (`experience_years`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Expert/Consultant qualifications
CREATE TABLE `expert_qualifications` (
    `expert_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user_id` VARCHAR(36) NOT NULL,
    `qualification` VARCHAR(100), -- BSc Agriculture, MSc, etc.
    `specialization` VARCHAR(100), -- Crop diseases, Soil, Pest management
    `experience_years` TINYINT UNSIGNED, -- 0-50 years
    `institution` VARCHAR(100), -- BAU, SAU, DAE, etc.
    `consultation_fee` DECIMAL(6, 2), -- BDT 100-99999
    `rating` DECIMAL(2, 1) DEFAULT 0.0, -- 0.0-5.0
    `total_consultations` SMALLINT UNSIGNED DEFAULT 0,
    `is_government_approved` BOOLEAN DEFAULT FALSE,
    `license_number` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_expert_specialization` (`specialization`),
    INDEX `idx_expert_rating` (`rating`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Customer business details
CREATE TABLE `customer_business_details` (
    `business_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user_id` VARCHAR(36) NOT NULL,
    `business_name` VARCHAR(100),
    `business_type` VARCHAR(50), -- Retailer, Wholesaler, Processing, etc.
    `trade_license_number` VARCHAR(30),
    `business_address` TEXT,
    `established_year` YEAR,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_business_type` (`business_type`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 2. Social Feed System Tables
-- =====================================================

-- Post tags
CREATE TABLE `post_tags` (
    `tag_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `tag_name` VARCHAR(100) UNIQUE NOT NULL,
    `usage_count` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_tag_name` (`tag_name`),
    INDEX `idx_tag_usage` (`usage_count`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Social feed posts
CREATE TABLE `posts` (
    `post_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `author_id` VARCHAR(36) NOT NULL,
    `content` TEXT NOT NULL,
    `post_type` ENUM(
        'general',
        'marketplace',
        'question',
        'advice',
        'expert_advice'
    ) DEFAULT 'general',
    `marketplace_listing_id` VARCHAR(36),
    `images` JSON,
    `location` VARCHAR(255),
    `likes_count` INT DEFAULT 0,
    `comments_count` INT DEFAULT 0,
    `shares_count` INT DEFAULT 0,
    `views_count` INT DEFAULT 0,
    `is_pinned` BOOLEAN DEFAULT FALSE,
    `is_reported` BOOLEAN DEFAULT FALSE,
    `is_deleted` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_posts_author_date` (
        `author_id`,
        `created_at` DESC
    ),
    INDEX `idx_posts_type` (`post_type`),
    INDEX `idx_posts_created` (`created_at` DESC),
    INDEX `idx_posts_location` (`location`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Post-tag relationships
CREATE TABLE `post_tag_relations` (
    `post_id` VARCHAR(36) NOT NULL,
    `tag_id` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`post_id`, `tag_id`),
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `post_tags` (`tag_id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Post likes
CREATE TABLE `post_likes` (
    `like_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `post_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `liked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_like` (`post_id`, `user_id`),
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_likes_post` (`post_id`),
    INDEX `idx_likes_user` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Post comments and replies
CREATE TABLE `comments` (
    `comment_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `post_id` VARCHAR(36) NOT NULL,
    `author_id` VARCHAR(36) NOT NULL,
    `content` TEXT NOT NULL,
    `parent_comment_id` VARCHAR(36),
    `likes_count` INT DEFAULT 0,
    `is_reported` BOOLEAN DEFAULT FALSE,
    `is_deleted` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
    FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE,
    INDEX `idx_comments_post` (`post_id`),
    INDEX `idx_comments_author` (`author_id`),
    INDEX `idx_comments_parent` (`parent_comment_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Comment likes
CREATE TABLE `comment_likes` (
    `like_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `comment_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `liked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_comment_like` (`comment_id`, `user_id`),
    FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_comment_likes_comment` (`comment_id`),
    INDEX `idx_comment_likes_user` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 3. Marketplace System Tables
-- =====================================================

-- Marketplace categories
CREATE TABLE `marketplace_categories` (
    `category_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `category_name` VARCHAR(100) NOT NULL,
    `category_name_bn` VARCHAR(100),
    `description` TEXT,
    `icon_url` VARCHAR(500),
    `parent_category_id` VARCHAR(36),
    `is_active` BOOLEAN DEFAULT TRUE,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`parent_category_id`) REFERENCES `marketplace_categories` (`category_id`) ON DELETE SET NULL,
    INDEX `idx_category_name` (`category_name`),
    INDEX `idx_category_active` (`is_active`),
    INDEX `idx_category_parent` (`parent_category_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Marketplace listings
CREATE TABLE `marketplace_listings` (
    `listing_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `seller_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(150) NOT NULL, -- Bangladesh product names
    `description` TEXT,
    `price` DECIMAL(10, 2), -- BDT pricing, max 99,999,999.99
    `currency` VARCHAR(3) DEFAULT 'BDT',
    `category_id` VARCHAR(36),
    `listing_type` ENUM(
        'sell',
        'rent',
        'buy',
        'service'
    ) DEFAULT 'sell',
    `status` ENUM(
        'active',
        'sold',
        'expired',
        'draft'
    ) DEFAULT 'active',
    `images` JSON,
    `location` VARCHAR(100), -- Bangladesh locations
    `contact_phone` VARCHAR(15), -- Bangladesh mobile format
    `contact_email` VARCHAR(100),
    `is_featured` BOOLEAN DEFAULT FALSE,
    `views_count` MEDIUMINT UNSIGNED DEFAULT 0, -- 0-16M views
    `saves_count` SMALLINT UNSIGNED DEFAULT 0, -- 0-65K saves
    `contacts_count` SMALLINT UNSIGNED DEFAULT 0, -- 0-65K contacts
    `tags` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP DEFAULT(
        CURRENT_TIMESTAMP + INTERVAL 60 DAY
    ),
    FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `marketplace_categories` (`category_id`) ON DELETE SET NULL,
    INDEX `idx_listings_status` (`status`),
    INDEX `idx_listings_category` (`category_id`),
    INDEX `idx_listings_seller` (`seller_id`),
    INDEX `idx_listings_location` (`location`),
    INDEX `idx_listings_type` (`listing_type`),
    INDEX `idx_listings_created` (`created_at` DESC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Listing saves/favorites
CREATE TABLE `marketplace_listing_saves` (
    `save_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `listing_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `saved_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_save` (`listing_id`, `user_id`),
    FOREIGN KEY (`listing_id`) REFERENCES `marketplace_listings` (`listing_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_saves_listing` (`listing_id`),
    INDEX `idx_saves_user` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 4. Consultation System Tables
-- =====================================================

-- Consultation sessions
CREATE TABLE `consultations` (
    `consultation_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `farmer_id` VARCHAR(36) NOT NULL,
    `expert_id` VARCHAR(36),
    `topic` VARCHAR(150), -- Consultation topics
    `crop_type` VARCHAR(50), -- Bangladesh crop names
    `issue_description` TEXT NOT NULL,
    `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium',
    `status` ENUM(
        'pending',
        'in_progress',
        'resolved',
        'cancelled'
    ) DEFAULT 'pending',
    `location` VARCHAR(100), -- Bangladesh locations
    `images` JSON,
    `consultation_fee` DECIMAL(6, 2), -- BDT 0-9999.99
    `payment_status` ENUM('pending', 'paid', 'refunded'),
    `preferred_time` VARCHAR(50), -- Time preferences
    `consultation_type` ENUM(
        'voice',
        'video',
        'chat',
        'in_person'
    ) DEFAULT 'chat',
    `urgency` ENUM('low', 'medium', 'high') DEFAULT 'medium',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `resolved_at` TIMESTAMP NULL,
    FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    INDEX `idx_consultations_farmer` (`farmer_id`),
    INDEX `idx_consultations_expert` (`expert_id`),
    INDEX `idx_consultations_status` (`status`),
    INDEX `idx_consultations_priority` (`priority`),
    INDEX `idx_consultations_created` (`created_at` DESC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Consultation responses
CREATE TABLE `consultation_responses` (
    `response_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `consultation_id` VARCHAR(36) NOT NULL,
    `expert_id` VARCHAR(36) NOT NULL,
    `response_text` TEXT NOT NULL,
    `attachments` JSON,
    `is_final_response` BOOLEAN DEFAULT FALSE,
    `diagnosis` TEXT,
    `treatment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`consultation_id`) ON DELETE CASCADE,
    FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_responses_consultation` (`consultation_id`),
    INDEX `idx_responses_expert` (`expert_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 5. Disease Diagnosis System Tables
-- =====================================================

-- Disease diagnosis
CREATE TABLE `diagnoses` (
    `diagnosis_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `farmer_id` VARCHAR(36) NOT NULL,
    `crop_type` VARCHAR(100),
    `symptoms_description` TEXT,
    `uploaded_images` JSON,
    `farm_area` DECIMAL(10, 2),
    `area_unit` ENUM('acre', 'bigha', 'katha') DEFAULT 'bigha',
    `ai_analysis_result` JSON,
    `expert_verification_id` VARCHAR(36),
    `is_verified_by_expert` BOOLEAN DEFAULT FALSE,
    `urgency` ENUM('low', 'medium', 'high') DEFAULT 'medium',
    `status` ENUM(
        'pending',
        'diagnosed',
        'completed'
    ) DEFAULT 'pending',
    `location` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`expert_verification_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    INDEX `idx_diagnoses_farmer` (`farmer_id`),
    INDEX `idx_diagnoses_crop` (`crop_type`),
    INDEX `idx_diagnoses_status` (`status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Disease treatments
CREATE TABLE `disease_treatments` (
    `treatment_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `diagnosis_id` VARCHAR(36) NOT NULL,
    `disease_name` VARCHAR(255),
    `disease_name_bn` VARCHAR(255),
    `probability_percentage` DECIMAL(5, 2),
    `treatment_description` TEXT,
    `estimated_cost` DECIMAL(10, 2),
    `treatment_guidelines` JSON,
    `prevention_guidelines` JSON,
    `video_links` JSON,
    `disease_type` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`diagnosis_id`) REFERENCES `diagnoses` (`diagnosis_id`) ON DELETE CASCADE,
    INDEX `idx_treatments_diagnosis` (`diagnosis_id`),
    INDEX `idx_treatments_disease` (`disease_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Treatment chemicals
CREATE TABLE `treatment_chemicals` (
    `chemical_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `treatment_id` VARCHAR(36) NOT NULL,
    `chemical_name` VARCHAR(255),
    `chemical_type` ENUM(
        'fungicide',
        'pesticide',
        'herbicide',
        'fertilizer',
        'bactericide'
    ) DEFAULT 'fungicide',
    `dose_per_acre` DECIMAL(8, 2),
    `dose_unit` VARCHAR(20),
    `price_per_unit` DECIMAL(10, 2),
    `application_notes` TEXT,
    `safety_precautions` TEXT,
    `application_method` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`treatment_id`) REFERENCES `disease_treatments` (`treatment_id`) ON DELETE CASCADE,
    INDEX `idx_chemicals_treatment` (`treatment_id`),
    INDEX `idx_chemicals_type` (`chemical_type`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 6. Crop Recommendation System Tables
-- =====================================================

-- Crop recommendations
CREATE TABLE `crop_recommendations` (
    `recommendation_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `farmer_id` VARCHAR(36) NOT NULL,
    `location` VARCHAR(100), -- Bangladesh locations
    `soil_type` VARCHAR(50), -- Soil types in Bangladesh
    `season` VARCHAR(30), -- Bengali seasons
    `land_size` DECIMAL(8, 2), -- Farm size optimization
    `land_unit` ENUM('acre', 'bigha', 'katha') DEFAULT 'bigha',
    `budget` DECIMAL(10, 2), -- BDT budget
    `recommended_crops` JSON,
    `climate_data` JSON,
    `market_analysis` JSON,
    `profitability_analysis` JSON,
    `year_plan` JSON,
    `expert_id` VARCHAR(36),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    INDEX `idx_recommendations_farmer` (`farmer_id`),
    INDEX `idx_recommendations_season` (`season`),
    INDEX `idx_recommendations_location` (`location`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Crops database
CREATE TABLE `crops_database` (
    `crop_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `crop_name` VARCHAR(50) NOT NULL, -- Bangladesh crop names
    `crop_name_bn` VARCHAR(50), -- Bengali crop names
    `season` VARCHAR(30), -- Bengali seasons
    `region` VARCHAR(50), -- Bangladesh regions
    `cost_per_bigha` DECIMAL(8, 2), -- Cost optimization
    `yield_per_bigha` DECIMAL(6, 2), -- Yield optimization
    `market_price_per_unit` DECIMAL(6, 2), -- Price per unit
    `duration_days` SMALLINT UNSIGNED, -- 0-365 days
    `profit_per_bigha` DECIMAL(8, 2), -- Profit calculation
    `difficulty_level` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    `is_quick_harvest` BOOLEAN DEFAULT FALSE,
    `cost_breakdown` JSON,
    `cultivation_plan` JSON,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_crops_name` (`crop_name`),
    INDEX `idx_crops_season` (`season`),
    INDEX `idx_crops_profit` (`profit_per_bigha`),
    INDEX `idx_crops_difficulty` (`difficulty_level`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 7. Weather and Market Information Tables
-- =====================================================

-- Weather data
CREATE TABLE `weather_data` (
    `weather_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `location` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `temperature_min` DECIMAL(5, 2),
    `temperature_max` DECIMAL(5, 2),
    `humidity` DECIMAL(5, 2),
    `rainfall` DECIMAL(8, 2),
    `wind_speed` DECIMAL(6, 2),
    `weather_condition` VARCHAR(100),
    `weather_condition_bn` VARCHAR(100),
    `forecast_data` JSON,
    `agricultural_advice` TEXT,
    `agricultural_advice_bn` TEXT,
    `season` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_location_date` (`location`, `date`),
    INDEX `idx_weather_location_date` (`location`, `date` DESC),
    INDEX `idx_weather_season` (`season`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Market prices
CREATE TABLE `market_prices` (
    `price_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `crop_name` VARCHAR(50) NOT NULL, -- Bangladesh crop names
    `crop_name_bn` VARCHAR(50), -- Bengali crop names
    `market_location` VARCHAR(100), -- Bangladesh markets
    `price_per_unit` DECIMAL(8, 2), -- BDT pricing
    `unit` VARCHAR(15), -- kg, mon, maund, etc.
    `price_date` DATE NOT NULL,
    `price_trend` ENUM('up', 'down', 'stable') DEFAULT 'stable',
    `source` VARCHAR(100), -- Price source
    `wholesale_price` DECIMAL(8, 2), -- Wholesale BDT
    `retail_price` DECIMAL(8, 2), -- Retail BDT
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_market_prices_date` (`price_date` DESC),
    INDEX `idx_market_prices_crop` (`crop_name`),
    INDEX `idx_market_prices_location` (`market_location`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Agricultural news
CREATE TABLE `agricultural_news` (
    `news_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `title` VARCHAR(300) NOT NULL, -- News titles
    `title_bn` VARCHAR(300), -- Bengali news titles
    `content` TEXT NOT NULL,
    `content_bn` TEXT,
    `summary` TEXT,
    `summary_bn` TEXT,
    `author` VARCHAR(100), -- Author names
    `source_url` VARCHAR(300), -- URL optimization
    `featured_image_url` VARCHAR(300), -- Image URL optimization
    `category` VARCHAR(50), -- News categories
    `tags` JSON,
    `is_government_notice` BOOLEAN DEFAULT FALSE,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `publish_date` TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_news_publish_date` (`publish_date` DESC),
    INDEX `idx_news_category` (`category`),
    INDEX `idx_news_featured` (`is_featured`),
    INDEX `idx_news_government` (`is_government_notice`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 8. Notification System Table
-- =====================================================

-- Notifications
CREATE TABLE `notifications` (
    `notification_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `recipient_id` VARCHAR(36) NOT NULL,
    `sender_id` VARCHAR(36),
    `notification_type` ENUM(
        'consultation_request',
        'post_interaction',
        'system',
        'marketplace',
        'diagnosis',
        'weather_alert'
    ) DEFAULT 'system',
    `title` VARCHAR(150) NOT NULL, -- Notification titles
    `message` TEXT NOT NULL,
    `related_entity_id` VARCHAR(36),
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `read_at` TIMESTAMP NULL,
    FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    INDEX `idx_notifications_recipient` (`recipient_id`, `is_read`),
    INDEX `idx_notifications_type` (`notification_type`),
    INDEX `idx_notifications_created` (`created_at` DESC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 9. System Configuration Table
-- =====================================================

-- System settings
CREATE TABLE `system_settings` (
    `setting_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `setting_key` VARCHAR(50) UNIQUE NOT NULL, -- Setting keys
    `setting_value` TEXT,
    `setting_type` ENUM(
        'string',
        'number',
        'boolean',
        'json'
    ) DEFAULT 'string',
    `description` TEXT,
    `is_public` BOOLEAN DEFAULT FALSE,
    `updated_by` VARCHAR(36),
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    INDEX `idx_settings_key` (`setting_key`),
    INDEX `idx_settings_public` (`is_public`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 10. User Session Management
-- =====================================================

-- Login sessions
CREATE TABLE `user_sessions` (
    `session_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user_id` VARCHAR(36) NOT NULL,
    `session_token` VARCHAR(255) NOT NULL,
    `device_info` TEXT,
    `ip_address` VARCHAR(45),
    `is_active` BOOLEAN DEFAULT TRUE,
    `expires_at` TIMESTAMP DEFAULT(
        CURRENT_TIMESTAMP + INTERVAL 30 DAY
    ),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_sessions_user` (`user_id`),
    INDEX `idx_sessions_token` (`session_token`),
    INDEX `idx_sessions_active` (`is_active`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Data Operator Management Tables (moved here for dependency)
-- =====================================================

-- Data operators table
CREATE TABLE `data_operators` (
    `operator_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user_id` VARCHAR(36) NOT NULL,
    `operator_code` VARCHAR(15) UNIQUE NOT NULL, -- Short operator codes
    `assigned_area` JSON, -- {districts: [], upazilas: [], unions: []}
    `department` VARCHAR(50), -- Department names
    `position` VARCHAR(50), -- Position titles
    `joining_date` DATE,
    `supervisor_id` VARCHAR(36),
    `permissions` JSON, -- {profile_verification: true, crop_verification: true, etc.}
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_active` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`supervisor_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE SET NULL,
    INDEX `idx_operator_code` (`operator_code`),
    INDEX `idx_operator_department` (`department`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Activity logs for data operator actions (referenced by procedures)
CREATE TABLE `data_operator_activity_logs` (
    `log_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `operator_id` VARCHAR(36) NOT NULL,
    `activity_type` VARCHAR(50) NOT NULL,
    `target_id` VARCHAR(36),
    `target_type` VARCHAR(50),
    `action_performed` VARCHAR(255),
    `action_details` JSON,
    `result` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`operator_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE CASCADE,
    INDEX `idx_activity_operator` (`operator_id`),
    INDEX `idx_activity_type` (`activity_type`),
    INDEX `idx_activity_created` (`created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 11. Dummy Data Insert (For Testing)
-- =====================================================

-- Marketplace category data
INSERT INTO
    `marketplace_categories` (
        `category_id`,
        `category_name`,
        `category_name_bn`,
        `description`
    )
VALUES (
        UUID(),
        'crops',
        'Crops and Vegetables',
        'All types of crops and vegetables'
    ),
    (
        UUID(),
        'machinery',
        'Machinery',
        'Agricultural machinery and equipment'
    ),
    (
        UUID(),
        'fertilizer',
        'Fertilizers and Pesticides',
        'Chemical and organic fertilizers, pesticides'
    ),
    (
        UUID(),
        'seeds',
        'Seeds and Seedlings',
        'High quality seeds and seedlings'
    ),
    (
        UUID(),
        'livestock',
        'Livestock',
        'Cattle, goats, poultry and other animals'
    ),
    (
        UUID(),
        'tools',
        'Tools',
        'Agricultural tools'
    ),
    (
        UUID(),
        'other',
        'Others',
        'Other agricultural related products'
    );

-- Post tag data
INSERT INTO
    `post_tags` (`tag_id`, `tag_name`)
VALUES (UUID(), 'rice'),
    (UUID(), 'wheat'),
    (UUID(), 'corn'),
    (UUID(), 'tomato'),
    (UUID(), 'potato'),
    (UUID(), 'onion'),
    (UUID(), 'disease'),
    (UUID(), 'fertilizer'),
    (UUID(), 'pesticide'),
    (UUID(), 'organic_farming'),
    (UUID(), 'modern_farming'),
    (UUID(), 'market_price'),
    (UUID(), 'weather'),
    (UUID(), 'advice'),
    (UUID(), 'question');

-- Sample data operator users
INSERT INTO
    `users` (
        `user_id`,
        `email`,
        `password_hash`,
        `user_type`,
        `phone`,
        `is_verified`,
        `is_active`
    )
VALUES (
        UUID(),
        'operator1@dae.gov.bd',
        '$2a$10$hashedpassword1',
        'data_operator',
        '+8801712345678',
        TRUE,
        TRUE
    ),
    (
        UUID(),
        'operator2@dae.gov.bd',
        '$2a$10$hashedpassword2',
        'data_operator',
        '+8801812345678',
        TRUE,
        TRUE
    ),
    (
        UUID(),
        'operator3@dae.gov.bd',
        '$2a$10$hashedpassword3',
        'data_operator',
        '+8801912345678',
        TRUE,
        TRUE
    );

-- Sample data operator profiles
INSERT INTO
    `user_profiles` (
        `profile_id`,
        `user_id`,
        `full_name`,
        `nid_number`,
        `date_of_birth`,
        `father_name`,
        `mother_name`,
        `address`,
        `district`,
        `upazila`,
        `division`,
        `verification_status`
    )
SELECT
    UUID(),
    u.`user_id`,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'মোহাম্মদ রাহিম উদ্দিন'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'নাসির আহমেদ'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'সালমা খাতুন'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN '1234567890123'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN '2345678901234'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN '3456789012345'
    END,
    '1990-01-01',
    'আব্দুল করিম',
    'রহিমা বেগম',
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'কুমিল্লা সদর, কুমিল্লা'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট সদর, সিলেট'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর সদর, রংপুর'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'কুমিল্লা'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'কুমিল্লা সদর'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট সদর'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর সদর'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'চট্টগ্রাম'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর'
    END,
    'verified'
FROM `users` u
WHERE
    u.`user_type` = 'data_operator';

-- Sample data operators
INSERT INTO
    `data_operators` (
        `operator_id`,
        `user_id`,
        `operator_code`,
        `assigned_area`,
        `department`,
        `position`,
        `joining_date`,
        `permissions`
    )
SELECT
    UUID(),
    u.`user_id`,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'DAO-CTG-001'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'DAO-SYL-002'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'DAO-RNG-003'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN '{"districts": ["কুমিল্লা", "চাঁদপুর"], "upazilas": ["কুমিল্লা সদর", "দাউদকান্দি"], "unions": ["রামপুর", "কুটিচাঁদপুর"]}'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN '{"districts": ["সিলেট"], "upazilas": ["সিলেট সদর", "ওসমানীনগর"], "unions": ["খাদিমনগর", "জালালাবাদ"]}'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN '{"districts": ["রংপুর"], "upazilas": ["রংপুর সদর", "গংগাচড়া"], "unions": ["তাজহাট", "কোলকোন্দ"]}'
    END,
    'কৃষি সম্প্রসারণ অধিদপ্তর',
    'সহকারী কৃষি কর্মকর্তা',
    '2023-01-01',
    '{"profile_verification": true, "crop_verification": true, "field_data_collection": true, "farmer_registration": true, "social_feed_moderation": true, "report_generation": true}'
FROM `users` u
WHERE
    u.`user_type` = 'data_operator';

-- Crops database
INSERT INTO
    `crops_database` (
        `crop_id`,
        `crop_name`,
        `crop_name_bn`,
        `season`,
        `region`,
        `cost_per_bigha`,
        `yield_per_bigha`,
        `market_price_per_unit`,
        `duration_days`,
        `profit_per_bigha`,
        `difficulty_level`,
        `is_quick_harvest`
    )
VALUES (
        UUID(),
        'Rice',
        'Rice',
        'Rabi',
        'All regions',
        20000,
        25,
        28,
        120,
        45000,
        'easy',
        FALSE
    ),
    (
        UUID(),
        'Wheat',
        'Wheat',
        'Rabi',
        'Northern region',
        15000,
        15,
        25,
        110,
        22500,
        'easy',
        TRUE
    ),
    (
        UUID(),
        'Corn',
        'Corn',
        'Kharif',
        'All regions',
        18000,
        20,
        22,
        100,
        26000,
        'medium',
        TRUE
    ),
    (
        UUID(),
        'Potato',
        'Potato',
        'Rabi',
        'Northern region',
        25000,
        150,
        15,
        90,
        97500,
        'medium',
        FALSE
    ),
    (
        UUID(),
        'Tomato',
        'Tomato',
        'Rabi',
        'All regions',
        30000,
        80,
        40,
        75,
        102000,
        'hard',
        FALSE
    ),
    (
        UUID(),
        'Onion',
        'Onion',
        'Rabi',
        'Southern region',
        22000,
        60,
        35,
        85,
        88000,
        'medium',
        FALSE
    );

-- System settings
INSERT INTO
    `system_settings` (
        `setting_id`,
        `setting_key`,
        `setting_value`,
        `setting_type`,
        `description`,
        `is_public`
    )
VALUES (
        UUID(),
        'app_name',
        'Langol Krishi Sahayak',
        'string',
        'Application name',
        TRUE
    ),
    (
        UUID(),
        'app_version',
        '1.0.0',
        'string',
        'Application version',
        TRUE
    ),
    (
        UUID(),
        'max_upload_size',
        '10485760',
        'number',
        'Maximum upload size (bytes)',
        FALSE
    ),
    (
        UUID(),
        'consultation_fee_min',
        '100',
        'number',
        'Minimum consultation fee',
        TRUE
    ),
    (
        UUID(),
        'consultation_fee_max',
        '5000',
        'number',
        'Maximum consultation fee',
        TRUE
    ),
    (
        UUID(),
        'enable_notifications',
        'true',
        'boolean',
        'Enable/disable notifications',
        FALSE
    ),
    (
        UUID(),
        'default_language',
        'bn',
        'string',
        'Default language',
        TRUE
    ),
    (
        UUID(),
        'supported_languages',
        '["bn", "en"]',
        'json',
        'Supported languages',
        TRUE
    );

-- =====================================================
-- 12. Triggers and Functions
-- =====================================================

-- Post likes count update trigger
DELIMITER /
/

CREATE TRIGGER `update_post_likes_count`
AFTER INSERT ON `post_likes`
FOR EACH ROW
BEGIN
    UPDATE `posts`
    SET `likes_count` = (
        SELECT COUNT(*) FROM `post_likes`
        WHERE `post_id` = NEW.`post_id`
    )
    WHERE `post_id` = NEW.`post_id`;
END
/
/

DELIMITER /
/

-- Post likes count delete trigger
DELIMITER /
/

CREATE TRIGGER `update_post_likes_count_delete`
AFTER DELETE ON `post_likes`
FOR EACH ROW
BEGIN
    UPDATE `posts`
    SET `likes_count` = (
        SELECT COUNT(*) FROM `post_likes`
        WHERE `post_id` = OLD.`post_id`
    )
    WHERE `post_id` = OLD.`post_id`;
END
/
/

DELIMITER /
/

-- Comment count update trigger
DELIMITER /
/

CREATE TRIGGER `update_post_comments_count`
AFTER INSERT ON `comments`
FOR EACH ROW
BEGIN
    UPDATE `posts`
    SET `comments_count` = (
        SELECT COUNT(*) FROM `comments`
        WHERE `post_id` = NEW.`post_id` AND `is_deleted` = FALSE
    )
    WHERE `post_id` = NEW.`post_id`;
END
/
/

DELIMITER /
/

-- Expert rating update trigger
DELIMITER /
/

CREATE TRIGGER `update_expert_rating`
AFTER INSERT ON `consultation_responses`
FOR EACH ROW
BEGIN
    UPDATE `expert_qualifications`
    SET `total_consultations` = `total_consultations` + 1
    WHERE `user_id` = NEW.`expert_id`;
END
/
/

DELIMITER /
/

-- =====================================================
-- 13. Views (For Reporting & Dashboard)
-- =====================================================

-- Active users view - Perfect for admin dashboard
CREATE VIEW `active_users_view` AS
SELECT
    u.`user_id`,
    u.`user_type`,
    up.`full_name` AS `name`,
    up.`district`,
    up.`upazila`,
    up.`division`,
    u.`phone`,
    u.`is_verified`,
    u.`created_at`,
    TIMESTAMPDIFF(DAY, u.`created_at`, NOW()) AS `days_since_registration`
FROM `users` u
    LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
WHERE
    u.`is_active` = TRUE
ORDER BY u.`created_at` DESC;

-- Farmer dashboard view - Complete farmer profile info
CREATE VIEW `farmer_dashboard_view` AS
SELECT
    u.`user_id`,
    up.`full_name` AS `farmer_name`,
    u.`phone` AS `mobile`, -- Fixed: phone is in users table
    up.`district`,
    up.`upazila`,
    fd.`farm_size`,
    fd.`farm_type` AS `primary_crops`,
    fd.`experience_years`,
    fd.`farm_type` AS `farming_type`,
    COUNT(DISTINCT c.`consultation_id`) AS `total_consultations`,
    COUNT(DISTINCT p.`post_id`) AS `total_posts`,
    u.`created_at`
FROM
    `users` u
    LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
    LEFT JOIN `farmer_details` fd ON u.`user_id` = fd.`user_id`
    LEFT JOIN `consultations` c ON u.`user_id` = c.`farmer_id`
    LEFT JOIN `posts` p ON u.`user_id` = p.`author_id`
WHERE
    u.`user_type` = 'farmer'
    AND u.`is_active` = TRUE
GROUP BY
    u.`user_id`,
    up.`full_name`,
    u.`phone`, -- Fixed: phone is in users table
    up.`district`,
    up.`upazila`,
    fd.`farm_size`,
    fd.`primary_crops`,
    fd.`experience_years`,
    fd.`farming_type`,
    u.`created_at`;

-- Expert analytics view - Expert performance metrics
CREATE VIEW `expert_analytics_view` AS
SELECT
    u.`user_id`,
    up.`full_name` AS `expert_name`,
    eq.`qualification`,
    eq.`specialization`,
    eq.`experience_years`,
    eq.`consultation_fee`,
    eq.`rating`,
    eq.`total_consultations`,
    COUNT(DISTINCT cr.`response_id`) AS `total_responses`,
    NULL AS `avg_response_rating`,
    up.`district` AS `location`,
    u.`created_at`
FROM
    `users` u
    LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
    LEFT JOIN `expert_qualifications` eq ON u.`user_id` = eq.`user_id`
    LEFT JOIN `consultation_responses` cr ON u.`user_id` = cr.`expert_id`
WHERE
    u.`user_type` = 'expert'
    AND u.`is_active` = TRUE
GROUP BY
    u.`user_id`,
    up.`full_name`,
    eq.`qualification`,
    eq.`specialization`,
    eq.`experience_years`,
    eq.`consultation_fee`,
    eq.`rating`,
    eq.`total_consultations`,
    up.`district`,
    u.`created_at`;

-- Marketplace trends view - Market analysis
CREATE VIEW `marketplace_trends_view` AS
SELECT
    mc.`category_name` AS `category`,
    mc.`category_name_bn` AS `category_bangla`,
    COUNT(ml.`listing_id`) AS `total_listings`,
    COUNT(
        CASE
            WHEN ml.`status` = 'active' THEN 1
        END
    ) AS `active_listings`,
    COUNT(
        CASE
            WHEN ml.`status` = 'sold' THEN 1
        END
    ) AS `sold_listings`,
    AVG(ml.`price`) AS `avg_price`,
    MIN(ml.`price`) AS `min_price`,
    MAX(ml.`price`) AS `max_price`,
    SUM(ml.`views_count`) AS `total_views`,
    AVG(ml.`views_count`) AS `avg_views_per_listing`
FROM
    `marketplace_categories` mc
    LEFT JOIN `marketplace_listings` ml ON mc.`category_id` = ml.`category_id`
WHERE
    mc.`is_active` = TRUE
GROUP BY
    mc.`category_id`,
    mc.`category_name`,
    mc.`category_name_bn`
ORDER BY `total_listings` DESC;

-- Popular posts view - Enhanced social media analytics
CREATE VIEW `popular_posts_view` AS
SELECT
    p.`post_id`,
    SUBSTRING(p.`content`, 1, 100) AS `content_preview`,
    p.`post_type`,
    p.`likes_count`,
    p.`comments_count`,
    p.`shares_count`,
    p.`views_count`,
    (
        p.`likes_count` + p.`comments_count` + p.`shares_count`
    ) AS `engagement_score`,
    up.`full_name` AS `author_name`,
    up.`district` AS `author_location`,
    u.`user_type` AS `author_type`,
    p.`created_at`,
    TIMESTAMPDIFF(HOUR, p.`created_at`, NOW()) AS `hours_ago`
FROM
    `posts` p
    JOIN `users` u ON p.`author_id` = u.`user_id`
    LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
WHERE
    p.`is_deleted` = FALSE
    AND p.`is_reported` = FALSE
ORDER BY `engagement_score` DESC, p.`created_at` DESC;

-- Consultation status view - Real-time consultation tracking
CREATE VIEW `consultation_status_view` AS
SELECT
    c.`consultation_id`,
    c.`topic`,
    c.`crop_type`,
    c.`priority`,
    c.`status`,
    c.`consultation_fee`,
    farmer.`full_name` AS `farmer_name`,
    u_farmer.`phone` AS `farmer_phone`, -- Fixed: phone is in users table
    farmer.`district` AS `farmer_district`,
    expert.`full_name` AS `expert_name`,
    u_expert.`phone` AS `expert_phone`, -- Fixed: phone is in users table
    eq.`specialization` AS `expert_specialization`,
    c.`created_at`,
    c.`updated_at`,
    TIMESTAMPDIFF(HOUR, c.`created_at`, NOW()) AS `hours_pending`,
    CASE
        WHEN c.`status` = 'pending'
        AND TIMESTAMPDIFF(HOUR, c.`created_at`, NOW()) > 24 THEN 'Urgent'
        WHEN c.`status` = 'pending'
        AND TIMESTAMPDIFF(HOUR, c.`created_at`, NOW()) > 12 THEN 'High'
        ELSE 'Normal'
    END AS `priority_level`
FROM
    `consultations` c
    JOIN `users` u_farmer ON c.`farmer_id` = u_farmer.`user_id`
    LEFT JOIN `user_profiles` farmer ON u_farmer.`user_id` = farmer.`user_id`
    LEFT JOIN `users` u_expert ON c.`expert_id` = u_expert.`user_id`
    LEFT JOIN `user_profiles` expert ON u_expert.`user_id` = expert.`user_id`
    LEFT JOIN `expert_qualifications` eq ON u_expert.`user_id` = eq.`user_id`
ORDER BY FIELD(
        c.`status`, 'pending', 'in_progress', 'resolved', 'cancelled'
    ), c.`created_at` DESC;

-- Active marketplace view - Enhanced marketplace listings
CREATE VIEW `active_marketplace_view` AS
SELECT
    ml.`listing_id`,
    ml.`title`,
    ml.`price`,
    ml.`listing_type`,
    ml.`location`,
    mc.`category_name_bn` AS `category`,
    up.`full_name` AS `seller_name`,
    u.`phone` AS `seller_phone`, -- Fixed: phone is in users table
    up.`district` AS `seller_district`,
    ml.`views_count`,
    ml.`saves_count`,
    ml.`contacts_count`,
    ml.`created_at`,
    TIMESTAMPDIFF(
        DAY,
        ml.`created_at`,
        ml.`expires_at`
    ) AS `days_until_expiry`,
    CASE
        WHEN TIMESTAMPDIFF(DAY, NOW(), ml.`expires_at`) < 7 THEN 'Expiring Soon'
        WHEN ml.`views_count` > 100 THEN 'Popular'
        WHEN ml.`saves_count` > 10 THEN 'High Interest'
        ELSE 'Normal'
    END AS `listing_status`
FROM
    `marketplace_listings` ml
    JOIN `users` u ON ml.`seller_id` = u.`user_id`
    LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
    LEFT JOIN `marketplace_categories` mc ON ml.`category_id` = mc.`category_id`
WHERE
    ml.`status` = 'active'
ORDER BY ml.`created_at` DESC;

-- Data operator workload view - For monitoring operator performance
CREATE VIEW `data_operator_workload_view` AS
SELECT
    do.`operator_id`,
    up.`full_name` AS `operator_name`,
    do.`operator_code`,
    do.`department`,
    JSON_UNQUOTE(
        JSON_EXTRACT(
            do.`assigned_area`,
            '$.districts[0]'
        )
    ) AS `primary_district`,
    COUNT(
        DISTINCT pvr.`verification_id`
    ) AS `profile_verifications`,
    COUNT(
        DISTINCT cvr.`crop_verification_id`
    ) AS `crop_verifications`,
    COUNT(DISTINCT sfr.`report_id`) AS `social_reports_handled`,
    do.`last_active`,
    TIMESTAMPDIFF(DAY, do.`last_active`, NOW()) AS `days_since_active`,
    CASE
        WHEN TIMESTAMPDIFF(DAY, do.`last_active`, NOW()) > 7 THEN 'Inactive'
        WHEN (
            COUNT(
                DISTINCT pvr.`verification_id`
            ) + COUNT(
                DISTINCT cvr.`crop_verification_id`
            )
        ) > 50 THEN 'High Load'
        ELSE 'Normal'
    END AS `workload_status`
FROM
    `data_operators` do
    LEFT JOIN `users` u ON do.`user_id` = u.`user_id`
    LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
    LEFT JOIN `profile_verification_records` pvr ON do.`operator_id` = pvr.`operator_id`
    LEFT JOIN `crop_verification_records` cvr ON do.`operator_id` = cvr.`operator_id`
    LEFT JOIN `social_feed_reports` sfr ON do.`operator_id` = sfr.`assigned_operator`
WHERE
    do.`is_active` = TRUE
GROUP BY
    do.`operator_id`,
    up.`full_name`,
    do.`operator_code`,
    do.`department`,
    do.`last_active`,
    primary_district
ORDER BY `workload_status` DESC, do.`last_active` DESC;

-- Market price trends view - Price analysis for crops (MariaDB compatible)
CREATE VIEW `market_price_trends_view` AS
SELECT
    mp.`crop_name`,
    mp.`crop_name_bn`,
    mp.`market_location`,
    mp.`unit`,
    mp.`price_per_unit` AS `current_price`,
    mp.`wholesale_price`,
    mp.`retail_price`,
    mp.`price_trend`,
    mp.`price_date`,
    (
        SELECT mp2.`price_per_unit`
        FROM `market_prices` mp2
        WHERE
            mp2.`crop_name` = mp.`crop_name`
            AND mp2.`market_location` = mp.`market_location`
            AND mp2.`price_date` < mp.`price_date`
        ORDER BY mp2.`price_date` DESC
        LIMIT 1
    ) AS `previous_price`,
    CASE
        WHEN (
            SELECT mp2.`price_per_unit`
            FROM `market_prices` mp2
            WHERE
                mp2.`crop_name` = mp.`crop_name`
                AND mp2.`market_location` = mp.`market_location`
                AND mp2.`price_date` < mp.`price_date`
            ORDER BY mp2.`price_date` DESC
            LIMIT 1
        ) IS NOT NULL THEN ROUND(
            (
                (
                    mp.`price_per_unit` - (
                        SELECT mp2.`price_per_unit`
                        FROM `market_prices` mp2
                        WHERE
                            mp2.`crop_name` = mp.`crop_name`
                            AND mp2.`market_location` = mp.`market_location`
                            AND mp2.`price_date` < mp.`price_date`
                        ORDER BY mp2.`price_date` DESC
                        LIMIT 1
                    )
                ) /

(
                    SELECT mp2.`price_per_unit`
                    FROM `market_prices` mp2
                    WHERE
                        mp2.`crop_name` = mp.`crop_name`
                        AND mp2.`market_location` = mp.`market_location`
                        AND mp2.`price_date` < mp.`price_date`
                    ORDER BY mp2.`price_date` DESC
                    LIMIT 1
                )
            ) * 100,
            2
        )
        ELSE 0
    END AS `price_change_percentage`,
    DATEDIFF(NOW(), mp.`price_date`) AS `days_old`
FROM `market_prices` mp
WHERE
    mp.`price_date` >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY mp.`crop_name`, mp.`market_location`, mp.`price_date` DESC;

-- =====================================================
-- 14. Index Optimization
-- =====================================================

-- Full-text indexes for search optimization
ALTER TABLE `posts` ADD FULLTEXT (`content`);

ALTER TABLE `marketplace_listings`
ADD FULLTEXT (`title`, `description`);

ALTER TABLE `agricultural_news` ADD FULLTEXT (`title`, `content`);

-- Composite indexes
CREATE INDEX `idx_posts_type_created` ON `posts` (
    `post_type`,
    `created_at` DESC
);

CREATE INDEX `idx_listings_status_category` ON `marketplace_listings` (`status`, `category_id`);

CREATE INDEX `idx_consultations_status_priority` ON `consultations` (`status`, `priority`);

-- =====================================================
-- 15. Data Operator Management Tables (continued)
-- =====================================================

-- Profile verification records
CREATE TABLE `profile_verification_records` (
    `verification_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `farmer_id` VARCHAR(36) NOT NULL,
    `operator_id` VARCHAR(36) NOT NULL,
    `verification_type` ENUM(
        'nid',
        'profile',
        'documents',
        'full'
    ) DEFAULT 'full',
    `verification_status` ENUM(
        'pending',
        'in_review',
        'verified',
        'rejected',
        'need_more_info'
    ) DEFAULT 'pending',
    `verification_notes` TEXT,
    `documents_checked` JSON, -- ['nid_front', 'nid_back', 'land_documents', etc.]
    `discrepancies_found` JSON, -- List of issues found
    `verification_date` TIMESTAMP NULL,
    `rejection_reason` TEXT,
    `additional_documents_required` JSON,
    `priority_level` ENUM(
        'low',
        'medium',
        'high',
        'urgent'
    ) DEFAULT 'medium',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`operator_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE CASCADE,
    INDEX `idx_verification_status` (`verification_status`),
    INDEX `idx_verification_farmer` (`farmer_id`),
    INDEX `idx_verification_operator` (`operator_id`),
    INDEX `idx_verification_priority` (`priority_level`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Crop verification records
CREATE TABLE `crop_verification_records` (
    `crop_verification_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `farmer_id` VARCHAR(36) NOT NULL,
    `operator_id` VARCHAR(36) NOT NULL,
    `crop_type` VARCHAR(100) NOT NULL,
    `land_area` DECIMAL(10, 2) NOT NULL,
    `land_area_unit` ENUM('acre', 'bigha', 'katha') DEFAULT 'bigha',
    `location_details` JSON, -- {village, union, upazila, district, gps_coordinates}
    `land_documents` JSON, -- List of land document URLs
    `crop_photos` JSON, -- List of crop photo URLs
    `sowing_date` DATE,
    `expected_harvest_date` DATE,
    `estimated_yield` DECIMAL(10, 2),
    `yield_unit` VARCHAR(20) DEFAULT 'mon',
    `verification_status` ENUM(
        'pending',
        'in_review',
        'verified',
        'rejected',
        'need_more_info'
    ) DEFAULT 'pending',
    `verification_notes` TEXT,
    `field_visit_required` BOOLEAN DEFAULT FALSE,
    `field_visit_date` DATE NULL,
    `verification_date` TIMESTAMP NULL,
    `rejection_reason` TEXT,
    `gps_verified` BOOLEAN DEFAULT FALSE,
    `documents_verified` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`operator_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE CASCADE,
    INDEX `idx_crop_verification_status` (`verification_status`),
    INDEX `idx_crop_verification_farmer` (`farmer_id`),
    INDEX `idx_crop_verification_operator` (`operator_id`),
    INDEX `idx_crop_verification_type` (`crop_type`)
    -- Index on JSON column removed to maintain MySQL 8.0 compatibility. Consider functional indexes if needed.
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Field data collection
CREATE TABLE `field_data_collection` (
    `report_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `operator_id` VARCHAR(36) NOT NULL,
    `farmer_id` VARCHAR(36),
    `report_date` DATE NOT NULL,
    `union_name` VARCHAR(100),
    `village_name` VARCHAR(100),
    `farmer_name` VARCHAR(255),
    `farmer_phone` VARCHAR(20),
    `crop_type` VARCHAR(100),
    `land_area` DECIMAL(10, 2),
    `land_area_unit` ENUM('acre', 'bigha', 'katha') DEFAULT 'bigha',
    `crop_health_status` ENUM(
        'excellent',
        'good',
        'fair',
        'poor',
        'critical'
    ) DEFAULT 'good',
    `diseases_found` JSON, -- List of diseases identified
    `fertilizers_used` JSON, -- [{name, quantity, application_date}]
    `pesticides_used` JSON, -- [{name, quantity, application_date}]
    `gps_coordinates` JSON, -- {latitude, longitude}
    `photos` JSON, -- List of photo URLs
    `weather_conditions` JSON, -- {temperature, humidity, rainfall, etc.}
    `soil_conditions` JSON, -- {ph, moisture, nutrients, etc.}
    `market_price_per_unit` DECIMAL(10, 2),
    `price_currency` VARCHAR(3) DEFAULT 'BDT',
    `notes` TEXT,
    `recommendations` TEXT,
    `report_status` ENUM(
        'draft',
        'submitted',
        'processed',
        'archived'
    ) DEFAULT 'draft',
    `submitted_at` TIMESTAMP NULL,
    `processed_at` TIMESTAMP NULL,
    `processed_by` VARCHAR(36),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`operator_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE CASCADE,
    FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    FOREIGN KEY (`processed_by`) REFERENCES `data_operators` (`operator_id`) ON DELETE SET NULL,
    INDEX `idx_field_report_operator` (`operator_id`),
    INDEX `idx_field_report_date` (`report_date`),
    INDEX `idx_field_report_status` (`report_status`),
    INDEX `idx_field_report_location` (`union_name`, `village_name`),
    INDEX `idx_field_report_crop` (`crop_type`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Social feed report management
CREATE TABLE `social_feed_reports` (
    `report_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `post_id` VARCHAR(36),
    `comment_id` VARCHAR(36),
    `reported_by` VARCHAR(36) NOT NULL,
    `report_type` ENUM(
        'spam',
        'inappropriate_content',
        'false_information',
        'harassment',
        'copyright_violation',
        'other'
    ) NOT NULL,
    `report_description` TEXT,
    `report_status` ENUM(
        'pending',
        'in_review',
        'resolved',
        'dismissed'
    ) DEFAULT 'pending',
    `assigned_operator` VARCHAR(36),
    `operator_notes` TEXT,
    `action_taken` ENUM(
        'no_action',
        'warning_issued',
        'content_removed',
        'user_suspended',
        'user_banned'
    ),
    `resolved_at` TIMESTAMP NULL,
    `priority_level` ENUM(
        'low',
        'medium',
        'high',
        'urgent'
    ) DEFAULT 'medium',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE SET NULL,
    FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE SET NULL,
    FOREIGN KEY (`reported_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`assigned_operator`) REFERENCES `data_operators` (`operator_id`) ON DELETE SET NULL,
    INDEX `idx_social_report_status` (`report_status`),
    INDEX `idx_social_report_type` (`report_type`),
    INDEX `idx_social_report_operator` (`assigned_operator`),
    INDEX `idx_social_report_priority` (`priority_level`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Farmer registration applications
CREATE TABLE `farmer_registration_applications` (
    `application_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `operator_id` VARCHAR(36) NOT NULL,
    `applicant_name` VARCHAR(255) NOT NULL,
    `nid_number` VARCHAR(17) UNIQUE NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255),
    `address` TEXT,
    `district` VARCHAR(100),
    `upazila` VARCHAR(100),
    `farm_size` DECIMAL(10, 2),
    `farm_size_unit` ENUM('acre', 'bigha', 'katha') DEFAULT 'bigha',
    `application_status` ENUM(
        'pending',
        'approved',
        'rejected'
    ) DEFAULT 'pending',
    `notes` TEXT,
    `approved_at` TIMESTAMP NULL,
    `created_user_id` VARCHAR(36), -- Links to users table when approved
    `created_profile_id` VARCHAR(36), -- Links to user_profiles table when approved
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`operator_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE CASCADE,
    FOREIGN KEY (`created_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    FOREIGN KEY (`created_profile_id`) REFERENCES `user_profiles` (`profile_id`) ON DELETE SET NULL,
    INDEX `idx_registration_operator` (`operator_id`),
    INDEX `idx_registration_status` (`application_status`),
    INDEX `idx_registration_nid` (`nid_number`),
    INDEX `idx_registration_user` (`created_user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 16. Data Operator Views
-- =====================================================

-- Data operator dashboard view
CREATE VIEW `data_operator_dashboard_view` AS
SELECT do.`operator_id`, do.`operator_code`, up.`full_name` AS `operator_name`, do.`department`, do.`position`, do.`assigned_area`,

-- Profile verification stats
(
    SELECT COUNT(*)
    FROM
        `profile_verification_records` pvr
    WHERE
        pvr.`operator_id` = do.`operator_id`
        AND pvr.`verification_status` = 'pending'
) AS `pending_profile_verifications`,

-- Crop verification stats
(
    SELECT COUNT(*)
    FROM `crop_verification_records` cvr
    WHERE
        cvr.`operator_id` = do.`operator_id`
        AND cvr.`verification_status` = 'pending'
) AS `pending_crop_verifications`,

-- Field reports stats
(
    SELECT COUNT(*)
    FROM `field_data_collection` fdc
    WHERE
        fdc.`operator_id` = do.`operator_id`
        AND fdc.`report_status` = 'draft'
) AS `draft_field_reports`,

-- Registration applications stats
(
    SELECT COUNT(*)
    FROM
        `farmer_registration_applications` fra
    WHERE
        fra.`operator_id` = do.`operator_id`
        AND fra.`application_status` = 'pending'
) AS `pending_registrations`,

-- Social feed reports stats
(
    SELECT COUNT(*)
    FROM `social_feed_reports` sfr
    WHERE
        sfr.`assigned_operator` = do.`operator_id`
        AND sfr.`report_status` = 'pending'
) AS `pending_social_reports`,

do.`last_active`,
    do.`is_active`
FROM `data_operators` do
LEFT JOIN `users` u ON do.`user_id` = u.`user_id`
LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
WHERE do.`is_active` = TRUE;

-- Pending verifications view
CREATE VIEW `pending_verifications_view` AS
SELECT
    'profile' AS `verification_type`,
    pvr.`verification_id` AS `id`,
    pvr.`farmer_id`,
    fp.`full_name` AS `farmer_name`,
    fu.`phone`,
    fp.`district`,
    pvr.`verification_status`,
    pvr.`priority_level`,
    pvr.`created_at`,
    op.`full_name` AS `operator_name`
FROM
    `profile_verification_records` pvr
    JOIN `users` fu ON pvr.`farmer_id` = fu.`user_id`
    LEFT JOIN `user_profiles` fp ON fu.`user_id` = fp.`user_id`
    LEFT JOIN `data_operators` do ON pvr.`operator_id` = do.`operator_id`
    LEFT JOIN `users` ou ON do.`user_id` = ou.`user_id`
    LEFT JOIN `user_profiles` op ON ou.`user_id` = op.`user_id`
WHERE
    pvr.`verification_status` IN (
        'pending',
        'in_review',
        'need_more_info'
    )
UNION ALL
SELECT
    'crop' AS `verification_type`,
    cvr.`crop_verification_id` AS `id`,
    cvr.`farmer_id`,
    cp.`full_name` AS `farmer_name`,
    cu.`phone`,
    cp.`district`,
    cvr.`verification_status`,
    'medium' AS `priority_level`,
    cvr.`created_at`,
    cop.`full_name` AS `operator_name`
FROM
    `crop_verification_records` cvr
    JOIN `users` cu ON cvr.`farmer_id` = cu.`user_id`
    LEFT JOIN `user_profiles` cp ON cu.`user_id` = cp.`user_id`
    LEFT JOIN `data_operators` cdo ON cvr.`operator_id` = cdo.`operator_id`
    LEFT JOIN `users` cou ON cdo.`user_id` = cou.`user_id`
    LEFT JOIN `user_profiles` cop ON cou.`user_id` = cop.`user_id`
WHERE
    cvr.`verification_status` IN (
        'pending',
        'in_review',
        'need_more_info'
    );

-- Field data collection view
CREATE VIEW `field_data_summary_view` AS
SELECT
    fdc.`report_id`,
    fdc.`report_date`,
    fdc.`union_name`,
    fdc.`village_name`,
    fdc.`farmer_name`,
    fdc.`crop_type`,
    fdc.`land_area`,
    fdc.`land_area_unit`,
    fdc.`crop_health_status`,
    fdc.`market_price_per_unit`,
    fdc.`report_status`,
    op.`full_name` AS `operator_name`,
    op.`district` AS `operator_district`
FROM
    `field_data_collection` fdc
    LEFT JOIN `data_operators` do ON fdc.`operator_id` = do.`operator_id`
    LEFT JOIN `users` u ON do.`user_id` = u.`user_id`
    LEFT JOIN `user_profiles` op ON u.`user_id` = op.`user_id`
ORDER BY fdc.`report_date` DESC;

-- Farmer registration applications view
CREATE VIEW `farmer_registration_summary_view` AS
SELECT
    fra.`application_id`,
    fra.`applicant_name`,
    fra.`nid_number`,
    fra.`phone`,
    fra.`district`,
    fra.`upazila`,
    fra.`union_name`,
    fra.`village_name`,
    fra.`farm_size`,
    fra.`farm_size_unit`,
    fra.`application_status`,
    fra.`created_at`,
    op.`full_name` AS `operator_name`,
    app_op.`full_name` AS `approved_by_name`
FROM
    `farmer_registration_applications` fra
    LEFT JOIN `data_operators` do ON fra.`operator_id` = do.`operator_id`
    LEFT JOIN `users` u ON do.`user_id` = u.`user_id`
    LEFT JOIN `user_profiles` op ON u.`user_id` = op.`user_id`
    LEFT JOIN `data_operators` app_do ON fra.`approved_by` = app_do.`operator_id`
    LEFT JOIN `users` app_u ON app_do.`user_id` = app_u.`user_id`
    LEFT JOIN `user_profiles` app_op ON app_u.`user_id` = app_op.`user_id`
ORDER BY fra.`created_at` DESC;

-- Data operator performance view
CREATE VIEW `data_operator_performance_view` AS
SELECT do.`operator_id`, do.`operator_code`, up.`full_name` AS `operator_name`, do.`department`,

-- Monthly stats
COALESCE(
    SUM(dow.`profiles_verified`),
    0
) AS `total_profiles_verified`,
COALESCE(SUM(dow.`crops_verified`), 0) AS `total_crops_verified`,
COALESCE(
    SUM(dow.`field_reports_submitted`),
    0
) AS `total_field_reports`,
COALESCE(
    SUM(dow.`farmers_registered`),
    0
) AS `total_farmers_registered`,
COALESCE(
    SUM(dow.`social_posts_moderated`),
    0
) AS `total_posts_moderated`,

-- Performance metrics
COALESCE(
    AVG(dow.`efficiency_score`),
    0
) AS `avg_efficiency_score`,
COALESCE(SUM(dow.`working_hours`), 0) AS `total_working_hours`,
COALESCE(SUM(dow.`overtime_hours`), 0) AS `total_overtime_hours`,
COUNT(DISTINCT dow.`work_date`) AS `total_working_days`,
do.`last_active`
FROM
    `data_operators` do
    LEFT JOIN `users` u ON do.`user_id` = u.`user_id`
    LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
    LEFT JOIN `data_operator_workload` dow ON do.`operator_id` = dow.`operator_id`
    AND dow.`work_date` >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
WHERE
    do.`is_active` = TRUE
GROUP BY
    do.`operator_id`,
    do.`operator_code`,
    up.`full_name`,
    do.`department`,
    do.`last_active`;

-- Workload tracking table for data operators
CREATE TABLE IF NOT EXISTS `data_operator_workload` (
    `workload_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `operator_id` VARCHAR(36) NOT NULL,
    `work_date` DATE NOT NULL,
    `profiles_verified` INT DEFAULT 0,
    `crops_verified` INT DEFAULT 0,
    `field_reports_submitted` INT DEFAULT 0,
    `farmers_registered` INT DEFAULT 0,
    `social_posts_moderated` INT DEFAULT 0,
    `efficiency_score` DECIMAL(5, 2) DEFAULT 0.00,
    `working_hours` DECIMAL(5, 2) DEFAULT 0.00,
    `overtime_hours` DECIMAL(5, 2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uniq_operator_workdate` (`operator_id`, `work_date`),
    FOREIGN KEY (`operator_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE CASCADE,
    INDEX `idx_workload_operator_date` (`operator_id`, `work_date`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Social feed reports management view
CREATE VIEW `social_feed_reports_view` AS
SELECT sfr.`report_id`, sfr.`report_type`, sfr.`report_description`, sfr.`report_status`, sfr.`priority_level`, sfr.`action_taken`,

-- Reporter info
rp.`full_name` AS `reporter_name`, ru.`phone` AS `reporter_phone`,

-- Post/comment info
COALESCE(p.`content`, c.`content`) AS `reported_content`,
CASE
    WHEN sfr.`post_id` IS NOT NULL THEN 'post'
    WHEN sfr.`comment_id` IS NOT NULL THEN 'comment'
    ELSE 'unknown'
END AS `content_type`,

-- Assigned operator info
op.`full_name` AS `assigned_operator_name`,
sfr.`created_at`,
sfr.`resolved_at`
FROM
    `social_feed_reports` sfr
    LEFT JOIN `users` ru ON sfr.`reported_by` = ru.`user_id`
    LEFT JOIN `user_profiles` rp ON ru.`user_id` = rp.`user_id`
    LEFT JOIN `posts` p ON sfr.`post_id` = p.`post_id`
    LEFT JOIN `comments` c ON sfr.`comment_id` = c.`comment_id`
    LEFT JOIN `data_operators` do ON sfr.`assigned_operator` = do.`operator_id`
    LEFT JOIN `users` ou ON do.`user_id` = ou.`user_id`
    LEFT JOIN `user_profiles` op ON ou.`user_id` = op.`user_id`
ORDER BY sfr.`priority_level` DESC, sfr.`created_at` DESC;

-- Geographic data distribution view for data operators
CREATE VIEW `geographic_data_distribution_view` AS
SELECT
    up.`district`,
    up.`upazila`,
    COUNT(
        DISTINCT CASE
            WHEN u.`user_type` = 'farmer' THEN u.`user_id`
        END
    ) AS `total_farmers`,
    COUNT(DISTINCT pvr.`farmer_id`) AS `farmers_with_profile_verification`,
    COUNT(DISTINCT cvr.`farmer_id`) AS `farmers_with_crop_verification`,
    COUNT(DISTINCT fdc.`farmer_id`) AS `farmers_in_field_reports`,

-- Verification status counts
SUM(
    CASE
        WHEN pvr.`verification_status` = 'verified' THEN 1
        ELSE 0
    END
) AS `verified_profiles`,
SUM(
    CASE
        WHEN pvr.`verification_status` = 'pending' THEN 1
        ELSE 0
    END
) AS `pending_profiles`,
SUM(
    CASE
        WHEN cvr.`verification_status` = 'verified' THEN 1
        ELSE 0
    END
) AS `verified_crops`,
SUM(
    CASE
        WHEN cvr.`verification_status` = 'pending' THEN 1
        ELSE 0
    END
) AS `pending_crops`,

-- Total land area
SUM(
    CASE
        WHEN cvr.`verification_status` = 'verified' THEN cvr.`land_area`
        ELSE 0
    END
) AS `total_verified_land_area`,

-- Most common crops
(
    SELECT cvr2.`crop_type`
    FROM
        `crop_verification_records` cvr2
        JOIN `users` u2 ON cvr2.`farmer_id` = u2.`user_id`
        JOIN `user_profiles` up2 ON u2.`user_id` = up2.`user_id`
    WHERE
        up2.`district` = up.`district`
        AND up2.`upazila` = up.`upazila`
    GROUP BY
        cvr2.`crop_type`
    ORDER BY COUNT(*) DESC
    LIMIT 1
) AS `most_common_crop`
FROM
    `user_profiles` up
    LEFT JOIN `users` u ON up.`user_id` = u.`user_id`
    LEFT JOIN `profile_verification_records` pvr ON u.`user_id` = pvr.`farmer_id`
    LEFT JOIN `crop_verification_records` cvr ON u.`user_id` = cvr.`farmer_id`
    LEFT JOIN `field_data_collection` fdc ON u.`user_id` = fdc.`farmer_id`
WHERE
    up.`district` IS NOT NULL
    AND up.`upazila` IS NOT NULL
GROUP BY
    up.`district`,
    up.`upazila`
ORDER BY up.`district`, up.`upazila`;

-- Data operator workload summary view
CREATE VIEW `data_operator_workload_summary_view` AS
SELECT
    do.`operator_id`,
    do.`operator_code`,
    up.`full_name` AS `operator_name`,
    up.`district` AS `operator_district`,

-- Current pending items
(
    SELECT COUNT(*)
    FROM
        `profile_verification_records` pvr
    WHERE
        pvr.`operator_id` = do.`operator_id`
        AND pvr.`verification_status` IN ('pending', 'in_review')
) AS `pending_profile_verifications`,
(
    SELECT COUNT(*)
    FROM `crop_verification_records` cvr
    WHERE
        cvr.`operator_id` = do.`operator_id`
        AND cvr.`verification_status` IN ('pending', 'in_review')
) AS `pending_crop_verifications`,
(
    SELECT COUNT(*)
    FROM
        `farmer_registration_applications` fra
    WHERE
        fra.`operator_id` = do.`operator_id`
        AND fra.`application_status` = 'pending'
) AS `pending_registrations`,
(
    SELECT COUNT(*)
    FROM `social_feed_reports` sfr
    WHERE
        sfr.`assigned_operator` = do.`operator_id`
        AND sfr.`report_status` IN ('pending', 'in_review')
) AS `pending_social_reports`,
(
    SELECT COUNT(*)
    FROM `field_data_collection` fdc
    WHERE
        fdc.`operator_id` = do.`operator_id`
        AND fdc.`report_status` = 'draft'
) AS `draft_field_reports`,

-- This week's completed work
(
    SELECT COUNT(*)
    FROM
        `profile_verification_records` pvr
    WHERE
        pvr.`operator_id` = do.`operator_id`
        AND pvr.`verification_status` = 'verified'
        AND pvr.`verification_date` >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
) AS `profiles_verified_this_week`,
(
    SELECT COUNT(*)
    FROM `crop_verification_records` cvr
    WHERE
        cvr.`operator_id` = do.`operator_id`
        AND cvr.`verification_status` = 'verified'
        AND cvr.`verification_date` >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
) AS `crops_verified_this_week`,
(
    SELECT COUNT(*)
    FROM `field_data_collection` fdc
    WHERE
        fdc.`operator_id` = do.`operator_id`
        AND fdc.`report_status` = 'processed'
        AND fdc.`processed_at` >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
) AS `field_reports_processed_this_week`,

-- Overall efficiency metrics
(
    SELECT AVG(dow.`efficiency_score`)
    FROM `data_operator_workload` dow
    WHERE
        dow.`operator_id` = do.`operator_id`
        AND dow.`work_date` >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
) AS `avg_efficiency_last_30_days`,

do.`last_active`,
    do.`is_active`
FROM `data_operators` do
LEFT JOIN `users` u ON do.`user_id` = u.`user_id`
LEFT JOIN `user_profiles` up ON u.`user_id` = up.`user_id`
WHERE do.`is_active` = TRUE;

-- Crop verification analysis view
CREATE VIEW `crop_verification_analysis_view` AS
SELECT
    cvr.`crop_type`,
    COUNT(*) AS `total_applications`,
    SUM(
        CASE
            WHEN cvr.`verification_status` = 'verified' THEN 1
            ELSE 0
        END
    ) AS `verified_count`,
    SUM(
        CASE
            WHEN cvr.`verification_status` = 'rejected' THEN 1
            ELSE 0
        END
    ) AS `rejected_count`,
    SUM(
        CASE
            WHEN cvr.`verification_status` IN ('pending', 'in_review') THEN 1
            ELSE 0
        END
    ) AS `pending_count`,

-- Area statistics
SUM(
    CASE
        WHEN cvr.`verification_status` = 'verified' THEN cvr.`land_area`
        ELSE 0
    END
) AS `total_verified_area`,
AVG(
    CASE
        WHEN cvr.`verification_status` = 'verified' THEN cvr.`land_area`
        ELSE NULL
    END
) AS `avg_farm_size`,

-- Yield statistics
AVG(
    CASE
        WHEN cvr.`verification_status` = 'verified' THEN cvr.`estimated_yield`
        ELSE NULL
    END
) AS `avg_estimated_yield`,

-- Geographic distribution
COUNT(
    DISTINCT JSON_EXTRACT(
        cvr.`location_details`,
        '$.district'
    )
) AS `districts_count`,
COUNT(
    DISTINCT JSON_EXTRACT(
        cvr.`location_details`,
        '$.upazila'
    )
) AS `upazilas_count`,

-- Time analysis
AVG(
    CASE
        WHEN cvr.`verification_status` = 'verified'
        AND cvr.`verification_date` IS NOT NULL THEN DATEDIFF(
            cvr.`verification_date`,
            cvr.`created_at`
        )
        ELSE NULL
    END
) AS `avg_verification_days`,

-- Rejection reasons analysis
(
    SELECT COUNT(*)
    FROM
        `crop_verification_records` cvr2
    WHERE
        cvr2.`crop_type` = cvr.`crop_type`
        AND cvr2.`verification_status` = 'rejected'
        AND cvr2.`rejection_reason` LIKE '%GPS%'
) AS `gps_related_rejections`,
(
    SELECT COUNT(*)
    FROM
        `crop_verification_records` cvr2
    WHERE
        cvr2.`crop_type` = cvr.`crop_type`
        AND cvr2.`verification_status` = 'rejected'
        AND cvr2.`rejection_reason` LIKE '%document%'
) AS `document_related_rejections`
FROM `crop_verification_records` cvr
GROUP BY
    cvr.`crop_type`
ORDER BY `total_applications` DESC;

-- Monthly data operator statistics view
CREATE VIEW `monthly_data_operator_stats_view` AS
SELECT
    YEAR(created_at) AS `year`,
    MONTH(created_at) AS `month`,
    MONTHNAME(created_at) AS `month_name`,

-- Profile verifications
COUNT(
    CASE
        WHEN table_name = 'profile_verification'
        AND status = 'verified' THEN 1
    END
) AS `profiles_verified`,
COUNT(
    CASE
        WHEN table_name = 'profile_verification'
        AND status = 'rejected' THEN 1
    END
) AS `profiles_rejected`,

-- Crop verifications
COUNT(
    CASE
        WHEN table_name = 'crop_verification'
        AND status = 'verified' THEN 1
    END
) AS `crops_verified`,
COUNT(
    CASE
        WHEN table_name = 'crop_verification'
        AND status = 'rejected' THEN 1
    END
) AS `crops_rejected`,

-- Field reports
COUNT(
    CASE
        WHEN table_name = 'field_data' THEN 1
    END
) AS `field_reports_submitted`,

-- Farmer registrations
COUNT(
    CASE
        WHEN table_name = 'farmer_registration'
        AND status = 'approved' THEN 1
    END
) AS `farmers_registered`,

-- Social reports
COUNT(
    CASE
        WHEN table_name = 'social_report'
        AND status = 'resolved' THEN 1
    END
) AS `social_reports_resolved`
FROM (
        SELECT
            'profile_verification' AS table_name, verification_status AS status, created_at
        FROM profile_verification_records
        UNION ALL
        SELECT
            'crop_verification' AS table_name, verification_status AS status, created_at
        FROM crop_verification_records
        UNION ALL
        SELECT
            'field_data' AS table_name, report_status AS status, created_at
        FROM field_data_collection
        UNION ALL
        SELECT
            'farmer_registration' AS table_name, application_status AS status, created_at
        FROM
            farmer_registration_applications
        UNION ALL
        SELECT
            'social_report' AS table_name, report_status AS status, created_at
        FROM social_feed_reports
    ) AS combined_data
WHERE
    created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY
    YEAR(created_at),
    MONTH(created_at),
    MONTHNAME(created_at)
ORDER BY `year` DESC, `month` DESC;

-- =====================================================
-- 17. Stored Procedures for Data Operator Operations
-- =====================================================

DELIMITER /
/

-- Procedure to assign verification task to data operator
CREATE PROCEDURE `AssignVerificationTask`(
    IN p_farmer_id VARCHAR(36),
    IN p_operator_id VARCHAR(36),
    IN p_verification_type ENUM('nid', 'profile', 'documents', 'full'),
    IN p_priority_level ENUM('low', 'medium', 'high', 'urgent')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO `profile_verification_records` (
        `verification_id`, `farmer_id`, `operator_id`, `verification_type`, 
        `verification_status`, `priority_level`, `created_at`
    ) VALUES (
        UUID(), p_farmer_id, p_operator_id, p_verification_type, 
        'pending', p_priority_level, NOW()
    );
    
    -- Log the activity
    INSERT INTO `data_operator_activity_logs` (
        `log_id`, `operator_id`, `activity_type`, `target_id`, `target_type`,
        `action_performed`, `result`, `created_at`
    ) VALUES (
        UUID(), p_operator_id, 'profile_verification', p_farmer_id, 'farmer',
        'Verification task assigned', 'success', NOW()
    );
    
    COMMIT;
END
/
/

-- Procedure to update verification status
CREATE PROCEDURE `UpdateVerificationStatus`(
    IN p_verification_id VARCHAR(36),
    IN p_operator_id VARCHAR(36),
    IN p_status ENUM('pending', 'in_review', 'verified', 'rejected', 'need_more_info'),
    IN p_notes TEXT,
    IN p_rejection_reason TEXT
)
BEGIN
    DECLARE v_farmer_id VARCHAR(36);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Get farmer_id for logging
    SELECT farmer_id INTO v_farmer_id 
    FROM profile_verification_records 
    WHERE verification_id = p_verification_id;
    
    UPDATE `profile_verification_records` SET 
        `verification_status` = p_status,
        `verification_notes` = p_notes,
        `rejection_reason` = CASE WHEN p_status = 'rejected' THEN p_rejection_reason ELSE NULL END,
        `verification_date` = CASE WHEN p_status IN ('verified', 'rejected') THEN NOW() ELSE NULL END,
        `updated_at` = NOW()
    WHERE `verification_id` = p_verification_id;
    
    -- Update user profile verification status if verified
    IF p_status = 'verified' THEN
        UPDATE `user_profiles` SET 
            `verification_status` = 'verified',
            `verified_by` = (SELECT user_id FROM data_operators WHERE operator_id = p_operator_id),
            `verified_at` = NOW()
        WHERE `user_id` = v_farmer_id;
    END IF;
    
    -- Log the activity
    INSERT INTO `data_operator_activity_logs` (
        `log_id`, `operator_id`, `activity_type`, `target_id`, `target_type`,
        `action_performed`, `action_details`, `result`, `created_at`
    ) VALUES (
        UUID(), p_operator_id, 'profile_verification', v_farmer_id, 'farmer',
        CONCAT('Verification status updated to ', p_status),
        JSON_OBJECT('verification_id', p_verification_id, 'status', p_status, 'notes', p_notes),
        'success', NOW()
    );
    
    COMMIT;
END
/
/

-- Procedure to generate data operator performance report
CREATE PROCEDURE `GenerateOperatorPerformanceReport`(
    IN p_operator_id VARCHAR(36),
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        do.operator_code,
        up.full_name AS operator_name,
        
        -- Verification counts
        (SELECT COUNT(*) FROM profile_verification_records pvr 
         WHERE pvr.operator_id = p_operator_id 
         AND pvr.verification_status = 'verified'
         AND DATE(pvr.verification_date) BETWEEN p_start_date AND p_end_date) AS profiles_verified,
        
        (SELECT COUNT(*) FROM crop_verification_records cvr 
         WHERE cvr.operator_id = p_operator_id 
         AND cvr.verification_status = 'verified'
         AND DATE(cvr.verification_date) BETWEEN p_start_date AND p_end_date) AS crops_verified,
        
        (SELECT COUNT(*) FROM field_data_collection fdc 
         WHERE fdc.operator_id = p_operator_id 
         AND fdc.report_status = 'processed'
         AND DATE(fdc.processed_at) BETWEEN p_start_date AND p_end_date) AS field_reports_processed,
        
        (SELECT COUNT(*) FROM farmer_registration_applications fra 
         WHERE fra.operator_id = p_operator_id 
         AND fra.application_status = 'approved'
         AND DATE(fra.approved_at) BETWEEN p_start_date AND p_end_date) AS farmers_registered,
        
        -- Average processing times
        (SELECT AVG(DATEDIFF(verification_date, created_at)) 
         FROM profile_verification_records pvr 
         WHERE pvr.operator_id = p_operator_id 
         AND pvr.verification_status = 'verified'
         AND DATE(pvr.verification_date) BETWEEN p_start_date AND p_end_date) AS avg_profile_verification_days,
        
        (SELECT AVG(DATEDIFF(verification_date, created_at)) 
         FROM crop_verification_records cvr 
         WHERE cvr.operator_id = p_operator_id 
         AND cvr.verification_status = 'verified'
         AND DATE(cvr.verification_date) BETWEEN p_start_date AND p_end_date) AS avg_crop_verification_days,
        
        -- Efficiency metrics
        (SELECT AVG(efficiency_score) FROM data_operator_workload dow 
         WHERE dow.operator_id = p_operator_id 
         AND dow.work_date BETWEEN p_start_date AND p_end_date) AS avg_efficiency_score,
        
        (SELECT SUM(working_hours) FROM data_operator_workload dow 
         WHERE dow.operator_id = p_operator_id 
         AND dow.work_date BETWEEN p_start_date AND p_end_date) AS total_working_hours
    
    FROM data_operators do
    LEFT JOIN users u ON do.user_id = u.user_id
    LEFT JOIN user_profiles up ON u.user_id = up.user_id
    WHERE do.operator_id = p_operator_id;
END
/
/

DELIMITER /
/

-- =====================================================
-- Successful completion message
-- =====================================================

SELECT 'Langol Krishi Sahayak Database successfully created!' as 'Status';

SELECT COUNT(TABLE_NAME) as 'Total Tables Created', 'langol_krishi_sahayak' as 'Database Name'
FROM INFORMATION_SCHEMA.TABLES
WHERE
    TABLE_SCHEMA = 'langol_krishi_sahayak';

-- =====================================================
-- Note:
-- This script is created for XAMPP/MySQL 8.0+
-- UUID() function is supported in MySQL 8.0+
-- For older versions use VARCHAR(36)
-- =====================================================
-- =====================================================
-- Data Operators Table Creation Script (Standalone)
-- For Langol Krishi Sahayak System
-- =====================================================

USE `langol_krishi_sahayak`;

-- Create data_operators table (if not exists)
CREATE TABLE IF NOT EXISTS `data_operators` (
    `operator_id` VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user_id` VARCHAR(36) NOT NULL,
    `operator_code` VARCHAR(15) UNIQUE NOT NULL,
    `assigned_area` JSON,
    `department` VARCHAR(50),
    `position` VARCHAR(50),
    `joining_date` DATE,
    `supervisor_id` VARCHAR(36),
    `permissions` JSON,
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_active` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`supervisor_id`) REFERENCES `data_operators` (`operator_id`) ON DELETE SET NULL,
    INDEX `idx_operator_code` (`operator_code`),
    INDEX `idx_operator_department` (`department`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create sample data operator users (if not exists)
INSERT IGNORE INTO
    `users` (
        `user_id`,
        `email`,
        `password_hash`,
        `user_type`,
        `phone`,
        `is_verified`,
        `is_active`
    )
VALUES (
        UUID(),
        'operator1@dae.gov.bd',
        '$2a$10$hashedpassword1',
        'data_operator',
        '+8801712345678',
        TRUE,
        TRUE
    ),
    (
        UUID(),
        'operator2@dae.gov.bd',
        '$2a$10$hashedpassword2',
        'data_operator',
        '+8801812345678',
        TRUE,
        TRUE
    ),
    (
        UUID(),
        'operator3@dae.gov.bd',
        '$2a$10$hashedpassword3',
        'data_operator',
        '+8801912345678',
        TRUE,
        TRUE
    );

-- Create sample data operator profiles
INSERT IGNORE INTO
    `user_profiles` (
        `profile_id`,
        `user_id`,
        `full_name`,
        `nid_number`,
        `date_of_birth`,
        `father_name`,
        `mother_name`,
        `address`,
        `district`,
        `upazila`,
        `division`,
        `verification_status`
    )
SELECT
    UUID(),
    u.`user_id`,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'মোহাম্মদ রাহিম উদ্দিন'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'নাসির আহমেদ'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'সালমা খাতুন'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN '1234567890123'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN '2345678901234'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN '3456789012345'
    END,
    '1990-01-01',
    'আব্দুল করিম',
    'রহিমা বেগম',
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'কুমিল্লা সদর, কুমিল্লা'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট সদর, সিলেট'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর সদর, রংপুর'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'কুমিল্লা'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'কুমিল্লা সদর'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট সদর'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর সদর'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'চট্টগ্রাম'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'সিলেট'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'রংপুর'
    END,
    'verified'
FROM `users` u
WHERE
    u.`user_type` = 'data_operator'
    AND NOT EXISTS (
        SELECT 1
        FROM `user_profiles` up
        WHERE
            up.`user_id` = u.`user_id`
    );

-- Insert data operators data
INSERT IGNORE INTO
    `data_operators` (
        `operator_id`,
        `user_id`,
        `operator_code`,
        `assigned_area`,
        `department`,
        `position`,
        `joining_date`,
        `permissions`
    )
SELECT
    UUID(),
    u.`user_id`,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN 'DAO-CTG-001'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN 'DAO-SYL-002'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN 'DAO-RNG-003'
    END,
    CASE
        WHEN u.`email` = 'operator1@dae.gov.bd' THEN '{"districts": ["কুমিল্লা", "চাঁদপুর"], "upazilas": ["কুমিল্লা সদর", "দাউদকান্দি"], "unions": ["রামপুর", "কুটিচাঁদপুর"]}'
        WHEN u.`email` = 'operator2@dae.gov.bd' THEN '{"districts": ["সিলেট"], "upazilas": ["সিলেট সদর", "ওসমানীনগর"], "unions": ["খাদিমনগর", "জালালাবাদ"]}'
        WHEN u.`email` = 'operator3@dae.gov.bd' THEN '{"districts": ["রংপুর"], "upazilas": ["রংপুর সদর", "গংগাচড়া"], "unions": ["তাজহাট", "কোলকোন্দ"]}'
    END,
    'কৃষি সম্প্রসারণ অধিদপ্তর',
    'সহকারী কৃষি কর্মকর্তা',
    '2023-01-01',
    '{"profile_verification": true, "crop_verification": true, "field_data_collection": true, "farmer_registration": true, "social_feed_moderation": true, "report_generation": true}'
FROM `users` u
WHERE
    u.`user_type` = 'data_operator'
    AND NOT EXISTS (
        SELECT 1
        FROM `data_operators` do
        WHERE
            do.`user_id` = u.`user_id`
    );

-- Verification queries
SELECT 'Data operators table created successfully!' as Status;

SELECT COUNT(*) as 'Total Data Operator Users'
FROM users
WHERE
    user_type = 'data_operator';

SELECT COUNT(*) as 'Total Data Operators Records'
FROM data_operators;

SELECT do.operator_code, up.full_name, do.department, do.position, JSON_UNQUOTE(
        JSON_EXTRACT(
            do.assigned_area, '$.districts[0]'
        )
    ) as primary_district
FROM
    data_operators do
    JOIN users u ON do.user_id = u.user_id
    JOIN user_profiles up ON u.user_id = up.user_id;