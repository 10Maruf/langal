-- =============================================
-- Crop Recommendation System Database Updates
-- For: Langal Krishi Sahayak
-- Date: 2025-12-12
-- =============================================

-- --------------------------------------------------------
-- 1. Add AI fields to existing crop_recommendations table
-- --------------------------------------------------------

ALTER TABLE `crop_recommendations`
ADD COLUMN `ai_model` VARCHAR(50) DEFAULT 'gpt-4o-mini' AFTER `expert_id`,
ADD COLUMN `ai_prompt` TEXT NULL AFTER `ai_model`,
ADD COLUMN `ai_response` LONGTEXT NULL AFTER `ai_prompt`,
ADD COLUMN `crop_type` VARCHAR(50) NULL AFTER `season`,
ADD COLUMN `division` VARCHAR(100) NULL AFTER `location`,
ADD COLUMN `district` VARCHAR(100) NULL AFTER `division`,
ADD COLUMN `upazila` VARCHAR(100) NULL AFTER `district`,
ADD COLUMN `weather_data` JSON NULL AFTER `climate_data`,
ADD COLUMN `soil_analysis` JSON NULL AFTER `weather_data`,
ADD COLUMN `crop_images` JSON NULL AFTER `soil_analysis`;

-- Add index for crop_type
ALTER TABLE `crop_recommendations`
ADD INDEX `idx_crop_type` (`crop_type`);

-- --------------------------------------------------------
-- 2. Create farmer_selected_crops table
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `farmer_selected_crops` (
    `selection_id` INT(11) NOT NULL AUTO_INCREMENT,
    `farmer_id` INT(11) NOT NULL,
    `recommendation_id` INT(11) DEFAULT NULL,

-- Crop details
`crop_name` VARCHAR(100) NOT NULL,
`crop_name_bn` VARCHAR(100) NOT NULL,
`crop_type` VARCHAR(50) DEFAULT NULL,
`season` VARCHAR(30) DEFAULT NULL,
`image_url` VARCHAR(500) DEFAULT NULL,

-- Dates
`start_date` DATE DEFAULT NULL,
`expected_harvest_date` DATE DEFAULT NULL,

-- Land and financials
`land_size` DECIMAL(8, 2) DEFAULT NULL,
`land_unit` ENUM('acre', 'bigha', 'katha') DEFAULT 'bigha',
`estimated_cost` DECIMAL(12, 2) DEFAULT NULL,
`estimated_profit` DECIMAL(12, 2) DEFAULT NULL,

-- Status
`status` ENUM(
    'planned',
    'active',
    'completed',
    'cancelled'
) DEFAULT 'planned',

-- Cultivation details from AI
`cultivation_plan` JSON DEFAULT NULL,
`cost_breakdown` JSON DEFAULT NULL,
`fertilizer_schedule` JSON DEFAULT NULL,

-- Notifications
`notifications_enabled` TINYINT(1) DEFAULT 1,
    `last_notification_at` TIMESTAMP NULL DEFAULT NULL,
    
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`selection_id`),
    KEY `idx_farmer_id` (`farmer_id`),
    KEY `idx_recommendation_id` (`recommendation_id`),
    KEY `idx_status` (`status`),
    KEY `idx_season` (`season`),
    
    CONSTRAINT `fk_selected_crops_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_selected_crops_recommendation` FOREIGN KEY (`recommendation_id`) REFERENCES `crop_recommendations` (`recommendation_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Update notifications table for crop reminders
-- --------------------------------------------------------

-- Add 'crop_reminder' to notification_type enum
ALTER TABLE `notifications`
MODIFY COLUMN `notification_type` ENUM(
    'consultation_request',
    'post_interaction',
    'system',
    'marketplace',
    'diagnosis',
    'weather_alert',
    'crop_reminder'
) DEFAULT 'system';

-- --------------------------------------------------------
-- 4. Create crop_types lookup table (optional but useful)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `crop_types` (
    `type_id` INT(11) NOT NULL AUTO_INCREMENT,
    `type_key` VARCHAR(50) NOT NULL,
    `type_name_en` VARCHAR(100) NOT NULL,
    `type_name_bn` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100) DEFAULT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `sort_order` INT(11) DEFAULT 0,
    PRIMARY KEY (`type_id`),
    UNIQUE KEY `idx_type_key` (`type_key`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Insert crop types
INSERT INTO
    `crop_types` (
        `type_key`,
        `type_name_en`,
        `type_name_bn`,
        `icon`,
        `sort_order`
    )
VALUES (
        'rice',
        'Rice/Paddy',
        'ধান',
        '🌾',
        1
    ),
    (
        'vegetables',
        'Vegetables',
        'সবজি',
        '🥬',
        2
    ),
    (
        'fruits',
        'Fruits',
        'ফল',
        '🍎',
        3
    ),
    (
        'spices',
        'Spices',
        'মসলা',
        '🌶️',
        4
    ),
    (
        'pulses',
        'Pulses/Lentils',
        'ডাল',
        '🫘',
        5
    ),
    (
        'oilseeds',
        'Oilseeds',
        'তৈলবীজ',
        '🌻',
        6
    ),
    (
        'fiber',
        'Fiber Crops',
        'আঁশ ফসল',
        '🧵',
        7
    ),
    (
        'wheat',
        'Wheat',
        'গম',
        '🌾',
        8
    ),
    (
        'maize',
        'Maize/Corn',
        'ভুট্টা',
        '🌽',
        9
    ),
    (
        'tubers',
        'Tubers',
        'কন্দ ফসল',
        '🥔',
        10
    );

-- --------------------------------------------------------
-- 5. Create seasons lookup table
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `seasons` (
    `season_id` INT(11) NOT NULL AUTO_INCREMENT,
    `season_key` VARCHAR(30) NOT NULL,
    `season_name_en` VARCHAR(100) NOT NULL,
    `season_name_bn` VARCHAR(100) NOT NULL,
    `start_date` VARCHAR(10) NOT NULL COMMENT 'Format: MM-DD',
    `end_date` VARCHAR(10) NOT NULL COMMENT 'Format: MM-DD',
    `description_bn` TEXT DEFAULT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    PRIMARY KEY (`season_id`),
    UNIQUE KEY `idx_season_key` (`season_key`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Insert Bangladesh seasons
INSERT INTO
    `seasons` (
        `season_key`,
        `season_name_en`,
        `season_name_bn`,
        `start_date`,
        `end_date`,
        `description_bn`
    )
VALUES (
        'rabi',
        'Rabi Season',
        'রবি মৌসুম',
        '10-16',
        '03-15',
        'শীতকালীন ফসল - গম, সরিষা, আলু, মসুর, ছোলা, মটর, টমেটো, ফুলকপি, বাঁধাকপি ইত্যাদি'
    ),
    (
        'kharif1',
        'Kharif-1 Season',
        'খরিফ-১ মৌসুম',
        '03-16',
        '07-15',
        'গ্রীষ্মকালীন ফসল - আউশ ধান, পাট, ভুট্টা, তিল, মুগডাল, শসা, করলা ইত্যাদি'
    ),
    (
        'kharif2',
        'Kharif-2 Season',
        'খরিফ-২ মৌসুম',
        '07-16',
        '10-15',
        'বর্ষাকালীন ফসল - আমন ধান, পাট, শাকসবজি ইত্যাদি'
    );

-- --------------------------------------------------------
-- Done!
-- --------------------------------------------------------