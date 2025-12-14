-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 09, 2025 at 01:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `langol_krishi_sahayak`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
    `comment_id` int(11) NOT NULL,
    `post_id` int(11) NOT NULL,
    `author_id` int(11) NOT NULL,
    `content` text NOT NULL,
    `likes_count` int(11) DEFAULT 0,
    `is_reported` tinyint(1) DEFAULT 0,
    `is_deleted` tinyint(1) DEFAULT 0,
    `parent_comment_id` int(11) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment_likes`
--

CREATE TABLE `comment_likes` (
    `like_id` int(11) NOT NULL,
    `comment_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `liked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consultations`
--

CREATE TABLE `consultations` (
    `consultation_id` int(11) NOT NULL,
    `farmer_id` int(11) NOT NULL,
    `expert_id` int(11) DEFAULT NULL,
    `topic` varchar(150) DEFAULT NULL,
    `crop_type` varchar(50) DEFAULT NULL,
    `issue_description` text NOT NULL,
    `priority` enum('low', 'medium', 'high') DEFAULT 'medium',
    `status` enum(
        'pending',
        'in_progress',
        'resolved',
        'cancelled'
    ) DEFAULT 'pending',
    `location` varchar(100) DEFAULT NULL,
    `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
    `consultation_fee` decimal(6, 2) DEFAULT NULL,
    `payment_status` enum('pending', 'paid', 'refunded') DEFAULT NULL,
    `preferred_time` varchar(50) DEFAULT NULL,
    `consultation_type` enum(
        'voice',
        'video',
        'chat',
        'in_person'
    ) DEFAULT 'chat',
    `urgency` enum('low', 'medium', 'high') DEFAULT 'medium',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `resolved_at` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consultation_responses`
--

CREATE TABLE `consultation_responses` (
    `response_id` int(11) NOT NULL,
    `consultation_id` int(11) NOT NULL,
    `expert_id` int(11) NOT NULL,
    `response_text` text NOT NULL,
    `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
    `is_final_response` tinyint(1) DEFAULT 0,
    `diagnosis` text DEFAULT NULL,
    `treatment` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crop_recommendations`
--

CREATE TABLE `crop_recommendations` (
    `recommendation_id` int(11) NOT NULL,
    `farmer_id` int(11) NOT NULL,
    `location` varchar(100) DEFAULT NULL,
    `soil_type` varchar(50) DEFAULT NULL,
    `season` varchar(30) DEFAULT NULL,
    `land_size` decimal(8, 2) DEFAULT NULL,
    `land_unit` enum('acre', 'bigha', 'katha') DEFAULT 'bigha',
    `budget` decimal(10, 2) DEFAULT NULL,
    `recommended_crops` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (
        json_valid(`recommended_crops`)
    ),
    `climate_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`climate_data`)),
    `market_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`market_analysis`)),
    `profitability_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (
        json_valid(`profitability_analysis`)
    ),
    `year_plan` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`year_plan`)),
    `expert_id` int(11) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_business_details`
--

CREATE TABLE `customer_business_details` (
    `business_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `business_name` varchar(100) DEFAULT NULL,
    `business_type` varchar(50) DEFAULT NULL,
    `trade_license_number` varchar(30) DEFAULT NULL,
    `business_address` text DEFAULT NULL,
    `established_year` year(4) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `diagnoses`
--

CREATE TABLE `diagnoses` (
    `diagnosis_id` int(11) NOT NULL,
    `farmer_id` int(11) NOT NULL,
    `crop_type` varchar(100) DEFAULT NULL,
    `symptoms_description` text DEFAULT NULL,
    `uploaded_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`uploaded_images`)),
    `farm_area` decimal(10, 2) DEFAULT NULL,
    `area_unit` enum('acre', 'bigha', 'katha') DEFAULT 'bigha',
    `ai_analysis_result` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (
        json_valid(`ai_analysis_result`)
    ),
    `expert_verification_id` int(11) DEFAULT NULL,
    `is_verified_by_expert` tinyint(1) DEFAULT 0,
    `urgency` enum('low', 'medium', 'high') DEFAULT 'medium',
    `status` enum(
        'pending',
        'diagnosed',
        'completed'
    ) DEFAULT 'pending',
    `location` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disease_treatments`
--

CREATE TABLE `disease_treatments` (
    `treatment_id` int(11) NOT NULL,
    `diagnosis_id` int(11) NOT NULL,
    `disease_name` varchar(255) DEFAULT NULL,
    `disease_name_bn` varchar(255) DEFAULT NULL,
    `probability_percentage` decimal(5, 2) DEFAULT NULL,
    `treatment_description` text DEFAULT NULL,
    `estimated_cost` decimal(10, 2) DEFAULT NULL,
    `treatment_guidelines` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (
        json_valid(`treatment_guidelines`)
    ),
    `prevention_guidelines` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (
        json_valid(`prevention_guidelines`)
    ),
    `video_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`video_links`)),
    `disease_type` varchar(100) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expert_qualifications`
--

CREATE TABLE `expert_qualifications` (
    `expert_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `qualification` varchar(100) DEFAULT NULL,
    `specialization` varchar(100) DEFAULT NULL,
    `experience_years` tinyint(3) UNSIGNED DEFAULT NULL,
    `institution` varchar(100) DEFAULT NULL,
    `consultation_fee` decimal(6, 2) DEFAULT NULL,
    `rating` decimal(2, 1) DEFAULT 0.0,
    `total_consultations` smallint(5) UNSIGNED DEFAULT 0,
    `is_government_approved` tinyint(1) DEFAULT 0,
    `license_number` varchar(50) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `farmer_details`
