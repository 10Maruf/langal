-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 11, 2026 at 12:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `post_id`, `author_id`, `content`, `likes_count`, `is_reported`, `is_deleted`, `parent_comment_id`, `created_at`, `updated_at`) VALUES
(1, 8, 61, 'Good', 0, 0, 0, NULL, '2025-12-17 05:35:29', '2025-12-17 05:35:29'),
(2, 8, 61, 'nice', 0, 0, 0, NULL, '2025-12-17 05:36:11', '2025-12-17 05:36:11'),
(3, 8, 61, 'Wow', 0, 0, 0, NULL, '2025-12-17 05:39:14', '2025-12-17 05:39:14'),
(4, 9, 61, 'nice', 0, 0, 0, NULL, '2025-12-17 11:58:38', '2025-12-17 11:58:38'),
(5, 9, 61, 'wow', 0, 0, 0, NULL, '2025-12-17 11:58:51', '2025-12-17 11:58:51'),
(6, 11, 61, 'okay', 0, 0, 0, NULL, '2025-12-17 12:56:08', '2025-12-17 12:56:08'),
(7, 10, 62, 'good', 0, 0, 0, NULL, '2025-12-17 14:16:05', '2025-12-17 14:16:05'),
(8, 11, 62, 'yes', 0, 0, 0, NULL, '2025-12-17 14:16:16', '2025-12-17 14:16:16'),
(9, 12, 62, 'bhalo', 0, 0, 0, NULL, '2025-12-17 14:16:26', '2025-12-17 14:16:26'),
(10, 9, 29, 'darun', 0, 0, 0, NULL, '2025-12-17 15:52:28', '2025-12-17 15:52:28'),
(11, 13, 29, 'বেগম খালেদা জিয়া আজ মারা গেছে।', 0, 0, 0, NULL, '2025-12-30 11:30:22', '2025-12-30 11:30:22'),
(12, 13, 29, 'খুবই কষ্ট লাগলো 😓', 0, 0, 0, NULL, '2025-12-30 11:42:45', '2025-12-30 11:42:45'),
(13, 13, 33, 'asholei kaptesi ami!!!!', 0, 0, 0, NULL, '2025-12-31 17:53:07', '2025-12-31 17:53:07'),
(14, 13, 61, 'চমৎকার', 0, 0, 0, NULL, '2026-01-04 14:48:21', '2026-01-04 14:48:21'),
(15, 11, 61, 'Nice', 0, 0, 0, NULL, '2026-01-04 14:49:03', '2026-01-04 14:49:03'),
(16, 14, 29, 'areh sera!!', 0, 0, 0, NULL, '2026-01-04 15:17:09', '2026-01-04 15:17:09'),
(17, 14, 33, 'dui kamla', 0, 0, 0, NULL, '2026-01-05 02:17:36', '2026-01-05 02:17:36'),
(18, 13, 29, 'wesxdrcfvgbhjnkml,', 0, 0, 0, NULL, '2026-01-05 23:55:03', '2026-01-05 23:55:03'),
(19, 14, 71, 'valo laglo dekhe', 0, 0, 0, NULL, '2026-01-06 20:25:02', '2026-01-06 20:25:02'),
(20, 17, 29, 'Wow', 0, 0, 0, NULL, '2026-01-11 09:16:06', '2026-01-11 09:16:06');

-- --------------------------------------------------------

--
-- Table structure for table `comment_reports`
--

CREATE TABLE `comment_reports` (
  `report_id` bigint(20) UNSIGNED NOT NULL,
  `comment_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `report_reason` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comment_reports`
--

INSERT INTO `comment_reports` (`report_id`, `comment_id`, `user_id`, `report_reason`, `created_at`, `updated_at`) VALUES
(1, 9, 61, 'inappropriate', '2025-12-17 15:07:06', '2025-12-17 15:07:06');

-- --------------------------------------------------------

--
-- Table structure for table `consultations`
--

CREATE TABLE `consultations` (
  `consultation_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `expert_id` int(11) DEFAULT NULL,
  `topic` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crop_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issue_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` enum('low','medium','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `status` enum('pending','in_progress','resolved','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `consultation_fee` decimal(6,2) DEFAULT NULL,
  `payment_status` enum('pending','paid','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_time` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consultation_type` enum('voice','video','chat','in_person') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'chat',
  `urgency` enum('low','medium','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consultation_appointments`
--

CREATE TABLE `consultation_appointments` (
  `appointment_id` int(10) UNSIGNED NOT NULL,
  `farmer_id` int(11) NOT NULL COMMENT 'FK to users (farmer)',
  `expert_id` int(11) NOT NULL COMMENT 'FK to users (expert)',
  `appointment_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `consultation_type` varchar(255) NOT NULL DEFAULT 'audio_call',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `problem_description` text DEFAULT NULL,
  `problem_description_bn` text DEFAULT NULL,
  `crop_type` varchar(255) DEFAULT NULL,
  `urgency_level` int(11) NOT NULL DEFAULT 1 COMMENT '1: Low, 2: Medium, 3: High',
  `farmer_notes` text DEFAULT NULL,
  `expert_notes` text DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `cancelled_by` int(11) DEFAULT NULL,
  `rescheduled_from` int(11) DEFAULT NULL,
  `reminder_sent` tinyint(1) NOT NULL DEFAULT 0,
  `agora_channel_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `consultation_appointments`
--

INSERT INTO `consultation_appointments` (`appointment_id`, `farmer_id`, `expert_id`, `appointment_date`, `start_time`, `end_time`, `consultation_type`, `status`, `problem_description`, `problem_description_bn`, `crop_type`, `urgency_level`, `farmer_notes`, `expert_notes`, `cancellation_reason`, `cancelled_by`, `rescheduled_from`, `reminder_sent`, `agora_channel_name`, `created_at`, `updated_at`) VALUES
(1, 29, 71, '2026-01-07', '03:45:00', '04:15:00', 'video_call', 'cancelled', 'এমনে টেস্টিং এর জন্য', NULL, NULL, 3, NULL, NULL, 'কৃষক কর্তৃক বাতিল', 29, NULL, 0, 'consultation_adff8ff6-0337-4c1d-92ab-af9a2ded12a6', '2026-01-07 03:26:50', '2026-01-07 03:57:14'),
(2, 29, 71, '2026-01-07', '04:00:00', '04:30:00', 'video_call', 'confirmed', 'test 2', NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, 0, 'consultation_3959257b-fa7b-4837-830f-00ae18554404', '2026-01-07 03:42:30', '2026-01-07 04:08:20'),
(3, 29, 71, '2026-01-07', '17:00:00', '17:30:00', 'video_call', 'cancelled', 'test 3', NULL, NULL, 3, NULL, NULL, NULL, 71, NULL, 0, 'consultation_f608a3c2-c59e-4758-8cc7-d0f85f090de4', '2026-01-07 15:31:58', '2026-01-07 15:39:51'),
(4, 29, 71, '2026-01-07', '17:00:00', '17:30:00', 'video_call', 'cancelled', 'test 4', NULL, NULL, 2, NULL, NULL, NULL, 71, NULL, 0, 'consultation_43ea01c6-200d-4cbd-b13b-4bd638edec79', '2026-01-07 15:40:44', '2026-01-07 21:14:34'),
(5, 29, 71, '2026-01-07', '18:00:00', '18:30:00', 'video_call', 'confirmed', 'test 5', NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, 0, 'consultation_cff9a571-5f95-489b-97cf-38240547aad4', '2026-01-07 17:45:33', '2026-01-07 17:56:31'),
(6, 29, 71, '2026-01-07', '20:00:00', '20:30:00', 'video_call', 'cancelled', 'TEST 6', NULL, NULL, 2, NULL, NULL, 'ব্যবহারকারী কর্তৃক বাতিল', 29, NULL, 0, 'consultation_8482c2dc-1ec5-4eeb-89b5-9a44b1bf00fc', '2026-01-07 19:03:08', '2026-01-07 20:59:32'),
(7, 29, 71, '2026-01-07', '22:00:00', '22:30:00', 'video_call', 'confirmed', 'Test 8', NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, 0, 'consultation_0bb98bba-0274-4422-bda2-4ce872493e3e', '2026-01-07 21:36:58', '2026-01-07 21:37:15');

-- --------------------------------------------------------

--
-- Table structure for table `consultation_calls`
--

CREATE TABLE `consultation_calls` (
  `call_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` int(10) UNSIGNED NOT NULL,
  `caller_id` int(11) NOT NULL COMMENT 'Who initiated the call',
  `callee_id` int(11) NOT NULL COMMENT 'Who received the call',
  `call_type` enum('audio','video') NOT NULL,
  `call_status` enum('ringing','answered','busy','rejected','missed','ended','failed') NOT NULL DEFAULT 'ringing',
  `agora_channel` varchar(100) NOT NULL,
  `agora_app_id` varchar(50) DEFAULT NULL,
  `caller_uid` int(10) UNSIGNED DEFAULT NULL COMMENT 'Agora UID for caller',
  `callee_uid` int(10) UNSIGNED DEFAULT NULL COMMENT 'Agora UID for callee',
  `duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `max_duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 1200 COMMENT 'Default 20 min limit',
  `quality_score` decimal(3,2) DEFAULT NULL COMMENT 'Call quality 0-5',
  `initiated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `answered_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `end_reason` enum('normal','timeout','network_error','user_hangup','system') DEFAULT NULL,
  `is_recorded` tinyint(1) NOT NULL DEFAULT 0,
  `recording_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `consultation_calls`
--

INSERT INTO `consultation_calls` (`call_id`, `appointment_id`, `caller_id`, `callee_id`, `call_type`, `call_status`, `agora_channel`, `agora_app_id`, `caller_uid`, `callee_uid`, `duration_seconds`, `max_duration_seconds`, `quality_score`, `initiated_at`, `answered_at`, `ended_at`, `end_reason`, `is_recorded`, `recording_url`, `created_at`, `updated_at`) VALUES
(3, 5, 29, 71, 'video', 'ended', 'consultation_cff9a571-5f95-489b-97cf-38240547aad4', NULL, NULL, NULL, 0, 1200, NULL, '2026-01-07 18:47:56', NULL, '2026-01-07 19:25:04', NULL, 0, NULL, '2026-01-07 18:47:56', '2026-01-07 18:47:56'),
(4, 2, 71, 29, 'video', 'ended', 'consultation_3959257b-fa7b-4837-830f-00ae18554404', NULL, NULL, NULL, 0, 1200, NULL, '2026-01-07 18:56:55', NULL, '2026-01-07 19:25:04', NULL, 0, NULL, '2026-01-07 18:56:55', '2026-01-07 18:56:55'),
(5, 6, 71, 29, 'video', 'ended', 'consultation_8482c2dc-1ec5-4eeb-89b5-9a44b1bf00fc', NULL, NULL, NULL, 0, 1200, NULL, '2026-01-07 19:05:49', NULL, '2026-01-07 19:25:04', NULL, 0, NULL, '2026-01-07 19:05:49', '2026-01-07 19:05:49'),
(6, 6, 71, 29, 'video', 'ended', 'consultation_8482c2dc-1ec5-4eeb-89b5-9a44b1bf00fc', NULL, NULL, NULL, 4, 1200, NULL, '2026-01-07 19:30:44', '2026-01-07 20:18:20', '2026-01-07 20:18:23', NULL, 0, NULL, '2026-01-07 19:30:44', '2026-01-07 20:18:23'),
(7, 6, 71, 29, 'video', 'ended', 'consultation_8482c2dc-1ec5-4eeb-89b5-9a44b1bf00fc', NULL, NULL, NULL, 3, 1200, NULL, '2026-01-07 20:21:00', '2026-01-07 20:21:04', '2026-01-07 20:21:07', NULL, 0, NULL, '2026-01-07 20:21:00', '2026-01-07 20:21:07'),
(8, 6, 29, 71, 'video', 'ringing', 'consultation_8482c2dc-1ec5-4eeb-89b5-9a44b1bf00fc', NULL, NULL, NULL, 0, 1200, NULL, '2026-01-07 20:27:12', NULL, NULL, NULL, 0, NULL, '2026-01-07 20:27:12', '2026-01-07 20:27:12'),
(9, 7, 71, 29, 'video', 'ringing', 'consultation_0bb98bba-0274-4422-bda2-4ce872493e3e', NULL, NULL, NULL, 0, 1200, NULL, '2026-01-07 21:37:37', NULL, NULL, NULL, 0, NULL, '2026-01-07 21:37:37', '2026-01-07 21:37:37');

-- --------------------------------------------------------

--
-- Table structure for table `consultation_feedback`
--

CREATE TABLE `consultation_feedback` (
  `feedback_id` int(10) UNSIGNED NOT NULL,
  `appointment_id` int(10) UNSIGNED NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `expert_id` int(11) NOT NULL,
  `overall_rating` tinyint(3) UNSIGNED NOT NULL COMMENT '1-5 stars',
  `communication_rating` tinyint(3) UNSIGNED DEFAULT NULL COMMENT '1-5 stars',
  `knowledge_rating` tinyint(3) UNSIGNED DEFAULT NULL COMMENT '1-5 stars',
  `helpfulness_rating` tinyint(3) UNSIGNED DEFAULT NULL COMMENT '1-5 stars',
  `review_text` text DEFAULT NULL,
  `review_text_bn` text DEFAULT NULL COMMENT 'Bangla review',
  `is_approved` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Admin moderation',
  `is_public` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Show on expert profile',
  `admin_notes` varchar(255) DEFAULT NULL,
  `expert_response` text DEFAULT NULL,
  `response_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consultation_messages`
--

CREATE TABLE `consultation_messages` (
  `message_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'FK to appointment (optional)',
  `conversation_id` varchar(50) NOT NULL COMMENT 'Unique conversation ID',
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message_type` enum('text','image','audio','file','system') NOT NULL DEFAULT 'text',
  `content` text NOT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `attachment_type` varchar(50) DEFAULT NULL COMMENT 'MIME type',
  `attachment_name` varchar(255) DEFAULT NULL,
  `attachment_size` int(10) UNSIGNED DEFAULT NULL COMMENT 'File size in bytes',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `reply_to_message_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'For reply feature',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Extra data (e.g., image dimensions)' CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consultation_prescriptions`
--

CREATE TABLE `consultation_prescriptions` (
  `prescription_id` int(10) UNSIGNED NOT NULL,
  `appointment_id` int(10) UNSIGNED NOT NULL,
  `expert_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `diagnosis` text NOT NULL COMMENT 'Problem diagnosis',
  `diagnosis_bn` text DEFAULT NULL COMMENT 'Bangla diagnosis',
  `prescription` text NOT NULL COMMENT 'Recommended treatment/action',
  `prescription_bn` text DEFAULT NULL COMMENT 'Bangla prescription',
  `recommended_products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '[{"name": "...", "dosage": "...", "usage": "..."}]' CHECK (json_valid(`recommended_products`)),
  `recommended_actions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '["action1", "action2"]' CHECK (json_valid(`recommended_actions`)),
  `follow_up_needed` tinyint(1) NOT NULL DEFAULT 0,
  `follow_up_date` date DEFAULT NULL,
  `follow_up_notes` text DEFAULT NULL,
  `severity` enum('mild','moderate','severe','critical') NOT NULL DEFAULT 'moderate',
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of attachment URLs' CHECK (json_valid(`attachments`)),
  `is_sent_to_farmer` tinyint(1) NOT NULL DEFAULT 1,
  `is_read_by_farmer` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consultation_responses`
--

CREATE TABLE `consultation_responses` (
  `response_id` int(11) NOT NULL,
  `consultation_id` int(11) NOT NULL,
  `expert_id` int(11) NOT NULL,
  `response_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_final_response` tinyint(1) DEFAULT 0,
  `diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `treatment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `participant_id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('farmer','expert') NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_read_at` timestamp NULL DEFAULT NULL,
  `last_message_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_muted` tinyint(1) NOT NULL DEFAULT 0,
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crop_recommendations`
--

CREATE TABLE `crop_recommendations` (
  `recommendation_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upazila` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soil_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `season` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crop_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `land_size` decimal(8,2) DEFAULT NULL,
  `land_unit` enum('acre','bigha','katha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'bigha',
  `budget` decimal(10,2) DEFAULT NULL,
  `recommended_crops` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `climate_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `weather_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `soil_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `crop_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `market_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `profitability_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `year_plan` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `expert_id` int(11) DEFAULT NULL,
  `ai_model` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gpt-4o-mini',
  `ai_prompt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ai_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_business_details`
--

CREATE TABLE `customer_business_details` (
  `business_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `business_name` varchar(100) DEFAULT NULL,
  `business_type` varchar(50) DEFAULT NULL,
  `custom_business_type` varchar(100) DEFAULT NULL COMMENT 'Custom business type when business_type is "other"',
  `trade_license_number` varchar(30) DEFAULT NULL,
  `business_address` text DEFAULT NULL,
  `established_year` year(4) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_business_details`
--

INSERT INTO `customer_business_details` (`business_id`, `user_id`, `business_name`, `business_type`, `custom_business_type`, `trade_license_number`, `business_address`, `established_year`, `created_at`, `updated_at`) VALUES
(1, 33, 'ওয়েবলি', 'wholesaler', NULL, '1230987654676', 'গ্রাম: হাজীরপাড়া, ডাকঘর: চন্দ্রগঞ্জ, উপজেলা: লক্ষ্মীপুর সদর, জেলা: লক্ষ্মীপুর, বিভাগ: চট্টগ্রাম', '2015', '2025-12-07 06:43:53', '2025-12-07 07:10:37'),
(2, 34, 'আরমান এন্টারপ্রাইজ', 'processor', NULL, '123457890000', 'গ্রাম: নলদিয়া, ডাকঘর: আনোয়ারা, উপজেলা: আনোয়ারা, জেলা: চট্টগ্রাম, বিভাগ: চট্টগ্রাম', '2010', '2025-12-11 06:47:46', '2025-12-11 06:47:46'),
(3, 52, 'রামপুরা', 'wholesaler', NULL, '1232445', 'গ্রাম: সায়েন্স ল্যাব, ডাকঘর: নিউ মার্কেট টিএসও, উপজেলা: নিউমার্কেট, জেলা: ঢাকা, বিভাগ: ঢাকা', '2010', '2025-12-16 10:22:09', '2025-12-16 10:22:09'),
(4, 66, 'গরু চুরি', 'wholesaler', NULL, '545657', 'গ্রাম: লক্ষণপুর, ডাকঘর: ভবানী জীবনপুর, উপজেলা: বেগমগঞ্জ, জেলা: নোয়াখালী, বিভাগ: চট্টগ্রাম', '2000', '2025-12-17 05:56:10', '2025-12-17 05:56:10'),
(5, 67, 'গরু চুরি', 'transport', NULL, '5987', 'গ্রাম: নান্নুপুর, ডাকঘর: বকশীগঞ্জ, উপজেলা: বকশীগঞ্জ, জেলা: শেরপুর, বিভাগ: ময়মনসিংহ', '2005', '2025-12-17 06:09:28', '2025-12-17 06:09:28'),
(6, 68, 'গরু চুরি', 'agro_industry', NULL, '86546', 'গ্রাম: লক্ষণপুর, ডাকঘর: ভবানী জীবনপুর, উপজেলা: বেগমগঞ্জ, জেলা: নোয়াখালী, বিভাগ: চট্টগ্রাম', '2000', '2025-12-17 07:11:03', '2025-12-17 07:11:03');

-- --------------------------------------------------------

--
-- Table structure for table `data_operators`
--

CREATE TABLE `data_operators` (
  `data_operator_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `data_operators`
--

INSERT INTO `data_operators` (`data_operator_id`, `user_id`, `created_at`) VALUES
(1, 39, '2025-12-15 14:26:58');

-- --------------------------------------------------------

--
-- Table structure for table `diagnoses`
--

CREATE TABLE `diagnoses` (
  `diagnosis_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `crop_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `symptoms_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `farm_area` decimal(10,2) DEFAULT NULL,
  `area_unit` enum('acre','bigha','katha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'bigha',
  `ai_analysis_result` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `expert_verification_id` int(11) DEFAULT NULL,
  `is_verified_by_expert` tinyint(1) DEFAULT 0,
  `urgency` enum('low','medium','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `status` enum('pending','diagnosed','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disease_treatments`
--

CREATE TABLE `disease_treatments` (
  `treatment_id` int(11) NOT NULL,
  `diagnosis_id` int(11) NOT NULL,
  `disease_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disease_name_bn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `probability_percentage` decimal(5,2) DEFAULT NULL,
  `treatment_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT NULL,
  `treatment_guidelines` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `prevention_guidelines` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `video_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `disease_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expert_availability`
--

CREATE TABLE `expert_availability` (
  `availability_id` int(10) UNSIGNED NOT NULL,
  `expert_id` int(11) NOT NULL COMMENT 'FK to users table (expert)',
  `day_of_week` enum('sunday','monday','tuesday','wednesday','thursday','friday','saturday') NOT NULL,
  `start_time` time NOT NULL COMMENT 'Slot start time (e.g., 09:00:00)',
  `end_time` time NOT NULL COMMENT 'Slot end time (e.g., 09:30:00)',
  `slot_duration_minutes` smallint(5) UNSIGNED NOT NULL DEFAULT 30 COMMENT 'Duration in minutes',
  `max_appointments` tinyint(3) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Max bookings per slot',
  `is_available` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1=Available, 0=Blocked',
  `consultation_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '["audio", "video", "chat"]' CHECK (json_valid(`consultation_types`)),
  `notes` varchar(255) DEFAULT NULL COMMENT 'Special notes for this slot',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expert_availability`
--

INSERT INTO `expert_availability` (`availability_id`, `expert_id`, `day_of_week`, `start_time`, `end_time`, `slot_duration_minutes`, `max_appointments`, `is_available`, `consultation_types`, `notes`, `created_at`, `updated_at`) VALUES
(9, 71, 'sunday', '17:00:00', '21:00:00', 30, 1, 1, NULL, NULL, '2026-01-07 21:36:21', '2026-01-07 21:36:21'),
(10, 71, 'monday', '09:00:00', '17:00:00', 30, 1, 1, NULL, NULL, '2026-01-07 21:36:21', '2026-01-07 21:36:21'),
(11, 71, 'wednesday', '02:00:00', '17:00:00', 15, 1, 1, NULL, NULL, '2026-01-07 21:36:21', '2026-01-07 21:36:21'),
(12, 71, 'wednesday', '17:00:00', '23:00:00', 30, 1, 1, NULL, NULL, '2026-01-07 21:36:21', '2026-01-07 21:36:21');

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
  `consultation_fee` decimal(6,2) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `average_rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `total_reviews` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `bio` text DEFAULT NULL COMMENT 'Expert bio/introduction',
  `bio_bn` text DEFAULT NULL COMMENT 'Bangla bio',
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '["bangla", "english"]' CHECK (json_valid(`languages`)),
  `total_consultations` smallint(5) UNSIGNED DEFAULT 0,
  `total_audio_calls` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `total_video_calls` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `total_chat_sessions` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_government_approved` tinyint(1) DEFAULT 0,
  `license_number` varchar(50) DEFAULT NULL,
  `certification_document` varchar(255) DEFAULT NULL,
  `is_available_for_consultation` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Is expert accepting new consultations',
  `response_time_hours` tinyint(3) UNSIGNED NOT NULL DEFAULT 24 COMMENT 'Typical response time in hours',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expert_qualifications`
--

INSERT INTO `expert_qualifications` (`expert_id`, `user_id`, `qualification`, `specialization`, `experience_years`, `institution`, `consultation_fee`, `rating`, `average_rating`, `total_reviews`, `bio`, `bio_bn`, `languages`, `total_consultations`, `total_audio_calls`, `total_video_calls`, `total_chat_sessions`, `is_government_approved`, `license_number`, `certification_document`, `is_available_for_consultation`, `response_time_hours`, `created_at`, `updated_at`) VALUES
(13, 60, 'Bsc in Agriculture', 'Expert in Plant Patheology', 6, 'Agri Uni', 900.00, 0.0, 0.00, 0, NULL, NULL, NULL, 0, 0, 0, 0, 0, '34543', 'expert/certifications/zHBlZfraKOwU2Lb3lvOCCJpu2venyttqm2oXi5PD.pdf', 1, 24, '2025-12-16 11:09:59', '2025-12-16 11:09:59'),
(14, 62, 'স্নাতক', 'ফসল নির্বাচন', 2, 'বাংলাদেশ কিষি', 500.00, 0.0, 0.00, 0, NULL, NULL, NULL, 0, 0, 0, 0, 0, '1234579', 'expert/certifications/X67viASj0QiXLfmkftWgXjmcRaVYfIdOejBEzajT.png', 1, 24, '2025-12-17 04:50:53', '2025-12-17 04:50:53'),
(17, 71, 'পি এইচ ডি ইন কৃষি', 'রোগ ও পোকামাকড়', 4, 'নোয়াখালী কৃষি বিশ্ববিদ্যালয়', 1000.00, 0.0, 0.00, 0, NULL, NULL, NULL, 0, 0, 0, 0, 0, '34567654', 'expert/certifications/b6FOvtRBWGxwvFPq4QcjrHwD8OFijqQlllcASlIb.pdf', 1, 24, '2026-01-06 19:52:17', '2026-01-06 19:52:17');

-- --------------------------------------------------------

--
-- Table structure for table `expert_unavailable_dates`
--

CREATE TABLE `expert_unavailable_dates` (
  `unavailable_id` int(10) UNSIGNED NOT NULL,
  `expert_id` int(11) NOT NULL,
  `unavailable_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL COMMENT 'Optional reason',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `farmer_details`
--

CREATE TABLE `farmer_details` (
  `farmer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `farm_size` decimal(8,2) DEFAULT NULL,
  `farm_size_unit` enum('bigha','katha','acre') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'bigha',
  `farm_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience_years` tinyint(3) UNSIGNED DEFAULT NULL,
  `land_ownership` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `krishi_card_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additional_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmer_details`
--

INSERT INTO `farmer_details` (`farmer_id`, `user_id`, `farm_size`, `farm_size_unit`, `farm_type`, `experience_years`, `land_ownership`, `registration_date`, `krishi_card_number`, `additional_info`, `created_at`, `updated_at`) VALUES
(8, 15, 5.50, 'bigha', 'Mixed', 5, NULL, '2025-12-04', 'KC123456789', '{\"machinery\":[],\"crops\":[],\"financial_summary\":[]}', '2025-12-04 14:18:43', '2025-12-04 14:18:43'),
(9, 20, 1.50, 'bigha', 'Crop', 5, NULL, '2025-12-04', '3641451290247', '[]', '2025-12-04 14:37:16', '2025-12-04 14:37:16'),
(10, 28, 8.00, 'bigha', 'ধান', 0, NULL, '2025-12-04', '122222222222', '{\"machinery\":[],\"crops\":[],\"financial_summary\":[],\"bio\":\"\",\"occupation\":\"\\u0995\\u09c3\\u09b7\\u0995\",\"currentCrops\":[{\"name\":\"\\u0986\\u09ae\\u09a8 \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09a1\\u09bf\\u09b8\\u09c7\\u09ae\\u09cd\\u09ac\\u09b0 \\u09e8\\u09e6\\u09e8\\u09ea\"},{\"name\":\"\\u09b8\\u09b0\\u09bf\\u09b7\\u09be\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09ab\\u09c7\\u09ac\\u09cd\\u09b0\\u09c1\\u09af\\u09bc\\u09be\\u09b0\\u09bf \\u09e8\\u09e6\\u09e8\\u09eb\"},{\"name\":\"\\u09b6\\u09be\\u0995\\u09b8\\u09ac\\u099c\\u09bf\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\"}],\"pastCrops\":[{\"name\":\"\\u09ac\\u09cb\\u09b0\\u09cb \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09e7\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ef\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u0986\\u09b2\\u09c1\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9-\\u09e8\\u09ea\",\"area\":\"\\u09e8 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ea\\u09e6\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ee\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u09aa\\u09c7\\u0981\\u09af\\u09bc\\u09be\\u099c\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09e9\\u09eb,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e8\\u09eb,\\u09e6\\u09e6\\u09e6\"}],\"totalInvestment\":\"\\u09e8,\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalIncome\":\"\\u09ea,\\u09e8\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalProfit\":\"\\u09e7,\\u09ed\\u09e6,\\u09e6\\u09e6\\u09e6\",\"machineryOwned\":[\"\\u099f\\u09cd\\u09b0\\u09be\\u0995\\u09cd\\u099f\\u09b0\",\"\\u09aa\\u09be\\u0993\\u09af\\u09bc\\u09be\\u09b0 \\u099f\\u09bf\\u09b2\\u09be\\u09b0\",\"\\u09b8\\u09c7\\u099a \\u09aa\\u09be\\u09ae\\u09cd\\u09aa\",\"\\u09a5\\u09cd\\u09b0\\u09c7\\u09b6\\u09bf\\u0982 \\u09ae\\u09c7\\u09b6\\u09bf\\u09a8\"],\"irrigationMethod\":\"\\u0997\\u09ad\\u09c0\\u09b0 \\u09a8\\u09b2\\u0995\\u09c2\\u09aa\",\"fertilizers\":[\"\\u0987\\u0989\\u09b0\\u09bf\\u09af\\u09bc\\u09be\",\"\\u099f\\u09bf\\u098f\\u09b8\\u09aa\\u09bf\",\"\\u098f\\u09ae\\u0993\\u09aa\\u09bf\",\"\\u099c\\u09bf\\u09aa\\u09b8\\u09be\\u09ae\",\"\\u099c\\u09c8\\u09ac \\u09b8\\u09be\\u09b0\"],\"seedSource\":\"\\u0995\\u09c3\\u09b7\\u09bf \\u0985\\u09ab\\u09bf\\u09b8 \\u0993 \\u09ac\\u09bf\\u098f\\u09a1\\u09bf\\u09b8\\u09bf\"}', '2025-12-04 15:04:43', '2025-12-05 01:19:32'),
(11, 29, 200.00, 'bigha', 'মিশ্র চাষ', 3, 'নিজস্ব', '2025-12-05', '21212121213', '{\"machinery\":[],\"crops\":[],\"financial_summary\":[],\"bio\":\"\\u0986\\u09ae\\u09bf \\u09ae\\u09be\\u09b0\\u09c1\\u09ab \\u098f\\u0995\\u099c\\u09a8 \\u09b8\\u09ab\\u099f\\u0993\\u09df\\u09cd\\u09af\\u09be\\u09b0 \\u0987\\u099e\\u09cd\\u099c\\u09bf\\u09a8\\u09bf\\u09df\\u09be\\u09b0\\u0964 \\u098f\\u0996\\u09a8 \\u099a\\u09be\\u09b7 \\u09ac\\u09be\\u09b8 \\u0995\\u09b0\\u09c7 \\u099c\\u09c0\\u09ac\\u09a8 \\u099a\\u09be\\u09b2\\u09be\\u0987\\u0964  \",\"occupation\":\"\\u0995\\u09c3\\u09b7\\u0995\",\"currentCrops\":[{\"name\":\"\\u0986\\u09ae\\u09a8 \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09a1\\u09bf\\u09b8\\u09c7\\u09ae\\u09cd\\u09ac\\u09b0 \\u09e8\\u09e6\\u09e8\\u09ea\"},{\"name\":\"\\u09b8\\u09b0\\u09bf\\u09b7\\u09be\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09ab\\u09c7\\u09ac\\u09cd\\u09b0\\u09c1\\u09af\\u09bc\\u09be\\u09b0\\u09bf \\u09e8\\u09e6\\u09e8\\u09eb\"},{\"name\":\"\\u09b6\\u09be\\u0995\\u09b8\\u09ac\\u099c\\u09bf\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\"}],\"pastCrops\":[{\"name\":\"\\u09ac\\u09cb\\u09b0\\u09cb \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09e7\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ef\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u0986\\u09b2\\u09c1\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9-\\u09e8\\u09ea\",\"area\":\"\\u09e8 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ea\\u09e6\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ee\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u09aa\\u09c7\\u0981\\u09af\\u09bc\\u09be\\u099c\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09e9\\u09eb,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e8\\u09eb,\\u09e6\\u09e6\\u09e6\"}],\"totalInvestment\":\"\\u09e8,\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalIncome\":\"\\u09ea,\\u09e8\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalProfit\":\"\\u09e7,\\u09ed\\u09e6,\\u09e6\\u09e6\\u09e6\",\"machineryOwned\":[\"\\u099f\\u09cd\\u09b0\\u09be\\u0995\\u09cd\\u099f\\u09b0\",\"\\u09aa\\u09be\\u0993\\u09af\\u09bc\\u09be\\u09b0 \\u099f\\u09bf\\u09b2\\u09be\\u09b0\",\"\\u09b8\\u09c7\\u099a \\u09aa\\u09be\\u09ae\\u09cd\\u09aa\",\"\\u09a5\\u09cd\\u09b0\\u09c7\\u09b6\\u09bf\\u0982 \\u09ae\\u09c7\\u09b6\\u09bf\\u09a8\"],\"irrigationMethod\":\"\\u0997\\u09ad\\u09c0\\u09b0 \\u09a8\\u09b2\\u0995\\u09c2\\u09aa\",\"fertilizers\":[\"\\u0987\\u0989\\u09b0\\u09bf\\u09af\\u09bc\\u09be\",\"\\u099f\\u09bf\\u098f\\u09b8\\u09aa\\u09bf\",\"\\u098f\\u09ae\\u0993\\u09aa\\u09bf\",\"\\u099c\\u09bf\\u09aa\\u09b8\\u09be\\u09ae\",\"\\u099c\\u09c8\\u09ac \\u09b8\\u09be\\u09b0\"],\"seedSource\":\"\\u0995\\u09c3\\u09b7\\u09bf \\u0985\\u09ab\\u09bf\\u09b8 \\u0993 \\u09ac\\u09bf\\u098f\\u09a1\\u09bf\\u09b8\\u09bf\"}', '2025-12-05 12:08:27', '2026-01-06 01:13:26'),
(12, 30, 10.00, 'acre', 'মৎস্য চাষ', 14, NULL, '2025-12-05', NULL, '{\"machinery\":[],\"crops\":[],\"financial_summary\":[]}', '2025-12-05 12:29:01', '2025-12-05 12:29:01'),
(13, 31, 70.00, 'bigha', 'অরাআআআ', 10, NULL, '2025-12-07', NULL, '{\"machinery\":[],\"crops\":[],\"financial_summary\":[],\"bio\":\"\\u0986\\u09ae\\u09bf \\u09ac\\u09b2\\u09c7\\u099b\\u09bf \\u09af\\u09c7, \\\"\\u09a4\\u09cb\\u09ae\\u09b0\\u09be \\u099a\\u09c1\\u09b0\\u09bf \\u0993 \\u09a8\\u0995\\u09b2 \\u09a5\\u09c7\\u0995\\u09c7 \\u09ac\\u09bf\\u09b0\\u09a4 \\u09a5\\u09be\\u0995\\u09cb\\u0964\\\" \",\"occupation\":\"\\u0995\\u09c3\\u09b7\\u0995\",\"currentCrops\":[{\"name\":\"\\u0986\\u09ae\\u09a8 \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09a1\\u09bf\\u09b8\\u09c7\\u09ae\\u09cd\\u09ac\\u09b0 \\u09e8\\u09e6\\u09e8\\u09ea\"},{\"name\":\"\\u09b8\\u09b0\\u09bf\\u09b7\\u09be\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09ab\\u09c7\\u09ac\\u09cd\\u09b0\\u09c1\\u09af\\u09bc\\u09be\\u09b0\\u09bf \\u09e8\\u09e6\\u09e8\\u09eb\"},{\"name\":\"\\u09b6\\u09be\\u0995\\u09b8\\u09ac\\u099c\\u09bf\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\"}],\"pastCrops\":[{\"name\":\"\\u09ac\\u09cb\\u09b0\\u09cb \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09e7\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ef\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u0986\\u09b2\\u09c1\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9-\\u09e8\\u09ea\",\"area\":\"\\u09e8 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ea\\u09e6\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ee\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u09aa\\u09c7\\u0981\\u09af\\u09bc\\u09be\\u099c\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09e9\\u09eb,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e8\\u09eb,\\u09e6\\u09e6\\u09e6\"}],\"totalInvestment\":\"\\u09e8,\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalIncome\":\"\\u09ea,\\u09e8\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalProfit\":\"\\u09e7,\\u09ed\\u09e6,\\u09e6\\u09e6\\u09e6\",\"machineryOwned\":[\"\\u099f\\u09cd\\u09b0\\u09be\\u0995\\u09cd\\u099f\\u09b0\",\"\\u09aa\\u09be\\u0993\\u09af\\u09bc\\u09be\\u09b0 \\u099f\\u09bf\\u09b2\\u09be\\u09b0\",\"\\u09b8\\u09c7\\u099a \\u09aa\\u09be\\u09ae\\u09cd\\u09aa\",\"\\u09a5\\u09cd\\u09b0\\u09c7\\u09b6\\u09bf\\u0982 \\u09ae\\u09c7\\u09b6\\u09bf\\u09a8\"],\"irrigationMethod\":\"\\u0997\\u09ad\\u09c0\\u09b0 \\u09a8\\u09b2\\u0995\\u09c2\\u09aa\",\"fertilizers\":[\"\\u0987\\u0989\\u09b0\\u09bf\\u09af\\u09bc\\u09be\",\"\\u099f\\u09bf\\u098f\\u09b8\\u09aa\\u09bf\",\"\\u098f\\u09ae\\u0993\\u09aa\\u09bf\",\"\\u099c\\u09bf\\u09aa\\u09b8\\u09be\\u09ae\",\"\\u099c\\u09c8\\u09ac \\u09b8\\u09be\\u09b0\"],\"seedSource\":\"\\u0995\\u09c3\\u09b7\\u09bf \\u0985\\u09ab\\u09bf\\u09b8 \\u0993 \\u09ac\\u09bf\\u098f\\u09a1\\u09bf\\u09b8\\u09bf\"}', '2025-12-07 02:52:02', '2025-12-07 02:53:33'),
(14, 32, 8.00, 'acre', 'মৎস্য চাষ', 5, NULL, '2025-12-07', NULL, '{\"machinery\":[],\"crops\":[],\"financial_summary\":[],\"bio\":\"\",\"occupation\":\"\\u0995\\u09c3\\u09b7\\u0995\",\"currentCrops\":[{\"name\":\"\\u0986\\u09ae\\u09a8 \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09a1\\u09bf\\u09b8\\u09c7\\u09ae\\u09cd\\u09ac\\u09b0 \\u09e8\\u09e6\\u09e8\\u09ea\"},{\"name\":\"\\u09b8\\u09b0\\u09bf\\u09b7\\u09be\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u09ab\\u09c7\\u09ac\\u09cd\\u09b0\\u09c1\\u09af\\u09bc\\u09be\\u09b0\\u09bf \\u09e8\\u09e6\\u09e8\\u09eb\"},{\"name\":\"\\u09b6\\u09be\\u0995\\u09b8\\u09ac\\u099c\\u09bf\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea-\\u09e8\\u09eb\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"status\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\",\"expectedHarvest\":\"\\u099a\\u09b2\\u09ae\\u09be\\u09a8\"}],\"pastCrops\":[{\"name\":\"\\u09ac\\u09cb\\u09b0\\u09cb \\u09a7\\u09be\\u09a8\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09ea\",\"area\":\"\\u09e9 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09e7\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ef\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u0986\\u09b2\\u09c1\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9-\\u09e8\\u09ea\",\"area\":\"\\u09e8 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ea\\u09e6\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ee\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e9\\u09e6,\\u09e6\\u09e6\\u09e6\"},{\"name\":\"\\u09aa\\u09c7\\u0981\\u09af\\u09bc\\u09be\\u099c\",\"season\":\"\\u09e8\\u09e6\\u09e8\\u09e9\",\"area\":\"\\u09e7 \\u098f\\u0995\\u09b0\",\"production\":\"\\u09ee\\u09e6 \\u09ae\\u09a3\",\"income\":\"\\u09ec\\u09e6,\\u09e6\\u09e6\\u09e6\",\"cost\":\"\\u09e9\\u09eb,\\u09e6\\u09e6\\u09e6\",\"profit\":\"\\u09e8\\u09eb,\\u09e6\\u09e6\\u09e6\"}],\"totalInvestment\":\"\\u09e8,\\u09eb\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalIncome\":\"\\u09ea,\\u09e8\\u09e6,\\u09e6\\u09e6\\u09e6\",\"totalProfit\":\"\\u09e7,\\u09ed\\u09e6,\\u09e6\\u09e6\\u09e6\",\"machineryOwned\":[\"\\u099f\\u09cd\\u09b0\\u09be\\u0995\\u09cd\\u099f\\u09b0\",\"\\u09aa\\u09be\\u0993\\u09af\\u09bc\\u09be\\u09b0 \\u099f\\u09bf\\u09b2\\u09be\\u09b0\",\"\\u09b8\\u09c7\\u099a \\u09aa\\u09be\\u09ae\\u09cd\\u09aa\",\"\\u09a5\\u09cd\\u09b0\\u09c7\\u09b6\\u09bf\\u0982 \\u09ae\\u09c7\\u09b6\\u09bf\\u09a8\"],\"irrigationMethod\":\"\\u0997\\u09ad\\u09c0\\u09b0 \\u09a8\\u09b2\\u0995\\u09c2\\u09aa\",\"fertilizers\":[\"\\u0987\\u0989\\u09b0\\u09bf\\u09af\\u09bc\\u09be\",\"\\u099f\\u09bf\\u098f\\u09b8\\u09aa\\u09bf\",\"\\u098f\\u09ae\\u0993\\u09aa\\u09bf\",\"\\u099c\\u09bf\\u09aa\\u09b8\\u09be\\u09ae\",\"\\u099c\\u09c8\\u09ac \\u09b8\\u09be\\u09b0\"],\"seedSource\":\"\\u0995\\u09c3\\u09b7\\u09bf \\u0985\\u09ab\\u09bf\\u09b8 \\u0993 \\u09ac\\u09bf\\u098f\\u09a1\\u09bf\\u09b8\\u09bf\"}', '2025-12-07 03:35:28', '2025-12-07 03:45:52'),
(15, 35, 2.00, 'bigha', 'ধান', 2, NULL, '2025-12-15', NULL, '{\"machinery\":[],\"crops\":[],\"financial_summary\":[]}', '2025-12-15 06:34:44', '2025-12-15 06:34:44'),
(18, 56, 5.00, 'bigha', 'ফুল', 5, NULL, '2025-12-16', NULL, '{\"machinery\":[],\"crops\":[],\"financial_summary\":[]}', '2025-12-16 10:37:27', '2025-12-16 10:37:27'),
(19, 57, 5.00, 'bigha', 'ফুল', 5, NULL, '2025-12-16', NULL, '{\"machinery\":[],\"crops\":[],\"financial_summary\":[]}', '2025-12-16 10:45:53', '2025-12-16 10:45:53'),
(20, 61, 5.00, 'bigha', 'ফুল', 5, NULL, '2025-12-17', NULL, '{\"machinery\":[],\"crops\":[],\"financial_summary\":[]}', '2025-12-17 04:36:44', '2025-12-17 04:36:44');

-- --------------------------------------------------------

--
-- Table structure for table `farmer_selected_crops`
--

CREATE TABLE `farmer_selected_crops` (
  `selection_id` bigint(20) UNSIGNED NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `recommendation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `crop_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `crop_name_bn` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `crop_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `yield_per_bigha` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `market_price` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `water_requirement` enum('low','medium','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description_bn` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `season` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `expected_harvest_date` date DEFAULT NULL,
  `actual_harvest_date` date DEFAULT NULL,
  `land_size` decimal(8,2) DEFAULT NULL,
  `land_unit` enum('acre','bigha','katha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bigha',
  `estimated_cost` decimal(12,2) DEFAULT NULL,
  `estimated_profit` decimal(12,2) DEFAULT NULL,
  `status` enum('planned','active','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planned',
  `progress_percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `next_action_date` date DEFAULT NULL,
  `next_action_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cultivation_plan` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `cost_breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `fertilizer_schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `notifications_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `last_notification_at` timestamp NULL DEFAULT NULL,
  `next_notification_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmer_selected_crops`
--

INSERT INTO `farmer_selected_crops` (`selection_id`, `farmer_id`, `recommendation_id`, `crop_name`, `crop_name_bn`, `crop_type`, `duration_days`, `yield_per_bigha`, `market_price`, `water_requirement`, `difficulty`, `description_bn`, `season`, `image_url`, `start_date`, `expected_harvest_date`, `actual_harvest_date`, `land_size`, `land_unit`, `estimated_cost`, `estimated_profit`, `status`, `progress_percentage`, `next_action_date`, `next_action_description`, `cultivation_plan`, `cost_breakdown`, `fertilizer_schedule`, `notifications_enabled`, `last_notification_at`, `next_notification_date`, `created_at`, `updated_at`) VALUES
(3, 29, NULL, 'Boro Rice', 'বোরো ধান', 'rice', 150, '25 মণ', '৳1200/মণ', 'high', 'medium', 'বোরো ধান বাংলাদেশের অন্যতম প্রধান ফসল, যা প্রধানত রবি মৌসুমে চাষ করা হয়।', 'rice', 'https://images.unsplash.com/photo-1599385108614-86b8fce547ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDI4Mjd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwaGFydmVzdHxlbnwwfDB8fHwxNzY1NTU2NDQyfDA&ixlib=rb-4.1.0&q=80&w=1080', '2025-12-12', '2026-05-11', NULL, NULL, 'bigha', 15000.00, 225000.00, 'active', 16.67, '2026-04-11', 'ফসল সংগ্রহ', '[{\"phase\":\"\\u09ac\\u09c0\\u099c\\u09a4\\u09b2\\u09be \\u09aa\\u09cd\\u09b0\\u09b8\\u09cd\\u09a4\\u09c1\\u09a4\\u09bf\",\"days\":\"Day 1-15\",\"tasks\":[\"\\u09ac\\u09c0\\u099c\\u09a4\\u09b2\\u09be \\u09a4\\u09c8\\u09b0\\u09bf\",\"\\u099c\\u09b2 \\u09a6\\u09c7\\u0993\\u09af\\u09bc\\u09be\"]},{\"phase\":\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\",\"days\":\"Day 16-30\",\"tasks\":[\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\",\"\\u099c\\u09b2 \\u09b8\\u09b0\\u09ac\\u09b0\\u09be\\u09b9\"]},{\"phase\":\"\\u09ab\\u09b8\\u09b2 \\u09b8\\u0982\\u0997\\u09cd\\u09b0\\u09b9\",\"days\":\"Day 120-150\",\"tasks\":[\"\\u09ab\\u09b8\\u09b2 \\u09b8\\u0982\\u0997\\u09cd\\u09b0\\u09b9\",\"\\u09aa\\u09b0\\u09bf\\u09b7\\u09cd\\u0995\\u09be\\u09b0 \\u0995\\u09b0\\u09be\"]}]', '{\"seed\":2000,\"fertilizer\":6000,\"pesticide\":3000,\"irrigation\":4000,\"labor\":3000,\"other\":1000}', '[{\"timing\":\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\\u09c7\\u09b0 \\u09b8\\u09ae\\u09af\\u09bc\",\"fertilizers\":[{\"name\":\"\\u0987\\u0989\\u09b0\\u09bf\\u09af\\u09bc\\u09be\",\"amount\":\"30 \\u0995\\u09c7\\u099c\\u09bf\"},{\"name\":\"\\u09a1\\u09bf\\u098f\\u09aa\\u09bf\",\"amount\":\"20 \\u0995\\u09c7\\u099c\\u09bf\"}]},{\"timing\":\"\\u09ab\\u09b8\\u09b2 \\u09ac\\u09c3\\u09a6\\u09cd\\u09a7\\u09bf\\u09b0 \\u09b8\\u09ae\\u09af\\u09bc\",\"fertilizers\":[{\"name\":\"\\u09aa\\u099f\\u09be\\u09b6\",\"amount\":\"15 \\u0995\\u09c7\\u099c\\u09bf\"}]}]', 1, '2025-12-12 10:49:43', '2026-04-11', '2025-12-12 10:21:45', '2026-01-06 01:03:59'),
(4, 29, NULL, 'আলু', 'আলু', 'tubers', 120, '30 মণ', '৳1500/মণ', 'medium', 'medium', 'আলু একটি গুরুত্বপূর্ণ সবজি যা রবি মৌসুমে চাষ করা হয়।', 'tubers', 'https://images.unsplash.com/photo-1609161307645-3ad8d7cafb55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDI4Mjd8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjBoYXJ2ZXN0fGVufDB8MHx8fDE3NjU1NDkzMTV8MA&ixlib=rb-4.1.0&q=80&w=1080', '2025-12-12', '2026-04-11', NULL, NULL, 'bigha', 20000.00, 300000.00, 'active', 2.50, '2026-03-22', 'ফসল সংগ্রহ', '[{\"phase\":\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\",\"days\":\"Day 1-20\",\"tasks\":[\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\",\"\\u099c\\u09b2 \\u09a6\\u09c7\\u0993\\u09af\\u09bc\\u09be\"]},{\"phase\":\"\\u09ab\\u09b8\\u09b2 \\u09b8\\u0982\\u0997\\u09cd\\u09b0\\u09b9\",\"days\":\"Day 100-120\",\"tasks\":[\"\\u09ab\\u09b8\\u09b2 \\u09b8\\u0982\\u0997\\u09cd\\u09b0\\u09b9\",\"\\u09aa\\u09b0\\u09bf\\u09b7\\u09cd\\u0995\\u09be\\u09b0 \\u0995\\u09b0\\u09be\"]}]', '{\"seed\":5000,\"fertilizer\":8000,\"pesticide\":4000,\"irrigation\":3000,\"labor\":3000,\"other\":1000}', '[{\"timing\":\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\\u09c7\\u09b0 \\u09b8\\u09ae\\u09af\\u09bc\",\"fertilizers\":[{\"name\":\"\\u0987\\u0989\\u09b0\\u09bf\\u09af\\u09bc\\u09be\",\"amount\":\"30 \\u0995\\u09c7\\u099c\\u09bf\"},{\"name\":\"\\u09a1\\u09bf\\u098f\\u09aa\\u09bf\",\"amount\":\"20 \\u0995\\u09c7\\u099c\\u09bf\"}]}]', 1, '2025-12-12 10:49:43', '2026-03-22', '2025-12-12 10:21:45', '2025-12-30 10:54:03'),
(5, 29, NULL, 'Carrot', 'গাজর', 'vegetables', 120, '70 মণ', '৳25/কেজি', 'medium', 'medium', 'গাজর একটি পুষ্টিকর সবজি যা শীতকালীন মৌসুমে ভালো জন্মায়।', 'vegetables', 'https://images.unsplash.com/photo-1662322677610-05f479c11c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDI4Mjd8MHwxfHNlYXJjaHwxfHxDYXJyb3QlMjBmYXJtaW5nJTIwY3JvcHxlbnwwfDB8fHwxNzY1ODE3NTg1fDA&ixlib=rb-4.1.0&q=80&w=1080', '2025-12-15', '2026-04-14', NULL, NULL, 'bigha', 6000.00, 90000.00, 'active', 18.33, '2026-01-15', 'ফসল তোলা', '[{\"phase\":\"\\u09ac\\u09c0\\u099c \\u09ac\\u09aa\\u09a8\",\"days\":\"Day 1-30\",\"tasks\":[\"\\u09ac\\u09c0\\u099c \\u09ac\\u09aa\\u09a8\",\"\\u099c\\u09b2 \\u09a6\\u09c7\\u0993\\u09df\\u09be\"]},{\"phase\":\"\\u09ab\\u09b8\\u09b2 \\u09a4\\u09cb\\u09b2\\u09be\",\"days\":\"Day 31-120\",\"tasks\":[\"\\u09ab\\u09b8\\u09b2 \\u09a4\\u09cb\\u09b2\\u09be\"]}]', '{\"seed\":1200,\"fertilizer\":1500,\"pesticide\":300,\"irrigation\":800,\"labor\":2000,\"other\":1200}', '[{\"timing\":\"\\u09ac\\u09c0\\u099c \\u09ac\\u09aa\\u09a8\\u09c7\\u09b0 \\u09e9\\u09e6 \\u09a6\\u09bf\\u09a8 \\u09aa\\u09b0\",\"fertilizers\":[{\"name\":\"NPK\",\"amount\":\"15 \\u0995\\u09c7\\u099c\\u09bf\"},{\"name\":\"Urea\",\"amount\":\"10 \\u0995\\u09c7\\u099c\\u09bf\"}]}]', 1, NULL, '2026-01-15', '2025-12-15 10:53:48', '2026-01-06 23:22:07'),
(6, 29, NULL, 'Banana', 'কলা', 'fruits', 365, '20 মণ', '৳60/কেজি', 'high', 'easy', 'কলা বাংলাদেশের একটি গুরুত্বপূর্ণ ফল যা সারা বছর উৎপাদিত হয়।', 'fruits', 'https://images.unsplash.com/photo-1653481006616-aab561a77a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDI4Mjd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBwbGFudGF0aW9ufGVufDB8MHx8fDE3NjcwOTM1ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080', '2025-12-30', '2026-12-30', NULL, NULL, 'bigha', 25000.00, 65000.00, 'active', 1.37, '2026-01-30', 'ফল উৎপাদন', '[{\"phase\":\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\",\"days\":\"Day 1-30\",\"tasks\":[\"\\u09ae\\u09be\\u099f\\u09bf \\u09aa\\u09cd\\u09b0\\u09b8\\u09cd\\u09a4\\u09c1\\u09a4\\u09bf\",\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\"]},{\"phase\":\"\\u09ab\\u09b2 \\u0989\\u09ce\\u09aa\\u09be\\u09a6\\u09a8\",\"days\":\"Day 31-365\",\"tasks\":[\"\\u09b8\\u09be\\u09b0 \\u09a6\\u09c7\\u0993\\u09af\\u09bc\\u09be\",\"\\u09aa\\u09be\\u09a8\\u09bf \\u09a6\\u09c7\\u0993\\u09af\\u09bc\\u09be\",\"\\u09ab\\u09b2 \\u09b8\\u0982\\u0997\\u09cd\\u09b0\\u09b9\"]}]', '{\"seed\":1500,\"fertilizer\":8000,\"pesticide\":3000,\"irrigation\":10000,\"labor\":8000,\"other\":1500}', '[{\"timing\":\"\\u09ac\\u09c0\\u099c \\u09b0\\u09cb\\u09aa\\u09a3\\u09c7\\u09b0 \\u09b8\\u09ae\\u09af\\u09bc\",\"fertilizers\":[{\"name\":\"Urea\",\"amount\":\"50 \\u0995\\u09c7\\u099c\\u09bf\"},{\"name\":\"TSP\",\"amount\":\"30 \\u0995\\u09c7\\u099c\\u09bf\"},{\"name\":\"Potash\",\"amount\":\"20 \\u0995\\u09c7\\u099c\\u09bf\"}]}]', 1, NULL, NULL, '2025-12-30 11:20:38', '2026-01-04 03:14:57');

-- --------------------------------------------------------

--
-- Table structure for table `field_data_collection`
--

CREATE TABLE `field_data_collection` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `data_operator_id` bigint(20) UNSIGNED NOT NULL,
  `farmer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `manual_farmer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `farmer_name` varchar(255) NOT NULL,
  `farmer_address` text DEFAULT NULL,
  `farmer_phone` varchar(255) DEFAULT NULL,
  `land_size` decimal(10,2) DEFAULT NULL COMMENT 'জমির মাপ (in decimal/bigha)',
  `land_size_unit` varchar(255) NOT NULL DEFAULT 'decimal' COMMENT 'decimal, bigha, katha',
  `livestock_info` varchar(255) DEFAULT NULL COMMENT 'পশুপাল তথ্য',
  `land_service_date` date DEFAULT NULL COMMENT 'ভূমি সেবার তারিখ',
  `irrigation_status` varchar(255) DEFAULT NULL COMMENT 'সেচের স্থিতি - Available/Not Available',
  `season` varchar(255) DEFAULT NULL COMMENT 'মৌসম - Rabi/Kharif/Zaid',
  `crop_type` varchar(255) DEFAULT NULL COMMENT 'ফসল প্রকার',
  `organic_fertilizer_application` text DEFAULT NULL COMMENT 'জৈব সার প্রয়োগ',
  `fertilizer_application` text DEFAULT NULL COMMENT 'রাসায়নিক সার প্রয়োগ',
  `tree_fertilizer_info` text DEFAULT NULL COMMENT 'গাছের সার বিধান',
  `market_price` decimal(10,2) DEFAULT NULL COMMENT 'বাজার দাম',
  `ph_value` decimal(4,2) DEFAULT NULL COMMENT 'মাটির PH মান',
  `expenses` decimal(10,2) DEFAULT NULL COMMENT 'খরচ',
  `production_amount` decimal(10,2) DEFAULT NULL COMMENT 'উৎপাদিত পরিমাণ (kg/maund)',
  `production_unit` varchar(255) NOT NULL DEFAULT 'kg' COMMENT 'kg, maund, ton',
  `crop_calculation` varchar(255) DEFAULT NULL COMMENT 'ফসলের হিসাব',
  `available_resources` text DEFAULT NULL COMMENT 'প্রাপ্ত সম্পদ তথ্য',
  `seminar_name` varchar(255) DEFAULT NULL COMMENT 'সেমিনার/প্রশিক্ষণের নাম',
  `identity_number` varchar(255) DEFAULT NULL COMMENT 'পরিচয় নম্বর',
  `collection_year` year(4) DEFAULT NULL COMMENT 'তথ্য সংগ্রহের বছর',
  `notes` text DEFAULT NULL COMMENT 'অতিরিক্ত মন্তব্য',
  `division` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `upazila` varchar(255) DEFAULT NULL,
  `union` varchar(255) DEFAULT NULL,
  `village` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  `verification_notes` text DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `verified_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `field_data_collection`
--

INSERT INTO `field_data_collection` (`id`, `data_operator_id`, `farmer_id`, `manual_farmer_id`, `farmer_name`, `farmer_address`, `farmer_phone`, `land_size`, `land_size_unit`, `livestock_info`, `land_service_date`, `irrigation_status`, `season`, `crop_type`, `organic_fertilizer_application`, `fertilizer_application`, `tree_fertilizer_info`, `market_price`, `ph_value`, `expenses`, `production_amount`, `production_unit`, `crop_calculation`, `available_resources`, `seminar_name`, `identity_number`, `collection_year`, `notes`, `division`, `district`, `upazila`, `union`, `village`, `postal_code`, `latitude`, `longitude`, `verification_status`, `verification_notes`, `verified_at`, `verified_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 'আলমগীর হোসেন', 'চরপাড়া, ইউনিয়ন 1, পটিয়া, চট্টগ্রাম', '01765603653', 2.46, 'বিঘা', 'গরু 1 টি, ছাগল 5 টি', '2025-12-17', 'খাল', 'খরিফ-২', 'রসুন', '', 'এমওপি 11 কেজি, জৈব সার 14 কেজি', 'আম গাছ 9 টি, কাঁঠাল গাছ 3 টি', 2736.00, 5.93, 30937.00, 3365.00, 'টন', 'মোট উৎপাদন: 3365 টন, খরচ: 30937 টাকা, বিক্রয়: 9206640 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0001', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'চট্টগ্রাম', 'পটিয়া', 'ইউনিয়ন 1', 'চরপাড়া', '2726', 25.33000000, 88.90000000, 'pending', NULL, NULL, NULL, '2025-12-17 09:57:29', '2026-01-11 07:56:01', NULL),
(2, 1, 1, 2, 'মোস্তাফিজুর রহমান', 'ঘাটপাড়া, ইউনিয়ন 2, বাঘারপাড়া, যশোর', '01879738714', 1.55, 'একর', NULL, '2025-12-01', 'বৃষ্টির পানি', 'খরিফ-২', 'আলু', 'সবুজ সার 15 কেজি', 'ইউরিয়া 38 কেজি', NULL, 4867.00, 7.46, 48489.00, 2091.00, 'কেজি', 'মোট উৎপাদন: 2091 কেজি, খরচ: 48489 টাকা, বিক্রয়: 10176897 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0002', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'যশোর', 'বাঘারপাড়া', 'ইউনিয়ন 2', 'ঘাটপাড়া', '9035', 23.26000000, 88.23000000, 'pending', NULL, NULL, NULL, '2025-12-01 08:44:55', '2026-01-11 07:56:01', NULL),
(3, 1, 1, 3, 'মোহাম্মদ আলী', 'আমবাগান, ইউনিয়ন 3, দশমিনা, পটুয়াখালী', '01587237574', 1.94, 'কাঠা', NULL, '2025-12-24', 'নলকূপ', 'খরিফ-২', 'গম', '', 'এমওপি 22 কেজি, টিএসপি 34 কেজি', NULL, 1300.00, 7.27, 34768.00, 1342.00, 'কেজি', 'মোট উৎপাদন: 1342 কেজি, খরচ: 34768 টাকা, বিক্রয়: 1744600 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0003', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'বরিশাল', 'পটুয়াখালী', 'দশমিনা', 'ইউনিয়ন 3', 'আমবাগান', '5086', 22.52000000, 90.64000000, 'verified', NULL, '2025-12-24 13:00:00', 1, '2025-12-24 03:58:42', '2026-01-11 07:56:01', NULL),
(4, 1, 1, 4, 'সালমা আক্তার', 'জামবাগান, ইউনিয়ন 4, গুরুদাসপুর, নাটোর', '01589501282', 3.77, 'কাঠা', 'গরু 3 টি, ছাগল 8 টি', '2026-01-08', 'নলকূপ', 'রবি', 'আম', 'কেঁচো কম্পোস্ট 11 কেজি', 'এমওপি 32 কেজি, টিএসপি 36 কেজি', NULL, 3403.00, 7.07, 11731.00, 1827.00, 'মণ', 'মোট উৎপাদন: 1827 মণ, খরচ: 11731 টাকা, বিক্রয়: 6217281 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0004', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'গুরুদাসপুর', 'ইউনিয়ন 4', 'জামবাগান', '5726', 23.53000000, 88.89000000, 'pending', NULL, NULL, NULL, '2026-01-08 10:44:20', '2026-01-11 07:56:01', NULL),
(5, 1, 1, 5, 'লায়লা আক্তার', 'তেঁতুলতলা, ইউনিয়ন 5, বাবুগঞ্জ, বরিশাল', '01779945168', 4.32, 'বিঘা', NULL, '2025-11-30', 'বৃষ্টির পানি', 'খরিফ', 'বেগুন', 'কেঁচো কম্পোস্ট 26 কেজি', 'টিএসপি 47 কেজি', NULL, 3347.00, 5.70, 7303.00, 4832.00, 'মণ', 'মোট উৎপাদন: 4832 মণ, খরচ: 7303 টাকা, বিক্রয়: 16172704 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0005', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'বরিশাল', 'বরিশাল', 'বাবুগঞ্জ', 'ইউনিয়ন 5', 'তেঁতুলতলা', '3582', 24.81000000, 90.95000000, 'verified', NULL, '2025-11-30 16:00:00', 1, '2025-11-30 06:53:35', '2026-01-11 07:56:01', NULL),
(6, 1, 1, 6, 'শামীম আহমেদ', 'পাথরঘাটা, ইউনিয়ন 6, দোহার, ঢাকা', '01729098928', 4.50, 'কাঠা', 'গরু 2 টি, ছাগল 1 টি', '2025-11-23', 'নলকূপ', 'খরিফ', 'কাঁঠাল', 'কেঁচো কম্পোস্ট 6 কেজি', 'এমওপি 40 কেজি', 'আম গাছ 6 টি, কাঁঠাল গাছ 11 টি', 4303.00, 6.07, 24878.00, 3803.00, 'মণ', 'মোট উৎপাদন: 3803 মণ, খরচ: 24878 টাকা, বিক্রয়: 16364309 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0006', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'ঢাকা', 'ঢাকা', 'দোহার', 'ইউনিয়ন 6', 'পাথরঘাটা', '4474', 24.04000000, 88.23000000, 'rejected', 'তথ্য যাচাই করে পুনরায় জমা দিন', NULL, NULL, '2025-11-23 05:22:11', '2026-01-11 07:56:01', NULL),
(7, 1, 1, 7, 'মোখলেসুর রহমান', 'ঘাটপাড়া, ইউনিয়ন 7, কালিয়াকৈর, গাজীপুর', '01988490749', 3.51, 'কাঠা', 'গরু 5 টি, ছাগল 6 টি', '2025-11-27', 'বৃষ্টির পানি', 'রবি', 'ভুট্টা', 'কম্পোস্ট 24 কেজি', 'জিপসাম 8 কেজি, জৈব সার 30 কেজি, টিএসপি 34 কেজি', NULL, 3048.00, 5.74, 33528.00, 1574.00, 'মণ', 'মোট উৎপাদন: 1574 মণ, খরচ: 33528 টাকা, বিক্রয়: 4797552 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0007', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'ঢাকা', 'গাজীপুর', 'কালিয়াকৈর', 'ইউনিয়ন 7', 'ঘাটপাড়া', '7877', 22.39000000, 89.65000000, 'pending', NULL, NULL, NULL, '2025-11-27 03:48:33', '2026-01-11 07:56:01', NULL),
(8, 1, 1, 8, 'পারভিন সুলতানা', 'শ্যামপুর, ইউনিয়ন 8, দিঘলিয়া, খুলনা', '01778603137', 4.55, 'বিঘা', NULL, '2025-12-04', 'পুকুর', 'রবি', 'বেগুন', 'গোবর সার 17 কেজি', 'জৈব সার 16 কেজি, ইউরিয়া 25 কেজি, এমওপি 41 কেজি', NULL, 3031.00, 7.16, 49972.00, 1266.00, 'কেজি', 'মোট উৎপাদন: 1266 কেজি, খরচ: 49972 টাকা, বিক্রয়: 3837246 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0008', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'খুলনা', 'দিঘলিয়া', 'ইউনিয়ন 8', 'শ্যামপুর', '2563', 23.90000000, 90.65000000, 'verified', NULL, '2025-12-04 03:00:00', 1, '2025-12-04 08:28:29', '2026-01-11 07:56:01', NULL),
(9, 1, 1, 9, 'শিরিনা বেগম', 'চাঁদপুর, ইউনিয়ন 9, রামু, কক্সবাজার', '01498853128', 3.47, 'একর', NULL, '2025-11-12', 'নলকূপ', 'রবি', 'লিচু', 'কেঁচো কম্পোস্ট 15 কেজি', 'ইউরিয়া 43 কেজি, জৈব সার 21 কেজি', 'আম গাছ 9 টি, কাঁঠাল গাছ 13 টি', 1126.00, 6.32, 32387.00, 4426.00, 'মণ', 'মোট উৎপাদন: 4426 মণ, খরচ: 32387 টাকা, বিক্রয়: 4983676 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0009', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'কক্সবাজার', 'রামু', 'ইউনিয়ন 9', 'চাঁদপুর', '4202', 25.91000000, 91.91000000, 'verified', NULL, '2025-11-13 18:00:00', 1, '2025-11-12 07:45:24', '2026-01-11 07:56:01', NULL),
(10, 1, 1, 10, 'আলমগীর হোসেন', 'বাঁশবাড়ীয়া, ইউনিয়ন 10, আনোয়ারা, চট্টগ্রাম', '01491484334', 3.21, 'একর', NULL, '2025-11-22', 'পুকুর', 'খরিফ-২', 'টমেটো', '', 'টিএসপি 36 কেজি', NULL, 4839.00, 6.39, 28748.00, 3684.00, 'মণ', 'মোট উৎপাদন: 3684 মণ, খরচ: 28748 টাকা, বিক্রয়: 17826876 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0010', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'চট্টগ্রাম', 'আনোয়ারা', 'ইউনিয়ন 10', 'বাঁশবাড়ীয়া', '4423', 25.23000000, 90.87000000, 'pending', NULL, NULL, NULL, '2025-11-22 06:15:51', '2026-01-11 07:56:01', NULL),
(11, 1, 1, 11, 'মিজানুর রহমান', 'কাঠালবাড়ী, ইউনিয়ন 1, মোহনপুর, রাজশাহী', '01569560412', 4.45, 'একর', 'গরু 5 টি, ছাগল 6 টি', '2025-11-14', 'খাল', 'রবি', 'কাঁঠাল', '', 'জিপসাম 17 কেজি', NULL, 1020.00, 6.16, 19746.00, 3448.00, 'কেজি', 'মোট উৎপাদন: 3448 কেজি, খরচ: 19746 টাকা, বিক্রয়: 3516960 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0011', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'মোহনপুর', 'ইউনিয়ন 1', 'কাঠালবাড়ী', '8972', 24.06000000, 89.13000000, 'verified', NULL, '2025-11-15 01:00:00', 1, '2025-11-14 09:49:41', '2026-01-11 07:56:01', NULL),
(12, 1, 1, 12, 'সালেহা বেগম', 'জামবাগান, ইউনিয়ন 2, বাউফল, পটুয়াখালী', '01392680438', 4.62, 'একর', 'গরু 1 টি, ছাগল 7 টি', '2025-12-01', 'বৃষ্টির পানি', 'রবি', 'ভুট্টা', '', 'এমওপি 45 কেজি, ইউরিয়া 11 কেজি, জিপসাম 5 কেজি', 'আম গাছ 10 টি, কাঁঠাল গাছ 6 টি', 1180.00, 6.73, 22701.00, 671.00, 'টন', 'মোট উৎপাদন: 671 টন, খরচ: 22701 টাকা, বিক্রয়: 791780 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0012', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'বরিশাল', 'পটুয়াখালী', 'বাউফল', 'ইউনিয়ন 2', 'জামবাগান', '1010', 23.90000000, 88.57000000, 'pending', NULL, NULL, NULL, '2025-12-01 02:58:41', '2026-01-11 07:56:01', NULL),
(13, 1, 1, 13, 'আনোয়ার হোসেন', 'আমবাগান, ইউনিয়ন 3, চারঘাট, রাজশাহী', '01363028989', 2.97, 'কাঠা', NULL, '2025-12-30', 'বৃষ্টির পানি', 'খরিফ-২', 'কাঁঠাল', '', 'টিএসপি 38 কেজি', 'আম গাছ 20 টি, কাঁঠাল গাছ 5 টি', 4373.00, 7.40, 45727.00, 2147.00, 'কেজি', 'মোট উৎপাদন: 2147 কেজি, খরচ: 45727 টাকা, বিক্রয়: 9388831 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0013', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'চারঘাট', 'ইউনিয়ন 3', 'আমবাগান', '4291', 23.60000000, 89.83000000, 'pending', NULL, NULL, NULL, '2025-12-30 08:51:43', '2026-01-11 07:56:01', NULL),
(14, 1, 1, 14, 'সাইফুল ইসলাম', 'পাথরঘাটা, ইউনিয়ন 4, আনোয়ারা, চট্টগ্রাম', '01831803701', 3.42, 'বিঘা', 'গরু 5 টি, ছাগল 8 টি', '2025-11-17', 'খাল', 'রবি', 'শসা', 'কম্পোস্ট 7 কেজি', 'ইউরিয়া 24 কেজি, এমওপি 43 কেজি, জিপসাম 45 কেজি', NULL, 3529.00, 5.52, 31914.00, 1871.00, 'টন', 'মোট উৎপাদন: 1871 টন, খরচ: 31914 টাকা, বিক্রয়: 6602759 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0014', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'চট্টগ্রাম', 'আনোয়ারা', 'ইউনিয়ন 4', 'পাথরঘাটা', '1983', 25.51000000, 90.38000000, 'pending', NULL, NULL, NULL, '2025-11-17 05:34:13', '2026-01-11 07:56:01', NULL),
(15, 1, 1, 15, 'নাসরিন জাহান', 'পাথরঘাটা, ইউনিয়ন 5, তানোর, রাজশাহী', '01848397764', 4.09, 'বিঘা', 'গরু 2 টি, ছাগল 10 টি', '2025-12-25', 'পুকুর', 'খরিফ-২', 'বেগুন', 'কেঁচো কম্পোস্ট 22 কেজি', 'টিএসপি 41 কেজি, এমওপি 24 কেজি', NULL, 2788.00, 7.48, 7582.00, 3555.00, 'মণ', 'মোট উৎপাদন: 3555 মণ, খরচ: 7582 টাকা, বিক্রয়: 9911340 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0015', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'তানোর', 'ইউনিয়ন 5', 'পাথরঘাটা', '2241', 24.13000000, 89.33000000, 'pending', NULL, NULL, NULL, '2025-12-25 05:44:46', '2026-01-11 07:56:01', NULL),
(16, 1, 1, 16, 'শিরিনা বেগম', 'চরপাড়া, ইউনিয়ন 6, বাবুগঞ্জ, বরিশাল', '01436565735', 4.84, 'একর', 'গরু 3 টি, ছাগল 9 টি', '2025-11-22', 'বৃষ্টির পানি', 'খরিফ', 'কলা', 'সবুজ সার 5 কেজি', 'জৈব সার 16 কেজি, ইউরিয়া 41 কেজি, জৈব সার 12 কেজি', NULL, 1955.00, 5.73, 40077.00, 949.00, 'টন', 'মোট উৎপাদন: 949 টন, খরচ: 40077 টাকা, বিক্রয়: 1855295 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0016', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'বরিশাল', 'বরিশাল', 'বাবুগঞ্জ', 'ইউনিয়ন 6', 'চরপাড়া', '3644', 25.37000000, 89.17000000, 'verified', NULL, '2025-11-22 16:00:00', 1, '2025-11-22 03:22:58', '2026-01-11 07:56:01', NULL),
(17, 1, 1, 17, 'সাইফুল ইসলাম', 'শ্যামপুর, ইউনিয়ন 7, দিঘলিয়া, খুলনা', '01546503725', 2.16, 'বিঘা', NULL, '2025-12-22', 'পুকুর', 'খরিফ', 'ডাল', 'কেঁচো কম্পোস্ট 18 কেজি', 'জৈব সার 44 কেজি, টিএসপি 28 কেজি', NULL, 1434.00, 6.60, 8815.00, 916.00, 'কেজি', 'মোট উৎপাদন: 916 কেজি, খরচ: 8815 টাকা, বিক্রয়: 1313544 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0017', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'খুলনা', 'দিঘলিয়া', 'ইউনিয়ন 7', 'শ্যামপুর', '4440', 22.76000000, 90.05000000, 'rejected', 'তথ্য যাচাই করে পুনরায় জমা দিন', NULL, NULL, '2025-12-22 03:25:33', '2026-01-11 07:56:01', NULL),
(18, 1, 1, 18, 'আনোয়ার হোসেন', 'বেলতলা, ইউনিয়ন 8, বড়াইগ্রাম, নাটোর', '01947758064', 0.83, 'বিঘা', NULL, '2025-11-15', 'পুকুর', 'খরিফ', 'গম', '', 'টিএসপি 17 কেজি, ইউরিয়া 19 কেজি', 'আম গাছ 5 টি, কাঁঠাল গাছ 9 টি', 2855.00, 5.77, 30923.00, 1560.00, 'মণ', 'মোট উৎপাদন: 1560 মণ, খরচ: 30923 টাকা, বিক্রয়: 4453800 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0018', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'বড়াইগ্রাম', 'ইউনিয়ন 8', 'বেলতলা', '5790', 25.58000000, 90.76000000, 'rejected', 'তথ্য যাচাই করে পুনরায় জমা দিন', NULL, NULL, '2025-11-15 09:42:51', '2026-01-11 07:56:01', NULL),
(19, 1, 1, 19, 'আবুল কালাম', 'শ্যামপুর, ইউনিয়ন 9, গুরুদাসপুর, নাটোর', '01817731827', 2.22, 'কাঠা', NULL, '2026-01-04', 'পুকুর', 'রবি', 'ধান', '', 'জৈব সার 34 কেজি, জৈব সার 5 কেজি, টিএসপি 50 কেজি', 'আম গাছ 15 টি, কাঁঠাল গাছ 3 টি', 3012.00, 6.13, 19453.00, 3199.00, 'টন', 'মোট উৎপাদন: 3199 টন, খরচ: 19453 টাকা, বিক্রয়: 9635388 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0019', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'গুরুদাসপুর', 'ইউনিয়ন 9', 'শ্যামপুর', '7576', 23.61000000, 88.36000000, 'verified', NULL, '2026-01-05 07:00:00', 1, '2026-01-04 10:28:53', '2026-01-11 07:56:01', NULL),
(20, 1, 1, 20, 'জাহিদুল ইসলাম', 'কামারপাড়া, ইউনিয়ন 10, বাবুগঞ্জ, বরিশাল', '01322783092', 3.50, 'বিঘা', NULL, '2025-12-28', 'নলকূপ', 'খরিফ', 'বেগুন', '', 'এমওপি 14 কেজি, জিপসাম 29 কেজি', NULL, 2620.00, 7.40, 47826.00, 2636.00, 'কেজি', 'মোট উৎপাদন: 2636 কেজি, খরচ: 47826 টাকা, বিক্রয়: 6906320 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0020', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'বরিশাল', 'বরিশাল', 'বাবুগঞ্জ', 'ইউনিয়ন 10', 'কামারপাড়া', '9097', 22.64000000, 88.94000000, 'pending', NULL, NULL, NULL, '2025-12-28 04:35:25', '2026-01-11 07:56:01', NULL),
(21, 1, 1, 21, 'আব্দুল মান্নান', 'ঘাটপাড়া, ইউনিয়ন 1, রায়পুরা, নরসিংদী', '01543967248', 2.64, 'একর', 'গরু 5 টি, ছাগল 2 টি', '2025-11-22', 'বৃষ্টির পানি', 'খরিফ', 'পেঁয়াজ', 'কম্পোস্ট 21 কেজি', 'টিএসপি 48 কেজি, জৈব সার 48 কেজি, জৈব সার 13 কেজি', 'আম গাছ 16 টি, কাঁঠাল গাছ 10 টি', 3597.00, 6.44, 25506.00, 4173.00, 'টন', 'মোট উৎপাদন: 4173 টন, খরচ: 25506 টাকা, বিক্রয়: 15010281 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0021', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'ঢাকা', 'নরসিংদী', 'রায়পুরা', 'ইউনিয়ন 1', 'ঘাটপাড়া', '9539', 22.74000000, 88.76000000, 'pending', NULL, NULL, NULL, '2025-11-22 12:10:30', '2026-01-11 07:56:01', NULL),
(22, 1, 1, 22, 'রওশন আরা', 'চাঁদপুর, ইউনিয়ন 2, বাঘারপাড়া, যশোর', '01442332679', 2.06, 'একর', 'গরু 2 টি, ছাগল 3 টি', '2025-11-24', 'খাল', 'রবি', 'পেঁপে', '', 'এমওপি 20 কেজি', NULL, 1595.00, 6.35, 14418.00, 1926.00, 'কেজি', 'মোট উৎপাদন: 1926 কেজি, খরচ: 14418 টাকা, বিক্রয়: 3071970 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0022', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'যশোর', 'বাঘারপাড়া', 'ইউনিয়ন 2', 'চাঁদপুর', '8894', 22.02000000, 91.08000000, 'pending', NULL, NULL, NULL, '2025-11-24 05:30:28', '2026-01-11 07:56:01', NULL),
(23, 1, 1, 23, 'রফিকুল ইসলাম', 'পাথরঘাটা, ইউনিয়ন 3, অভয়নগর, যশোর', '01385360361', 3.07, 'বিঘা', NULL, '2025-11-14', 'বৃষ্টির পানি', 'খরিফ-২', 'শসা', '', 'জৈব সার 19 কেজি', NULL, 3861.00, 6.21, 26518.00, 1707.00, 'মণ', 'মোট উৎপাদন: 1707 মণ, খরচ: 26518 টাকা, বিক্রয়: 6590727 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0023', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'যশোর', 'অভয়নগর', 'ইউনিয়ন 3', 'পাথরঘাটা', '7200', 23.73000000, 89.32000000, 'verified', NULL, '2025-11-14 10:00:00', 1, '2025-11-14 08:23:57', '2026-01-11 07:56:01', NULL),
(24, 1, 1, 24, 'নাজনিন আক্তার', 'চাঁদপুর, ইউনিয়ন 4, গলাচিপা, পটুয়াখালী', '01354142581', 4.10, 'একর', NULL, '2025-12-12', 'বৃষ্টির পানি', 'খরিফ-২', 'বেগুন', '', 'জিপসাম 48 কেজি, এমওপি 12 কেজি', 'আম গাছ 19 টি, কাঁঠাল গাছ 15 টি', 4671.00, 7.16, 21161.00, 3150.00, 'টন', 'মোট উৎপাদন: 3150 টন, খরচ: 21161 টাকা, বিক্রয়: 14713650 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0024', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'বরিশাল', 'পটুয়াখালী', 'গলাচিপা', 'ইউনিয়ন 4', 'চাঁদপুর', '6843', 25.20000000, 90.64000000, 'rejected', 'তথ্য যাচাই করে পুনরায় জমা দিন', NULL, NULL, '2025-12-12 06:57:22', '2026-01-11 07:56:01', NULL),
(25, 1, 1, 25, 'রুবিনা আক্তার', 'কামারপাড়া, ইউনিয়ন 5, তানোর, রাজশাহী', '01324651868', 2.33, 'কাঠা', 'গরু 4 টি, ছাগল 2 টি', '2025-11-26', 'পুকুর', 'রবি', 'ভুট্টা', 'সবুজ সার 5 কেজি', 'এমওপি 29 কেজি', 'আম গাছ 11 টি, কাঁঠাল গাছ 6 টি', 2242.00, 7.16, 28995.00, 4790.00, 'টন', 'মোট উৎপাদন: 4790 টন, খরচ: 28995 টাকা, বিক্রয়: 10739180 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0025', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'তানোর', 'ইউনিয়ন 5', 'কামারপাড়া', '5634', 25.73000000, 89.51000000, 'pending', NULL, NULL, NULL, '2025-11-26 03:46:36', '2026-01-11 07:56:01', NULL),
(26, 1, 1, 26, 'লায়লা আক্তার', 'চাঁদপুর, ইউনিয়ন 6, পটিয়া, চট্টগ্রাম', '01641905943', 1.15, 'বিঘা', NULL, '2025-12-21', 'পুকুর', 'খরিফ-২', 'ধান', '', 'জৈব সার 43 কেজি, ইউরিয়া 32 কেজি', 'আম গাছ 16 টি, কাঁঠাল গাছ 8 টি', 3173.00, 6.06, 18561.00, 2858.00, 'মণ', 'মোট উৎপাদন: 2858 মণ, খরচ: 18561 টাকা, বিক্রয়: 9068434 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0026', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'চট্টগ্রাম', 'পটিয়া', 'ইউনিয়ন 6', 'চাঁদপুর', '6275', 24.66000000, 91.69000000, 'pending', NULL, NULL, NULL, '2025-12-21 05:12:45', '2026-01-11 07:56:01', NULL),
(27, 1, 1, 27, 'নাজনিন আক্তার', 'কামারপাড়া, ইউনিয়ন 7, গুরুদাসপুর, নাটোর', '01466314717', 4.98, 'কাঠা', NULL, '2025-12-27', 'খাল', 'খরিফ', 'ডাল', '', 'এমওপি 28 কেজি, এমওপি 37 কেজি', NULL, 2782.00, 6.79, 18975.00, 755.00, 'কেজি', 'মোট উৎপাদন: 755 কেজি, খরচ: 18975 টাকা, বিক্রয়: 2100410 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0027', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'গুরুদাসপুর', 'ইউনিয়ন 7', 'কামারপাড়া', '9761', 22.50000000, 89.33000000, 'pending', NULL, NULL, NULL, '2025-12-27 07:46:51', '2026-01-11 07:56:01', NULL),
(28, 1, 1, 28, 'লায়লা আক্তার', 'নারিকেলবাড়ী, ইউনিয়ন 8, শিবপুর, নরসিংদী', '01764515203', 3.98, 'একর', NULL, '2026-01-02', 'বৃষ্টির পানি', 'খরিফ-২', 'সরিষা', 'কম্পোস্ট 8 কেজি', 'জৈব সার 29 কেজি', 'আম গাছ 10 টি, কাঁঠাল গাছ 8 টি', 2244.00, 5.84, 29501.00, 1699.00, 'মণ', 'মোট উৎপাদন: 1699 মণ, খরচ: 29501 টাকা, বিক্রয়: 3812556 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0028', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'ঢাকা', 'নরসিংদী', 'শিবপুর', 'ইউনিয়ন 8', 'নারিকেলবাড়ী', '1917', 23.35000000, 91.95000000, 'verified', NULL, '2026-01-03 00:00:00', 1, '2026-01-02 05:15:42', '2026-01-11 07:56:01', NULL),
(29, 1, 1, 29, 'মনিরুল ইসলাম', 'বাদলপুর, ইউনিয়ন 9, চারঘাট, রাজশাহী', '01330311277', 3.31, 'বিঘা', NULL, '2025-11-19', 'পুকুর', 'রবি', 'কাঁঠাল', 'কেঁচো কম্পোস্ট 15 কেজি', 'জৈব সার 38 কেজি, জৈব সার 14 কেজি, এমওপি 43 কেজি', NULL, 1944.00, 7.10, 38821.00, 2775.00, 'টন', 'মোট উৎপাদন: 2775 টন, খরচ: 38821 টাকা, বিক্রয়: 5394600 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0029', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'চারঘাট', 'ইউনিয়ন 9', 'বাদলপুর', '2289', 23.01000000, 89.24000000, 'pending', NULL, NULL, NULL, '2025-11-19 12:36:47', '2026-01-11 07:56:01', NULL),
(30, 1, 1, 30, 'নাজনিন আক্তার', 'বাঁশবাড়ীয়া, ইউনিয়ন 10, পাইকগাছা, খুলনা', '01845030623', 1.11, 'কাঠা', 'গরু 5 টি, ছাগল 2 টি', '2025-12-05', 'নলকূপ', 'খরিফ', 'আম', '', 'এমওপি 20 কেজি', NULL, 4713.00, 7.09, 47319.00, 4573.00, 'টন', 'মোট উৎপাদন: 4573 টন, খরচ: 47319 টাকা, বিক্রয়: 21552549 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0030', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'খুলনা', 'পাইকগাছা', 'ইউনিয়ন 10', 'বাঁশবাড়ীয়া', '9311', 22.73000000, 88.60000000, 'pending', NULL, NULL, NULL, '2025-12-05 07:20:21', '2026-01-11 07:56:01', NULL),
(31, 1, 1, 31, 'শামীম আহমেদ', 'হাটবাজার, ইউনিয়ন 1, চকরিয়া, কক্সবাজার', '01813874219', 4.54, 'কাঠা', 'গরু 5 টি, ছাগল 1 টি', '2025-12-12', 'পুকুর', 'খরিফ-২', 'ভুট্টা', 'গোবর সার 8 কেজি', 'জিপসাম 26 কেজি', 'আম গাছ 11 টি, কাঁঠাল গাছ 10 টি', 4542.00, 6.43, 9708.00, 4091.00, 'কেজি', 'মোট উৎপাদন: 4091 কেজি, খরচ: 9708 টাকা, বিক্রয়: 18581322 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0031', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'কক্সবাজার', 'চকরিয়া', 'ইউনিয়ন 1', 'হাটবাজার', '2813', 25.22000000, 90.02000000, 'verified', NULL, '2025-12-13 00:00:00', 1, '2025-12-12 04:44:56', '2026-01-11 07:56:01', NULL),
(32, 1, 1, 32, 'সাবিনা ইয়াসমিন', 'কামারপাড়া, ইউনিয়ন 2, চারঘাট, রাজশাহী', '01512055452', 2.07, 'একর', NULL, '2026-01-09', 'নলকূপ', 'খরিফ', 'লাউ', '', 'এমওপি 41 কেজি, টিএসপি 32 কেজি', 'আম গাছ 9 টি, কাঁঠাল গাছ 3 টি', 2554.00, 5.89, 48996.00, 1345.00, 'টন', 'মোট উৎপাদন: 1345 টন, খরচ: 48996 টাকা, বিক্রয়: 3435130 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0032', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'চারঘাট', 'ইউনিয়ন 2', 'কামারপাড়া', '3838', 23.50000000, 88.12000000, 'pending', NULL, NULL, NULL, '2026-01-09 02:20:42', '2026-01-11 07:56:01', NULL),
(33, 1, 1, 33, 'আলমগীর হোসেন', 'চাঁদপুর, ইউনিয়ন 3, বড়াইগ্রাম, নাটোর', '01633293001', 1.97, 'একর', 'গরু 1 টি, ছাগল 5 টি', '2025-11-19', 'খাল', 'রবি', 'তরমুজ', 'গোবর সার 7 কেজি', 'ইউরিয়া 50 কেজি, জৈব সার 42 কেজি', NULL, 3862.00, 5.86, 32629.00, 3572.00, 'কেজি', 'মোট উৎপাদন: 3572 কেজি, খরচ: 32629 টাকা, বিক্রয়: 13795064 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0033', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'বড়াইগ্রাম', 'ইউনিয়ন 3', 'চাঁদপুর', '8443', 25.10000000, 90.94000000, 'pending', NULL, NULL, NULL, '2025-11-19 10:41:55', '2026-01-11 07:56:01', NULL),
(34, 1, 1, 34, 'রেহানা আক্তার', 'চাঁদপুর, ইউনিয়ন 4, নলডাঙ্গা, নাটোর', '01687075302', 3.63, 'কাঠা', 'গরু 3 টি, ছাগল 2 টি', '2025-11-19', 'পুকুর', 'রবি', 'পেঁপে', 'কেঁচো কম্পোস্ট 9 কেজি', 'এমওপি 26 কেজি, জৈব সার 38 কেজি', 'আম গাছ 7 টি, কাঁঠাল গাছ 8 টি', 4820.00, 7.04, 35304.00, 2493.00, 'টন', 'মোট উৎপাদন: 2493 টন, খরচ: 35304 টাকা, বিক্রয়: 12016260 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0034', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'নলডাঙ্গা', 'ইউনিয়ন 4', 'চাঁদপুর', '4501', 25.88000000, 91.26000000, 'pending', NULL, NULL, NULL, '2025-11-19 07:12:31', '2026-01-11 07:56:01', NULL),
(35, 1, 1, 35, 'লায়লা আক্তার', 'আমবাগান, ইউনিয়ন 5, চারঘাট, রাজশাহী', '01585127313', 1.30, 'কাঠা', 'গরু 3 টি, ছাগল 2 টি', '2025-12-22', 'নলকূপ', 'রবি', 'লাউ', '', 'টিএসপি 9 কেজি, জৈব সার 9 কেজি', 'আম গাছ 20 টি, কাঁঠাল গাছ 6 টি', 2575.00, 6.67, 30342.00, 2489.00, 'টন', 'মোট উৎপাদন: 2489 টন, খরচ: 30342 টাকা, বিক্রয়: 6409175 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0035', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'চারঘাট', 'ইউনিয়ন 5', 'আমবাগান', '7710', 24.36000000, 91.84000000, 'pending', NULL, NULL, NULL, '2025-12-22 07:25:44', '2026-01-11 07:56:01', NULL),
(36, 1, 1, 36, 'আব্দুল করিম', 'কাঠালবাড়ী, ইউনিয়ন 6, চকরিয়া, কক্সবাজার', '01382937582', 2.11, 'বিঘা', NULL, '2026-01-05', 'নলকূপ', 'খরিফ', 'শসা', 'গোবর সার 29 কেজি', 'ইউরিয়া 19 কেজি, টিএসপি 8 কেজি', NULL, 4227.00, 5.73, 33767.00, 3054.00, 'মণ', 'মোট উৎপাদন: 3054 মণ, খরচ: 33767 টাকা, বিক্রয়: 12909258 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0036', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'কক্সবাজার', 'চকরিয়া', 'ইউনিয়ন 6', 'কাঠালবাড়ী', '3696', 22.40000000, 89.65000000, 'pending', NULL, NULL, NULL, '2026-01-05 03:32:55', '2026-01-11 07:56:01', NULL),
(37, 1, 1, 37, 'জাহাঙ্গীর আলম', 'শ্যামপুর, ইউনিয়ন 7, চকরিয়া, কক্সবাজার', '01846424934', 1.36, 'একর', NULL, '2025-12-20', 'পুকুর', 'খরিফ', 'পাট', '', 'ইউরিয়া 5 কেজি', 'আম গাছ 18 টি, কাঁঠাল গাছ 13 টি', 3378.00, 7.43, 45558.00, 4205.00, 'টন', 'মোট উৎপাদন: 4205 টন, খরচ: 45558 টাকা, বিক্রয়: 14204490 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0037', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'কক্সবাজার', 'চকরিয়া', 'ইউনিয়ন 7', 'শ্যামপুর', '9764', 22.84000000, 91.08000000, 'verified', NULL, '2025-12-19 21:00:00', 1, '2025-12-20 09:22:18', '2026-01-11 07:56:01', NULL),
(38, 1, 1, 38, 'শামসুন নাহার', 'বেলতলা, ইউনিয়ন 8, কয়রা, খুলনা', '01652699316', 1.62, 'একর', 'গরু 3 টি, ছাগল 7 টি', '2025-12-07', 'নলকূপ', 'রবি', 'পাট', 'সবুজ সার 23 কেজি', 'জৈব সার 38 কেজি', NULL, 4102.00, 7.25, 10414.00, 4666.00, 'টন', 'মোট উৎপাদন: 4666 টন, খরচ: 10414 টাকা, বিক্রয়: 19139932 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0038', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'খুলনা', 'কয়রা', 'ইউনিয়ন 8', 'বেলতলা', '2755', 24.70000000, 90.06000000, 'rejected', 'তথ্য যাচাই করে পুনরায় জমা দিন', NULL, NULL, '2025-12-07 11:21:52', '2026-01-11 07:56:01', NULL),
(39, 1, 1, 39, 'রেহানা আক্তার', 'আমবাগান, ইউনিয়ন 9, কালিয়াকৈর, গাজীপুর', '01729711477', 4.54, 'বিঘা', NULL, '2025-11-27', 'খাল', 'খরিফ-২', 'লিচু', '', 'টিএসপি 25 কেজি, জৈব সার 34 কেজি, জিপসাম 33 কেজি', NULL, 3525.00, 6.75, 39386.00, 901.00, 'মণ', 'মোট উৎপাদন: 901 মণ, খরচ: 39386 টাকা, বিক্রয়: 3176025 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0039', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'ঢাকা', 'গাজীপুর', 'কালিয়াকৈর', 'ইউনিয়ন 9', 'আমবাগান', '9490', 22.69000000, 89.82000000, 'verified', NULL, '2025-11-26 19:00:00', 1, '2025-11-27 02:36:46', '2026-01-11 07:56:01', NULL),
(40, 1, 1, 40, 'আব্দুল করিম', 'বাঁশবাড়ীয়া, ইউনিয়ন 10, পাইকগাছা, খুলনা', '01329587169', 0.89, 'কাঠা', NULL, '2025-11-30', 'বৃষ্টির পানি', 'খরিফ', 'ডাল', '', 'জৈব সার 46 কেজি, এমওপি 7 কেজি, এমওপি 19 কেজি', NULL, 3829.00, 7.00, 7631.00, 4514.00, 'মণ', 'মোট উৎপাদন: 4514 মণ, খরচ: 7631 টাকা, বিক্রয়: 17284106 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0040', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'খুলনা', 'পাইকগাছা', 'ইউনিয়ন 10', 'বাঁশবাড়ীয়া', '2735', 22.36000000, 91.81000000, 'pending', NULL, NULL, NULL, '2025-11-30 08:27:17', '2026-01-11 07:56:01', NULL),
(41, 1, 1, 41, 'শাহানা পারভীন', 'কামারপাড়া, ইউনিয়ন 1, আনোয়ারা, চট্টগ্রাম', '01675500363', 3.36, 'একর', 'গরু 2 টি, ছাগল 5 টি', '2025-12-08', 'খাল', 'খরিফ', 'আম', '', 'জৈব সার 41 কেজি, জৈব সার 13 কেজি', NULL, 2059.00, 7.19, 45643.00, 1153.00, 'কেজি', 'মোট উৎপাদন: 1153 কেজি, খরচ: 45643 টাকা, বিক্রয়: 2374027 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0041', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'চট্টগ্রাম', 'আনোয়ারা', 'ইউনিয়ন 1', 'কামারপাড়া', '4113', 24.94000000, 88.23000000, 'rejected', 'তথ্য যাচাই করে পুনরায় জমা দিন', NULL, NULL, '2025-12-08 06:30:15', '2026-01-11 07:56:01', NULL),
(42, 1, 1, 42, 'আব্দুল মান্নান', 'পুকুরপাড়, ইউনিয়ন 2, চৌগাছা, যশোর', '01392225437', 2.69, 'একর', 'গরু 3 টি, ছাগল 5 টি', '2025-12-30', 'পুকুর', 'খরিফ', 'কাঁঠাল', '', 'জিপসাম 26 কেজি', NULL, 2013.00, 5.69, 44390.00, 2008.00, 'মণ', 'মোট উৎপাদন: 2008 মণ, খরচ: 44390 টাকা, বিক্রয়: 4042104 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0042', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'যশোর', 'চৌগাছা', 'ইউনিয়ন 2', 'পুকুরপাড়', '4578', 24.76000000, 90.50000000, 'verified', NULL, '2025-12-30 01:00:00', 1, '2025-12-30 11:39:21', '2026-01-11 07:56:01', NULL),
(43, 1, 1, 43, 'আজিজুল হক', 'চাঁদপুর, ইউনিয়ন 3, পবা, রাজশাহী', '01524551811', 2.99, 'একর', 'গরু 4 টি, ছাগল 7 টি', '2026-01-05', 'খাল', 'খরিফ', 'গম', 'সবুজ সার 13 কেজি', 'জিপসাম 5 কেজি, এমওপি 46 কেজি', 'আম গাছ 19 টি, কাঁঠাল গাছ 10 টি', 2480.00, 6.24, 38112.00, 3061.00, 'কেজি', 'মোট উৎপাদন: 3061 কেজি, খরচ: 38112 টাকা, বিক্রয়: 7591280 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0043', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'রাজশাহী', 'পবা', 'ইউনিয়ন 3', 'চাঁদপুর', '2715', 25.68000000, 89.87000000, 'verified', NULL, '2026-01-05 03:00:00', 1, '2026-01-05 04:40:18', '2026-01-11 07:56:01', NULL),
(44, 1, 1, 44, 'নার্গিস আক্তার', 'মধুপুর, ইউনিয়ন 4, মনোহরদী, নরসিংদী', '01664350011', 4.28, 'একর', NULL, '2026-01-08', 'পুকুর', 'খরিফ', 'সরিষা', '', 'জৈব সার 42 কেজি, জৈব সার 48 কেজি, টিএসপি 46 কেজি', NULL, 1984.00, 5.93, 49513.00, 1375.00, 'কেজি', 'মোট উৎপাদন: 1375 কেজি, খরচ: 49513 টাকা, বিক্রয়: 2728000 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0044', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'ঢাকা', 'নরসিংদী', 'মনোহরদী', 'ইউনিয়ন 4', 'মধুপুর', '7045', 25.31000000, 89.05000000, 'pending', NULL, NULL, NULL, '2026-01-08 07:34:29', '2026-01-11 07:56:01', NULL),
(45, 1, 1, 45, 'আজিজুল হক', 'তেঁতুলতলা, ইউনিয়ন 5, গুরুদাসপুর, নাটোর', '01534146364', 4.62, 'একর', NULL, '2025-12-13', 'পুকুর', 'খরিফ', 'পাট', 'সবুজ সার 29 কেজি', 'ইউরিয়া 29 কেজি', NULL, 4681.00, 6.54, 48441.00, 3610.00, 'মণ', 'মোট উৎপাদন: 3610 মণ, খরচ: 48441 টাকা, বিক্রয়: 16898410 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0045', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'গুরুদাসপুর', 'ইউনিয়ন 5', 'তেঁতুলতলা', '7804', 23.27000000, 91.73000000, 'verified', NULL, '2025-12-14 14:00:00', 1, '2025-12-13 09:27:48', '2026-01-11 07:56:01', NULL),
(46, 1, 1, 46, 'রেহানা আক্তার', 'কাঠালবাড়ী, ইউনিয়ন 6, পাইকগাছা, খুলনা', '01791984903', 4.98, 'কাঠা', NULL, '2025-12-05', 'পুকুর', 'রবি', 'আম', '', 'জৈব সার 40 কেজি', 'আম গাছ 12 টি, কাঁঠাল গাছ 4 টি', 1451.00, 7.42, 29306.00, 4106.00, 'টন', 'মোট উৎপাদন: 4106 টন, খরচ: 29306 টাকা, বিক্রয়: 5957806 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2025-0046', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'খুলনা', 'পাইকগাছা', 'ইউনিয়ন 6', 'কাঠালবাড়ী', '3142', 22.71000000, 89.16000000, 'pending', NULL, NULL, NULL, '2025-12-05 12:37:52', '2026-01-11 07:56:01', NULL),
(47, 1, 1, 47, 'রহিমা বেগম', 'বাঁশবাড়ীয়া, ইউনিয়ন 7, লালপুর, নাটোর', '01346826428', 4.58, 'একর', NULL, '2026-01-03', 'নলকূপ', 'খরিফ-২', 'সরিষা', 'কম্পোস্ট 23 কেজি', 'টিএসপি 7 কেজি, টিএসপি 28 কেজি', 'আম গাছ 15 টি, কাঁঠাল গাছ 6 টি', 2237.00, 6.05, 24240.00, 2377.00, 'টন', 'মোট উৎপাদন: 2377 টন, খরচ: 24240 টাকা, বিক্রয়: 5317349 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0047', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'রাজশাহী', 'নাটোর', 'লালপুর', 'ইউনিয়ন 7', 'বাঁশবাড়ীয়া', '4556', 24.61000000, 88.83000000, 'verified', NULL, '2026-01-04 10:00:00', 1, '2026-01-03 10:54:51', '2026-01-11 07:56:02', NULL),
(48, 1, 1, 48, 'শিরিনা বেগম', 'জামবাগান, ইউনিয়ন 8, অভয়নগর, যশোর', '01854403961', 1.40, 'বিঘা', NULL, '2025-12-04', 'পুকুর', 'খরিফ-২', 'গম', 'গোবর সার 27 কেজি', 'টিএসপি 42 কেজি', NULL, 3827.00, 5.86, 19487.00, 2525.00, 'টন', 'মোট উৎপাদন: 2525 টন, খরচ: 19487 টাকা, বিক্রয়: 9663175 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2026', 'FDC-2026-0048', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'খুলনা', 'যশোর', 'অভয়নগর', 'ইউনিয়ন 8', 'জামবাগান', '6807', 22.45000000, 90.45000000, 'pending', NULL, NULL, NULL, '2025-12-04 06:27:28', '2026-01-11 07:56:02', NULL),
(49, 1, 1, 49, 'নাজমুল হক', 'সোনারপুর, ইউনিয়ন 9, উখিয়া, কক্সবাজার', '01944047036', 2.74, 'একর', NULL, '2025-12-27', 'নলকূপ', 'খরিফ', 'ডাল', '', 'ইউরিয়া 28 কেজি, জৈব সার 7 কেজি', 'আম গাছ 17 টি, কাঁঠাল গাছ 5 টি', 2597.00, 6.67, 8353.00, 2713.00, 'কেজি', 'মোট উৎপাদন: 2713 কেজি, খরচ: 8353 টাকা, বিক্রয়: 7045661 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', NULL, 'FDC-2026-0049', '2026', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'চট্টগ্রাম', 'কক্সবাজার', 'উখিয়া', 'ইউনিয়ন 9', 'সোনারপুর', '9201', 25.71000000, 90.29000000, 'pending', NULL, NULL, NULL, '2025-12-27 06:45:33', '2026-01-11 07:56:02', NULL),
(50, 1, 1, 50, 'ফাতেমা খাতুন', 'চরপাড়া, ইউনিয়ন 10, বাকেরগঞ্জ, বরিশাল', '01342301266', 3.49, 'একর', 'গরু 1 টি, ছাগল 7 টি', '2025-11-22', 'পুকুর', 'রবি', 'ডাল', '', 'ইউরিয়া 21 কেজি, টিএসপি 39 কেজি, ইউরিয়া 36 কেজি', NULL, 1171.00, 5.77, 11639.00, 4838.00, 'মণ', 'মোট উৎপাদন: 4838 মণ, খরচ: 11639 টাকা, বিক্রয়: 5665298 টাকা', 'ট্রাক্টর, পাওয়ার টিলার', 'আধুনিক কৃষি প্রশিক্ষণ 2025', 'FDC-2025-0050', '2025', 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।', 'বরিশাল', 'বরিশাল', 'বাকেরগঞ্জ', 'ইউনিয়ন 10', 'চরপাড়া', '2295', 22.74000000, 91.42000000, 'verified', NULL, '2025-11-23 18:00:00', 1, '2025-11-22 09:52:41', '2026-01-11 07:56:02', NULL),
(51, 39, 29, NULL, 'Farmer #29', NULL, NULL, NULL, 'decimal', NULL, NULL, 'খাল', 'খরিফ-২', NULL, NULL, NULL, NULL, 34.00, NULL, NULL, 244.00, 'kg', NULL, NULL, NULL, NULL, '2026', NULL, NULL, NULL, NULL, NULL, 'পাঁচপাড়া', 'চন্দ্রগঞ্জ', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-01-11 09:52:09', '2026-01-11 09:52:09', NULL),
(52, 39, NULL, NULL, 'ইসমাইল বেপারী', 'বশিরাবাজার', '01897193833', NULL, 'decimal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kg', NULL, NULL, NULL, NULL, '2026', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2026-01-11 11:02:50', '2026-01-11 11:02:50', NULL),
(53, 39, 29, NULL, 'মোফাসসেল আলম মারুফ', 'গ্রাম: পাঁচপাড়া, ডাকঘর: চন্দ্রগঞ্জ, উপজেলা: লক্ষ্মীপুর সদর, জেলা: লক্ষ্মীপুর, বিভাগ: চট্টগ্রাম', '01997900840', NULL, 'decimal', NULL, NULL, NULL, 'জায়েদ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 423.00, 'kg', NULL, NULL, NULL, NULL, '2026', NULL, NULL, NULL, NULL, NULL, 'পাঁচপাড়া', 'চন্দ্রগঞ্জ', NULL, NULL, 'pending', NULL, NULL, NULL, '2026-01-11 11:39:54', '2026-01-11 11:39:54', NULL),
(54, 39, NULL, 52, 'ইসমাইল বেপারী', NULL, '01897193833', NULL, 'decimal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kg', NULL, NULL, NULL, NULL, '2026', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2026-01-11 11:41:48', '2026-01-11 11:41:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `field_data_farmers`
--

CREATE TABLE `field_data_farmers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `nid_number` varchar(20) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `upazila` varchar(100) DEFAULT NULL,
  `occupation` varchar(100) NOT NULL DEFAULT 'কৃষক',
  `land_ownership` varchar(50) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `field_data_farmers`
--

INSERT INTO `field_data_farmers` (`id`, `full_name`, `nid_number`, `phone`, `email`, `date_of_birth`, `father_name`, `mother_name`, `address`, `district`, `upazila`, `occupation`, `land_ownership`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'নাজমা বেগম', '9496961729', '01689093691', NULL, '1964-01-11', 'শাহানা পারভীন', 'নাজমা বেগম', 'পাথরঘাটা, ইউনিয়ন 1, অভয়নগর, যশোর', 'যশোর', 'অভয়নগর', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:55:59', '2026-01-11 07:55:59'),
(2, 'জাহাঙ্গীর আলম', '7833724133', '01888018727', NULL, '2001-01-11', 'হাবিবুর রহমান', 'মিজানুর রহমান', 'আমবাগান, ইউনিয়ন 2, ঝিকরগাছা, যশোর', 'যশোর', 'ঝিকরগাছা', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:55:59', '2026-01-11 07:55:59'),
(3, 'সালমা আক্তার', '7806813340', '01895564762', NULL, '1963-01-11', 'রহিমা বেগম', 'আশরাফুল আলম', 'কামারপাড়া, ইউনিয়ন 3, কলাপাড়া, পটুয়াখালী', 'পটুয়াখালী', 'কলাপাড়া', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:55:59', '2026-01-11 07:55:59'),
(4, 'মোস্তাফিজুর রহমান', '2435610448', '01771022296', NULL, '1971-01-11', 'আব্দুল করিম', 'সালেহা বেগম', 'তেঁতুলতলা, ইউনিয়ন 4, বাকেরগঞ্জ, বরিশাল', 'বরিশাল', 'বাকেরগঞ্জ', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(5, 'নাসরিন জাহান', '7998290428', '01314664266', NULL, '1987-01-11', 'পারভিন সুলতানা', 'লায়লা আক্তার', 'তেঁতুলতলা, ইউনিয়ন 5, অভয়নগর, যশোর', 'যশোর', 'অভয়নগর', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(6, 'আজিজুল হক', '7982764343', '01954337894', NULL, '1987-01-11', 'নাজনিন আক্তার', 'নাসরিন জাহান', 'ঘাটপাড়া, ইউনিয়ন 6, বড়াইগ্রাম, নাটোর', 'নাটোর', 'বড়াইগ্রাম', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(7, 'মনিরুল ইসলাম', '9945075671', '01310037739', NULL, '1987-01-11', 'হাবিবুর রহমান', 'হাবিবুর রহমান', 'আমবাগান, ইউনিয়ন 7, রায়পুরা, নরসিংদী', 'নরসিংদী', 'রায়পুরা', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(8, 'রফিকুল ইসলাম', '7963346096', '01890873432', NULL, '1992-01-11', 'সালেহা বেগম', 'নাজমুল হক', 'ঘাটপাড়া, ইউনিয়ন 8, পাইকগাছা, খুলনা', 'খুলনা', 'পাইকগাছা', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(9, 'নার্গিস আক্তার', '3045311932', '01854944276', NULL, '1963-01-11', 'জাকিয়া সুলতানা', 'মরিয়ম আক্তার', 'শ্যামপুর, ইউনিয়ন 9, বড়াইগ্রাম, নাটোর', 'নাটোর', 'বড়াইগ্রাম', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(10, 'রোকেয়া খাতুন', '7754580770', '01395927334', NULL, '1962-01-11', 'জাকিয়া সুলতানা', 'ইউনুস আলী', 'জামবাগান, ইউনিয়ন 10, দোহার, ঢাকা', 'ঢাকা', 'দোহার', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(11, 'আব্দুর রহমান', '2124003764', '01860610932', NULL, '1967-01-11', 'শামসুন নাহার', 'ফারজানা পারভীন', 'জামবাগান, ইউনিয়ন 1, উখিয়া, কক্সবাজার', 'কক্সবাজার', 'উখিয়া', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(12, 'মোহাম্মদ শফিকুল', '8608416238', '01962354172', NULL, '1977-01-11', 'ফারজানা পারভীন', 'তাসলিমা আক্তার', 'মধুপুর, ইউনিয়ন 2, টেকনাফ, কক্সবাজার', 'কক্সবাজার', 'টেকনাফ', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(13, 'নাজনিন আক্তার', '7962093800', '01438657875', NULL, '1994-01-11', 'সুলতানা রহমান', 'মনিরুল ইসলাম', 'চাঁদপুর, ইউনিয়ন 3, আগৈলঝাড়া, বরিশাল', 'বরিশাল', 'আগৈলঝাড়া', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(14, 'রওশন আরা', '2229236923', '01797107875', NULL, '1966-01-11', 'আবুল কালাম', 'ফারজানা পারভীন', 'মধুপুর, ইউনিয়ন 4, টেকনাফ, কক্সবাজার', 'কক্সবাজার', 'টেকনাফ', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(15, 'হাবিবুর রহমান', '5069780105', '01934800951', NULL, '1991-01-11', 'মোখলেসুর রহমান', 'শামসুন নাহার', 'হাটবাজার, ইউনিয়ন 5, উখিয়া, কক্সবাজার', 'কক্সবাজার', 'উখিয়া', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(16, 'রওশন আরা', '8237459222', '01837174606', NULL, '1997-01-11', 'ইউনুস আলী', 'ফারজানা পারভীন', 'চাঁদপুর, ইউনিয়ন 6, মনোহরদী, নরসিংদী', 'নরসিংদী', 'মনোহরদী', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(17, 'রুবিনা আক্তার', '5184918348', '01944931155', NULL, '1981-01-11', 'সালেহা বেগম', 'শাহানা পারভীন', 'হাটবাজার, ইউনিয়ন 7, ডুমুরিয়া, খুলনা', 'খুলনা', 'ডুমুরিয়া', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(18, 'তাসলিমা আক্তার', '3805307132', '01567841542', NULL, '1984-01-11', 'কামাল হোসেন', 'জাহিদুল ইসলাম', 'মধুপুর, ইউনিয়ন 8, তানোর, রাজশাহী', 'রাজশাহী', 'তানোর', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(19, 'রহিমা বেগম', '6190072847', '01555317943', NULL, '1968-01-11', 'আলমগীর হোসেন', 'মিজানুর রহমান', 'জামবাগান, ইউনিয়ন 9, শিবপুর, নরসিংদী', 'নরসিংদী', 'শিবপুর', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(20, 'হাবিবুর রহমান', '2100533552', '01691417423', NULL, '1989-01-11', 'পারভিন সুলতানা', 'নুরুল আমিন', 'রামপুর, ইউনিয়ন 10, বোয়ালখালী, চট্টগ্রাম', 'চট্টগ্রাম', 'বোয়ালখালী', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(21, 'মরিয়ম আক্তার', '9361925490', '01924706921', NULL, '1962-01-11', 'ফাতেমা খাতুন', 'রহিমা বেগম', 'ঘাটপাড়া, ইউনিয়ন 1, বোয়ালখালী, চট্টগ্রাম', 'চট্টগ্রাম', 'বোয়ালখালী', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(22, 'জাহিদুল ইসলাম', '5826566143', '01310100150', NULL, '1978-01-11', 'মনিরুল ইসলাম', 'মোহাম্মদ আলী', 'পুকুরপাড়, ইউনিয়ন 2, বাবুগঞ্জ, বরিশাল', 'বরিশাল', 'বাবুগঞ্জ', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(23, 'ফাতেমা খাতুন', '1301573196', '01547108442', NULL, '1998-01-11', 'মরিয়ম আক্তার', 'আলমগীর হোসেন', 'চরপাড়া, ইউনিয়ন 3, তানোর, রাজশাহী', 'রাজশাহী', 'তানোর', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(24, 'নার্গিস আক্তার', '8299123147', '01686851631', NULL, '1987-01-11', 'রুবিনা আক্তার', 'মোখলেসুর রহমান', 'জামবাগান, ইউনিয়ন 4, টেকনাফ, কক্সবাজার', 'কক্সবাজার', 'টেকনাফ', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(25, 'মোহাম্মদ আলী', '5116706254', '01372075299', NULL, '1967-01-11', 'নাজমুল হক', 'সালেহা বেগম', 'মধুপুর, ইউনিয়ন 5, বাবুগঞ্জ, বরিশাল', 'বরিশাল', 'বাবুগঞ্জ', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(26, 'আব্দুল মান্নান', '7761465412', '01478445484', NULL, '1962-01-11', 'হাসিনা খাতুন', 'কামাল হোসেন', 'জামবাগান, ইউনিয়ন 6, শ্রীপুর, গাজীপুর', 'গাজীপুর', 'শ্রীপুর', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(27, 'রুবিনা আক্তার', '3727842300', '01713481349', NULL, '1997-01-11', 'মোহাম্মদ শফিকুল', 'ইউনুস আলী', 'বাদলপুর, ইউনিয়ন 7, টেকনাফ, কক্সবাজার', 'কক্সবাজার', 'টেকনাফ', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(28, 'মনিরুল ইসলাম', '7855720956', '01893548306', NULL, '1996-01-11', 'রুবিনা আক্তার', 'শিরিনা বেগম', 'ঘাটপাড়া, ইউনিয়ন 8, বড়াইগ্রাম, নাটোর', 'নাটোর', 'বড়াইগ্রাম', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(29, 'সালেহা বেগম', '8120012576', '01354498252', NULL, '1961-01-11', 'হাসিনা খাতুন', 'পারভিন সুলতানা', 'আমবাগান, ইউনিয়ন 9, কলাপাড়া, পটুয়াখালী', 'পটুয়াখালী', 'কলাপাড়া', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(30, 'আব্দুল মান্নান', '9491053645', '01799642811', NULL, '1978-01-11', 'মোখলেসুর রহমান', 'নার্গিস আক্তার', 'নারিকেলবাড়ী, ইউনিয়ন 10, দোহার, ঢাকা', 'ঢাকা', 'দোহার', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(31, 'রফিকুল ইসলাম', '6632011227', '01852392159', NULL, '1981-01-11', 'নুরুল আমিন', 'সালমা আক্তার', 'তেঁতুলতলা, ইউনিয়ন 1, মনোহরদী, নরসিংদী', 'নরসিংদী', 'মনোহরদী', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(32, 'মোহাম্মদ শফিকুল', '3768276849', '01532481809', NULL, '1967-01-11', 'সুমাইয়া খাতুন', 'আব্দুল করিম', 'চরপাড়া, ইউনিয়ন 2, ডুমুরিয়া, খুলনা', 'খুলনা', 'ডুমুরিয়া', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(33, 'আনোয়ার হোসেন', '2356277661', '01487291145', NULL, '1992-01-11', 'সাবিনা ইয়াসমিন', 'সালেহা বেগম', 'চরপাড়া, ইউনিয়ন 3, ঝিকরগাছা, যশোর', 'যশোর', 'ঝিকরগাছা', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(34, 'রহিমা বেগম', '1556766987', '01389826502', NULL, '1990-01-11', 'শামসুন নাহার', 'শামসুন নাহার', 'জামবাগান, ইউনিয়ন 4, ডুমুরিয়া, খুলনা', 'খুলনা', 'ডুমুরিয়া', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(35, 'লায়লা আক্তার', '4251086508', '01964097553', NULL, '1998-01-11', 'নার্গিস আক্তার', 'নাসরিন জাহান', 'চরপাড়া, ইউনিয়ন 5, আগৈলঝাড়া, বরিশাল', 'বরিশাল', 'আগৈলঝাড়া', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(36, 'সুলতানা রহমান', '7897832141', '01494220581', NULL, '1978-01-11', 'আলমগীর হোসেন', 'আব্দুল মান্নান', 'কামারপাড়া, ইউনিয়ন 6, অভয়নগর, যশোর', 'যশোর', 'অভয়নগর', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(37, 'আবুল কালাম', '6511425368', '01317239378', NULL, '1988-01-11', 'ইউনুস আলী', 'রহিমা বেগম', 'শ্যামপুর, ইউনিয়ন 7, অভয়নগর, যশোর', 'যশোর', 'অভয়নগর', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(38, 'সাবিনা ইয়াসমিন', '7893190215', '01981641251', NULL, '1961-01-11', 'সাবিনা ইয়াসমিন', 'আশরাফুল আলম', 'মধুপুর, ইউনিয়ন 8, সাভার, ঢাকা', 'ঢাকা', 'সাভার', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(39, 'শাহানা পারভীন', '3527545238', '01510533809', NULL, '1987-01-11', 'মোখলেসুর রহমান', 'হাসিনা খাতুন', 'নদীপাড়া, ইউনিয়ন 9, বাউফল, পটুয়াখালী', 'পটুয়াখালী', 'বাউফল', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(40, 'মরিয়ম আক্তার', '6884661720', '01457666592', NULL, '1998-01-11', 'রুবিনা আক্তার', 'ইউনুস আলী', 'আমবাগান, ইউনিয়ন 10, বাকেরগঞ্জ, বরিশাল', 'বরিশাল', 'বাকেরগঞ্জ', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(41, 'মরিয়ম আক্তার', '5028031349', '01592409885', NULL, '1996-01-11', 'নাজনিন আক্তার', 'শাহজাহান আলী', 'শ্যামপুর, ইউনিয়ন 1, দিঘলিয়া, খুলনা', 'খুলনা', 'দিঘলিয়া', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(42, 'শাহানা পারভীন', '6031318543', '01486452847', NULL, '1986-01-11', 'নাজমা বেগম', 'সুলতানা রহমান', 'আমবাগান, ইউনিয়ন 2, চারঘাট, রাজশাহী', 'রাজশাহী', 'চারঘাট', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(43, 'তাসলিমা আক্তার', '4988191348', '01968525060', NULL, '1976-01-11', 'শামীম আহমেদ', 'হাবিবুর রহমান', 'তেঁতুলতলা, ইউনিয়ন 3, পাইকগাছা, খুলনা', 'খুলনা', 'পাইকগাছা', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(44, 'মোহাম্মদ শফিকুল', '5790111803', '01861313359', NULL, '1997-01-11', 'ফারজানা পারভীন', 'সাইফুল ইসলাম', 'সোনারপুর, ইউনিয়ন 4, মনোহরদী, নরসিংদী', 'নরসিংদী', 'মনোহরদী', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(45, 'মোখলেসুর রহমান', '9399183406', '01965452216', NULL, '1987-01-11', 'শামীম আহমেদ', 'তাসলিমা আক্তার', 'কামারপাড়া, ইউনিয়ন 5, গলাচিপা, পটুয়াখালী', 'পটুয়াখালী', 'গলাচিপা', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(46, 'মরিয়ম আক্তার', '1297789592', '01660234502', NULL, '1993-01-11', 'মনিরুল ইসলাম', 'সাইফুল ইসলাম', 'বাঁশবাড়ীয়া, ইউনিয়ন 6, আগৈলঝাড়া, বরিশাল', 'বরিশাল', 'আগৈলঝাড়া', 'কৃষক', 'নিজস্ব', 1, '2026-01-11 07:56:00', '2026-01-11 07:56:00'),
(47, 'লায়লা আক্তার', '1041497104', '01825692596', NULL, '1985-01-11', 'ফারজানা পারভীন', 'হাসিনা খাতুন', 'ঘাটপাড়া, ইউনিয়ন 7, চকরিয়া, কক্সবাজার', 'কক্সবাজার', 'চকরিয়া', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:01', '2026-01-11 07:56:01'),
(48, 'রহিমা বেগম', '8086198044', '01579108561', NULL, '1983-01-11', 'আব্দুল করিম', 'সাইফুল ইসলাম', 'কামারপাড়া, ইউনিয়ন 8, বানারীপাড়া, বরিশাল', 'বরিশাল', 'বানারীপাড়া', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:01', '2026-01-11 07:56:01'),
(49, 'ফাতেমা খাতুন', '7312278323', '01975264844', NULL, '1990-01-11', 'মোস্তাফিজুর রহমান', 'হাবিবুর রহমান', 'হাটবাজার, ইউনিয়ন 9, পবা, রাজশাহী', 'রাজশাহী', 'পবা', 'কৃষক', 'ইজারা', 1, '2026-01-11 07:56:01', '2026-01-11 07:56:01'),
(50, 'সুলতানা রহমান', '5405195383', '01518470251', NULL, '1994-01-11', 'রফিকুল ইসলাম', 'নাজমুল হক', 'পুকুরপাড়, ইউনিয়ন 10, দিঘলিয়া, খুলনা', 'খুলনা', 'দিঘলিয়া', 'কৃষক', 'ভাগচাষ', 1, '2026-01-11 07:56:01', '2026-01-11 07:56:01'),
(51, 'ইসমাইল বেপারী', '০৪৩৫৬০৯৮৫৪', '01897193833', 'jenyfa776@gmail.com', NULL, 'গিয়াস উদ্দিন', 'ফাতেমা আক্তার', 'বশিরাবাজার', 'কুমিল্লা', 'কুমিরা', 'কৃষক', 'Bangladesh', 39, '2026-01-11 10:52:52', '2026-01-11 10:52:52'),
(52, 'ইসমাইল বেপারী', '০৪৩৫৬০৯৮৫৪', '01897193833', 'jenyfa776@gmail.com', '0199-12-04', 'গিয়াস উদ্দিন', 'ফাতেমা আক্তার', NULL, 'রাজশাহী', 'কুমিরা', 'কৃষক', 'Bangladesh', 39, '2026-01-11 11:41:48', '2026-01-11 11:41:48');

-- --------------------------------------------------------

--
-- Table structure for table `field_data_reports`
--

CREATE TABLE `field_data_reports` (
  `report_id` int(11) NOT NULL,
  `data_operator_id` int(11) NOT NULL,
  `postal_code` int(11) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `weather_condition` varchar(50) DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `rainfall` decimal(5,2) DEFAULT NULL,
  `crop_condition` text DEFAULT NULL,
  `pest_disease` text DEFAULT NULL,
  `soil_moisture` varchar(50) DEFAULT NULL,
  `irrigation_status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `report_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `postal_code` int(11) NOT NULL,
  `post_office` varchar(45) NOT NULL,
  `post_office_bn` varchar(100) DEFAULT NULL,
  `upazila` varchar(45) NOT NULL,
  `upazila_bn` varchar(100) DEFAULT NULL,
  `district` varchar(45) NOT NULL,
  `district_bn` varchar(100) DEFAULT NULL,
  `division` varchar(45) NOT NULL,
  `division_bn` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`postal_code`, `post_office`, `post_office_bn`, `upazila`, `upazila_bn`, `district`, `district_bn`, `division`, `division_bn`) VALUES
(1000, 'Dhaka GPO', 'ঢাকা জিপিও', 'Palton', 'পল্টন', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1100, 'Dhaka Sadar HO', 'ঢাকা সদর এইচও', 'Sutrapur', 'সূত্রাপুর', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1203, 'Wari TSO', 'ওয়ারী টিএসও', 'Sutrapur', 'সূত্রাপুর', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1204, 'Gendaria TSO', 'গেন্ডারিয়া টিএসও', 'Sutrapur', 'সূত্রাপুর', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1205, 'New Market TSO', 'নিউ মার্কেট টিএসও', 'New market', 'নিউমার্কেট', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1206, 'Dhaka Cantonment TSO', 'ঢাকা ক্যান্টনমেন্ট টিএসও', 'Dhaka Cantt.', 'ঢাকা ক্যান্ট।', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1207, 'Mohammadpur Housing', 'মোহাম্মদপুর হাউজিং', 'Mohammadpur', 'মোহাম্মদপুর', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1208, 'Dhaka Politechnic', 'ঢাকা পলিটেকনিক', 'Tejgaon Industrial Area', 'তেজগাঁও শিল্প এলাকা', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1209, 'Jigatala TSO', 'জিগাতলা টিএসও', 'Dhanmondi', 'ধানমন্ডি', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1211, 'Posta TSO', 'পোস্তা টিএসও', 'Lalbag', 'লালবাগ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1212, 'Gulshan Model Town', 'গুলশান মডেল টাউন', 'Gulshan', 'গুলশান', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1213, 'Banani TSO', 'বনানী টিএসও', 'Gulshan', 'গুলশান', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1214, 'Basabo TSO', 'বাসাবো টিএসও', 'Sabujbag', 'সবুজবাগ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1215, 'Tejgaon TSO', 'তেজগাঁও টিএসও', 'Tejgaon', 'তেজগাঁও', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1216, 'Mirpur TSO', 'মিরপুর টিএসও', 'Mirpur', 'মিরপুর', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1217, 'Shantinagr TSO', 'শান্তিনগর টিএসও', 'Ramna', 'রমনা', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1219, 'Khilgaon TSO', 'খিলগাঁও টিএসও', 'Khilgaon', 'খিলগাঁও', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1222, 'Bangabhaban TSO', 'বঙ্গভবন টিএসও', 'Motijheel', 'মতিঝিল', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1223, 'Dilkusha TSO', 'দিলকুশা টিএসও', 'Motijheel', 'মতিঝিল', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1225, 'Sangsad Bhaban TSO', 'সংসদ ভবন টিএসও', 'Mohammadpur', 'মোহাম্মদপুর', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1229, 'Khilkhet TSO', 'খিলক্ষেত টিএসও', 'Khilkhet', 'খিলক্ষেত', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1230, 'Uttara Model Twon TSO', 'উত্তরা মডেল টাউন টিএসও', 'Uttara', 'উত্তরা', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1232, 'Dhania TSO', 'ধনিয়া টিএসও', 'Jatrabari', 'যাত্রাবাড়ী', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1310, 'Keraniganj', 'কেরানীগঞ্জ', 'Keraniganj', 'কেরানীগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1311, 'Dhaka Jute Mills', 'ঢাকা জুট মিলস', 'Keraniganj', 'কেরানীগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1312, 'Ati', 'আটি', 'Keraniganj', 'কেরানীগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1313, 'Kalatia', 'কলাতিয়া', 'Keraniganj', 'কেরানীগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1320, 'Nawabganj', 'নবাবগঞ্জ', 'Nawabganj', 'নবাবগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1321, 'Hasnabad', 'হাসনাবাদ', 'Nawabganj', 'নবাবগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1322, 'Daudpur', 'দাউদপুর', 'Nawabganj', 'নবাবগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1323, 'Agla', 'আগলা', 'Nawabganj', 'নবাবগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1324, 'Khalpar', 'খালপাড়', 'Nawabganj', 'নবাবগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1325, 'Churain', 'কুরান', 'Nawabganj', 'নবাবগঞ্জ', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1330, 'Joypara', 'জয়পাড়া', 'Joypara', 'জয়পাড়া', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1331, 'Palamganj', 'পলমগঞ্জ', 'Joypara', 'জয়পাড়া', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1332, 'Narisha', 'নারিশা', 'Joypara', 'জয়পাড়া', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1333, 'Haridia', 'হারিদিয়া', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1334, 'Gouragonj', 'গৌউরাগঞ্জ', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1335, 'Madini Mandal', 'খনিজ মন্ডল', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1340, 'Savar', 'সাভার', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1341, 'Dairy Farm', 'দুগ্ধ খামার', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1342, 'Jahangirnagar University', 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1343, 'Saver P.A.T.C', 'সাভার পিএটিসি', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1344, 'Savar Canttonment', 'সাভার ক্যান্টনমেন্ট', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1345, 'Shimulia', 'শিমুলিয়া', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1346, 'Kashem Cotton Mills', 'কাশেম কটন মিলস', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1347, 'Rajphulbaria', 'রাজফুলবাড়িয়া', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1348, 'Amin Bazar', 'আমিন বাজার', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1349, 'EPZ', 'ইপিজেড', 'Savar', 'সাভার', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1350, 'Dhamrai', 'ধামরাই', 'Dhamrai', 'ধামরাই', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1351, 'Kamalpur', 'কমলপুর', 'Dhamrai', 'ধামরাই', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1360, 'Demra', 'ডেমরা', 'Demra', 'ডেমরা', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1361, 'Sarulia', 'সারুলিয়া', 'Demra', 'ডেমরা', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1362, 'Matuail', 'মাতুয়াইল', 'Demra', 'ডেমরা', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা'),
(1400, 'Narayanganj Sadar', 'নারায়ণগঞ্জ সদর', 'Narayanganj Sadar', 'নারায়ণগঞ্জ সদর', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1410, 'Bandar', 'বন্দর', 'Bandar', 'বন্দর', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1411, 'D.C Mills', 'ডিসি মিলস', 'Bandar', 'বন্দর', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1412, 'Nabiganj', 'নবীগঞ্জ', 'Bandar', 'বন্দর', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1413, 'BIDS', 'বিআইডিএস', 'Bandar', 'বন্দর', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1414, 'Madanganj', 'মদনগঞ্জ', 'Bandar', 'বন্দর', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1420, 'Fatullah', 'ফতুল্লাহ', 'Fatullah', 'ফতুল্লাহ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1421, 'Fatulla Bazar', 'ফতুল্লা বাজার', 'Fatullah', 'ফতুল্লাহ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1430, 'Siddirganj', 'সিদ্ধিরগঞ্জ', 'Siddirganj', 'সিদ্ধিরগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1431, 'Adamjeenagar', 'আদমজীনগর', 'Siddirganj', 'সিদ্ধিরগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1432, 'LN Mills', 'এলএন মিলস', 'Siddirganj', 'সিদ্ধিরগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1440, 'Baidder Bazar', 'বাইদ্দার বাজার', 'Baidder Bazar', 'বাইদ্দার বাজার', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1441, 'Bara Nagar', 'বড় নগর', 'Baidder Bazar', 'বাইদ্দার বাজার', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1442, 'Barodi', 'প্যারোডি', 'Baidder Bazar', 'বাইদ্দার বাজার', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1450, 'Araihazar', 'আড়াইহাজার', 'Araihazar', 'আড়াইহাজার', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1451, 'Gopaldi', 'গোপালদী', 'Araihazar', 'আড়াইহাজার', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1460, 'Rupganj', 'রূপগঞ্জ', 'Rupganj', 'রূপগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1461, 'Kanchan', 'কাঞ্চন', 'Rupganj', 'রূপগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1462, 'Bhulta', 'ভুল্টা', 'Rupganj', 'রূপগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1463, 'Nagri', 'বিদেশী', 'Rupganj', 'রূপগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1464, 'Murapara', 'মুরাপাড়া', 'Rupganj', 'রূপগঞ্জ', 'Narayanganj', 'নারায়ণগঞ্জ', 'Dhaka', 'ঢাকা'),
(1500, 'Munshiganj Sadar', 'মুন্সীগঞ্জ সদর', 'Munshiganj Sadar', 'মুন্সীগঞ্জ সদর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1501, 'Rikabibazar', 'রিকাবিবাজার', 'Munshiganj Sadar', 'মুন্সীগঞ্জ সদর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1502, 'Mirkadim', 'মিরকাদিম', 'Munshiganj Sadar', 'মুন্সীগঞ্জ সদর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1503, 'Kathakhali', 'সেটাই', 'Munshiganj Sadar', 'মুন্সীগঞ্জ সদর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1510, 'Gajaria', 'গজারিয়া', 'Gajaria', 'গজারিয়া', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1511, 'Hossendi', 'হোসেন্দি', 'Gajaria', 'গজারিয়া', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1512, 'Rasulpur', 'রসুলপুর', 'Gajaria', 'গজারিয়া', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1520, 'Tangibari', 'টঙ্গিবাড়ি', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1521, 'Betkahat', 'বেতকহাতে', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1522, 'Baligao', 'বালিগাও', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1523, 'Bajrajugini', 'বজ্রযুগিনী', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1524, 'Hasail', 'গাধা', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1525, 'Dighirpar', 'দীঘিরপাড়', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1526, 'Pura EDSO', 'পুরা ইডিএসও', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1527, 'Pura', 'পুরা', 'Tangibari', 'টঙ্গিবাড়ি', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1530, 'Lohajang', 'লৌহজং', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1531, 'Korhati', 'কোরহাটি', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1532, 'Haldia SO', 'হালদিয়া এসও', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1533, 'Haridia DESO', 'হরিদিয়া ডিএসও', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1534, 'Gouragonj', 'গৌউরাগঞ্জ', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1535, 'Medini Mandal EDSO', 'মেদিনী মন্ডল ইডিএসও', 'Lohajong', 'লৌহজং', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1540, 'Sirajdikhan', 'সিরাজদিখান', 'Sirajdikhan', 'সিরাজদিখান', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1541, 'Kola', 'কোলা', 'Sirajdikhan', 'সিরাজদিখান', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1542, 'Ichapur', 'ইছাপুর', 'Sirajdikhan', 'সিরাজদিখান', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1543, 'Malkha Nagar', 'মালখা নগর', 'Sirajdikhan', 'সিরাজদিখান', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1544, 'Shekher Nagar', 'শেখর নগর', 'Sirajdikhan', 'সিরাজদিখান', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1550, 'Srinagar', 'শ্রীনগর', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1551, 'Barikhal', 'বারিখাল', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1552, 'Mazpara', 'মাজপাড়া', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1553, 'Hashara', 'একটি পোকা', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1554, 'Kolapara', 'কোলাপাড়া', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1555, 'Kumarbhog', 'কুমারভোগ', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1556, 'Vaggyakul SO', 'ভাগ্যকুল এসও', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1557, 'Baghra', 'বাঘরা', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1558, 'Bhaggyakul', 'ভাগ্যকুল', 'Srinagar', 'শ্রীনগর', 'Munshiganj', 'মুন্সিগঞ্জ', 'Dhaka', 'ঢাকা'),
(1600, 'Narshingdi Sadar', 'নরসিংদী সদর', 'Narshingdi Sadar', 'নরসিংদী সদর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1601, 'UMC Jute Mills', 'ইউএমসি জুট মিলস', 'Narshingdi Sadar', 'নরসিংদী সদর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1602, 'Narshingdi College', 'নরসিংদী কলেজ', 'Narshingdi Sadar', 'নরসিংদী সদর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1603, 'Panchdona', 'পাঁচদোনা', 'Narshingdi Sadar', 'নরসিংদী সদর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1604, 'Madhabdi', 'মাধবী', 'Narshingdi Sadar', 'নরসিংদী সদর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1605, 'Karimpur', 'করিমপুর', 'Narshingdi Sadar', 'নরসিংদী সদর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1610, 'Palash', 'পলাশ', 'Palash', 'পলাশ', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1611, 'Ghorashal Urea Facto', 'ঘোড়াশাল ইউরিয়া ফ্যাক্টরি', 'Palash', 'পলাশ', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1612, 'Char Sindhur', 'চর সিন্দুর', 'Palash', 'পলাশ', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1613, 'Ghorashal', 'ঘোড়াশাল', 'Palash', 'পলাশ', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1620, 'Shibpur', 'শিবপুর', 'Shibpur', 'শিবপুর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1630, 'Raypura', 'রায়পুর', 'Raypura', 'রায়পুর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1631, 'Bazar Hasnabad', 'বাজার হাসনাবাদ', 'Raypura', 'রায়পুর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1632, 'Radhaganj bazar', 'রাধাগঞ্জ বাজার', 'Raypura', 'রায়পুর', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1640, 'Belabo', 'বেলাবো', 'Belabo', 'বেলাবো', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1650, 'Monohordi', 'মনোকর্ডস', 'Monohordi', 'মনোকর্ডস', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1651, 'Hatirdia', 'আমি দুঃখিত', 'Monohordi', 'মনোকর্ডস', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1652, 'Katabaria', 'কাটাবাড়িয়া', 'Monohordi', 'মনোকর্ডস', 'Narsingdi', 'নরসিংদী', 'Dhaka', 'ঢাকা'),
(1700, 'Gazipur Sadar', 'গাজীপুর সদর', 'Gazipur Sadar', 'গাজীপুর সদর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1701, 'B.R.R', 'বিআরআর', 'Gazipur Sadar', 'গাজীপুর সদর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1702, 'Chandna', 'চান্দনা', 'Gazipur Sadar', 'গাজীপুর সদর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1703, 'B.O.F', 'বিওএফ', 'Gazipur Sadar', 'গাজীপুর সদর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1704, 'National University', 'জাতীয় বিশ্ববিদ্যালয়', 'Gazipur Sadar', 'গাজীপুর সদর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1710, 'Monnunagar', 'মন্নু নগর', 'Monnunagar', 'মন্নু নগর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1711, 'Nishat Nagar', 'নিশাত নগর', 'Monnunagar', 'মন্নু নগর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1712, 'Ershad Nagar', 'এরশাদ নগর', 'Monnunagar', 'মন্নু নগর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1720, 'Kaliganj', 'কালীগঞ্জ', 'Kaliganj', 'কালীগঞ্জ', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1721, 'Pubail', 'পুবাইল', 'Kaliganj', 'কালীগঞ্জ', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1722, 'Santanpara', 'সান্তানপাড়া', 'Kaliganj', 'কালীগঞ্জ', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1723, 'Vaoal Jamalpur', 'ভাওয়াল জামালপুর', 'Kaliganj', 'কালীগঞ্জ', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1730, 'kapashia', 'কাপশি', 'Kapashia', 'কেটে ফেলুন', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1740, 'Sreepur', 'শ্রীপুর', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1741, 'Rajendrapur', 'রাজেন্দ্রপুর', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1742, 'Rajendrapur Canttome', 'রাজেন্দ্রপুর ক্যান্টনমেন্ট', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1743, 'Barmi', 'বার্ম', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1744, 'Satkhamair', 'সাতখামাইর', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1745, 'Kawraid', 'কাওরাইদ', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1747, 'Bashamur', 'বাশমুর', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1748, 'Boubi', 'বউবি', 'Sreepur', 'শ্রীপুর', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1750, 'Kaliakaar', 'কালিয়াকার', 'Kaliakaar', 'কালিয়াকার', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1751, 'Safipur', 'সফিপুর', 'Kaliakaar', 'কালিয়াকার', 'Gazipur', 'গাজীপুর', 'Dhaka', 'ঢাকা'),
(1800, 'Manikganj Sadar', 'মানিকগঞ্জ সদর', 'Manikganj Sadar', 'মানিকগঞ্জ সদর', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1801, 'Manikganj Bazar', 'মানিকগঞ্জ বাজার', 'Manikganj Sadar', 'মানিকগঞ্জ সদর', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1802, 'Gorpara', 'গোরপাড়া', 'Manikganj Sadar', 'মানিকগঞ্জ সদর', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1803, 'Mahadebpur', 'মহাদেবপুর', 'Manikganj Sadar', 'মানিকগঞ্জ সদর', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1804, 'Barangail', 'বড়ঙ্গাইল', 'Manikganj Sadar', 'মানিকগঞ্জ সদর', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1810, 'Saturia', 'সাটুরিয়া', 'Saturia', 'সাটুরিয়া', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1811, 'Baliati', 'সুবিধা নিতে', 'Saturia', 'সাটুরিয়া', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1820, 'Singair', 'সিঙ্গাইর', 'Singari', 'লাইক', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1821, 'Baira', 'ধারালো', 'Singari', 'লাইক', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1822, 'joymantop', 'জয়মন্টপ', 'Singari', 'লাইক', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1830, 'Lechhraganj', 'লেছড়াগঞ্জ', 'Lechhraganj', 'লেছড়াগঞ্জ', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1831, 'Jhitka', 'ঝিটকা', 'Lechhraganj', 'লেছড়াগঞ্জ', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1840, 'Gheor', 'ঘিওর', 'Gheor', 'ঘিওর', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1850, 'Shibaloy', 'শিবলয়', 'Shibloya', 'শিবলয়', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1851, 'Aricha', 'আরিচা', 'Shibloya', 'শিবলয়', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1852, 'Tewta', 'টেউটা', 'Shibloya', 'শিবলয়', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1853, 'Uthli', 'উথলি', 'Shibloya', 'শিবলয়', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1860, 'Doulatpur', 'দৌলতপুর', 'Doulatpur', 'দৌলতপুর', 'Manikganj', 'মানিকগঞ্জ', 'Dhaka', 'ঢাকা'),
(1900, 'Tangail Sadar', 'টাঙ্গাইল সদর', 'Tangail Sadar', 'টাঙ্গাইল সদর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1901, 'Kagmari', 'কাগমারী', 'Tangail Sadar', 'টাঙ্গাইল সদর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1902, 'Santosh', 'সন্তোষ', 'Tangail Sadar', 'টাঙ্গাইল সদর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1903, 'Korotia', 'করোটিয়া', 'Tangail Sadar', 'টাঙ্গাইল সদর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1904, 'Purabari', 'পুরবাড়ী', 'Tangail Sadar', 'টাঙ্গাইল সদর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1910, 'Delduar', 'দেলদুয়ার', 'Delduar', 'দেলদুয়ার', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1911, 'Jangalia', 'জাঙ্গালিয়া', 'Delduar', 'দেলদুয়ার', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1912, 'Patharail', 'পাথরাইল', 'Delduar', 'দেলদুয়ার', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1913, 'Elasin', 'আমি থাকতাম', 'Delduar', 'দেলদুয়ার', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1914, 'Hinga Nagar', 'হাজেরা', 'Delduar', 'দেলদুয়ার', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1915, 'Lowhati', 'লোহাটি', 'Delduar', 'দেলদুয়ার', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1920, 'Basail', 'বাসাইল', 'Basail', 'বাসাইল', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1930, 'Kashkawlia', 'কাশকাওলিয়া', 'Kashkaolia', 'কাশকাওলিয়া', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1936, 'Nagarpur', 'নাগরপুর', 'Nagarpur', 'নাগরপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1937, 'Dhuburia', 'ব্যাকবোন', 'Nagarpur', 'নাগরপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1938, 'Salimabad', 'সলিমাবাদ', 'Nagarpur', 'নাগরপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1940, 'Mirzapur', 'মির্জাপুর', 'Mirzapur', 'মির্জাপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1941, 'Gorai', 'গোড়াই', 'Mirzapur', 'মির্জাপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1942, 'M.C. College', 'এমসি কলেজ', 'Mirzapur', 'মির্জাপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1943, 'Warri paikpara', 'ওয়ারী পাইকপাড়া', 'Mirzapur', 'মির্জাপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1944, 'Jarmuki', 'হিরো', 'Mirzapur', 'মির্জাপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1945, 'Mohera', 'মোহেরা', 'Mirzapur', 'মির্জাপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1950, 'Sakhipur', 'সখীপুর', 'Sakhipur', 'সখীপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1951, 'Kochua', 'কাকো', 'Sakhipur', 'সখীপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1960, 'Bhuapur', 'ভুয়াপুর', 'Bhuapur', 'ভুয়াপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1970, 'Kalihati', 'কালিহাতী', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1971, 'Rajafair', 'রাজাফায়ার', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1972, 'Nagbari', 'তারা', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1973, 'Ballabazar', 'বল্লাবাজার', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1974, 'Elinga', 'মনে রাখবেন', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1975, 'Palisha', 'পলিশা', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1976, 'Nagarbari SO', 'নগরবাড়ী এসও', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1977, 'Nagarbari', 'নগরবাড়ী', 'Kalihati', 'কালিহাতী', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1980, 'Ghatial', 'ঘাটিয়াল', 'Ghatail', 'ঘাটাইল', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1981, 'Zahidganj', 'জাহিদগঞ্জ', 'Ghatail', 'ঘাটাইল', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1982, 'D. Pakutia', 'ডি. পাকুটিয়া', 'Ghatail', 'ঘাটাইল', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1983, 'Dhalapara', 'ধলাপাড়া', 'Ghatail', 'ঘাটাইল', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1984, 'Lohani', 'শেচেহান', 'Ghatail', 'ঘাটাইল', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1990, 'Gopalpur', 'গোপালপুর', 'Gopalpur', 'গোপালপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1991, 'Jhowail', 'ঝোয়াইল', 'Gopalpur', 'গোপালপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1992, 'Hemnagar', 'হেমনগর', 'Gopalpur', 'গোপালপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1996, 'Madhupur', 'মধুপুর', 'Madhupur', 'মধুপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(1997, 'Dhobari', 'ধোবাড়ী', 'Madhupur', 'মধুপুর', 'Tangail', 'টাঙ্গাইল', 'Dhaka', 'ঢাকা'),
(2000, 'Jamalpur', 'জামালপুর', 'Jamalpur', 'জামালপুর', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2001, 'Nandina', 'নন্দিনা', 'Jamalpur', 'জামালপুর', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2002, 'Narundi', 'নারুন্দি', 'Jamalpur', 'জামালপুর', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2010, 'Malandah', 'মালান্দা', 'Malandah', 'মালান্দা', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2011, 'Jamalpur', 'জামালপুর', 'Malandah', 'মালান্দা', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2012, 'Malancha', 'মালঞ্চা', 'Malandah', 'মালান্দা', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2013, 'Mahmoodpur', 'মাহমুদপুর', 'Malandah', 'মালান্দা', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2020, 'Islampur', 'ইসলামপুর', 'Islampur', 'ইসলামপুর', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2021, 'Durmoot', 'দুরমুট', 'Islampur', 'ইসলামপুর', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2022, 'Gilabari', 'গিলবাড়ি', 'Islampur', 'ইসলামপুর', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2030, 'Dewangonj', 'দেওয়ানগঞ্জ', 'Dewangonj', 'দেওয়ানগঞ্জ', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2031, 'Dewangonj S. Mills', 'দেওয়ানগঞ্জ সুগার মিলস', 'Dewangonj', 'দেওয়ানগঞ্জ', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2040, 'Mathargonj', 'মাথারগঞ্জ', 'Mathargonj', 'মাথারগঞ্জ', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2041, 'Balijhuri', 'বালিঝুরি', 'Mathargonj', 'মাথারগঞ্জ', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2050, 'Shorishabari', 'সরিষাবাড়ী', 'Shorishabari', 'সরিষাবাড়ী', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2051, 'Gunerbari', 'গুনেরবার কাছে', 'Shorishabari', 'সরিষাবাড়ী', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2052, 'Bausee', 'বাউসি', 'Shorishabari', 'সরিষাবাড়ী', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2053, 'Jagannath Ghat', 'জগন্নাথ ঘাট', 'Shorishabari', 'সরিষাবাড়ী', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2054, 'Pingna', 'পিংনা', 'Shorishabari', 'সরিষাবাড়ী', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2055, 'Jamuna Sar Karkhana', 'যমুনা সার কারখানা', 'Shorishabari', 'সরিষাবাড়ী', 'Jamalpur', 'জামালপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2100, 'Sherpur Shadar', 'শেরপুর সদর', 'Sherpur Shadar', 'শেরপুর সদর', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2110, 'Nalitabari', 'নালিতাবাড়ী', 'Nalitabari', 'নালিতাবাড়ী', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2111, 'Hatibandha', 'হাতিবান্ধা', 'Nalitabari', 'নালিতাবাড়ী', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2120, 'Jhinaigati', 'ঝিনাইগাতী', 'Jhinaigati', 'ঝিনাইগাতী', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2130, 'Shribardi', 'শ্রীবরদী', 'Shribardi', 'শ্রীবরদী', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2140, 'Bakshigonj', 'বকশীগঞ্জ', 'Bakshigonj', 'বকশীগঞ্জ', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2150, 'Nakla', 'নাকলা', 'Nakla', 'নাকলা', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2151, 'Gonopaddi', 'গণোপ্যাডস', 'Nakla', 'নাকলা', 'Sherpur', 'শেরপুর', 'Mymensingh', 'ময়মনসিংহ'),
(2200, 'Mymensingh Sadar', 'ময়মনসিংহ সদর', 'Mymensingh Sadar', 'ময়মনসিংহ সদর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2201, 'Kawatkhali', 'আপাতত', 'Mymensingh Sadar', 'ময়মনসিংহ সদর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2202, 'Agriculture Universi', 'কৃষি বিশ্ববিদ্যালয়', 'Mymensingh Sadar', 'ময়মনসিংহ সদর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2203, 'Shombhuganj', 'শম্ভুগঞ্জ', 'Mymensingh Sadar', 'ময়মনসিংহ সদর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2204, 'Biddyaganj', 'বিদ্যাগঞ্জ', 'Mymensingh Sadar', 'ময়মনসিংহ সদর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2205, 'Pearpur', 'পেয়ারপুর', 'Mymensingh Sadar', 'ময়মনসিংহ সদর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2210, 'Muktagachha', 'মুক্তাগাছা', 'Muktagachha', 'মুক্তাগাছা', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2216, 'Fulbaria', 'ফুলবাড়ীয়া', 'Fulbaria', 'ফুলবাড়ীয়া', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2220, 'Trishal', 'ত্রিশাল', 'Trishal', 'ত্রিশাল', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2221, 'Ahmadbad', 'আহমদাবাদ', 'Trishal', 'ত্রিশাল', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2222, 'Ram Amritaganj', 'রাম অমৃতগঞ্জ', 'Trishal', 'ত্রিশাল', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2223, 'Dhala', 'ভাল্লুক', 'Trishal', 'ত্রিশাল', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2230, 'Gaforgaon', 'গফরগাঁও', 'Gaforgaon', 'গফরগাঁও', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2231, 'Shibganj', 'শিবগঞ্জ', 'Gaforgaon', 'গফরগাঁও', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2232, 'Usti', 'উপরে', 'Gaforgaon', 'গফরগাঁও', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2233, 'Kandipara', 'সে আমাকে ছেড়ে চলে গেছে', 'Gaforgaon', 'গফরগাঁও', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2234, 'Duttarbazar', 'দত্তর বাজার', 'Gaforgaon', 'গফরগাঁও', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2240, 'Bhaluka', 'ভালুকা', 'Bhaluka', 'ভালুকা', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2250, 'Phulpur', 'ফুলপুর', 'Phulpur', 'ফুলপুর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2251, 'Beltia', 'বেলটিয়া', 'Phulpur', 'ফুলপুর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2252, 'Tarakanda', 'তারাকান্দা', 'Phulpur', 'ফুলপুর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2260, 'Haluaghat', 'হালুয়াঘাট', 'Haluaghat', 'হালুয়াঘাট', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2261, 'Dhara', 'ধারা', 'Haluaghat', 'হালুয়াঘাট', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2262, 'Munshirhat', 'মুন্সিরহাট', 'Haluaghat', 'হালুয়াঘাট', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2270, 'Gouripur', 'গৌরীপুর', 'Gouripur', 'গৌরীপুর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2271, 'Ramgopalpur', 'গোপালপুর', 'Gouripur', 'গৌরীপুর', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2280, 'Isshwargonj', 'ঈশ্বরগঞ্জ', 'Isshwargonj', 'ঈশ্বরগঞ্জ', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2281, 'Sohagi', 'সোহাগী', 'Isshwargonj', 'ঈশ্বরগঞ্জ', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2282, 'Atharabari', 'আঠারবাড়ী', 'Isshwargonj', 'ঈশ্বরগঞ্জ', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2290, 'Nandail', 'নান্দাইল', 'Nandail', 'নান্দাইল', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2291, 'Gangail', 'গাঙ্গাইল', 'Nandail', 'নান্দাইল', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ'),
(2300, 'Kishoreganj Sadar', 'কিশোরগঞ্জ সদর', 'Kishoreganj Sadar', 'কিশোরগঞ্জ সদর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2301, 'Kishoreganj S.Mills', 'কিশোরগঞ্জ সুগার মিলস', 'Kishoreganj Sadar', 'কিশোরগঞ্জ সদর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2302, 'Maizhati', 'মাইজহাটি', 'Kishoreganj Sadar', 'কিশোরগঞ্জ সদর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2303, 'Nilganj', 'নীলগঞ্জ', 'Kishoreganj Sadar', 'কিশোরগঞ্জ সদর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2310, 'Karimganj', 'করিমগঞ্জ', 'Karimganj', 'করিমগঞ্জ', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2316, 'Tarial', 'তারিয়াল', 'Tarial', 'তারিয়াল', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2320, 'Hossenpur', 'হোসেনপুর', 'Hossenpur', 'হোসেনপুর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2326, 'Pakundia', 'পাকুন্দিয়া', 'Pakundia', 'পাকুন্দিয়া', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2330, 'Katiadi', 'কটিয়াদী', 'Katiadi', 'কটিয়াদী', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2331, 'Gochhihata', 'গোছিহাটা', 'Katiadi', 'কটিয়াদী', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2336, 'Bajitpur', 'বাজিতপুর', 'Bajitpur', 'বাজিতপুর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2337, 'Sararchar', 'সরারচর', 'Bajitpur', 'বাজিতপুর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2338, 'Laksmipur', 'লক্ষ্মীপুর', 'Bajitpur', 'বাজিতপুর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2340, 'Kuliarchar', 'কুলিয়ারচর', 'Kuliarchar', 'কুলিয়ারচর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2341, 'Chhoysuti', 'ছৈয়সুতি', 'Kuliarchar', 'কুলিয়ারচর', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2350, 'Bhairab', 'ভৈরব', 'Bhairob', 'ভৈরব', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2360, 'Nikli', 'নিকলী', 'Nikli', 'নিকলী', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2370, 'MIthamoin', 'মিথামোইন', 'Mithamoin', 'মিঠামোইন', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2371, 'Abdullahpur', 'আবদুল্লাহপুর', 'Mithamoin', 'মিঠামোইন', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2380, 'Ostagram', 'অষ্টগ্রাম', 'Ostagram', 'অষ্টগ্রাম', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2390, 'Itna', 'ইটনা', 'Itna', 'ইটনা', 'Kishoreganj', 'কিশোরগঞ্জ', 'Dhaka', 'ঢাকা'),
(2400, 'Netrakona Sadar', 'নেত্রকোনা সদর', 'Netrakona Sadar', 'নেত্রকোনা সদর', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2401, 'Baikherhati', 'বৈখেরহাটি', 'Netrakona Sadar', 'নেত্রকোনা সদর', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2410, 'Purbadhola', 'পূর্বধোলা', 'Purbadhola', 'পূর্বধোলা', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2411, 'Shamgonj', 'শামগঞ্জ', 'Purbadhola', 'পূর্বধোলা', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2412, 'Jaria Jhanjhail', 'জারিয়া জানঝাইল', 'Purbadhola', 'পূর্বধোলা', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2416, 'Dhobaura', 'কেটে ফেলুন', 'Dhobaura', 'কেটে ফেলুন', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2417, 'Sakoai', 'সাকোয়াই', 'Dhobaura', 'কেটে ফেলুন', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2420, 'Susnng Durgapur', 'সুসং দুর্গাপুর', 'Susung Durgapur', 'উদ্দেশ্য', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2430, 'Kalmakanda', 'কলমাকান্দা', 'Kalmakanda', 'কলমাকান্দা', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2440, 'Barhatta', 'বারহাট্টা', 'Barhatta', 'বারহাট্টা', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2446, 'Mohanganj', 'মোহনগঞ্জ', 'Mohanganj', 'মোহনগঞ্জ', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2450, 'Dharampasha', 'ধরমপাশা', 'Dharmapasha', 'ধর্মপাশা', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2456, 'Moddoynagar', 'মোদয়নগর', 'Moddhynagar', 'মধুনগর', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2460, 'Khaliajhri', 'খালিয়াঝরি', 'Khaliajuri', 'খালিয়াজুরী', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2462, 'Shaldigha', 'শালদিঘা', 'Khaliajuri', 'খালিয়াজুরী', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2470, 'Atpara', 'আটপাড়া', 'Atpara', 'আটপাড়া', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2480, 'Kendua', 'কেন্দুয়া', 'Kendua', 'কেন্দুয়া', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(2490, 'Madan', 'মদন', 'Madan', 'মদন', 'Netrokona', 'নেত্রকোনা', 'Mymensingh', 'ময়মনসিংহ'),
(3000, 'Sunamganj Sadar', 'সুনামগঞ্জ সদর', 'Sunamganj Sadar', 'সুনামগঞ্জ সদর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3001, 'Pagla', 'পাগলা', 'Sunamganj Sadar', 'সুনামগঞ্জ সদর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3002, 'Patharia', 'পাথারিয়া', 'Sunamganj Sadar', 'সুনামগঞ্জ সদর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3010, 'Bishamsapur', 'বিষমসাপুর', 'Bishamsarpur', 'বিষমশরপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3020, 'Sachna', 'সাচনা', 'Sachna', 'সাচনা', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3030, 'Tahirpur', 'তাহিরপুর', 'Tahirpur', 'তাহিরপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3040, 'Dhirai Chandpur', 'দরাই চাঁদপুর', 'Dhirai Chandpur', 'দরাই চাঁদপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3041, 'Jagdal', 'জগদল', 'Dhirai Chandpur', 'দরাই চাঁদপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3050, 'Ghungiar', 'ঘুঙ্গিয়ার', 'Ghungiar', 'ঘুঙ্গিয়ার', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3060, 'Jagnnathpur', 'জগন্নাথপুর', 'Jagnnathpur', 'জগন্নাথপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3061, 'Syedpur', 'সৈয়দপুর', 'Jagnnathpur', 'জগন্নাথপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3062, 'Atuajan', 'আতুয়াজান', 'Jagnnathpur', 'জগন্নাথপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3063, 'Hasan Fatemapur', 'হাসান ফাতেমাপুর', 'Jagnnathpur', 'জগন্নাথপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3064, 'Rasulganj', 'রসুলগঞ্জ', 'Jagnnathpur', 'জগন্নাথপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3065, 'Shiramsi', 'শিরামশী', 'Jagnnathpur', 'জগন্নাথপুর', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3070, 'Duara bazar', 'দরজা বাজার', 'Duara bazar', 'দরজা বাজার', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3080, 'Chhatak', 'ছাতক', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3081, 'Chhatak Cement Facto', 'ছাতক সিমেন্ট ফ্যাক্টরি', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3082, 'Chhatak Paper Mills', 'ছাতক পেপার মিলস', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3083, 'Gabindaganj', 'গাবিন্দগঞ্জ', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3084, 'Gabindaganj Natun Ba', 'গাবিন্দগঞ্জ নাতুন বা', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3085, 'Khurma', 'খুরমা', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3086, 'Moinpur', 'মঈনপুর', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3087, 'jahidpur', 'জাহিদপুর', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3088, 'Islamabad', 'ইসলামাবাদ', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3100, 'Sylhe Sadar', 'সিলেট সদর', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3101, 'Sylhet Cadet Col', 'সিলেট ক্যাডেট কলেজ', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3102, 'Sylhet Biman Bondar', 'সিলেট বিমান বন্দর', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3103, 'Khadimnagar', 'খাদিমনগর', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3104, 'Jalalabad Cantoment', 'জালালাবাদ ক্যান্টনমেন্ট', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3105, 'Silam', 'আগে', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3106, 'Birahimpur', 'বিরাহিমপুর', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3107, 'Jalalabad', 'জালালআবাদ', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3108, 'Mogla', 'আমি পারতাম', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3109, 'Ranga Hajiganj', 'রাঙ্গা হাজীগঞ্জ', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3111, 'Kadamtali', 'কদমতলী', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3112, 'Kamalbazer', 'কামালবাজের', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3113, 'Lalbazar', 'লালবাজার', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3114, 'Shahajalal Science &', 'শাহজালাল বিজ্ঞান ও প্রযুক্তি', 'Sylhet Sadar', 'সিলেট সদর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3116, 'Fenchuganj', 'ফেঞ্চুগঞ্জ', 'Fenchuganj', 'ফেঞ্চুগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3117, 'Fenchuganj SareKarkh', 'ফেঞ্চুগঞ্জ সরেখড়', 'Fenchuganj', 'ফেঞ্চুগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3120, 'Balaganj', 'বালাগঞ্জ', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3121, 'Karua', 'রুক্ষ', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3122, 'Brahman Shashon', 'ব্রাহ্মণ শাশোন', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3123, 'Tajpur', 'তাজপুর', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3124, 'Goala Bazar', 'খালি বাজার', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3125, 'Begumpur', 'বেগমপুর', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3126, 'Omarpur', 'ওমপুর', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3127, 'Kathal Khair', 'কাঠাল খায়ের', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3128, 'Gaharpur', 'গহরপুর', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3129, 'Natun Bazar', 'নতুন বাজার', 'Balaganj', 'বালাগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3130, 'Bishwanath', 'বিশ্বনাথ', 'Bishwanath', 'বিশ্বনাথ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3131, 'Dashghar', 'দশঘর', 'Bishwanath', 'বিশ্বনাথ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3132, 'Doulathpur', 'দৌলথপুর', 'Bishwanath', 'বিশ্বনাথ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3133, 'Deokalas', 'দেওকলস', 'Bishwanath', 'বিশ্বনাথ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3134, 'Singer kanch', 'গায়ক কাঞ্চ', 'Bishwanath', 'বিশ্বনাথ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3140, 'Kompanyganj', 'কোম্পানীগঞ্জ', 'Kompanyganj', 'কোম্পানীগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3150, 'Goainhat', 'গোয়াইনহাট', 'Goainhat', 'গোয়াইনহাট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3151, 'Jaflong', 'জাফলং', 'Goainhat', 'গোয়াইনহাট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3152, 'Chiknagul', 'চিকনাগুল', 'Goainhat', 'গোয়াইনহাট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3156, 'Jainthapur', 'জৈন্তাপুর', 'Jaintapur', 'জয়ন্তপুর', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3160, 'Gopalgannj', 'গোপালগঞ্জ', 'Gopalganj', 'গোপালগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3161, 'Dhaka Dakkhin', 'ঢাকা দক্ষিণ', 'Gopalganj', 'গোপালগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3162, 'Dakkhin Bhadashore', 'দক্ষিণ ভাদাশোর', 'Gopalganj', 'গোপালগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3163, 'Ranaping', 'রানাপিং', 'Gopalganj', 'গোপালগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3164, 'banigram', 'বাণীগ্রাম', 'Gopalganj', 'গোপালগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3165, 'Chandanpur', 'চন্দনপুর', 'Gopalganj', 'গোপালগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3170, 'Bianibazar', 'বিয়ানীবাজার', 'Bianibazar', 'বিয়ানীবাজার', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3171, 'jaldup', 'টান', 'Bianibazar', 'বিয়ানীবাজার', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3172, 'Mathiura', 'মথিউরা', 'Bianibazar', 'বিয়ানীবাজার', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3173, 'Kurar bazar', 'বাজারের ধুলো', 'Bianibazar', 'বিয়ানীবাজার', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3174, 'Salia bazar', 'বাজার হল', 'Bianibazar', 'বিয়ানীবাজার', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3175, 'Churkai', 'চুরকাই', 'Bianibazar', 'বিয়ানীবাজার', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3180, 'Kanaighat', 'কানাইঘাট', 'Kanaighat', 'কানাইঘাট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3181, 'Chatulbazar', 'চতুলবাজার', 'Kanaighat', 'কানাইঘাট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3182, 'Manikganj', 'মানিকগঞ্জ', 'Kanaighat', 'কানাইঘাট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3183, 'Gachbari', 'সবকিছু', 'Kanaighat', 'কানাইঘাট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3190, 'Jakiganj', 'জকিগঞ্জ', 'Jakiganj', 'জকিগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3191, 'Ichhamati', 'ইছামতি', 'Jakiganj', 'জকিগঞ্জ', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট'),
(3200, 'Moulvibazar Sadar', 'মৌলভীবাজার সদর', 'Moulvibazar Sadar', 'মৌলভীবাজার সদর', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3201, 'Barakapan', 'বারকাপন', 'Moulvibazar Sadar', 'মৌলভীবাজার সদর', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3202, 'Monumukh', 'মনুমুখ', 'Moulvibazar Sadar', 'মৌলভীবাজার সদর', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3203, 'Afrozganj', 'আফরোজগঞ্জ', 'Moulvibazar Sadar', 'মৌলভীবাজার সদর', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3210, 'Srimangal', 'শ্রীমঙ্গল', 'Srimangal', 'শ্রীমঙ্গল', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3211, 'Narain Chora', 'নারায়ণ চোরা', 'Srimangal', 'শ্রীমঙ্গল', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3212, 'Kalighat', 'কালীঘাট', 'Srimangal', 'শ্রীমঙ্গল', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3213, 'Khejurichhara', 'খেজুরিছড়া', 'Srimangal', 'শ্রীমঙ্গল', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3214, 'Satgaon', 'সাতগাঁও', 'Srimangal', 'শ্রীমঙ্গল', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3220, 'Kamalganj', 'কমলগঞ্জ', 'Kamalganj', 'কমলগঞ্জ', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3221, 'Keramatnaga', 'পবিত্র ড্রাগন', 'Kamalganj', 'কমলগঞ্জ', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3222, 'Patrakhola', 'পাত্রখোলা', 'Kamalganj', 'কমলগঞ্জ', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3223, 'Shamsher Nagar', 'শমসের নগর', 'Kamalganj', 'কমলগঞ্জ', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3224, 'Munshibazar', 'মুন্সীবাজার', 'Kamalganj', 'কমলগঞ্জ', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3230, 'Kulaura', 'কুলাউড়া', 'Kulaura', 'কুলাউড়া', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3231, 'Tillagaon', 'টিলাগাঁও', 'Kulaura', 'কুলাউড়া', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3232, 'Langla', 'ল্যাংলা', 'Kulaura', 'কুলাউড়া', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3233, 'Prithimpasha', 'পৃথিমপাশা', 'Kulaura', 'কুলাউড়া', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3234, 'Kajaldhara', 'কাজলধারা', 'Kulaura', 'কুলাউড়া', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3235, 'Karimpur', 'করিমপুর', 'Kulaura', 'কুলাউড়া', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3237, 'Baramchal', 'বরমচল', 'Kulaura', 'কুলাউড়া', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3240, 'Rajnagar', 'রাজনগর', 'Rajnagar', 'রাজনগর', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3250, 'Baralekha', 'বড়লেখা', 'Baralekha', 'বড়লেখা', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3251, 'Juri', 'জুড়ী', 'Baralekha', 'বড়লেখা', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3252, 'Dhakkhinbag', 'ঢাকাহিনবাগ', 'Baralekha', 'বড়লেখা', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3253, 'Purbashahabajpur', 'পূর্বশাহবাজপুর', 'Baralekha', 'বড়লেখা', 'Moulvibazar', 'মৌলভীবাজার', 'Sylhet', 'সিলেট'),
(3300, 'Hobiganj Sadar', 'হবিগঞ্জ সদর', 'Hobiganj Sadar', 'হবিগঞ্জ সদর', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3301, 'Shaestaganj', 'শায়েস্তাগঞ্জ', 'Hobiganj Sadar', 'হবিগঞ্জ সদর', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3302, 'Gopaya', 'গোপায়া', 'Hobiganj Sadar', 'হবিগঞ্জ সদর', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3310, 'Bahubal', 'বাহুবল', 'Bahubal', 'বাহুবল', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3320, 'Chunarughat', 'চুনারুঘাট', 'Chunarughat', 'চুনারুঘাট', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3321, 'Chandpurbagan', 'চাঁদপুরবাগান', 'Chunarughat', 'চুনারুঘাট', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3322, 'Narapati', 'নরপতি', 'Chunarughat', 'চুনারুঘাট', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3330, 'Madhabpur', 'মাধবপুর', 'Madhabpur', 'মাধবপুর', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3331, 'Itakhola', 'এটি কলারযুক্ত', 'Madhabpur', 'মাধবপুর', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3332, 'Shahajibazar', 'শাহজীবাজার', 'Madhabpur', 'মাধবপুর', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3333, 'Saihamnagar', 'সায়হামনগর', 'Madhabpur', 'মাধবপুর', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3340, 'Kalauk', 'মিষ্টি', 'Kalauk', 'মিষ্টি', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3341, 'Lakhai', 'লাখাই', 'Kalauk', 'মিষ্টি', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3350, 'Baniachang', 'বানিয়াচং', 'Baniachang', 'বানিয়াচং', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3351, 'Jatrapasha', 'যাত্রাপাশা', 'Baniachang', 'বানিয়াচং', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3352, 'Kadirganj', 'কাদিরগঞ্জ', 'Baniachang', 'বানিয়াচং', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3360, 'Azmireeganj', 'এটা জন্য যান', 'Azmireeganj', 'এটা জন্য যান', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3370, 'Nabiganj', 'নবীগঞ্জ', 'Nabiganj', 'নবীগঞ্জ', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3371, 'Goplarbazar', 'গোপলারবাজার', 'Nabiganj', 'নবীগঞ্জ', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3372, 'Golduba', 'গোল্ডুবা', 'Nabiganj', 'নবীগঞ্জ', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3373, 'Digalbak', 'দিগলবা', 'Nabiganj', 'নবীগঞ্জ', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3374, 'Inathganj', 'ইনাথগঞ্জ', 'Nabiganj', 'নবীগঞ্জ', 'Habiganj', 'হবিগঞ্জ', 'Sylhet', 'সিলেট'),
(3400, 'Brahamanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর', 'Brahamanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3401, 'Talshahar', 'তালশহর', 'Brahamanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3402, 'Ashuganj', 'আশুগঞ্জ', 'Brahamanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3403, 'Ashuganj Share', 'আশুগঞ্জ শেয়ার', 'Brahamanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3404, 'Poun', 'পউন', 'Brahamanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3410, 'Nabinagar', 'নবীনগর', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3411, 'Laubfatehpur', 'লাউবফতেহপুর', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3412, 'Rasullabad', 'রসুলাবাদ', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3413, 'Shamgram', 'শামগ্রাম', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3414, 'Ratanpur', 'রতনপুর', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3415, 'Shahapur', 'শাহাপুর', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3417, 'Kaitala', 'কাইতলা', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3418, 'Salimganj', 'সালিমগঞ্জ', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3419, 'Jibanganj', 'জীবনগঞ্জ', 'Nabinagar', 'নবীনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3420, 'Banchharampur', 'বাঞ্ছারামপুর', 'Banchharampur', 'বাঞ্ছারামপুর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3430, 'Sarial', 'সারিয়াল', 'Sarail', 'সরাইল', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3431, 'Shahbajpur', 'শাহবাজপুর', 'Sarail', 'সরাইল', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3432, 'Chandura', 'চান্দুরা', 'Sarail', 'সরাইল', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3440, 'Nasirnagar', 'নাসিরনগর', 'Nasirnagar', 'নাসিরনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3441, 'Fandauk', 'ফান্দাউক', 'Nasirnagar', 'নাসিরনগর', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3450, 'Akhaura', 'আখাউড়া', 'Akhaura', 'আখাউড়া', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3451, 'Azampur', 'আজমপুর', 'Akhaura', 'আখাউড়া', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3452, 'Gangasagar', 'গঙ্গাসাগর', 'Akhaura', 'আখাউড়া', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3460, 'Kasba', 'কসবা', 'Kasba', 'কসবা', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3461, 'Kuti', 'কুটি', 'Kasba', 'কসবা', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3462, 'Chandidar', 'চান্দিদার', 'Kasba', 'কসবা', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3463, 'Chargachh', 'চরগাছ', 'Kasba', 'কসবা', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3464, 'Gopinathpur', 'গোপীনাথপুর', 'Kasba', 'কসবা', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Chattogram', 'চট্টগ্রাম'),
(3500, 'Comilla Sadar', 'কুমিল্লা সদর', 'Comilla Sadar', 'কুমিল্লা সদর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3501, 'Comilla Contoment', 'কুমিল্লা ক্যান্টনমেন্ট', 'Comilla Sadar', 'কুমিল্লা সদর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3502, 'Halimanagar', 'হালিমানগর', 'Comilla Sadar', 'কুমিল্লা সদর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3503, 'Courtbari', 'আদালতবাড়ী', 'Comilla Sadar', 'কুমিল্লা সদর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3504, 'Suaganj', 'সুয়াগঞ্জ', 'Comilla Sadar', 'কুমিল্লা সদর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3510, 'Chandia', 'চান্দিয়া', 'Chandina', 'চান্দিনা', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3511, 'Madhaiabazar', 'মাধাইয়াবাজার', 'Chandina', 'চান্দিনা', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3516, 'Daudkandi', 'দাউদকান্দি', 'Daudkandi', 'দাউদকান্দি', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3517, 'Gouripur', 'গৌরীপুর', 'Daudkandi', 'দাউদকান্দি', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3518, 'Dashpara', 'দশপাড়া', 'Daudkandi', 'দাউদকান্দি', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3519, 'Eliotganj', 'এলিয়টগঞ্জ', 'Daudkandi', 'দাউদকান্দি', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3520, 'Burichang', 'বুড়িচং', 'Burichang', 'বুড়িচং', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3521, 'Maynamoti bazar', 'ময়নামতি বাজার', 'Burichang', 'বুড়িচং', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3526, 'Brahmanpara', 'ব্রাহ্মণপাড়া', 'Brahmanpara', 'ব্রাহ্মণপাড়া', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3530, 'Davidhar', 'দাবিদহর', 'Davidhar', 'দাবিদহর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3531, 'Gangamandal', 'গঙ্গামন্ডল', 'Davidhar', 'দাবিদহর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3532, 'Barashalghar', 'বারশালঘর', 'Davidhar', 'দাবিদহর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3533, 'Dhamtee', 'ধামটি', 'Davidhar', 'দাবিদহর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম');
INSERT INTO `location` (`postal_code`, `post_office`, `post_office_bn`, `upazila`, `upazila_bn`, `district`, `district_bn`, `division`, `division_bn`) VALUES
(3540, 'Muradnagar', 'মুরাদনগর', 'Muradnagar', 'মুরাদনগর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3541, 'Ramchandarpur', 'রামচন্দরপুর', 'Muradnagar', 'মুরাদনগর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3542, 'Companyganj', 'কোম্পানীগঞ্জ', 'Muradnagar', 'মুরাদনগর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3543, 'Bangra', 'বাংড়া', 'Muradnagar', 'মুরাদনগর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3544, 'Sonakanda', 'সোনাকান্দা', 'Muradnagar', 'মুরাদনগর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3545, 'Pantibazar', 'পান্টিবাজার', 'Muradnagar', 'মুরাদনগর', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3546, 'Homna', 'হোমনা', 'Homna', 'হোমনা', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3550, 'Chouddagram', 'চৌদ্দগ্রাম', 'Chouddagram', 'চৌদ্দগ্রাম', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3551, 'Batisa', 'বাটিসা', 'Chouddagram', 'চৌদ্দগ্রাম', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3552, 'Chiora', 'চিওড়া', 'Chouddagram', 'চৌদ্দগ্রাম', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3560, 'Barura', 'বরুড়া', 'Barura', 'বরুড়া', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3561, 'Poyalgachha', 'পয়ালগাছা', 'Barura', 'বরুড়া', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3562, 'Murdafarganj', 'মুর্দাফরগঞ্জ', 'Barura', 'বরুড়া', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3570, 'Laksam', 'লাকসাম', 'Laksam', 'লাকসাম', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3571, 'Lakshamanpur', 'লক্ষ্মণপুর', 'Laksam', 'লাকসাম', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3572, 'Bipulasar', 'বিপুলাসার', 'Laksam', 'লাকসাম', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3580, 'Langalkot', 'লাঙ্গলকোট', 'Langalkot', 'লাঙ্গলকোট', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3581, 'Dhalua', 'ঢালুয়া', 'Langalkot', 'লাঙ্গলকোট', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3582, 'Chhariabazar', 'ছড়িয়াবাজার', 'Langalkot', 'লাঙ্গলকোট', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3583, 'Gunabati', 'গুনবতী', 'Langalkot', 'লাঙ্গলকোট', 'Cumilla', 'কুমিল্লা', 'Chattogram', 'চট্টগ্রাম'),
(3600, 'Chandpur Sadar', 'চাঁদপুর সদর', 'Chandpur Sadar', 'চাঁদপুর সদর', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3601, 'Puranbazar', 'পুরানবাজার', 'Chandpur Sadar', 'চাঁদপুর সদর', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3602, 'Baburhat', 'বাবুরহাট', 'Chandpur Sadar', 'চাঁদপুর সদর', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3603, 'Sahatali', 'সাহাটালী', 'Chandpur Sadar', 'চাঁদপুর সদর', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3610, 'Hajiganj', 'হাজীগঞ্জ', 'Hajiganj', 'হাজীগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3611, 'Bolakhal', 'বোলাখাল', 'Hajiganj', 'হাজীগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3620, 'Shahrasti', 'শাহরাস্তি', 'Shahrasti', 'শাহরাস্তি', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3621, 'Khilabazar', 'খিলাবাজার', 'Shahrasti', 'শাহরাস্তি', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3622, 'Pashchim Kherihar Al', 'পশ্চিম খেরিহার আল', 'Shahrasti', 'শাহরাস্তি', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3623, 'Chotoshi', 'ছোটশি', 'Shahrasti', 'শাহরাস্তি', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3624, 'Islamia Madrasha', 'ইসলামিয়া মাদ্রাসা', 'Shahrasti', 'শাহরাস্তি', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3630, 'Kachua', 'কচুয়া', 'Kachua', 'কচুয়া', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3631, 'Pak Shrirampur', 'পাক শ্রীরামপুর', 'Kachua', 'কচুয়া', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3632, 'Rahima Nagar', 'রহিমা নগর', 'Kachua', 'কচুয়া', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3633, 'Shachar', 'শাচর', 'Kachua', 'কচুয়া', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3640, 'Matlobganj', 'মতলবগঞ্জ', 'Matlobganj', 'মতলবগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3641, 'Mohanpur', 'মোহনপুর', 'Matlobganj', 'মতলবগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3642, 'Kalipur', 'কালীপুর', 'Matlobganj', 'মতলবগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3650, 'Faridganj', 'ফরিদগঞ্জ', 'Faridganj', 'ফরিদগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3651, 'Chandra', 'চন্দ্রা', 'Faridganj', 'ফরিদগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3652, 'Rupsha', 'রূপসা', 'Faridganj', 'ফরিদগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3653, 'Gridkaliandia', 'গ্রিডকালিন্দিয়া', 'Faridganj', 'ফরিদগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3654, 'Rampurbazar', 'রামপুরবাজার', 'Faridganj', 'ফরিদগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3655, 'Islampur Shah Isain', 'ইসলামপুর শাহ ঈসাইন', 'Faridganj', 'ফরিদগঞ্জ', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3660, 'Hayemchar', 'হায়েমচর', 'Hayemchar', 'হায়েমচর', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3661, 'Gandamara', 'গান্দামারা', 'Hayemchar', 'হায়েমচর', 'Chandpur', 'চাঁদপুর', 'Chattogram', 'চট্টগ্রাম'),
(3700, 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3701, 'Dalal Bazar', 'দালাল বাজার', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3702, 'Bhabaniganj', 'ভবানীগঞ্জ', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3703, 'Mandari', 'আদেশ করা', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3704, 'Keramatganj', 'কেরামতগঞ্জ', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3705, 'Rupchara', 'রূপছড়া', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3706, 'Duttapara', 'দত্তের কাছে', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3707, 'Choupalli', 'চৌপল্লী', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3708, 'Chandraganj', 'চন্দ্রগঞ্জ', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3709, 'Amani Lakshimpur', 'আমানী লক্ষীপুর', 'Lakshimpur Sadar', 'লক্ষ্মীপুর সদর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3710, 'Raypur', 'রায়পুর', 'Raypur', 'রায়পুর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3711, 'Rakhallia', 'রাখাল্লিয়া', 'Raypur', 'রায়পুর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3712, 'Nagerdighirpar', 'নগরদীঘিরপাড়', 'Raypur', 'রায়পুর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3713, 'Haydarganj', 'হায়দরগঞ্জ', 'Raypur', 'রায়পুর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3714, 'Bhuabari', 'ভুবারি', 'Raypur', 'রায়পুর', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3720, 'Ramganj', 'রামগঞ্জ', 'Ramganj', 'রামগঞ্জ', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3721, 'Alipur', 'আলীপুর', 'Ramganj', 'রামগঞ্জ', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3722, 'Panpara', 'পানপাড়া', 'Ramganj', 'রামগঞ্জ', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3723, 'Kanchanpur', 'কাঞ্চনপুর', 'Ramganj', 'রামগঞ্জ', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3724, 'Naagmud', 'নাগমুদ', 'Ramganj', 'রামগঞ্জ', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3725, 'Dolta', 'দোলতা', 'Ramganj', 'রামগঞ্জ', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3730, 'Char Alexgander', 'চর আলেকজান্ডার', 'Char Alexgander', 'চর আলেকজান্ডার', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3731, 'Hajirghat', 'হাজীরঘাট', 'Char Alexgander', 'চর আলেকজান্ডার', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3732, 'Ramgatirhat', 'রামগতিরহাট', 'Char Alexgander', 'চর আলেকজান্ডার', 'Lakshmipur', 'লক্ষ্মীপুর', 'Chattogram', 'চট্টগ্রাম'),
(3800, 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3801, 'Noakhali College', 'নোয়াখালী কলেজ', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3802, 'Sonapur', 'সোনাপুর', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3803, 'Din Monir Hat', 'দিন মনির হাট', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3804, 'Pak Kishoreganj', 'পাক কিশোরগঞ্জ', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3806, 'Mriddarhat', 'মৃধারহাট', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3807, 'Kabirhat', 'কবিরহাট', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3808, 'Khalifar Hat', 'খলিফার হাট', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3809, 'Charam Tua', 'চরাম তুয়া', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3811, 'Chaprashir Hat', 'চাপরাশির হাট', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3812, 'Char Jabbar', 'চর জব্বার', 'Noakhali Sadar', 'নোয়াখালী সদর', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3820, 'Begumganj', 'বেগমগঞ্জ', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3821, 'Choumohani', 'চৌমুহনী', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3822, 'Banglabazar', 'বাংলাবাজার', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3823, 'Mir Owarishpur', 'মীর আওয়ারিশপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3824, 'Bazra', 'বজরা', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3825, 'Jamidar Hat', 'জমিদার হাট', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3827, 'Sonaimuri', 'সোনাইমুড়ি', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3828, 'Gopalpur', 'গোপালপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3829, 'Joynarayanpur', 'জয়নারায়ণপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3831, 'Alaiarpur', 'আলাইয়ারপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3832, 'Tangirpar', 'টাঙ্গিরপাড়', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3833, 'Khalafat Bazar', 'খেলাফত বাজার', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3834, 'Rajganj', 'রাজগঞ্জ', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3835, 'Oachhekpur', 'ওচেকপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3837, 'Bhabani Jibanpur', 'ভবানী জীবনপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3838, 'Maheshganj', 'মহেশগঞ্জ', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3839, 'Nadona', 'নাদোনা', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3841, 'Nandiapara', 'নান্দিয়াপাড়া', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3842, 'Khalishpur', 'খালিশপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3843, 'Dauti', 'দাউতি', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3844, 'Joyag', 'জয়াগ', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3845, 'Thanar Hat', 'থানার হাট', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3847, 'Amisha Para', 'আমিশা পাড়া', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3848, 'Durgapur', 'দুর্গাপুর', 'Begumganj', 'বেগমগঞ্জ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3850, 'Basur Hat', 'বসুর হাট', 'Basurhat', 'বসুরহাট', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3851, 'Charhajari', 'চরহাজারী', 'Basurhat', 'বসুরহাট', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3860, 'Senbag', 'সেনবাগ', 'Senbag', 'সেনবাগ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3861, 'Kallyandi', 'কাল্যান্ডী', 'Senbag', 'সেনবাগ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3862, 'Beezbag', 'বিজবাগ', 'Senbag', 'সেনবাগ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3863, 'Kankirhat', 'আপনি', 'Senbag', 'সেনবাগ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3864, 'Chatarpaia', 'চাতারপাইয়া', 'Senbag', 'সেনবাগ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3865, 'T.P. Lamua', 'টি.পি. লামুয়া', 'Senbag', 'সেনবাগ', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3870, 'Chatkhil', 'চাটখিল', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3871, 'Palla', 'পাল্লা', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3872, 'Khilpara', 'খিলপাড়া', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3873, 'Bodalcourt', 'বোদালকোর্ট', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3874, 'Rezzakpur', 'রাজ্জাকপুর', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3875, 'Solla', 'সোল্লা', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3877, 'Karihati', 'বড়দিন', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3878, 'Dosh Gharia', 'দশঘরিয়া', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3879, 'Bansa Bazar', 'দেশের বাজার', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3881, 'Sahapur', 'সাহাপুর', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3882, 'Sampara', 'সম্পারা', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3883, 'Shingbahura', 'শিংবাহুরা', 'Chatkhil', 'চাটখিল', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3890, 'Hatiya', 'হাতিয়া', 'Hatiya', 'হাতিয়া', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3891, 'Afazia', 'আফাজিয়া', 'Hatiya', 'হাতিয়া', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3892, 'Tamoraddi', 'তামোরদ্দি', 'Hatiya', 'হাতিয়া', 'Noakhali', 'নোয়াখালী', 'Chattogram', 'চট্টগ্রাম'),
(3893, 'Chourangi Bazar', 'চৌরঙ্গী বাজার', 'Chhatak', 'ছাতক', 'Sunamganj', 'সুনামগঞ্জ', 'Sylhet', 'সিলেট'),
(3900, 'Feni Sadar', 'ফেনী সদর', 'Feni Sadar', 'ফেনী সদর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3901, 'Fazilpur', 'ফাজিলপুর', 'Feni Sadar', 'ফেনী সদর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3902, 'Sharshadie', 'শার্শাদি', 'Feni Sadar', 'ফেনী সদর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3903, 'Laskarhat', 'লস্করহাট', 'Feni Sadar', 'ফেনী সদর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3910, 'Chhagalnaia', 'ছাগলনাইয়া', 'Chhagalnaia', 'ছাগলনাইয়া', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3911, 'Maharajganj', 'মহারাজগঞ্জ', 'Chhagalnaia', 'ছাগলনাইয়া', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3912, 'Daraga Hat', 'দারাগা হাট', 'Chhagalnaia', 'ছাগলনাইয়া', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3913, 'Puabashimulia', 'পুয়াবাশিমুলিয়া', 'Chhagalnaia', 'ছাগলনাইয়া', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3920, 'Dagondhuia', 'দাগনধুইয়া', 'Dagonbhuia', 'দাগনভুঁই', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3921, 'Dudmukha', 'দুধমুখা', 'Dagonbhuia', 'দাগনভুঁই', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3922, 'Chhilonia', 'ছিলোনিয়া', 'Dagonbhuia', 'দাগনভুঁই', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3923, 'Rajapur', 'রাজাপুর', 'Dagonbhuia', 'দাগনভুঁই', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3930, 'Sonagazi', 'সোনাগাজী', 'Sonagazi', 'সোনাগাজী', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3931, 'Motiganj', 'মতিগঞ্জ', 'Sonagazi', 'সোনাগাজী', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3932, 'Ahmadpur', 'আহমদপুর', 'Sonagazi', 'সোনাগাজী', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3933, 'Kazirhat', 'কাজিরহাট', 'Sonagazi', 'সোনাগাজী', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3940, 'Pashurampur', 'পশুরামপুর', 'Pashurampur', 'পশুরামপুর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3941, 'Shuarbazar', 'শুয়ারবাজার', 'Pashurampur', 'পশুরামপুর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3942, 'Fulgazi', 'ফুলগাজী', 'Pashurampur', 'পশুরামপুর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(3943, 'Munshirhat', 'মুন্সিরহাট', 'Pashurampur', 'পশুরামপুর', 'Feni', 'ফেনী', 'Chattogram', 'চট্টগ্রাম'),
(4000, 'Chittagong GPO', 'চট্টগ্রাম জিপিও', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4100, 'Chittagong Bandar', 'চট্টগ্রাম বন্দর', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4202, 'Pahartoli', 'পাহাড়তলী', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4203, 'Chawkbazar', 'চকবাজার', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4204, 'Patenga', 'পাতেঙ্গা', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4205, 'Chittagong Airport', 'চট্টগ্রাম বিমানবন্দর', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4206, 'Jaldia Merine Accade', 'জলদিয়া মেরিন অ্যাকাড', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4207, 'Firozshah', 'ফিরোজশাহ', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4208, 'Mohard', 'মোহরদ', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4209, 'Chitt. Politechnic In', 'চট্টগ্রাম পলিটেকনিক ইন্সটিটিউট', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4210, 'Bayezid Bostami', 'বায়েজিদ বোস্তামী', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4211, 'Amin Jute Mills', 'আমিন জুট মিলস', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4212, 'Chandgaon', 'চান্দগাঁও', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4213, 'Wazedia', 'ওয়াজেদিয়া', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4214, 'Jalalabad', 'জালালআবাদ', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4215, 'Anandabazar', 'আনন্দবাজার', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4216, 'Halishahar', 'হালিশহর', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4217, 'North Katuli', 'উত্তর কাটুলি', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4218, 'Chitt. Sailers Colon', 'চট্টগ্রাম নাবিক কলোনি', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4219, 'Chitt. Customs Acca', 'চট্টগ্রাম কাস্টমস একাডেমি', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4220, 'Chitt. Cantonment', 'চট্টগ্রাম ক্যান্টনমেন্ট', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4221, 'Al- Amin Baria Madra', 'আল-আমিন বাড়িয়া মাদ্রাসা', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4222, 'Middle Patenga', 'মিডল টেক', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4223, 'Export Processing', 'এক্সপোর্ট প্রসেসিং জোন', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4224, 'Rampura TSO', 'রামপুরা টিএসও', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4225, 'Halishshar', 'হালিশহর', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4226, 'North Halishahar', 'উত্তর হালিশহর', 'Chittagong Sadar', 'চট্টগ্রাম সদর', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4300, 'Sandwip', 'সন্দ্বীপ', 'Sandwip', 'সন্দ্বীপ', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4301, 'Shiberhat', 'শিবেরহাট', 'Sandwip', 'সন্দ্বীপ', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4302, 'Urirchar', 'উড়িরচর', 'Sandwip', 'সন্দ্বীপ', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4310, 'Sitakunda', 'সীতাকুণ্ড', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4311, 'Baroidhala', 'বারইধালা', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4312, 'Barabkunda', 'বড়বকুন্ডা', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4313, 'Bawashbaria', 'বাওয়াশবাড়িয়া', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4314, 'Kumira', 'কুমিরা', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4315, 'Bhatiari', 'নিয়োগ', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4316, 'Fouzdarhat', 'ফৌজদারহাট', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4317, 'Jafrabad', 'জাফরাবাদ', 'Sitakunda', 'সীতাকুণ্ড', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4320, 'Mirsharai', 'মীরসরাই', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4321, 'Abutorab', 'আবুতোরাব', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4322, 'Darrogahat', 'দারোঘাট', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4323, 'Bharawazhat', 'ভরওয়াজহাট', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4324, 'Joarganj', 'জোয়ারগঞ্জ', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4325, 'Azampur', 'আজমপুর', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4327, 'Korerhat', 'কোরেরহাট', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4328, 'Mohazanhat', 'মোহাজানহাট', 'Mirsharai', 'মীরসরাই', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4330, 'Hathazari', 'হাটহাজারী', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4331, 'Chitt.University', 'চট্টগ্রামবিশ্ববিদ্যালয়', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4332, 'Gorduara', 'গর্দুয়ারা', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4333, 'Katirhat', 'কাটিরহাট', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4334, 'Mirzapur', 'মির্জাপুর', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4335, 'Fatahabad', 'ফাতাহাবাদ', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4337, 'Nuralibari', 'নুরালীবাড়ী', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4338, 'Yunus Nagar', 'ইউনুস নগর', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4339, 'Madrasa', 'মাদ্রাসা', 'Hathazari', 'হাটহাজারী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4340, 'Rouzan', 'রাউজান', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4341, 'Beenajuri', 'বীনাজুরী', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4342, 'Kundeshwari', 'কুন্দেশ্বরী', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4343, 'Gahira', 'গাহিরা', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4344, 'jagannath Hat', 'জগন্নাথ হাট', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4345, 'Fatepur', 'ফতেহপুর', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4346, 'Guzra Noapara', 'গুজরা নোয়াপাড়া', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4347, 'Dewanpur', 'দেওয়ানপুর', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4348, 'Mohamuni', 'মহামুনি', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4349, 'B.I.T Post Office', 'বিআইটি পোস্ট অফিস', 'Rouzan', 'রাউজান', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4350, 'Fatikchhari', 'ফটিকছড়ি', 'Fatikchhari', 'ফটিকছড়ি', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4351, 'Nanupur', 'নানুপুর', 'Fatikchhari', 'ফটিকছড়ি', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4352, 'Bhandar Sharif', 'ভান্ডার শরীফ', 'Fatikchhari', 'ফটিকছড়ি', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4353, 'Najirhat', 'নাজিরহাট', 'Fatikchhari', 'ফটিকছড়ি', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4354, 'Harualchhari', 'হারুয়ালছড়ি', 'Fatikchhari', 'ফটিকছড়ি', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4355, 'Narayanhat', 'নারায়ণহাট', 'Fatikchhari', 'ফটিকছড়ি', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4360, 'Rangunia', 'রাঙ্গুনিয়া', 'Rangunia', 'রাঙ্গুনিয়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4361, 'Dhamair', 'ধামাইর', 'Rangunia', 'রাঙ্গুনিয়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4363, 'Kanungopara', 'কানুঙ্গোপাড়া', 'Boalkhali', 'বোয়ালখালী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4364, 'Saroatoli', 'সারোয়াতলী', 'Boalkhali', 'বোয়ালখালী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4365, 'Iqbal Park', 'ইকবাল পার্ক', 'Boalkhali', 'বোয়ালখালী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4366, 'Boalkhali', 'বোয়ালখালী', 'Boalkhali', 'বোয়ালখালী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4367, 'Sakpura', 'শাকপুরা', 'Boalkhali', 'বোয়ালখালী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4368, 'Kadurkhal', 'কাদুরখাল', 'Boalkhali', 'বোয়ালখালী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4369, 'Charandwip', 'চরণদ্বীপ', 'Boalkhali', 'বোয়ালখালী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4370, 'Patia Head Office', 'পটিয়া প্রধান কার্যালয়', 'Patia Head Office', 'পটিয়া প্রধান কার্যালয়', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4371, 'Budhpara', 'বুদ্ধপাড়া', 'Patia Head Office', 'পটিয়া প্রধান কার্যালয়', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4376, 'Anowara', 'আনোয়ারা', 'Anawara', 'আনোয়ারা', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4377, 'Paroikora', 'পারইকোড়া', 'Anawara', 'আনোয়ারা', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4378, 'Battali', 'বাট্টালী', 'Anawara', 'আনোয়ারা', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4380, 'East Joara', 'পূর্ব জোয়ারা', 'East Joara', 'পূর্ব জোয়ারা', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4381, 'Gachbaria', 'গাছবাড়িয়া', 'East Joara', 'পূর্ব জোয়ারা', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4382, 'Dohazari', 'দোহাজারী', 'East Joara', 'পূর্ব জোয়ারা', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4383, 'Barma', 'বর্মা', 'East Joara', 'পূর্ব জোয়ারা', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4386, 'Satkania', 'সাতকানিয়া', 'Satkania', 'সাতকানিয়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4387, 'Baitul Ijjat', 'বায়তুল ইজ্জত', 'Satkania', 'সাতকানিয়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4388, 'Bazalia', 'বাজালিয়া', 'Satkania', 'সাতকানিয়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4390, 'Jaldi', 'জালদী', 'Jaldi', 'জালদী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4391, 'Khan Bahadur', 'খান বাহাদুর', 'Jaldi', 'জালদী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4392, 'Gunagari', 'গুনাগরী', 'Jaldi', 'জালদী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4393, 'Banigram', 'বনীগ্রাম', 'Jaldi', 'জালদী', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4396, 'Lohagara', 'লোহাগাড়া', 'Lohagara', 'লোহাগাড়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4397, 'Padua', 'পাডুয়া', 'Lohagara', 'লোহাগাড়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4398, 'Chunti', 'চুনতি', 'Lohagara', 'লোহাগাড়া', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম'),
(4400, 'Khagrachari Sadar', 'খাগড়াছড়ি সদর', 'Khagrachari Sadar', 'খাগড়াছড়ি সদর', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4410, 'Panchhari', 'পানছড়ি', 'Panchhari', 'পানছড়ি', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4420, 'Diginala', 'দিঘীনালা', 'Diginala', 'দিঘীনালা', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4430, 'Mahalchhari', 'মহালছড়ি', 'Mahalchhari', 'মহালছড়ি', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4440, 'Ramghar Head Office', 'রামগড় প্রধান কার্যালয়', 'Ramghar Head Office', 'রামগড় প্রধান কার্যালয়', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4450, 'Matiranga', 'মাটিরাঙ্গা', 'Matiranga', 'মাটিরাঙ্গা', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4460, 'Manikchhari', 'মানিকছড়ি', 'Manikchhari', 'মানিকছড়ি', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4470, 'Laxmichhari', 'লক্ষীছড়ি', 'Laxmichhari', 'লক্ষীছড়ি', 'Khagrachhari', 'খাগড়াছড়ি', 'Chattogram', 'চট্টগ্রাম'),
(4500, 'Rangamati Sadar', 'রাঙ্গামাটি সদর', 'Rangamati Sadar', 'রাঙ্গামাটি সদর', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4510, 'Kalampati', 'কালামপাটি', 'Kalampati', 'কালামপাটি', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4511, 'Betbunia', 'বেতবুনিয়া', 'Kalampati', 'কালামপাটি', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4520, 'Nanichhar', 'নানিয়ারচর', 'Naniachhar', 'নানিয়ারচর', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4530, 'Kaptai', 'কাপ্তাই', 'Kaptai', 'কাপ্তাই', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4531, 'Chandraghona', 'চন্দ্রঘোনা', 'Kaptai', 'কাপ্তাই', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4532, 'Kaptai Project', 'কাপ্তাই প্রজেক্ট', 'Kaptai', 'কাপ্তাই', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4533, 'Kaptai Nuton Bazar', 'কাপ্তাই নতুন বাজার', 'Kaptai', 'কাপ্তাই', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4540, 'Rajsthali', 'রাজস্থলী', 'Rajsthali', 'রাজস্থলী', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4550, 'Bilaichhari', 'বিলাইছড়ি', 'Bilaichhari', 'বিলাইছড়ি', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4560, 'Jarachhari', 'জুরাছড়ি', 'Jarachhari', 'জুরাছড়ি', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4570, 'Barakal', 'বরকল', 'Barakal', 'বরকল', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4580, 'Longachh', 'লংগাছ', 'Longachh', 'লংগাছ', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4590, 'Marishya', 'মারিশ্যা', 'Marishya', 'মারিশ্যা', 'Rangamati', 'রাঙ্গামাটি', 'Chattogram', 'চট্টগ্রাম'),
(4600, 'Bandarban Sadar', 'বান্দরবান সদর', 'Bandarban Sadar', 'বান্দরবান সদর', 'Bandarban', 'বান্দরবান', 'Chattogram', 'চট্টগ্রাম'),
(4610, 'Roanchhari', 'রোয়ানছড়ি', 'Roanchhari', 'রোয়ানছড়ি', 'Bandarban', 'বান্দরবান', 'Chattogram', 'চট্টগ্রাম'),
(4620, 'Ruma', 'রুমা', 'Ruma', 'রুমা', 'Bandarban', 'বান্দরবান', 'Chattogram', 'চট্টগ্রাম'),
(4630, 'Thanchi', 'থানচি', 'Thanchi', 'থানচি', 'Bandarban', 'বান্দরবান', 'Chattogram', 'চট্টগ্রাম'),
(4641, 'Lama', 'লামা', 'Thanchi', 'থানচি', 'Bandarban', 'বান্দরবান', 'Chattogram', 'চট্টগ্রাম'),
(4650, 'Alikadam', 'আলীকদম', 'Alikadam', 'আলীকদম', 'Bandarban', 'বান্দরবান', 'Chattogram', 'চট্টগ্রাম'),
(4660, 'Naikhong', 'নাইখং', 'Naikhong', 'নাইখং', 'Bandarban', 'বান্দরবান', 'Chattogram', 'চট্টগ্রাম'),
(4700, 'Coxs Bazar Sadar', 'কক্সবাজার সদর', 'Coxs Bazar Sadar', 'কক্সবাজার সদর', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4701, 'Zhilanja', 'ঝিলঞ্জা', 'Coxs Bazar Sadar', 'কক্সবাজার সদর', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4702, 'Eidga', 'ঈদগাহ', 'Coxs Bazar Sadar', 'কক্সবাজার সদর', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4710, 'Gorakghat', 'গোরাকঘাট', 'Gorakghat', 'গোরাকঘাট', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4720, 'Kutubdia', 'কুতুবদিয়া', 'Kutubdia', 'কুতুবদিয়া', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4730, 'Ramu', 'রামু', 'Ramu', 'রামু', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4740, 'Chiringga', 'চিরিঙ্গা', 'Chiringga', 'চিরিঙ্গা', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4741, 'Chiringga S.O', 'চিরিঙ্গা এসও', 'Chiringga', 'চিরিঙ্গা', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4742, 'Badarkali', 'বদরকালী', 'Chiringga', 'চিরিঙ্গা', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4743, 'Malumghat', 'মালুমঘাট', 'Chiringga', 'চিরিঙ্গা', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4750, 'Ukhia', 'উখিয়া', 'Ukhia', 'উখিয়া', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4760, 'Teknaf', 'টেকনাফ', 'Teknaf', 'টেকনাফ', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4761, 'Hnila', 'হ্নীলা', 'Teknaf', 'টেকনাফ', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(4762, 'St.Martin', 'সেন্ট মার্টিন', 'Teknaf', 'টেকনাফ', 'Cox\'s Bazar', 'কক্সবাজার', 'Chattogram', 'চট্টগ্রাম'),
(5000, 'Panchagar Sadar', 'পঞ্চগড় সদর', 'Panchagra Sadar', 'পঞ্চগড় সদর', 'Panchagarh', 'পঞ্চগড়', 'Rangpur', 'রংপুর'),
(5010, 'Boda', 'বোদা', 'Boda', 'বোদা', 'Panchagarh', 'পঞ্চগড়', 'Rangpur', 'রংপুর'),
(5020, 'Dabiganj', 'দবিগঞ্জ', 'Dabiganj', 'দবিগঞ্জ', 'Panchagarh', 'পঞ্চগড়', 'Rangpur', 'রংপুর'),
(5030, 'Tetulia', 'উপরে উঠুন', 'Tetulia', 'উপরে উঠুন', 'Panchagarh', 'পঞ্চগড়', 'Rangpur', 'রংপুর'),
(5040, 'Chotto Dab', 'ছোটো ড্যাব', 'Chotto Dab', 'ছোটো ড্যাব', 'Panchagarh', 'পঞ্চগড়', 'Rangpur', 'রংপুর'),
(5041, 'Mirjapur', 'মির্জাপুর', 'Chotto Dab', 'ছোটো ড্যাব', 'Panchagarh', 'পঞ্চগড়', 'Rangpur', 'রংপুর'),
(5100, 'Thakurgaon Sadar', 'ঠাকুরগাঁও সদর', 'Thakurgaon Sadar', 'ঠাকুরগাঁও সদর', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5101, 'Thakurgaon Road', 'ঠাকুরগাঁও রোড', 'Thakurgaon Sadar', 'ঠাকুরগাঁও সদর', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5102, 'Shibganj', 'শিবগঞ্জ', 'Thakurgaon Sadar', 'ঠাকুরগাঁও সদর', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5103, 'Ruhia', 'রাশিয়া', 'Thakurgaon Sadar', 'ঠাকুরগাঁও সদর', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5110, 'Pirganj', 'পীরগঞ্জ', 'Pirganj', 'পীরগঞ্জ', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5120, 'Rani Sankail', 'রানী শংকাইল', 'Rani Sankail', 'রানী শংকাইল', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5121, 'Nekmarad', 'নেকমরদ', 'Rani Sankail', 'রানী শংকাইল', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5130, 'Jibanpur', 'জীবনপুর', 'Jibanpur', 'জীবনপুর', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5140, 'Baliadangi', 'বালিয়াডাঙ্গী', 'Baliadangi', 'বালিয়াডাঙ্গী', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5141, 'Lahiri', 'লাহিড়ী', 'Baliadangi', 'বালিয়াডাঙ্গী', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5200, 'Dinajpur Sadar', 'দিনাজপুর সদর', 'Dinajpur Sadar', 'দিনাজপুর সদর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5201, 'Dinajpur Rajbari', 'দিনাজপুর রাজবাড়ী', 'Dinajpur Sadar', 'দিনাজপুর সদর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5210, 'Biral', 'বিরল', 'Biral', 'বিরল', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5216, 'Setabganj', 'সেতাবগঞ্জ', 'Setabganj', 'সেতাবগঞ্জ', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5220, 'Birganj', 'বীরগঞ্জ', 'Birganj', 'বীরগঞ্জ', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5226, 'Maharajganj', 'মহারাজগঞ্জ', 'Maharajganj', 'মহারাজগঞ্জ', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5230, 'Khansama', 'খানসামা', 'Khansama', 'খানসামা', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5231, 'Pakarhat', 'পাকড়হাট', 'Khansama', 'খানসামা', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5240, 'Chrirbandar', 'চড়িরবন্দর', 'Chrirbandar', 'চড়িরবন্দর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5241, 'Ranirbandar', 'রানীরবন্দর', 'Chrirbandar', 'চড়িরবন্দর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5250, 'Parbatipur', 'পার্বতীপুর', 'Parbatipur', 'পার্বতীপুর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5260, 'Phulbari', 'ফুলবাড়ী', 'Phulbari', 'ফুলবাড়ী', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5266, 'Birampur', 'বিরামপুর', 'Birampur', 'বিরামপুর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5270, 'Bangla Hili', 'বাংলা হিলি', 'Bangla Hili', 'বাংলা হিলি', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5280, 'Nababganj', 'নবাবগঞ্জ', 'Nababganj', 'নবাবগঞ্জ', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5281, 'Daudpur', 'দাউদপুর', 'Nababganj', 'নবাবগঞ্জ', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5282, 'Gopalpur', 'গোপালপুর', 'Nababganj', 'নবাবগঞ্জ', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5290, 'Osmanpur', 'ওসমানপুর', 'Osmanpur', 'ওসমানপুর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5291, 'Ghoraghat', 'ঘোড়াঘাট', 'Osmanpur', 'ওসমানপুর', 'Dinajpur', 'দিনাজপুর', 'Rangpur', 'রংপুর'),
(5300, 'Nilphamari Sadar', 'নীলফামারী সদর', 'Nilphamari Sadar', 'নীলফামারী সদর', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5301, 'Nilphamari Sugar Mil', 'নীলফামারী সুগার মিলস', 'Nilphamari Sadar', 'নীলফামারী সদর', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5310, 'Syedpur', 'সৈয়দপুর', 'Syedpur', 'সৈয়দপুর', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5311, 'Syedpur Upashahar', 'সৈয়দপুর উপশহর', 'Syedpur', 'সৈয়দপুর', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5320, 'Kishoriganj', 'কিশোরগঞ্জ', 'Kishoriganj', 'কিশোরগঞ্জ', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5330, 'Jaldhaka', 'জলঢাকা', 'Jaldhaka', 'জলঢাকা', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5340, 'Domar', 'ডোমার', 'Domar', 'ডোমার', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5341, 'Chilahati', 'চিলাহাটি', 'Domar', 'ডোমার', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5350, 'Dimla', 'ডিমলা', 'Dimla', 'ডিমলা', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5351, 'Ghaga Kharibari', 'ঘাগা খড়িবাড়ি', 'Dimla', 'ডিমলা', 'Nilphamari', 'নীলফামারী', 'Rangpur', 'রংপুর'),
(5400, 'Rangpur Sadar', 'রংপুর সদর', 'Rangpur Sadar', 'রংপুর সদর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5401, 'Rangpur Upa-Shahar', 'রংপুর উপ-শহর', 'Rangpur Sadar', 'রংপুর সদর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5402, 'Alamnagar', 'আলমনগর', 'Rangpur Sadar', 'রংপুর সদর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5403, 'Mahiganj', 'মাহিগঞ্জ', 'Rangpur Sadar', 'রংপুর সদর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5404, 'Rangpur Cadet Colleg', 'রংপুর ক্যাডেট কলেজ', 'Rangpur Sadar', 'রংপুর সদর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5405, 'Rangpur Carmiecal Col', 'রংপুর কারমাইকেল কলেজ', 'Rangpur Sadar', 'রংপুর সদর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5410, 'Gangachara', 'গঙ্গাচড়া', 'Gangachara', 'গঙ্গাচড়া', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5420, 'Taraganj', 'তারাগঞ্জ', 'Taraganj', 'তারাগঞ্জ', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5430, 'Badarganj', 'বদরগঞ্জ', 'Badarganj', 'বদরগঞ্জ', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5431, 'Shyampur', 'শ্যামপুর', 'Badarganj', 'বদরগঞ্জ', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5440, 'Kaunia', 'কাউনিয়া', 'Kaunia', 'কাউনিয়া', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5441, 'Haragachh', 'হারাগাছ', 'Kaunia', 'কাউনিয়া', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5450, 'Pirgachha', 'পীরগাছা', 'Pirgachha', 'পীরগাছা', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5460, 'Mithapukur', 'মিঠাপুকুর', 'Mithapukur', 'মিঠাপুকুর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর'),
(5470, 'Pirganj', 'পীরগঞ্জ', 'Pirganj', 'পীরগঞ্জ', 'Thakurgaon', 'ঠাকুরগাঁও', 'Rangpur', 'রংপুর'),
(5500, 'Lalmonirhat Sadar', 'লালমনিরহাট সদর', 'Lalmonirhat Sadar', 'লালমনিরহাট সদর', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5501, 'Moghalhat', 'মোগলহাট', 'Lalmonirhat Sadar', 'লালমনিরহাট সদর', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5502, 'Kulaghat SO', 'কুলাঘাট এসও', 'Lalmonirhat Sadar', 'লালমনিরহাট সদর', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5510, 'Aditmari', 'আদিতমারী', 'Aditmari', 'আদিতমারী', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5520, 'Tushbhandar', 'তুষভান্ডার', 'Tushbhandar', 'তুষভান্ডার', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5530, 'Hatibandha', 'হাতিবান্ধা', 'Hatibandha', 'হাতিবান্ধা', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5540, 'Patgram', 'পাটগ্রাম', 'Patgram', 'পাটগ্রাম', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5541, 'Baura', 'বাউরা', 'Patgram', 'পাটগ্রাম', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5542, 'Burimari', 'বুড়িমারী', 'Patgram', 'পাটগ্রাম', 'Lalmonirhat', 'লালমনিরহাট', 'Rangpur', 'রংপুর'),
(5600, 'Kurigram Sadar', 'কুড়িগ্রাম সদর', 'Kurigram Sadar', 'কুড়িগ্রাম সদর', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5601, 'Pandul', 'অ্যাম্বুশ', 'Kurigram Sadar', 'কুড়িগ্রাম সদর', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5610, 'Rajarhat', 'রাজারহাট', 'Rajarhat', 'রাজারহাট', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5611, 'Nazimkhan', 'নাজিমখান', 'Rajarhat', 'রাজারহাট', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5620, 'Ulipur', 'উলিপুর', 'Ulipur', 'উলিপুর', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5621, 'Bazarhat', 'বাজারহাট', 'Ulipur', 'উলিপুর', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5630, 'Chilmari', 'চিলমারী', 'Chilmari', 'চিলমারী', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5631, 'Jorgachh', 'জরগাছ', 'Chilmari', 'চিলমারী', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5640, 'Roumari', 'রৌমারী', 'Roumari', 'রৌমারী', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5650, 'Rajibpur', 'রাজিবপুর', 'Rajibpur', 'রাজিবপুর', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5660, 'Nageshwar', 'নাগেশ্বর', 'Nageshwar', 'নাগেশ্বর', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5670, 'Bhurungamari', 'ভুরুঙ্গামারী', 'Bhurungamari', 'ভুরুঙ্গামারী', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5680, 'Phulbari', 'ফুলবাড়ী', 'Kurigram Sadar', 'কুড়িগ্রাম সদর', 'Kurigram', 'কুড়িগ্রাম', 'Rangpur', 'রংপুর'),
(5700, 'Gaibandha Sadar', 'গাইবান্ধা সদর', 'Gaibandha Sadar', 'গাইবান্ধা সদর', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5710, 'Saadullapur', 'সাদুল্লাপুর', 'Saadullapur', 'সাদুল্লাপুর', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5711, 'Naldanga', 'নলডাঙ্গা', 'Saadullapur', 'সাদুল্লাপুর', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5720, 'Sundarganj', 'সুন্দরগঞ্জ', 'Sundarganj', 'সুন্দরগঞ্জ', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5721, 'Bamandanga', 'তারা চুমু খেলেন', 'Sundarganj', 'সুন্দরগঞ্জ', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5730, 'Palashbari', 'পলাশবাড়ী', 'Palashbari', 'পলাশবাড়ী', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5740, 'Gobindhaganj', 'গোবিন্দগঞ্জ', 'Gobindaganj', 'গোবিন্দগঞ্জ', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5741, 'Mahimaganj', 'মহিমাগঞ্জ', 'Gobindaganj', 'গোবিন্দগঞ্জ', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5750, 'Bonarpara', 'বোনারপাড়া', 'Bonarpara', 'বোনারপাড়া', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5751, 'saghata', 'সাঘাটা', 'Bonarpara', 'বোনারপাড়া', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5760, 'Phulchhari', 'ফুলছড়ি', 'Phulchhari', 'ফুলছড়ি', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5761, 'Bharatkhali', 'ভরতখালী', 'Phulchhari', 'ফুলছড়ি', 'Gaibandha', 'গাইবান্ধা', 'Rangpur', 'রংপুর'),
(5800, 'Bogra Sadar', 'বগুড়া সদর', 'Bogura Sadar', 'বগুড়া সদর', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5801, 'Bogra Canttonment', 'বগুড়া ক্যান্টনমেন্ট', 'Bogura Sadar', 'বগুড়া সদর', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5810, 'Shibganj', 'শিবগঞ্জ', 'Shibganj', 'শিবগঞ্জ', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5820, 'Gabtoli', 'গাবতলী', 'Gabtoli', 'গাবতলী', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5821, 'Sukhanpukur', 'সুখানপুকুর', 'Gabtoli', 'গাবতলী', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5826, 'Sonatola', 'সোনাটোলা', 'Sonatola', 'সোনাটোলা', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5830, 'Sariakandi', 'সারিয়াকান্দি', 'Sariakandi', 'সারিয়াকান্দি', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5831, 'Chandan Baisha', 'চন্দন বাইশা', 'Sariakandi', 'সারিয়াকান্দি', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5840, 'Sherpur', 'শেরপুর', 'Sherpur', 'শেরপুর', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5841, 'Chandaikona', 'চান্দাইকোনা', 'Sherpur', 'শেরপুর', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5842, 'Palli Unnyan Accadem', 'পল্লী উন্নয়ন একাডেমি', 'Sherpur', 'শেরপুর', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5850, 'Dhunat', 'ধুনট', 'Dhunat', 'ধুনট', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5851, 'Gosaibari', 'গোসাইবাড়ি', 'Dhunat', 'ধুনট', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5860, 'Nandigram', 'নন্দিগ্রাম', 'Nandigram', 'নন্দিগ্রাম', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5870, 'Kahalu', 'ড্রাইভ', 'Kahalu', 'ড্রাইভ', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5880, 'Dupchachia', 'দুপচাচিয়া', 'Dupchachia', 'দুপচাচিয়া', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5881, 'Talora', 'মাঝে মাঝে', 'Dupchachia', 'দুপচাচিয়া', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5890, 'Adamdighi', 'আদমদীঘি', 'Alamdighi', 'আলমডিঙ্গি', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5891, 'Santahar', 'সান্তাহার', 'Alamdighi', 'আলমডিঙ্গি', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5892, 'Nasharatpur', 'নাশারতপুর', 'Alamdighi', 'আলমডিঙ্গি', 'Bogura', 'বগুড়া', 'Rajshahi', 'রাজশাহী'),
(5900, 'Joypurhat Sadar', 'জয়পুরহাট সদর', 'Joypurhat Sadar', 'জয়পুরহাট সদর', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi', 'রাজশাহী'),
(5910, 'Panchbibi', 'পাঁচবিবি', 'Panchbibi', 'পাঁচবিবি', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi', 'রাজশাহী'),
(5920, 'Khetlal', 'খেতলাল', 'Khetlal', 'খেতলাল', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi', 'রাজশাহী'),
(5930, 'kalai', 'হাঁটু', 'Kalai', 'হাঁটু', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi', 'রাজশাহী'),
(5940, 'Akklepur', 'আক্কেলপুর', 'Akkelpur', 'আক্কেলপুর', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi', 'রাজশাহী'),
(5941, 'jamalganj', 'জামালগঞ্জ', 'Akkelpur', 'আক্কেলপুর', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi', 'রাজশাহী'),
(5942, 'Tilakpur', 'তিলকপুর', 'Akkelpur', 'আক্কেলপুর', 'Joypurhat', 'জয়পুরহাট', 'Rajshahi', 'রাজশাহী'),
(6000, 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6100, 'Ghuramara', 'ঘুরমারা', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6201, 'Rajshahi Court', 'রাজশাহী আদালত', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6202, 'Rajshahi Canttonment', 'রাজশাহী ক্যান্টনমেন্ট', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6203, 'Sapura', 'সপুরা', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6204, 'Kazla', 'হংস', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6205, 'Rajshahi University', 'রাজশাহী বিশ্ববিদ্যালয়', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6206, 'Binodpur Bazar', 'বিনোদপুর মার্কেট', 'Rajshahi Sadar', 'রাজশাহী সদর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6210, 'Lalitganj', 'ললিতগঞ্জ', 'Lalitganj', 'ললিতগঞ্জ', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6211, 'Rajshahi Sugar Mills', 'রাজশাহী সুগার মিলস', 'Lalitganj', 'ললিতগঞ্জ', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6212, 'Shyampur', 'শ্যামপুর', 'Lalitganj', 'ললিতগঞ্জ', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6220, 'Khodmohanpur', 'খোদমোহনপুর', 'Khod Mohanpur', 'খোদ মোহনপুর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6230, 'Tanor', 'তানোর', 'Tanor', 'তানোর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6240, 'Durgapur', 'দুর্গাপুর', 'Durgapur', 'দুর্গাপুর', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6250, 'Bhabaniganj', 'ভবানীগঞ্জ', 'Bhabaniganj', 'ভবানীগঞ্জ', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6251, 'Taharpur', 'তাহারপুর', 'Bhabaniganj', 'ভবানীগঞ্জ', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6260, 'Putia', 'পুটিয়া', 'Putia', 'পুটিয়া', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6270, 'Charghat', 'চারঘাট', 'Charghat', 'চারঘাট', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6271, 'Sarda', 'সার্ডিনিয়ান', 'Charghat', 'চারঘাট', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6280, 'Bagha', 'বাঘা', 'Bagha', 'বাঘা', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6281, 'Arani', 'আরানী', 'Bagha', 'বাঘা', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6290, 'Godagari', 'গোদাগাড়ী', 'Godagari', 'গোদাগাড়ী', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6291, 'Premtoli', 'এটা প্রতিশ্রুতি', 'Godagari', 'গোদাগাড়ী', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী'),
(6300, 'Chapinawbganj Sadar', 'চাঁপাইনবাবগঞ্জ সদর', 'Chapinawabganj Sadar', 'চাঁপাইনবাবগঞ্জ সদর', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6301, 'Rajarampur', 'রাজারামপুর', 'Chapinawabganj Sadar', 'চাঁপাইনবাবগঞ্জ সদর', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6302, 'Ramchandrapur', 'রামচন্দ্রপুর', 'Chapinawabganj Sadar', 'চাঁপাইনবাবগঞ্জ সদর', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6303, 'Amnura', 'আমনুরা', 'Chapinawabganj Sadar', 'চাঁপাইনবাবগঞ্জ সদর', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6310, 'Nachol', 'নিক', 'Nachol', 'নিক', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6311, 'Mandumala', 'মন্ডুমালা', 'Nachol', 'নিক', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6320, 'Rohanpur', 'রহনপুর', 'Rohanpur', 'রহনপুর', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6321, 'Gomashtapur', 'গোমষ্টপুর', 'Rohanpur', 'রহনপুর', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6330, 'Bholahat', 'ভোলাহাট', 'Bholahat', 'ভোলাহাট', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6340, 'Shibganj U.P.O', 'ইউপিও', 'Shibganj U.P.O', 'ইউপিও', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6341, 'Kansart', 'কানসার্ট', 'Shibganj U.P.O', 'ইউপিও', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6342, 'Manaksha', 'মনক্ষা', 'Shibganj U.P.O', 'ইউপিও', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6400, 'Natore Sadar', 'নাটোর সদর', 'Natore Sadar', 'নাটোর সদর', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6401, 'Digapatia', 'দিঘাপতিয়া', 'Natore Sadar', 'নাটোর সদর', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6402, 'Baiddyabal Gharia', 'বৈদ্যবল ঘরিয়া', 'Natore Sadar', 'নাটোর সদর', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6403, 'Madhnagar', 'মাধনগর', 'Natore Sadar', 'নাটোর সদর', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী');
INSERT INTO `location` (`postal_code`, `post_office`, `post_office_bn`, `upazila`, `upazila_bn`, `district`, `district_bn`, `division`, `division_bn`) VALUES
(6410, 'Laxman', 'লক্ষ্মণ', 'Laxman', 'লক্ষ্মণ', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6420, 'Gopalpur U.P.O', 'ইউপিও', 'Gopalpur UPO', 'ইউপিও', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6421, 'Lalpur S.O', 'লালপুর এসও', 'Gopalpur UPO', 'ইউপিও', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6422, 'Abdulpur', 'আবদুলপুর', 'Gopalpur UPO', 'ইউপিও', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6430, 'Harua', 'হারুয়া', 'Harua', 'হারুয়া', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6431, 'Dayarampur', 'দয়ারামপুর', 'Harua', 'হারুয়া', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6432, 'Baraigram', 'বড়াইগ্রাম', 'Harua', 'হারুয়া', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6440, 'Hatgurudaspur', 'হাটগুরুদাসপুর', 'Hatgurudaspur', 'হাটগুরুদাসপুর', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6450, 'Singra', 'সিংড়া', 'Singra', 'সিংড়া', 'Natore', 'নাটোর', 'Rajshahi', 'রাজশাহী'),
(6500, 'Naogaon Sadar', 'নওগাঁ সদর', 'Naogaon Sadar', 'নওগাঁ সদর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6510, 'Prasadpur', 'প্রসাদপুর', 'Prasadpur', 'প্রসাদপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6511, 'Manda', 'মান্দা', 'Prasadpur', 'প্রসাদপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6512, 'Balihar', 'বলিহার', 'Prasadpur', 'প্রসাদপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6520, 'Niamatpur', 'নিয়ামতপুর', 'Niamatpur', 'নিয়ামতপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6530, 'Mahadebpur', 'মহাদেবপুর', 'Mahadebpur', 'মহাদেবপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6540, 'Patnitala', 'পত্নিতলা', 'Patnitala', 'পত্নিতলা', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6550, 'Nitpur', 'নিতপুর', 'Nitpur', 'নিতপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6551, 'Porsa', 'একবার', 'Nitpur', 'নিতপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6552, 'Panguria', 'পানুরিয়া', 'Nitpur', 'নিতপুর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6560, 'Sapahar', 'সাপাহার', 'Sapahar', 'সাপাহার', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6561, 'Moduhil', 'মদুহিল', 'Sapahar', 'সাপাহার', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6570, 'Badalgachhi', 'বদলগাছী', 'Badalgachhi', 'বদলগাছী', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6580, 'Dhamuirhat', 'ধামুইরহাট', 'Dhamuirhat', 'ধামুইরহাট', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6590, 'Raninagar', 'রানী নগর', 'Raninagar', 'রানী নগর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6591, 'Kashimpur', 'কাশিমপুর', 'Raninagar', 'রানী নগর', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6596, 'Ahsanganj', 'আহসানগঞ্জ', 'Ahsanganj', 'আহসানগঞ্জ', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6597, 'Bandai', 'পশুপাল', 'Ahsanganj', 'আহসানগঞ্জ', 'Naogaon', 'ধৃত', 'Rajshahi', 'রাজশাহী'),
(6600, 'Pabna Sadar', 'পাবনা সদর', 'Pabna Sadar', 'পাবনা সদর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6601, 'Kaliko Cotton Mills', 'কালিকো কটন মিলস', 'Pabna Sadar', 'পাবনা সদর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6602, 'Hamayetpur', 'হামায়েতপুর', 'Pabna Sadar', 'পাবনা সদর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6610, 'Debottar', 'দেবোত্তর', 'Debottar', 'দেবোত্তর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6620, 'Ishwardi', 'ঈশ্বরদী', 'Ishwardi', 'ঈশ্বরদী', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6621, 'Dhapari', 'ধাপারি', 'Ishwardi', 'ঈশ্বরদী', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6622, 'Pakshi', 'পাকশী', 'Ishwardi', 'ঈশ্বরদী', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6623, 'Rajapur', 'রাজাপুর', 'Ishwardi', 'ঈশ্বরদী', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6630, 'Chatmohar', 'চাটমোহর', 'Chatmohar', 'চাটমোহর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6640, 'Bhangura', 'ভাঙ্গুড়া', 'Bhangura', 'ভাঙ্গুড়া', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6650, 'Banwarinagar', 'বনওয়ারীনগর', 'Banwarinagar', 'বনওয়ারীনগর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6660, 'Sujanagar', 'সুজানগর', 'Sujanagar', 'সুজানগর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6661, 'Sagarkandi', 'সাগরকান্দি', 'Sujanagar', 'সুজানগর', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6670, 'Sathia', 'সাথী', 'Sathia', 'সাথী', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6680, 'Bera', 'বেড়া', 'Bera', 'বেড়া', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6681, 'Nakalia', 'নাকালিয়া', 'Bera', 'বেড়া', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6682, 'Kashinathpur', 'কাশিনাথপুর', 'Bera', 'বেড়া', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6683, 'Puran Bharenga', 'পুরান ভারেঙ্গা', 'Bera', 'বেড়া', 'Pabna', 'পাবনা', 'Rajshahi', 'রাজশাহী'),
(6700, 'Sirajganj Sadar', 'সিরাজগঞ্জ সদর', 'Sirajganj Sadar', 'সিরাজগঞ্জ সদর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6701, 'Raipur', 'রায়পুর', 'Sirajganj Sadar', 'সিরাজগঞ্জ সদর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6702, 'Rashidabad', 'রশিদাবাদ', 'Sirajganj Sadar', 'সিরাজগঞ্জ সদর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6710, 'Kazipur', 'কাজিপুর', 'Kazipur', 'কাজিপুর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6711, 'Shuvgachha', 'এত এত', 'Kazipur', 'কাজিপুর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6712, 'Gandail', 'গান্ডাইল', 'Kazipur', 'কাজিপুর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6720, 'Dhangora', 'ভালুক', 'Dhangora', 'ভালুক', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6721, 'Malonga', 'সফলতা', 'Dhangora', 'ভালুক', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6730, 'Baiddya Jam Toil', 'বৈদ্য জাম মেহনত', 'Baiddya Jam Toil', 'বৈদ্য জাম মেহনত', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6740, 'Belkuchi', 'বেলকুচি', 'Belkuchi', 'বেলকুচি', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6741, 'Sohagpur', 'সোহাগপুর', 'Belkuchi', 'বেলকুচি', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6742, 'Rajapur', 'রাজাপুর', 'Belkuchi', 'বেলকুচি', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6751, 'Enayetpur', 'এনায়েতপুর', 'Belkuchi', 'বেলকুচি', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6752, 'Sthal', 'স্থল', 'Belkuchi', 'বেলকুচি', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6760, 'Ullapara', 'উল্লাপাড়া', 'Ullapara', 'উল্লাপাড়া', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6761, 'Ullapara R.S', 'উল্লাপাড়া আরএস', 'Ullapara', 'উল্লাপাড়া', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6762, 'Lahiri Mohanpur', 'লাহিড়ী মোহনপুর', 'Ullapara', 'উল্লাপাড়া', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6763, 'Salap', 'মলম', 'Ullapara', 'উল্লাপাড়া', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6770, 'Shahjadpur', 'শাহজাদপুর', 'Shahjadpur', 'শাহজাদপুর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6771, 'Porjana', 'পোরজনা', 'Shahjadpur', 'শাহজাদপুর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6772, 'Jamirta', 'জামিরতা', 'Shahjadpur', 'শাহজাদপুর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6773, 'Kaijuri', 'কৈজুরী', 'Shahjadpur', 'শাহজাদপুর', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(6780, 'Tarash', 'তাড়াশ', 'Tarash', 'তাড়াশ', 'Sirajganj', 'সিরাজগঞ্জ', 'Rajshahi', 'রাজশাহী'),
(7000, 'Kustia Sadar', 'কুষ্টিয়া সচেতন', 'Kustia Sadar', 'কুষ্টিয়া সচেতন', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7001, 'Kushtia Mohini', 'কুষ্টিয়া মোহিনী', 'Kustia Sadar', 'কুষ্টিয়া সচেতন', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7002, 'Jagati', 'শেয়ার করা হয়েছিল', 'Kustia Sadar', 'কুষ্টিয়া সচেতন', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7003, 'Islami University', 'ইসলামী বিশ্ববিদ্যালয়', 'Kustia Sadar', 'কুষ্টিয়া সচেতন', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7010, 'Kumarkhali', 'কুমারখালী', 'Kumarkhali', 'কুমারখালী', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7011, 'Panti', 'বাড়ি', 'Kumarkhali', 'কুমারখালী', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7020, 'Janipur', 'জানিপুর', 'Janipur', 'জানিপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7021, 'Khoksa', 'খোকসা', 'Janipur', 'জানিপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7030, 'Mirpur', 'মিরপুর', 'Mirpur', 'মিরপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7031, 'Poradaha', 'উপদেশ', 'Mirpur', 'মিরপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7032, 'Amla Sadarpur', 'আমলা সদরপুর', 'Mirpur', 'মিরপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7040, 'Bheramara', 'ভেড়ামারা', 'Bheramara', 'ভেড়ামারা', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7041, 'Ganges Bheramara', 'গঙ্গা ভেড়ামারা', 'Bheramara', 'ভেড়ামারা', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7042, 'Allardarga', 'আল্লারদারগা', 'Bheramara', 'ভেড়ামারা', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7050, 'Rafayetpur', 'রাফায়েতপুর', 'Rafayetpur', 'রাফায়েতপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7051, 'Taragunia', 'তারাগুনিয়া', 'Rafayetpur', 'রাফায়েতপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7052, 'Khasmathurapur', 'খাসমথুরাপুর', 'Rafayetpur', 'রাফায়েতপুর', 'Kushtia', 'কুষ্টিয়া', 'Khulna', 'খুলনা'),
(7100, 'Meherpur Sadar', 'মেহেরপুর সদর', 'Meherpur Sadar', 'মেহেরপুর সদর', 'Meherpur', 'মেহেরপুর', 'Khulna', 'খুলনা'),
(7101, 'Amjhupi', 'আমঝুপি', 'Meherpur Sadar', 'মেহেরপুর সদর', 'Meherpur', 'মেহেরপুর', 'Khulna', 'খুলনা'),
(7102, 'Mujib Nagar Complex', 'মুজিব নগর কমপ্লেক্স', 'Meherpur Sadar', 'মেহেরপুর সদর', 'Meherpur', 'মেহেরপুর', 'Khulna', 'খুলনা'),
(7110, 'Gangni', 'গাংনী', 'Gangni', 'গাংনী', 'Meherpur', 'মেহেরপুর', 'Khulna', 'খুলনা'),
(7152, 'Amjhupi', 'আমঝুপি', 'Meherpur Sadar', 'মেহেরপুর সদর', 'Meherpur', 'মেহেরপুর', 'Khulna', 'খুলনা'),
(7200, 'Chuadanga Sadar', 'চুয়াডাঙ্গা সদর', 'Chuadanga Sadar', 'চুয়াডাঙ্গা সদর', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7201, 'Munshiganj', 'মুন্সিগঞ্জ', 'Chuadanga Sadar', 'চুয়াডাঙ্গা সদর', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7210, 'Alamdanga', 'আলমডাঙ্গা', 'Alamdanga', 'আলমডাঙ্গা', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7211, 'Hardi', 'হার্ডি', 'Alamdanga', 'আলমডাঙ্গা', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7220, 'Damurhuda', 'দামুড়হুদা', 'Damurhuda', 'দামুড়হুদা', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7221, 'Darshana', 'দর্শনা', 'Damurhuda', 'দামুড়হুদা', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7222, 'Andulbaria', 'আন্দুলবাড়িয়া', 'Damurhuda', 'দামুড়হুদা', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7230, 'Doulatganj', 'দৌলতগঞ্জ', 'Doulatganj', 'দৌলতগঞ্জ', 'Chuadanga', 'চুয়াডাঙ্গা', 'Khulna', 'খুলনা'),
(7300, 'Jinaidaha Sadar', 'ঝিনাইদহ সদর', 'Jinaidaha Sadar', 'ঝিনাইদহ সদর', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7301, 'Jinaidaha Cadet College', 'ঝিনাইদহ ক্যাডেট কলেজ', 'Jinaidaha Sadar', 'ঝিনাইদহ সদর', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7310, 'Harinakundu', 'হরিণাকুন্ডু', 'Harinakundu', 'হরিণাকুন্ডু', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7320, 'Shailakupa', 'শৈলকুপা', 'Shailakupa', 'শৈলকুপা', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7321, 'Kumiradaha', 'কুমিরদহ', 'Shailakupa', 'শৈলকুপা', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7330, 'Kotchandpur', 'কোটচাঁদপুর', 'Kotchandpur', 'কোটচাঁদপুর', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7340, 'Maheshpur', 'মহেশপুর', 'Maheshpur', 'মহেশপুর', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7350, 'Naldanga', 'নলডাঙ্গা', 'Naldanga', 'নলডাঙ্গা', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7351, 'Hatbar Bazar', 'হাটবার বাজার', 'Naldanga', 'নলডাঙ্গা', 'Jhenaidah', 'ঝিনাইদহ', 'Khulna', 'খুলনা'),
(7400, 'Jessore Sadar', 'যশোর সদর', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7401, 'Jessore Upa-Shahar', 'যশোর উপশহর', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7402, 'Chanchra', 'চাঁচড়া', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7403, 'Jessore canttonment', 'যশোর ক্যান্টনমেন্ট', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7404, 'Jessore Airbach', 'যশোর এয়ারবেস', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7405, 'Rupdia', 'রূপদিয়া', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7406, 'Basundia', 'বসুন্দিয়া', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7407, 'Churamankathi', 'চুরমনকাঠি', 'Jashore Sadar', 'যশোর সদর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7410, 'Chougachha', 'চৌগাছা', 'Chaugachha', 'চৌগাছা', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7420, 'Jhikargachha', 'ঝিকরগাছা', 'Jhikargachha', 'ঝিকরগাছা', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7430, 'Sarsa', 'ড্রেসিং', 'Sarsa', 'ড্রেসিং', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7431, 'Benapole', 'বেনাপোল', 'Sarsa', 'ড্রেসিং', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7432, 'Jadabpur', 'যাদবপুর', 'Sarsa', 'ড্রেসিং', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7433, 'Bag Achra', 'ব্যাগ আচড়া', 'Sarsa', 'ড্রেসিং', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7440, 'Monirampur', 'মনিরামপুর', 'Monirampur', 'মনিরামপুর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7450, 'Keshobpur', 'কেশবপুর', 'Keshabpur', 'কেশবপুর', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7460, 'Noapara', 'নূহ', 'Noapara', 'নূহ', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7461, 'Rajghat', 'রাজঘাট', 'Noapara', 'নূহ', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7462, 'Bhugilhat', 'ভূগিলহাট', 'Noapara', 'নূহ', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7470, 'Bagharpara', 'বাঘারপাড়া', 'Bagharpara', 'বাঘারপাড়া', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7471, 'Gouranagar', 'গৌরনগর', 'Bagharpara', 'বাঘারপাড়া', 'Jashore', 'যশোর', 'Khulna', 'খুলনা'),
(7500, 'Narail Sadar', 'নড়াইল সদর', 'Narail Sadar', 'নড়াইল সদর', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7501, 'Ratanganj', 'রতনগঞ্জ', 'Narail Sadar', 'নড়াইল সদর', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7510, 'Laxmipasha', 'লক্ষ্মীপাশা', 'Laxmipasha', 'লক্ষ্মীপাশা', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7511, 'Lohagora', 'জলাভূমিতে', 'Laxmipasha', 'লক্ষ্মীপাশা', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7512, 'Itna', 'ইটনা', 'Laxmipasha', 'লক্ষ্মীপাশা', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7513, 'Naldi', 'নলদি', 'Laxmipasha', 'লক্ষ্মীপাশা', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7514, 'Baradia', 'মিরাদিয়া', 'Laxmipasha', 'লক্ষ্মীপাশা', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7520, 'Kalia', 'কালিয়া', 'Kalia', 'কালিয়া', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7521, 'Mohajan', 'মোহজন', 'Mohajan', 'মোহজন', 'Narail', 'নড়াইল', 'Khulna', 'খুলনা'),
(7600, 'Magura Sadar', 'মাগুরা সদর', 'Magura Sadar', 'মাগুরা সদর', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7610, 'Shripur', 'শ্রীপুর', 'Shripur', 'শ্রীপুর', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7611, 'Langalbadh', 'লাঙ্গলবধ', 'Shripur', 'শ্রীপুর', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7612, 'Nachol', 'নিক', 'Shripur', 'শ্রীপুর', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7620, 'Arpara', 'আরপাড়া', 'Arpara', 'আরপাড়া', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7630, 'Mohammadpur', 'মোহাম্মদপুর', 'Mohammadpur', 'মোহাম্মদপুর', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7631, 'Binodpur', 'বিনোদপুর', 'Mohammadpur', 'মোহাম্মদপুর', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7632, 'Nahata', 'ত্বকের কাছে', 'Mohammadpur', 'মোহাম্মদপুর', 'Magura', 'মাগুরা', 'Khulna', 'খুলনা'),
(7700, 'Rajbari Sadar', 'রাজবাড়ী সদর', 'Rajbari Sadar', 'রাজবাড়ী সদর', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7710, 'Goalanda', 'গোয়ালন্দ', 'Rajbari Sadar', 'রাজবাড়ী সদর', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7711, 'Khankhanapur', 'খানখানাপুর', 'Rajbari Sadar', 'রাজবাড়ী সদর', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7720, 'Pangsha', 'পাংশা', 'Pangsha', 'পাংশা', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7721, 'Ramkol', 'রামকোল', 'Pangsha', 'পাংশা', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7722, 'Ratandia', 'রতনদিয়া', 'Pangsha', 'পাংশা', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7723, 'Mrigibazar', 'মৃগিবাজার', 'Pangsha', 'পাংশা', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7730, 'Baliakandi', 'বালিয়াকান্দি', 'Baliakandi', 'বালিয়াকান্দি', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7731, 'Nalia', 'আমি কাঁদছি', 'Baliakandi', 'বালিয়াকান্দি', 'Rajbari', 'রাজবাড়ী', 'Dhaka', 'ঢাকা'),
(7800, 'Faridpursadar', 'ফরিদপুর সদর', 'Faridpur Sadar', 'ফরিদপুর সদর', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7801, 'Kanaipur', 'কানাইপুর', 'Faridpur Sadar', 'ফরিদপুর সদর', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7802, 'Ambikapur', 'অম্বিকাপুর', 'Faridpur Sadar', 'ফরিদপুর সদর', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7803, 'Baitulaman Politecni', 'বায়তুল আমান পলিটেকনিক', 'Faridpur Sadar', 'ফরিদপুর সদর', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7804, 'Shriangan', 'শ্রিংগান', 'Shriangan', 'শ্রিংগান', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7810, 'Charbadrashan', 'যানবাহন', 'Charbhadrasan', 'চরভদ্রাসন', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7820, 'Sadarpur', 'সদরপুর', 'Sadarpur', 'সদরপুর', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7821, 'Hat Krishapur', 'কৃষাপুরের হাট', 'Sadarpur', 'সদরপুর', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7822, 'Bishwa jaker Manjil', 'বিশ্ব জাকের মঞ্জিল', 'Sadarpur', 'সদরপুর', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7830, 'Bhanga', 'ভাঙ্গা', 'Bhanga', 'ভাঙ্গা', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7840, 'Nagarkanda', 'নগরকান্দা', 'Nagarkanda', 'নগরকান্দা', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7841, 'Talma', 'তালমা', 'Nagarkanda', 'নগরকান্দা', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7850, 'Madukhali', 'তুমি এখানে', 'Madukhali', 'তুমি এখানে', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7851, 'Kamarkali', 'কামারকলি', 'Madukhali', 'তুমি এখানে', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7860, 'Boalmari', 'বোয়ালমারী', 'Boalmari', 'বোয়ালমারী', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7861, 'Rupatpat', 'রূপপাত', 'Boalmari', 'বোয়ালমারী', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7870, 'Alfadanga', 'আলফাডাঙ্গা', 'Alfadanga', 'আলফাডাঙ্গা', 'Faridpur', 'ফরিদপুর', 'Dhaka', 'ঢাকা'),
(7900, 'Madaripur Sadar', 'মাদারীপুর সদর', 'Madaripur Sadar', 'মাদারীপুর সদর', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7901, 'Charmugria', 'কবজ', 'Madaripur Sadar', 'মাদারীপুর সদর', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7902, 'Kulpaddi', 'কুলপদ্দি', 'Madaripur Sadar', 'মাদারীপুর সদর', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7903, 'Habiganj', 'হবিগঞ্জ', 'Madaripur Sadar', 'মাদারীপুর সদর', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7904, 'Mustafapur', 'মোস্তফাপুর', 'Madaripur Sadar', 'মাদারীপুর সদর', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7910, 'Rajoir', 'রাজৈর', 'Rajoir', 'রাজৈর', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7911, 'Khalia', 'খালিয়া', 'Rajoir', 'রাজৈর', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7920, 'Kalkini', 'কালকিনি', 'kalkini', 'কালকিনি', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7921, 'Sahabrampur', 'সহব্রমপুর', 'kalkini', 'কালকিনি', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7930, 'Barhamganj', 'বারহামগঞ্জ', 'Barhamganj', 'বারহামগঞ্জ', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7931, 'Nilaksmibandar', 'নীলক্ষ্মীবন্দর', 'Barhamganj', 'বারহামগঞ্জ', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7932, 'Bahadurpur', 'বাহাদুরপুর', 'Barhamganj', 'বারহামগঞ্জ', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(7933, 'Umedpur', 'উমেদপুর', 'Barhamganj', 'বারহামগঞ্জ', 'Madaripur', 'মাদারীপুর', 'Dhaka', 'ঢাকা'),
(8000, 'Shariatpur Sadar', 'শরীয়তপুর সদর', 'Shariatpur Sadar', 'শরীয়তপুর সদর', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8001, 'Angaria', 'আঙ্গারিয়া', 'Shariatpur Sadar', 'শরীয়তপুর সদর', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8002, 'Chikandi', 'চিকন্দি', 'Shariatpur Sadar', 'শরীয়তপুর সদর', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8010, 'Jajira', 'জাজিরা', 'Jajira', 'জাজিরা', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8013, 'Chandradighalia', 'চন্দ্রদিঘলিয়া', 'Gopalganj Sadar', 'গোপালগঞ্জ সদর', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8020, 'Naria', 'নড়িয়া', 'Naria', 'নড়িয়া', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8021, 'Bhozeshwar', 'ভোজেশ্বর', 'Naria', 'নড়িয়া', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8022, 'Gharisar', 'ঘরিসার', 'Naria', 'নড়িয়া', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8023, 'Upshi', 'তিনি কে?', 'Naria', 'নড়িয়া', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8024, 'Kartikpur', 'কার্তিকপুর', 'Naria', 'নড়িয়া', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8030, 'Bhedorganj', 'ভেদরগঞ্জ', 'Bhedorganj', 'ভেদরগঞ্জ', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8040, 'Damudhya', 'ডামুধ্যা', 'Damudhya', 'ডামুধ্যা', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8050, 'Gosairhat', 'গোসাইরহাট', 'Gosairhat', 'গোসাইরহাট', 'Shariatpur', 'শরীয়তপুর', 'Dhaka', 'ঢাকা'),
(8100, 'Gopalganj Sadar', 'গোপালগঞ্জ সদর', 'Gopalganj Sadar', 'গোপালগঞ্জ সদর', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8101, 'Ulpur', 'উল', 'Gopalganj Sadar', 'গোপালগঞ্জ সদর', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8102, 'Barfa', 'গসিপ', 'Gopalganj Sadar', 'গোপালগঞ্জ সদর', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8110, 'Kotalipara', 'কোটালীপাড়া', 'Kotalipara', 'কোটালীপাড়া', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8120, 'Tungipara', 'আতশবাজি', 'Tungipara', 'আতশবাজি', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8121, 'Patgati', 'পাটগাতি', 'Tungipara', 'আতশবাজি', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8130, 'Kashiani', 'কাশিয়ানী', 'Kashiani', 'কাশিয়ানী', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8131, 'Ramdia College', 'রামদিয়া কলেজ', 'Kashiani', 'কাশিয়ানী', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8132, 'Ratoil', 'রাতাইল', 'Kashiani', 'কাশিয়ানী', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8133, 'Jonapur', 'জোনাপুর', 'Kashiani', 'কাশিয়ানী', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8140, 'Maksudpur', 'সুহুপুর', 'Maksudpur', 'সুহুপুর', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8141, 'Batkiamari', 'বটকিয়ামারী', 'Maksudpur', 'সুহুপুর', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8142, 'Khandarpara', 'খন্দরপাড়া', 'Maksudpur', 'সুহুপুর', 'Gopalganj', 'গোপালগঞ্জ', 'Dhaka', 'ঢাকা'),
(8200, 'Barishal Sadar', 'বরিশাল সদর', 'Barishal Sadar', 'বরিশাল সদর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8201, 'Bukhainagar', 'বুখাইনগর', 'Barishal Sadar', 'বরিশাল সদর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8202, 'Saheberhat', 'সাহেবেরহাট', 'Barishal Sadar', 'বরিশাল সদর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8203, 'Sugandia', 'সুগান্দিয়া', 'Barishal Sadar', 'বরিশাল সদর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8204, 'Patang', 'চার', 'Barishal Sadar', 'বরিশাল সদর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8205, 'Kashipur', 'কাশিপুর', 'Barishal Sadar', 'বরিশাল সদর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8206, 'Jaguarhat', 'জাগুয়ার টুপি', 'Barishal Sadar', 'বরিশাল সদর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8210, 'Babuganj', 'বাবুগঞ্জ', 'Babuganj', 'বাবুগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8211, 'Rahamatpur', 'রহমতপুর', 'Babuganj', 'বাবুগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8212, 'Chandpasha', 'চাঁদপাশা', 'Babuganj', 'বাবুগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8213, 'Madhabpasha', 'মাধবপাশা', 'Babuganj', 'বাবুগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8214, 'Thakur Mallik', 'ঠাকুর মল্লিক', 'Babuganj', 'বাবুগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8215, 'Nizamuddin College', 'নিজামউদ্দিন কলেজ', 'Babuganj', 'বাবুগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8216, 'Barishal Cadet', 'বরিশাল ক্যাডেট', 'Babuganj', 'বাবুগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8220, 'Uzirpur', 'উজিরপুর', 'Uzirpur', 'উজিরপুর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8221, 'Dhamura', 'ধামুরা', 'Uzirpur', 'উজিরপুর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8222, 'Jugirkanda', 'জুগিরকান্দা', 'Uzirpur', 'উজিরপুর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8223, 'Dakuarhat', 'ডাকুয়ারহাট', 'Uzirpur', 'উজিরপুর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8224, 'Shikarpur', 'শিকারপুর', 'Uzirpur', 'উজিরপুর', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8230, 'Gouranadi', 'গৌরনদী', 'Gouranadi', 'গৌরনদী', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8231, 'Tarki Bandar', 'শহুরে তরকি', 'Gouranadi', 'গৌরনদী', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8232, 'Kashemabad', 'কাশেমাবাদ', 'Gouranadi', 'গৌরনদী', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8233, 'Batajor', 'বাটাজোর', 'Gouranadi', 'গৌরনদী', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8240, 'Agailzhara', 'আগৈলঝাড়া', 'Agailzhara', 'আগৈলঝাড়া', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8241, 'Gaila', 'এটা দুঃখজনক', 'Agailzhara', 'আগৈলঝাড়া', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8242, 'Paisarhat', 'অর্থ ক্ষতি', 'Agailzhara', 'আগৈলঝাড়া', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8250, 'Muladi', 'মুলাদী', 'Muladi', 'মুলাদী', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8251, 'Kazirchar', 'কাজিরচর', 'Muladi', 'মুলাদী', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8252, 'Charkalekhan', 'চরকালেখান', 'Muladi', 'মুলাদী', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8260, 'Barajalia', 'বড়জালিয়া', 'Barajalia', 'বড়জালিয়া', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8261, 'Osman Manjil', 'ওসমান মঞ্জিল', 'Barajalia', 'বড়জালিয়া', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8270, 'Mahendiganj', 'মেহেন্দিগঞ্জ', 'Mahendiganj', 'মেহেন্দিগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8271, 'Laskarpur', 'লস্করপুর', 'Mahendiganj', 'মেহেন্দিগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8272, 'Ulania', 'ইয়ানিয়া', 'Mahendiganj', 'মেহেন্দিগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8273, 'Nalgora', 'নালগোড়া', 'Mahendiganj', 'মেহেন্দিগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8274, 'Langutia', 'লাঙ্গুটিয়া', 'Mahendiganj', 'মেহেন্দিগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8280, 'Sahebganj', 'সাহেবগঞ্জ', 'Sahebganj', 'সাহেবগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8281, 'Charamandi', 'চরমন্দি', 'Sahebganj', 'সাহেবগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8282, 'Padri Shibpur', 'পাদ্রী শিবপুর', 'Sahebganj', 'সাহেবগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8283, 'Shialguni', 'শিয়ালগুনি', 'Sahebganj', 'সাহেবগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8284, 'kalaskati', 'কলস্কটি', 'Sahebganj', 'সাহেবগঞ্জ', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল'),
(8300, 'Bhola Sadar', 'ভোলা সদর', 'Bhola Sadar', 'ভোলা সদর', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8301, 'Joynagar', 'জয় নগর', 'Bhola Sadar', 'ভোলা সদর', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8310, 'Doulatkhan', 'দৌলত খান', 'Doulatkhan', 'দৌলত খান', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8311, 'Hajipur', 'হাজীপুর', 'Doulatkhan', 'দৌলত খান', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8320, 'Borhanuddin UPO', 'বোরহানউদ্দিন', 'Borhanuddin UPO', 'বোরহানউদ্দিন', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8321, 'Mirzakalu', 'মির্জাকালু', 'Borhanuddin UPO', 'বোরহানউদ্দিন', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8330, 'Lalmohan UPO', 'ইউপিও', 'Lalmohan UPO', 'ইউপিও', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8331, 'Daurihat', 'দাউড়িহাট', 'Lalmohan UPO', 'ইউপিও', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8332, 'Gazaria', 'গজারিয়া', 'Lalmohan UPO', 'ইউপিও', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8340, 'Charfashion', 'চরভদে', 'Charfashion', 'চরভদে', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8341, 'Dularhat', 'দুলারহাট', 'Charfashion', 'চরভদে', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8342, 'Keramatganj', 'কেরামতগঞ্জ', 'Charfashion', 'চরভদে', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8350, 'Hatshoshiganj', 'হাটশীগঞ্জ', 'Hatshoshiganj', 'হাটশীগঞ্জ', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8360, 'Hajirhat', 'হাজিরহাট', 'Hajirhat', 'হাজিরহাট', 'Bhola', 'ভোলা', 'Barishal', 'বরিশাল'),
(8400, 'Jhalokathi Sadar', 'ঝালকাঠি সদর', 'Jhalokathi Sadar', 'ঝালকাঠি সদর', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8401, 'Nabagram', 'নবগ্রাম', 'Jhalokathi Sadar', 'ঝালকাঠি সদর', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8402, 'Baukathi', 'বউকাঠি', 'Jhalokathi Sadar', 'ঝালকাঠি সদর', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8403, 'Gabha', 'কামার', 'Jhalokathi Sadar', 'ঝালকাঠি সদর', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8404, 'Shekherhat', 'শেখেরহাট', 'Jhalokathi Sadar', 'ঝালকাঠি সদর', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8410, 'Rajapur', 'রাজাপুর', 'Rajapur', 'রাজাপুর', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8420, 'Nalchhiti', 'নলছিটি', 'Nalchhiti', 'নলছিটি', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8421, 'Beerkathi', 'বিয়ারকাঠি', 'Nalchhiti', 'নলছিটি', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8430, 'Kathalia', 'কাঠালিয়া', 'Kathalia', 'কাঠালিয়া', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8431, 'Amua', 'আমুয়া', 'Kathalia', 'কাঠালিয়া', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8432, 'Niamatee', 'নিয়ামতী', 'Kathalia', 'কাঠালিয়া', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8433, 'Shoulajalia', 'শৈলজালিয়া', 'Kathalia', 'কাঠালিয়া', 'Jhalokati', 'ঝালকাঠি', 'Barishal', 'বরিশাল'),
(8500, 'Pirojpur Sadar', 'পিরোজপুর সদর', 'Pirojpur Sadar', 'পিরোজপুর সদর', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8501, 'Hularhat', 'হুলারহাট', 'Pirojpur Sadar', 'পিরোজপুর সদর', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8502, 'Parerhat', 'পারেরহাট', 'Pirojpur Sadar', 'পিরোজপুর সদর', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8510, 'Kaukhali', 'কাউখালী', 'Kaukhali', 'কাউখালী', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8511, 'Keundia', 'লটারি', 'Kaukhali', 'কাউখালী', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8512, 'Joykul', 'জয়কুল', 'Kaukhali', 'কাউখালী', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8513, 'Jolagati', 'জগ ডাউন', 'Kaukhali', 'কাউখালী', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8520, 'Swarupkathi', 'স্বরূপকাঠি', 'Swarupkathi', 'স্বরূপকাঠি', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8521, 'Darus Sunnat', 'সুন্নাহ', 'Swarupkathi', 'স্বরূপকাঠি', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8522, 'Kaurikhara', 'কৈরিখারা', 'Swarupkathi', 'স্বরূপকাঠি', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8523, 'Jalabari', 'জলবাড়ী', 'Swarupkathi', 'স্বরূপকাঠি', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8530, 'Banaripara', 'বানারীপাড়া', 'Banaripara', 'বানারীপাড়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8531, 'Chakhar', 'চক্র', 'Banaripara', 'বানারীপাড়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8540, 'Nazirpur', 'নাজিরপুর', 'Nazirpur', 'নাজিরপুর', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8541, 'Sriramkathi', 'শ্রীরামকাঠি', 'Nazirpur', 'নাজিরপুর', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8550, 'Bhandaria', 'ভান্ডারিয়া', 'Bhandaria', 'ভান্ডারিয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8551, 'Kanudashkathi', 'কানুদশকাঠি', 'Bhandaria', 'ভান্ডারিয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8552, 'Dhaoa', 'দুজনের জন্য', 'Bhandaria', 'ভান্ডারিয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8560, 'Mathbaria', 'মঠবাড়িয়া', 'Mathbaria', 'মঠবাড়িয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8561, 'Tushkhali', 'তুষখালী', 'Mathbaria', 'মঠবাড়িয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8562, 'Halta', 'লিম্প', 'Mathbaria', 'মঠবাড়িয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8563, 'Gulishakhali', 'গুলিশাখালী', 'Mathbaria', 'মঠবাড়িয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8564, 'Tiarkhali', 'টিয়ারখালী', 'Mathbaria', 'মঠবাড়িয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8565, 'Betmor Natun Hat', 'বেতমোড় নাতুন হাট', 'Mathbaria', 'মঠবাড়িয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8566, 'Shilarganj', 'শিলারগঞ্জ', 'Mathbaria', 'মঠবাড়িয়া', 'Pirojpur', 'পিরোজপুর', 'Barishal', 'বরিশাল'),
(8600, 'Patuakhali Sadar', 'পটুয়াখালী সদর', 'Patuakhali Sadar', 'পটুয়াখালী সদর', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8601, 'Moukaran', 'মৌকরন', 'Patuakhali Sadar', 'পটুয়াখালী সদর', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8602, 'Dumkee', 'দুমকি', 'Patuakhali Sadar', 'পটুয়াখালী সদর', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8603, 'Rahimabad', 'রহিমাবাদ', 'Patuakhali Sadar', 'পটুয়াখালী সদর', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8610, 'Subidkhali', 'অপেক্ষা করবেন না', 'Subidkhali', 'অপেক্ষা করবেন না', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8620, 'Bauphal', 'বাউফল', 'Bauphal', 'বাউফল', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8621, 'Bagabandar', 'বাগবন্দর', 'Bauphal', 'বাউফল', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8622, 'Birpasha', 'বীরপাশা', 'Bauphal', 'বাউফল', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8623, 'Kalishari', 'কালিশারি', 'Bauphal', 'বাউফল', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8624, 'Kalaia', 'লাইভ', 'Bauphal', 'বাউফল', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8630, 'Dashmina', 'দশমিনা', 'Dashmina', 'দশমিনা', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8640, 'Galachipa', 'গলাচিপা', 'Galachipa', 'গলাচিপা', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8641, 'Gazipur Bandar', 'গাজীপুর সিটি', 'Galachipa', 'গলাচিপা', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8650, 'Khepupara', 'খেপুপাড়া', 'Khepupara', 'খেপুপাড়া', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8651, 'Mahipur', 'মহিপুর', 'Khepupara', 'খেপুপাড়া', 'Patuakhali', 'পটুয়াখালী', 'Barishal', 'বরিশাল'),
(8700, 'Barguna Sadar', 'বরগুনা সদর', 'Barguna Sadar', 'বরগুনা সদর', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(8701, 'Nali Bandar', 'নলি বন্দর', 'Barguna Sadar', 'বরগুনা সদর', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(8710, 'Amtali', 'আমতলী', 'Amtali', 'আমতলী', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(8720, 'Patharghata', 'পাথরঘাটা', 'Patharghata', 'পাথরঘাটা', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(8721, 'Kakchira', 'কাকচিরা', 'Patharghata', 'পাথরঘাটা', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(8730, 'Bamna', 'বামনা', 'Bamna', 'বামনা', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(8740, 'Betagi', 'বেতাগী', 'Betagi', 'বেতাগী', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(8741, 'Darul Ulam', 'দারুল উলুম', 'Betagi', 'বেতাগী', 'Barguna', 'বরগুনা', 'Barishal', 'বরিশাল'),
(9000, 'Khulna G.P.O', 'খুলনা জিপিও', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9100, 'Khula Sadar', 'খুলনা সদর', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9201, 'Khulna Shipyard', 'খুলনা শিপইয়ার্ড', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9202, 'Doulatpur', 'দৌলতপুর', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9203, 'BIT Khulna', 'বিআইটি খুলনা', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9204, 'Siramani', 'সিরামনি', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9205, 'Jahanabad Canttonmen', 'জাহানাবাদ ক্যান্টনমেন্ট', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9206, 'Sonali Jute Mills', 'সোনালী জুট মিলস', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9207, 'Atra Shilpa Area', 'আত্রা শিল্প এলাকা', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9208, 'Khulna University', 'খুলনা বিশ্ববিদ্যালয়', 'Khulna Sadar', 'খুলনা সদর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9210, 'Phultala', 'ফুলতলা', 'Phultala', 'ফুলতলা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9220, 'Digalia', 'দিগালিয়া', 'Digalia', 'দিগালিয়া', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9221, 'Chandni Mahal', 'চাঁদনী মহল', 'Digalia', 'দিগালিয়া', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9222, 'Senhati', 'সেনহাটী', 'Digalia', 'দিগালিয়া', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9223, 'Ghoshghati', 'ঘোষঘাটি', 'Digalia', 'দিগালিয়া', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9224, 'Gazirhat', 'গাজীরহাট', 'Digalia', 'দিগালিয়া', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9230, 'Terakhada', 'তেরখাদা', 'Terakhada', 'তেরখাদা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9231, 'Pak Barasat', 'পাক বারাসাত', 'Terakhada', 'তেরখাদা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9240, 'Alaipur', 'আলাইপুর', 'Alaipur', 'আলাইপুর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9241, 'Rupsha', 'রূপসা', 'Alaipur', 'আলাইপুর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9242, 'Belphulia', 'বেলফুলিয়া', 'Alaipur', 'আলাইপুর', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9250, 'Sajiara', 'সাজিয়ারা', 'Sajiara', 'সাজিয়ারা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9251, 'Ghonabanda', 'ঘোনাবান্দা', 'Sajiara', 'সাজিয়ারা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9252, 'Chuknagar', 'চুকনগর', 'Sajiara', 'সাজিয়ারা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9253, 'Shahapur', 'শাহাপুর', 'Sajiara', 'সাজিয়ারা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9260, 'Batiaghat', 'বটিয়াঘাটা', 'Batiaghat', 'বটিয়াঘাটা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9261, 'Surkalee', 'সুরকলি', 'Batiaghat', 'বটিয়াঘাটা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9270, 'Chalna Bazar', 'চালনা বাজার', 'Chalna Bazar', 'চালনা বাজার', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9271, 'Dakup', 'আবক্ষ', 'Chalna Bazar', 'চালনা বাজার', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9272, 'Bajua', 'শার্ট', 'Chalna Bazar', 'চালনা বাজার', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9273, 'Nalian', 'অন্যান্য', 'Chalna Bazar', 'চালনা বাজার', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9280, 'Paikgachha', 'পাইকগাছা', 'Paikgachha', 'পাইকগাছা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9281, 'Godaipur', 'গোদাইপুর', 'Paikgachha', 'পাইকগাছা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9282, 'Kapilmoni', 'ক্যাপিলমনি', 'Paikgachha', 'পাইকগাছা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9283, 'Katipara', 'কনস্টেবল', 'Paikgachha', 'পাইকগাছা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9284, 'Chandkhali', 'এই এটা', 'Paikgachha', 'পাইকগাছা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9285, 'Garaikhali', 'গড়াইখালী', 'Paikgachha', 'পাইকগাছা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9290, 'Madinabad', 'মদিনাবাদ', 'Madinabad', 'মদিনাবাদ', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9291, 'Amadee', 'আমাদী', 'Madinabad', 'মদিনাবাদ', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা'),
(9300, 'Bagerhat Sadar', 'বাগেরহাট সদর', 'Bagerhat Sadar', 'বাগেরহাট সদর', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9301, 'P.C College', 'পিসি কলেজ', 'Bagerhat Sadar', 'বাগেরহাট সদর', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9302, 'Rangdia', 'রংদিয়া', 'Bagerhat Sadar', 'বাগেরহাট সদর', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9310, 'Kachua', 'কচুয়া', 'Kachua UPO', 'ইউপিও', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9311, 'Sonarkola', 'সোনার', 'Kachua UPO', 'ইউপিও', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9320, 'Morelganj', 'মোরেলগঞ্জ', 'Morelganj', 'মোরেলগঞ্জ', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9321, 'Sannasi Bazar', 'সন্নাসী বাজার', 'Morelganj', 'মোরেলগঞ্জ', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9322, 'Telisatee', 'টেলিসাটি', 'Morelganj', 'মোরেলগঞ্জ', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9330, 'Rayenda', 'রায়েন্দা', 'Rayenda', 'রায়েন্দা', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9340, 'Rampal', 'রামপাল', 'Rampal', 'রামপাল', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9341, 'Foylahat', 'ফয়লাহাট', 'Rampal', 'রামপাল', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9342, 'Sonatunia', 'সোনাতুনিয়া', 'Rampal', 'রামপাল', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9343, 'Gourambha', 'গৌরম্ভ', 'Rampal', 'রামপাল', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9350, 'Chalna Ankorage', 'চালনা অ্যাঙ্করেজ', 'Chalna Ankorage', 'চালনা অ্যাঙ্করেজ', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9351, 'Mongla Port', 'মংলা বন্দর', 'Chalna Ankorage', 'চালনা অ্যাঙ্করেজ', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9360, 'Chitalmari', 'ইতালীয়', 'Chitalmari', 'ইতালীয়', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9361, 'Barabaria', 'রাস্তা', 'Chitalmari', 'ইতালীয়', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9370, 'Fakirhat', 'ফকিরহাট', 'Fakirhat', 'ফকিরহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9371, 'Mansa', 'মানসা', 'Fakirhat', 'ফকিরহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9372, 'Bhanganpar Bazar', 'ভাঙ্গানপাড় বাজার', 'Fakirhat', 'ফকিরহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9380, 'Mollahat', 'মোল্লাহাট', 'Mollahat', 'মোল্লাহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9381, 'Kahalpur', 'কাহালপুর', 'Mollahat', 'মোল্লাহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9382, 'Dariala', 'দারিয়াল', 'Mollahat', 'মোল্লাহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9383, 'Charkulia', 'চরকুলিয়া', 'Mollahat', 'মোল্লাহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9384, 'Nagarkandi', 'নগরকান্দি', 'Mollahat', 'মোল্লাহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9385, 'Pak Gangni', 'মিস্টার গাংনী', 'Mollahat', 'মোল্লাহাট', 'Bagerhat', 'বাগেরহাট', 'Khulna', 'খুলনা'),
(9400, 'Satkhira Sadar', 'সাতক্ষীরা সদর', 'Satkhira Sadar', 'সাতক্ষীরা সদর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9401, 'Satkhira Islamia Acc', 'সাতক্ষীরা ইসলামিয়া একাডেমি', 'Satkhira Sadar', 'সাতক্ষীরা সদর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9402, 'Gunakar kati', 'গুনাকর কাটি', 'Satkhira Sadar', 'সাতক্ষীরা সদর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9403, 'Budhhat', 'বুধহাট', 'Satkhira Sadar', 'সাতক্ষীরা সদর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9410, 'kalaroa', 'কলারোয়া', 'Kalaroa', 'কলারোয়া', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9411, 'Murarikati', 'মুরারিকাটি', 'Kalaroa', 'কলারোয়া', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9412, 'Jhaudanga', 'ঝাউডাঙ্গা', 'Kalaroa', 'কলারোয়া', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9413, 'Hamidpur', 'হামিদপুর', 'Kalaroa', 'কলারোয়া', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9414, 'Khordo', 'খোরদো', 'Kalaroa', 'কলারোয়া', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9415, 'Chandanpur', 'চন্দনপুর', 'Kalaroa', 'কলারোয়া', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9420, 'Taala', 'সেটাই', 'Taala', 'সেটাই', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9421, 'Patkelghata', 'পাটকেলঘাটা', 'Taala', 'সেটাই', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9430, 'Debbhata', 'দেবভাটা', 'Debbhata', 'দেবভাটা', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9431, 'Gurugram', 'গুরুগ্রাম', 'Debbhata', 'দেবভাটা', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9440, 'Kaliganj UPO', 'ইউপিও', 'Kaliganj UPO', 'ইউপিও', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9441, 'Nalta Mubaroknagar', 'নলতা মোবারকনগর', 'Kaliganj UPO', 'ইউপিও', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9442, 'Ratanpur', 'রতনপুর', 'Kaliganj UPO', 'ইউপিও', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9450, 'Nakipur', 'নকিপুর', 'Nakipur', 'নকিপুর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9451, 'Noornagar', 'নূর নগর', 'Nakipur', 'নকিপুর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9452, 'Naobeki', 'নাওবেকি', 'Nakipur', 'নকিপুর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9453, 'Buri Goalini', 'বুড়ি গোয়ালিনী', 'Nakipur', 'নকিপুর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9454, 'Gabura', 'গাবুরা', 'Nakipur', 'নকিপুর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9455, 'Habinagar', 'হবিনগর', 'Nakipur', 'নকিপুর', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9460, 'Ashashuni', 'আশাশুনি', 'Ashashuni', 'আশাশুনি', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা'),
(9461, 'Baradal', 'বড়দল', 'Ashashuni', 'আশাশুনি', 'Satkhira', 'সাতক্ষীরা', 'Khulna', 'খুলনা');

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_categories`
--

CREATE TABLE `marketplace_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_name_bn` varchar(100) DEFAULT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon_url` varchar(500) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `marketplace_categories`
--

INSERT INTO `marketplace_categories` (`category_id`, `category_name`, `category_name_bn`, `slug`, `description`, `icon_url`, `parent_id`, `is_active`, `sort_order`, `created_at`) VALUES
(1, 'crops', 'ফসল ও শাকসবজি', 'crops', 'সব ধরনের ফসল, শাকসবজি এবং কৃষিপণ্য', '🌾', NULL, 1, 1, '2025-12-05 08:44:52'),
(2, 'machinery', 'যন্ত্রপাতি', 'machinery', 'কৃষি যন্ত্রপাতি, ট্রাক্টর, পাওয়ার টিলার ইত্যাদি', '🚜', NULL, 1, 2, '2025-12-05 08:44:52'),
(3, 'fertilizer', 'সার ও কীটনাশক', 'fertilizer', 'রাসায়নিক সার, জৈব সার, কীটনাশক', '🧪', NULL, 1, 3, '2025-12-05 08:44:52'),
(4, 'seeds', 'বীজ ও চারা', 'seeds', 'উন্নত জাতের বীজ, চারা, কলম', '🌱', NULL, 1, 4, '2025-12-05 08:44:52'),
(5, 'livestock', 'গবাদি পশু', 'livestock', 'গরু, ছাগল, মুরগি, হাঁস ইত্যাদি', '🐄', NULL, 1, 5, '2025-12-05 08:44:52'),
(6, 'tools', 'হাতিয়ার', 'tools', 'কোদাল, কাস্তে, লাঙল ও অন্যান্য হাতিয়ার', '🔧', NULL, 1, 6, '2025-12-05 08:44:52'),
(7, 'other', 'অন্যান্য', 'other', 'অন্যান্য কৃষি সম্পর্কিত পণ্য ও সেবা', '📦', NULL, 1, 7, '2025-12-05 08:44:52');

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_listings`
--

CREATE TABLE `marketplace_listings` (
  `listing_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'BDT',
  `category_id` int(11) DEFAULT NULL,
  `listing_type` enum('sell','rent','buy','service') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'sell',
  `status` enum('active','sold','expired','draft') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `postal_code` int(11) DEFAULT NULL,
  `village` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_location_bn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `views_count` mediumint(8) UNSIGNED DEFAULT 0,
  `saves_count` smallint(5) UNSIGNED DEFAULT 0,
  `contacts_count` smallint(5) UNSIGNED DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `boosted_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT (current_timestamp() + interval 60 day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marketplace_listings`
--

INSERT INTO `marketplace_listings` (`listing_id`, `seller_id`, `title`, `description`, `price`, `currency`, `category_id`, `listing_type`, `status`, `images`, `postal_code`, `village`, `full_location_bn`, `contact_phone`, `contact_email`, `is_featured`, `views_count`, `saves_count`, `contacts_count`, `tags`, `created_at`, `updated_at`, `boosted_at`, `expires_at`) VALUES
(11, 29, 'হুডি', 'সাদা কালার, খুব ভালো মানের', 801.00, 'BDT', 2, 'sell', 'sold', '[\"https:\\/\\/langal.blob.core.windows.net\\/public\\/marketplace\\/c212ac2f-8ed0-4ce8-9293-c6006da86d20.png\",\"https:\\/\\/langal.blob.core.windows.net\\/public\\/marketplace\\/271e9db5-7cf2-4c36-9e22-40bd8f287add.png\"]', 1361, 'ডগাই', 'ডগাই , সারুলিয়া, ডেমরা, ঢাকা', '01997900840', NULL, 0, 0, 1, 3, '[\"hoodie\",\"anime\",\"white\"]', '2025-12-06 01:27:01', '2026-01-04 03:29:39', NULL, '2026-02-04 07:27:01'),
(12, 29, 'গোলাপী', 'ভদ্র মেয়ে গোলাপী', 119984.00, 'BDT', 5, 'service', 'sold', '[\"https:\\/\\/langal.blob.core.windows.net\\/public\\/marketplace\\/6d3f3d05-f7c7-4016-99b7-c698116a615c.png\"]', 3708, 'পাঁচপাড়া', 'পাঁচপাড়া, চন্দ্রগঞ্জ, লক্ষ্মীপুর সদর, লক্ষ্মীপুর', '01997900840', NULL, 0, 0, 1, 1, '[]', '2025-12-06 02:59:48', '2026-01-11 11:51:04', '2025-12-16 14:54:28', '2026-02-04 08:59:48'),
(13, 29, 'সামান্থা', 'অভিনয় ভালো করে', 98000.00, 'BDT', 4, 'buy', 'sold', '[\"https:\\/\\/langal.blob.core.windows.net\\/public\\/marketplace\\/66d15c8c-49ee-47d4-9907-c81c305f1616.png\"]', 3708, 'পাঁচপাড়া', 'পাঁচপাড়া, চন্দ্রগঞ্জ, লক্ষ্মীপুর সদর, লক্ষ্মীপুর', '01997900840', NULL, 0, 0, 1, 1, '[]', '2025-12-06 03:28:34', '2026-01-11 10:58:57', '2025-12-06 09:19:44', '2026-02-04 09:28:34'),
(14, 29, 'শেঙ্কু ভাই', 'নিজেকে অনেক বড় হেডম ওয়ালা ভাবে', 1000.00, 'BDT', 3, 'rent', 'active', '[\"marketplace\\/18ab5263-9e84-44b0-bb87-6d36fd01cdfe.png\"]', 3708, 'পাঁচপাড়া', 'পাঁচপাড়া, চন্দ্রগঞ্জ, লক্ষ্মীপুর সদর, লক্ষ্মীপুর', '01997900840', NULL, 0, 0, 2, 1, '[]', '2025-12-06 03:43:47', '2025-12-31 17:50:32', '2025-12-06 09:27:24', '2026-02-04 09:43:47'),
(15, 29, 'Beauty test', 'test test test', 23.00, 'BDT', 2, 'buy', 'active', '[\"http:\\/\\/localhost:8000\\/storage\\/marketplace\\/400fb086-f724-4fa9-bcd6-3570fcb4de44.jpg\"]', 1361, 'ডগাই', 'ডগাই, সারুলিয়া, ডেমরা, ঢাকা', '01997900840', NULL, 0, 0, 1, 1, '[]', '2025-12-06 04:19:13', '2026-01-11 11:41:34', '2026-01-11 11:41:34', '2026-02-04 10:19:13'),
(16, 30, 'সাকিব', 'নিজে বিক্রি হয়ে যাবো', 0.00, 'BDT', 5, 'sell', 'active', '[\"marketplace\\/0ae0305f-ba6a-4c92-b04e-c74e9be922cf.jpeg\"]', 3720, 'রমাপুর', 'রমাপুর, রামগঞ্জ, রামগঞ্জ, লক্ষ্মীপুর', '01882953533', NULL, 0, 0, 2, 5, '[]', '2025-12-06 04:53:24', '2026-01-11 11:37:37', NULL, '2026-02-04 10:53:24'),
(19, 31, 'পানি পড়া', 'কালা বাবার কালা পানি পড়া', 99.00, 'BDT', 7, 'service', 'active', '[\"marketplace\\/e12f055e-3f1e-42b0-a907-9cbce394d5d2.png\"]', 4300, 'কেরাতলা', 'কেরাতলা, সন্দ্বীপ, সন্দ্বীপ, চট্টগ্রাম', '01970890839', NULL, 0, 0, 3, 5, '[]', '2025-12-07 03:15:27', '2025-12-11 06:49:03', NULL, '2026-02-05 09:15:27'),
(20, 33, 'গাছের পাতা সবুজ', 'একেববারে তাজা', 0.00, 'BDT', 2, 'rent', 'sold', '[\"http:\\/\\/localhost:8000\\/storage\\/marketplace\\/b7be823a-c49c-4ae5-9f37-74cf29377937.png\"]', 1215, 'নাখালপাড়া', 'নাখালপাড়া, তেজগাঁও টিএসও, তেজগাঁও, ঢাকা', '01888999000', NULL, 0, 0, 0, 0, '[]', '2025-12-07 08:33:35', '2025-12-07 09:26:03', NULL, '2026-02-05 14:33:35'),
(21, 29, 'ট্রাক্টর', 'অনেক ভালো আর হর্স পাওয়ার ২০০ হাজার', 1199.00, 'BDT', 2, 'rent', 'draft', '[\"https:\\/\\/langal.blob.core.windows.net\\/public\\/marketplace\\/185fb0c3-865c-4120-931f-c6d0f917fd13.png\"]', 8340, 'মুক্রি পুর', 'মুক্রি পুর, চরভদে, চরভদে, ভোলা', '01997900840', NULL, 0, 0, 0, 0, '[]', '2026-01-04 03:28:12', '2026-01-11 11:36:55', NULL, '2026-03-04 21:28:12'),
(22, 61, 'কামলা', 'কামলা খাটানোর মানুষ', 1400.00, 'BDT', 7, 'rent', 'active', '[\"marketplace\\/f906b13f-418d-4f12-bc66-cb1c0b28e550.jpg\"]', 1205, 'সায়েন্স ল্যাব', 'সায়েন্স ল্যাব, নিউ মার্কেট টিএসও, নিউমার্কেট, ঢাকা', '01882130240', NULL, 0, 0, 0, 0, '[]', '2026-01-04 15:07:48', '2026-01-04 15:07:48', NULL, '2026-03-05 09:07:48'),
(23, 61, 'কামলা', 'কামলা খাটানোর মানুষ', 1400.00, 'BDT', 7, 'rent', 'active', '[\"marketplace\\/02c0aadd-e017-438f-b848-b7e2bd1377b8.jpg\"]', 1205, 'সায়েন্স ল্যাব', 'সায়েন্স ল্যাব, নিউ মার্কেট টিএসও, নিউমার্কেট, ঢাকা', '01882130240', NULL, 0, 0, 0, 0, '[]', '2026-01-04 15:07:54', '2026-01-04 15:07:54', NULL, '2026-03-05 09:07:54'),
(24, 61, 'কামলা', 'কামলা খাটানোর মানুষ', 1400.00, 'BDT', 7, 'rent', 'active', '[\"marketplace\\/1f6890dd-351f-4f3b-963b-fd6adc27b0cc.jpg\"]', 1205, 'সায়েন্স ল্যাব', 'সায়েন্স ল্যাব, নিউ মার্কেট টিএসও, নিউমার্কেট, ঢাকা', '01882130240', NULL, 0, 0, 0, 0, '[]', '2026-01-04 15:07:55', '2026-01-05 18:18:50', NULL, '2026-03-05 09:07:55');

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_listing_saves`
--

CREATE TABLE `marketplace_listing_saves` (
  `save_id` int(11) NOT NULL,
  `listing_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `saved_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `marketplace_listing_saves`
--

INSERT INTO `marketplace_listing_saves` (`save_id`, `listing_id`, `user_id`, `saved_at`) VALUES
(5, 16, 29, '2025-12-06 05:44:39'),
(10, 14, 30, '2025-12-07 03:21:06'),
(11, 15, 31, '2025-12-07 03:23:29'),
(13, 16, 32, '2025-12-07 03:40:53'),
(14, 19, 32, '2025-12-07 03:41:54'),
(16, 19, 33, '2025-12-07 08:20:52'),
(19, 19, 34, '2025-12-11 06:49:03'),
(22, 12, 29, '2025-12-31 17:43:30'),
(23, 13, 29, '2025-12-31 17:45:27'),
(25, 14, 29, '2025-12-31 17:50:32'),
(26, 11, 33, '2025-12-31 17:54:08');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_11_09_000001_create_otps_table', 2),
(5, '2025_12_04_190636_add_additional_info_to_farmer_details_table', 2),
(6, '2025_12_05_120750_update_marketplace_listings_contact_phone_length', 3),
(7, '2025_12_05_000000_make_nid_and_krishi_card_optional', 4),
(8, '2025_12_05_000001_ensure_bangla_charset_support', 4),
(9, '2025_12_06_000000_increase_marketplace_location_length', 4),
(10, '2025_12_06_150334_add_boosted_at_to_marketplace_listings_table', 5),
(11, '2025_12_07_090548_create_personal_access_tokens_table', 6),
(14, '2025_12_07_150000_add_customer_registration_columns', 7),
(15, '2025_12_12_094045_add_ai_fields_to_crop_recommendations_table', 7),
(16, '2025_12_12_094054_create_farmer_selected_crops_table', 8),
(17, '2025_12_12_144838_change_notification_type_to_string_in_notifications_table', 9),
(18, '2025_12_12_155149_add_progress_tracking_to_farmer_selected_crops_table', 10),
(19, '2025_12_12_155201_add_progress_tracking_columns_to_farmer_selected_crops', 10),
(20, '2025_12_12_160932_add_detailed_crop_info_to_farmer_selected_crops', 11),
(21, '2025_12_15_194408_add_certification_document_to_expert_qualifications_table', 12),
(23, '2025_12_30_163847_add_next_notification_date_to_farmer_selected_crops_table', 13),
(24, '2024_12_17_create_post_reports_table', 14),
(25, '2026_01_06_000001_create_expert_availability_table', 15),
(26, '2026_01_06_000002_create_expert_unavailable_dates_table', 15),
(28, '2026_01_06_000004_create_conversation_participants_table', 15),
(29, '2026_01_06_000005_create_consultation_messages_table', 15),
(30, '2026_01_06_000006_create_consultation_calls_table', 15),
(31, '2026_01_06_000007_create_consultation_feedback_table', 15),
(32, '2026_01_06_000008_create_consultation_prescriptions_table', 15),
(33, '2026_01_06_000009_create_notification_tokens_table', 15),
(34, '2026_01_06_000010_create_notification_queue_table', 15),
(35, '2026_01_06_000011_update_expert_qualifications_for_consultation', 15),
(36, '2026_01_06_000012_update_notifications_for_consultation', 15),
(37, '2026_01_07_005132_add_last_active_at_to_users_table', 16),
(38, '2026_01_06_000003_create_consultation_appointments_table', 17),
(39, '2026_01_11_000001_create_field_data_farmers_table', 18),
(40, '2026_01_11_000002_add_manual_farmer_to_field_data_collection', 19),
(41, '2026_01_11_170120_make_farmer_id_nullable_in_field_data_collection', 20);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `notification_type` varchar(255) NOT NULL,
  `notification_category` enum('system','appointment','message','call','reminder','feedback','prescription','marketing') NOT NULL DEFAULT 'system',
  `priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
  `action_url` varchar(255) DEFAULT NULL COMMENT 'Deep link URL',
  `action_type` varchar(50) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `related_entity_id` varchar(36) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `recipient_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `read_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `notification_type`, `notification_category`, `priority`, `action_url`, `action_type`, `image_url`, `title`, `message`, `related_entity_id`, `sender_id`, `recipient_id`, `is_read`, `created_at`, `read_at`, `expires_at`) VALUES
(1, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'ফসল নরবচন সফল হযছ', 'আপন সফলভব বগন ও সরষ নরবচন করছন', NULL, NULL, 29, 1, '2025-12-12 09:20:13', '2026-01-11 11:40:39', NULL),
(2, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'বেগুন - আগামীকাল বীজতলা প্রস্তুতি', 'আগামীকাল (Day 1) আপনার বেগুন চাষে বীজতলা প্রস্তুতি শুরু হবে। প্রস্তুতি নিন। কাজসমূহ: বীজ বোপন, জল দেওয়া', '1', NULL, 29, 1, '2025-12-12 10:00:19', '2026-01-11 11:40:39', NULL),
(3, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'সরিষা - আগামীকাল বীজতলা প্রস্তুতি', 'আগামীকাল (Day 1) আপনার সরিষা চাষে বীজতলা প্রস্তুতি শুরু হবে। প্রস্তুতি নিন। কাজসমূহ: বীজ বোপন, জল দেওয়া', '2', NULL, 29, 1, '2025-12-12 10:00:19', '2026-01-11 11:40:39', NULL),
(4, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'সরিষা ফসলের স্ট্যাটাস পরিবর্তিত হয়েছে', 'আপনার সরিষা ফসলের স্ট্যাটাস সক্রিয় থেকে সম্পন্ন এ পরিবর্তিত হয়েছে।', '2', NULL, 29, 1, '2025-12-12 10:02:16', '2026-01-11 11:40:39', NULL),
(5, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'অভিনন্দন! সরিষা চাষ সফলভাবে সম্পন্ন হয়েছে।', '', '2', NULL, 29, 1, '2025-12-12 10:02:16', '2026-01-11 11:40:39', NULL),
(6, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনি বোরো ধান চাষের জন্য নির্বাচন করেছেন।', 'শীঘ্রই আপনার চাষাবাদ শুরু করুন। বিস্তারিত পরিকল্পনা দেখতে অ্যাপে যান।', '3', NULL, 29, 1, '2025-12-12 10:21:45', '2026-01-11 11:40:39', NULL),
(7, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনি আলু চাষের জন্য নির্বাচন করেছেন।', 'শীঘ্রই আপনার চাষাবাদ শুরু করুন। বিস্তারিত পরিকল্পনা দেখতে অ্যাপে যান।', '4', NULL, 29, 1, '2025-12-12 10:21:45', '2026-01-11 11:40:39', NULL),
(8, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'বোরো ধান ফসলের স্ট্যাটাস পরিবর্তিত হয়েছে', 'আপনার বোরো ধান ফসলের স্ট্যাটাস পরিকল্পিত থেকে সক্রিয় এ পরিবর্তিত হয়েছে।', '3', NULL, 29, 1, '2025-12-12 10:24:35', '2026-01-11 11:40:39', NULL),
(9, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনার বোরো ধান চাষ শুরু হয়েছে!', '', '3', NULL, 29, 1, '2025-12-12 10:24:35', '2026-01-11 11:40:39', NULL),
(10, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আলু ফসলের স্ট্যাটাস পরিবর্তিত হয়েছে', 'আপনার আলু ফসলের স্ট্যাটাস পরিকল্পিত থেকে সক্রিয় এ পরিবর্তিত হয়েছে।', '4', NULL, 29, 1, '2025-12-12 10:45:29', '2026-01-11 11:40:39', NULL),
(11, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনার আলু চাষ শুরু হয়েছে!', '', '4', NULL, 29, 1, '2025-12-12 10:45:29', '2026-01-11 11:40:39', NULL),
(12, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'বোরো ধান - আগামীকাল বীজতলা প্রস্তুতি', 'আগামীকাল (Day 1) আপনার বোরো ধান চাষে বীজতলা প্রস্তুতি শুরু হবে। প্রস্তুতি নিন। কাজসমূহ: বীজতলা তৈরি, জল দেওয়া', '3', NULL, 29, 1, '2025-12-12 10:49:43', '2026-01-11 11:40:39', NULL),
(13, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আলু - আগামীকাল বীজ রোপণ', 'আগামীকাল (Day 1) আপনার আলু চাষে বীজ রোপণ শুরু হবে। প্রস্তুতি নিন। কাজসমূহ: বীজ রোপণ, জল দেওয়া', '4', NULL, 29, 1, '2025-12-12 10:49:43', '2026-01-11 11:40:39', NULL),
(14, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনি গাজর চাষের জন্য নির্বাচন করেছেন।', 'শীঘ্রই আপনার চাষাবাদ শুরু করুন। বিস্তারিত পরিকল্পনা দেখতে অ্যাপে যান।', '5', NULL, 29, 1, '2025-12-15 10:53:48', '2026-01-11 11:40:39', NULL),
(15, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'গাজর ফসলের স্ট্যাটাস পরিবর্তিত হয়েছে', 'আপনার গাজর ফসলের স্ট্যাটাস পরিকল্পিত থেকে সক্রিয় এ পরিবর্তিত হয়েছে।', '5', NULL, 29, 1, '2025-12-15 10:54:10', '2026-01-11 11:40:39', NULL),
(16, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনার গাজর চাষ শুরু হয়েছে!', '', '5', NULL, 29, 1, '2025-12-15 10:54:10', '2026-01-11 11:40:39', NULL),
(17, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনি কলা চাষের জন্য নির্বাচন করেছেন।', 'শীঘ্রই আপনার চাষাবাদ শুরু করুন। বিস্তারিত পরিকল্পনা দেখতে অ্যাপে যান।', '6', NULL, 29, 1, '2025-12-30 11:20:38', '2026-01-11 11:40:39', NULL),
(18, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'কলা ফসলের স্ট্যাটাস পরিবর্তিত হয়েছে', 'আপনার কলা ফসলের স্ট্যাটাস পরিকল্পিত থেকে সক্রিয় এ পরিবর্তিত হয়েছে।', '6', NULL, 29, 1, '2025-12-30 11:21:14', '2026-01-11 11:40:39', NULL),
(19, 'crop_reminder', 'system', 'normal', NULL, NULL, NULL, 'আপনার কলা চাষ শুরু হয়েছে!', '', '6', NULL, 29, 1, '2025-12-30 11:21:14', '2026-01-11 11:40:39', NULL),
(20, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'পরামর্শ বাতিল হয়েছে', 'দুঃখিত, বিশেষজ্ঞ আপনার অনুরোধ প্রত্যাখ্যান করেছেন', '3', 71, 29, 1, '2026-01-07 15:39:51', '2026-01-11 11:40:39', NULL),
(21, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'নতুন পরামর্শ অনুরোধ', 'একজন কৃষক আপনার সাথে পরামর্শের জন্য অনুরোধ করেছেন', '4', 29, 71, 1, '2026-01-07 15:40:48', NULL, NULL),
(22, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'নতুন পরামর্শ অনুরোধ', 'একজন কৃষক আপনার সাথে পরামর্শের জন্য অনুরোধ করেছেন', '5', 29, 71, 1, '2026-01-07 17:45:36', NULL, NULL),
(23, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'পরামর্শ নিশ্চিত হয়েছে', 'আপনার পরামর্শের অনুরোধ নিশ্চিত করা হয়েছে', '5', 71, 29, 1, '2026-01-07 17:56:31', '2026-01-11 11:40:39', NULL),
(24, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'মোফাসসেল আলম মারুফ আপনাকে ভিডিও কল করছেন', '2', NULL, 71, 1, '2026-01-07 18:39:54', '2026-01-07 18:56:09', NULL),
(25, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'মোফাসসেল আলম মারুফ আপনাকে ভিডিও কল করছেন', '5', NULL, 71, 1, '2026-01-07 18:42:21', '2026-01-07 18:56:05', NULL),
(26, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'মোফাসসেল আলম মারুফ আপনাকে ভিডিও কল করছেন', '5', NULL, 71, 1, '2026-01-07 18:47:57', '2026-01-07 18:56:00', NULL),
(27, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'প্রফেসর মারুফ আপনাকে ভিডিও কল করছেন', '2', NULL, 29, 1, '2026-01-07 18:56:57', '2026-01-11 11:40:39', NULL),
(28, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'নতুন পরামর্শ অনুরোধ', 'একজন কৃষক আপনার সাথে পরামর্শের জন্য অনুরোধ করেছেন', '6', 29, 71, 1, '2026-01-07 19:03:11', '2026-01-07 19:03:41', NULL),
(29, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'পরামর্শ নিশ্চিত হয়েছে', 'আপনার পরামর্শের অনুরোধ নিশ্চিত করা হয়েছে', '6', 71, 29, 1, '2026-01-07 19:05:02', '2026-01-11 11:40:39', NULL),
(30, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'প্রফেসর মারুফ আপনাকে ভিডিও কল করছেন', '6', NULL, 29, 1, '2026-01-07 19:05:50', '2026-01-11 11:40:39', NULL),
(31, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'প্রফেসর মারুফ আপনাকে ভিডিও কল করছেন', '6', NULL, 29, 1, '2026-01-07 19:30:45', '2026-01-11 11:40:39', NULL),
(32, 'system', 'system', 'normal', NULL, NULL, NULL, 'কল শেষ', 'কল শেষ হয়েছে', NULL, NULL, 29, 1, '2026-01-07 20:18:24', '2026-01-11 11:40:39', NULL),
(33, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'প্রফেসর মারুফ আপনাকে ভিডিও কল করছেন', '6', NULL, 29, 1, '2026-01-07 20:21:01', '2026-01-11 11:40:39', NULL),
(34, 'system', 'system', 'normal', NULL, NULL, NULL, 'কল শেষ', 'কল শেষ হয়েছে', NULL, NULL, 29, 1, '2026-01-07 20:21:07', '2026-01-11 11:40:39', NULL),
(35, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'মোফাসসেল আলম মারুফ আপনাকে ভিডিও কল করছেন', '6', NULL, 71, 1, '2026-01-07 20:27:13', '2026-01-07 22:20:17', NULL),
(36, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'পরামর্শ বাতিল', 'একটি পরামর্শ বাতিল করা হয়েছে', '6', NULL, 71, 1, '2026-01-07 20:59:33', '2026-01-07 22:20:14', NULL),
(37, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'পরামর্শ বাতিল হয়েছে', 'দুঃখিত, বিশেষজ্ঞ আপনার অনুরোধ প্রত্যাখ্যান করেছেন', '4', 71, 29, 1, '2026-01-07 21:14:34', '2026-01-11 11:40:39', NULL),
(38, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'নতুন পরামর্শ অনুরোধ', 'একজন কৃষক আপনার সাথে পরামর্শের জন্য অনুরোধ করেছেন', '7', 29, 71, 1, '2026-01-07 21:36:58', '2026-01-07 21:37:08', NULL),
(39, 'consultation_request', 'appointment', 'normal', NULL, NULL, NULL, 'পরামর্শ নিশ্চিত হয়েছে', 'আপনার পরামর্শের অনুরোধ নিশ্চিত করা হয়েছে', '7', 71, 29, 1, '2026-01-07 21:37:15', '2026-01-11 11:40:39', NULL),
(40, 'consultation_request', 'call', 'high', NULL, NULL, NULL, 'ইনকামিং কল', 'প্রফেসর মারুফ আপনাকে ভিডিও কল করছেন', '7', NULL, 29, 1, '2026-01-07 21:37:37', '2026-01-11 11:40:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notification_queue`
--

CREATE TABLE `notification_queue` (
  `queue_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `notification_type` varchar(50) NOT NULL COMMENT 'appointment_request, call_reminder, etc.',
  `channel` enum('push','sms','email','in_app') NOT NULL DEFAULT 'push',
  `title` varchar(255) NOT NULL,
  `title_bn` varchar(255) DEFAULT NULL,
  `body` text NOT NULL,
  `body_bn` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Extra payload data' CHECK (json_valid(`data`)),
  `image_url` varchar(500) DEFAULT NULL,
  `scheduled_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'When to send',
  `priority` enum('low','normal','high') NOT NULL DEFAULT 'normal',
  `status` enum('pending','sent','failed','cancelled') NOT NULL DEFAULT 'pending',
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `max_attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 3,
  `sent_at` timestamp NULL DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `related_entity_type` varchar(50) DEFAULT NULL COMMENT 'appointment, message, etc.',
  `related_entity_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_queue`
--

INSERT INTO `notification_queue` (`queue_id`, `user_id`, `notification_type`, `channel`, `title`, `title_bn`, `body`, `body_bn`, `data`, `image_url`, `scheduled_at`, `priority`, `status`, `attempts`, `max_attempts`, `sent_at`, `error_message`, `related_entity_type`, `related_entity_id`, `created_at`, `updated_at`) VALUES
(1, 71, 'new_appointment', 'push', 'নতুন পরামর্শ অনুরোধ', NULL, 'একজন কৃষক আপনার সাথে পরামর্শের জন্য অনুরোধ করেছেন', NULL, NULL, NULL, '2026-01-07 03:42:33', 'normal', 'pending', 0, 3, NULL, NULL, NULL, NULL, '2026-01-07 03:42:33', NULL),
(2, 71, 'appointment_cancelled', 'push', 'পরামর্শ বাতিল', NULL, 'একটি পরামর্শ বাতিল করা হয়েছে', NULL, NULL, NULL, '2026-01-07 03:57:15', 'normal', 'pending', 0, 3, NULL, NULL, NULL, NULL, '2026-01-07 03:57:15', NULL),
(3, 29, 'appointment_confirmed', 'push', 'পরামর্শ নিশ্চিত হয়েছে', NULL, 'আপনার পরামর্শের অনুরোধ নিশ্চিত করা হয়েছে', NULL, NULL, NULL, '2026-01-07 04:08:21', 'normal', 'pending', 0, 3, NULL, NULL, NULL, NULL, '2026-01-07 04:08:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notification_tokens`
--

CREATE TABLE `notification_tokens` (
  `token_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_token` varchar(500) NOT NULL COMMENT 'FCM/APNs token',
  `device_type` enum('android','ios','web') NOT NULL,
  `device_id` varchar(100) DEFAULT NULL COMMENT 'Unique device identifier',
  `device_name` varchar(100) DEFAULT NULL,
  `app_version` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_used_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'farmer-app', '8e6b5ed003919060d30dacde1de2328face86a072c99f8ca13a2eb3977fb4069', '[\"farmer\"]', NULL, NULL, '2025-11-09 12:29:02', '2025-11-09 12:29:02'),
(2, 'App\\Models\\User', 1, 'farmer-app', 'f9f3e5fca68ebc9591c5456b302cd5642dfcb4264d4d4aabcc2b13005118d60c', '[\"farmer\"]', NULL, NULL, '2025-11-09 12:32:56', '2025-11-09 12:32:56'),
(3, 'App\\Models\\User', 1, 'farmer-app', 'e1f0ac3460ea8ea5ac2bebfe2b99e7586e7b67c989f35d7f6191cf2a9985776f', '[\"farmer\"]', NULL, NULL, '2025-11-09 12:36:17', '2025-11-09 12:36:17'),
(4, 'App\\Models\\User', 1, 'farmer-app', '89bcd6acff520dd75b39a9168eb869894cc1574d4270137327a3dbaa8bb9dca6', '[\"farmer\"]', NULL, NULL, '2025-11-09 23:22:31', '2025-11-09 23:22:31'),
(5, 'App\\Models\\User', 1, 'farmer-app', '9036785ce4382654ebe19fb4db1e7599b8cd4511a4cfc770209cf6f6c8970fd5', '[\"farmer\"]', NULL, NULL, '2025-11-09 23:30:28', '2025-11-09 23:30:28'),
(6, 'App\\Models\\User', 1, 'farmer-app', 'c18968da1e1ed8c7ff3a6e10f27d34b40a41e3190162c98b970aa6d38c78a5a2', '[\"farmer\"]', NULL, NULL, '2025-11-10 03:32:41', '2025-11-10 03:32:41'),
(7, 'App\\Models\\User', 15, 'farmer-app', '865968b24118c571fb2040ae53246c18e5d2302bd9ed124dbf5f7713395e1308', '[\"farmer\"]', NULL, NULL, '2025-12-04 14:18:43', '2025-12-04 14:18:43'),
(8, 'App\\Models\\User', 28, 'farmer-app', 'ee9fb389287978c0fd2374560cbb941162004c49e5873aae0d1568b7e991a343', '[\"farmer\"]', '2025-12-04 15:04:51', NULL, '2025-12-04 15:04:43', '2025-12-04 15:04:51'),
(9, 'App\\Models\\User', 28, 'farmer-app', '872411deea600cb638ed3c239af97b9fb62277f97742207df5b4bae86e0764ef', '[\"farmer\"]', '2025-12-04 15:07:48', NULL, '2025-12-04 15:07:15', '2025-12-04 15:07:48'),
(10, 'App\\Models\\User', 1, 'farmer-app', 'dbfb5cfdc6e61bc2df8989ab57cd1beb5af3bf645b1c4ea1f9b11c2431db718e', '[\"farmer\"]', '2025-12-04 15:09:00', NULL, '2025-12-04 15:08:35', '2025-12-04 15:09:00'),
(11, 'App\\Models\\User', 28, 'farmer-app', '2bac66a7994ff080651337637ab5df30a5837978bba05196741593b13f6e6af6', '[\"farmer\"]', '2025-12-04 15:17:03', NULL, '2025-12-04 15:13:23', '2025-12-04 15:17:03'),
(12, 'App\\Models\\User', 28, 'farmer-app', 'ffbca747b364eaade8d0549ede5d3e5d57cf60ca1970bac2228eb4a1830c2500', '[\"farmer\"]', '2025-12-05 00:42:02', NULL, '2025-12-05 00:41:50', '2025-12-05 00:42:02'),
(13, 'App\\Models\\User', 28, 'farmer-app', '816d0b1f902d5b470fabf1b601b8604e47de9e9b557122e4305dd1b5cd5b0f16', '[\"farmer\"]', '2025-12-05 00:54:01', NULL, '2025-12-05 00:46:58', '2025-12-05 00:54:01'),
(14, 'App\\Models\\User', 28, 'farmer-app', 'f1750112b10ade09ea58a23b991229c5b94a684397bf01bc1133c528dfbb6d6c', '[\"farmer\"]', '2025-12-05 00:55:09', NULL, '2025-12-05 00:54:41', '2025-12-05 00:55:09'),
(15, 'App\\Models\\User', 28, 'farmer-app', '5736363e90fbf65b812f2b9fef7fd9bb5103896ec827b654c0a75f6a30031e7f', '[\"farmer\"]', '2025-12-05 00:58:34', NULL, '2025-12-05 00:57:42', '2025-12-05 00:58:34'),
(16, 'App\\Models\\User', 28, 'farmer-app', '3e405822df612f6264315ca4e5b8d572df9d29d74ec65ef02a5687302064a9a6', '[\"farmer\"]', NULL, NULL, '2025-12-05 01:01:57', '2025-12-05 01:01:57'),
(17, 'App\\Models\\User', 28, 'farmer-app', 'f55e826a20609c33cf98478b8fa36449be684aa2b4d20f345f408c991adfeb73', '[\"farmer\"]', '2025-12-05 01:04:42', NULL, '2025-12-05 01:04:28', '2025-12-05 01:04:42'),
(18, 'App\\Models\\User', 28, 'farmer-app', 'b85411e25bedfd9d9568881f0a6be5e384f1c792371f0a222feecd97b3d4a45a', '[\"farmer\"]', '2025-12-05 01:07:59', NULL, '2025-12-05 01:05:17', '2025-12-05 01:07:59'),
(19, 'App\\Models\\User', 28, 'farmer-app', '3e948fce24a761db64d7f836ce8bf18227abc84397fd5d38b25c243d4d1c88d0', '[\"farmer\"]', '2025-12-05 01:19:34', NULL, '2025-12-05 01:11:27', '2025-12-05 01:19:34'),
(20, 'App\\Models\\User', 28, 'farmer-app', '095702f45b10074bddb0b70d7738a26402e39522052c2e451f7edc4fa9826e54', '[\"farmer\"]', '2025-12-05 02:00:20', NULL, '2025-12-05 01:58:53', '2025-12-05 02:00:20'),
(21, 'App\\Models\\User', 28, 'farmer-app', '86f5fb620d05cc6bc7ab5cccc01ca40325e0de0af14b0ffc239c30a6ce9a9e7c', '[\"farmer\"]', '2025-12-06 12:16:39', NULL, '2025-12-05 02:25:20', '2025-12-06 12:16:39'),
(22, 'App\\Models\\User', 28, 'farmer-app', '0a80ab7b9bd94a5a53965267de13275a1432ba3d0431559eab6d1c66f5ce783f', '[\"farmer\"]', NULL, NULL, '2025-12-05 02:28:26', '2025-12-05 02:28:26'),
(23, 'App\\Models\\User', 1, 'farmer-app', 'f98d48fd0677dcb3d5051fd33921d5769b2d0a1ba3de89b6eef3e1a97fa0f77c', '[\"farmer\"]', NULL, NULL, '2025-12-05 02:36:10', '2025-12-05 02:36:10'),
(24, 'App\\Models\\User', 28, 'farmer-app', '814838289dcf5fa292ad350ee40f684b37a6fe52f6bba2ec3745f329d8d04af4', '[\"farmer\"]', NULL, NULL, '2025-12-05 02:36:45', '2025-12-05 02:36:45'),
(25, 'App\\Models\\User', 1, 'farmer-app', 'ed7fd5909297e287ebe79e4f8c3bdb7772ae694def16d5dd1af2c1b345edf6f5', '[\"farmer\"]', NULL, NULL, '2025-12-05 02:49:00', '2025-12-05 02:49:00'),
(26, 'App\\Models\\User', 28, 'farmer-app', '3b2eb36b630f1d1cd90c3e2d9d4650f3b0507611b0077e80a213d8959f387e9c', '[\"farmer\"]', '2025-12-05 06:06:54', NULL, '2025-12-05 06:00:40', '2025-12-05 06:06:54'),
(27, 'App\\Models\\User', 2, 'farmer-app', 'f072ea2d641e60ebf9240fae11612cb1148c6dd9170cc9b88ffa5ddff620bb99', '[\"farmer\"]', '2025-12-05 06:10:02', NULL, '2025-12-05 06:09:29', '2025-12-05 06:10:02'),
(28, 'App\\Models\\User', 28, 'farmer-app', 'dc5994c22e7d69b78bf5d52b04624d7f02dffa1aac9ec541dc9d51977b4d4598', '[\"farmer\"]', '2025-12-05 08:58:42', NULL, '2025-12-05 06:12:02', '2025-12-05 08:58:42'),
(29, 'App\\Models\\User', 29, 'farmer-app', '51786a6241bdc2b2f9a7ce59a61d857f0eb606e8d85dad02ec9c4a15b73bfae7', '[\"farmer\"]', '2025-12-05 12:12:30', NULL, '2025-12-05 12:08:29', '2025-12-05 12:12:30'),
(30, 'App\\Models\\User', 29, 'farmer-app', 'e99a0b84bc304ec1f5aadfcef0008323553b62014649387236f21549262aeb59', '[\"farmer\"]', '2025-12-05 12:13:47', NULL, '2025-12-05 12:13:42', '2025-12-05 12:13:47'),
(31, 'App\\Models\\User', 30, 'farmer-app', '8aafd00e0c4771b1d1dcbeb2994066ae3adc22e42402c66017fe35d4df3d76be', '[\"farmer\"]', '2025-12-05 12:29:07', NULL, '2025-12-05 12:29:01', '2025-12-05 12:29:07'),
(32, 'App\\Models\\User', 29, 'farmer-app', 'a1e0bb3e27ab454792c289c42f14b25f8a56cb1a0c0fa566136281c4a9f01c11', '[\"farmer\"]', '2025-12-06 04:19:13', NULL, '2025-12-05 12:29:50', '2025-12-06 04:19:13'),
(33, 'App\\Models\\User', 30, 'farmer-app', 'd8be476effb5c204886b9624c662beea85f576d145672b6fef6828ac109a1632', '[\"farmer\"]', '2025-12-06 04:47:47', NULL, '2025-12-06 04:34:26', '2025-12-06 04:47:47'),
(34, 'App\\Models\\User', 30, 'farmer-app', 'b26bc78f0cb62e3da5ceac945055dc53e5d748770685d12dff6d554570af081d', '[\"farmer\"]', '2025-12-06 04:53:24', NULL, '2025-12-06 04:49:21', '2025-12-06 04:53:24'),
(35, 'App\\Models\\User', 29, 'farmer-app', '44a9f54bef35d548d25377bf2dc6968b7bff697479ea19f48aba43993b2a3ce0', '[\"farmer\"]', '2025-12-07 02:44:19', NULL, '2025-12-06 04:55:09', '2025-12-07 02:44:19'),
(36, 'App\\Models\\User', 29, 'farmer-app', 'b6b7b71649edd3c423ee53b766fb5ec6a925f9ae6bee1b2c061a317e18aea953', '[\"farmer\"]', '2025-12-12 04:22:41', NULL, '2025-12-06 12:17:12', '2025-12-12 04:22:41'),
(37, 'App\\Models\\User', 30, 'farmer-app', '7c7341a9b569b2897359bc029f8bb2439486cfbda8e1ee8e599fef88fd5cdf09', '[\"farmer\"]', '2025-12-07 02:46:54', NULL, '2025-12-07 02:45:58', '2025-12-07 02:46:54'),
(38, 'App\\Models\\User', 31, 'farmer-app', 'c2ece7ae2cb1c80bb9f8ffb6ded5d2c406150986d4b65391ec44274586b818e1', '[\"farmer\"]', '2025-12-07 03:15:27', NULL, '2025-12-07 02:52:02', '2025-12-07 03:15:27'),
(39, 'App\\Models\\User', 31, 'test-token', '22eaf9be285a9035819601a2ff8b78767d5f50bc2f0eca2b723ae51d79a28c3d', '[\"farmer\"]', '2025-12-07 03:10:31', NULL, '2025-12-07 03:10:30', '2025-12-07 03:10:31'),
(40, 'App\\Models\\User', 29, 'farmer-app', '728e5e3d912cdd92724246fe5732ad019c1679e7d36a3d63c3a3ef62ee639fff', '[\"farmer\"]', NULL, NULL, '2025-12-07 03:16:37', '2025-12-07 03:16:37'),
(41, 'App\\Models\\User', 30, 'farmer-app', '41e84cfd6c613a7ad692737c66d041c531e634001013f1cf60d6fe388de3b620', '[\"farmer\"]', '2025-12-07 03:21:05', NULL, '2025-12-07 03:20:33', '2025-12-07 03:21:05'),
(42, 'App\\Models\\User', 31, 'farmer-app', '7d75e2e923b4d475c2e5f45087198dcf32af21ea7fe0d87ef2ee28a255622a07', '[\"farmer\"]', '2025-12-07 03:23:29', NULL, '2025-12-07 03:22:18', '2025-12-07 03:23:29'),
(43, 'App\\Models\\User', 32, 'farmer-app', '0c60836cb68034bff4161a2ea050c951e87849f5b5a6c5d0995a5c1d4def8146', '[\"farmer\"]', NULL, NULL, '2025-12-07 03:35:28', '2025-12-07 03:35:28'),
(44, 'App\\Models\\User', 32, 'farmer-app', 'ba5f7f5419d55fff75d23dd682cf9746db3ab9075c5d9561bb4dc6ff3f3020ee', '[\"farmer\"]', '2025-12-07 04:18:28', NULL, '2025-12-07 03:40:35', '2025-12-07 04:18:28'),
(45, 'App\\Models\\User', 33, 'customer-app', '542cead437eee6f9fd65a497ce6be6649df7d7c81bd5618fdc45b8df70ba028d', '[\"customer\"]', NULL, NULL, '2025-12-07 06:43:54', '2025-12-07 06:43:54'),
(46, 'App\\Models\\User', 33, 'customer-app', '51311476fbd51f9c85ee11719dc440d88c65a883bb2d69364039322cf646d54c', '[\"customer\"]', '2025-12-07 07:11:56', NULL, '2025-12-07 06:52:56', '2025-12-07 07:11:56'),
(47, 'App\\Models\\User', 29, 'farmer-app', '2b6262659f1d12cdfcbdf90da5b8dc49edc82bd76d15a1b43514172caa311fa8', '[\"farmer\"]', '2025-12-07 07:12:27', NULL, '2025-12-07 07:12:22', '2025-12-07 07:12:27'),
(48, 'App\\Models\\User', 33, 'customer-app', 'e99394b9ad169f9aea486bce3e8b0be9eb3faa3a3be3cb22e648cf5d911359bb', '[\"customer\"]', NULL, NULL, '2025-12-07 07:13:31', '2025-12-07 07:13:31'),
(49, 'App\\Models\\User', 29, 'farmer-app', '7bb5b13255cd5f0108c84acb47c084bc876f9a749092205d931a3bccb3ed276f', '[\"farmer\"]', NULL, NULL, '2025-12-07 07:16:35', '2025-12-07 07:16:35'),
(50, 'App\\Models\\User', 33, 'customer-app', 'cb31d84af78b30f0836e1cff1f06db9891ed50aa77762231edc11ffe5f88739c', '[\"customer\"]', '2025-12-07 07:30:46', NULL, '2025-12-07 07:19:14', '2025-12-07 07:30:46'),
(51, 'App\\Models\\User', 33, 'customer-app', 'dff0ff8f39906a600500b94f44bbbfa2f43248c06081acf5f2bdb44ac06f2e3a', '[\"customer\"]', NULL, NULL, '2025-12-07 07:48:23', '2025-12-07 07:48:23'),
(52, 'App\\Models\\User', 29, 'farmer-app', '0ca399be404beadf7f9cbeee58124ebc69ba801abe39566aa23654953b0bfecb', '[\"farmer\"]', '2025-12-07 07:49:47', NULL, '2025-12-07 07:49:39', '2025-12-07 07:49:47'),
(53, 'App\\Models\\User', 33, 'customer-app', 'f7cddb8e07a832a36f0188e8a837f0f04cc0f5f1e19292de76220aaaa0a9316e', '[\"customer\"]', '2025-12-07 08:00:27', NULL, '2025-12-07 07:52:36', '2025-12-07 08:00:27'),
(54, 'App\\Models\\User', 33, 'customer-app', 'e6d54469a5ed9e04166fd0dec3ca0c330dac8b4d9f5ae5ca7c4da2b7e78c5774', '[\"customer\"]', '2025-12-07 08:13:29', NULL, '2025-12-07 08:04:06', '2025-12-07 08:13:29'),
(55, 'App\\Models\\User', 29, 'farmer-app', 'd64cdf036dfd019c3f6cd85874b1c61059171d8eee85aaedd4048d8d4615f24e', '[\"farmer\"]', '2025-12-07 08:20:09', NULL, '2025-12-07 08:19:53', '2025-12-07 08:20:09'),
(56, 'App\\Models\\User', 33, 'customer-app', '60e91f09a1d289cdfcf862025d30955352bbe928be27ff7dd8f40b58aacd66b9', '[\"customer\"]', '2025-12-07 09:26:03', NULL, '2025-12-07 08:20:34', '2025-12-07 09:26:03'),
(57, 'App\\Models\\User', 29, 'farmer-app', 'af0d4543059801ecfe1e9ba900a103e464dbaca378ad251160a57d430717ae9b', '[\"farmer\"]', '2025-12-07 09:29:57', NULL, '2025-12-07 09:28:15', '2025-12-07 09:29:57'),
(58, 'App\\Models\\User', 29, 'farmer-app', '85cb2df2ffdc797edafed8500c38821a99ef76bd526b3ab48abe2a73648c12c2', '[\"farmer\"]', '2025-12-12 12:58:32', NULL, '2025-12-07 12:01:05', '2025-12-12 12:58:32'),
(59, 'App\\Models\\User', 29, 'farmer-app', 'ea7bd9b9fea57b1adcc2e7ef3fc5dc4cf70f0285ff975ee9278cf6103cddf28d', '[\"farmer\"]', NULL, NULL, '2025-12-07 13:15:33', '2025-12-07 13:15:33'),
(60, 'App\\Models\\User', 33, 'customer-app', '8b0afab5d2e5bc85fa0a542aae89ad0974a0e4644527993fa463c1f5fb22ca8b', '[\"customer\"]', NULL, NULL, '2025-12-07 14:13:54', '2025-12-07 14:13:54'),
(61, 'App\\Models\\User', 29, 'farmer-app', '92b410f1eaf6be9165ed6946b8b2ea90adf792ea3177413a60017c5fa413ddd6', '[\"farmer\"]', '2025-12-07 14:56:35', NULL, '2025-12-07 14:14:41', '2025-12-07 14:56:35'),
(62, 'App\\Models\\User', 29, 'farmer-app', 'f9f022d89140bfc08a43f01fc7b79dc41ebd200d4b351d281ffce02a6af65de2', '[\"farmer\"]', '2025-12-11 05:48:09', NULL, '2025-12-07 15:06:39', '2025-12-11 05:48:09'),
(63, 'App\\Models\\User', 29, 'farmer-app', 'd8fa373726afffef0b427dab15fd36095e7263f438dd098e3e352d88f2bb8e8e', '[\"farmer\"]', '2025-12-11 06:39:26', NULL, '2025-12-11 06:25:32', '2025-12-11 06:39:26'),
(64, 'App\\Models\\User', 34, 'customer-app', '0b0026c61568c02c05a61fd1f51a6e0ac63d7ca2bbc8dead61fa3fdb2789ff27', '[\"customer\"]', '2025-12-11 06:49:02', NULL, '2025-12-11 06:47:46', '2025-12-11 06:49:02'),
(65, 'App\\Models\\User', 33, 'customer-app', '657871d3dce1279e7dddac189c84e553d36faf8aed737fe2d7650e8170ca5849', '[\"customer\"]', '2025-12-11 06:50:23', NULL, '2025-12-11 06:50:17', '2025-12-11 06:50:23'),
(66, 'App\\Models\\User', 29, 'farmer-app', 'eae0fe0ba416386cb21f8f455a081fe3dec73e63f5fcf46c2d8263a85933591a', '[\"farmer\"]', '2026-01-06 22:25:17', NULL, '2025-12-12 03:13:58', '2026-01-06 22:25:17'),
(67, 'App\\Models\\User', 29, 'farmer-app', '35f4e8a66c6c93722992ff8360d494da01182ce244e698abad6e0d85f5aa746a', '[\"farmer\"]', NULL, NULL, '2025-12-12 05:08:16', '2025-12-12 05:08:16'),
(68, 'App\\Models\\User', 29, 'farmer-app', 'b5713f97bec066b6b7941f4381e253042efbb507494655daabcdc111bc94c842', '[\"farmer\"]', '2025-12-15 04:06:39', NULL, '2025-12-15 03:08:51', '2025-12-15 04:06:39'),
(69, 'App\\Models\\User', 29, 'farmer-app', 'b668ab1662ea4b756c52e34dc9e18a41988e18c163d11b5218c14b6d4cec74c6', '[\"farmer\"]', '2025-12-15 05:06:05', NULL, '2025-12-15 04:25:21', '2025-12-15 05:06:05'),
(70, 'App\\Models\\User', 30, 'farmer-app', '8038f7554acc785a035d95a6115bf390d143bb016c38e232dc9b1b275818c29e', '[\"farmer\"]', '2025-12-15 05:09:30', NULL, '2025-12-15 05:06:29', '2025-12-15 05:09:30'),
(71, 'App\\Models\\User', 35, 'farmer-app', 'a8cbaff0fe3ad5551d9206e73f000cb1cdb2fd65e9342c4630e53a20e9f04edf', '[\"farmer\"]', '2025-12-15 06:37:44', NULL, '2025-12-15 06:34:44', '2025-12-15 06:37:44'),
(72, 'App\\Models\\User', 29, 'farmer-app', '1020991e8365b50ae450b6e85a50c4ab50b492f92a92144cfd4d386ab6deb7d2', '[\"farmer\"]', '2025-12-15 06:55:30', NULL, '2025-12-15 06:54:29', '2025-12-15 06:55:30'),
(73, 'App\\Models\\User', 36, 'farmer-app', 'd8a3620014f65932206ed2c1ddf04a3b6bf6c1378ed34eb0c7ffeb7839fdc27d', '[\"farmer\"]', '2025-12-15 06:59:15', NULL, '2025-12-15 06:57:34', '2025-12-15 06:59:15'),
(74, 'App\\Models\\User', 37, 'farmer-app', '7d284be78797982d9e76749a616bbd1b9c97fcc5cc10792cfbd2e96cb7526142', '[\"farmer\"]', '2025-12-15 07:03:04', NULL, '2025-12-15 07:03:04', '2025-12-15 07:03:04'),
(75, 'App\\Models\\User', 37, 'farmer-app', 'eea5490e4ab318d466cb6ffe4abb3d3bf280342a11ee4013d35a1eb2e2a0e79d', '[\"farmer\"]', '2025-12-15 07:09:15', NULL, '2025-12-15 07:03:28', '2025-12-15 07:09:15'),
(76, 'App\\Models\\User', 39, 'data-operator-app', '404cfb889393f8b49116fb95d0162c5385a1333b33048457e567833384fc4e50', '[\"data_operator\"]', '2025-12-15 08:26:51', NULL, '2025-12-15 08:26:50', '2025-12-15 08:26:51'),
(77, 'App\\Models\\User', 39, 'data-operator-app', '0a22dc3c4197dc30fd608ceb26593f385e29cb6e06d5cf72c6a0657b57db371d', '[\"data_operator\"]', '2025-12-15 08:28:14', NULL, '2025-12-15 08:27:30', '2025-12-15 08:28:14'),
(78, 'App\\Models\\User', 39, 'data-operator-app', 'e1bc5086501ffc2381ff5979e70ccd8d083374bed6b67ab1b85df5afec65c92c', '[\"data_operator\"]', '2025-12-15 08:33:52', NULL, '2025-12-15 08:28:29', '2025-12-15 08:33:52'),
(79, 'App\\Models\\User', 39, 'data-operator-app', '2b69215463a6c53a4c47d625d1db9709794a062ee82b7fc361aa58d8743d8de1', '[\"data_operator\"]', '2025-12-15 08:34:55', NULL, '2025-12-15 08:34:36', '2025-12-15 08:34:55'),
(80, 'App\\Models\\User', 39, 'data-operator-app', 'd205e0d48afb11288c1579075d8f3b8456f496cf289b95f34dcf3f3b53548979', '[\"data_operator\"]', '2025-12-15 08:36:48', NULL, '2025-12-15 08:35:23', '2025-12-15 08:36:48'),
(81, 'App\\Models\\User', 39, 'data-operator-app', 'ba057a206d9a7ed628c0eb1208102f509dc3dceae300bf27ae0ec50e6539e6db', '[\"data_operator\"]', '2025-12-15 08:37:14', NULL, '2025-12-15 08:36:57', '2025-12-15 08:37:14'),
(82, 'App\\Models\\User', 39, 'data-operator-app', '3d1b9ee11a9b35041aa27cdc57305fd8c20ee7bedf83a011367117e9bc900c39', '[\"data_operator\"]', '2025-12-15 08:41:31', NULL, '2025-12-15 08:41:30', '2025-12-15 08:41:31'),
(83, 'App\\Models\\User', 39, 'data-operator-app', '564ebd274bee0e10ab6c3e1d54ff09ef0618b6e09f8e110ac29e75bbcc955060', '[\"data_operator\"]', '2025-12-15 08:48:51', NULL, '2025-12-15 08:42:29', '2025-12-15 08:48:51'),
(84, 'App\\Models\\User', 39, 'data-operator-app', '66104668b6a1a348b5f7a4ef1536df6c51670da242ee6e8aaed5d2a7cf7c827d', '[\"data_operator\"]', '2025-12-15 09:27:36', NULL, '2025-12-15 08:48:59', '2025-12-15 09:27:36'),
(85, 'App\\Models\\User', 40, 'expert-app', '33ea4f8c7a248cb484c4fca2ef1763a1d5cc8903278cc29739c95ec4e4d461d5', '[\"expert\"]', '2025-12-15 09:11:07', NULL, '2025-12-15 09:08:23', '2025-12-15 09:11:07'),
(86, 'App\\Models\\User', 39, 'data-operator-app', 'cadf5e042a4ab2962398acd17396c65f954a6806e47180989c0eb4fffcb9c098', '[\"data_operator\"]', NULL, NULL, '2025-12-15 09:27:41', '2025-12-15 09:27:41'),
(87, 'App\\Models\\User', 39, 'data-operator-app', 'a6b0d1accd775116f3f6ffe284645ea3be6cb92daedcf68ff7099b371dc75d77', '[\"data_operator\"]', '2025-12-15 10:37:01', NULL, '2025-12-15 09:28:09', '2025-12-15 10:37:01'),
(88, 'App\\Models\\User', 41, 'expert-app', '0305c44c059ddbc7dce3006df1e443625c270d6763881c892086735aaf4a4bc0', '[\"expert\"]', '2025-12-15 10:47:55', NULL, '2025-12-15 09:29:44', '2025-12-15 10:47:55'),
(89, 'App\\Models\\User', 29, 'farmer-app', 'c3c97cbc4cdad4cf82e70db702db7cc3977cb0d8cdbd8bf5b69ae23d05404790', '[\"farmer\"]', '2025-12-15 11:17:51', NULL, '2025-12-15 10:37:21', '2025-12-15 11:17:51'),
(90, 'App\\Models\\User', 39, 'data-operator-app', '080ada82533e54ed6ef4f47366fc5d14dae9a077e773b4a502ddcdcf7525d34e', '[\"data_operator\"]', '2025-12-15 10:38:01', NULL, '2025-12-15 10:37:23', '2025-12-15 10:38:01'),
(91, 'App\\Models\\User', 39, 'data-operator-app', 'ee48142b43ba1c2cc25f1e5be11cf4d8a5aa584ec49e6fd8bc3bf3a27af0b9f3', '[\"data_operator\"]', '2025-12-16 05:02:24', NULL, '2025-12-15 10:38:38', '2025-12-16 05:02:24'),
(92, 'App\\Models\\User', 42, 'expert-app', '72ae071ebc3bd9bc8fb604d8d74e3299030635d688ea97116df79211724a87cc', '[\"expert\"]', '2025-12-15 10:58:57', NULL, '2025-12-15 10:50:57', '2025-12-15 10:58:57'),
(93, 'App\\Models\\User', 43, 'expert-app', '004acb2477ae8bde7f490e25d291378d6248ab7b929bcf092ee80358fd1b3a2f', '[\"expert\"]', '2025-12-15 11:08:03', NULL, '2025-12-15 11:01:02', '2025-12-15 11:08:03'),
(94, 'App\\Models\\User', 39, 'data-operator-app', '050d3f172b2f186c477028ee3dc42c8c49999859ddcd74f6a16de3e238b4d9af', '[\"data_operator\"]', '2025-12-15 11:14:12', NULL, '2025-12-15 11:05:24', '2025-12-15 11:14:12'),
(95, 'App\\Models\\User', 39, 'data-operator-app', '7bf10f48782251df2d5fe57c1a85c20ed91136277f7310e08319e3f15c751a63', '[\"data_operator\"]', '2025-12-15 11:21:41', NULL, '2025-12-15 11:14:39', '2025-12-15 11:21:41'),
(96, 'App\\Models\\User', 39, 'test', '750c148f3de473cfd08a6ef5c97c760199b1948272ce4ed9a15a9a6f0612a8a0', '[\"*\"]', '2025-12-15 11:16:49', NULL, '2025-12-15 11:16:49', '2025-12-15 11:16:49'),
(97, 'App\\Models\\User', 39, 'test', '7f17f1647fb7f122de766a2688e5f5323568aecfe05d82c5b8674f81ab7d9d71', '[\"*\"]', '2025-12-15 11:18:26', NULL, '2025-12-15 11:18:26', '2025-12-15 11:18:26'),
(98, 'App\\Models\\User', 39, 'test', '5575a5a962529173c7efaf054930c4e0d2870dfdf8f317747162b2d09f15de1a', '[\"*\"]', '2025-12-15 11:19:14', NULL, '2025-12-15 11:19:14', '2025-12-15 11:19:14'),
(99, 'App\\Models\\User', 29, 'farmer-app', '990de3f7852217c16f33c52abe0c3926e56a4509e52dc5d7ce22ddba6889a362', '[\"farmer\"]', '2025-12-15 11:36:20', NULL, '2025-12-15 11:22:19', '2025-12-15 11:36:20'),
(100, 'App\\Models\\User', 32, 'farmer-app', '19be5a104f4b530cf933f218c0fd18dc2db9c12fcccc2c96f7b92d578d13b4bb', '[\"farmer\"]', '2025-12-15 11:24:02', NULL, '2025-12-15 11:23:59', '2025-12-15 11:24:02'),
(101, 'App\\Models\\User', 35, 'farmer-app', 'ea1dbf233261393f92c362b073dd24c18826fba98645e9e91c1b68a4811e4ffe', '[\"farmer\"]', '2025-12-15 11:32:51', NULL, '2025-12-15 11:25:15', '2025-12-15 11:32:51'),
(102, 'App\\Models\\User', 44, 'expert-app', '3b8bf559654b29c275dcea7d8de45017626cc59b148162a2b75ced685d82fb3a', '[\"expert\"]', '2025-12-15 11:28:38', NULL, '2025-12-15 11:28:33', '2025-12-15 11:28:38'),
(103, 'App\\Models\\User', 39, 'data-operator-app', 'a209e07f4ebbcc8a10b84f1678fbbfe3ebd7759c4b8c5bcee61d4d1f168b5286', '[\"data_operator\"]', '2025-12-15 11:34:16', NULL, '2025-12-15 11:33:15', '2025-12-15 11:34:16'),
(104, 'App\\Models\\User', 32, 'farmer-app', '733ca78b68997b0ed50bb5184933ab3a99ef814ee3806657d8a8886a3edb5015', '[\"farmer\"]', '2025-12-15 11:35:27', NULL, '2025-12-15 11:35:22', '2025-12-15 11:35:27'),
(105, 'App\\Models\\User', 32, 'farmer-app', 'dc8cec2abb4d7885d7c5c0f78bbd37fa819f678bf58b39afd57bff78a1d44af1', '[\"farmer\"]', '2025-12-15 11:37:13', NULL, '2025-12-15 11:36:57', '2025-12-15 11:37:13'),
(106, 'App\\Models\\User', 31, 'farmer-app', '08ee1971479feb7c8cff2248519a9b69e7807b2347f8050f23cb1397c1ccc565', '[\"farmer\"]', '2025-12-15 11:39:03', NULL, '2025-12-15 11:38:02', '2025-12-15 11:39:03'),
(107, 'App\\Models\\User', 39, 'data-operator-app', '1fbcfba0d4f67949013898f24fc66c369f037ee801c511b6a23a9fc4cb9a89c1', '[\"data_operator\"]', '2025-12-15 11:40:17', NULL, '2025-12-15 11:39:11', '2025-12-15 11:40:17'),
(108, 'App\\Models\\User', 28, 'farmer-app', 'a5df3631505821c9b933879907a5dd43d0d90d5178c8136da60b84fc613c47e7', '[\"farmer\"]', '2025-12-15 11:41:04', NULL, '2025-12-15 11:41:01', '2025-12-15 11:41:04'),
(109, 'App\\Models\\User', 35, 'farmer-app', '7909ca193799dc21c8606747fe5a34f67eff3436d76a876ef5bb76fa5997cd61', '[\"farmer\"]', '2025-12-15 11:48:38', NULL, '2025-12-15 11:46:36', '2025-12-15 11:48:38'),
(110, 'App\\Models\\User', 39, 'data-operator-app', '121a60d3ba358f1cdb5294e846debfb8ebe6002398d5988535b22d860a445e64', '[\"data_operator\"]', '2025-12-15 11:49:41', NULL, '2025-12-15 11:49:26', '2025-12-15 11:49:41'),
(111, 'App\\Models\\User', 15, 'farmer-app', 'cc24de0c0d217de58e8e01100d430d0d76ffbe1707e2fa05d8c5da9dd75ceb8e', '[\"farmer\"]', NULL, NULL, '2025-12-15 11:50:22', '2025-12-15 11:50:22'),
(112, 'App\\Models\\User', 15, 'farmer-app', 'abc41d67270fb25cc98a9b451c2446ee1ed840373c95e5f9c0621691484a04fb', '[\"farmer\"]', NULL, NULL, '2025-12-15 11:50:58', '2025-12-15 11:50:58'),
(113, 'App\\Models\\User', 15, 'farmer-app', '089e2f0e920ec00988c45d7d10c049c34c95bfbc7258c1a1795c2e11d9662ffe', '[\"farmer\"]', NULL, NULL, '2025-12-15 11:51:11', '2025-12-15 11:51:11'),
(114, 'App\\Models\\User', 45, 'expert-app', 'f43c8f5ccffa1556bb635de18bea9cac3b870b045b0ee4dfa0b12e3905ddb2af', '[\"expert\"]', '2025-12-15 13:23:53', NULL, '2025-12-15 11:51:59', '2025-12-15 13:23:53'),
(115, 'App\\Models\\User', 15, 'farmer-app', '2668c0be965595b3fe3cf70804b4c17431d6be1c32a5c2446ca028ed2aaf8897', '[\"farmer\"]', NULL, NULL, '2025-12-15 11:52:54', '2025-12-15 11:52:54'),
(116, 'App\\Models\\User', 31, 'farmer-app', 'a16ca416cd39e0d1f0127085618f78987e8ec08f0d745be76f372c60f0b0748f', '[\"farmer\"]', NULL, NULL, '2025-12-15 11:54:44', '2025-12-15 11:54:44'),
(117, 'App\\Models\\User', 31, 'farmer-app', '554ac785ae46972491d1a2988d8000ddcb1ec5a4baf331a33b08206adc20055c', '[\"farmer\"]', '2025-12-15 12:05:46', NULL, '2025-12-15 11:55:55', '2025-12-15 12:05:46'),
(118, 'App\\Models\\User', 39, 'data-operator-app', '4a75df14c89686eca57190bca2a4d7c8a5cb5d86e5114d3a0320ea748d0a9efe', '[\"data_operator\"]', '2025-12-17 06:41:49', NULL, '2025-12-15 12:08:13', '2025-12-17 06:41:49'),
(119, 'App\\Models\\User', 46, 'expert-app', '38b2e206ec0d44aafae97f23f820ed0c8846aaa2936c629e07faf4b211d78bb1', '[\"expert\"]', '2025-12-15 13:27:38', NULL, '2025-12-15 13:26:38', '2025-12-15 13:27:38'),
(120, 'App\\Models\\User', 47, 'expert-app', '6fa47a845fe5e8bfd3f67fdc45120e8defc6be21d31dc3f13e7045ef2d389a9d', '[\"expert\"]', '2025-12-15 13:46:16', NULL, '2025-12-15 13:38:42', '2025-12-15 13:46:16'),
(121, 'App\\Models\\User', 39, 'data-operator-app', '69ac5408b2b44f91c44d98c6c89a84f031065d63f817200b54c0c6ce1a77c7d7', '[\"data_operator\"]', '2025-12-15 14:07:14', NULL, '2025-12-15 13:39:28', '2025-12-15 14:07:14'),
(122, 'App\\Models\\User', 48, 'expert-app', '8a0ca46d8cc261ab968713067df2a7199473f8ccd4904b435fa3abcd1f1ab936', '[\"expert\"]', '2025-12-15 13:48:52', NULL, '2025-12-15 13:48:36', '2025-12-15 13:48:52'),
(123, 'App\\Models\\User', 48, 'expert-app', '7190a296ab03a0bc244b64adcde3b0ea947fe57e5ce74395901989208dd80d77', '[\"expert\"]', '2025-12-15 13:51:23', NULL, '2025-12-15 13:49:23', '2025-12-15 13:51:23'),
(124, 'App\\Models\\User', 37, 'farmer-app', '6e042a136ea74fed79402716b0bee738a23da7fe9c0b4188d0768d82cbc437cd', '[\"farmer\"]', '2025-12-15 13:54:04', NULL, '2025-12-15 13:52:03', '2025-12-15 13:54:04'),
(125, 'App\\Models\\User', 49, 'expert-app', '2050091c5e8499a2abbf02f0b2cd53487eacca9c074aaa0e311a67dd881552cb', '[\"expert\"]', '2025-12-15 13:59:30', NULL, '2025-12-15 13:59:16', '2025-12-15 13:59:30'),
(126, 'App\\Models\\User', 49, 'expert-app', 'cb20557b2662b092b5dc9d2b4944546625fc7f578e7ecd4ac39ea5cee01b9e4a', '[\"expert\"]', '2025-12-15 14:16:50', NULL, '2025-12-15 14:00:11', '2025-12-15 14:16:50'),
(127, 'App\\Models\\User', 29, 'farmer-app', '06fadcc30ebbf63bab907083fc097f9331e329355574bb5d22709d209135453f', '[\"farmer\"]', '2025-12-15 14:19:03', NULL, '2025-12-15 14:08:12', '2025-12-15 14:19:03'),
(128, 'App\\Models\\User', 37, 'farmer-app', '21924fb4f27b2215aa5f9fe2aacd225ea9c9c06b642f367fa931687ed752f12d', '[\"farmer\"]', '2025-12-15 14:18:01', NULL, '2025-12-15 14:17:50', '2025-12-15 14:18:01'),
(129, 'App\\Models\\User', 39, 'data-operator-app', 'a55b7450539d240cd7fa6457cd74ce337d7e0d0828ae31569002c4bd6d9baf85', '[\"data_operator\"]', '2025-12-15 14:41:05', NULL, '2025-12-15 14:19:33', '2025-12-15 14:41:05'),
(130, 'App\\Models\\User', 50, 'expert-app', '9c8dac15ad9fbdb3b6f93aaf629ff0fced01ad6ce85aad1749258b47c98c10ef', '[\"expert\"]', '2025-12-15 14:28:03', NULL, '2025-12-15 14:27:58', '2025-12-15 14:28:03'),
(131, 'App\\Models\\User', 50, 'expert-app', 'e06b94c34859cbdc3c070d82d7bf2d36667e38ea88c6faa21c50f44667958e00', '[\"expert\"]', '2025-12-15 14:42:11', NULL, '2025-12-15 14:28:34', '2025-12-15 14:42:11'),
(132, 'App\\Models\\User', 29, 'farmer-app', '6821236859ba14190b75f0f09571f1f2615920b9297e7303756daf1f90cfe013', '[\"farmer\"]', '2025-12-15 14:36:14', NULL, '2025-12-15 14:35:51', '2025-12-15 14:36:14'),
(133, 'App\\Models\\User', 39, 'data-operator-app', '4edb52d52c39f95b37969947146a8639586a042592b659a90224b36babadb600', '[\"data_operator\"]', '2025-12-15 14:37:58', NULL, '2025-12-15 14:36:57', '2025-12-15 14:37:58'),
(134, 'App\\Models\\User', 29, 'farmer-app', 'c5b9106aba5927460263ca38e58dbb9e186e8b382247b5f18d440ff78342ddc2', '[\"farmer\"]', '2025-12-16 06:47:13', NULL, '2025-12-15 14:38:29', '2025-12-16 06:47:13'),
(135, 'App\\Models\\User', 30, 'farmer-app', '454302fcb5a955c5d7f77f3c23b9ede2a4ef40133604b06e767e9d1518f76806', '[\"farmer\"]', '2025-12-15 14:43:17', NULL, '2025-12-15 14:41:33', '2025-12-15 14:43:17'),
(136, 'App\\Models\\User', 49, 'expert-app', '26e187624d02e592900679fa947d70433f7f1394776d8b94b0f60648b77fcb4d', '[\"expert\"]', '2025-12-16 06:01:09', NULL, '2025-12-15 14:42:57', '2025-12-16 06:01:09'),
(137, 'App\\Models\\User', 30, 'farmer-app', 'cb073f0cb1e0c6987856088c936e35d8249ae706089ebb820f5168e84133009d', '[\"farmer\"]', '2025-12-15 14:44:04', NULL, '2025-12-15 14:44:03', '2025-12-15 14:44:04'),
(138, 'App\\Models\\User', 39, 'data-operator-app', 'babf98a46214f189257c2d781e20b7e219c6e4525a8a9a76ef2e0f486c62dd60', '[\"data_operator\"]', '2025-12-15 14:44:55', NULL, '2025-12-15 14:44:42', '2025-12-15 14:44:55'),
(139, 'App\\Models\\User', 37, 'farmer-app', 'b390c2f5550f8e6766941ce8c770ae65be191ae20b073ed6351586060fb38186', '[\"farmer\"]', '2025-12-15 14:51:24', NULL, '2025-12-15 14:45:22', '2025-12-15 14:51:24'),
(140, 'App\\Models\\User', 39, 'data-operator-app', '24c5a4b7ee0f37a093f7ae64629d664367217e9fd06e1c50f91e5443ccb7b810', '[\"data_operator\"]', '2025-12-16 05:11:01', NULL, '2025-12-16 05:10:59', '2025-12-16 05:11:01'),
(141, 'App\\Models\\User', 50, 'expert-app', '44927f7aa8b0ae4bd717cec3141242edddbd795e9e82897ee6da2e938b6d0be1', '[\"expert\"]', '2025-12-16 09:40:01', NULL, '2025-12-16 05:14:11', '2025-12-16 09:40:01'),
(142, 'App\\Models\\User', 39, 'data-operator-app', '6ce966c6d1e45765954767301513c30c43fc2d48bb943a211791905861358633', '[\"data_operator\"]', '2025-12-16 05:47:29', NULL, '2025-12-16 05:43:28', '2025-12-16 05:47:29'),
(143, 'App\\Models\\User', 39, 'data-operator-app', '90cbba1f97dafde833a2895fe2bfc47008207086532faaadae05e45f6a1fd94f', '[\"data_operator\"]', '2025-12-16 11:25:16', NULL, '2025-12-16 05:47:58', '2025-12-16 11:25:16'),
(144, 'App\\Models\\User', 51, 'expert-app', 'd993ed8371e6edc6bdffa6b8585b5565a92e3a3758e8ee8feca7053994546cd8', '[\"expert\"]', '2025-12-16 06:43:06', NULL, '2025-12-16 06:06:34', '2025-12-16 06:43:06'),
(145, 'App\\Models\\User', 33, 'customer-app', '39f334809c0d1e6481a3e0efc64ba926d3062c87139d719ed2cf1e7831c50010', '[\"customer\"]', '2025-12-16 06:44:57', NULL, '2025-12-16 06:44:49', '2025-12-16 06:44:57'),
(146, 'App\\Models\\User', 52, 'customer-app', '7850ca80d619842657d25b155272b4aa400c287efff85207f57b9abc595b58ec', '[\"customer\"]', '2025-12-16 10:23:15', NULL, '2025-12-16 10:22:09', '2025-12-16 10:23:15'),
(147, 'App\\Models\\User', 56, 'farmer-app', '2232bec118c306d8417d1c683544b1396f2ec7b3fd568e01184ca464b670dcc6', '[\"farmer\"]', '2025-12-16 10:42:06', NULL, '2025-12-16 10:37:27', '2025-12-16 10:42:06'),
(148, 'App\\Models\\User', 57, 'farmer-app', '9a73cd9756a7f0b5649173783741cca9b2723619c1cb4ad94fb9b4e12f85efc6', '[\"farmer\"]', '2025-12-16 10:47:54', NULL, '2025-12-16 10:45:53', '2025-12-16 10:47:54'),
(149, 'App\\Models\\User', 57, 'farmer-app', '679b6cfe107d8bbdd29ca650e4977fe4b8264daacf44a22af04724c910dee84c', '[\"farmer\"]', '2025-12-16 10:53:22', NULL, '2025-12-16 10:48:21', '2025-12-16 10:53:22'),
(150, 'App\\Models\\User', 39, 'data-operator-app', 'c47b4905b5cb169042ccb1173e078beeb2ad7bea2a322a5ea42c4b78407190a0', '[\"data_operator\"]', '2025-12-16 10:54:52', NULL, '2025-12-16 10:54:35', '2025-12-16 10:54:52'),
(151, 'App\\Models\\User', 20, 'farmer-app', 'c6d8df430a912c7d1d6e9566752b5564b1b5cc77823a5689ea0a30736b986f67', '[\"farmer\"]', '2025-12-16 10:55:45', NULL, '2025-12-16 10:55:45', '2025-12-16 10:55:45'),
(152, 'App\\Models\\User', 58, 'expert-app', '9b0c05b82fc06456b6b5dfa2df67ba37aec3043270f6c16797fb99ff8a3d5c7d', '[\"expert\"]', '2025-12-16 11:01:02', NULL, '2025-12-16 10:59:02', '2025-12-16 11:01:02'),
(153, 'App\\Models\\User', 59, 'expert-app', 'e5069eb35bf4d16135c897b03a65ef9a54322757ca02f0b394b0916fb8f80310', '[\"expert\"]', '2025-12-16 11:07:59', NULL, '2025-12-16 11:03:36', '2025-12-16 11:07:59'),
(154, 'App\\Models\\User', 60, 'expert-app', '102bc97a026955e46cae89c5fa986166c2d7a00220bd092e69c208dfd55e5e73', '[\"expert\"]', '2025-12-16 11:10:59', NULL, '2025-12-16 11:09:59', '2025-12-16 11:10:59'),
(155, 'App\\Models\\User', 37, 'farmer-app', 'b6c2731813a25d43a8932d79fa35224abf1d945408d2f5845b04d927b064864c', '[\"farmer\"]', '2025-12-16 15:24:16', NULL, '2025-12-16 12:28:43', '2025-12-16 15:24:16'),
(156, 'App\\Models\\User', 29, 'farmer-app', '49960dd5bf269e0b314d540725c6f44b4c26378cfc8f6393c50a688a4fd8b8ea', '[\"farmer\"]', '2025-12-17 06:31:38', NULL, '2025-12-16 14:53:22', '2025-12-17 06:31:38'),
(157, 'App\\Models\\User', 29, 'farmer-app', '67b76e105329253ffeea88cdf4f551e30a0722f30a0fc3dd4051c7d716ba312a', '[\"farmer\"]', '2025-12-17 04:24:33', NULL, '2025-12-17 04:24:09', '2025-12-17 04:24:33'),
(158, 'App\\Models\\User', 37, 'farmer-app', 'c9c28664bef603fa57cb73cc040b3153c7785b156e0f840f2ab058b7d19009af', '[\"farmer\"]', '2025-12-17 04:33:48', NULL, '2025-12-17 04:25:29', '2025-12-17 04:33:48'),
(159, 'App\\Models\\User', 61, 'farmer-app', 'dea1660fe60303493192da8cbd4b93e998b6c639e965ea7dcb266748a86e4e1e', '[\"farmer\"]', '2025-12-17 05:41:22', NULL, '2025-12-17 04:36:44', '2025-12-17 05:41:22'),
(160, 'App\\Models\\User', 62, 'expert-app', 'beb1025187e9d94f67fcf3392f59fcea87daf59835238d3e37c57bc28335a42d', '[\"expert\"]', '2025-12-17 04:51:54', NULL, '2025-12-17 04:50:53', '2025-12-17 04:51:54'),
(161, 'App\\Models\\User', 39, 'data-operator-app', 'b24189cbc9b43453f98f7151d05cb9afc03e27ddfcc9078bad679e883dee7428', '[\"data_operator\"]', '2025-12-17 05:11:27', NULL, '2025-12-17 04:52:24', '2025-12-17 05:11:27'),
(162, 'App\\Models\\User', 62, 'expert-app', 'c448b5b6b174de6ca84328565b1c2c42413f6a168cb49e1e85ceaa5372e14edd', '[\"expert\"]', '2025-12-17 05:12:36', NULL, '2025-12-17 05:12:35', '2025-12-17 05:12:36'),
(163, 'App\\Models\\User', 60, 'expert-app', 'f731a5779ade751f3c8555d9dea208133e8809b5bb4802481098193439cb5f1b', '[\"expert\"]', '2025-12-17 05:14:39', NULL, '2025-12-17 05:14:37', '2025-12-17 05:14:39'),
(164, 'App\\Models\\User', 15, 'farmer-app', 'fa262b7612234a608cf3af42757fb1b93d28ac8173d31a68df76eb30b62d6bc3', '[\"farmer\"]', NULL, NULL, '2025-12-17 05:16:03', '2025-12-17 05:16:03'),
(165, 'App\\Models\\User', 62, 'expert-app', '9920f62885607667e2f026218207e0ce0e548ee9489ff0cbea32f1425bdafde6', '[\"expert\"]', '2025-12-17 05:29:59', NULL, '2025-12-17 05:27:01', '2025-12-17 05:29:59'),
(166, 'App\\Models\\User', 60, 'expert-app', '5db19d4fabebbcebb017f7d9b6096d7ca05da64671da241e4d55beb276baa443', '[\"expert\"]', '2025-12-17 05:33:52', NULL, '2025-12-17 05:30:38', '2025-12-17 05:33:52'),
(167, 'App\\Models\\User', 60, 'expert-app', '671a268dc9deade2cb9f6bc6d9889bd8423048393bdbbe84215ba6016c0abc5f', '[\"expert\"]', '2025-12-17 05:34:17', NULL, '2025-12-17 05:34:16', '2025-12-17 05:34:17'),
(168, 'App\\Models\\User', 62, 'expert-app', '52fc1e8aae93dbc2f2f1c8f1ab7d123ba3acbb3de7b8d1f50ed038c39c1446b6', '[\"expert\"]', '2025-12-17 05:37:38', NULL, '2025-12-17 05:34:36', '2025-12-17 05:37:38'),
(169, 'App\\Models\\User', 60, 'expert-app', 'ddb21333593dcfb3a424ea3c4d71b69c2902abc26b47ed8c923540a9c597aecc', '[\"expert\"]', '2025-12-17 05:38:29', NULL, '2025-12-17 05:38:28', '2025-12-17 05:38:29'),
(170, 'App\\Models\\User', 62, 'expert-app', 'd98233947c350422f26ca60cee415e68dab715f084250b76fc982acb62f1f6e6', '[\"expert\"]', '2025-12-17 05:38:51', NULL, '2025-12-17 05:38:51', '2025-12-17 05:38:51'),
(171, 'App\\Models\\User', 61, 'farmer-app', '123f4b32ccce462628678bc58b07dcb05fbcfe0af22b95952fa8fda27c6f6318', '[\"farmer\"]', '2025-12-17 11:57:06', NULL, '2025-12-17 05:48:15', '2025-12-17 11:57:06'),
(172, 'App\\Models\\User', 66, 'customer-app', 'fed0908ed813733b970670a7798507c5bd3232c834199dcc88d26c8afb8a27cb', '[\"customer\"]', '2025-12-17 05:56:12', NULL, '2025-12-17 05:56:11', '2025-12-17 05:56:12'),
(173, 'App\\Models\\User', 39, 'data-operator-app', 'c1e61f9f87811f5f7f08e7b30bcb76513b9be026f1c7fabbe0b131610e2528b3', '[\"data_operator\"]', '2025-12-17 05:57:16', NULL, '2025-12-17 05:56:35', '2025-12-17 05:57:16'),
(174, 'App\\Models\\User', 62, 'expert-app', '60330d3f7a9572f67c9e39371c36ad62fe651d97eab6f853bff3de4f65ac2d54', '[\"expert\"]', '2025-12-17 05:57:45', NULL, '2025-12-17 05:57:43', '2025-12-17 05:57:45'),
(175, 'App\\Models\\User', 60, 'expert-app', '599adee64d0cef89ff6a8abc81d21c77b60bdd1754c9259af53c30800960700a', '[\"expert\"]', '2025-12-17 05:58:12', NULL, '2025-12-17 05:58:11', '2025-12-17 05:58:12'),
(176, 'App\\Models\\User', 61, 'farmer-app', 'd61a1c574a8bf4f322050177499f4f6b2a384dd9f628df972b8d7569739a7329', '[\"farmer\"]', '2026-01-08 01:06:28', NULL, '2025-12-17 11:58:16', '2026-01-08 01:06:28'),
(177, 'App\\Models\\User', 66, 'customer-app', '28b855ce9b974e1cececfe9a58531d4a08a9c6d27b553f56ea578541159346b6', '[\"customer\"]', '2025-12-17 06:03:01', NULL, '2025-12-17 05:59:00', '2025-12-17 06:03:01'),
(178, 'App\\Models\\User', 60, 'expert-app', 'f4ab713e1c505b6e82c9558dafe925ffc8af5ca7a374baeb7e2a5402db2f6571', '[\"expert\"]', NULL, NULL, '2025-12-17 06:03:57', '2025-12-17 06:03:57'),
(179, 'App\\Models\\User', 39, 'data-operator-app', '8af8b41c34fcd99cb8658787a5bc80f4b4eb86077e279dc1a820c0255def0532', '[\"data_operator\"]', '2025-12-17 06:05:20', NULL, '2025-12-17 06:04:18', '2025-12-17 06:05:20'),
(180, 'App\\Models\\User', 67, 'customer-app', '9e68b2ea37e1732d9ce4efe37398d73997fb54e77d61ea1e18660425547c633a', '[\"customer\"]', '2025-12-17 06:09:30', NULL, '2025-12-17 06:09:29', '2025-12-17 06:09:30'),
(181, 'App\\Models\\User', 39, 'data-operator-app', '0de381bb92f77e22158bd743836433e658cf6acad900010dbce81629533bcc40', '[\"data_operator\"]', '2025-12-17 06:10:12', NULL, '2025-12-17 06:09:54', '2025-12-17 06:10:12'),
(182, 'App\\Models\\User', 67, 'customer-app', 'f5699adaf8bb7948ceaeefc637062029be09b1a4eb62e0136e1f8d99b2c05219', '[\"customer\"]', '2025-12-17 06:16:53', NULL, '2025-12-17 06:10:35', '2025-12-17 06:16:53'),
(183, 'App\\Models\\User', 66, 'customer-app', 'cbf616865b2e535957049549005dee420782caa1c819d96d053a9a6b8169eb93', '[\"customer\"]', '2025-12-17 06:18:13', NULL, '2025-12-17 06:18:12', '2025-12-17 06:18:13'),
(184, 'App\\Models\\User', 67, 'customer-app', '9177ff8a2d200c005b6c75592c8a18ad638f31217b543966ffb6a48dd8cdea28', '[\"customer\"]', NULL, NULL, '2025-12-17 06:18:31', '2025-12-17 06:18:31'),
(185, 'App\\Models\\User', 39, 'data-operator-app', '20dde6c80c9b26fb902a9cfd1c544aa3d2c291fa4b2d949d105e6c8786240ec2', '[\"data_operator\"]', '2025-12-17 06:40:36', NULL, '2025-12-17 06:18:47', '2025-12-17 06:40:36'),
(186, 'App\\Models\\User', 61, 'farmer-app', '1cc5cef2aa794f5163a19cbcdcd04deb1d81697387de59d71bc90e07be6c4351', '[\"farmer\"]', '2025-12-17 13:52:46', NULL, '2025-12-17 12:29:55', '2025-12-17 13:52:46'),
(187, 'App\\Models\\User', 33, 'customer-app', '940480ee14f0b63cf5c8abcc65f1001e4affd26369b5bd367364ec82f71433dc', '[\"customer\"]', '2025-12-17 06:38:49', NULL, '2025-12-17 06:32:48', '2025-12-17 06:38:49'),
(188, 'App\\Models\\User', 39, 'data-operator-app', 'ecddac82b122ab392aada09864a4ef2ada7535bf67775839b9e468c92e7ee6a6', '[\"data_operator\"]', '2025-12-17 06:59:52', NULL, '2025-12-17 06:51:52', '2025-12-17 06:59:52'),
(189, 'App\\Models\\User', 68, 'customer-app', 'f75ba6b8c27f504547b69d4280be5cd1d23f7960bd6d31a35183908666f29a79', '[\"customer\"]', '2025-12-17 07:11:10', NULL, '2025-12-17 07:11:04', '2025-12-17 07:11:10'),
(190, 'App\\Models\\User', 39, 'data-operator-app', 'a44c512307c4af36bcce71f0b3d452bb06bb6a2fd8d14218bcfb48fb4132aa0d', '[\"data_operator\"]', '2025-12-17 07:17:56', NULL, '2025-12-17 07:11:37', '2025-12-17 07:17:56'),
(191, 'App\\Models\\User', 39, 'data-operator-app', 'd706f70900973d5ca48be9be1eb7cf246a7645a618ceee998ebbfaa62d1b70aa', '[\"data_operator\"]', '2025-12-17 08:22:12', NULL, '2025-12-17 07:19:26', '2025-12-17 08:22:12'),
(192, 'App\\Models\\User', 29, 'farmer-app', '69c032393d5d16335303405ed1dc13a63532375e5074414c12a13c5b8264a495', '[\"farmer\"]', '2025-12-17 07:24:49', NULL, '2025-12-17 07:23:48', '2025-12-17 07:24:49'),
(193, 'App\\Models\\User', 33, 'customer-app', '184dce55201b5b99822383d8849cbf982e71c34fc3f0eabf6affc46c0abb3baa', '[\"customer\"]', '2025-12-17 07:40:34', NULL, '2025-12-17 07:40:32', '2025-12-17 07:40:34'),
(194, 'App\\Models\\User', 62, 'expert-app', 'c28a082f692ae929a805d5d27e269693198fffe478973889fa0e482f70b527f4', '[\"expert\"]', '2025-12-17 07:42:49', NULL, '2025-12-17 07:41:26', '2025-12-17 07:42:49'),
(195, 'App\\Models\\User', 62, 'expert-app', '268b476713617fbdf7148e42e2b52c28d1bd55983a1ce4e9d0af22dd3bad7b66', '[\"expert\"]', '2025-12-17 07:44:18', NULL, '2025-12-17 07:44:16', '2025-12-17 07:44:18'),
(196, 'App\\Models\\User', 62, 'expert-app', '021dcb296c2cd6f212e240688ad51475c9422731f37fe87d0c5fba0150955ab9', '[\"expert\"]', '2025-12-17 14:26:43', NULL, '2025-12-17 13:53:52', '2025-12-17 14:26:43'),
(197, 'App\\Models\\User', 39, 'data-operator-app', '3d1498c248531cd4a3e525ce18c879753953b50a66e0ce3e843422826cd889c7', '[\"data_operator\"]', '2025-12-17 07:56:28', NULL, '2025-12-17 07:56:27', '2025-12-17 07:56:28'),
(198, 'App\\Models\\User', 39, 'data-operator-app', '896da02cf92c18ecaccc2f5b52199a4c499795b65c975effee1c9e16cc2832b3', '[\"data_operator\"]', '2025-12-17 08:23:13', NULL, '2025-12-17 08:23:10', '2025-12-17 08:23:13'),
(199, 'App\\Models\\User', 61, 'farmer-app', '219b74d84fd266327d3a3ebbce286271d5e4c37bf4c0f4a165dba787f6cbdebc', '[\"farmer\"]', '2025-12-17 15:17:47', NULL, '2025-12-17 14:27:27', '2025-12-17 15:17:47'),
(200, 'App\\Models\\User', 29, 'farmer-app', 'bcfce2578580e76c87f7354f75d38ea90cb122ab8496c34e081d747718813d59', '[\"farmer\"]', '2025-12-17 09:21:13', NULL, '2025-12-17 08:40:08', '2025-12-17 09:21:13'),
(201, 'App\\Models\\User', 61, 'farmer-app', '7a5a04d13081772f7da0be64400421454306e23828f8e4a62e19a0c49bb8d538', '[\"farmer\"]', '2025-12-17 15:43:39', NULL, '2025-12-17 15:22:02', '2025-12-17 15:43:39'),
(202, 'App\\Models\\User', 29, 'farmer-app', '7e9789f5e19bf79a45bf83463a61530d48a5f4a9a08cfc7999d5cc1e4e77a729', '[\"farmer\"]', '2025-12-17 15:52:54', NULL, '2025-12-17 15:44:07', '2025-12-17 15:52:54'),
(203, 'App\\Models\\User', 29, 'farmer-app', 'b33f097725086fcdf702e7f2f320725045bb6cb7c8d5b50773fe7eb5e58403fb', '[\"farmer\"]', '2025-12-17 15:52:46', NULL, '2025-12-17 15:50:46', '2025-12-17 15:52:46'),
(204, 'App\\Models\\User', 29, 'farmer-app', '867bad37484806bebdab7e34873f1b108eef222c71be63a292c3e4de1e415409', '[\"farmer\"]', '2025-12-30 09:20:27', NULL, '2025-12-30 09:16:19', '2025-12-30 09:20:27'),
(205, 'App\\Models\\User', 62, 'expert-app', '195c504491190c4e80498300605e729f5ea1936102a836858e83301969e0f33d', '[\"expert\"]', '2025-12-30 09:41:33', NULL, '2025-12-30 09:21:09', '2025-12-30 09:41:33'),
(206, 'App\\Models\\User', 29, 'farmer-app', '6077809fe9bb700da2633d4c913facb4367ad95b551bef4e534d1c14faee7bd0', '[\"farmer\"]', '2025-12-30 10:03:39', NULL, '2025-12-30 09:42:17', '2025-12-30 10:03:39'),
(207, 'App\\Models\\User', 29, 'farmer-app', 'b5038264a23d6fcfdcf09dec22fd6a3b7c6dd0142588f5abd9447fac6b0c4123', '[\"farmer\"]', '2025-12-30 10:58:19', NULL, '2025-12-30 10:04:06', '2025-12-30 10:58:19'),
(208, 'App\\Models\\User', 29, 'farmer-app', 'd77f9e858aabe8b1a0f53d236eceb8e158142cd6d7fe7bd6cbc6815708944875', '[\"farmer\"]', '2025-12-30 16:04:26', NULL, '2025-12-30 10:59:13', '2025-12-30 16:04:26'),
(209, 'App\\Models\\User', 29, 'farmer-app', '1b7c2de7accf64e4333754e0a18730a893b9c89baac29822377650bf1538ddbb', '[\"farmer\"]', '2025-12-31 17:52:22', NULL, '2025-12-30 16:04:52', '2025-12-31 17:52:22'),
(210, 'App\\Models\\User', 33, 'customer-app', 'f74bef97f3ff568789753bd5c0f1f73bb3c788e8852609304bdcaed4ae24fa14', '[\"customer\"]', '2025-12-31 17:54:26', NULL, '2025-12-31 17:52:34', '2025-12-31 17:54:26'),
(211, 'App\\Models\\User', 29, 'farmer-app', '690a1da580b001ed8a23f2aafe5964dc59f5b263f107b69cbb85d96811b3b670', '[\"farmer\"]', '2025-12-31 18:04:03', NULL, '2025-12-31 17:55:10', '2025-12-31 18:04:03'),
(212, 'App\\Models\\User', 33, 'customer-app', 'b9e465b1b7b66f9e6dbdcea7b322bb698d1a809ee6696e282f1f505e1096d90f', '[\"customer\"]', '2025-12-31 18:59:26', NULL, '2025-12-31 18:04:45', '2025-12-31 18:59:26'),
(213, 'App\\Models\\User', 29, 'farmer-app', '5533e01744a49f0638afff57387df98ee5c8f55f7ca3317b61a6a9ae9009299d', '[\"farmer\"]', '2025-12-31 19:02:42', NULL, '2025-12-31 19:00:34', '2025-12-31 19:02:42'),
(214, 'App\\Models\\User', 33, 'customer-app', '7a7f674ad045325c78077ece426fd4ff514226ea7118a71cd1b32d16175926a3', '[\"customer\"]', '2025-12-31 19:04:58', NULL, '2025-12-31 19:02:57', '2025-12-31 19:04:58'),
(215, 'App\\Models\\User', 33, 'customer-app', '12b7a2b8cb5400d87e8b92508f7b62c5d1a76b31591766ad6711df45ef208564', '[\"customer\"]', '2025-12-31 19:20:27', NULL, '2025-12-31 19:20:26', '2025-12-31 19:20:27'),
(216, 'App\\Models\\User', 29, 'farmer-app', '90a16edec974744504dc5024c26421296c858165dbf5b2ba6fe7ed065d15c494', '[\"farmer\"]', '2025-12-31 19:42:46', NULL, '2025-12-31 19:42:43', '2025-12-31 19:42:46'),
(217, 'App\\Models\\User', 29, 'farmer-app', '72d58e500d8c95b81e37afb8fa3f05013bb3a9b174c345b8aa3e0856b12f372c', '[\"farmer\"]', NULL, NULL, '2026-01-04 00:57:48', '2026-01-04 00:57:48'),
(218, 'App\\Models\\User', 29, 'farmer-app', 'bc21710405b924d7a893d65c91072d379acd10e5a2a08f531a602f6dfbdf619a', '[\"farmer\"]', NULL, NULL, '2026-01-04 00:57:56', '2026-01-04 00:57:56'),
(219, 'App\\Models\\User', 29, 'farmer-app', '7ac142090b4271c38b4f399baa0d066e5ea85378e1502da70f2a618b732c7cd4', '[\"farmer\"]', NULL, NULL, '2026-01-04 00:58:37', '2026-01-04 00:58:37'),
(220, 'App\\Models\\User', 29, 'farmer-app', '41f43227135e5e30210ab86158f6b1c9bcd94982892a7d3b8e425b571904ba00', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:02:28', '2026-01-04 01:02:28'),
(221, 'App\\Models\\User', 33, 'customer-app', '72b44187efae0795614957db331fc5b162f62184f128c2e6ad846acb7432058c', '[\"customer\"]', NULL, NULL, '2026-01-04 01:02:45', '2026-01-04 01:02:45'),
(222, 'App\\Models\\User', 33, 'customer-app', '07a62485330ab1a32a32b313cf09932feb0a3c2b9546f787d4b35e8a1558e0a0', '[\"customer\"]', NULL, NULL, '2026-01-04 01:02:50', '2026-01-04 01:02:50'),
(223, 'App\\Models\\User', 29, 'farmer-app', 'd0a5f3ebff829ab91d44316b308b00257d17b371733161c3ea0a548a3fbbc6b2', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:03:16', '2026-01-04 01:03:16'),
(224, 'App\\Models\\User', 29, 'farmer-app', '9d55446cae605db1f2c6d9482e7100979cc4820491aed5ba7ab740990894544d', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:07:52', '2026-01-04 01:07:52'),
(225, 'App\\Models\\User', 29, 'farmer-app', 'cc482d7b7cb47259f56a901f59c9a6012a8dbd71194e38304a22e53c061bf49a', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:17:15', '2026-01-04 01:17:15'),
(226, 'App\\Models\\User', 29, 'farmer-app', '976bd9c99a2d4e72348b18da5077d6333553d335683734edcb9904d23f0d7fe0', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:21:34', '2026-01-04 01:21:34'),
(227, 'App\\Models\\User', 29, 'farmer-app', '0df180a6fcafb8cae083bbdd5403246c2c6d30bd33705729e7ff2b92ea9b1236', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:24:20', '2026-01-04 01:24:20'),
(228, 'App\\Models\\User', 29, 'farmer-app', 'e5754be50279c3cdc0f59eb5c1c58634099ac29b06f741adcb38eb80154e950f', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:29:08', '2026-01-04 01:29:08'),
(229, 'App\\Models\\User', 29, 'farmer-app', 'e4ebc40879a70685780571952c864269f55471ae0be927c52d7d0ddf66b32375', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:32:44', '2026-01-04 01:32:44'),
(230, 'App\\Models\\User', 29, 'farmer-app', '17877a9b9b1825ecb0b5f2b1e19bc7d757a7bd7a4f4356c912b101aecb650ce2', '[\"farmer\"]', NULL, NULL, '2026-01-04 01:33:13', '2026-01-04 01:33:13'),
(231, 'App\\Models\\User', 29, 'farmer-app', '92bf3b7887c85d5a4ffc77c68e2bb5a1415c191cb57194f9c6a6649b8d00f8bb', '[\"farmer\"]', '2026-01-04 01:42:44', NULL, '2026-01-04 01:42:23', '2026-01-04 01:42:44'),
(232, 'App\\Models\\User', 33, 'customer-app', '1d41b0df3af577563c8b1b73178813a83b8b83c965547de600d04c14fda4c146', '[\"customer\"]', '2026-01-04 01:42:59', NULL, '2026-01-04 01:42:58', '2026-01-04 01:42:59'),
(233, 'App\\Models\\User', 29, 'farmer-app', '0956dd0d2a2efb720c24ead552ea558f8e674e657847feb2f657109202fd25ab', '[\"farmer\"]', '2026-01-04 02:46:18', NULL, '2026-01-04 01:43:36', '2026-01-04 02:46:18'),
(234, 'App\\Models\\User', 29, 'farmer-app', '3d4d1a24902e0b765c72b3f88e03e86fd1668a4f73f075b0df40521fb7879af8', '[\"farmer\"]', '2026-01-04 02:49:01', NULL, '2026-01-04 02:47:22', '2026-01-04 02:49:01'),
(235, 'App\\Models\\User', 33, 'customer-app', 'd75d93c694fc6a3ac7cc0b43c0cff0627a508c32a1f6e8f665348ec44bbe6842', '[\"customer\"]', '2026-01-04 02:55:03', NULL, '2026-01-04 02:49:22', '2026-01-04 02:55:03'),
(236, 'App\\Models\\User', 29, 'farmer-app', '002a879bbc40c03e96b65d5ec27d75714ca2394868ee46cf3e8f8cb82206ace7', '[\"farmer\"]', '2026-01-04 02:55:43', NULL, '2026-01-04 02:55:32', '2026-01-04 02:55:43'),
(237, 'App\\Models\\User', 33, 'customer-app', '89ed8e0693c84cf594c83722c6e42215d1435e3992e3df4f5315dbb09e15d7b2', '[\"customer\"]', '2026-01-04 02:58:47', NULL, '2026-01-04 02:56:00', '2026-01-04 02:58:47'),
(238, 'App\\Models\\User', 29, 'farmer-app', 'cf1404bb127a91888cb1412d31ace676972b416ee740818ec2020abc199d107a', '[\"farmer\"]', '2026-01-04 13:02:12', NULL, '2026-01-04 02:59:35', '2026-01-04 13:02:12'),
(239, 'App\\Models\\User', 61, 'farmer-app', '7c0f6ed53feec0d0daf4a7b3f1e6c341f3b498be1a3f4e1cefd1afb210b74429', '[\"farmer\"]', '2026-01-04 15:11:48', NULL, '2026-01-04 14:47:35', '2026-01-04 15:11:48'),
(240, 'App\\Models\\User', 29, 'farmer-app', 'e96d8cc1c0c8a9a185bed27fb96d16f09426913474ee516399ef112fa6b54f2d', '[\"farmer\"]', '2026-01-04 15:03:19', NULL, '2026-01-04 14:52:02', '2026-01-04 15:03:19'),
(241, 'App\\Models\\User', 29, 'farmer-app', 'bd99750f3497da130e0d70abf1e5640a1fc728f6b90db39cbf17ae9d1572d1ca', '[\"farmer\"]', '2026-01-04 15:07:08', NULL, '2026-01-04 15:04:07', '2026-01-04 15:07:08'),
(242, 'App\\Models\\User', 29, 'farmer-app', '440194b7fbf62732cac2969497fabab7b07316dc137446f76feb30d3265778c3', '[\"farmer\"]', '2026-01-04 15:08:57', NULL, '2026-01-04 15:08:55', '2026-01-04 15:08:57'),
(243, 'App\\Models\\User', 29, 'farmer-app', '50ee0c2d80a98bce25248abcdb92fa12e29bd271c6531091e911c791502ba708', '[\"farmer\"]', '2026-01-04 22:19:42', NULL, '2026-01-04 15:16:36', '2026-01-04 22:19:42'),
(244, 'App\\Models\\User', 29, 'farmer-app', 'fa3540acf057bf730651e3b0fdefac8039618ba0f98b2e9fb89a7d67c6fa1e11', '[\"farmer\"]', '2026-01-07 22:28:03', NULL, '2026-01-04 15:31:37', '2026-01-07 22:28:03'),
(245, 'App\\Models\\User', 29, 'farmer-app', 'fff10d480fdec41911cfa731d97d5b9939e58110d623be29949254365d849161', '[\"farmer\"]', '2026-01-05 20:17:29', NULL, '2026-01-04 22:48:43', '2026-01-05 20:17:29'),
(246, 'App\\Models\\User', 29, 'farmer-app', '1b8a987a6c09e835ce1c0a239c6f34b1ac3e6b78fd9a4585d002d8c32a858720', '[\"farmer\"]', '2026-01-05 00:59:13', NULL, '2026-01-05 00:47:04', '2026-01-05 00:59:13');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(247, 'App\\Models\\User', 29, 'farmer-app', '7bb1404ab0e1a114d1e546deed0a226d05feb18e5ad677f04edf54868021143a', '[\"farmer\"]', '2026-01-05 01:16:47', NULL, '2026-01-05 01:15:45', '2026-01-05 01:16:47'),
(248, 'App\\Models\\User', 29, 'farmer-app', 'b4969a57bc5a3ff800282c41775142f16c812c3ebd4fd5e8f815eba349297401', '[\"farmer\"]', '2026-01-05 02:16:18', NULL, '2026-01-05 01:30:27', '2026-01-05 02:16:18'),
(249, 'App\\Models\\User', 33, 'customer-app', '8c5eb8d0e56d68015ba50e5114b37531e677415dcc955ffa28dc35836e524407', '[\"customer\"]', '2026-01-05 02:18:03', NULL, '2026-01-05 02:16:53', '2026-01-05 02:18:03'),
(250, 'App\\Models\\User', 29, 'farmer-app', '955db4839fa6451f9b68cf100fb98fd2a3e27bb06c6ca6bc2a20fe6afc390ad4', '[\"farmer\"]', '2026-01-05 17:50:36', NULL, '2026-01-05 17:48:35', '2026-01-05 17:50:36'),
(251, 'App\\Models\\User', 29, 'farmer-app', 'f2ee1bf21ff9109e5d020a7edc6ce2cd1d673bc16db398d4f8e6877952edb585', '[\"farmer\"]', '2026-01-06 20:05:03', NULL, '2026-01-05 18:15:06', '2026-01-06 20:05:03'),
(252, 'App\\Models\\User', 29, 'farmer-app', '4b98fc37942e2aca6a7e919f2c7bf8b042ee7da447d2c1ff05be7769835168b1', '[\"farmer\"]', '2026-01-05 20:04:51', NULL, '2026-01-05 19:58:32', '2026-01-05 20:04:51'),
(253, 'App\\Models\\User', 29, 'farmer-app', '8ca265f6eb722213c08a386492f881383899e92982a949b8cfa8d23654036c21', '[\"farmer\"]', '2026-01-06 01:11:48', NULL, '2026-01-05 21:10:43', '2026-01-06 01:11:48'),
(254, 'App\\Models\\User', 29, 'farmer-app', 'c2b6eafdefbbcd18210f3f3c25a770f2e3115246378ad648c997a74969133be9', '[\"farmer\"]', '2026-01-05 23:56:40', NULL, '2026-01-05 23:50:52', '2026-01-05 23:56:40'),
(255, 'App\\Models\\User', 29, 'farmer-app', 'b68c7fc0e28f07474ea73da96d34af7d8a52e162e32ddb558d80fd1285837d4e', '[\"farmer\"]', '2026-01-07 23:40:58', NULL, '2026-01-06 01:03:07', '2026-01-07 23:40:58'),
(256, 'App\\Models\\User', 29, 'farmer-app', '22a32a771ea76714c9ebdec61797b93693226c2326a9f2be127843ef6f9518f0', '[\"farmer\"]', '2026-01-06 01:12:07', NULL, '2026-01-06 01:12:06', '2026-01-06 01:12:07'),
(257, 'App\\Models\\User', 29, 'farmer-app', '1f7df1c2c6803647699ce6673f1667cc9550c78aacd6de88c7880ff429dbfd3e', '[\"farmer\"]', '2026-01-06 19:25:03', NULL, '2026-01-06 01:12:57', '2026-01-06 19:25:03'),
(258, 'App\\Models\\User', 29, 'farmer-app', '9c938b7f048bf9087afc8f1e462214e6fbee0749885413bd7917796295bd8858', '[\"farmer\"]', '2026-01-06 02:42:16', NULL, '2026-01-06 02:42:00', '2026-01-06 02:42:16'),
(259, 'App\\Models\\User', 69, 'expert-app', '07733cca059b64ea74774e0b497aadb61033f4c932036003df5a64cd617eef26', '[\"expert\"]', NULL, NULL, '2026-01-06 19:36:01', '2026-01-06 19:36:01'),
(260, 'App\\Models\\User', 70, 'expert-app', '53f35e9a2ba3b423df5282d7053a8f77c3e8138fc08d92b28e0a3472ed061c1e', '[\"expert\"]', NULL, NULL, '2026-01-06 19:45:25', '2026-01-06 19:45:25'),
(261, 'App\\Models\\User', 71, 'expert-app', '5a7d8ee326ab94338c2b4c173e41b254c73ea5239af4fab74c2f8274b074cc85', '[\"expert\"]', '2026-01-07 22:28:18', NULL, '2026-01-06 19:52:18', '2026-01-07 22:28:18'),
(262, 'App\\Models\\User', 71, 'expert-app', '76952650a27db13629b4ffc1bf89140bb23b04f02e63f255d17eb5ad6dafe823', '[\"expert\"]', '2026-01-06 20:13:21', NULL, '2026-01-06 20:05:08', '2026-01-06 20:13:21'),
(263, 'App\\Models\\User', 39, 'data-operator-app', 'd952520760e8823e5f0508c8c5a40085d003976c47b9e3c14a4ebb9554d29bc8', '[\"data_operator\"]', '2026-01-06 20:15:32', NULL, '2026-01-06 20:14:19', '2026-01-06 20:15:32'),
(264, 'App\\Models\\User', 71, 'expert-app', '5df0fc17e8bb5a0e51e106dd41a4c5535183cbd08d0c55de2a42df17912fdff7', '[\"expert\"]', '2026-01-06 20:26:18', NULL, '2026-01-06 20:16:06', '2026-01-06 20:26:18'),
(265, 'App\\Models\\User', 71, 'expert-app', '428569c40961fb0a48c9efa75db6bfadbf3057599466e6c9ef576035ee0ef123', '[\"expert\"]', '2026-01-06 22:05:32', NULL, '2026-01-06 20:27:22', '2026-01-06 22:05:32'),
(266, 'App\\Models\\User', 29, 'farmer-app', 'd30a5af6f30a0db2eb6d3088b85fd358b7923f6eed41dbc7b820843a4c7751f9', '[\"farmer\"]', '2026-01-11 07:42:11', NULL, '2026-01-06 22:06:02', '2026-01-11 07:42:11'),
(267, 'App\\Models\\User', 71, 'expert-app', '7bef5658e0d341ccf7eb52161bc4512307b15108e76adb3c946b0a9a8ee6d341', '[\"expert\"]', '2026-01-06 23:32:40', NULL, '2026-01-06 22:25:34', '2026-01-06 23:32:40'),
(268, 'App\\Models\\User', 71, 'expert-app', '05998d8cc2a8630fc598c96a16644cec1f90e3dfb28653ccdd8886d02c3a0cf7', '[\"expert\"]', '2026-01-07 00:52:22', NULL, '2026-01-06 23:33:31', '2026-01-07 00:52:22'),
(269, 'App\\Models\\User', 71, 'expert-app', 'd14577182bd711259ebf2fcb673d13df391203b6ac11044ca8d28e58c6cc1f1a', '[\"expert\"]', '2026-01-07 22:31:01', NULL, '2026-01-07 00:57:50', '2026-01-07 22:31:01'),
(270, 'App\\Models\\User', 29, 'farmer-app', 'bd201ff3f7d3e92b27d84001c7f0431d9f7df4d661e7af9c62606ee82fd0856e', '[\"farmer\"]', '2026-01-07 22:06:01', NULL, '2026-01-07 21:34:00', '2026-01-07 22:06:01'),
(271, 'App\\Models\\User', 29, 'farmer-app', '9d23458c2e6cf74a29930379c043053a60e559e4900252c886bc31c12efb45b0', '[\"farmer\"]', NULL, NULL, '2026-01-08 01:06:57', '2026-01-08 01:06:57'),
(272, 'App\\Models\\User', 29, 'farmer-app', 'dfada39616900649508e51ff8b9d526f947fd65ab131b35b74c2a4418e2c99fd', '[\"farmer\"]', NULL, NULL, '2026-01-08 01:07:26', '2026-01-08 01:07:26'),
(273, 'App\\Models\\User', 29, 'farmer-app', '5a893a2b308f6de00a929de1ebed1254fb5aaf68a8e9e8bfa2482319b4f66b0e', '[\"farmer\"]', NULL, NULL, '2026-01-08 01:12:15', '2026-01-08 01:12:15'),
(274, 'App\\Models\\User', 29, 'farmer-app', '417a4df0c45b2feb27df8f9a7ab346abfa53b81d1ab7ae4172f87a9491fd5fd7', '[\"farmer\"]', '2026-01-08 01:35:42', NULL, '2026-01-08 01:14:42', '2026-01-08 01:35:42'),
(275, 'App\\Models\\User', 29, 'farmer-app', '20078e325206d34191d9fa94297de95d48dee807840a5cc65ce3df66e5d5e3ec', '[\"farmer\"]', '2026-01-11 07:13:24', NULL, '2026-01-11 07:02:10', '2026-01-11 07:13:24'),
(276, 'App\\Models\\User', 71, 'expert-app', '20149fd78cd02349743256588bac7b44701626f555f395eade111ed5f759e569', '[\"expert\"]', '2026-01-11 07:15:59', NULL, '2026-01-11 07:13:58', '2026-01-11 07:15:59'),
(277, 'App\\Models\\User', 29, 'farmer-app', 'd9fd67577648088a5791314823195e5ba389adb886e2aa6769df9e10f9f92f32', '[\"farmer\"]', '2026-01-11 09:16:11', NULL, '2026-01-11 07:16:42', '2026-01-11 09:16:11'),
(278, 'App\\Models\\User', 39, 'data-operator-app', 'c3b99015d92bfd325bb9623322d3229c76a2fb52386e8159d59188d45c625959', '[\"data_operator\"]', '2026-01-11 08:00:53', NULL, '2026-01-11 07:42:14', '2026-01-11 08:00:53'),
(279, 'App\\Models\\User', 39, 'data-operator-app', '3d67536a0e71799678dcd0ccfccb889428e1602079c9451b228343ceb79d0dd8', '[\"data_operator\"]', '2026-01-11 08:03:18', NULL, '2026-01-11 07:45:30', '2026-01-11 08:03:18'),
(280, 'App\\Models\\User', 29, 'farmer-app', '55e5878538924b747f2cf91a526554d96b2d704c283c8b019ca1d4b06a65ee9e', '[\"farmer\"]', '2026-01-11 08:36:56', NULL, '2026-01-11 07:52:24', '2026-01-11 08:36:56'),
(281, 'App\\Models\\User', 39, 'data-operator-app', '4cc7130a0fb9df6277d2220db0e276d7bbe29c28dfc01308a50486d2d377ef01', '[\"data_operator\"]', '2026-01-11 08:04:01', NULL, '2026-01-11 08:04:00', '2026-01-11 08:04:01'),
(282, 'App\\Models\\User', 39, 'data-operator-app', '27c3cba673ab13029005da52d0f5ad9b8f0da704abfd9403f0ae992e815800c1', '[\"data_operator\"]', '2026-01-11 08:08:32', NULL, '2026-01-11 08:07:27', '2026-01-11 08:08:32'),
(283, 'App\\Models\\User', 39, 'data-operator-app', '677eff03f4a0fad385ffb83ebe9c58d44a4be9302d51370a09f6d9fb4c7e013e', '[\"data_operator\"]', '2026-01-11 08:10:45', NULL, '2026-01-11 08:08:44', '2026-01-11 08:10:45'),
(284, 'App\\Models\\User', 39, 'data-operator-app', '3a1f543dd5da1cc219a1ce160e1e79937be60440c2914872d8dcf14f008a5b75', '[\"data_operator\"]', '2026-01-11 08:14:19', NULL, '2026-01-11 08:11:01', '2026-01-11 08:14:19'),
(285, 'App\\Models\\User', 39, 'data-operator-app', 'ce04f56691493fff3c1050b8ee6156f9e55a48308a988bc286a625ee2ce902b9', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:18:03', '2026-01-11 08:18:03'),
(286, 'App\\Models\\User', 39, 'data-operator-app', '37d41907265f1670016023fb89245cac1c22d6549e0416e6a962bf45e1762835', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:18:58', '2026-01-11 08:18:58'),
(287, 'App\\Models\\User', 39, 'data-operator-app', '02785df344c29fc30b7b012d28160b9d1b67aa605784c689e1ef1931b45d8795', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:19:29', '2026-01-11 08:19:29'),
(288, 'App\\Models\\User', 29, 'farmer-app', '281d51f2d6bb2fe71d0842bde60a65e99374b7750c687572feef5a647b7e31bd', '[\"farmer\"]', '2026-01-11 08:20:12', NULL, '2026-01-11 08:20:09', '2026-01-11 08:20:12'),
(289, 'App\\Models\\User', 39, 'data-operator-app', 'ab6a9aa56c1e7c7939bfd5429729e1760680f6c17ea7e90394e7c140134b1006', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:20:45', '2026-01-11 08:20:45'),
(290, 'App\\Models\\User', 39, 'data-operator-app', 'abf6c55333dca270618ab1bf5a5d446c647bda895bf7a5107242ccc07cc79e76', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:22:12', '2026-01-11 08:22:12'),
(291, 'App\\Models\\User', 39, 'data-operator-app', '31aef21c8ca0cc7cfc2cd07c10036f588599567c227072c86d7a50ca70ca6065', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:23:11', '2026-01-11 08:23:11'),
(292, 'App\\Models\\User', 39, 'data-operator-app', '261c12dccc627263076ff02d2321a2e4b79813ae390099474e171d22dbd496d2', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:24:15', '2026-01-11 08:24:15'),
(293, 'App\\Models\\User', 39, 'data-operator-app', '8c59c53b99c4b3dbe679ffe8b7c571fddc2b5eef8a4b42b7cc165a34843a8264', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:24:34', '2026-01-11 08:24:34'),
(294, 'App\\Models\\User', 39, 'data-operator-app', 'c571dbb1e004e6623d5f217f4063e66e78060394aa085a853cf55c1d69db5e0f', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:27:18', '2026-01-11 08:27:18'),
(295, 'App\\Models\\User', 39, 'data-operator-app', 'dfee6d99990e73e7c994a87b4c8f5edcd1bd853d99a8a2cebd5c829035608e5c', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:30:37', '2026-01-11 08:30:37'),
(296, 'App\\Models\\User', 39, 'data-operator-app', '7182464a6e9d6ca514e81f9d8559403f2626e82eff981855e263e52fe558dea5', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:32:41', '2026-01-11 08:32:41'),
(297, 'App\\Models\\User', 39, 'data-operator-app', 'a54575eed75c87dde3d19d6247c3b66fea4f5acb8829fe5636647a0e4aec4f29', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:32:58', '2026-01-11 08:32:58'),
(298, 'App\\Models\\User', 39, 'data-operator-app', '106a9c5c38a3a6e7e94ec9efbdbadd289e3c291ff55a52624f64db513e2137c1', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:34:03', '2026-01-11 08:34:03'),
(299, 'App\\Models\\User', 39, 'data-operator-app', '327d41464e74e48bb3d2ab8085b2371815a696072c58687f97d92513689f2206', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:41:27', '2026-01-11 08:41:27'),
(300, 'App\\Models\\User', 39, 'data-operator-app', 'aad6ce8014060da6179b9a57d9df7e317fd6433b76ce337d45a8fbdf3bb0ed82', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:45:48', '2026-01-11 08:45:48'),
(301, 'App\\Models\\User', 39, 'data-operator-app', 'a53e8bdf8f0c931b7bfd73fd1d09f96feb72509471ad010b21babce2c5c64d85', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:48:10', '2026-01-11 08:48:10'),
(302, 'App\\Models\\User', 39, 'data-operator-app', 'c87c49fe3a2edff755e94208da1fdc96e4a6812d8d9019b50d5f7386d4825e94', '[\"data_operator\"]', NULL, NULL, '2026-01-11 08:50:08', '2026-01-11 08:50:08'),
(303, 'App\\Models\\User', 39, 'data-operator-app', '38c0c91f400de7aab8d197d1b09a1873b0e139d13b468ab88e5e6782b28d3a3e', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:05:19', '2026-01-11 09:05:19'),
(304, 'App\\Models\\User', 39, 'data-operator-app', '85ef3fc2f109038b6f6d088f5f401578465ec64fb8b37d762348c8cedacfd7e2', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:05:26', '2026-01-11 09:05:26'),
(305, 'App\\Models\\User', 29, 'farmer-app', '38207868c1f98e4d78919cf6ab8393de5d5c11bd9746a6b2b289ba27872515da', '[\"farmer\"]', NULL, NULL, '2026-01-11 09:06:11', '2026-01-11 09:06:11'),
(306, 'App\\Models\\User', 29, 'farmer-app', '1eac99902a51cae248721430bf42654c6926671d63d1f1a183238b9e65c5a342', '[\"farmer\"]', NULL, NULL, '2026-01-11 09:06:32', '2026-01-11 09:06:32'),
(307, 'App\\Models\\User', 39, 'data-operator-app', 'b7d92cf8ebd6bdf8f25d43617a102cb9f11dccc0624ef36bee39bd895a274f50', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:09:48', '2026-01-11 09:09:48'),
(308, 'App\\Models\\User', 71, 'expert-app', '8721a2cb9083d35bba60a83cf08c208258d1edb3b1d74224509c6922335761e1', '[\"expert\"]', '2026-01-11 09:43:37', NULL, '2026-01-11 09:17:10', '2026-01-11 09:43:37'),
(309, 'App\\Models\\User', 39, 'data-operator-app', 'ec5dc22455e1edf957db881819bd8ba0fb61c14f1485e8914044c9f4539c84aa', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:23:03', '2026-01-11 09:23:03'),
(310, 'App\\Models\\User', 29, 'farmer-app', '80cff67f6cd7988f168a263824ce722dd4615402f87c106b8113113e2dde1806', '[\"farmer\"]', '2026-01-11 09:24:18', NULL, '2026-01-11 09:23:56', '2026-01-11 09:24:18'),
(311, 'App\\Models\\User', 39, 'data-operator-app', '9a25280efbeb56ec2138e3dab7130dd74144b434231031d17700921420820710', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:24:38', '2026-01-11 09:24:38'),
(312, 'App\\Models\\User', 39, 'data-operator-app', '86a75aa7de8194c3d6c6d62186e4735ea7a0363078b651a6fc3eee08b7d85034', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:24:59', '2026-01-11 09:24:59'),
(313, 'App\\Models\\User', 39, 'data-operator-app', '1e05dd20bece8a0aba62de320562a792f27db1b7df91783dd206c236879e17fe', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:25:41', '2026-01-11 09:25:41'),
(314, 'App\\Models\\User', 39, 'data-operator-app', '75f8087dbb56e9725b28af862136b1394fc3faf83c213719c37e95fe3c39dd09', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:32:48', '2026-01-11 09:32:48'),
(315, 'App\\Models\\User', 39, 'data-operator-app', '05f325828eedd5a6813be2062e0d38eb38abd4f070cfa3a48ebcf35dfe61670e', '[\"data_operator\"]', NULL, NULL, '2026-01-11 09:34:19', '2026-01-11 09:34:19'),
(316, 'App\\Models\\User', 39, 'data-operator-app', '408c6db9b6735010a3da5c708186f0a1afdfacf56fb4f970b0dc74e302100690', '[\"data_operator\"]', '2026-01-11 09:37:42', NULL, '2026-01-11 09:37:41', '2026-01-11 09:37:42'),
(317, 'App\\Models\\User', 29, 'farmer-app', '860a7b44c0ec140f397e469d5bc2e639ef5dfee2dd83251682be630ac7238acf', '[\"farmer\"]', '2026-01-11 09:38:31', NULL, '2026-01-11 09:38:28', '2026-01-11 09:38:31'),
(318, 'App\\Models\\User', 39, 'data-operator-app', '118df106e347181b5a6c1e685fe6cc01de7bda5dacec128c0f5221c63400217b', '[\"data_operator\"]', '2026-01-11 09:40:23', NULL, '2026-01-11 09:38:54', '2026-01-11 09:40:23'),
(319, 'App\\Models\\User', 29, 'farmer-app', '7792abaf0fd4982e29159784514879a989c8c23cb6ca265ae7f050a95f855c18', '[\"farmer\"]', '2026-01-11 09:41:14', NULL, '2026-01-11 09:40:48', '2026-01-11 09:41:14'),
(320, 'App\\Models\\User', 39, 'data-operator-app', '3fb21316b635204ed6854b06bbb9feea5921fcf62732ddd346b09ea59fe4152c', '[\"data_operator\"]', '2026-01-11 11:59:35', NULL, '2026-01-11 09:41:32', '2026-01-11 11:59:35'),
(321, 'App\\Models\\User', 29, 'farmer-app', 'ec654d49d3f25a40bc58a676e902b27c236a27f6cf516fab7b00ae2f4db32e0a', '[\"farmer\"]', '2026-01-11 09:44:20', NULL, '2026-01-11 09:44:19', '2026-01-11 09:44:20'),
(322, 'App\\Models\\User', 33, 'customer-app', '534b732c16ecb425fc6d0e3df1dfeb2d37dc90951a0d777cd7032b64a5d69db1', '[\"customer\"]', '2026-01-11 10:53:41', NULL, '2026-01-11 09:45:34', '2026-01-11 10:53:41'),
(323, 'App\\Models\\User', 29, 'farmer-app', 'bb0828e7ab39e896ce9bbb66304eedfebfdc346861fa1a3e1e836d1a79f04d2d', '[\"farmer\"]', '2026-01-11 11:02:06', NULL, '2026-01-11 10:54:02', '2026-01-11 11:02:06'),
(324, 'App\\Models\\User', 29, 'farmer-app', 'fcc7770063657c3b6bb853f3c35399a9498c0ef74fbf95ad700917aecc173fdc', '[\"farmer\"]', '2026-01-11 11:59:15', NULL, '2026-01-11 11:02:58', '2026-01-11 11:59:15'),
(325, 'App\\Models\\User', 29, 'farmer-app', 'a6ecd82a35ae42273f2d591833e64008aaed0ad2e76525e9d41bd8841228cda7', '[\"farmer\"]', '2026-01-11 11:59:19', NULL, '2026-01-11 11:31:47', '2026-01-11 11:59:19');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_type` enum('general','marketplace','question','advice','expert_advice') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `marketplace_listing_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `likes_count` int(11) DEFAULT 0,
  `comments_count` int(11) DEFAULT 0,
  `views_count` int(11) DEFAULT 0,
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_reported` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `author_id`, `content`, `post_type`, `marketplace_listing_id`, `images`, `tags`, `location`, `likes_count`, `comments_count`, `views_count`, `is_pinned`, `is_reported`, `is_deleted`, `created_at`, `updated_at`) VALUES
(2, 61, '১০ টাকার বীজ থেকে সাফল্য, বিষমুক্ত বাঙ্গিতে আবদুস সাত্তারের ঘুরে দাঁড়ানো', 'general', NULL, '[\"blob:http:\\/\\/localhost:5173\\/af0892de-7606-4386-bc8e-93e0e37600ed\"]', NULL, NULL, 0, 0, 0, 0, 0, 1, '2025-12-17 05:00:41', '2025-12-17 13:47:18'),
(3, 61, '১০ টাকার বীজ থেকে সাফল্য, বিষমুক্ত বাঙ্গিতে আবদুস সাত্তারের ঘুরে দাঁড়ানো', 'general', NULL, '[\"blob:http:\\/\\/localhost:5173\\/652f07a1-f6bb-4395-bc23-3314bfb0a395\"]', NULL, NULL, 0, 0, 0, 0, 0, 1, '2025-12-17 05:01:33', '2025-12-17 13:47:23'),
(4, 61, 'ড্রাগন ফল বিক্রি করে কারও আয় ১০ লাখ, কারও ১৫ লাখ টাকা', 'general', NULL, '[\"blob:http:\\/\\/localhost:5173\\/0d9d2e67-3933-478c-956a-1dd6671f06ad\"]', NULL, NULL, 1, 0, 0, 0, 0, 1, '2025-12-17 05:03:28', '2025-12-17 13:47:28'),
(5, 61, 'বাজারে এসেছে নতুন আলু, দাম কত??\n\nশুরু হয়েছে আলুর নতুন মৌসুম। নভেম্বর মাসের শেষ দিকেই কৃষকেরা জমি থেকে নতুন আলু তোলা শুরু করেছেন। সেই আলু সরাসরি চলে আসছে রাজধানী ঢাকাসহ দেশের বিভিন্ন এলাকার খুচরা বাজারে। নতুন আলুর চাহিদা বেশি থাকে; এ জন্য দামও পুরোনো আলুর চেয়ে বেশি হয়।\n\nআজ মঙ্গলবার রাজধানীর বাজার ঘুরে দেখা গেছে, নতুন আলুর দাম এখন কেজিপ্রতি ৫০-৬০ টাকা। দুই সপ্তাহ আগে যখন প্রথম বাজারে এসেছিল নতুন আলু, তখন ১২০-১৫০ টাকায় বিক্রি হয়েছে।\n\nআলু পচনশীল পণ্য। তবে নতুন অবস্থায় মাস দুয়েক এটি ভালো থাকে। এরপরে আলু সংরক্ষণের জন্য হিমাগারে রাখতে হয়। সাধারণত জমি থেকে নতুন মৌসুমের আলু উত্তোলন শুরু হয় নভেম্বরের শেষ বা ডিসেম্বরের শুরু থেকে। মার্চ-এপ্রিল মাস পর্যন্ত বাজারে এসব নতুন আলু কিনতে পাওয়া যায়। পাশাপাশি পুরোনো আলুও বিক্রি হয়।', 'general', NULL, '[]', NULL, NULL, 0, 0, 0, 0, 0, 1, '2025-12-17 05:19:55', '2025-12-17 11:21:03'),
(6, 61, 'শুরু হয়েছে আলুর নতুন মৌসুম। নভেম্বর মাসের শেষ দিকেই কৃষকেরা জমি থেকে নতুন আলু তোলা শুরু করেছেন। সেই আলু সরাসরি চলে আসছে রাজধানী ঢাকাসহ দেশের বিভিন্ন এলাকার খুচরা বাজারে। নতুন আলুর চাহিদা বেশি থাকে; এ জন্য দামও পুরোনো আলুর চেয়ে বেশি হয়।\n\nআজ মঙ্গলবার রাজধানীর বাজার ঘুরে দেখা গেছে, নতুন আলুর দাম এখন কেজিপ্রতি ৫০-৬০ টাকা। দুই সপ্তাহ আগে যখন প্রথম বাজারে এসেছিল নতুন আলু, তখন ১২০-১৫০ টাকায় বিক্রি হয়েছে।\n\nআলু পচনশীল পণ্য। তবে নতুন অবস্থায় মাস দুয়েক এটি ভালো থাকে। এরপরে আলু সংরক্ষণের জন্য হিমাগারে রাখতে হয়। সাধারণত জমি থেকে নতুন মৌসুমের আলু উত্তোলন শুরু হয় নভেম্বরের শেষ বা ডিসেম্বরের শুরু থেকে। মার্চ-এপ্রিল মাস পর্যন্ত বাজারে এসব নতুন আলু কিনতে পাওয়া যায়। পাশাপাশি পুরোনো আলুও বিক্রি হয়।', 'general', NULL, '[]', NULL, NULL, 0, 0, 0, 0, 0, 1, '2025-12-17 05:20:36', '2025-12-17 11:20:59'),
(7, 61, 'শুরু হয়েছে আলুর নতুন মৌসুম। নভেম্বর মাসের শেষ দিকেই কৃষকেরা জমি থেকে নতুন আলু তোলা শুরু করেছেন। সেই আলু সরাসরি চলে আসছে রাজধানী ঢাকাসহ দেশের বিভিন্ন এলাকার খুচরা বাজারে। নতুন আলুর চাহিদা বেশি থাকে; এ জন্য দামও পুরোনো আলুর চেয়ে বেশি হয়।\n\nআজ মঙ্গলবার রাজধানীর বাজার ঘুরে দেখা গেছে, নতুন আলুর দাম এখন কেজিপ্রতি ৫০-৬০ টাকা। দুই সপ্তাহ আগে যখন প্রথম বাজারে এসেছিল নতুন আলু, তখন ১২০-১৫০ টাকায় বিক্রি হয়েছে।\n\nআলু পচনশীল পণ্য। তবে নতুন অবস্থায় মাস দুয়েক এটি ভালো থাকে। এরপরে আলু সংরক্ষণের জন্য হিমাগারে রাখতে হয়। সাধারণত জমি থেকে নতুন মৌসুমের আলু উত্তোলন শুরু হয় নভেম্বরের শেষ বা ডিসেম্বরের শুরু থেকে। মার্চ-এপ্রিল মাস পর্যন্ত বাজারে এসব নতুন আলু কিনতে পাওয়া যায়। পাশাপাশি পুরোনো আলুও বিক্রি হয়।', 'general', NULL, '[]', NULL, NULL, 0, 0, 0, 0, 0, 1, '2025-12-17 05:21:22', '2025-12-17 11:24:32'),
(8, 61, 'পুরোনো আলুর দাম বাড়েনি\nকৃষিপণ্যের ক্ষেত্রে আরেকটি প্রবণতা হলো, মৌসুমের শেষ দিকে এসে সবজির দাম বাড়ে। বাজারের এ স্বাভাবিক প্রবণতা এ বছর আলুর ক্ষেত্রে খাটেনি। রাজধানীর বাজারগুলোতে এখন প্রতি কেজি পুরোনো আলু বিক্রি হচ্ছে ২০-২৫ টাকায়। আর বিভিন্ন উৎপাদন এলাকায় ১৫ টাকা কেজি দরেও পুরোনো আলু বিক্রি হচ্ছে।\n\nসরকারি সংস্থা ট্রেডিং করপোরেশন অব বাংলাদেশের (টিসিবি) তথ্য অনুসারে, ২০২৪ সালের এই সময়ে বাজারে প্রতি কেজি আলু বিক্রি হয়েছে ৬০ থেকে ৬৫ টাকায়। অর্থাৎ এক বছরের ব্যবধানে খুচরা পর্যায়ে আলুর দাম দুই-তৃতীয়াংশ বা তিন গুণের বেশি কম রয়েছে। পুরোনো আলু কম থাকার কারণ, গত বছর চাহিদার তুলনায় বেশি পরিমাণে আলু চাষ হয়েছিল।\n\nকৃষি সম্প্রসারণ অধিদপ্তরের মতে, দেশে বছরে আলুর চাহিদা প্রায় ৯০ লাখ টন। গত অর্থবছরে মোট ১ কোটি ২৯ লাখ টন আলু উৎপাদিত হয়। আর ২০২৩-২৪ অর্থবছরে আলু উৎপাদিত হয়েছিল ১ কোটি ৬ লাখ টন। অর্থাৎ গত বছর আলুর উৎপাদন বেড়েছিল। মূলত গত দু-তিন বছরে বাজারে ভালো দাম পাওয়ায় আলু চাষ করে লাভবান হয়েছিলেন কৃষকেরা। এতে তাঁরা গত বছরে আলু চাষ বাড়িয়ে দেন। কিন্তু চাহিদার তুলনায় উৎপাদন বেশি হওয়ায় দাম পড়ে যায়। তবে এ বছর মৌসুম শেষে আলুর দাম কেমন থাকবে তা উৎপাদনের পুরো চিত্র পাওয়া গেলে ধারণা পাওয়া যাবে।', 'general', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/posts\\/1aa69135-bb16-4da6-b573-57f6a9538ef8.avif\"]', NULL, NULL, 1, 3, 0, 0, 0, 1, '2025-12-17 05:34:24', '2025-12-17 11:48:36'),
(9, 61, 'পুরোনো আলুর দাম বাড়েনি\nকৃষিপণ্যের ক্ষেত্রে আরেকটি প্রবণতা হলো, মৌসুমের শেষ দিকে এসে সবজির দাম বাড়ে। বাজারের এ স্বাভাবিক প্রবণতা এ বছর আলুর ক্ষেত্রে খাটেনি। রাজধানীর বাজারগুলোতে এখন প্রতি কেজি পুরোনো আলু বিক্রি হচ্ছে ২০-২৫ টাকায়। আর বিভিন্ন উৎপাদন এলাকায় ১৫ টাকা কেজি দরেও পুরোনো আলু বিক্রি হচ্ছে।\n\nসরকারি সংস্থা ট্রেডিং করপোরেশন অব বাংলাদেশের (টিসিবি) তথ্য অনুসারে, ২০২৪ সালের এই সময়ে বাজারে প্রতি কেজি আলু বিক্রি হয়েছে ৬০ থেকে ৬৫ টাকায়। অর্থাৎ এক বছরের ব্যবধানে খুচরা পর্যায়ে আলুর দাম দুই-তৃতীয়াংশ বা তিন গুণের বেশি কম রয়েছে। পুরোনো আলু কম থাকার কারণ, গত বছর চাহিদার তুলনায় বেশি পরিমাণে আলু চাষ হয়েছিল।\n\nকৃষি সম্প্রসারণ অধিদপ্তরের মতে, দেশে বছরে আলুর চাহিদা প্রায় ৯০ লাখ টন। গত অর্থবছরে মোট ১ কোটি ২৯ লাখ টন আলু উৎপাদিত হয়। আর ২০২৩-২৪ অর্থবছরে আলু উৎপাদিত হয়েছিল ১ কোটি ৬ লাখ টন। অর্থাৎ গত বছর আলুর উৎপাদন বেড়েছিল। মূলত গত দু-তিন বছরে বাজারে ভালো দাম পাওয়ায় আলু চাষ করে লাভবান হয়েছিলেন কৃষকেরা। এতে তাঁরা গত বছরে আলু চাষ বাড়িয়ে দেন। কিন্তু চাহিদার তুলনায় উৎপাদন বেশি হওয়ায় দাম পড়ে যায়। তবে এ বছর মৌসুম শেষে আলুর দাম কেমন থাকবে তা উৎপাদনের পুরো চিত্র পাওয়া গেলে ধারণা পাওয়া যাবে।', 'general', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/posts\\/64fde1e7-abef-4f41-b2a2-6e7629f74581.avif\"]', NULL, NULL, 3, 3, 0, 0, 0, 0, '2025-12-17 05:49:15', '2025-12-17 15:52:28'),
(10, 61, 'শ্রীলঙ্কার দুর্যোগে বাংলাদেশের ‘আলু কূটনীতির’ সুযোগ\nঢাকায় যখন নতুন আলুর কেজি ৬০ টাকা আর হিমাগারের আলু ৩০ টাকার কমে বিক্রি হচ্ছে, তখন শ্রীলঙ্কায় এক কেজি আলু ৫০০ রুপিতেও মিলছে না। কেন?\nগত ২৮ নভেম্বর শ্রীলঙ্কার স্থলভাগে আঘাত হানে ঘূর্ণিঝড় দিতওয়া। এরপর তিন দিন ধরে ভারী বৃষ্টি এবং ঝোড়ো বাতাসে দেশটির ২৫টি জেলা প্লাবিত হয়েছে। শ্রীলঙ্কার বিভিন্ন স্থানে বিদ্যুৎ–বিভ্রাট এবং যোগাযোগব্যবস্থায় মারাত্মক ব্যাঘাত দেখা দিয়েছে। বহু বছর দেশটির মানুষ এমন ধ্বংসযজ্ঞ দেখেনি। এক দশকের মধ্যে সবচেয়ে ভয়াবহ বন্যা ও ভূমিধসে অন্তত ৪১০ জনের মৃত্যু হয়েছে বলে জানা গেছে। এখনো নিখোঁজ রয়েছেন অন্তত ৩৩৬ জন।\n\nএদিকে পাহাড়ধসের ঝুঁকি এখনো বলবৎ থাকায় জেলাগুলোতে রেড অ্যালার্ট জারি আছে। স্থানীয় লোকজন ‘আশ্রয়কেন্দ্রে’ গাদাগাদি করে থাকতে বাধ্য হচ্ছেন।', 'general', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/posts\\/5c637f87-dca3-4066-9b97-b2ad60f4cd89.avif\"]', NULL, NULL, 2, 1, 0, 0, 0, 0, '2025-12-17 12:44:39', '2025-12-17 14:50:10'),
(11, 61, 'মানবিক সংস্থায় পৃথিবীর নানা দেশে কাজ করার অভিজ্ঞতা আছে সুরজকান্তি ম্যানডিজের। সুনামির সময় তামিলনাড়ুতে আমরা একসঙ্গে কাজ করেছিলাম। সুরজ জানিয়েছেন, ‘অনেক জায়গায় সম্পূর্ণ কমিউনিটি উচ্ছেদ হয়ে গেছে, অনেক পরিবার এখনো অতিরিক্ত ভিড়ের মধ্যে গা–ঘেঁষাঘেঁষি করে অস্থায়ী আশ্রয়কেন্দ্রে থাকছে। সবাই কঠিন অনিশ্চয়তায় দিন কাটাচ্ছে। সুরজ খুবই শক্ত মনের। তবু তাঁর গলা ধরে আসে, ভেতরের কান্না চাপা থাকে না।\n\nশ্রীলঙ্কার দুর্যোগ ব্যবস্থাপনা কেন্দ্র (ডিএমসি) খুবই করিতকর্মা আর আমলাতান্ত্রিকতামুক্ত একটি প্রতিষ্ঠান। গত মার্চে এই প্রতিষ্ঠানের দায়িত্ব পেয়েছেন অবসরপ্রাপ্ত মেজর জেনারেল সাম্পথ কোনটুওয়েগোদা। ডিএমসির মহাপরিচালক জাতিসংঘের বিভিন্ন সংস্থা এবং আন্তর্জাতিক অংশীদারদের সঙ্গে ঘনিষ্ঠ সমন্বয়ে ত্রাণ কার্যক্রম পরিচালনা করছেন।\n\nপ্রতিবেশী দেশগুলোও যে যার সাধ্যমতো এগিয়ে আসার অঙ্গীকার করেছে। এর মধ্যে একটি দেশ তাদের গুদামে থাকা ‘পূর্ব সংরক্ষিত’ মালামাল পাঠাতে গিয়ে মেয়াদোত্তীর্ণ খাদ্যদ্রব্য পাঠিয়ে মহাবিপাকে পড়েছে। সোশ্যাল মিডিয়ায় এটিকে ‘সহায়তা কূটনীতির প্রহসন’ বলে ব্যাপক সমালোচনা করা হয়েছে। শ্রীলঙ্কার দুর্যোগ ব্যবস্থাপনা এবং বিদেশবিষয়ক সংশ্লিষ্ট ব্যক্তিরা পরিস্থিতিটিকে ‘গুরুতর উদ্বেগের’ বিষয় বলে অভিহিত করেছেন এবং দেশটির কাছ থেকে আনুষ্ঠানিক ব্যাখ্যা চেয়েছেন।', 'marketplace', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/posts\\/1b8f1c3d-1f34-4f0a-83ea-9c869b991ac1.avif\",\"http:\\/\\/localhost:8000\\/storage\\/posts\\/b7ebf569-fa4c-451e-a865-4d08ebea836e.avif\"]', NULL, NULL, 3, 3, 0, 0, 0, 0, '2025-12-17 12:55:28', '2026-01-04 19:30:45'),
(12, 62, 'কৃষি পরামর্শক বাতায়ন সম্পর্কে\nকৃষি-পরামর্শক বাতায়ন বাংলাদেশ কৃষি গবেষণা কাউন্সিল (বিএআরসি) কর্তৃক বাস্তবায়িত ক্রপ জোনিং প্রকল্পের আওতায় নির্মাণ করা হয়েছে। এটি আইসিটিভিত্তিক একটি দ্বৈত ভাষার প্ল্যাটফর্ম যার মাধ্যমে প্রয়োজন মাফিক কৃষি প্রযুক্তি বিষয়ক পরামর্শমূলক সেবা পাওয়া যাবে। এটি কৃষি এবং কৃষিক্ষেত্রের সংগে সংশ্লিষ্ঠ অন্যান্য গুরুত্বপূর্ণ তথ্য প্রাপ্তির গেটওয়ে হিসেবেও কাজ করবে। এছাড়াও, , কৃষি-পরামর্শক বাতায়নটি কৃষক, বেসরকারী প্রতিষ্ঠান, সরকারী সংস্থা, গবেষক এবং অন্যান্য উপকারভোগিদের জন্য প্রয়োজনীয় তথ্য প্রাপ্তি, গুরুত্বপূর্ণ তথ্য প্রাপ্তিতে সহযোগিতা এবং তথ্য বিনিময়ের জন্য একটি প্ল্যাটফর্ম হিসেবে কাজ করবে।\nউক্ত কৃষি পরামর্শক বাতায়নটির চূড়ান্ত লক্ষ্য হলো, কৃষি উপকারভোগির সমন্বয়ের মাধ্যমে কৃষক এবং কৃষি উৎপাদন সংশ্লিষ্ট অন্যান্য পর্যায়ে উৎপাদন পরিকল্পনায় সহায়তা করা। এছাড়াও, এ কৃষি পরামর্শক বাতায়নটি নির্দিষ্ট এলাকার তথ্যাবলী সরবরাহ, তথ্য-ভান্ডার থেকে প্রয়োজনীয় তথ্য সংগ্রহ করা, স্থানিক তথ্য এবং জিআইএস এর ব্যবহার উপযোগি প্রয়োজনীয় তথ্য প্রাপ্তির সুযোগ সৃষ্টি করা।', 'expert_advice', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/posts\\/9c17a941-d072-4cdb-a3b0-e6a1b22beac9.jpeg\"]', NULL, NULL, 3, 1, 0, 0, 0, 0, '2025-12-17 13:55:59', '2026-01-04 19:31:20'),
(13, 29, '৩০ ডিসেম্বরের এই সকালটি ঢাকার ইতিহাসে অন্যরকম এক হাহাকার নিয়ে এসেছে। উত্তরের হাড়কাঁপানো হিমেল হাওয়া আর ঘন কুয়াশায় ঢাকা রাজধানী আজ এক বিষণ্ণ চাদরে মুড়িয়ে আছে। প্রকৃতিতে যেমন তীব্র শীতের কামড়, রাজনৈতিক অঙ্গনেও তেমনি নেমে এসেছে এক স্তব্ধতা।\n\nশীতের তীব্রতায় ঢাকা ও বেগম জিয়ার বিদায়:\n\nকুয়াশার চাদরে ঢাকা শহর: ভোরের আলো ফোটার আগেই আজ ঢাকাকে গ্রাস করেছে ঘন কুয়াশা। বাতাসের আদ্রতা আর হিমেল হাওয়া যেন হাড়ের ভেতর গিয়ে বিঁধছে। রাস্তার মোড়ে মোড়ে আগুনের পাশে জড়ো হওয়া মানুষগুলোর চোখেমুখে এক ধরণের অনিশ্চয়তা।\n\nরাজপথের স্তব্ধতা: শীতের সকালে এমনিতে যানজট কম থাকে, কিন্তু আজকের নীরবতা অন্যরকম। এভারকেয়ার হাসপাতাল থেকে শুরু করে নয়াপল্টন পর্যন্ত—সবখানেই কনকনে ঠান্ডার মাঝেও মানুষের ভিড় বাড়ছে, কিন্তু সেই ভিড়ে কোনো উচ্চ শব্দ নেই, শুধু এক চাপা কান্না আর স্তব্ধতা।\n\nএক যুগের অবসান: প্রকৃতির এই রুক্ষ আর হিমশীতল পরিবেশের মধ্যেই খবর আসে বাংলাদেশের তিনবারের সাবেক প্রধানমন্ত্রী বেগম খালেদা জিয়ার চিরবিদায়ের। দীর্ঘ লড়াই শেষে তিনি আজ সব মায়ার ঊর্ধ্বে চলে গেলেন।\n\nঢাকার রাজপথের এই হাড়কাঁপানো ঠান্ডার মাঝেও হাজারো মানুষ আজ রাস্তায় নেমে এসেছে তাঁদের প্রিয় নেত্রীকে শেষ বিদায় জানাতে। চারদিকে বইছে উত্তরের শীতল হাওয়া, আর মানুষের মনে জমাট বেঁধেছে শোকের বরফ।\n\nপ্রকৃতির এই হিমাঙ্ক ছোঁয়া শীতের মাঝেই বাংলাদেশের রাজনীতির একটি বিশাল নক্ষত্র আজ নিভে গেল।', 'general', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/posts\\/3ddd5abc-c627-4a82-8678-e2663a6aa914.png\"]', NULL, NULL, 2, 5, 0, 0, 0, 0, '2025-12-30 11:29:20', '2026-01-05 17:55:03'),
(14, 61, 'কামলা খাটার লোক আছে।', 'marketplace', NULL, '[\"https:\\/\\/langal.blob.core.windows.net\\/public\\/posts\\/0b83d3fe-2b42-4504-831d-e463651c1946.jpg\"]', NULL, NULL, 4, 3, 0, 0, 0, 0, '2026-01-04 14:52:59', '2026-01-11 07:02:20'),
(15, 29, 'abc', 'general', NULL, '[]', NULL, NULL, 2, 0, 0, 0, 0, 0, '2026-01-05 17:49:47', '2026-01-11 07:14:11'),
(16, 29, 'আরমান কে বিক্রি দিবো', 'marketplace', NULL, '[]', NULL, NULL, 0, 0, 0, 0, 0, 1, '2026-01-11 08:05:20', '2026-01-11 08:05:54'),
(17, 29, 'আমার ট্রাক্টর এখন পাওয়া যাচ্ছে!', 'marketplace', '21', '[]', NULL, NULL, 1, 1, 0, 0, 0, 0, '2026-01-11 08:41:33', '2026-01-11 09:16:04'),
(18, 29, 'কামলা খাটার লোক আছে।', 'marketplace', '13', '[\"https:\\/\\/langal.blob.core.windows.net\\/public\\/posts\\/d3e9981f-e4af-4498-8bde-ba471353c055.jpeg\"]', NULL, NULL, 0, 0, 0, 0, 0, 0, '2026-01-11 08:46:37', '2026-01-11 08:46:37'),
(19, 29, 'আমার শেঙ্কু ভাই এখন পাওয়া যাচ্ছে!', 'marketplace', '14', '[]', NULL, NULL, 0, 0, 0, 0, 0, 0, '2026-01-11 08:48:14', '2026-01-11 08:48:50');

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `like_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `liked_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_likes`
--

INSERT INTO `post_likes` (`like_id`, `post_id`, `user_id`, `liked_at`) VALUES
(1, 8, 61, '2025-12-17 05:38:58'),
(4, 4, 61, '2025-12-17 12:53:30'),
(9, 11, 62, '2025-12-17 13:56:25'),
(10, 10, 62, '2025-12-17 13:56:28'),
(11, 9, 62, '2025-12-17 13:56:32'),
(12, 12, 62, '2025-12-17 14:15:47'),
(43, 9, 61, '2025-12-17 14:44:14'),
(51, 10, 61, '2025-12-17 14:50:09'),
(55, 11, 61, '2025-12-17 14:55:32'),
(56, 12, 61, '2025-12-17 14:56:02'),
(58, 9, 29, '2025-12-17 15:52:15'),
(60, 13, 33, '2025-12-31 17:52:47'),
(61, 14, 61, '2026-01-04 14:53:13'),
(63, 11, 29, '2026-01-05 01:30:45'),
(64, 12, 29, '2026-01-05 01:31:20'),
(65, 14, 33, '2026-01-05 02:17:16'),
(66, 15, 29, '2026-01-05 21:11:09'),
(67, 13, 29, '2026-01-05 23:54:46'),
(68, 14, 71, '2026-01-06 20:24:43'),
(70, 14, 29, '2026-01-11 07:02:22'),
(71, 15, 71, '2026-01-11 07:14:14'),
(72, 17, 29, '2026-01-11 09:15:52');

-- --------------------------------------------------------

--
-- Table structure for table `post_reports`
--

CREATE TABLE `post_reports` (
  `report_id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `report_reason` varchar(50) DEFAULT NULL,
  `post_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_reports`
--

INSERT INTO `post_reports` (`report_id`, `post_id`, `user_id`, `report_reason`, `post_type`, `created_at`, `updated_at`) VALUES
(2, 12, 61, NULL, NULL, '2025-12-17 14:30:14', '2025-12-17 14:30:14');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('yxe2KqMSLTIFVwcJPnwClYsT5iPJ6J20CvQ9p8HE', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDZCSm5TSVFqbUQ1aGVCUnI3OUZHWG1yTzh6bmRINUNLRVhSQVZ5TSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1765972645);

-- --------------------------------------------------------

--
-- Table structure for table `soil_test_reports`
--

CREATE TABLE `soil_test_reports` (
  `report_id` int(11) NOT NULL,
  `data_operator_id` int(11) NOT NULL,
  `farmer_name` varchar(100) DEFAULT NULL,
  `farmer_phone` varchar(15) DEFAULT NULL,
  `farmer_id` int(11) DEFAULT NULL,
  `postal_code` int(11) DEFAULT NULL,
  `village` varchar(100) NOT NULL,
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `field_size` decimal(10,2) DEFAULT NULL COMMENT 'Size in decimal/bigha',
  `current_crop` varchar(100) DEFAULT NULL,
  `test_date` date NOT NULL,
  `nitrogen` decimal(8,2) DEFAULT NULL COMMENT 'N in mg/kg or ppm',
  `phosphorus` decimal(8,2) DEFAULT NULL COMMENT 'P in mg/kg or ppm',
  `potassium` decimal(8,2) DEFAULT NULL COMMENT 'K in mg/kg or ppm',
  `ph_level` decimal(4,2) DEFAULT NULL COMMENT 'pH 0-14 scale',
  `ec_value` decimal(6,2) DEFAULT NULL COMMENT 'EC in dS/m',
  `soil_moisture` decimal(5,2) DEFAULT NULL COMMENT 'Moisture in percentage',
  `soil_temperature` decimal(5,2) DEFAULT NULL COMMENT 'Temperature in Celsius',
  `organic_matter` decimal(5,2) DEFAULT NULL COMMENT 'Organic matter in percentage',
  `soil_type` enum('loamy','sandy','clay','silty') DEFAULT NULL COMMENT 'Soil type',
  `calcium` decimal(8,2) DEFAULT NULL,
  `magnesium` decimal(8,2) DEFAULT NULL,
  `sulfur` decimal(8,2) DEFAULT NULL,
  `zinc` decimal(8,2) DEFAULT NULL,
  `iron` decimal(8,2) DEFAULT NULL,
  `health_rating` enum('poor','fair','good','excellent') DEFAULT NULL,
  `fertilizer_recommendation` text DEFAULT NULL,
  `crop_recommendation` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `soil_test_reports`
--

INSERT INTO `soil_test_reports` (`report_id`, `data_operator_id`, `farmer_name`, `farmer_phone`, `farmer_id`, `postal_code`, `village`, `latitude`, `longitude`, `field_size`, `current_crop`, `test_date`, `nitrogen`, `phosphorus`, `potassium`, `ph_level`, `ec_value`, `soil_moisture`, `soil_temperature`, `organic_matter`, `soil_type`, `calcium`, `magnesium`, `sulfur`, `zinc`, `iron`, `health_rating`, `fertilizer_recommendation`, `crop_recommendation`, `notes`, `created_at`, `updated_at`) VALUES
(1, 39, NULL, NULL, NULL, 3837, 'লক্ষণপুর', NULL, NULL, 5.00, 'ধান', '2025-12-15', 34.00, 30.00, 26.99, 7.00, 2.00, 34.00, 30.00, 4.98, 'clay', 56.00, 66.00, 67.00, 20.00, 4.00, 'good', NULL, NULL, NULL, '2025-12-15 12:52:43', '2025-12-15 12:52:43'),
(2, 39, 'মারুফ', '01878987645', NULL, 3837, 'লক্ষণপুর', NULL, NULL, 4.00, 'ধান', '2025-12-15', 43.00, 45.00, 34.00, 3.00, 45.00, 45.00, 30.00, 4.00, 'silty', 4.00, 5.00, 7.00, 7.00, 2.00, 'fair', NULL, NULL, NULL, '2025-12-15 13:09:39', '2025-12-15 13:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('farmer','expert','customer','data_operator') NOT NULL,
  `phone` varchar(15) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `last_active_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `user_type`, `phone`, `is_verified`, `is_active`, `last_active_at`, `created_at`, `updated_at`) VALUES
(15, 'testfarmer@example.com', '$2y$12$0v9b8bzYeuUXtgU2EIBEVuWAUByCe7FuYFcNfPkIO1Is80nRSyFsa', 'farmer', '01999999999', 1, 1, NULL, '2025-12-04 14:18:43', '2025-12-04 14:18:43'),
(20, NULL, '$2y$12$TOEboDqIGlM1sfvFFBSTseBxA1M88oU2OyUV3K6.1WO6p8nePyyla', 'farmer', '01729387385', 1, 1, NULL, '2025-12-04 14:37:16', '2025-12-04 14:37:16'),
(28, NULL, '$2y$12$SCtdGrW6Wx3dnTDZ90F3BOuH5gNHgnlvht6x8ErcN/2EvIk1DOwwW', 'farmer', '01859561145', 1, 1, NULL, '2025-12-04 15:04:43', '2025-12-04 15:17:03'),
(29, NULL, '$2y$12$8Wa9Q1Y9Oohj8q/OkjljaO3.jYvN.9m5vnTqmyM8l8iGUCdyqH8/6', 'farmer', '01997900840', 1, 1, NULL, '2025-12-05 12:08:26', '2025-12-05 12:08:26'),
(30, NULL, '$2y$12$.tTGnCDlgKj7gIKkeJ1QOOZe7f1GuxsXzJeR0JZ4P1ILjZFf0vFq.', 'farmer', '01882953533', 1, 1, NULL, '2025-12-05 12:29:01', '2025-12-05 12:29:01'),
(31, NULL, '$2y$12$mtk4Qs.BBPSkXv1EO8j7e.OR7C.WU65qAHYbvYq.ajzMqhOAHCLUG', 'farmer', '01970890839', 1, 1, NULL, '2025-12-07 02:52:00', '2025-12-07 02:52:00'),
(32, NULL, '$2y$12$Cdh19HCTjhHKCeoxGROa9eRop54Fw6iSCCablIUjpYTV2f5pEgIOe', 'farmer', '01888636718', 1, 1, NULL, '2025-12-07 03:35:28', '2025-12-07 03:35:28'),
(33, NULL, '$2y$12$IFZE2g3CwtkpkQHqOJCNYOML5jT9pPZF.WVJS2sIxJlU6/4gM848u', 'customer', '01888999000', 1, 1, NULL, '2025-12-07 06:43:52', '2025-12-17 07:39:54'),
(34, NULL, '$2y$12$GYEyWxxehLOPLx3qrZCjBuWkf/gHsrMHoXFUQ0NmfzUCXvRcda1iu', 'customer', '01626014224', 1, 1, NULL, '2025-12-11 06:47:44', '2025-12-11 06:47:44'),
(35, NULL, '$2y$12$QtT01V5dfib8jUJNFaKDxuVGzko5Pa2HxOSFU8Ssj/eMyRiwAOQBm', 'farmer', '01888636717', 1, 1, NULL, '2025-12-15 06:34:43', '2025-12-15 06:34:43'),
(39, NULL, '$2y$12$7n/bCA2qXAX7fZwFzC7qa.V7q7njpIMeuAdxV1woMAhQtlzkvRkia', 'data_operator', '01888636715', 1, 1, NULL, '2025-12-15 08:26:50', '2025-12-17 07:56:14'),
(52, NULL, '$2y$12$GhK9..cc4d.VyPeiEl2eMO80CDAPWkC8vS5ce3VImyY9JmBigpQt6', 'customer', '01982736253', 1, 1, NULL, '2025-12-16 10:22:09', '2025-12-16 10:22:09'),
(56, NULL, '$2y$12$FaFhGL3KCXme1HIc4pt15eN67a5DkSMZR2bss5FRUPls782phnEQ2', 'farmer', '01323233333', 1, 1, NULL, '2025-12-16 10:37:27', '2025-12-16 10:37:27'),
(57, NULL, '$2y$12$tl5gTuFvCA5T5fDHBg7rVu/82DA8qyHPyUN5Flt.bU3VUHz8NkUDy', 'farmer', '01234567891', 1, 1, NULL, '2025-12-16 10:45:53', '2025-12-16 10:45:53'),
(60, NULL, '$2y$12$aOqYY609auucYgF0u5xz4u6tx3eMgPc7oHuJIdra4zNYuj.Si6Yhy', 'expert', '01493433333', 1, 1, NULL, '2025-12-16 11:09:59', '2025-12-16 11:09:59'),
(61, NULL, '$2y$12$47iVcmrLysjJQSXg0oisNOcT9rK7hmbWWzAoIv3z6B/Rr.D/eNBei', 'farmer', '01882130240', 1, 1, NULL, '2025-12-17 04:36:44', '2025-12-17 04:36:44'),
(62, NULL, '$2y$12$t66y97vMR0llztQPLX6ZUupc1FgtSeZ.oz8yEAfZncG/94FkZBpze', 'expert', '01888636712', 1, 1, NULL, '2025-12-17 04:50:52', '2025-12-17 07:43:54'),
(66, NULL, '$2y$12$ODcTDbyq08BLU0TO5qW/quojdZoCXGWhx9.tBiSS9CGqHfm57zcva', 'customer', '01988636719', 1, 1, NULL, '2025-12-17 05:56:09', '2025-12-17 05:56:09'),
(67, NULL, '$2y$12$anjQUDEinpWACwF2MH1pI.CLdQ2m5kzqX9a4XSGrRj6VuAHVp9fyO', 'customer', '01888636711', 1, 1, NULL, '2025-12-17 06:09:27', '2025-12-17 06:09:27'),
(68, NULL, '$2y$12$XCIPLV4Xu9IyVEkhkb8r0ubS7YBHAYM.bOSQK7tQdQdcrZugxBB8q', 'customer', '01888636709', 1, 1, NULL, '2025-12-17 07:11:02', '2025-12-17 07:11:02'),
(71, NULL, '$2y$12$o6i4pxNzwiDU4FRWtcOVN.OIPxrXkwzkE5ZT9/T5oPob4dBOvm/Y2', 'expert', '01843024285', 1, 1, '2026-01-11 09:17:10', '2026-01-06 19:52:17', '2026-01-11 09:17:10');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `nid_number` varchar(17) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `postal_code` int(11) DEFAULT NULL,
  `profile_photo_url` varchar(255) DEFAULT NULL,
  `nid_photo_url` varchar(255) DEFAULT NULL COMMENT 'NID photo URL for verification',
  `verification_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `verified_by` int(11) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`profile_id`, `user_id`, `full_name`, `nid_number`, `date_of_birth`, `father_name`, `mother_name`, `address`, `village`, `postal_code`, `profile_photo_url`, `nid_photo_url`, `verification_status`, `verified_by`, `verified_at`, `created_at`, `updated_at`) VALUES
(7, 15, 'Test Farmer', '12345678901234567', '1990-01-01', 'Test Father', 'Test Mother', 'Test Address', NULL, NULL, NULL, NULL, 'rejected', 39, '2025-12-15 11:49:42', '2025-12-04 14:18:43', '2025-12-15 11:49:42'),
(11, 20, 'Test Farmer', '7623362635789', '1990-01-01', 'Test Father', 'Test Mother', 'Test Address', NULL, NULL, NULL, NULL, 'approved', 39, '2025-12-16 10:54:52', '2025-12-04 14:37:16', '2025-12-16 10:54:52'),
(12, 28, 'জাহাঙ্গীর আলম', '2848955809', '2025-12-03', 'ছাবির মিয়া', 'আনোয়ারা বেগম', 'পাঁচপাড়া, চন্দ্রগঞ্জ, লক্ষ্মীপুর', 'পাঁচপাড়া', NULL, 'profile_photos/Quvs39SDEAR8FlBYfaGqVEylQutumSFLBxZ2JkF7.png', NULL, 'rejected', 39, '2025-12-15 11:40:17', '2025-12-04 15:04:43', '2025-12-15 11:40:17'),
(13, 29, 'মোফাসসেল আলম মারুফ', '9597839043', '2002-08-25', 'জাহাঙ্গীর আলম', 'কমলা বেগম', 'গ্রাম: পাঁচপাড়া, ডাকঘর: চন্দ্রগঞ্জ, উপজেলা: লক্ষ্মীপুর সদর, জেলা: লক্ষ্মীপুর, বিভাগ: চট্টগ্রাম', 'পাঁচপাড়া', 3708, 'profile_photos/1UGNBQmf6qwt9JaM1w56StHjWTcsTHhO9uxnH4L1.png', NULL, 'approved', 39, '2025-12-15 14:37:53', '2025-12-05 12:08:27', '2026-01-06 01:13:26'),
(14, 30, 'সাকিব ইবনে রশিদ', '1010101010', '2002-02-03', 'রশিদ মিয়া', 'সাকিবের আম্মু', 'গ্রাম: রমাপুর , ডাকঘর: রামগঞ্জ, উপজেলা: রামগঞ্জ, জেলা: লক্ষ্মীপুর, বিভাগ: চট্টগ্রাম', 'রমাপুর', 3720, 'profile_photos/8xoJLRZ948KS0prZrP7Wu1FFl8PPHGGOis7NvVVg.jpg', NULL, 'approved', 39, '2025-12-15 14:41:06', '2025-12-05 12:29:01', '2025-12-15 14:41:06'),
(15, 31, 'কালা সামির', '10102020220', '2005-03-25', 'সামিরের আব্বু', 'সামিরের আম্মু', 'কেরাতলা, সন্দ্বীপ, সন্দ্বীপ, চট্টগ্রাম', 'কেরাতলা', 4300, 'profile_photos/wL9ax2JsNho3swH0qqgh18kHoqlNor3lgW5fHyPN.png', NULL, 'rejected', 39, '2025-12-15 11:33:49', '2025-12-07 02:52:02', '2025-12-15 17:58:01'),
(16, 32, 'ইসমাইল হোসেন', '878365483575', '2003-02-27', 'গিয়াস উদ্দিন', 'ফাতেমা বেগম', 'লক্ষণপুর, ভবানী জীবনপুর, বেগমগঞ্জ, নোয়াখালী', 'লক্ষণপুর', 3837, 'profile_photos/pMACHtNYtNNuYfLwmSDacg5A31yAgPNCFnUeazE5.jpg', NULL, 'approved', 39, '2025-12-15 11:33:42', '2025-12-07 03:35:28', '2025-12-15 11:33:42'),
(17, 33, 'তারিক আহমেদ সবুজ', '1848955809', '2000-02-22', 'সবুজ ভাইয়ের বাপ', 'সবুজ ভাইয়ের মা', 'গ্রাম: নাখালপাড়া, ডাকঘর: তেজগাঁও টিএসও, উপজেলা: তেজগাঁও, জেলা: ঢাকা', 'নাখালপাড়া', 1215, 'profile_photos/customers/d6jeiGhDFdbGq3Gxzy4riC9Of3Oaf6zbpgLo28on.png', NULL, 'approved', 39, '2025-12-16 06:19:39', '2025-12-07 06:43:53', '2025-12-16 06:19:39'),
(18, 34, 'আরমান', '1234567891222343', '2025-12-02', 'মুসা', 'শামিম আক্তার', 'গ্রাম: নলদিয়া, ডাকঘর: আনোয়ারা, উপজেলা: আনোয়ারা, জেলা: চট্টগ্রাম, বিভাগ: চট্টগ্রাম', 'নলদিয়া', 4376, 'profile_photos/customers/pUNHjcdhFH8a8exB1HsIBjwOdScTF3XXY8Mslxx2.jpg', NULL, 'rejected', 39, '2025-12-17 06:04:40', '2025-12-11 06:47:46', '2025-12-17 06:04:40'),
(19, 35, 'ইসমাইল', '5674356796', '2007-06-06', 'গিয়াস', 'ফাতেমা', 'লক্ষণপুর, ভবানী জীবনপুর, বেগমগঞ্জ, নোয়াখালী', 'লক্ষণপুর', 3837, 'profile_photos/AOol3C4QGPuz15Dp2oXQ5M7RUAAJu1Ce2Lx2S8Og.jpg', NULL, 'approved', 39, '2025-12-15 11:21:12', '2025-12-15 06:34:44', '2025-12-15 11:21:12'),
(23, 39, 'রমিজ উদ্দিন ভুইয়া', '5674356799', '1999-04-08', 'ছমির উদ্দিন', 'বিবি রহিমা', 'গ্রাম: লক্ষণপুর, ডাকঘর: ভবানী জীবনপুর, উপজেলা: বেগমগঞ্জ, জেলা: নোয়াখালী, বিভাগ: চট্টগ্রাম', 'লক্ষণপুর', 3837, 'profile_photos/8LDmkAuQU0CZwKVsJvkonkb8nmapdqYzCGVAyvbc.jpg', NULL, 'pending', NULL, NULL, '2025-12-15 08:26:50', '2025-12-15 16:58:58'),
(36, 52, 'ইসরাত মোহাম্মদ নাহিন', '1212322222', '2025-12-03', 'নিয়ন কবির', 'সাহানা আক্তার মীরা', 'গ্রাম: সায়েন্স ল্যাব, ডাকঘর: নিউ মার্কেট টিএসও, উপজেলা: নিউমার্কেট, জেলা: ঢাকা, বিভাগ: ঢাকা', 'সায়েন্স ল্যাব', 1205, 'profile_photos/customers/UUlZwuhJBJ62Ugg7FZ6Fy5OZZj6vmsfXE9AUoRb2.jpg', 'nid_photos/customers/4gA7kDQriGX5B9qhyopUaZXcpFJZuDvNZQUcCeup.jpg', 'pending', NULL, NULL, '2025-12-16 10:22:09', '2025-12-16 10:22:09'),
(38, 57, 'আসিফ ইকবাল', '1212345434', '2025-12-09', 'জীবন', 'রায়না', 'ঢাকা ক্যান্টনমেন্ট টিএসও , ঢাকা ক্যান্টনমেন্ট টিএসও, ঢাকা ক্যান্ট।, ঢাকা', 'ঢাকা ক্যান্টনমেন্ট টিএসও', 1206, 'profile_photos/ejAoQXur5M6YNsRNvjvRYT7JslLRCdJiSNBuwW3F.jpg', NULL, 'approved', NULL, NULL, '2025-12-16 10:45:53', '2025-12-16 10:45:53'),
(41, 60, 'আসিফ ইকবাল', '2124564534', '2025-12-11', 'জীবন', 'রায়না', 'ধানমন্ডি, জিগাতলা টিএসও, ধানমন্ডি, ঢাকা', 'ধানমন্ডি', 1209, 'expert/profiles/BGno4LoFqD4Lo129KoUKDhfvrZ4gnfwxayEQV8iq.jpg', NULL, 'rejected', 39, '2025-12-17 05:11:27', '2025-12-16 11:09:59', '2025-12-17 05:11:27'),
(42, 61, 'ইসরাত মোহাম্মদ নাহিন', '1234543234', '2001-01-23', 'নিয়ন কবির', 'সাহানা আক্তার মীরা', 'সায়েন্স ল্যাব, নিউ মার্কেট টিএসও, নিউমার্কেট, ঢাকা', 'সায়েন্স ল্যাব', 1205, 'profile_photos/Ztzr5pVMPhrNKJjXTuXYbz96MhZAG6nnCdLJF2X7.jpg', NULL, 'pending', NULL, NULL, '2025-12-17 04:36:44', '2025-12-17 04:36:44'),
(43, 62, 'রমিজ উদ্দিন', '900673050', '2000-04-06', 'ইউশা কাদির', 'ইফাতুর খাতুন', 'নান্নুপুর, সারিয়াকান্দি, সারিয়াকান্দি, বগুড়া', 'নান্নুপুর', 5830, 'expert/profiles/NKonSC1R4diWwvefcE5dNl0HYE8pGPcmZ3hw5oEq.png', NULL, 'approved', 39, '2025-12-17 05:11:12', '2025-12-17 04:50:53', '2025-12-17 05:11:12'),
(47, 66, 'নাহিন', '5676356796', '2000-03-05', 'ছমির উদ্দিন', 'বিবি রহিমা', 'গ্রাম: লক্ষণপুর, ডাকঘর: ভবানী জীবনপুর, উপজেলা: বেগমগঞ্জ, জেলা: নোয়াখালী, বিভাগ: চট্টগ্রাম', 'লক্ষণপুর', 3837, 'profile_photos/customers/A0AW0sVTFwPs4uQWEuQMfGqmmPlyIssoIaL4lLgS.jpg', 'nid_photos/customers/NLXcvj7Ea7gLIfg4VNor39aumBjKBeqEcmZ73vfC.png', 'approved', 39, '2025-12-17 05:57:16', '2025-12-17 05:56:09', '2025-12-17 05:57:16'),
(48, 67, 'ইসমাইল', '9006734681', '2001-02-05', 'গিয়াস', 'ফাতেমা', 'গ্রাম: নান্নুপুর, ডাকঘর: বকশীগঞ্জ, উপজেলা: বকশীগঞ্জ, জেলা: শেরপুর, বিভাগ: ময়মনসিংহ', 'নান্নুপুর', 2140, 'profile_photos/customers/wfVPh9VumH35mw9jjoMYNhu8GQWkySwICVMMpBlb.jpg', 'nid_photos/customers/dnf6voaMcDGOe5ebihl64LGZyE1i9SSd7BgQOGPJ.png', 'rejected', 39, '2025-12-17 06:10:12', '2025-12-17 06:09:28', '2025-12-17 06:10:12'),
(49, 68, 'মোঃ ইসমাইল হোসেন', '9006730600', '2000-03-04', 'গিয়াস উদ্দিন', 'ফাতেমা বেগম', 'গ্রাম: লক্ষণপুর, ডাকঘর: ভবানী জীবনপুর, উপজেলা: বেগমগঞ্জ, জেলা: নোয়াখালী, বিভাগ: চট্টগ্রাম', 'লক্ষণপুর', 3837, 'profile_photos/customers/ieWYobfHF0opoFvsPKvElPwhVZhEHstipxd2MB8J.jpg', 'nid_photos/customers/ApM2Bt1pBu98CoPvAD1FWO0zDzLcK1koy9bz1kxQ.png', 'pending', NULL, NULL, '2025-12-17 07:11:03', '2025-12-17 07:11:03'),
(52, 71, 'প্রফেসর মারুফ', '১২৩৪৫৬৭৮৭৬৫৪', '2001-03-31', 'জাহাঙ্গীর আলম', 'কমলা বেগম', 'ডগাই , সারুলিয়া, ডেমরা, ঢাকা', 'ডগাই', 1361, 'expert/profiles/AuyohUHcFAX1ySUeHb8Isr7TRNAYDPwqbZcgqHxw.png', NULL, 'approved', 39, '2026-01-06 20:15:34', '2026-01-06 19:52:17', '2026-01-06 20:15:34');

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
-- Indexes for table `comment_reports`
--
ALTER TABLE `comment_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD UNIQUE KEY `unique_comment_report` (`comment_id`,`user_id`);

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
  ADD KEY `idx_consultations_status_priority` (`status`,`priority`);

--
-- Indexes for table `consultation_appointments`
--
ALTER TABLE `consultation_appointments`
  ADD PRIMARY KEY (`appointment_id`);

--
-- Indexes for table `consultation_calls`
--
ALTER TABLE `consultation_calls`
  ADD PRIMARY KEY (`call_id`),
  ADD KEY `idx_call_appointment` (`appointment_id`),
  ADD KEY `idx_call_caller` (`caller_id`),
  ADD KEY `idx_call_callee` (`callee_id`),
  ADD KEY `idx_call_status` (`call_status`),
  ADD KEY `idx_call_channel` (`agora_channel`);

--
-- Indexes for table `consultation_feedback`
--
ALTER TABLE `consultation_feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD UNIQUE KEY `uk_feedback_appointment` (`appointment_id`),
  ADD KEY `idx_feedback_farmer` (`farmer_id`),
  ADD KEY `idx_feedback_expert` (`expert_id`),
  ADD KEY `idx_feedback_rating` (`overall_rating`),
  ADD KEY `idx_feedback_expert_approved` (`expert_id`,`is_approved`,`overall_rating`);

--
-- Indexes for table `consultation_messages`
--
ALTER TABLE `consultation_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_message_conversation` (`conversation_id`),
  ADD KEY `idx_message_sender` (`sender_id`),
  ADD KEY `idx_message_receiver` (`receiver_id`),
  ADD KEY `idx_message_appointment` (`appointment_id`),
  ADD KEY `idx_message_created` (`created_at`),
  ADD KEY `idx_message_unread` (`receiver_id`,`is_read`),
  ADD KEY `idx_messages_unread` (`receiver_id`,`is_read`,`created_at`);

--
-- Indexes for table `consultation_prescriptions`
--
ALTER TABLE `consultation_prescriptions`
  ADD PRIMARY KEY (`prescription_id`),
  ADD KEY `idx_prescription_appointment` (`appointment_id`),
  ADD KEY `idx_prescription_expert` (`expert_id`),
  ADD KEY `idx_prescription_farmer` (`farmer_id`);

--
-- Indexes for table `consultation_responses`
--
ALTER TABLE `consultation_responses`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `idx_responses_consultation` (`consultation_id`),
  ADD KEY `idx_responses_expert` (`expert_id`);

--
-- Indexes for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD UNIQUE KEY `uk_conversation_user` (`conversation_id`,`user_id`),
  ADD KEY `idx_participant_user` (`user_id`),
  ADD KEY `idx_participant_conversation` (`conversation_id`);

--
-- Indexes for table `crop_recommendations`
--
ALTER TABLE `crop_recommendations`
  ADD PRIMARY KEY (`recommendation_id`),
  ADD KEY `idx_expert_id` (`expert_id`),
  ADD KEY `idx_recommendations_farmer` (`farmer_id`),
  ADD KEY `idx_recommendations_season` (`season`),
  ADD KEY `idx_recommendations_location` (`location`),
  ADD KEY `crop_recommendations_crop_type_index` (`crop_type`);

--
-- Indexes for table `customer_business_details`
--
ALTER TABLE `customer_business_details`
  ADD PRIMARY KEY (`business_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_business_type` (`business_type`);

--
-- Indexes for table `data_operators`
--
ALTER TABLE `data_operators`
  ADD PRIMARY KEY (`data_operator_id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

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
-- Indexes for table `expert_availability`
--
ALTER TABLE `expert_availability`
  ADD PRIMARY KEY (`availability_id`),
  ADD KEY `idx_expert_availability_expert` (`expert_id`),
  ADD KEY `idx_expert_availability_day` (`day_of_week`),
  ADD KEY `idx_expert_availability_time` (`start_time`,`end_time`);

--
-- Indexes for table `expert_qualifications`
--
ALTER TABLE `expert_qualifications`
  ADD PRIMARY KEY (`expert_id`),
  ADD KEY `idx_expert_user` (`user_id`),
  ADD KEY `idx_expert_specialization` (`specialization`),
  ADD KEY `idx_expert_rating` (`rating`);

--
-- Indexes for table `expert_unavailable_dates`
--
ALTER TABLE `expert_unavailable_dates`
  ADD PRIMARY KEY (`unavailable_id`),
  ADD UNIQUE KEY `uk_expert_date` (`expert_id`,`unavailable_date`),
  ADD KEY `idx_unavailable_expert` (`expert_id`),
  ADD KEY `idx_unavailable_date` (`unavailable_date`);

--
-- Indexes for table `farmer_details`
--
ALTER TABLE `farmer_details`
  ADD PRIMARY KEY (`farmer_id`),
  ADD UNIQUE KEY `idx_krishi_card` (`krishi_card_number`),
  ADD UNIQUE KEY `krishi_card_number` (`krishi_card_number`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_farmer_farm_size` (`farm_size`),
  ADD KEY `idx_farmer_experience` (`experience_years`);

--
-- Indexes for table `farmer_selected_crops`
--
ALTER TABLE `farmer_selected_crops`
  ADD PRIMARY KEY (`selection_id`),
  ADD KEY `farmer_selected_crops_farmer_id_index` (`farmer_id`),
  ADD KEY `farmer_selected_crops_status_index` (`status`),
  ADD KEY `farmer_selected_crops_season_index` (`season`),
  ADD KEY `farmer_selected_crops_next_notification_date_index` (`next_notification_date`);

--
-- Indexes for table `field_data_collection`
--
ALTER TABLE `field_data_collection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_data_collection_manual_farmer_id_index` (`manual_farmer_id`);

--
-- Indexes for table `field_data_farmers`
--
ALTER TABLE `field_data_farmers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `field_data_reports`
--
ALTER TABLE `field_data_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `idx_data_operator` (`data_operator_id`),
  ADD KEY `idx_report_date` (`report_date`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`postal_code`);

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
  ADD KEY `idx_listings_location` (`full_location_bn`),
  ADD KEY `idx_listings_type` (`listing_type`),
  ADD KEY `idx_listings_created` (`created_at`),
  ADD KEY `idx_listings_status_category` (`status`,`category_id`);
ALTER TABLE `marketplace_listings` ADD FULLTEXT KEY `ft_title_description` (`title`,`description`);

--
-- Indexes for table `marketplace_listing_saves`
--
ALTER TABLE `marketplace_listing_saves`
  ADD PRIMARY KEY (`save_id`),
  ADD UNIQUE KEY `unique_save` (`listing_id`,`user_id`),
  ADD KEY `idx_saves_listing` (`listing_id`),
  ADD KEY `idx_saves_user` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `notification_queue`
--
ALTER TABLE `notification_queue`
  ADD PRIMARY KEY (`queue_id`),
  ADD KEY `idx_queue_user` (`user_id`),
  ADD KEY `idx_queue_status` (`status`),
  ADD KEY `idx_queue_scheduled` (`scheduled_at`,`status`),
  ADD KEY `idx_queue_type` (`notification_type`);

--
-- Indexes for table `notification_tokens`
--
ALTER TABLE `notification_tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD UNIQUE KEY `uk_user_device` (`user_id`,`device_token`),
  ADD KEY `idx_token_user` (`user_id`),
  ADD KEY `idx_token_active` (`is_active`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `idx_posts_author_date` (`author_id`,`created_at`),
  ADD KEY `idx_posts_type` (`post_type`),
  ADD KEY `idx_posts_created` (`created_at`),
  ADD KEY `idx_posts_location` (`location`);
ALTER TABLE `posts` ADD FULLTEXT KEY `ft_content` (`content`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`like_id`),
  ADD UNIQUE KEY `unique_like` (`post_id`,`user_id`),
  ADD KEY `idx_likes_post` (`post_id`),
  ADD KEY `idx_likes_user` (`user_id`);

--
-- Indexes for table `post_reports`
--
ALTER TABLE `post_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD UNIQUE KEY `unique_report` (`post_id`,`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `soil_test_reports`
--
ALTER TABLE `soil_test_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `postal_code` (`postal_code`),
  ADD KEY `idx_data_operator` (`data_operator_id`),
  ADD KEY `idx_farmer` (`farmer_id`),
  ADD KEY `idx_test_date` (`test_date`);

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
  ADD UNIQUE KEY `nid_number` (`nid_number`),
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
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `comment_reports`
--
ALTER TABLE `comment_reports`
  MODIFY `report_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `consultations`
--
ALTER TABLE `consultations`
  MODIFY `consultation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consultation_appointments`
--
ALTER TABLE `consultation_appointments`
  MODIFY `appointment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `consultation_calls`
--
ALTER TABLE `consultation_calls`
  MODIFY `call_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `consultation_feedback`
--
ALTER TABLE `consultation_feedback`
  MODIFY `feedback_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consultation_messages`
--
ALTER TABLE `consultation_messages`
  MODIFY `message_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consultation_prescriptions`
--
ALTER TABLE `consultation_prescriptions`
  MODIFY `prescription_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consultation_responses`
--
ALTER TABLE `consultation_responses`
  MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  MODIFY `participant_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crop_recommendations`
--
ALTER TABLE `crop_recommendations`
  MODIFY `recommendation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_business_details`
--
ALTER TABLE `customer_business_details`
  MODIFY `business_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `data_operators`
--
ALTER TABLE `data_operators`
  MODIFY `data_operator_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `expert_availability`
--
ALTER TABLE `expert_availability`
  MODIFY `availability_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `expert_qualifications`
--
ALTER TABLE `expert_qualifications`
  MODIFY `expert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `expert_unavailable_dates`
--
ALTER TABLE `expert_unavailable_dates`
  MODIFY `unavailable_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `farmer_details`
--
ALTER TABLE `farmer_details`
  MODIFY `farmer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `farmer_selected_crops`
--
ALTER TABLE `farmer_selected_crops`
  MODIFY `selection_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `field_data_collection`
--
ALTER TABLE `field_data_collection`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `field_data_farmers`
--
ALTER TABLE `field_data_farmers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `field_data_reports`
--
ALTER TABLE `field_data_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_categories`
--
ALTER TABLE `marketplace_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `marketplace_listings`
--
ALTER TABLE `marketplace_listings`
  MODIFY `listing_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `marketplace_listing_saves`
--
ALTER TABLE `marketplace_listing_saves`
  MODIFY `save_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `notification_queue`
--
ALTER TABLE `notification_queue`
  MODIFY `queue_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notification_tokens`
--
ALTER TABLE `notification_tokens`
  MODIFY `token_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=326;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `post_reports`
--
ALTER TABLE `post_reports`
  MODIFY `report_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `soil_test_reports`
--
ALTER TABLE `soil_test_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

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
-- Constraints for table `consultations`
--
ALTER TABLE `consultations`
  ADD CONSTRAINT `fk_consultations_expert` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_consultations_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `consultation_calls`
--
ALTER TABLE `consultation_calls`
  ADD CONSTRAINT `consultation_calls_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_calls_callee_id_foreign` FOREIGN KEY (`callee_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_calls_caller_id_foreign` FOREIGN KEY (`caller_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `consultation_feedback`
--
ALTER TABLE `consultation_feedback`
  ADD CONSTRAINT `consultation_feedback_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_feedback_expert_id_foreign` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_feedback_farmer_id_foreign` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `consultation_messages`
--
ALTER TABLE `consultation_messages`
  ADD CONSTRAINT `consultation_messages_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `consultation_prescriptions`
--
ALTER TABLE `consultation_prescriptions`
  ADD CONSTRAINT `consultation_prescriptions_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_prescriptions_expert_id_foreign` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `consultation_prescriptions_farmer_id_foreign` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `consultation_responses`
--
ALTER TABLE `consultation_responses`
  ADD CONSTRAINT `fk_responses_consultation` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`consultation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_responses_expert` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `conversation_participants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `data_operators`
--
ALTER TABLE `data_operators`
  ADD CONSTRAINT `fk_data_operator_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

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
-- Constraints for table `expert_availability`
--
ALTER TABLE `expert_availability`
  ADD CONSTRAINT `expert_availability_expert_id_foreign` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expert_qualifications`
--
ALTER TABLE `expert_qualifications`
  ADD CONSTRAINT `fk_expert_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `expert_unavailable_dates`
--
ALTER TABLE `expert_unavailable_dates`
  ADD CONSTRAINT `expert_unavailable_dates_expert_id_foreign` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `farmer_details`
--
ALTER TABLE `farmer_details`
  ADD CONSTRAINT `fk_farmer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `field_data_reports`
--
ALTER TABLE `field_data_reports`
  ADD CONSTRAINT `field_data_reports_ibfk_1` FOREIGN KEY (`data_operator_id`) REFERENCES `users` (`user_id`);

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
-- Constraints for table `notification_queue`
--
ALTER TABLE `notification_queue`
  ADD CONSTRAINT `notification_queue_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification_tokens`
--
ALTER TABLE `notification_tokens`
  ADD CONSTRAINT `notification_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_user` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `fk_post_likes_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_post_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `soil_test_reports`
--
ALTER TABLE `soil_test_reports`
  ADD CONSTRAINT `soil_test_reports_ibfk_1` FOREIGN KEY (`data_operator_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `soil_test_reports_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `soil_test_reports_ibfk_3` FOREIGN KEY (`postal_code`) REFERENCES `location` (`postal_code`) ON DELETE SET NULL;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `fk_user_profiles_postal_code` FOREIGN KEY (`postal_code`) REFERENCES `location` (`postal_code`),
  ADD CONSTRAINT `fk_user_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_profiles_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
