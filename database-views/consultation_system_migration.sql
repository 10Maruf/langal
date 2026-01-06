-- =====================================================
-- 🔄 CONSULTATION SYSTEM - COMPLETE DATABASE MIGRATION
-- =====================================================
-- Author: Langol Krishi Sahayak Team
-- Date: January 2026
-- Description: Complete consultation, messaging, scheduling,
--              and call system for Farmer-Expert interaction
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00"; -- Bangladesh Time

-- =====================================================
-- 📋 TABLE 1: expert_availability
-- Purpose: Expert দের available time slots
-- =====================================================
CREATE TABLE IF NOT EXISTS `expert_availability` (
    `availability_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `expert_id` INT(11) NOT NULL COMMENT 'FK to users table (expert)',
    `day_of_week` ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday') NOT NULL,
    `start_time` TIME NOT NULL COMMENT 'Slot start time (e.g., 09:00:00)',
    `end_time` TIME NOT NULL COMMENT 'Slot end time (e.g., 09:30:00)',
    `slot_duration_minutes` SMALLINT UNSIGNED DEFAULT 30 COMMENT 'Duration in minutes',
    `max_appointments` TINYINT UNSIGNED DEFAULT 1 COMMENT 'Max bookings per slot',
    `is_available` TINYINT(1) DEFAULT 1 COMMENT '1=Available, 0=Blocked',
    `consultation_types` JSON DEFAULT NULL COMMENT '["audio", "video", "chat"]',
    `notes` VARCHAR(255) DEFAULT NULL COMMENT 'Special notes for this slot',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`availability_id`),
    KEY `idx_expert_availability_expert` (`expert_id`),
    KEY `idx_expert_availability_day` (`day_of_week`),
    KEY `idx_expert_availability_time` (`start_time`, `end_time`),
    CONSTRAINT `fk_availability_expert` FOREIGN KEY (`expert_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Expert availability schedule for consultations';

-- =====================================================
-- 📋 TABLE 2: expert_unavailable_dates
-- Purpose: Expert এর ছুটির দিন / specific unavailable dates
-- =====================================================
CREATE TABLE IF NOT EXISTS `expert_unavailable_dates` (
    `unavailable_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `expert_id` INT(11) NOT NULL,
    `unavailable_date` DATE NOT NULL,
    `reason` VARCHAR(255) DEFAULT NULL COMMENT 'Optional reason',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`unavailable_id`),
    UNIQUE KEY `uk_expert_date` (`expert_id`, `unavailable_date`),
    KEY `idx_unavailable_expert` (`expert_id`),
    KEY `idx_unavailable_date` (`unavailable_date`),
    CONSTRAINT `fk_unavailable_expert` FOREIGN KEY (`expert_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Expert unavailable/holiday dates';

-- =====================================================
-- 📋 TABLE 3: consultation_appointments
-- Purpose: Main appointment booking table
-- =====================================================
CREATE TABLE IF NOT EXISTS `consultation_appointments` (
    `appointment_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_code` VARCHAR(20) NOT NULL COMMENT 'Unique readable code (e.g., APT-2026-00001)',
    `farmer_id` INT(11) NOT NULL COMMENT 'FK to users (farmer)',
    `expert_id` INT(11) NOT NULL COMMENT 'FK to users (expert)',
    
    -- Scheduling Details
    `scheduled_date` DATE NOT NULL COMMENT 'Appointment date',
    `scheduled_start_time` TIME NOT NULL COMMENT 'Start time',
    `scheduled_end_time` TIME NOT NULL COMMENT 'End time',
    `duration_minutes` SMALLINT UNSIGNED DEFAULT 30,
    
    -- Consultation Type
    `consultation_type` ENUM('audio', 'video', 'chat') NOT NULL DEFAULT 'audio',
    
    -- Status Management
    `status` ENUM(
        'pending',           -- Farmer requested, waiting for expert
        'approved',          -- Expert approved
        'rejected',          -- Expert rejected
        'rescheduled',       -- Expert proposed new time
        'confirmed',         -- Farmer confirmed rescheduled time
        'in_progress',       -- Call/chat ongoing
        'completed',         -- Consultation finished
        'cancelled',         -- Either party cancelled
        'no_show_farmer',    -- Farmer didn't join
        'no_show_expert'     -- Expert didn't join
    ) NOT NULL DEFAULT 'pending',
    
    -- Problem Details
    `topic` VARCHAR(150) NOT NULL COMMENT 'Main topic/subject',
    `problem_description` TEXT NOT NULL COMMENT 'Detailed problem description',
    `crop_type` VARCHAR(100) DEFAULT NULL COMMENT 'Related crop (if any)',
    `urgency` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    -- Rescheduling (if expert proposes new time)
    `proposed_date` DATE DEFAULT NULL,
    `proposed_start_time` TIME DEFAULT NULL,
    `proposed_end_time` TIME DEFAULT NULL,
    `reschedule_reason` VARCHAR(255) DEFAULT NULL,
    `reschedule_count` TINYINT UNSIGNED DEFAULT 0,
    
    -- Notes
    `farmer_notes` TEXT DEFAULT NULL,
    `expert_notes` TEXT DEFAULT NULL,
    `cancellation_reason` VARCHAR(255) DEFAULT NULL,
    `cancelled_by` INT(11) DEFAULT NULL,
    
    -- Call Room Details (for Agora)
    `room_id` VARCHAR(100) DEFAULT NULL COMMENT 'Unique room ID for call',
    `agora_channel` VARCHAR(100) DEFAULT NULL COMMENT 'Agora channel name',
    `agora_token` TEXT DEFAULT NULL COMMENT 'Agora access token',
    `token_expiry` TIMESTAMP NULL DEFAULT NULL,
    
    -- Timestamps
    `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `responded_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'When expert responded',
    `started_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'When call/chat started',
    `ended_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'When call/chat ended',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`appointment_id`),
    UNIQUE KEY `uk_appointment_code` (`appointment_code`),
    UNIQUE KEY `uk_room_id` (`room_id`),
    KEY `idx_appointment_farmer` (`farmer_id`),
    KEY `idx_appointment_expert` (`expert_id`),
    KEY `idx_appointment_date` (`scheduled_date`),
    KEY `idx_appointment_status` (`status`),
    KEY `idx_appointment_datetime` (`scheduled_date`, `scheduled_start_time`),
    CONSTRAINT `fk_appointment_farmer` FOREIGN KEY (`farmer_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_appointment_expert` FOREIGN KEY (`expert_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Main consultation appointment bookings';

-- =====================================================
-- 📋 TABLE 4: consultation_messages
-- Purpose: Chat/messaging system between farmer & expert
-- =====================================================
CREATE TABLE IF NOT EXISTS `consultation_messages` (
    `message_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_id` INT(11) UNSIGNED DEFAULT NULL COMMENT 'FK to appointment (optional)',
    `conversation_id` VARCHAR(50) NOT NULL COMMENT 'Unique conversation ID',
    `sender_id` INT(11) NOT NULL,
    `receiver_id` INT(11) NOT NULL,
    
    -- Message Content
    `message_type` ENUM('text', 'image', 'audio', 'file', 'system') NOT NULL DEFAULT 'text',
    `content` TEXT NOT NULL,
    `attachment_url` VARCHAR(500) DEFAULT NULL,
    `attachment_type` VARCHAR(50) DEFAULT NULL COMMENT 'MIME type',
    `attachment_name` VARCHAR(255) DEFAULT NULL,
    `attachment_size` INT UNSIGNED DEFAULT NULL COMMENT 'File size in bytes',
    
    -- Status
    `is_read` TINYINT(1) DEFAULT 0,
    `read_at` TIMESTAMP NULL DEFAULT NULL,
    `is_deleted` TINYINT(1) DEFAULT 0,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,
    `deleted_by` INT(11) DEFAULT NULL,
    
    -- Metadata
    `reply_to_message_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'For reply feature',
    `metadata` JSON DEFAULT NULL COMMENT 'Extra data (e.g., image dimensions)',
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`message_id`),
    KEY `idx_message_conversation` (`conversation_id`),
    KEY `idx_message_sender` (`sender_id`),
    KEY `idx_message_receiver` (`receiver_id`),
    KEY `idx_message_appointment` (`appointment_id`),
    KEY `idx_message_created` (`created_at`),
    KEY `idx_message_unread` (`receiver_id`, `is_read`),
    CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_message_appointment` FOREIGN KEY (`appointment_id`) 
        REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Chat messages between farmer and expert';

-- =====================================================
-- 📋 TABLE 5: consultation_calls
-- Purpose: Audio/Video call records (Agora integration)
-- =====================================================
CREATE TABLE IF NOT EXISTS `consultation_calls` (
    `call_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_id` INT(11) UNSIGNED NOT NULL,
    `caller_id` INT(11) NOT NULL COMMENT 'Who initiated the call',
    `callee_id` INT(11) NOT NULL COMMENT 'Who received the call',
    
    -- Call Details
    `call_type` ENUM('audio', 'video') NOT NULL,
    `call_status` ENUM(
        'ringing',
        'answered',
        'busy',
        'rejected',
        'missed',
        'ended',
        'failed'
    ) NOT NULL DEFAULT 'ringing',
    
    -- Agora Details
    `agora_channel` VARCHAR(100) NOT NULL,
    `agora_app_id` VARCHAR(50) DEFAULT NULL,
    `caller_uid` INT UNSIGNED DEFAULT NULL COMMENT 'Agora UID for caller',
    `callee_uid` INT UNSIGNED DEFAULT NULL COMMENT 'Agora UID for callee',
    
    -- Duration & Quality
    `duration_seconds` INT UNSIGNED DEFAULT 0,
    `max_duration_seconds` INT UNSIGNED DEFAULT 1200 COMMENT 'Default 20 min limit',
    `quality_score` DECIMAL(3,2) DEFAULT NULL COMMENT 'Call quality 0-5',
    
    -- Timestamps
    `initiated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `answered_at` TIMESTAMP NULL DEFAULT NULL,
    `ended_at` TIMESTAMP NULL DEFAULT NULL,
    `end_reason` ENUM('normal', 'timeout', 'network_error', 'user_hangup', 'system') DEFAULT NULL,
    
    -- Recording (optional future feature)
    `is_recorded` TINYINT(1) DEFAULT 0,
    `recording_url` VARCHAR(500) DEFAULT NULL,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`call_id`),
    KEY `idx_call_appointment` (`appointment_id`),
    KEY `idx_call_caller` (`caller_id`),
    KEY `idx_call_callee` (`callee_id`),
    KEY `idx_call_status` (`call_status`),
    KEY `idx_call_channel` (`agora_channel`),
    CONSTRAINT `fk_call_appointment` FOREIGN KEY (`appointment_id`) 
        REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_call_caller` FOREIGN KEY (`caller_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_call_callee` FOREIGN KEY (`callee_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audio/Video call records with Agora';

-- =====================================================
-- 📋 TABLE 6: consultation_feedback
-- Purpose: Farmer ratings & reviews for experts
-- =====================================================
CREATE TABLE IF NOT EXISTS `consultation_feedback` (
    `feedback_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_id` INT(11) UNSIGNED NOT NULL,
    `farmer_id` INT(11) NOT NULL,
    `expert_id` INT(11) NOT NULL,
    
    -- Ratings (1-5 stars)
    `overall_rating` TINYINT UNSIGNED NOT NULL COMMENT '1-5 stars',
    `communication_rating` TINYINT UNSIGNED DEFAULT NULL COMMENT '1-5 stars',
    `knowledge_rating` TINYINT UNSIGNED DEFAULT NULL COMMENT '1-5 stars',
    `helpfulness_rating` TINYINT UNSIGNED DEFAULT NULL COMMENT '1-5 stars',
    
    -- Review
    `review_text` TEXT DEFAULT NULL,
    `review_text_bn` TEXT DEFAULT NULL COMMENT 'Bangla review',
    
    -- Moderation
    `is_approved` TINYINT(1) DEFAULT 1 COMMENT 'Admin moderation',
    `is_public` TINYINT(1) DEFAULT 1 COMMENT 'Show on expert profile',
    `admin_notes` VARCHAR(255) DEFAULT NULL,
    
    -- Response from Expert
    `expert_response` TEXT DEFAULT NULL,
    `response_at` TIMESTAMP NULL DEFAULT NULL,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`feedback_id`),
    UNIQUE KEY `uk_feedback_appointment` (`appointment_id`),
    KEY `idx_feedback_farmer` (`farmer_id`),
    KEY `idx_feedback_expert` (`expert_id`),
    KEY `idx_feedback_rating` (`overall_rating`),
    CONSTRAINT `fk_feedback_appointment` FOREIGN KEY (`appointment_id`) 
        REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_feedback_farmer` FOREIGN KEY (`farmer_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_feedback_expert` FOREIGN KEY (`expert_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `chk_overall_rating` CHECK (`overall_rating` BETWEEN 1 AND 5),
    CONSTRAINT `chk_communication_rating` CHECK (`communication_rating` IS NULL OR `communication_rating` BETWEEN 1 AND 5),
    CONSTRAINT `chk_knowledge_rating` CHECK (`knowledge_rating` IS NULL OR `knowledge_rating` BETWEEN 1 AND 5),
    CONSTRAINT `chk_helpfulness_rating` CHECK (`helpfulness_rating` IS NULL OR `helpfulness_rating` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Farmer feedback and ratings for consultations';

-- =====================================================
-- 📋 TABLE 7: consultation_prescriptions
-- Purpose: Expert advice/prescription after consultation
-- =====================================================
CREATE TABLE IF NOT EXISTS `consultation_prescriptions` (
    `prescription_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_id` INT(11) UNSIGNED NOT NULL,
    `expert_id` INT(11) NOT NULL,
    `farmer_id` INT(11) NOT NULL,
    
    -- Diagnosis
    `diagnosis` TEXT NOT NULL COMMENT 'Problem diagnosis',
    `diagnosis_bn` TEXT DEFAULT NULL COMMENT 'Bangla diagnosis',
    
    -- Prescription/Advice
    `prescription` TEXT NOT NULL COMMENT 'Recommended treatment/action',
    `prescription_bn` TEXT DEFAULT NULL COMMENT 'Bangla prescription',
    
    -- Recommendations (JSON array)
    `recommended_products` JSON DEFAULT NULL COMMENT '[{"name": "...", "dosage": "...", "usage": "..."}]',
    `recommended_actions` JSON DEFAULT NULL COMMENT '["action1", "action2"]',
    
    -- Follow-up
    `follow_up_needed` TINYINT(1) DEFAULT 0,
    `follow_up_date` DATE DEFAULT NULL,
    `follow_up_notes` TEXT DEFAULT NULL,
    
    -- Severity
    `severity` ENUM('mild', 'moderate', 'severe', 'critical') DEFAULT 'moderate',
    
    -- Attachments
    `attachments` JSON DEFAULT NULL COMMENT 'Array of attachment URLs',
    
    -- Status
    `is_sent_to_farmer` TINYINT(1) DEFAULT 1,
    `is_read_by_farmer` TINYINT(1) DEFAULT 0,
    `read_at` TIMESTAMP NULL DEFAULT NULL,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`prescription_id`),
    KEY `idx_prescription_appointment` (`appointment_id`),
    KEY `idx_prescription_expert` (`expert_id`),
    KEY `idx_prescription_farmer` (`farmer_id`),
    CONSTRAINT `fk_prescription_appointment` FOREIGN KEY (`appointment_id`) 
        REFERENCES `consultation_appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_prescription_expert` FOREIGN KEY (`expert_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_prescription_farmer` FOREIGN KEY (`farmer_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Expert prescriptions and advice after consultation';

-- =====================================================
-- 📋 TABLE 8: notification_tokens
-- Purpose: Push notification device tokens (FCM/APNs)
-- =====================================================
CREATE TABLE IF NOT EXISTS `notification_tokens` (
    `token_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `device_token` VARCHAR(500) NOT NULL COMMENT 'FCM/APNs token',
    `device_type` ENUM('android', 'ios', 'web') NOT NULL,
    `device_id` VARCHAR(100) DEFAULT NULL COMMENT 'Unique device identifier',
    `device_name` VARCHAR(100) DEFAULT NULL,
    `app_version` VARCHAR(20) DEFAULT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `last_used_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`token_id`),
    UNIQUE KEY `uk_user_device` (`user_id`, `device_token`(255)),
    KEY `idx_token_user` (`user_id`),
    KEY `idx_token_active` (`is_active`),
    CONSTRAINT `fk_token_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Push notification device tokens';

-- =====================================================
-- 📋 TABLE 9: notification_queue
-- Purpose: Queue for sending notifications (background job)
-- =====================================================
CREATE TABLE IF NOT EXISTS `notification_queue` (
    `queue_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `notification_type` VARCHAR(50) NOT NULL COMMENT 'appointment_request, call_reminder, etc.',
    `channel` ENUM('push', 'sms', 'email', 'in_app') NOT NULL DEFAULT 'push',
    
    -- Content
    `title` VARCHAR(255) NOT NULL,
    `title_bn` VARCHAR(255) DEFAULT NULL,
    `body` TEXT NOT NULL,
    `body_bn` TEXT DEFAULT NULL,
    `data` JSON DEFAULT NULL COMMENT 'Extra payload data',
    `image_url` VARCHAR(500) DEFAULT NULL,
    
    -- Scheduling
    `scheduled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When to send',
    `priority` ENUM('low', 'normal', 'high') DEFAULT 'normal',
    
    -- Status
    `status` ENUM('pending', 'sent', 'failed', 'cancelled') DEFAULT 'pending',
    `attempts` TINYINT UNSIGNED DEFAULT 0,
    `max_attempts` TINYINT UNSIGNED DEFAULT 3,
    `sent_at` TIMESTAMP NULL DEFAULT NULL,
    `error_message` TEXT DEFAULT NULL,
    
    -- Reference
    `related_entity_type` VARCHAR(50) DEFAULT NULL COMMENT 'appointment, message, etc.',
    `related_entity_id` VARCHAR(50) DEFAULT NULL,
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`queue_id`),
    KEY `idx_queue_user` (`user_id`),
    KEY `idx_queue_status` (`status`),
    KEY `idx_queue_scheduled` (`scheduled_at`, `status`),
    KEY `idx_queue_type` (`notification_type`),
    CONSTRAINT `fk_queue_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notification sending queue';

-- =====================================================
-- 📋 TABLE 10: conversation_participants
-- Purpose: Track who's in each conversation
-- =====================================================
CREATE TABLE IF NOT EXISTS `conversation_participants` (
    `participant_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `conversation_id` VARCHAR(50) NOT NULL,
    `user_id` INT(11) NOT NULL,
    `role` ENUM('farmer', 'expert') NOT NULL,
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_read_at` TIMESTAMP NULL DEFAULT NULL,
    `last_message_id` BIGINT UNSIGNED DEFAULT NULL,
    `is_muted` TINYINT(1) DEFAULT 0,
    `is_blocked` TINYINT(1) DEFAULT 0,
    `is_archived` TINYINT(1) DEFAULT 0,
    
    PRIMARY KEY (`participant_id`),
    UNIQUE KEY `uk_conversation_user` (`conversation_id`, `user_id`),
    KEY `idx_participant_user` (`user_id`),
    KEY `idx_participant_conversation` (`conversation_id`),
    CONSTRAINT `fk_participant_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Conversation participants tracking';

-- =====================================================
-- 🔄 UPDATE EXISTING TABLES
-- =====================================================

-- Update expert_qualifications table with new columns
ALTER TABLE `expert_qualifications`
    ADD COLUMN IF NOT EXISTS `is_available_for_consultation` TINYINT(1) DEFAULT 1 
        COMMENT 'Is expert accepting new consultations',
    ADD COLUMN IF NOT EXISTS `response_time_hours` TINYINT UNSIGNED DEFAULT 24 
        COMMENT 'Typical response time in hours',
    ADD COLUMN IF NOT EXISTS `total_audio_calls` SMALLINT UNSIGNED DEFAULT 0,
    ADD COLUMN IF NOT EXISTS `total_video_calls` SMALLINT UNSIGNED DEFAULT 0,
    ADD COLUMN IF NOT EXISTS `total_chat_sessions` SMALLINT UNSIGNED DEFAULT 0,
    ADD COLUMN IF NOT EXISTS `average_rating` DECIMAL(3,2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS `total_reviews` SMALLINT UNSIGNED DEFAULT 0,
    ADD COLUMN IF NOT EXISTS `bio` TEXT DEFAULT NULL COMMENT 'Expert bio/introduction',
    ADD COLUMN IF NOT EXISTS `bio_bn` TEXT DEFAULT NULL COMMENT 'Bangla bio',
    ADD COLUMN IF NOT EXISTS `languages` JSON DEFAULT NULL COMMENT '["bangla", "english"]';

-- Update notifications table with new notification types
ALTER TABLE `notifications`
    ADD COLUMN IF NOT EXISTS `notification_category` ENUM(
        'system',
        'appointment', 
        'message',
        'call',
        'reminder',
        'feedback',
        'prescription',
        'marketing'
    ) DEFAULT 'system' AFTER `notification_type`,
    ADD COLUMN IF NOT EXISTS `priority` ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS `action_url` VARCHAR(255) DEFAULT NULL COMMENT 'Deep link URL',
    ADD COLUMN IF NOT EXISTS `action_type` VARCHAR(50) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(500) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS `expires_at` TIMESTAMP NULL DEFAULT NULL;

-- =====================================================
-- 📊 VIEWS FOR EASY QUERYING
-- =====================================================

-- View: Expert dashboard summary
CREATE OR REPLACE VIEW `v_expert_consultation_summary` AS
SELECT 
    u.user_id AS expert_id,
    up.full_name AS expert_name,
    eq.specialization,
    eq.rating,
    eq.total_consultations,
    eq.average_rating,
    eq.total_reviews,
    COUNT(CASE WHEN ca.status = 'pending' THEN 1 END) AS pending_appointments,
    COUNT(CASE WHEN ca.status = 'approved' THEN 1 END) AS upcoming_appointments,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) AS completed_appointments,
    COUNT(CASE WHEN ca.status IN ('pending', 'approved') AND ca.scheduled_date = CURDATE() THEN 1 END) AS today_appointments
FROM users u
LEFT JOIN user_profiles up ON u.user_id = up.user_id
LEFT JOIN expert_qualifications eq ON u.user_id = eq.user_id
LEFT JOIN consultation_appointments ca ON u.user_id = ca.expert_id
WHERE u.user_type = 'expert'
GROUP BY u.user_id;

-- View: Farmer's consultation history
CREATE OR REPLACE VIEW `v_farmer_consultations` AS
SELECT 
    ca.appointment_id,
    ca.appointment_code,
    ca.farmer_id,
    ca.expert_id,
    up_farmer.full_name AS farmer_name,
    up_expert.full_name AS expert_name,
    eq.specialization AS expert_specialization,
    ca.scheduled_date,
    ca.scheduled_start_time,
    ca.scheduled_end_time,
    ca.consultation_type,
    ca.status,
    ca.topic,
    ca.urgency,
    cf.overall_rating AS farmer_rating,
    cf.review_text AS farmer_review,
    ca.created_at
FROM consultation_appointments ca
LEFT JOIN user_profiles up_farmer ON ca.farmer_id = up_farmer.user_id
LEFT JOIN user_profiles up_expert ON ca.expert_id = up_expert.user_id
LEFT JOIN expert_qualifications eq ON ca.expert_id = eq.user_id
LEFT JOIN consultation_feedback cf ON ca.appointment_id = cf.appointment_id;

-- View: Today's appointments
CREATE OR REPLACE VIEW `v_today_appointments` AS
SELECT 
    ca.*,
    up_farmer.full_name AS farmer_name,
    up_expert.full_name AS expert_name
FROM consultation_appointments ca
LEFT JOIN user_profiles up_farmer ON ca.farmer_id = up_farmer.user_id
LEFT JOIN user_profiles up_expert ON ca.expert_id = up_expert.user_id
WHERE ca.scheduled_date = CURDATE()
    AND ca.status IN ('approved', 'confirmed')
ORDER BY ca.scheduled_start_time;

-- View: Unread message counts per conversation
CREATE OR REPLACE VIEW `v_unread_messages` AS
SELECT 
    cm.receiver_id AS user_id,
    cm.conversation_id,
    COUNT(*) AS unread_count,
    MAX(cm.created_at) AS last_message_at
FROM consultation_messages cm
WHERE cm.is_read = 0 AND cm.is_deleted = 0
GROUP BY cm.receiver_id, cm.conversation_id;

-- View: Expert availability for today
CREATE OR REPLACE VIEW `v_expert_availability_today` AS
SELECT 
    ea.expert_id,
    up.full_name AS expert_name,
    eq.specialization,
    ea.start_time,
    ea.end_time,
    ea.slot_duration_minutes,
    ea.consultation_types,
    CASE 
        WHEN eud.unavailable_id IS NOT NULL THEN 0
        ELSE ea.is_available 
    END AS is_available_today
FROM expert_availability ea
LEFT JOIN user_profiles up ON ea.expert_id = up.user_id
LEFT JOIN expert_qualifications eq ON ea.expert_id = eq.user_id
LEFT JOIN expert_unavailable_dates eud ON ea.expert_id = eud.expert_id AND eud.unavailable_date = CURDATE()
WHERE ea.day_of_week = LOWER(DAYNAME(CURDATE()));

-- =====================================================
-- 🔧 TRIGGERS FOR AUTOMATION
-- =====================================================

-- Trigger: Generate appointment code on insert
DELIMITER //
CREATE TRIGGER IF NOT EXISTS `trg_generate_appointment_code`
BEFORE INSERT ON `consultation_appointments`
FOR EACH ROW
BEGIN
    IF NEW.appointment_code IS NULL OR NEW.appointment_code = '' THEN
        SET NEW.appointment_code = CONCAT(
            'APT-',
            YEAR(CURDATE()),
            '-',
            LPAD((SELECT COALESCE(MAX(appointment_id), 0) + 1 FROM consultation_appointments), 5, '0')
        );
    END IF;
    
    IF NEW.room_id IS NULL OR NEW.room_id = '' THEN
        SET NEW.room_id = CONCAT('room_', UUID_SHORT());
    END IF;
END//
DELIMITER ;

-- Trigger: Update expert stats after consultation completion
DELIMITER //
CREATE TRIGGER IF NOT EXISTS `trg_update_expert_stats`
AFTER UPDATE ON `consultation_appointments`
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE expert_qualifications 
        SET 
            total_consultations = total_consultations + 1,
            total_audio_calls = total_audio_calls + IF(NEW.consultation_type = 'audio', 1, 0),
            total_video_calls = total_video_calls + IF(NEW.consultation_type = 'video', 1, 0),
            total_chat_sessions = total_chat_sessions + IF(NEW.consultation_type = 'chat', 1, 0)
        WHERE user_id = NEW.expert_id;
    END IF;
END//
DELIMITER ;

-- Trigger: Update expert rating after feedback
DELIMITER //
CREATE TRIGGER IF NOT EXISTS `trg_update_expert_rating`
AFTER INSERT ON `consultation_feedback`
FOR EACH ROW
BEGIN
    UPDATE expert_qualifications 
    SET 
        average_rating = (
            SELECT AVG(overall_rating) 
            FROM consultation_feedback 
            WHERE expert_id = NEW.expert_id AND is_approved = 1
        ),
        total_reviews = total_reviews + 1
    WHERE user_id = NEW.expert_id;
END//
DELIMITER ;

-- Trigger: Create notification on appointment status change
DELIMITER //
CREATE TRIGGER IF NOT EXISTS `trg_appointment_notification`
AFTER UPDATE ON `consultation_appointments`
FOR EACH ROW
BEGIN
    -- When expert approves
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (
            notification_type, notification_category, title, message, 
            related_entity_id, sender_id, recipient_id, priority
        ) VALUES (
            'appointment_approved', 'appointment',
            'অ্যাপয়েন্টমেন্ট অনুমোদিত হয়েছে',
            CONCAT('আপনার পরামর্শ সেশন ', DATE_FORMAT(NEW.scheduled_date, '%d-%m-%Y'), ' তারিখে ', 
                   TIME_FORMAT(NEW.scheduled_start_time, '%h:%i %p'), ' এ নির্ধারিত হয়েছে।'),
            NEW.appointment_id, NEW.expert_id, NEW.farmer_id, 'high'
        );
    END IF;
    
    -- When expert rejects
    IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (
            notification_type, notification_category, title, message, 
            related_entity_id, sender_id, recipient_id, priority
        ) VALUES (
            'appointment_rejected', 'appointment',
            'অ্যাপয়েন্টমেন্ট প্রত্যাখ্যান করা হয়েছে',
            'দুঃখিত, আপনার অ্যাপয়েন্টমেন্ট প্রত্যাখ্যান করা হয়েছে। অন্য সময় বা অন্য বিশেষজ্ঞ নির্বাচন করুন।',
            NEW.appointment_id, NEW.expert_id, NEW.farmer_id, 'normal'
        );
    END IF;
    
    -- When expert reschedules
    IF NEW.status = 'rescheduled' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (
            notification_type, notification_category, title, message, 
            related_entity_id, sender_id, recipient_id, priority
        ) VALUES (
            'appointment_rescheduled', 'appointment',
            'নতুন সময় প্রস্তাব করা হয়েছে',
            CONCAT('বিশেষজ্ঞ নতুন সময় প্রস্তাব করেছেন: ', DATE_FORMAT(NEW.proposed_date, '%d-%m-%Y'), 
                   ' তারিখে ', TIME_FORMAT(NEW.proposed_start_time, '%h:%i %p'), '। অনুগ্রহ করে নিশ্চিত করুন।'),
            NEW.appointment_id, NEW.expert_id, NEW.farmer_id, 'high'
        );
    END IF;
END//
DELIMITER ;

-- =====================================================
-- 📊 STORED PROCEDURES
-- =====================================================

-- Procedure: Get available time slots for an expert on a specific date
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `sp_get_expert_available_slots`(
    IN p_expert_id INT,
    IN p_date DATE
)
BEGIN
    DECLARE v_day_name VARCHAR(20);
    SET v_day_name = LOWER(DAYNAME(p_date));
    
    -- Check if expert is unavailable on this date
    IF EXISTS (
        SELECT 1 FROM expert_unavailable_dates 
        WHERE expert_id = p_expert_id AND unavailable_date = p_date
    ) THEN
        SELECT 'Expert is unavailable on this date' AS message, 0 AS success;
    ELSE
        -- Get available slots that are not already booked
        SELECT 
            ea.availability_id,
            ea.start_time,
            ea.end_time,
            ea.slot_duration_minutes,
            ea.consultation_types,
            CASE 
                WHEN ca.appointment_id IS NOT NULL THEN 0 
                ELSE 1 
            END AS is_available
        FROM expert_availability ea
        LEFT JOIN consultation_appointments ca ON 
            ea.expert_id = ca.expert_id 
            AND ca.scheduled_date = p_date
            AND ca.scheduled_start_time = ea.start_time
            AND ca.status IN ('pending', 'approved', 'confirmed')
        WHERE ea.expert_id = p_expert_id 
            AND ea.day_of_week = v_day_name
            AND ea.is_available = 1
        ORDER BY ea.start_time;
    END IF;
END//
DELIMITER ;

-- Procedure: Book an appointment
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `sp_book_appointment`(
    IN p_farmer_id INT,
    IN p_expert_id INT,
    IN p_date DATE,
    IN p_start_time TIME,
    IN p_end_time TIME,
    IN p_consultation_type ENUM('audio', 'video', 'chat'),
    IN p_topic VARCHAR(150),
    IN p_problem_description TEXT,
    IN p_crop_type VARCHAR(100),
    IN p_urgency ENUM('low', 'medium', 'high', 'urgent'),
    OUT p_appointment_id INT,
    OUT p_success TINYINT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_slot_exists INT DEFAULT 0;
    DECLARE v_already_booked INT DEFAULT 0;
    
    -- Check if slot exists
    SELECT COUNT(*) INTO v_slot_exists
    FROM expert_availability
    WHERE expert_id = p_expert_id 
        AND day_of_week = LOWER(DAYNAME(p_date))
        AND start_time = p_start_time
        AND is_available = 1;
    
    IF v_slot_exists = 0 THEN
        SET p_success = 0;
        SET p_message = 'Selected time slot is not available';
        SET p_appointment_id = 0;
    ELSE
        -- Check if already booked
        SELECT COUNT(*) INTO v_already_booked
        FROM consultation_appointments
        WHERE expert_id = p_expert_id 
            AND scheduled_date = p_date
            AND scheduled_start_time = p_start_time
            AND status IN ('pending', 'approved', 'confirmed');
        
        IF v_already_booked > 0 THEN
            SET p_success = 0;
            SET p_message = 'This time slot is already booked';
            SET p_appointment_id = 0;
        ELSE
            -- Insert appointment
            INSERT INTO consultation_appointments (
                farmer_id, expert_id, scheduled_date, scheduled_start_time, 
                scheduled_end_time, consultation_type, topic, problem_description,
                crop_type, urgency, status
            ) VALUES (
                p_farmer_id, p_expert_id, p_date, p_start_time, 
                p_end_time, p_consultation_type, p_topic, p_problem_description,
                p_crop_type, p_urgency, 'pending'
            );
            
            SET p_appointment_id = LAST_INSERT_ID();
            SET p_success = 1;
            SET p_message = 'Appointment request submitted successfully';
            
            -- Create notification for expert
            INSERT INTO notifications (
                notification_type, notification_category, title, message, 
                related_entity_id, sender_id, recipient_id, priority
            ) VALUES (
                'new_appointment_request', 'appointment',
                'নতুন পরামর্শ অনুরোধ',
                CONCAT('একজন কৃষক ', DATE_FORMAT(p_date, '%d-%m-%Y'), ' তারিখে পরামর্শ চাইছেন। বিষয়: ', p_topic),
                p_appointment_id, p_farmer_id, p_expert_id, 
                CASE p_urgency WHEN 'urgent' THEN 'urgent' WHEN 'high' THEN 'high' ELSE 'normal' END
            );
        END IF;
    END IF;
END//
DELIMITER ;

-- Procedure: Send a message
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `sp_send_message`(
    IN p_sender_id INT,
    IN p_receiver_id INT,
    IN p_appointment_id INT,
    IN p_message_type ENUM('text', 'image', 'audio', 'file', 'system'),
    IN p_content TEXT,
    IN p_attachment_url VARCHAR(500),
    OUT p_message_id BIGINT,
    OUT p_conversation_id VARCHAR(50)
)
BEGIN
    -- Generate conversation ID (smaller ID first for consistency)
    IF p_sender_id < p_receiver_id THEN
        SET p_conversation_id = CONCAT('conv_', p_sender_id, '_', p_receiver_id);
    ELSE
        SET p_conversation_id = CONCAT('conv_', p_receiver_id, '_', p_sender_id);
    END IF;
    
    -- Insert message
    INSERT INTO consultation_messages (
        appointment_id, conversation_id, sender_id, receiver_id,
        message_type, content, attachment_url
    ) VALUES (
        p_appointment_id, p_conversation_id, p_sender_id, p_receiver_id,
        p_message_type, p_content, p_attachment_url
    );
    
    SET p_message_id = LAST_INSERT_ID();
    
    -- Ensure both participants are in conversation
    INSERT IGNORE INTO conversation_participants (conversation_id, user_id, role)
    SELECT p_conversation_id, p_sender_id, 
           CASE WHEN u.user_type = 'farmer' THEN 'farmer' ELSE 'expert' END
    FROM users u WHERE u.user_id = p_sender_id;
    
    INSERT IGNORE INTO conversation_participants (conversation_id, user_id, role)
    SELECT p_conversation_id, p_receiver_id,
           CASE WHEN u.user_type = 'farmer' THEN 'farmer' ELSE 'expert' END
    FROM users u WHERE u.user_id = p_receiver_id;
    
    -- Create notification for receiver
    INSERT INTO notifications (
        notification_type, notification_category, title, message, 
        related_entity_id, sender_id, recipient_id, priority
    ) 
    SELECT 
        'new_message', 'message',
        CONCAT(up.full_name, ' থেকে নতুন মেসেজ'),
        LEFT(p_content, 100),
        p_message_id, p_sender_id, p_receiver_id, 'normal'
    FROM user_profiles up WHERE up.user_id = p_sender_id;
END//
DELIMITER ;

-- =====================================================
-- 📅 EVENTS FOR SCHEDULED TASKS
-- =====================================================

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Event: Send reminder 30 mins before appointment
DELIMITER //
CREATE EVENT IF NOT EXISTS `evt_appointment_reminder`
ON SCHEDULE EVERY 5 MINUTE
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Insert reminders for appointments starting in 30 minutes
    INSERT INTO notification_queue (
        user_id, notification_type, channel, title, title_bn, body, body_bn,
        related_entity_type, related_entity_id, priority, scheduled_at
    )
    SELECT 
        ca.farmer_id,
        'appointment_reminder',
        'push',
        'Appointment Reminder',
        'অ্যাপয়েন্টমেন্ট রিমাইন্ডার',
        CONCAT('Your consultation with expert starts in 30 minutes'),
        CONCAT('আপনার পরামর্শ সেশন ৩০ মিনিটের মধ্যে শুরু হবে'),
        'appointment',
        ca.appointment_id,
        'high',
        NOW()
    FROM consultation_appointments ca
    WHERE ca.status IN ('approved', 'confirmed')
        AND ca.scheduled_date = CURDATE()
        AND TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(ca.scheduled_date, ' ', ca.scheduled_start_time)) BETWEEN 29 AND 31
        AND NOT EXISTS (
            SELECT 1 FROM notification_queue nq 
            WHERE nq.related_entity_id = ca.appointment_id 
                AND nq.notification_type = 'appointment_reminder'
                AND nq.user_id = ca.farmer_id
        );
    
    -- Same for expert
    INSERT INTO notification_queue (
        user_id, notification_type, channel, title, title_bn, body, body_bn,
        related_entity_type, related_entity_id, priority, scheduled_at
    )
    SELECT 
        ca.expert_id,
        'appointment_reminder',
        'push',
        'Appointment Reminder',
        'অ্যাপয়েন্টমেন্ট রিমাইন্ডার',
        CONCAT('Consultation with farmer starts in 30 minutes'),
        CONCAT('একজন কৃষকের সাথে আপনার পরামর্শ সেশন ৩০ মিনিটের মধ্যে শুরু হবে'),
        'appointment',
        ca.appointment_id,
        'high',
        NOW()
    FROM consultation_appointments ca
    WHERE ca.status IN ('approved', 'confirmed')
        AND ca.scheduled_date = CURDATE()
        AND TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(ca.scheduled_date, ' ', ca.scheduled_start_time)) BETWEEN 29 AND 31
        AND NOT EXISTS (
            SELECT 1 FROM notification_queue nq 
            WHERE nq.related_entity_id = ca.appointment_id 
                AND nq.notification_type = 'appointment_reminder'
                AND nq.user_id = ca.expert_id
        );
END//
DELIMITER ;

-- Event: Clean up old notification queue entries
DELIMITER //
CREATE EVENT IF NOT EXISTS `evt_cleanup_notification_queue`
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 HOUR
DO
BEGIN
    DELETE FROM notification_queue 
    WHERE status IN ('sent', 'cancelled') 
        AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
END//
DELIMITER ;

-- =====================================================
-- 📊 INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX IF NOT EXISTS `idx_appointments_expert_date` 
    ON `consultation_appointments` (`expert_id`, `scheduled_date`, `status`);

CREATE INDEX IF NOT EXISTS `idx_messages_unread` 
    ON `consultation_messages` (`receiver_id`, `is_read`, `created_at`);

CREATE INDEX IF NOT EXISTS `idx_feedback_expert_approved` 
    ON `consultation_feedback` (`expert_id`, `is_approved`, `overall_rating`);

-- =====================================================
-- 🎯 SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample availability for expert (user_id = 62)
INSERT INTO `expert_availability` (`expert_id`, `day_of_week`, `start_time`, `end_time`, `slot_duration_minutes`, `consultation_types`) VALUES
(62, 'saturday', '09:00:00', '09:30:00', 30, '["audio", "video", "chat"]'),
(62, 'saturday', '09:30:00', '10:00:00', 30, '["audio", "video", "chat"]'),
(62, 'saturday', '10:00:00', '10:30:00', 30, '["audio", "video", "chat"]'),
(62, 'saturday', '19:00:00', '19:30:00', 30, '["audio", "video", "chat"]'),
(62, 'saturday', '19:30:00', '20:00:00', 30, '["audio", "video", "chat"]'),
(62, 'sunday', '09:00:00', '09:30:00', 30, '["audio", "video", "chat"]'),
(62, 'sunday', '09:30:00', '10:00:00', 30, '["audio", "video", "chat"]'),
(62, 'sunday', '19:00:00', '19:30:00', 30, '["audio", "video", "chat"]'),
(62, 'monday', '19:00:00', '19:30:00', 30, '["audio", "video", "chat"]'),
(62, 'monday', '19:30:00', '20:00:00', 30, '["audio", "video", "chat"]'),
(62, 'tuesday', '19:00:00', '19:30:00', 30, '["audio", "video", "chat"]'),
(62, 'wednesday', '19:00:00', '19:30:00', 30, '["audio", "video", "chat"]'),
(62, 'thursday', '19:00:00', '19:30:00', 30, '["audio", "video", "chat"]');

COMMIT;

-- =====================================================
-- ✅ MIGRATION COMPLETE
-- =====================================================
-- 
-- Summary of changes:
-- 1. Created 10 new tables for consultation system
-- 2. Updated expert_qualifications with new columns
-- 3. Enhanced notifications table
-- 4. Created 5 helpful views
-- 5. Created 4 triggers for automation
-- 6. Created 3 stored procedures
-- 7. Created 2 scheduled events
-- 8. Added performance indexes
-- 
-- Next Steps:
-- 1. Run this migration on your database
-- 2. Create Laravel/PHP API endpoints
-- 3. Implement frontend UI components
-- 4. Set up Agora SDK for calls
-- 5. Configure push notifications (FCM)
-- =====================================================