--

CREATE TABLE `farmer_details` (
    `farmer_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `farm_size` decimal(8, 2) DEFAULT NULL,
    `farm_size_unit` enum('bigha', 'katha', 'acre') DEFAULT 'bigha',
    `farm_type` varchar(50) DEFAULT NULL,
    `experience_years` tinyint(3) UNSIGNED DEFAULT NULL,
    `land_ownership` varchar(100) DEFAULT NULL,
    `registration_date` date DEFAULT NULL,
    `krishi_card_number` varchar(20) DEFAULT NULL COMMENT 'Optional - Either NID or Krishi Card required',
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
    `postal_code` int(11) NOT NULL,
    `district` varchar(45) NOT NULL,
    `upazila` varchar(45) NOT NULL,
    `division` varchar(45) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_categories`
--

CREATE TABLE `marketplace_categories` (
    `category_id` int(11) NOT NULL,
    `category_name` varchar(100) NOT NULL,
    `category_name_bn` varchar(100) DEFAULT NULL,
    `description` text DEFAULT NULL,
    `icon_url` varchar(500) DEFAULT NULL,
    `parent_id` int(11) DEFAULT NULL,
    `is_active` tinyint(1) DEFAULT 1,
    `sort_order` int(11) DEFAULT 0,
    `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_listings`
--

CREATE TABLE `marketplace_listings` (
    `listing_id` int(11) NOT NULL,
    `seller_id` int(11) NOT NULL,
    `title` varchar(150) NOT NULL,
    `description` text DEFAULT NULL,
    `price` decimal(10, 2) DEFAULT NULL,
    `currency` varchar(3) DEFAULT 'BDT',
    `category_id` int(11) DEFAULT NULL,
    `listing_type` enum(
        'sell',
        'rent',
        'buy',
        'service'
    ) DEFAULT 'sell',
    `status` enum(
        'active',
        'sold',
        'expired',
        'draft'
    ) DEFAULT 'active',
    `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
    `location` varchar(100) DEFAULT NULL,
    `contact_phone` varchar(15) DEFAULT NULL,
    `contact_email` varchar(100) DEFAULT NULL,
    `is_featured` tinyint(1) DEFAULT 0,
    `views_count` mediumint(8) UNSIGNED DEFAULT 0,
    `saves_count` smallint(5) UNSIGNED DEFAULT 0,
    `contacts_count` smallint(5) UNSIGNED DEFAULT 0,
    `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `expires_at` timestamp NULL DEFAULT(
        current_timestamp() + interval 60 day
    )
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_listing_saves`
--

CREATE TABLE `marketplace_listing_saves` (
    `save_id` int(11) NOT NULL,
    `listing_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `saved_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
    `notification_id` int(11) NOT NULL,
    `notification_type` enum(
        'consultation_request',
        'post_interaction',
        'system',
        'marketplace',
        'diagnosis',
        'weather_alert'
    ) DEFAULT 'system',
    `title` varchar(150) NOT NULL,
    `message` text NOT NULL,
    `related_entity_id` varchar(36) DEFAULT NULL,
    `sender_id` int(11) DEFAULT NULL,
    `recipient_id` int(11) DEFAULT NULL,
    `is_read` tinyint(1) DEFAULT 0,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `read_at` timestamp NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
    `post_id` int(11) NOT NULL,
    `author_id` int(11) NOT NULL,
    `content` text NOT NULL,
    `post_type` enum(
        'general',
        'marketplace',
        'question',
        'advice',
        'expert_advice'
    ) DEFAULT 'general',
    `marketplace_listing_id` varchar(36) DEFAULT NULL,
    `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
    `location` varchar(255) DEFAULT NULL,
    `likes_count` int(11) DEFAULT 0,
    `comments_count` int(11) DEFAULT 0,
    `shares_count` int(11) DEFAULT 0,
    `views_count` int(11) DEFAULT 0,
    `is_pinned` tinyint(1) DEFAULT 0,
    `is_reported` tinyint(1) DEFAULT 0,
    `is_deleted` tinyint(1) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `post_tags_tag_id` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
    `like_id` int(11) NOT NULL,
    `post_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `liked_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_tags`
--

CREATE TABLE `post_tags` (
    `tag_id` int(11) NOT NULL,
    `tag_name` varchar(100) NOT NULL,
    `usage_count` int(11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_tag_relations`
--

CREATE TABLE `post_tag_relations` (
    `post_id` int(11) NOT NULL,
    `tag_id` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `treatment_chemicals`
--

CREATE TABLE `treatment_chemicals` (
    `chemical_id` int(11) NOT NULL,
    `treatment_id` int(11) NOT NULL,
    `chemical_name` varchar(255) DEFAULT NULL,
    `chemical_type` enum(
        'fungicide',
        'pesticide',
        'herbicide',
        'fertilizer',
        'bactericide'
    ) DEFAULT 'fungicide',
    `dose_per_acre` decimal(8, 2) DEFAULT NULL,
    `dose_unit` varchar(20) DEFAULT NULL,
    `price_per_unit` decimal(10, 2) DEFAULT NULL,
    `application_notes` text DEFAULT NULL,
    `safety_precautions` text DEFAULT NULL,
    `application_method` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
    `user_id` int(11) NOT NULL,
    `email` varchar(100) DEFAULT NULL,
    `password_hash` varchar(255) NOT NULL,
    `user_type` enum(
        'farmer',
        'expert',
        'customer',
        'data_operator'
    ) NOT NULL,
    `phone` varchar(15) NOT NULL,
    `is_verified` tinyint(1) DEFAULT 0,
    `is_active` tinyint(1) DEFAULT 1,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
    `profile_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `full_name` varchar(100) NOT NULL,
    `nid_number` varchar(17) DEFAULT NULL COMMENT 'Optional - Either NID or Krishi Card required for farmers',
    `date_of_birth` date DEFAULT NULL,
    `father_name` varchar(100) DEFAULT NULL,
    `mother_name` varchar(100) DEFAULT NULL,
    `address` text DEFAULT NULL,
    `postal_code` int(11) DEFAULT NULL,
    `profile_photo_url` varchar(255) DEFAULT NULL,
    `verification_status` enum(
        'pending',
        'verified',
        'rejected'
    ) DEFAULT 'pending',
    `verified_by` int(11) DEFAULT NULL,
    `verified_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
ADD PRIMARY KEY (`comment_id`),
ADD KEY `idx_comments_post` (`post_id`),
ADD KEY `idx_comments_author` (`author_id`),
ADD KEY `fk_comment_parent` (`parent_comment_id`);

--
-- Indexes for table `comment_likes`
--
ALTER TABLE `comment_likes`
ADD PRIMARY KEY (`like_id`),
ADD UNIQUE KEY `uq_comment_user` (`comment_id`, `user_id`),
ADD KEY `idx_comment_likes_comment` (`comment_id`),
ADD KEY `idx_comment_likes_user` (`user_id`);

--
-- Indexes for table `consultations`
--
ALTER TABLE `consultations`
ADD PRIMARY KEY (`consultation_id`),
ADD KEY `idx_consultations_farmer` (`farmer_id`),
ADD KEY `idx_consultations_expert` (`expert_id`),
ADD KEY `idx_consultations_status` (`status`),
ADD KEY `idx_consultations_priority` (`priority`),
ADD KEY `idx_consultations_created` (`created_at`),
ADD KEY `idx_consultations_status_priority` (`status`, `priority`);

--
-- Indexes for table `consultation_responses`
--
ALTER TABLE `consultation_responses`
ADD PRIMARY KEY (`response_id`),
ADD KEY `idx_responses_consultation` (`consultation_id`),
ADD KEY `idx_responses_expert` (`expert_id`);

--
-- Indexes for table `crop_recommendations`
--
ALTER TABLE `crop_recommendations`
ADD PRIMARY KEY (`recommendation_id`),
ADD KEY `idx_expert_id` (`expert_id`),
ADD KEY `idx_recommendations_farmer` (`farmer_id`),
ADD KEY `idx_recommendations_season` (`season`),
ADD KEY `idx_recommendations_location` (`location`);

--
-- Indexes for table `customer_business_details`
--
ALTER TABLE `customer_business_details`
ADD PRIMARY KEY (`business_id`),
ADD KEY `idx_user_id` (`user_id`),
ADD KEY `idx_business_type` (`business_type`);

--
-- Indexes for table `diagnoses`
--
ALTER TABLE `diagnoses`
ADD PRIMARY KEY (`diagnosis_id`),
ADD KEY `idx_diagnoses_farmer` (`farmer_id`),
ADD KEY `idx_diagnoses_crop` (`crop_type`),
ADD KEY `idx_diagnoses_status` (`status`),
ADD KEY `idx_diagnoses_expert` (`expert_verification_id`);

--
-- Indexes for table `disease_treatments`
--
ALTER TABLE `disease_treatments`
ADD PRIMARY KEY (`treatment_id`),
ADD KEY `idx_treatments_diagnosis` (`diagnosis_id`),
ADD KEY `idx_treatments_disease` (`disease_name`);

--
-- Indexes for table `expert_qualifications`
--
ALTER TABLE `expert_qualifications`
ADD PRIMARY KEY (`expert_id`),
ADD KEY `idx_expert_user` (`user_id`),
ADD KEY `idx_expert_specialization` (`specialization`),
ADD KEY `idx_expert_rating` (`rating`);

--
-- Indexes for table `farmer_details`
--
ALTER TABLE `farmer_details`
ADD PRIMARY KEY (`farmer_id`),
ADD UNIQUE KEY `idx_krishi_card` (`krishi_card_number`),
ADD KEY `idx_user_id` (`user_id`),
ADD KEY `idx_farmer_farm_size` (`farm_size`),
ADD KEY `idx_farmer_experience` (`experience_years`);

--
-- Indexes for table `location`
--
ALTER TABLE `location` ADD PRIMARY KEY (`postal_code`);

--
-- Indexes for table `marketplace_categories`
--
ALTER TABLE `marketplace_categories`
ADD PRIMARY KEY (`category_id`),
ADD KEY `idx_category_name` (`category_name`),
ADD KEY `idx_category_active` (`is_active`),
ADD KEY `idx_category_parent` (`parent_id`);

--
-- Indexes for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
ADD PRIMARY KEY (`listing_id`),
ADD KEY `idx_listings_status` (`status`),
ADD KEY `idx_listings_category` (`category_id`),
ADD KEY `idx_listings_seller` (`seller_id`),
ADD KEY `idx_listings_location` (`location`),
ADD KEY `idx_listings_type` (`listing_type`),
ADD KEY `idx_listings_created` (`created_at`),
ADD KEY `idx_listings_status_category` (`status`, `category_id`);

ALTER TABLE `marketplace_listings`
ADD FULLTEXT KEY `ft_title_description` (`title`, `description`);

--
-- Indexes for table `marketplace_listing_saves`
--
ALTER TABLE `marketplace_listing_saves`
ADD PRIMARY KEY (`save_id`),
ADD UNIQUE KEY `unique_save` (`listing_id`, `user_id`),
ADD KEY `idx_saves_listing` (`listing_id`),
ADD KEY `idx_saves_user` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
ADD PRIMARY KEY (`notification_id`),
ADD KEY `idx_notifications_type` (`notification_type`),
ADD KEY `idx_notifications_created` (`created_at`),
ADD KEY `idx_notifications_read` (`is_read`),
ADD KEY `idx_notifications_sender` (`sender_id`),
ADD KEY `idx_notifications_recipient` (`recipient_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
ADD PRIMARY KEY (`post_id`),
ADD KEY `idx_posts_author_date` (`author_id`, `created_at`),
ADD KEY `idx_posts_type` (`post_type`),
ADD KEY `idx_posts_created` (`created_at`),
ADD KEY `idx_posts_location` (`location`),
ADD KEY `fk_posts_tag` (`post_tags_tag_id`);

ALTER TABLE `posts` ADD FULLTEXT KEY `ft_content` (`content`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
ADD PRIMARY KEY (`like_id`),
ADD UNIQUE KEY `unique_like` (`post_id`, `user_id`),
ADD KEY `idx_likes_post` (`post_id`),
ADD KEY `idx_likes_user` (`user_id`);

--
-- Indexes for table `post_tags`
--
ALTER TABLE `post_tags`
ADD PRIMARY KEY (`tag_id`),
ADD UNIQUE KEY `uq_tag_name` (`tag_name`),
ADD KEY `idx_tag_usage` (`usage_count`);

--
-- Indexes for table `post_tag_relations`
--
ALTER TABLE `post_tag_relations`
ADD PRIMARY KEY (`post_id`, `tag_id`),
ADD KEY `idx_post_tag` (`tag_id`);

--
-- Indexes for table `treatment_chemicals`
--
ALTER TABLE `treatment_chemicals`
ADD PRIMARY KEY (`chemical_id`),
ADD KEY `idx_chemicals_treatment` (`treatment_id`),
ADD KEY `idx_chemicals_type` (`chemical_type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
ADD PRIMARY KEY (`user_id`),
ADD UNIQUE KEY `idx_phone` (`phone`),
ADD UNIQUE KEY `idx_email` (`email`),
ADD KEY `idx_users_type` (`user_type`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
ADD PRIMARY KEY (`profile_id`),
ADD UNIQUE KEY `idx_nid_number` (`nid_number`),
ADD KEY `idx_user_id` (`user_id`),
ADD KEY `idx_verified_by` (`verified_by`),
ADD KEY `idx_profile_verification` (`verification_status`),
ADD KEY `idx_profile_postal` (`postal_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comment_likes`
--
ALTER TABLE `comment_likes`
MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consultations`
--
ALTER TABLE `consultations`
MODIFY `consultation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consultation_responses`
--
ALTER TABLE `consultation_responses`
MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crop_recommendations`
--
ALTER TABLE `crop_recommendations`
MODIFY `recommendation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_business_details`
--
ALTER TABLE `customer_business_details`
MODIFY `business_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `diagnoses`
--
ALTER TABLE `diagnoses`
MODIFY `diagnosis_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disease_treatments`
--
ALTER TABLE `disease_treatments`
MODIFY `treatment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expert_qualifications`
--
ALTER TABLE `expert_qualifications`
MODIFY `expert_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `farmer_details`
--
ALTER TABLE `farmer_details`
MODIFY `farmer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_categories`
--
ALTER TABLE `marketplace_categories`
MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
MODIFY `listing_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_listing_saves`
--
ALTER TABLE `marketplace_listing_saves`
MODIFY `save_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts` MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_tags`
--
ALTER TABLE `post_tags`
MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `treatment_chemicals`
--
ALTER TABLE `treatment_chemicals`
MODIFY `chemical_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users` MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
ADD CONSTRAINT `fk_comment_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_comment_parent` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE;

--
-- Constraints for table `comment_likes`
--
ALTER TABLE `comment_likes`
ADD CONSTRAINT `fk_commentlike_comment` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_commentlike_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `consultations`
--
ALTER TABLE `consultations`
ADD CONSTRAINT `fk_consultations_expert` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_consultations_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `consultation_responses`
--
ALTER TABLE `consultation_responses`
ADD CONSTRAINT `fk_responses_consultation` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`consultation_id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_responses_expert` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `crop_recommendations`
--
ALTER TABLE `crop_recommendations`
ADD CONSTRAINT `fk_recommendations_expert` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_recommendations_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer_business_details`
--
ALTER TABLE `customer_business_details`
ADD CONSTRAINT `fk_customer_business_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `diagnoses`
--
ALTER TABLE `diagnoses`
ADD CONSTRAINT `fk_diagnoses_expert` FOREIGN KEY (`expert_verification_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_diagnoses_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `disease_treatments`
--
ALTER TABLE `disease_treatments`
ADD CONSTRAINT `fk_treatments_diagnosis` FOREIGN KEY (`diagnosis_id`) REFERENCES `diagnoses` (`diagnosis_id`) ON DELETE CASCADE;

--
-- Constraints for table `expert_qualifications`
--
ALTER TABLE `expert_qualifications`
ADD CONSTRAINT `fk_expert_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `farmer_details`
--
ALTER TABLE `farmer_details`
ADD CONSTRAINT `fk_farmer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `marketplace_categories`
--
ALTER TABLE `marketplace_categories`
ADD CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `marketplace_categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
ADD CONSTRAINT `fk_listing_category` FOREIGN KEY (`category_id`) REFERENCES `marketplace_categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_listing_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `marketplace_listing_saves`
--
ALTER TABLE `marketplace_listing_saves`
ADD CONSTRAINT `fk_save_listing` FOREIGN KEY (`listing_id`) REFERENCES `marketplace_listings` (`listing_id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_save_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
ADD CONSTRAINT `fk_notifications_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
ADD CONSTRAINT `fk_posts_tag` FOREIGN KEY (`post_tags_tag_id`) REFERENCES `post_tags` (`tag_id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_posts_user` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `post_likes`
--
ALTER TABLE `post_likes`
ADD CONSTRAINT `fk_post_likes_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_post_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_tag_relations`
--
ALTER TABLE `post_tag_relations`
ADD CONSTRAINT `fk_post_tag_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_post_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `post_tags` (`tag_id`) ON DELETE CASCADE;

--
-- Constraints for table `treatment_chemicals`
--
ALTER TABLE `treatment_chemicals`
ADD CONSTRAINT `fk_chemicals_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `disease_treatments` (`treatment_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
ADD CONSTRAINT `fk_user_profiles_postal_code` FOREIGN KEY (`postal_code`) REFERENCES `location` (`postal_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_user_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_user_profiles_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;