-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema langol_krishi_sahayak
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema langol_krishi_sahayak
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `langol_krishi_sahayak` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `langol_krishi_sahayak` ;

-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `user_type` ENUM('farmer', 'expert', 'customer', 'data_operator') NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `is_verified` TINYINT(1) NULL DEFAULT '0',
  `is_active` TINYINT(1) NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `phone` (`phone` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  INDEX `idx_users_phone` (`phone` ASC) VISIBLE,
  INDEX `idx_users_type` (`user_type` ASC) VISIBLE,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `phone` (`phone` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  INDEX `idx_users_phone` (`phone` ASC) VISIBLE,
  INDEX `idx_users_type` (`user_type` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`post_tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`post_tags` (
  `tag_id` INT NOT NULL AUTO_INCREMENT,
  `tag_name` VARCHAR(100) NOT NULL,
  `usage_count` INT NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tag_id`),
  UNIQUE INDEX `tag_name` (`tag_name` ASC) VISIBLE,
  INDEX `idx_tag_name` (`tag_name` ASC) VISIBLE,
  INDEX `idx_tag_usage` (`usage_count` ASC) VISIBLE,
  PRIMARY KEY (`tag_id`),
  UNIQUE INDEX `tag_name` (`tag_name` ASC) VISIBLE,
  INDEX `idx_tag_name` (`tag_name` ASC) VISIBLE,
  INDEX `idx_tag_usage` (`usage_count` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`posts` (
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `author_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `post_type` ENUM('general', 'marketplace', 'question', 'advice', 'expert_advice') NULL DEFAULT 'general',
  `marketplace_listing_id` VARCHAR(36) NULL DEFAULT NULL,
  `images` JSON NULL DEFAULT NULL,
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `likes_count` INT NULL DEFAULT '0',
  `comments_count` INT NULL DEFAULT '0',
  `shares_count` INT NULL DEFAULT '0',
  `views_count` INT NULL DEFAULT '0',
  `is_pinned` TINYINT(1) NULL DEFAULT '0',
  `is_reported` TINYINT(1) NULL DEFAULT '0',
  `is_deleted` TINYINT(1) NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `post_tags_tag_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`post_id`),
  INDEX `idx_posts_author_date` (`author_id` ASC, `created_at` DESC) VISIBLE,
  INDEX `idx_posts_type` (`post_type` ASC) VISIBLE,
  INDEX `idx_posts_created` (`created_at` DESC) VISIBLE,
  INDEX `idx_posts_location` (`location` ASC) VISIBLE,
  INDEX `fk_posts_post_tags1_idx` (`post_tags_tag_id` ASC) VISIBLE,
  PRIMARY KEY (`post_id`),
  INDEX `idx_posts_author_date` (`author_id` ASC, `created_at` ASC) VISIBLE,
  INDEX `idx_posts_type` (`post_type` ASC) VISIBLE,
  INDEX `idx_posts_created` (`created_at` ASC) VISIBLE,
  INDEX `idx_posts_location` (`location` ASC) VISIBLE,
  INDEX `idx_posts_type_created` (`post_type` ASC, `created_at` ASC) VISIBLE,
  FULLTEXT INDEX `content` (`content`) VISIBLE,
  CONSTRAINT `posts_ibfk_1`
    FOREIGN KEY (`author_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_posts_post_tags1`
    FOREIGN KEY (`post_tags_tag_id`)
    REFERENCES `langol_krishi_sahayak`.`post_tags` (`tag_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `posts_ibfk_1`
    FOREIGN KEY (`author_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`comments` (
  `comment_id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `likes_count` INT NULL DEFAULT '0',
  `is_reported` TINYINT(1) NULL DEFAULT '0',
  `is_deleted` TINYINT(1) NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  INDEX `idx_comments_post` (`post_id` ASC) VISIBLE,
  INDEX `idx_comments_author` (`author_id` ASC) VISIBLE,
  PRIMARY KEY (`comment_id`),
  INDEX `idx_comments_post` (`post_id` ASC) VISIBLE,
  INDEX `idx_comments_author` (`author_id` ASC) VISIBLE,
  INDEX `idx_comments_parent` () VISIBLE,
  CONSTRAINT `comments_ibfk_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `langol_krishi_sahayak`.`posts` (`post_id`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2`
    FOREIGN KEY (`author_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `langol_krishi_sahayak`.`posts` (`post_id`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2`
    FOREIGN KEY (`author_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3`
    FOREIGN KEY ()
    REFERENCES `langol_krishi_sahayak`.`comments` ()
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`comment_likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`comment_likes` (
  `like_id` INT NOT NULL AUTO_INCREMENT,
  `comment_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `liked_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE INDEX `unique_comment_like` (`comment_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_comment_likes_comment` (`comment_id` ASC) VISIBLE,
  INDEX `idx_comment_likes_user` (`user_id` ASC) VISIBLE,
  PRIMARY KEY (`like_id`),
  UNIQUE INDEX `unique_comment_like` (`comment_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_comment_likes_comment` (`comment_id` ASC) VISIBLE,
  INDEX `idx_comment_likes_user` (`user_id` ASC) VISIBLE,
  CONSTRAINT `comment_likes_ibfk_1`
    FOREIGN KEY (`comment_id`)
    REFERENCES `langol_krishi_sahayak`.`comments` (`comment_id`)
    ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_1`
    FOREIGN KEY (`comment_id`)
    REFERENCES `langol_krishi_sahayak`.`comments` (`comment_id`)
    ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`consultations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`consultations` (
  `consultation_id` INT NOT NULL AUTO_INCREMENT,
  `farmer_id` INT NOT NULL,
  `expert_id` INT NULL DEFAULT NULL,
  `topic` VARCHAR(150) NULL DEFAULT NULL,
  `crop_type` VARCHAR(50) NULL DEFAULT NULL,
  `issue_description` TEXT NOT NULL,
  `priority` ENUM('low', 'medium', 'high') NULL DEFAULT 'medium',
  `status` ENUM('pending', 'in_progress', 'resolved', 'cancelled') NULL DEFAULT 'pending',
  `location` VARCHAR(100) NULL DEFAULT NULL,
  `images` JSON NULL DEFAULT NULL,
  `consultation_fee` DECIMAL(6,2) NULL DEFAULT NULL,
  `payment_status` ENUM('pending', 'paid', 'refunded') NULL DEFAULT NULL,
  `preferred_time` VARCHAR(50) NULL DEFAULT NULL,
  `consultation_type` ENUM('voice', 'video', 'chat', 'in_person') NULL DEFAULT 'chat',
  `urgency` ENUM('low', 'medium', 'high') NULL DEFAULT 'medium',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`consultation_id`),
  INDEX `idx_consultations_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_consultations_expert` (`expert_id` ASC) VISIBLE,
  INDEX `idx_consultations_status` (`status` ASC) VISIBLE,
  INDEX `idx_consultations_priority` (`priority` ASC) VISIBLE,
  INDEX `idx_consultations_created` (`created_at` DESC) VISIBLE,
  PRIMARY KEY (`consultation_id`),
  INDEX `idx_consultations_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_consultations_expert` (`expert_id` ASC) VISIBLE,
  INDEX `idx_consultations_status` (`status` ASC) VISIBLE,
  INDEX `idx_consultations_priority` (`priority` ASC) VISIBLE,
  INDEX `idx_consultations_created` (`created_at` ASC) VISIBLE,
  INDEX `idx_consultations_status_priority` (`status` ASC, `priority` ASC) VISIBLE,
  CONSTRAINT `consultations_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `consultations_ibfk_2`
    FOREIGN KEY (`expert_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL,
  CONSTRAINT `consultations_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `consultations_ibfk_2`
    FOREIGN KEY (`expert_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`consultation_responses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`consultation_responses` (
  `response_id` INT NOT NULL DEFAULT uuid(),
  `consultation_id` INT NOT NULL,
  `expert_id` INT NOT NULL,
  `response_text` TEXT NOT NULL,
  `attachments` JSON NULL DEFAULT NULL,
  `is_final_response` TINYINT(1) NULL DEFAULT '0',
  `diagnosis` TEXT NULL DEFAULT NULL,
  `treatment` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`response_id`),
  INDEX `idx_responses_consultation` (`consultation_id` ASC) VISIBLE,
  INDEX `idx_responses_expert` (`expert_id` ASC) VISIBLE,
  PRIMARY KEY (`response_id`),
  INDEX `idx_responses_consultation` (`consultation_id` ASC) VISIBLE,
  INDEX `idx_responses_expert` (`expert_id` ASC) VISIBLE,
  CONSTRAINT `consultation_responses_ibfk_1`
    FOREIGN KEY (`consultation_id`)
    REFERENCES `langol_krishi_sahayak`.`consultations` (`consultation_id`)
    ON DELETE CASCADE,
  CONSTRAINT `consultation_responses_ibfk_2`
    FOREIGN KEY (`expert_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `consultation_responses_ibfk_1`
    FOREIGN KEY (`consultation_id`)
    REFERENCES `langol_krishi_sahayak`.`consultations` (`consultation_id`)
    ON DELETE CASCADE,
  CONSTRAINT `consultation_responses_ibfk_2`
    FOREIGN KEY (`expert_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`crop_recommendations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`crop_recommendations` (
  `recommendation_id` INT NOT NULL AUTO_INCREMENT,
  `farmer_id` INT NOT NULL,
  `location` VARCHAR(100) NULL DEFAULT NULL,
  `soil_type` VARCHAR(50) NULL DEFAULT NULL,
  `season` VARCHAR(30) NULL DEFAULT NULL,
  `land_size` DECIMAL(8,2) NULL DEFAULT NULL,
  `land_unit` ENUM('acre', 'bigha', 'katha') NULL DEFAULT 'bigha',
  `budget` DECIMAL(10,2) NULL DEFAULT NULL,
  `recommended_crops` JSON NULL DEFAULT NULL,
  `climate_data` JSON NULL DEFAULT NULL,
  `market_analysis` JSON NULL DEFAULT NULL,
  `profitability_analysis` JSON NULL DEFAULT NULL,
  `year_plan` JSON NULL DEFAULT NULL,
  `expert_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recommendation_id`),
  INDEX `expert_id` (`expert_id` ASC) VISIBLE,
  INDEX `idx_recommendations_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_recommendations_season` (`season` ASC) VISIBLE,
  INDEX `idx_recommendations_location` (`location` ASC) VISIBLE,
  PRIMARY KEY (`recommendation_id`),
  INDEX `expert_id` (`expert_id` ASC) VISIBLE,
  INDEX `idx_recommendations_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_recommendations_season` (`season` ASC) VISIBLE,
  INDEX `idx_recommendations_location` (`location` ASC) VISIBLE,
  CONSTRAINT `crop_recommendations_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `crop_recommendations_ibfk_2`
    FOREIGN KEY (`expert_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL,
  CONSTRAINT `crop_recommendations_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `crop_recommendations_ibfk_2`
    FOREIGN KEY (`expert_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`data_operators`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`data_operators` (
  `operator_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `operator_code` VARCHAR(15) NOT NULL,
  `assigned_area` JSON NULL DEFAULT NULL,
  `department` VARCHAR(50) NULL DEFAULT NULL,
  `position` VARCHAR(50) NULL DEFAULT NULL,
  `joining_date` DATE NULL DEFAULT NULL,
  `permissions` JSON NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT '1',
  `last_active` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`operator_id`),
  UNIQUE INDEX `operator_code` (`operator_code` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_operator_code` (`operator_code` ASC) VISIBLE,
  INDEX `idx_operator_department` (`department` ASC) VISIBLE,
  PRIMARY KEY (`operator_id`),
  UNIQUE INDEX `operator_code` (`operator_code` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `supervisor_id` () VISIBLE,
  INDEX `idx_operator_code` (`operator_code` ASC) VISIBLE,
  INDEX `idx_operator_department` (`department` ASC) VISIBLE,
  CONSTRAINT `data_operators_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `data_operators_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `data_operators_ibfk_2`
    FOREIGN KEY ()
    REFERENCES `langol_krishi_sahayak`.`data_operators` ()
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`crop_verification_records`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`crop_verification_records` (
  `crop_verification_id` INT NOT NULL AUTO_INCREMENT,
  `farmer_id` INT NOT NULL,
  `operator_id` INT NOT NULL,
  `crop_type` VARCHAR(100) NOT NULL,
  `land_area` DECIMAL(10,2) NOT NULL,
  `land_area_unit` ENUM('acre', 'bigha', 'katha') NULL DEFAULT 'bigha',
  `location_details` JSON NULL DEFAULT NULL,
  `land_documents` JSON NULL DEFAULT NULL,
  `crop_photos` JSON NULL DEFAULT NULL,
  `sowing_date` DATE NULL DEFAULT NULL,
  `expected_harvest_date` DATE NULL DEFAULT NULL,
  `estimated_yield` DECIMAL(10,2) NULL DEFAULT NULL,
  `yield_unit` VARCHAR(20) NULL DEFAULT 'mon',
  `verification_status` ENUM('pending', 'in_review', 'verified', 'rejected', 'need_more_info') NULL DEFAULT 'pending',
  `verification_notes` TEXT NULL DEFAULT NULL,
  `field_visit_required` TINYINT(1) NULL DEFAULT '0',
  `field_visit_date` DATE NULL DEFAULT NULL,
  `verification_date` TIMESTAMP NULL DEFAULT NULL,
  `rejection_reason` TEXT NULL DEFAULT NULL,
  `gps_verified` TINYINT(1) NULL DEFAULT '0',
  `documents_verified` TINYINT(1) NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`crop_verification_id`),
  INDEX `idx_crop_verification_status` (`verification_status` ASC) VISIBLE,
  INDEX `idx_crop_verification_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_crop_verification_operator` (`operator_id` ASC) VISIBLE,
  INDEX `idx_crop_verification_type` (`crop_type` ASC) VISIBLE,
  CONSTRAINT `crop_verification_records_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `crop_verification_records_ibfk_2`
    FOREIGN KEY (`operator_id`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`customer_business_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`customer_business_details` (
  `business_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `business_name` VARCHAR(100) NULL DEFAULT NULL,
  `business_type` VARCHAR(50) NULL DEFAULT NULL,
  `trade_license_number` VARCHAR(30) NULL DEFAULT NULL,
  `business_address` TEXT NULL DEFAULT NULL,
  `established_year` YEAR NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`business_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_business_type` (`business_type` ASC) VISIBLE,
  PRIMARY KEY (`business_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_business_type` (`business_type` ASC) VISIBLE,
  CONSTRAINT `customer_business_details_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `customer_business_details_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`data_operator_activity_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`data_operator_activity_logs` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `activity_type` VARCHAR(50) NOT NULL,
  `target_id` INT NULL DEFAULT NULL,
  `target_type` VARCHAR(50) NULL DEFAULT NULL,
  `action_performed` VARCHAR(255) NULL DEFAULT NULL,
  `action_details` JSON NULL DEFAULT NULL,
  `result` VARCHAR(50) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  INDEX `idx_activity_operator` (`operator_id` ASC) VISIBLE,
  INDEX `idx_activity_type` (`activity_type` ASC) VISIBLE,
  INDEX `idx_activity_created` (`created_at` ASC) VISIBLE,
  PRIMARY KEY (`log_id`),
  INDEX `idx_activity_operator` (`operator_id` ASC) VISIBLE,
  INDEX `idx_activity_type` (`activity_type` ASC) VISIBLE,
  INDEX `idx_activity_created` (`created_at` ASC) VISIBLE,
  CONSTRAINT `data_operator_activity_logs_ibfk_1`
    FOREIGN KEY (`operator_id`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE CASCADE,
  CONSTRAINT `data_operator_activity_logs_ibfk_1`
    FOREIGN KEY (`operator_id`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`diagnoses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`diagnoses` (
  `diagnosis_id` INT NOT NULL AUTO_INCREMENT,
  `farmer_id` INT NOT NULL,
  `crop_type` VARCHAR(100) NULL DEFAULT NULL,
  `symptoms_description` TEXT NULL DEFAULT NULL,
  `uploaded_images` JSON NULL DEFAULT NULL,
  `farm_area` DECIMAL(10,2) NULL DEFAULT NULL,
  `area_unit` ENUM('acre', 'bigha', 'katha') NULL DEFAULT 'bigha',
  `ai_analysis_result` JSON NULL DEFAULT NULL,
  `expert_verification_id` VARCHAR(36) NULL DEFAULT NULL,
  `is_verified_by_expert` TINYINT(1) NULL DEFAULT '0',
  `urgency` ENUM('low', 'medium', 'high') NULL DEFAULT 'medium',
  `status` ENUM('pending', 'diagnosed', 'completed') NULL DEFAULT 'pending',
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`diagnosis_id`),
  INDEX `expert_verification_id` (`expert_verification_id` ASC) VISIBLE,
  INDEX `idx_diagnoses_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_diagnoses_crop` (`crop_type` ASC) VISIBLE,
  INDEX `idx_diagnoses_status` (`status` ASC) VISIBLE,
  PRIMARY KEY (`diagnosis_id`),
  INDEX `expert_verification_id` (`expert_verification_id` ASC) VISIBLE,
  INDEX `idx_diagnoses_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_diagnoses_crop` (`crop_type` ASC) VISIBLE,
  INDEX `idx_diagnoses_status` (`status` ASC) VISIBLE,
  CONSTRAINT `diagnoses_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `diagnoses_ibfk_2`
    FOREIGN KEY (`expert_verification_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL,
  CONSTRAINT `diagnoses_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `diagnoses_ibfk_2`
    FOREIGN KEY (`expert_verification_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`disease_treatments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`disease_treatments` (
  `treatment_id` INT NOT NULL AUTO_INCREMENT,
  `diagnosis_id` INT NOT NULL,
  `disease_name` VARCHAR(255) NULL DEFAULT NULL,
  `disease_name_bn` VARCHAR(255) NULL DEFAULT NULL,
  `probability_percentage` DECIMAL(5,2) NULL DEFAULT NULL,
  `treatment_description` TEXT NULL DEFAULT NULL,
  `estimated_cost` DECIMAL(10,2) NULL DEFAULT NULL,
  `treatment_guidelines` JSON NULL DEFAULT NULL,
  `prevention_guidelines` JSON NULL DEFAULT NULL,
  `video_links` JSON NULL DEFAULT NULL,
  `disease_type` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`treatment_id`),
  INDEX `idx_treatments_diagnosis` (`diagnosis_id` ASC) VISIBLE,
  INDEX `idx_treatments_disease` (`disease_name` ASC) VISIBLE,
  PRIMARY KEY (`treatment_id`),
  INDEX `idx_treatments_diagnosis` (`diagnosis_id` ASC) VISIBLE,
  INDEX `idx_treatments_disease` (`disease_name` ASC) VISIBLE,
  CONSTRAINT `disease_treatments_ibfk_1`
    FOREIGN KEY (`diagnosis_id`)
    REFERENCES `langol_krishi_sahayak`.`diagnoses` (`diagnosis_id`)
    ON DELETE CASCADE,
  CONSTRAINT `disease_treatments_ibfk_1`
    FOREIGN KEY (`diagnosis_id`)
    REFERENCES `langol_krishi_sahayak`.`diagnoses` (`diagnosis_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`expert_qualifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`expert_qualifications` (
  `expert_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `qualification` VARCHAR(100) NULL DEFAULT NULL,
  `specialization` VARCHAR(100) NULL DEFAULT NULL,
  `experience_years` TINYINT UNSIGNED NULL DEFAULT NULL,
  `institution` VARCHAR(100) NULL DEFAULT NULL,
  `consultation_fee` DECIMAL(6,2) NULL DEFAULT NULL,
  `rating` DECIMAL(2,1) NULL DEFAULT '0.0',
  `total_consultations` SMALLINT UNSIGNED NULL DEFAULT '0',
  `is_government_approved` TINYINT(1) NULL DEFAULT '0',
  `license_number` VARCHAR(50) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`expert_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_expert_specialization` (`specialization` ASC) VISIBLE,
  INDEX `idx_expert_rating` (`rating` ASC) VISIBLE,
  PRIMARY KEY (`expert_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_expert_specialization` (`specialization` ASC) VISIBLE,
  INDEX `idx_expert_rating` (`rating` ASC) VISIBLE,
  CONSTRAINT `expert_qualifications_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `expert_qualifications_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`farmer_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`farmer_details` (
  `farmer_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `farm_size` DECIMAL(8,2) NULL DEFAULT NULL,
  `farm_size_unit` ENUM('bigha', 'katha', 'acre') NULL DEFAULT 'bigha',
  `farm_type` VARCHAR(50) NULL DEFAULT NULL,
  `experience_years` TINYINT UNSIGNED NULL DEFAULT NULL,
  `land_ownership` VARCHAR(100) NULL DEFAULT NULL,
  `registration_date` DATE NULL DEFAULT NULL,
  `krishi_card_number` VARCHAR(20) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`farmer_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_farmer_farm_size` (`farm_size` ASC) VISIBLE,
  INDEX `idx_farmer_experience` (`experience_years` ASC) VISIBLE,
  PRIMARY KEY (`farmer_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_farmer_farm_size` (`farm_size` ASC) VISIBLE,
  INDEX `idx_farmer_experience` (`experience_years` ASC) VISIBLE,
  CONSTRAINT `farmer_details_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `farmer_details_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`location`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`location` (
  `postal_code` INT NOT NULL AUTO_INCREMENT,
  `district` VARCHAR(45) NOT NULL,
  `upazila` VARCHAR(45) NOT NULL,
  `division` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`postal_code`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`user_profiles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`user_profiles` (
  `profile_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `nid_number` VARCHAR(17) NULL DEFAULT NULL,
  `date_of_birth` DATE NULL DEFAULT NULL,
  `father_name` VARCHAR(100) NULL DEFAULT NULL,
  `mother_name` VARCHAR(100) NULL DEFAULT NULL,
  `address` TEXT NULL DEFAULT NULL,
  `postal_code` INT NULL,
  `profile_photo_url` VARCHAR(255) NULL DEFAULT NULL,
  `verification_status` ENUM('pending', 'verified', 'rejected') NULL DEFAULT 'pending',
  `verified_by` VARCHAR(36) NULL DEFAULT NULL,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE INDEX `nid_number` (`nid_number` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `verified_by` (`verified_by` ASC) VISIBLE,
  INDEX `idx_profile_verification` (`verification_status` ASC) VISIBLE,
  INDEX `idx_profile_nid` (`nid_number` ASC) VISIBLE,
  INDEX `user_profiles_ibfk_3_idx` (`postal_code` ASC) VISIBLE,
  PRIMARY KEY (`profile_id`),
  UNIQUE INDEX `nid_number` (`nid_number` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `verified_by` (`verified_by` ASC) VISIBLE,
  INDEX `idx_profile_verification` (`verification_status` ASC) VISIBLE,
  INDEX `idx_profile_district` () VISIBLE,
  INDEX `idx_profile_nid` (`nid_number` ASC) VISIBLE,
  CONSTRAINT `user_profiles_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `user_profiles_ibfk_2`
    FOREIGN KEY (`verified_by`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL,
  CONSTRAINT `user_profiles_ibfk_3`
    FOREIGN KEY (`postal_code`)
    REFERENCES `langol_krishi_sahayak`.`location` (`postal_code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_profiles_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `user_profiles_ibfk_2`
    FOREIGN KEY (`verified_by`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`farmer_registration_applications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`farmer_registration_applications` (
  `application_id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `applicant_name` VARCHAR(255) NOT NULL,
  `nid_number` VARCHAR(17) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `address` TEXT NULL DEFAULT NULL,
  `farm_size` DECIMAL(10,2) NULL DEFAULT NULL,
  `farm_size_unit` ENUM('acre', 'bigha', 'katha') NULL DEFAULT 'bigha',
  `application_status` ENUM('pending', 'approved', 'rejected') NULL DEFAULT 'pending',
  `notes` TEXT NULL DEFAULT NULL,
  `approved_at` TIMESTAMP NULL DEFAULT NULL,
  `created_user_id` INT NULL DEFAULT NULL,
  `created_profile_id` INT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `postal_code` INT NULL,
  PRIMARY KEY (`application_id`),
  UNIQUE INDEX `nid_number` (`nid_number` ASC) VISIBLE,
  INDEX `created_profile_id` (`created_profile_id` ASC) VISIBLE,
  INDEX `idx_registration_operator` (`operator_id` ASC) VISIBLE,
  INDEX `idx_registration_status` (`application_status` ASC) VISIBLE,
  INDEX `idx_registration_nid` (`nid_number` ASC) VISIBLE,
  INDEX `idx_registration_user` (`created_user_id` ASC) VISIBLE,
  INDEX `farmer_registration_applications_ibfk_4_idx` (`postal_code` ASC) VISIBLE,
  CONSTRAINT `farmer_registration_applications_ibfk_1`
    FOREIGN KEY (`operator_id`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE CASCADE,
  CONSTRAINT `farmer_registration_applications_ibfk_2`
    FOREIGN KEY (`created_user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL,
  CONSTRAINT `farmer_registration_applications_ibfk_3`
    FOREIGN KEY (`created_profile_id`)
    REFERENCES `langol_krishi_sahayak`.`user_profiles` (`profile_id`)
    ON DELETE SET NULL,
  CONSTRAINT `farmer_registration_applications_ibfk_4`
    FOREIGN KEY (`postal_code`)
    REFERENCES `langol_krishi_sahayak`.`location` (`postal_code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`field_data_collection`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`field_data_collection` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `farmer_id` INT NULL DEFAULT NULL,
  `report_date` DATE NOT NULL,
  `union_name` VARCHAR(100) NULL DEFAULT NULL,
  `village_name` VARCHAR(100) NULL DEFAULT NULL,
  `farmer_name` VARCHAR(255) NULL DEFAULT NULL,
  `farmer_phone` VARCHAR(15) NULL DEFAULT NULL,
  `crop_type` VARCHAR(100) NULL DEFAULT NULL,
  `land_area` DECIMAL(10,2) NULL DEFAULT NULL,
  `land_area_unit` ENUM('acre', 'bigha', 'katha') NULL DEFAULT 'bigha',
  `crop_health_status` ENUM('excellent', 'good', 'fair', 'poor', 'critical') NULL DEFAULT 'good',
  `diseases_found` JSON NULL DEFAULT NULL,
  `fertilizers_used` JSON NULL DEFAULT NULL,
  `pesticides_used` JSON NULL DEFAULT NULL,
  `gps_coordinates` JSON NULL DEFAULT NULL,
  `photos` JSON NULL DEFAULT NULL,
  `weather_conditions` JSON NULL DEFAULT NULL,
  `soil_conditions` JSON NULL DEFAULT NULL,
  `market_price_per_unit` DECIMAL(10,2) NULL DEFAULT NULL,
  `price_currency` VARCHAR(3) NULL DEFAULT 'BDT',
  `notes` TEXT NULL DEFAULT NULL,
  `recommendations` TEXT NULL DEFAULT NULL,
  `report_status` ENUM('draft', 'submitted', 'processed', 'archived') NULL DEFAULT 'draft',
  `submitted_at` TIMESTAMP NULL DEFAULT NULL,
  `processed_at` TIMESTAMP NULL DEFAULT NULL,
  `processed_by` VARCHAR(36) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  INDEX `farmer_id` (`farmer_id` ASC) VISIBLE,
  INDEX `processed_by` (`processed_by` ASC) VISIBLE,
  INDEX `idx_field_report_operator` (`operator_id` ASC) VISIBLE,
  INDEX `idx_field_report_date` (`report_date` ASC) VISIBLE,
  INDEX `idx_field_report_status` (`report_status` ASC) VISIBLE,
  INDEX `idx_field_report_location` (`union_name` ASC, `village_name` ASC) VISIBLE,
  INDEX `idx_field_report_crop` (`crop_type` ASC) VISIBLE,
  CONSTRAINT `field_data_collection_ibfk_1`
    FOREIGN KEY (`operator_id`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE CASCADE,
  CONSTRAINT `field_data_collection_ibfk_2`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE SET NULL,
  CONSTRAINT `field_data_collection_ibfk_3`
    FOREIGN KEY (`processed_by`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`marketplace_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`marketplace_categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  `category_name_bn` VARCHAR(100) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `icon_url` VARCHAR(500) NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT '1',
  `sort_order` INT NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  INDEX `idx_category_name` (`category_name` ASC) VISIBLE,
  INDEX `idx_category_active` (`is_active` ASC) VISIBLE,
  PRIMARY KEY (`category_id`),
  INDEX `idx_category_name` (`category_name` ASC) VISIBLE,
  INDEX `idx_category_active` (`is_active` ASC) VISIBLE,
  INDEX `idx_category_parent` () VISIBLE,
  CONSTRAINT `marketplace_categories_ibfk_1`
    FOREIGN KEY ()
    REFERENCES `langol_krishi_sahayak`.`marketplace_categories` ()
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`marketplace_listings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`marketplace_listings` (
  `listing_id` INT NOT NULL AUTO_INCREMENT,
  `seller_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `price` DECIMAL(10,2) NULL DEFAULT NULL,
  `currency` VARCHAR(3) NULL DEFAULT 'BDT',
  `category_id` INT NULL DEFAULT NULL,
  `listing_type` ENUM('sell', 'rent', 'buy', 'service') NULL DEFAULT 'sell',
  `status` ENUM('active', 'sold', 'expired', 'draft') NULL DEFAULT 'active',
  `images` JSON NULL DEFAULT NULL,
  `location` VARCHAR(100) NULL DEFAULT NULL,
  `contact_phone` VARCHAR(15) NULL DEFAULT NULL,
  `contact_email` VARCHAR(100) NULL DEFAULT NULL,
  `is_featured` TINYINT(1) NULL DEFAULT '0',
  `views_count` MEDIUMINT UNSIGNED NULL DEFAULT '0',
  `saves_count` SMALLINT UNSIGNED NULL DEFAULT '0',
  `contacts_count` SMALLINT UNSIGNED NULL DEFAULT '0',
  `tags` JSON NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NULL DEFAULT (now() + interval 60 day),
  PRIMARY KEY (`listing_id`),
  INDEX `idx_listings_status` (`status` ASC) VISIBLE,
  INDEX `idx_listings_category` (`category_id` ASC) VISIBLE,
  INDEX `idx_listings_seller` (`seller_id` ASC) VISIBLE,
  INDEX `idx_listings_location` (`location` ASC) VISIBLE,
  INDEX `idx_listings_type` (`listing_type` ASC) VISIBLE,
  INDEX `idx_listings_created` (`created_at` DESC) VISIBLE,
  PRIMARY KEY (`listing_id`),
  INDEX `idx_listings_status` (`status` ASC) VISIBLE,
  INDEX `idx_listings_category` (`category_id` ASC) VISIBLE,
  INDEX `idx_listings_seller` (`seller_id` ASC) VISIBLE,
  INDEX `idx_listings_location` (`location` ASC) VISIBLE,
  INDEX `idx_listings_type` (`listing_type` ASC) VISIBLE,
  INDEX `idx_listings_created` (`created_at` ASC) VISIBLE,
  INDEX `idx_listings_status_category` (`status` ASC, `category_id` ASC) VISIBLE,
  FULLTEXT INDEX `title` (`title`, `description`) VISIBLE,
  CONSTRAINT `marketplace_listings_ibfk_1`
    FOREIGN KEY (`seller_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `marketplace_listings_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `langol_krishi_sahayak`.`marketplace_categories` (`category_id`)
    ON DELETE SET NULL,
  CONSTRAINT `marketplace_listings_ibfk_1`
    FOREIGN KEY (`seller_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `marketplace_listings_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `langol_krishi_sahayak`.`marketplace_categories` (`category_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`marketplace_listing_saves`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`marketplace_listing_saves` (
  `save_id` INT NOT NULL AUTO_INCREMENT,
  `listing_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `saved_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`save_id`),
  UNIQUE INDEX `unique_save` (`listing_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_saves_listing` (`listing_id` ASC) VISIBLE,
  INDEX `idx_saves_user` (`user_id` ASC) VISIBLE,
  PRIMARY KEY (`save_id`),
  UNIQUE INDEX `unique_save` (`listing_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_saves_listing` (`listing_id` ASC) VISIBLE,
  INDEX `idx_saves_user` (`user_id` ASC) VISIBLE,
  CONSTRAINT `marketplace_listing_saves_ibfk_1`
    FOREIGN KEY (`listing_id`)
    REFERENCES `langol_krishi_sahayak`.`marketplace_listings` (`listing_id`)
    ON DELETE CASCADE,
  CONSTRAINT `marketplace_listing_saves_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `marketplace_listing_saves_ibfk_1`
    FOREIGN KEY (`listing_id`)
    REFERENCES `langol_krishi_sahayak`.`marketplace_listings` (`listing_id`)
    ON DELETE CASCADE,
  CONSTRAINT `marketplace_listing_saves_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`notifications` (
  `notification_id` INT NOT NULL AUTO_INCREMENT,
  `notification_type` ENUM('consultation_request', 'post_interaction', 'system', 'marketplace', 'diagnosis', 'weather_alert') NULL DEFAULT 'system',
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `related_entity_id` VARCHAR(36) NULL DEFAULT NULL,
  `is_read` TINYINT(1) NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  INDEX `idx_notifications_type` (`notification_type` ASC) VISIBLE,
  INDEX `idx_notifications_created` (`created_at` DESC) VISIBLE,
  PRIMARY KEY (`notification_id`),
  INDEX `sender_id` () VISIBLE,
  INDEX `idx_notifications_recipient` (`is_read` ASC) VISIBLE,
  INDEX `idx_notifications_type` (`notification_type` ASC) VISIBLE,
  INDEX `idx_notifications_created` (`created_at` ASC) VISIBLE,
  CONSTRAINT `notifications_ibfk_1`
    FOREIGN KEY ()
    REFERENCES `langol_krishi_sahayak`.`users` ()
    ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2`
    FOREIGN KEY ()
    REFERENCES `langol_krishi_sahayak`.`users` ()
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`post_likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`post_likes` (
  `like_id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `liked_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE INDEX `unique_like` (`post_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_likes_post` (`post_id` ASC) VISIBLE,
  INDEX `idx_likes_user` (`user_id` ASC) VISIBLE,
  PRIMARY KEY (`like_id`),
  UNIQUE INDEX `unique_like` (`post_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `idx_likes_post` (`post_id` ASC) VISIBLE,
  INDEX `idx_likes_user` (`user_id` ASC) VISIBLE,
  CONSTRAINT `post_likes_ibfk_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `langol_krishi_sahayak`.`posts` (`post_id`)
    ON DELETE CASCADE,
  CONSTRAINT `post_likes_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `post_likes_ibfk_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `langol_krishi_sahayak`.`posts` (`post_id`)
    ON DELETE CASCADE,
  CONSTRAINT `post_likes_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`profile_verification_records`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`profile_verification_records` (
  `verification_id` INT NOT NULL AUTO_INCREMENT,
  `farmer_id` INT NOT NULL,
  `operator_id` INT NOT NULL,
  `verification_type` ENUM('nid', 'profile', 'documents', 'full') NULL DEFAULT 'full',
  `verification_status` ENUM('pending', 'in_review', 'verified', 'rejected', 'need_more_info') NULL DEFAULT 'pending',
  `verification_notes` TEXT NULL DEFAULT NULL,
  `documents_checked` JSON NULL DEFAULT NULL,
  `discrepancies_found` JSON NULL DEFAULT NULL,
  `verification_date` TIMESTAMP NULL DEFAULT NULL,
  `rejection_reason` TEXT NULL DEFAULT NULL,
  `additional_documents_required` JSON NULL DEFAULT NULL,
  `priority_level` ENUM('low', 'medium', 'high', 'urgent') NULL DEFAULT 'medium',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`verification_id`),
  INDEX `idx_verification_status` (`verification_status` ASC) VISIBLE,
  INDEX `idx_verification_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_verification_operator` (`operator_id` ASC) VISIBLE,
  INDEX `idx_verification_priority` (`priority_level` ASC) VISIBLE,
  PRIMARY KEY (`verification_id`),
  INDEX `idx_verification_status` (`verification_status` ASC) VISIBLE,
  INDEX `idx_verification_farmer` (`farmer_id` ASC) VISIBLE,
  INDEX `idx_verification_operator` (`operator_id` ASC) VISIBLE,
  INDEX `idx_verification_priority` (`priority_level` ASC) VISIBLE,
  CONSTRAINT `profile_verification_records_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `profile_verification_records_ibfk_2`
    FOREIGN KEY (`operator_id`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE CASCADE,
  CONSTRAINT `profile_verification_records_ibfk_1`
    FOREIGN KEY (`farmer_id`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `profile_verification_records_ibfk_2`
    FOREIGN KEY (`operator_id`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`social_feed_reports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`social_feed_reports` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `comment_id` INT NOT NULL,
  `reported_by` VARCHAR(36) NOT NULL,
  `report_type` ENUM('spam', 'inappropriate_content', 'false_information', 'harassment', 'copyright_violation', 'other') NOT NULL,
  `report_description` TEXT NULL DEFAULT NULL,
  `report_status` ENUM('pending', 'in_review', 'resolved', 'dismissed') NULL DEFAULT 'pending',
  `assigned_operator` VARCHAR(36) NULL DEFAULT NULL,
  `operator_notes` TEXT NULL DEFAULT NULL,
  `action_taken` ENUM('no_action', 'warning_issued', 'content_removed', 'user_suspended', 'user_banned') NULL DEFAULT NULL,
  `resolved_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  INDEX `post_id` (`post_id` ASC) VISIBLE,
  INDEX `comment_id` (`comment_id` ASC) VISIBLE,
  INDEX `reported_by` (`reported_by` ASC) VISIBLE,
  INDEX `idx_social_report_status` (`report_status` ASC) VISIBLE,
  INDEX `idx_social_report_type` (`report_type` ASC) VISIBLE,
  INDEX `idx_social_report_operator` (`assigned_operator` ASC) VISIBLE,
  CONSTRAINT `social_feed_reports_ibfk_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `langol_krishi_sahayak`.`posts` (`post_id`)
    ON DELETE SET NULL,
  CONSTRAINT `social_feed_reports_ibfk_2`
    FOREIGN KEY (`comment_id`)
    REFERENCES `langol_krishi_sahayak`.`comments` (`comment_id`)
    ON DELETE SET NULL,
  CONSTRAINT `social_feed_reports_ibfk_3`
    FOREIGN KEY (`reported_by`)
    REFERENCES `langol_krishi_sahayak`.`users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `social_feed_reports_ibfk_4`
    FOREIGN KEY (`assigned_operator`)
    REFERENCES `langol_krishi_sahayak`.`data_operators` (`operator_id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`treatment_chemicals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`treatment_chemicals` (
  `chemical_id` INT NOT NULL AUTO_INCREMENT,
  `treatment_id` INT NOT NULL,
  `chemical_name` VARCHAR(255) NULL DEFAULT NULL,
  `chemical_type` ENUM('fungicide', 'pesticide', 'herbicide', 'fertilizer', 'bactericide') NULL DEFAULT 'fungicide',
  `dose_per_acre` DECIMAL(8,2) NULL DEFAULT NULL,
  `dose_unit` VARCHAR(20) NULL DEFAULT NULL,
  `price_per_unit` DECIMAL(10,2) NULL DEFAULT NULL,
  `application_notes` TEXT NULL DEFAULT NULL,
  `safety_precautions` TEXT NULL DEFAULT NULL,
  `application_method` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chemical_id`),
  INDEX `idx_chemicals_treatment` (`treatment_id` ASC) VISIBLE,
  INDEX `idx_chemicals_type` (`chemical_type` ASC) VISIBLE,
  PRIMARY KEY (`chemical_id`),
  INDEX `idx_chemicals_treatment` (`treatment_id` ASC) VISIBLE,
  INDEX `idx_chemicals_type` (`chemical_type` ASC) VISIBLE,
  CONSTRAINT `treatment_chemicals_ibfk_1`
    FOREIGN KEY (`treatment_id`)
    REFERENCES `langol_krishi_sahayak`.`disease_treatments` (`treatment_id`)
    ON DELETE CASCADE,
  CONSTRAINT `treatment_chemicals_ibfk_1`
    FOREIGN KEY (`treatment_id`)
    REFERENCES `langol_krishi_sahayak`.`disease_treatments` (`treatment_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `langol_krishi_sahayak`.`post_tag_relations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`post_tag_relations` (
  `post_id` VARCHAR(36) NOT NULL,
  `tag_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  INDEX `tag_id` (`tag_id` ASC) VISIBLE,
  CONSTRAINT `post_tag_relations_ibfk_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `langol_krishi_sahayak`.`posts` (`post_id`)
    ON DELETE CASCADE,
  CONSTRAINT `post_tag_relations_ibfk_2`
    FOREIGN KEY (`tag_id`)
    REFERENCES `langol_krishi_sahayak`.`post_tags` (`tag_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

USE `langol_krishi_sahayak` ;

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_active_marketplace_listings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_active_marketplace_listings` (`listing_id` INT, `title` INT, `description` INT, `price` INT, `currency` INT, `listing_type` INT, `location` INT, `contact_phone` INT, `contact_email` INT, `is_featured` INT, `views_count` INT, `saves_count` INT, `created_at` INT, `expires_at` INT, `days_until_expiry` INT, `seller_name` INT, `seller_district` INT, `seller_upazila` INT, `category_name` INT, `category_name_bn` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_crop_recommendations_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_crop_recommendations_complete` (`recommendation_id` INT, `location` INT, `soil_type` INT, `season` INT, `land_size` INT, `land_unit` INT, `budget` INT, `recommended_crops` INT, `climate_data` INT, `market_analysis` INT, `profitability_analysis` INT, `year_plan` INT, `created_at` INT, `farmer_id` INT, `farmer_name` INT, `farmer_district` INT, `farmer_upazila` INT, `farmer_phone` INT, `expert_id` INT, `expert_name` INT, `expert_district` INT, `expert_specialization` INT, `expert_rating` INT, `current_farm_size` INT, `current_farm_unit` INT, `current_farm_type` INT, `farmer_experience` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_crops_profitability_analysis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_crops_profitability_analysis` (`crop_id` INT, `crop_name` INT, `crop_name_bn` INT, `season` INT, `region` INT, `cost_per_bigha` INT, `yield_per_bigha` INT, `market_price_per_unit` INT, `duration_days` INT, `profit_per_bigha` INT, `difficulty_level` INT, `is_quick_harvest` INT, `description` INT, `created_at` INT, `updated_at` INT, `profit_margin_percent` INT, `profit_per_day` INT, `calculated_profit` INT, `roi_percent` INT, `avg_market_price_last_30_days` INT, `max_market_price_last_30_days` INT, `min_market_price_last_30_days` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_expired_listings_report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_expired_listings_report` (`listing_id` INT, `title` INT, `price` INT, `currency` INT, `location` INT, `created_at` INT, `expires_at` INT, `status` INT, `days_until_expiry` INT, `seller_name` INT, `seller_district` INT, `seller_phone` INT, `category_name` INT, `views_count` INT, `saves_count` INT, `contacts_count` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_marketplace_activity_by_location`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_marketplace_activity_by_location` (`location` INT, `total_listings` INT, `unique_sellers` INT, `active_listings` INT, `sold_listings` INT, `average_price` INT, `min_price` INT, `max_price` INT, `total_views` INT, `total_saves` INT, `latest_listing_date` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_marketplace_categories_with_counts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_marketplace_categories_with_counts` (`category_id` INT, `category_name` INT, `category_name_bn` INT, `description` INT, `icon_url` INT, `parent_category_id` INT, `is_active` INT, `sort_order` INT, `parent_category_name` INT, `total_listings` INT, `active_listings` INT, `sold_listings` INT, `listings_last_30_days` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_marketplace_listings_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_marketplace_listings_complete` (`listing_id` INT, `title` INT, `description` INT, `price` INT, `currency` INT, `listing_type` INT, `status` INT, `images` INT, `location` INT, `contact_phone` INT, `contact_email` INT, `is_featured` INT, `views_count` INT, `saves_count` INT, `contacts_count` INT, `tags` INT, `created_at` INT, `updated_at` INT, `expires_at` INT, `seller_id` INT, `seller_type` INT, `seller_name` INT, `seller_district` INT, `seller_upazila` INT, `seller_phone` INT, `seller_photo` INT, `category_id` INT, `category_name` INT, `category_name_bn` INT, `category_icon` INT, `parent_category_name` INT, `parent_category_name_bn` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_popular_marketplace_listings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_popular_marketplace_listings` (`listing_id` INT, `title` INT, `price` INT, `currency` INT, `listing_type` INT, `location` INT, `views_count` INT, `saves_count` INT, `contacts_count` INT, `created_at` INT, `popularity_score` INT, `seller_name` INT, `seller_district` INT, `category_name` INT, `category_name_bn` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_recent_marketplace_activity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_recent_marketplace_activity` (`activity_type` INT, `entity_id` INT, `entity_title` INT, `activity_date` INT, `user_name` INT, `user_district` INT, `category_name` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_seller_performance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_seller_performance` (`seller_id` INT, `seller_name` INT, `seller_district` INT, `seller_upazila` INT, `user_type` INT, `seller_joined_date` INT, `total_listings` INT, `active_listings` INT, `sold_listings` INT, `expired_listings` INT, `listings_last_30_days` INT, `avg_views_per_listing` INT, `avg_saves_per_listing` INT, `avg_contacts_per_listing` INT, `total_views` INT, `total_saves` INT, `total_contacts` INT, `success_rate_percent` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_user_saved_listings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_user_saved_listings` (`save_id` INT, `saved_at` INT, `saver_id` INT, `saver_name` INT, `listing_id` INT, `title` INT, `price` INT, `currency` INT, `listing_type` INT, `location` INT, `status` INT, `listing_created_at` INT, `expires_at` INT, `seller_name` INT, `seller_district` INT, `category_name` INT, `category_name_bn` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`active_users_view`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`active_users_view` (`user_id` INT, `user_type` INT, `name` INT, `district` INT, `upazila` INT, `division` INT, `phone` INT, `is_verified` INT, `created_at` INT, `days_since_registration` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_active_consultations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_active_consultations` (`consultation_id` INT, `topic` INT, `crop_type` INT, `issue_description` INT, `priority` INT, `status` INT, `consultation_type` INT, `urgency` INT, `created_at` INT, `days_since_created` INT, `farmer_name` INT, `farmer_district` INT, `farmer_phone` INT, `expert_name` INT, `expert_district` INT, `expert_specialization` INT, `expert_rating` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_comments_with_author`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_comments_with_author` (`comment_id` INT, `post_id` INT, `content` INT, `parent_comment_id` INT, `likes_count` INT, `is_reported` INT, `created_at` INT, `updated_at` INT, `author_id` INT, `author_type` INT, `author_name` INT, `author_district` INT, `author_photo` INT, `parent_author_id` INT, `parent_author_name` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_consultations_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_consultations_complete` (`consultation_id` INT, `topic` INT, `crop_type` INT, `issue_description` INT, `priority` INT, `status` INT, `location` INT, `images` INT, `consultation_fee` INT, `payment_status` INT, `preferred_time` INT, `consultation_type` INT, `urgency` INT, `created_at` INT, `updated_at` INT, `resolved_at` INT, `resolution_days` INT, `farmer_id` INT, `farmer_name` INT, `farmer_district` INT, `farmer_upazila` INT, `farmer_phone` INT, `farmer_photo` INT, `expert_id` INT, `expert_name` INT, `expert_district` INT, `expert_phone` INT, `expert_photo` INT, `expert_qualification` INT, `expert_specialization` INT, `expert_experience` INT, `expert_rating` INT, `expert_total_consultations` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_consultation_responses_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_consultation_responses_complete` (`response_id` INT, `consultation_id` INT, `response_text` INT, `attachments` INT, `is_final_response` INT, `diagnosis` INT, `treatment` INT, `created_at` INT, `expert_id` INT, `expert_name` INT, `expert_district` INT, `expert_qualification` INT, `expert_specialization` INT, `expert_experience` INT, `expert_rating` INT, `consultation_topic` INT, `crop_type` INT, `priority` INT, `urgency` INT, `farmer_name` INT, `farmer_district` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_customer_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_customer_details` (`user_id` INT, `email` INT, `phone` INT, `is_verified` INT, `is_active` INT, `full_name` INT, `nid_number` INT, `address` INT, `district` INT, `upazila` INT, `division` INT, `verification_status` INT, `business_id` INT, `business_name` INT, `business_type` INT, `trade_license_number` INT, `business_address` INT, `established_year` INT, `business_created_at` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_data_operator_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_data_operator_details` (`user_id` INT, `email` INT, `phone` INT, `is_verified` INT, `is_active` INT, `full_name` INT, `nid_number` INT, `address` INT, `district` INT, `upazila` INT, `division` INT, `verification_status` INT, `operator_id` INT, `operator_code` INT, `assigned_area` INT, `department` INT, `position` INT, `joining_date` INT, `permissions` INT, `last_active` INT, `operator_created_at` INT, `supervisor_name` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_diagnoses_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_diagnoses_complete` (`diagnosis_id` INT, `crop_type` INT, `symptoms_description` INT, `uploaded_images` INT, `farm_area` INT, `area_unit` INT, `ai_analysis_result` INT, `is_verified_by_expert` INT, `urgency` INT, `status` INT, `location` INT, `created_at` INT, `updated_at` INT, `farmer_id` INT, `farmer_name` INT, `farmer_district` INT, `farmer_upazila` INT, `farmer_phone` INT, `farmer_photo` INT, `expert_verification_id` INT, `expert_name` INT, `expert_district` INT, `expert_qualification` INT, `expert_specialization` INT, `expert_experience` INT, `expert_rating` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_disease_outbreak_alert`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_disease_outbreak_alert` (`disease_name` INT, `disease_name_bn` INT, `crop_type` INT, `location` INT, `district` INT, `upazila` INT, `cases_count` INT, `cases_last_7_days` INT, `cases_last_30_days` INT, `avg_probability` INT, `total_affected_area` INT, `first_case_date` INT, `latest_case_date` INT, `alert_level` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_disease_statistics_by_crop`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_disease_statistics_by_crop` (`crop_type` INT, `total_diagnoses` INT, `unique_farmers_affected` INT, `unique_diseases_identified` INT, `diagnosed_cases` INT, `completed_cases` INT, `expert_verified_cases` INT, `avg_treatment_cost` INT, `total_affected_area` INT, `cases_last_30_days` INT, `most_common_disease` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_disease_treatments_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_disease_treatments_complete` (`treatment_id` INT, `diagnosis_id` INT, `disease_name` INT, `disease_name_bn` INT, `probability_percentage` INT, `treatment_description` INT, `estimated_cost` INT, `treatment_guidelines` INT, `prevention_guidelines` INT, `video_links` INT, `disease_type` INT, `treatment_created_at` INT, `crop_type` INT, `symptoms_description` INT, `farm_area` INT, `area_unit` INT, `urgency` INT, `diagnosis_status` INT, `location` INT, `diagnosis_created_at` INT, `farmer_name` INT, `farmer_district` INT, `farmer_upazila` INT, `farmer_phone` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_expert_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_expert_details` (`user_id` INT, `email` INT, `phone` INT, `is_verified` INT, `is_active` INT, `full_name` INT, `nid_number` INT, `address` INT, `district` INT, `upazila` INT, `division` INT, `verification_status` INT, `expert_id` INT, `qualification` INT, `specialization` INT, `experience_years` INT, `institution` INT, `consultation_fee` INT, `rating` INT, `total_consultations` INT, `is_government_approved` INT, `license_number` INT, `expert_created_at` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_expert_verification_performance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_expert_verification_performance` (`expert_id` INT, `expert_name` INT, `expert_district` INT, `specialization` INT, `rating` INT, `total_verifications` INT, `successful_diagnoses` INT, `completed_cases` INT, `verifications_last_30_days` INT, `avg_verification_days` INT, `completion_rate_percent` INT, `verified_crop_types` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_farmer_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_farmer_details` (`user_id` INT, `email` INT, `phone` INT, `is_verified` INT, `is_active` INT, `full_name` INT, `nid_number` INT, `date_of_birth` INT, `address` INT, `district` INT, `upazila` INT, `division` INT, `verification_status` INT, `farmer_id` INT, `farm_size` INT, `farm_size_unit` INT, `farm_type` INT, `experience_years` INT, `land_ownership` INT, `registration_date` INT, `krishi_card_number` INT, `farmer_created_at` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_notifications_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_notifications_complete` (`notification_id` INT, `notification_type` INT, `title` INT, `message` INT, `related_entity_id` INT, `is_read` INT, `created_at` INT, `read_at` INT, `days_since_created` INT, `recipient_id` INT, `recipient_name` INT, `recipient_district` INT, `recipient_type` INT, `recipient_phone` INT, `sender_id` INT, `sender_name` INT, `sender_district` INT, `sender_type` INT, `priority_level` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_pending_diagnoses_for_verification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_pending_diagnoses_for_verification` (`diagnosis_id` INT, `crop_type` INT, `symptoms_description` INT, `uploaded_images` INT, `farm_area` INT, `area_unit` INT, `urgency` INT, `location` INT, `created_at` INT, `days_pending` INT, `farmer_name` INT, `farmer_district` INT, `farmer_upazila` INT, `farmer_phone` INT, `ai_predicted_disease` INT, `ai_confidence_score` INT, `available_experts` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_pending_profile_verifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_pending_profile_verifications` (`user_id` INT, `email` INT, `user_type` INT, `phone` INT, `user_created_at` INT, `profile_id` INT, `full_name` INT, `nid_number` INT, `district` INT, `upazila` INT, `division` INT, `verification_status` INT, `profile_created_at` INT, `days_pending` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_popular_posts_weekly`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_popular_posts_weekly` (`post_id` INT, `content` INT, `post_type` INT, `location` INT, `created_at` INT, `author_name` INT, `author_district` INT, `likes_count` INT, `comments_count` INT, `shares_count` INT, `views_count` INT, `total_interactions` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_posts_by_location`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_posts_by_location` (`location` INT, `total_posts` INT, `unique_authors` INT, `avg_likes` INT, `avg_comments` INT, `avg_views` INT, `latest_post_date` INT, `earliest_post_date` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_posts_with_author`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_posts_with_author` (`post_id` INT, `content` INT, `post_type` INT, `marketplace_listing_id` INT, `images` INT, `location` INT, `likes_count` INT, `comments_count` INT, `shares_count` INT, `views_count` INT, `is_pinned` INT, `is_reported` INT, `created_at` INT, `updated_at` INT, `author_id` INT, `author_type` INT, `author_name` INT, `author_district` INT, `author_photo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_post_comments_tree`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_post_comments_tree` (`comment_id` INT, `post_id` INT, `content` INT, `parent_comment_id` INT, `likes_count` INT, `created_at` INT, `author_name` INT, `author_district` INT, `author_type` INT, `comment_level` INT, `parent_comment_content` INT, `parent_author_name` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_post_engagement_summary`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_post_engagement_summary` (`post_id` INT, `post_type` INT, `location` INT, `created_at` INT, `author_name` INT, `author_district` INT, `likes_count` INT, `comments_count` INT, `shares_count` INT, `views_count` INT, `total_interactions` INT, `engagement_rate_percent` INT, `tags` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_post_tags_with_usage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_post_tags_with_usage` (`tag_id` INT, `tag_name` INT, `usage_count` INT, `created_at` INT, `current_usage_count` INT, `related_post_ids` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_recent_user_registrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_recent_user_registrations` (`user_id` INT, `email` INT, `user_type` INT, `phone` INT, `is_verified` INT, `created_at` INT, `full_name` INT, `district` INT, `upazila` INT, `verification_status` INT, `days_since_registration` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_system_settings_management`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_system_settings_management` (`setting_id` INT, `setting_key` INT, `setting_value` INT, `setting_type` INT, `description` INT, `is_public` INT, `updated_at` INT, `created_at` INT, `updated_by` INT, `updated_by_name` INT, `updated_by_type` INT, `setting_category` INT, `access_level` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_treatment_chemicals_complete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_treatment_chemicals_complete` (`chemical_id` INT, `treatment_id` INT, `chemical_name` INT, `chemical_type` INT, `dose_per_acre` INT, `dose_unit` INT, `price_per_unit` INT, `application_notes` INT, `safety_precautions` INT, `application_method` INT, `chemical_created_at` INT, `disease_name` INT, `disease_name_bn` INT, `probability_percentage` INT, `total_treatment_cost` INT, `diagnosis_id` INT, `crop_type` INT, `farm_area` INT, `area_unit` INT, `estimated_chemical_cost_for_farm` INT, `farmer_name` INT, `farmer_district` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_trending_tags_monthly`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_trending_tags_monthly` (`tag_id` INT, `tag_name` INT, `usage_last_30_days` INT, `unique_users_using` INT, `avg_engagement_per_post` INT, `last_used_at` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_user_complete_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_user_complete_info` (`user_id` INT, `email` INT, `user_type` INT, `phone` INT, `is_verified` INT, `is_active` INT, `user_created_at` INT, `user_updated_at` INT, `profile_id` INT, `full_name` INT, `nid_number` INT, `date_of_birth` INT, `father_name` INT, `mother_name` INT, `address` INT, `district` INT, `upazila` INT, `division` INT, `profile_photo_url` INT, `verification_status` INT, `verified_at` INT, `profile_created_at` INT, `verified_by_name` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_user_sessions_management`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_user_sessions_management` (`session_id` INT, `session_token` INT, `device_info` INT, `ip_address` INT, `is_active` INT, `expires_at` INT, `created_at` INT, `days_until_expiry` INT, `session_status` INT, `user_id` INT, `user_name` INT, `user_district` INT, `user_type` INT, `phone` INT, `email` INT, `total_session_hours` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_user_social_activity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_user_social_activity` (`user_id` INT, `full_name` INT, `district` INT, `user_type` INT, `total_posts` INT, `posts_last_30_days` INT, `avg_post_likes` INT, `avg_post_comments` INT, `total_comments` INT, `comments_last_30_days` INT, `total_likes_given` INT, `likes_given_last_30_days` INT);

-- -----------------------------------------------------
-- Placeholder table for view `langol_krishi_sahayak`.`v_user_statistics_by_district`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `langol_krishi_sahayak`.`v_user_statistics_by_district` (`district` INT, `division` INT, `user_type` INT, `total_users` INT, `verified_users` INT, `profile_verified_users` INT, `active_users` INT);

-- -----------------------------------------------------
-- procedure AssignVerificationTask
-- -----------------------------------------------------

DELIMITER $$
USE `langol_krishi_sahayak`$$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AssignVerificationTask` (IN `p_farmer_id` VARCHAR(36), IN `p_operator_id` VARCHAR(36), IN `p_verification_type` ENUM('nid','profile','documents','full'), IN `p_priority_level` ENUM('low','medium','high','urgent'))   BEGIN

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

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GenerateOperatorPerformanceReport
-- -----------------------------------------------------

DELIMITER $$
USE `langol_krishi_sahayak`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerateOperatorPerformanceReport` (IN `p_operator_id` VARCHAR(36), IN `p_start_date` DATE, IN `p_end_date` DATE)   BEGIN

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

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure UpdateVerificationStatus
-- -----------------------------------------------------

DELIMITER $$
USE `langol_krishi_sahayak`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateVerificationStatus` (IN `p_verification_id` VARCHAR(36), IN `p_operator_id` VARCHAR(36), IN `p_status` ENUM('pending','in_review','verified','rejected','need_more_info'), IN `p_notes` TEXT, IN `p_rejection_reason` TEXT)   BEGIN

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

END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_active_marketplace_listings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_active_marketplace_listings`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_active_marketplace_listings` AS select `ml`.`listing_id` AS `listing_id`,`ml`.`title` AS `title`,`ml`.`description` AS `description`,`ml`.`price` AS `price`,`ml`.`currency` AS `currency`,`ml`.`listing_type` AS `listing_type`,`ml`.`location` AS `location`,`ml`.`contact_phone` AS `contact_phone`,`ml`.`contact_email` AS `contact_email`,`ml`.`is_featured` AS `is_featured`,`ml`.`views_count` AS `views_count`,`ml`.`saves_count` AS `saves_count`,`ml`.`created_at` AS `created_at`,`ml`.`expires_at` AS `expires_at`,(to_days(`ml`.`expires_at`) - to_days(now())) AS `days_until_expiry`,`prof`.`full_name` AS `seller_name`,`prof`.`district` AS `seller_district`,`prof`.`upazila` AS `seller_upazila`,`mc`.`category_name` AS `category_name`,`mc`.`category_name_bn` AS `category_name_bn` from (((`langol_krishi_sahayak`.`marketplace_listings` `ml` join `langol_krishi_sahayak`.`users` `u` on((`ml`.`seller_id` = `u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `mc` on((`ml`.`category_id` = `mc`.`category_id`))) where ((`ml`.`status` = 'active') and (`ml`.`expires_at` > now()));

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_crop_recommendations_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_crop_recommendations_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_crop_recommendations_complete` AS select `cr`.`recommendation_id` AS `recommendation_id`,`cr`.`location` AS `location`,`cr`.`soil_type` AS `soil_type`,`cr`.`season` AS `season`,`cr`.`land_size` AS `land_size`,`cr`.`land_unit` AS `land_unit`,`cr`.`budget` AS `budget`,`cr`.`recommended_crops` AS `recommended_crops`,`cr`.`climate_data` AS `climate_data`,`cr`.`market_analysis` AS `market_analysis`,`cr`.`profitability_analysis` AS `profitability_analysis`,`cr`.`year_plan` AS `year_plan`,`cr`.`created_at` AS `created_at`,`cr`.`farmer_id` AS `farmer_id`,`farmer_prof`.`full_name` AS `farmer_name`,`farmer_prof`.`district` AS `farmer_district`,`farmer_prof`.`upazila` AS `farmer_upazila`,`farmer_u`.`phone` AS `farmer_phone`,`cr`.`expert_id` AS `expert_id`,`expert_prof`.`full_name` AS `expert_name`,`expert_prof`.`district` AS `expert_district`,`eq`.`specialization` AS `expert_specialization`,`eq`.`rating` AS `expert_rating`,`fd`.`farm_size` AS `current_farm_size`,`fd`.`farm_size_unit` AS `current_farm_unit`,`fd`.`farm_type` AS `current_farm_type`,`fd`.`experience_years` AS `farmer_experience` from ((((((`langol_krishi_sahayak`.`crop_recommendations` `cr` join `langol_krishi_sahayak`.`users` `farmer_u` on((`cr`.`farmer_id` = `farmer_u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `farmer_prof` on((`farmer_u`.`user_id` = `farmer_prof`.`user_id`))) left join `langol_krishi_sahayak`.`farmer_details` `fd` on((`farmer_u`.`user_id` = `fd`.`user_id`))) left join `langol_krishi_sahayak`.`users` `expert_u` on((`cr`.`expert_id` = `expert_u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `expert_prof` on((`expert_u`.`user_id` = `expert_prof`.`user_id`))) left join `langol_krishi_sahayak`.`expert_qualifications` `eq` on((`expert_u`.`user_id` = `eq`.`user_id`)));

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_crops_profitability_analysis`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_crops_profitability_analysis`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_crops_profitability_analysis` AS select `cd`.`crop_id` AS `crop_id`,`cd`.`crop_name` AS `crop_name`,`cd`.`crop_name_bn` AS `crop_name_bn`,`cd`.`season` AS `season`,`cd`.`region` AS `region`,`cd`.`cost_per_bigha` AS `cost_per_bigha`,`cd`.`yield_per_bigha` AS `yield_per_bigha`,`cd`.`market_price_per_unit` AS `market_price_per_unit`,`cd`.`duration_days` AS `duration_days`,`cd`.`profit_per_bigha` AS `profit_per_bigha`,`cd`.`difficulty_level` AS `difficulty_level`,`cd`.`is_quick_harvest` AS `is_quick_harvest`,`cd`.`description` AS `description`,`cd`.`created_at` AS `created_at`,`cd`.`updated_at` AS `updated_at`,round(((`cd`.`profit_per_bigha` / `cd`.`cost_per_bigha`) * 100),2) AS `profit_margin_percent`,round((`cd`.`profit_per_bigha` / `cd`.`duration_days`),2) AS `profit_per_day`,round(((`cd`.`yield_per_bigha` * `cd`.`market_price_per_unit`) - `cd`.`cost_per_bigha`),2) AS `calculated_profit`,round(((((`cd`.`yield_per_bigha` * `cd`.`market_price_per_unit`) - `cd`.`cost_per_bigha`) / `cd`.`cost_per_bigha`) * 100),2) AS `roi_percent`,avg(`mp`.`price_per_unit`) AS `avg_market_price_last_30_days`,max(`mp`.`price_per_unit`) AS `max_market_price_last_30_days`,min(`mp`.`price_per_unit`) AS `min_market_price_last_30_days` from (`langol_krishi_sahayak`.`crops_database` `cd` left join `langol_krishi_sahayak`.`market_prices` `mp` on(((`cd`.`crop_name` = `mp`.`crop_name`) and (`mp`.`price_date` >= (now() - interval 30 day))))) group by `cd`.`crop_id`,`cd`.`crop_name`,`cd`.`crop_name_bn`,`cd`.`season`,`cd`.`region`,`cd`.`cost_per_bigha`,`cd`.`yield_per_bigha`,`cd`.`market_price_per_unit`,`cd`.`duration_days`,`cd`.`profit_per_bigha`,`cd`.`difficulty_level`,`cd`.`is_quick_harvest`,`cd`.`description`,`cd`.`created_at`,`cd`.`updated_at` order by `roi_percent` desc;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_expired_listings_report`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_expired_listings_report`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_expired_listings_report` AS select `ml`.`listing_id` AS `listing_id`,`ml`.`title` AS `title`,`ml`.`price` AS `price`,`ml`.`currency` AS `currency`,`ml`.`location` AS `location`,`ml`.`created_at` AS `created_at`,`ml`.`expires_at` AS `expires_at`,`ml`.`status` AS `status`,(to_days(`ml`.`expires_at`) - to_days(now())) AS `days_until_expiry`,`prof`.`full_name` AS `seller_name`,`prof`.`district` AS `seller_district`,`u`.`phone` AS `seller_phone`,`mc`.`category_name` AS `category_name`,`ml`.`views_count` AS `views_count`,`ml`.`saves_count` AS `saves_count`,`ml`.`contacts_count` AS `contacts_count` from (((`langol_krishi_sahayak`.`marketplace_listings` `ml` join `langol_krishi_sahayak`.`users` `u` on((`ml`.`seller_id` = `u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `mc` on((`ml`.`category_id` = `mc`.`category_id`))) where (((`ml`.`status` = 'expired') or (`ml`.`expires_at` <= (now() + interval 7 day))) and (`ml`.`status` <> 'sold')) order by `ml`.`expires_at`;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_marketplace_activity_by_location`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_marketplace_activity_by_location`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_marketplace_activity_by_location` AS select `ml`.`location` AS `location`,count(0) AS `total_listings`,count(distinct `ml`.`seller_id`) AS `unique_sellers`,count((case when (`ml`.`status` = 'active') then `ml`.`listing_id` end)) AS `active_listings`,count((case when (`ml`.`status` = 'sold') then `ml`.`listing_id` end)) AS `sold_listings`,avg(`ml`.`price`) AS `average_price`,min(`ml`.`price`) AS `min_price`,max(`ml`.`price`) AS `max_price`,sum(`ml`.`views_count`) AS `total_views`,sum(`ml`.`saves_count`) AS `total_saves`,max(`ml`.`created_at`) AS `latest_listing_date` from `langol_krishi_sahayak`.`marketplace_listings` `ml` where ((`ml`.`location` is not null) and (`ml`.`location` <> '') and (`ml`.`status` <> 'draft')) group by `ml`.`location` order by `total_listings` desc;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_marketplace_categories_with_counts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_marketplace_categories_with_counts`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_marketplace_categories_with_counts` AS select `mc`.`category_id` AS `category_id`,`mc`.`category_name` AS `category_name`,`mc`.`category_name_bn` AS `category_name_bn`,`mc`.`description` AS `description`,`mc`.`icon_url` AS `icon_url`,`mc`.`parent_category_id` AS `parent_category_id`,`mc`.`is_active` AS `is_active`,`mc`.`sort_order` AS `sort_order`,`parent_cat`.`category_name` AS `parent_category_name`,count(`ml`.`listing_id`) AS `total_listings`,count((case when (`ml`.`status` = 'active') then `ml`.`listing_id` end)) AS `active_listings`,count((case when (`ml`.`status` = 'sold') then `ml`.`listing_id` end)) AS `sold_listings`,count((case when (`ml`.`created_at` >= (now() - interval 30 day)) then `ml`.`listing_id` end)) AS `listings_last_30_days` from ((`langol_krishi_sahayak`.`marketplace_categories` `mc` left join `langol_krishi_sahayak`.`marketplace_listings` `ml` on((`mc`.`category_id` = `ml`.`category_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `parent_cat` on((`mc`.`parent_category_id` = `parent_cat`.`category_id`))) group by `mc`.`category_id`,`mc`.`category_name`,`mc`.`category_name_bn`,`mc`.`description`,`mc`.`icon_url`,`mc`.`parent_category_id`,`mc`.`is_active`,`mc`.`sort_order`,`parent_cat`.`category_name` order by `mc`.`sort_order`,`mc`.`category_name`;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_marketplace_listings_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_marketplace_listings_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_marketplace_listings_complete` AS select `ml`.`listing_id` AS `listing_id`,`ml`.`title` AS `title`,`ml`.`description` AS `description`,`ml`.`price` AS `price`,`ml`.`currency` AS `currency`,`ml`.`listing_type` AS `listing_type`,`ml`.`status` AS `status`,`ml`.`images` AS `images`,`ml`.`location` AS `location`,`ml`.`contact_phone` AS `contact_phone`,`ml`.`contact_email` AS `contact_email`,`ml`.`is_featured` AS `is_featured`,`ml`.`views_count` AS `views_count`,`ml`.`saves_count` AS `saves_count`,`ml`.`contacts_count` AS `contacts_count`,`ml`.`tags` AS `tags`,`ml`.`created_at` AS `created_at`,`ml`.`updated_at` AS `updated_at`,`ml`.`expires_at` AS `expires_at`,`u`.`user_id` AS `seller_id`,`u`.`user_type` AS `seller_type`,`prof`.`full_name` AS `seller_name`,`prof`.`district` AS `seller_district`,`prof`.`upazila` AS `seller_upazila`,`u`.`phone` AS `seller_phone`,`prof`.`profile_photo_url` AS `seller_photo`,`mc`.`category_id` AS `category_id`,`mc`.`category_name` AS `category_name`,`mc`.`category_name_bn` AS `category_name_bn`,`mc`.`icon_url` AS `category_icon`,`parent_cat`.`category_name` AS `parent_category_name`,`parent_cat`.`category_name_bn` AS `parent_category_name_bn` from ((((`langol_krishi_sahayak`.`marketplace_listings` `ml` join `langol_krishi_sahayak`.`users` `u` on((`ml`.`seller_id` = `u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `mc` on((`ml`.`category_id` = `mc`.`category_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `parent_cat` on((`mc`.`parent_category_id` = `parent_cat`.`category_id`))) where (`ml`.`status` <> 'draft');

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_popular_marketplace_listings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_popular_marketplace_listings`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_popular_marketplace_listings` AS select `ml`.`listing_id` AS `listing_id`,`ml`.`title` AS `title`,`ml`.`price` AS `price`,`ml`.`currency` AS `currency`,`ml`.`listing_type` AS `listing_type`,`ml`.`location` AS `location`,`ml`.`views_count` AS `views_count`,`ml`.`saves_count` AS `saves_count`,`ml`.`contacts_count` AS `contacts_count`,`ml`.`created_at` AS `created_at`,((`ml`.`views_count` + (`ml`.`saves_count` * 3)) + (`ml`.`contacts_count` * 5)) AS `popularity_score`,`prof`.`full_name` AS `seller_name`,`prof`.`district` AS `seller_district`,`mc`.`category_name` AS `category_name`,`mc`.`category_name_bn` AS `category_name_bn` from (((`langol_krishi_sahayak`.`marketplace_listings` `ml` join `langol_krishi_sahayak`.`users` `u` on((`ml`.`seller_id` = `u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `mc` on((`ml`.`category_id` = `mc`.`category_id`))) where ((`ml`.`status` = 'active') and (`ml`.`expires_at` > now())) order by ((`ml`.`views_count` + (`ml`.`saves_count` * 3)) + (`ml`.`contacts_count` * 5)) desc,`ml`.`views_count` desc;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_recent_marketplace_activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_recent_marketplace_activity`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_recent_marketplace_activity` AS select 'listing_created' AS `activity_type`,`ml`.`listing_id` AS `entity_id`,`ml`.`title` AS `entity_title`,`ml`.`created_at` AS `activity_date`,`prof`.`full_name` AS `user_name`,`prof`.`district` AS `user_district`,`mc`.`category_name` AS `category_name` from (((`langol_krishi_sahayak`.`marketplace_listings` `ml` join `langol_krishi_sahayak`.`users` `u` on((`ml`.`seller_id` = `u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `mc` on((`ml`.`category_id` = `mc`.`category_id`))) where (`ml`.`created_at` >= (now() - interval 7 day)) union all select 'listing_saved' AS `activity_type`,`mls`.`listing_id` AS `entity_id`,`ml`.`title` AS `entity_title`,`mls`.`saved_at` AS `activity_date`,`prof`.`full_name` AS `user_name`,`prof`.`district` AS `user_district`,`mc`.`category_name` AS `category_name` from ((((`langol_krishi_sahayak`.`marketplace_listing_saves` `mls` join `langol_krishi_sahayak`.`marketplace_listings` `ml` on((`mls`.`listing_id` = `ml`.`listing_id`))) join `langol_krishi_sahayak`.`users` `u` on((`mls`.`user_id` = `u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `mc` on((`ml`.`category_id` = `mc`.`category_id`))) where (`mls`.`saved_at` >= (now() - interval 7 day)) order by `activity_date` desc limit 100;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_seller_performance`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_seller_performance`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_seller_performance` AS select `u`.`user_id` AS `seller_id`,`prof`.`full_name` AS `seller_name`,`prof`.`district` AS `seller_district`,`prof`.`upazila` AS `seller_upazila`,`u`.`user_type` AS `user_type`,`u`.`created_at` AS `seller_joined_date`,count(0) AS `total_listings`,count((case when (`ml`.`status` = 'active') then `ml`.`listing_id` end)) AS `active_listings`,count((case when (`ml`.`status` = 'sold') then `ml`.`listing_id` end)) AS `sold_listings`,count((case when (`ml`.`status` = 'expired') then `ml`.`listing_id` end)) AS `expired_listings`,count((case when (`ml`.`created_at` >= (now() - interval 30 day)) then `ml`.`listing_id` end)) AS `listings_last_30_days`,avg(`ml`.`views_count`) AS `avg_views_per_listing`,avg(`ml`.`saves_count`) AS `avg_saves_per_listing`,avg(`ml`.`contacts_count`) AS `avg_contacts_per_listing`,sum(`ml`.`views_count`) AS `total_views`,sum(`ml`.`saves_count`) AS `total_saves`,sum(`ml`.`contacts_count`) AS `total_contacts`,(case when (count(0) > 0) then round(((count((case when (`ml`.`status` = 'sold') then `ml`.`listing_id` end)) / count(0)) * 100),2) else 0 end) AS `success_rate_percent` from ((`langol_krishi_sahayak`.`users` `u` join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) join `langol_krishi_sahayak`.`marketplace_listings` `ml` on((`u`.`user_id` = `ml`.`seller_id`))) where (`ml`.`status` <> 'draft') group by `u`.`user_id`,`prof`.`full_name`,`prof`.`district`,`prof`.`upazila`,`u`.`user_type`,`u`.`created_at` order by `total_listings` desc;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_user_saved_listings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_user_saved_listings`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `langol_krishi_sahayak`.`v_user_saved_listings` AS select `mls`.`save_id` AS `save_id`,`mls`.`saved_at` AS `saved_at`,`u`.`user_id` AS `saver_id`,`prof`.`full_name` AS `saver_name`,`ml`.`listing_id` AS `listing_id`,`ml`.`title` AS `title`,`ml`.`price` AS `price`,`ml`.`currency` AS `currency`,`ml`.`listing_type` AS `listing_type`,`ml`.`location` AS `location`,`ml`.`status` AS `status`,`ml`.`created_at` AS `listing_created_at`,`ml`.`expires_at` AS `expires_at`,`seller_prof`.`full_name` AS `seller_name`,`seller_prof`.`district` AS `seller_district`,`mc`.`category_name` AS `category_name`,`mc`.`category_name_bn` AS `category_name_bn` from ((((((`langol_krishi_sahayak`.`marketplace_listing_saves` `mls` join `langol_krishi_sahayak`.`users` `u` on((`mls`.`user_id` = `u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `prof` on((`u`.`user_id` = `prof`.`user_id`))) join `langol_krishi_sahayak`.`marketplace_listings` `ml` on((`mls`.`listing_id` = `ml`.`listing_id`))) join `langol_krishi_sahayak`.`users` `seller_u` on((`ml`.`seller_id` = `seller_u`.`user_id`))) left join `langol_krishi_sahayak`.`user_profiles` `seller_prof` on((`seller_u`.`user_id` = `seller_prof`.`user_id`))) left join `langol_krishi_sahayak`.`marketplace_categories` `mc` on((`ml`.`category_id` = `mc`.`category_id`))) order by `mls`.`saved_at` desc;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`active_users_view`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`active_users_view`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_users_view`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`user_type` AS `user_type`, `up`.`full_name` AS `name`, `up`.`district` AS `district`, `up`.`upazila` AS `upazila`, `up`.`division` AS `division`, `u`.`phone` AS `phone`, `u`.`is_verified` AS `is_verified`, `u`.`created_at` AS `created_at`, timestampdiff(DAY,`u`.`created_at`,current_timestamp()) AS `days_since_registration` FROM (`users` `u` left join `user_profiles` `up` on(`u`.`user_id` = `up`.`user_id`)) WHERE `u`.`is_active` = 1 ORDER BY `u`.`created_at` DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_active_consultations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_active_consultations`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_active_consultations`  AS SELECT `c`.`consultation_id` AS `consultation_id`, `c`.`topic` AS `topic`, `c`.`crop_type` AS `crop_type`, `c`.`issue_description` AS `issue_description`, `c`.`priority` AS `priority`, `c`.`status` AS `status`, `c`.`consultation_type` AS `consultation_type`, `c`.`urgency` AS `urgency`, `c`.`created_at` AS `created_at`, to_days(current_timestamp()) - to_days(`c`.`created_at`) AS `days_since_created`, `farmer_prof`.`full_name` AS `farmer_name`, `farmer_prof`.`district` AS `farmer_district`, `farmer_u`.`phone` AS `farmer_phone`, `expert_prof`.`full_name` AS `expert_name`, `expert_prof`.`district` AS `expert_district`, `eq`.`specialization` AS `expert_specialization`, `eq`.`rating` AS `expert_rating` FROM (((((`consultations` `c` join `users` `farmer_u` on(`c`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`)) left join `users` `expert_u` on(`c`.`expert_id` = `expert_u`.`user_id`)) left join `user_profiles` `expert_prof` on(`expert_u`.`user_id` = `expert_prof`.`user_id`)) left join `expert_qualifications` `eq` on(`expert_u`.`user_id` = `eq`.`user_id`)) WHERE `c`.`status` in ('pending','in_progress');

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_comments_with_author`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_comments_with_author`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_comments_with_author`  AS SELECT `c`.`comment_id` AS `comment_id`, `c`.`post_id` AS `post_id`, `c`.`content` AS `content`, `c`.`parent_comment_id` AS `parent_comment_id`, `c`.`likes_count` AS `likes_count`, `c`.`is_reported` AS `is_reported`, `c`.`created_at` AS `created_at`, `c`.`updated_at` AS `updated_at`, `u`.`user_id` AS `author_id`, `u`.`user_type` AS `author_type`, `prof`.`full_name` AS `author_name`, `prof`.`district` AS `author_district`, `prof`.`profile_photo_url` AS `author_photo`, `parent_u`.`user_id` AS `parent_author_id`, `parent_prof`.`full_name` AS `parent_author_name` FROM (((((`comments` `c` join `users` `u` on(`c`.`author_id` = `u`.`user_id`)) left join `user_profiles` `prof` on(`u`.`user_id` = `prof`.`user_id`)) left join `comments` `parent_c` on(`c`.`parent_comment_id` = `parent_c`.`comment_id`)) left join `users` `parent_u` on(`parent_c`.`author_id` = `parent_u`.`user_id`)) left join `user_profiles` `parent_prof` on(`parent_u`.`user_id` = `parent_prof`.`user_id`)) WHERE `c`.`is_deleted` = 0;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_consultations_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_consultations_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_consultations_complete`  AS SELECT `c`.`consultation_id` AS `consultation_id`, `c`.`topic` AS `topic`, `c`.`crop_type` AS `crop_type`, `c`.`issue_description` AS `issue_description`, `c`.`priority` AS `priority`, `c`.`status` AS `status`, `c`.`location` AS `location`, `c`.`images` AS `images`, `c`.`consultation_fee` AS `consultation_fee`, `c`.`payment_status` AS `payment_status`, `c`.`preferred_time` AS `preferred_time`, `c`.`consultation_type` AS `consultation_type`, `c`.`urgency` AS `urgency`, `c`.`created_at` AS `created_at`, `c`.`updated_at` AS `updated_at`, `c`.`resolved_at` AS `resolved_at`, to_days(coalesce(`c`.`resolved_at`,current_timestamp())) - to_days(`c`.`created_at`) AS `resolution_days`, `c`.`farmer_id` AS `farmer_id`, `farmer_prof`.`full_name` AS `farmer_name`, `farmer_prof`.`district` AS `farmer_district`, `farmer_prof`.`upazila` AS `farmer_upazila`, `farmer_u`.`phone` AS `farmer_phone`, `farmer_prof`.`profile_photo_url` AS `farmer_photo`, `c`.`expert_id` AS `expert_id`, `expert_prof`.`full_name` AS `expert_name`, `expert_prof`.`district` AS `expert_district`, `expert_u`.`phone` AS `expert_phone`, `expert_prof`.`profile_photo_url` AS `expert_photo`, `eq`.`qualification` AS `expert_qualification`, `eq`.`specialization` AS `expert_specialization`, `eq`.`experience_years` AS `expert_experience`, `eq`.`rating` AS `expert_rating`, `eq`.`total_consultations` AS `expert_total_consultations` FROM (((((`consultations` `c` join `users` `farmer_u` on(`c`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`)) left join `users` `expert_u` on(`c`.`expert_id` = `expert_u`.`user_id`)) left join `user_profiles` `expert_prof` on(`expert_u`.`user_id` = `expert_prof`.`user_id`)) left join `expert_qualifications` `eq` on(`expert_u`.`user_id` = `eq`.`user_id`));

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_consultation_responses_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_consultation_responses_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_consultation_responses_complete`  AS SELECT `cr`.`response_id` AS `response_id`, `cr`.`consultation_id` AS `consultation_id`, `cr`.`response_text` AS `response_text`, `cr`.`attachments` AS `attachments`, `cr`.`is_final_response` AS `is_final_response`, `cr`.`diagnosis` AS `diagnosis`, `cr`.`treatment` AS `treatment`, `cr`.`created_at` AS `created_at`, `cr`.`expert_id` AS `expert_id`, `expert_prof`.`full_name` AS `expert_name`, `expert_prof`.`district` AS `expert_district`, `eq`.`qualification` AS `expert_qualification`, `eq`.`specialization` AS `expert_specialization`, `eq`.`experience_years` AS `expert_experience`, `eq`.`rating` AS `expert_rating`, `c`.`topic` AS `consultation_topic`, `c`.`crop_type` AS `crop_type`, `c`.`priority` AS `priority`, `c`.`urgency` AS `urgency`, `farmer_prof`.`full_name` AS `farmer_name`, `farmer_prof`.`district` AS `farmer_district` FROM ((((((`consultation_responses` `cr` join `consultations` `c` on(`cr`.`consultation_id` = `c`.`consultation_id`)) join `users` `expert_u` on(`cr`.`expert_id` = `expert_u`.`user_id`)) left join `user_profiles` `expert_prof` on(`expert_u`.`user_id` = `expert_prof`.`user_id`)) left join `expert_qualifications` `eq` on(`expert_u`.`user_id` = `eq`.`user_id`)) join `users` `farmer_u` on(`c`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`)) ORDER BY `cr`.`created_at` DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_customer_details`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_customer_details`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_customer_details`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`phone` AS `phone`, `u`.`is_verified` AS `is_verified`, `u`.`is_active` AS `is_active`, `p`.`full_name` AS `full_name`, `p`.`nid_number` AS `nid_number`, `p`.`address` AS `address`, `p`.`district` AS `district`, `p`.`upazila` AS `upazila`, `p`.`division` AS `division`, `p`.`verification_status` AS `verification_status`, `c`.`business_id` AS `business_id`, `c`.`business_name` AS `business_name`, `c`.`business_type` AS `business_type`, `c`.`trade_license_number` AS `trade_license_number`, `c`.`business_address` AS `business_address`, `c`.`established_year` AS `established_year`, `c`.`created_at` AS `business_created_at` FROM ((`users` `u` join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) join `customer_business_details` `c` on(`u`.`user_id` = `c`.`user_id`)) WHERE `u`.`user_type` = 'customer';

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_data_operator_details`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_data_operator_details`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_data_operator_details`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`phone` AS `phone`, `u`.`is_verified` AS `is_verified`, `u`.`is_active` AS `is_active`, `p`.`full_name` AS `full_name`, `p`.`nid_number` AS `nid_number`, `p`.`address` AS `address`, `p`.`district` AS `district`, `p`.`upazila` AS `upazila`, `p`.`division` AS `division`, `p`.`verification_status` AS `verification_status`, `d`.`operator_id` AS `operator_id`, `d`.`operator_code` AS `operator_code`, `d`.`assigned_area` AS `assigned_area`, `d`.`department` AS `department`, `d`.`position` AS `position`, `d`.`joining_date` AS `joining_date`, `d`.`permissions` AS `permissions`, `d`.`last_active` AS `last_active`, `d`.`created_at` AS `operator_created_at`, `supervisor`.`full_name` AS `supervisor_name` FROM ((((`users` `u` join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) join `data_operators` `d` on(`u`.`user_id` = `d`.`user_id`)) left join `data_operators` `supervisor_op` on(`d`.`supervisor_id` = `supervisor_op`.`operator_id`)) left join `user_profiles` `supervisor` on(`supervisor_op`.`user_id` = `supervisor`.`user_id`)) WHERE `u`.`user_type` = 'data_operator';

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_diagnoses_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_diagnoses_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_diagnoses_complete`  AS SELECT `d`.`diagnosis_id` AS `diagnosis_id`, `d`.`crop_type` AS `crop_type`, `d`.`symptoms_description` AS `symptoms_description`, `d`.`uploaded_images` AS `uploaded_images`, `d`.`farm_area` AS `farm_area`, `d`.`area_unit` AS `area_unit`, `d`.`ai_analysis_result` AS `ai_analysis_result`, `d`.`is_verified_by_expert` AS `is_verified_by_expert`, `d`.`urgency` AS `urgency`, `d`.`status` AS `status`, `d`.`location` AS `location`, `d`.`created_at` AS `created_at`, `d`.`updated_at` AS `updated_at`, `d`.`farmer_id` AS `farmer_id`, `farmer_prof`.`full_name` AS `farmer_name`, `farmer_prof`.`district` AS `farmer_district`, `farmer_prof`.`upazila` AS `farmer_upazila`, `farmer_u`.`phone` AS `farmer_phone`, `farmer_prof`.`profile_photo_url` AS `farmer_photo`, `d`.`expert_verification_id` AS `expert_verification_id`, `expert_prof`.`full_name` AS `expert_name`, `expert_prof`.`district` AS `expert_district`, `eq`.`qualification` AS `expert_qualification`, `eq`.`specialization` AS `expert_specialization`, `eq`.`experience_years` AS `expert_experience`, `eq`.`rating` AS `expert_rating` FROM (((((`diagnoses` `d` join `users` `farmer_u` on(`d`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`)) left join `users` `expert_u` on(`d`.`expert_verification_id` = `expert_u`.`user_id`)) left join `user_profiles` `expert_prof` on(`expert_u`.`user_id` = `expert_prof`.`user_id`)) left join `expert_qualifications` `eq` on(`expert_u`.`user_id` = `eq`.`user_id`));

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_disease_outbreak_alert`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_disease_outbreak_alert`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_disease_outbreak_alert`  AS SELECT `dt`.`disease_name` AS `disease_name`, `dt`.`disease_name_bn` AS `disease_name_bn`, `d`.`crop_type` AS `crop_type`, `d`.`location` AS `location`, `farmer_prof`.`district` AS `district`, `farmer_prof`.`upazila` AS `upazila`, count(0) AS `cases_count`, count(case when `d`.`created_at` >= current_timestamp() - interval 7 day then `d`.`diagnosis_id` end) AS `cases_last_7_days`, count(case when `d`.`created_at` >= current_timestamp() - interval 30 day then `d`.`diagnosis_id` end) AS `cases_last_30_days`, avg(`dt`.`probability_percentage`) AS `avg_probability`, sum(`d`.`farm_area`) AS `total_affected_area`, min(`d`.`created_at`) AS `first_case_date`, max(`d`.`created_at`) AS `latest_case_date`, CASE WHEN count(case when `d`.`created_at` >= current_timestamp() - interval 7 day then `d`.`diagnosis_id` end) >= 5 THEN 'High Alert' WHEN count(case when `d`.`created_at` >= current_timestamp() - interval 7 day then `d`.`diagnosis_id` end) >= 3 THEN 'Medium Alert' WHEN count(case when `d`.`created_at` >= current_timestamp() - interval 30 day then `d`.`diagnosis_id` end) >= 5 THEN 'Low Alert' ELSE 'Normal' END AS `alert_level` FROM (((`diagnoses` `d` join `disease_treatments` `dt` on(`d`.`diagnosis_id` = `dt`.`diagnosis_id`)) join `users` `farmer_u` on(`d`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`)) WHERE `d`.`created_at` >= current_timestamp() - interval 90 day GROUP BY `dt`.`disease_name`, `dt`.`disease_name_bn`, `d`.`crop_type`, `d`.`location`, `farmer_prof`.`district`, `farmer_prof`.`upazila` HAVING `cases_count` >= 2 ORDER BY count(case when `d`.`created_at` >= current_timestamp() - interval 7 day then `d`.`diagnosis_id` end) DESC, sum(`d`.`farm_area`) DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_disease_statistics_by_crop`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_disease_statistics_by_crop`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_disease_statistics_by_crop`  AS SELECT `d`.`crop_type` AS `crop_type`, count(distinct `d`.`diagnosis_id`) AS `total_diagnoses`, count(distinct `d`.`farmer_id`) AS `unique_farmers_affected`, count(distinct `dt`.`disease_name`) AS `unique_diseases_identified`, count(case when `d`.`status` = 'diagnosed' then `d`.`diagnosis_id` end) AS `diagnosed_cases`, count(case when `d`.`status` = 'completed' then `d`.`diagnosis_id` end) AS `completed_cases`, count(case when `d`.`is_verified_by_expert` = 1 then `d`.`diagnosis_id` end) AS `expert_verified_cases`, avg(`dt`.`estimated_cost`) AS `avg_treatment_cost`, sum(`d`.`farm_area`) AS `total_affected_area`, count(case when `d`.`created_at` >= current_timestamp() - interval 30 day then `d`.`diagnosis_id` end) AS `cases_last_30_days`, (select `dt2`.`disease_name` from (`disease_treatments` `dt2` join `diagnoses` `d2` on(`dt2`.`diagnosis_id` = `d2`.`diagnosis_id`)) where `d2`.`crop_type` = `d`.`crop_type` group by `dt2`.`disease_name` order by count(0) desc limit 1) AS `most_common_disease` FROM (`diagnoses` `d` left join `disease_treatments` `dt` on(`d`.`diagnosis_id` = `dt`.`diagnosis_id`)) WHERE `d`.`crop_type` is not null AND `d`.`crop_type` <> '' GROUP BY `d`.`crop_type` ORDER BY count(distinct `d`.`diagnosis_id`) DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_disease_treatments_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_disease_treatments_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_disease_treatments_complete`  AS SELECT `dt`.`treatment_id` AS `treatment_id`, `dt`.`diagnosis_id` AS `diagnosis_id`, `dt`.`disease_name` AS `disease_name`, `dt`.`disease_name_bn` AS `disease_name_bn`, `dt`.`probability_percentage` AS `probability_percentage`, `dt`.`treatment_description` AS `treatment_description`, `dt`.`estimated_cost` AS `estimated_cost`, `dt`.`treatment_guidelines` AS `treatment_guidelines`, `dt`.`prevention_guidelines` AS `prevention_guidelines`, `dt`.`video_links` AS `video_links`, `dt`.`disease_type` AS `disease_type`, `dt`.`created_at` AS `treatment_created_at`, `d`.`crop_type` AS `crop_type`, `d`.`symptoms_description` AS `symptoms_description`, `d`.`farm_area` AS `farm_area`, `d`.`area_unit` AS `area_unit`, `d`.`urgency` AS `urgency`, `d`.`status` AS `diagnosis_status`, `d`.`location` AS `location`, `d`.`created_at` AS `diagnosis_created_at`, `farmer_prof`.`full_name` AS `farmer_name`, `farmer_prof`.`district` AS `farmer_district`, `farmer_prof`.`upazila` AS `farmer_upazila`, `farmer_u`.`phone` AS `farmer_phone` FROM (((`disease_treatments` `dt` join `diagnoses` `d` on(`dt`.`diagnosis_id` = `d`.`diagnosis_id`)) join `users` `farmer_u` on(`d`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`)) ORDER BY `dt`.`probability_percentage` DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_expert_details`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_expert_details`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_expert_details`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`phone` AS `phone`, `u`.`is_verified` AS `is_verified`, `u`.`is_active` AS `is_active`, `p`.`full_name` AS `full_name`, `p`.`nid_number` AS `nid_number`, `p`.`address` AS `address`, `p`.`district` AS `district`, `p`.`upazila` AS `upazila`, `p`.`division` AS `division`, `p`.`verification_status` AS `verification_status`, `e`.`expert_id` AS `expert_id`, `e`.`qualification` AS `qualification`, `e`.`specialization` AS `specialization`, `e`.`experience_years` AS `experience_years`, `e`.`institution` AS `institution`, `e`.`consultation_fee` AS `consultation_fee`, `e`.`rating` AS `rating`, `e`.`total_consultations` AS `total_consultations`, `e`.`is_government_approved` AS `is_government_approved`, `e`.`license_number` AS `license_number`, `e`.`created_at` AS `expert_created_at` FROM ((`users` `u` join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) join `expert_qualifications` `e` on(`u`.`user_id` = `e`.`user_id`)) WHERE `u`.`user_type` = 'expert';

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_expert_verification_performance`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_expert_verification_performance`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_expert_verification_performance`  AS SELECT `expert_u`.`user_id` AS `expert_id`, `expert_prof`.`full_name` AS `expert_name`, `expert_prof`.`district` AS `expert_district`, `eq`.`specialization` AS `specialization`, `eq`.`rating` AS `rating`, count(distinct `d`.`diagnosis_id`) AS `total_verifications`, count(case when `d`.`status` = 'diagnosed' then `d`.`diagnosis_id` end) AS `successful_diagnoses`, count(case when `d`.`status` = 'completed' then `d`.`diagnosis_id` end) AS `completed_cases`, count(case when `d`.`created_at` >= current_timestamp() - interval 30 day then `d`.`diagnosis_id` end) AS `verifications_last_30_days`, avg(to_days(`d`.`updated_at`) - to_days(`d`.`created_at`)) AS `avg_verification_days`, CASE WHEN count(distinct `d`.`diagnosis_id`) > 0 THEN round(count(case when `d`.`status` = 'completed' then `d`.`diagnosis_id` end) / count(distinct `d`.`diagnosis_id`) * 100,2) ELSE 0 END AS `completion_rate_percent`, group_concat(distinct `d`.`crop_type` order by `d`.`crop_type` ASC separator ',') AS `verified_crop_types` FROM (((`users` `expert_u` join `expert_qualifications` `eq` on(`expert_u`.`user_id` = `eq`.`user_id`)) left join `user_profiles` `expert_prof` on(`expert_u`.`user_id` = `expert_prof`.`user_id`)) left join `diagnoses` `d` on(`expert_u`.`user_id` = `d`.`expert_verification_id`)) WHERE `expert_u`.`user_type` = 'expert' GROUP BY `expert_u`.`user_id`, `expert_prof`.`full_name`, `expert_prof`.`district`, `eq`.`specialization`, `eq`.`rating` ORDER BY count(distinct `d`.`diagnosis_id`) DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_farmer_details`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_farmer_details`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_farmer_details`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`phone` AS `phone`, `u`.`is_verified` AS `is_verified`, `u`.`is_active` AS `is_active`, `p`.`full_name` AS `full_name`, `p`.`nid_number` AS `nid_number`, `p`.`date_of_birth` AS `date_of_birth`, `p`.`address` AS `address`, `p`.`district` AS `district`, `p`.`upazila` AS `upazila`, `p`.`division` AS `division`, `p`.`verification_status` AS `verification_status`, `f`.`farmer_id` AS `farmer_id`, `f`.`farm_size` AS `farm_size`, `f`.`farm_size_unit` AS `farm_size_unit`, `f`.`farm_type` AS `farm_type`, `f`.`experience_years` AS `experience_years`, `f`.`land_ownership` AS `land_ownership`, `f`.`registration_date` AS `registration_date`, `f`.`krishi_card_number` AS `krishi_card_number`, `f`.`created_at` AS `farmer_created_at` FROM ((`users` `u` join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) join `farmer_details` `f` on(`u`.`user_id` = `f`.`user_id`)) WHERE `u`.`user_type` = 'farmer';

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_notifications_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_notifications_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_notifications_complete`  AS SELECT `n`.`notification_id` AS `notification_id`, `n`.`notification_type` AS `notification_type`, `n`.`title` AS `title`, `n`.`message` AS `message`, `n`.`related_entity_id` AS `related_entity_id`, `n`.`is_read` AS `is_read`, `n`.`created_at` AS `created_at`, `n`.`read_at` AS `read_at`, to_days(current_timestamp()) - to_days(`n`.`created_at`) AS `days_since_created`, `n`.`recipient_id` AS `recipient_id`, `recipient_prof`.`full_name` AS `recipient_name`, `recipient_prof`.`district` AS `recipient_district`, `recipient_u`.`user_type` AS `recipient_type`, `recipient_u`.`phone` AS `recipient_phone`, `n`.`sender_id` AS `sender_id`, `sender_prof`.`full_name` AS `sender_name`, `sender_prof`.`district` AS `sender_district`, `sender_u`.`user_type` AS `sender_type`, CASE WHEN `n`.`notification_type` = 'weather_alert' THEN 'High' WHEN `n`.`notification_type` = 'consultation_request' THEN 'Medium' WHEN `n`.`notification_type` = 'system' THEN 'Medium' WHEN `n`.`notification_type` = 'diagnosis' THEN 'Medium' WHEN `n`.`notification_type` = 'marketplace' THEN 'Low' WHEN `n`.`notification_type` = 'post_interaction' THEN 'Low' ELSE 'Normal' END AS `priority_level` FROM ((((`notifications` `n` join `users` `recipient_u` on(`n`.`recipient_id` = `recipient_u`.`user_id`)) left join `user_profiles` `recipient_prof` on(`recipient_u`.`user_id` = `recipient_prof`.`user_id`)) left join `users` `sender_u` on(`n`.`sender_id` = `sender_u`.`user_id`)) left join `user_profiles` `sender_prof` on(`sender_u`.`user_id` = `sender_prof`.`user_id`)) ORDER BY `n`.`created_at` DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_pending_diagnoses_for_verification`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_pending_diagnoses_for_verification`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pending_diagnoses_for_verification`  AS SELECT `d`.`diagnosis_id` AS `diagnosis_id`, `d`.`crop_type` AS `crop_type`, `d`.`symptoms_description` AS `symptoms_description`, `d`.`uploaded_images` AS `uploaded_images`, `d`.`farm_area` AS `farm_area`, `d`.`area_unit` AS `area_unit`, `d`.`urgency` AS `urgency`, `d`.`location` AS `location`, `d`.`created_at` AS `created_at`, to_days(current_timestamp()) - to_days(`d`.`created_at`) AS `days_pending`, `farmer_prof`.`full_name` AS `farmer_name`, `farmer_prof`.`district` AS `farmer_district`, `farmer_prof`.`upazila` AS `farmer_upazila`, `farmer_u`.`phone` AS `farmer_phone`, json_extract(`d`.`ai_analysis_result`,'$.predicted_disease') AS `ai_predicted_disease`, json_extract(`d`.`ai_analysis_result`,'$.confidence_score') AS `ai_confidence_score`, group_concat(distinct concat(`expert_prof`.`full_name`,' (',`eq`.`specialization`,', Rating: ',`eq`.`rating`,')') separator '; ') AS `available_experts` FROM (((((`diagnoses` `d` join `users` `farmer_u` on(`d`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`)) left join `expert_qualifications` `eq` on(`eq`.`specialization` like concat('%',`d`.`crop_type`,'%') or `d`.`crop_type` like concat('%',`eq`.`specialization`,'%'))) left join `users` `expert_u` on(`eq`.`user_id` = `expert_u`.`user_id`)) left join `user_profiles` `expert_prof` on(`expert_u`.`user_id` = `expert_prof`.`user_id`)) WHERE `d`.`is_verified_by_expert` = 0 AND `d`.`status` = 'pending' GROUP BY `d`.`diagnosis_id`, `d`.`crop_type`, `d`.`symptoms_description`, `d`.`uploaded_images`, `d`.`farm_area`, `d`.`area_unit`, `d`.`urgency`, `d`.`location`, `d`.`created_at`, `farmer_prof`.`full_name`, `farmer_prof`.`district`, `farmer_prof`.`upazila`, `farmer_u`.`phone`, `d`.`ai_analysis_result` ORDER BY `d`.`urgency` DESC, `d`.`created_at` ASC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_pending_profile_verifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_pending_profile_verifications`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pending_profile_verifications`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`user_type` AS `user_type`, `u`.`phone` AS `phone`, `u`.`created_at` AS `user_created_at`, `p`.`profile_id` AS `profile_id`, `p`.`full_name` AS `full_name`, `p`.`nid_number` AS `nid_number`, `p`.`district` AS `district`, `p`.`upazila` AS `upazila`, `p`.`division` AS `division`, `p`.`verification_status` AS `verification_status`, `p`.`created_at` AS `profile_created_at`, to_days(curdate()) - to_days(cast(`p`.`created_at` as date)) AS `days_pending` FROM (`users` `u` join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) WHERE `p`.`verification_status` = 'pending' ORDER BY `p`.`created_at` ASC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_popular_posts_weekly`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_popular_posts_weekly`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_popular_posts_weekly`  AS SELECT `p`.`post_id` AS `post_id`, `p`.`content` AS `content`, `p`.`post_type` AS `post_type`, `p`.`location` AS `location`, `p`.`created_at` AS `created_at`, `prof`.`full_name` AS `author_name`, `prof`.`district` AS `author_district`, `p`.`likes_count` AS `likes_count`, `p`.`comments_count` AS `comments_count`, `p`.`shares_count` AS `shares_count`, `p`.`views_count` AS `views_count`, `p`.`likes_count`+ `p`.`comments_count` + `p`.`shares_count` AS `total_interactions` FROM ((`posts` `p` join `users` `u` on(`p`.`author_id` = `u`.`user_id`)) left join `user_profiles` `prof` on(`u`.`user_id` = `prof`.`user_id`)) WHERE `p`.`is_deleted` = 0 AND `p`.`created_at` >= current_timestamp() - interval 7 day ORDER BY `p`.`likes_count`+ `p`.`comments_count` + `p`.`shares_count` DESC, `p`.`views_count` DESC LIMIT 0, 50;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_posts_by_location`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_posts_by_location`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_posts_by_location`  AS SELECT `p`.`location` AS `location`, count(0) AS `total_posts`, count(distinct `p`.`author_id`) AS `unique_authors`, avg(`p`.`likes_count`) AS `avg_likes`, avg(`p`.`comments_count`) AS `avg_comments`, avg(`p`.`views_count`) AS `avg_views`, max(`p`.`created_at`) AS `latest_post_date`, min(`p`.`created_at`) AS `earliest_post_date` FROM `posts` AS `p` WHERE `p`.`is_deleted` = 0 AND `p`.`location` is not null AND `p`.`location` <> '' GROUP BY `p`.`location` HAVING `total_posts` >= 1 ORDER BY count(0) DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_posts_with_author`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_posts_with_author`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_posts_with_author`  AS SELECT `p`.`post_id` AS `post_id`, `p`.`content` AS `content`, `p`.`post_type` AS `post_type`, `p`.`marketplace_listing_id` AS `marketplace_listing_id`, `p`.`images` AS `images`, `p`.`location` AS `location`, `p`.`likes_count` AS `likes_count`, `p`.`comments_count` AS `comments_count`, `p`.`shares_count` AS `shares_count`, `p`.`views_count` AS `views_count`, `p`.`is_pinned` AS `is_pinned`, `p`.`is_reported` AS `is_reported`, `p`.`created_at` AS `created_at`, `p`.`updated_at` AS `updated_at`, `u`.`user_id` AS `author_id`, `u`.`user_type` AS `author_type`, `prof`.`full_name` AS `author_name`, `prof`.`district` AS `author_district`, `prof`.`profile_photo_url` AS `author_photo` FROM ((`posts` `p` join `users` `u` on(`p`.`author_id` = `u`.`user_id`)) left join `user_profiles` `prof` on(`u`.`user_id` = `prof`.`user_id`)) WHERE `p`.`is_deleted` = 0;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_post_comments_tree`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_post_comments_tree`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_post_comments_tree`  AS SELECT `c`.`comment_id` AS `comment_id`, `c`.`post_id` AS `post_id`, `c`.`content` AS `content`, `c`.`parent_comment_id` AS `parent_comment_id`, `c`.`likes_count` AS `likes_count`, `c`.`created_at` AS `created_at`, `prof`.`full_name` AS `author_name`, `prof`.`district` AS `author_district`, `u`.`user_type` AS `author_type`, CASE WHEN `c`.`parent_comment_id` is null THEN 0 ELSE 1 END AS `comment_level`, `parent_c`.`content` AS `parent_comment_content`, `parent_prof`.`full_name` AS `parent_author_name` FROM (((((`comments` `c` join `users` `u` on(`c`.`author_id` = `u`.`user_id`)) left join `user_profiles` `prof` on(`u`.`user_id` = `prof`.`user_id`)) left join `comments` `parent_c` on(`c`.`parent_comment_id` = `parent_c`.`comment_id`)) left join `users` `parent_u` on(`parent_c`.`author_id` = `parent_u`.`user_id`)) left join `user_profiles` `parent_prof` on(`parent_u`.`user_id` = `parent_prof`.`user_id`)) WHERE `c`.`is_deleted` = 0 ORDER BY `c`.`post_id` ASC, `c`.`parent_comment_id` ASC, `c`.`created_at` ASC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_post_engagement_summary`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_post_engagement_summary`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_post_engagement_summary`  AS SELECT `p`.`post_id` AS `post_id`, `p`.`post_type` AS `post_type`, `p`.`location` AS `location`, `p`.`created_at` AS `created_at`, `prof`.`full_name` AS `author_name`, `prof`.`district` AS `author_district`, `p`.`likes_count` AS `likes_count`, `p`.`comments_count` AS `comments_count`, `p`.`shares_count` AS `shares_count`, `p`.`views_count` AS `views_count`, `p`.`likes_count`+ `p`.`comments_count` + `p`.`shares_count` AS `total_interactions`, CASE WHEN `p`.`views_count` > 0 THEN round((`p`.`likes_count` + `p`.`comments_count` + `p`.`shares_count`) / `p`.`views_count` * 100,2) ELSE 0 END AS `engagement_rate_percent`, group_concat(distinct `pt`.`tag_name` separator ',') AS `tags` FROM ((((`posts` `p` join `users` `u` on(`p`.`author_id` = `u`.`user_id`)) left join `user_profiles` `prof` on(`u`.`user_id` = `prof`.`user_id`)) left join `post_tag_relations` `ptr` on(`p`.`post_id` = `ptr`.`post_id`)) left join `post_tags` `pt` on(`ptr`.`tag_id` = `pt`.`tag_id`)) WHERE `p`.`is_deleted` = 0 GROUP BY `p`.`post_id`, `p`.`post_type`, `p`.`location`, `p`.`created_at`, `prof`.`full_name`, `prof`.`district`, `p`.`likes_count`, `p`.`comments_count`, `p`.`shares_count`, `p`.`views_count`;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_post_tags_with_usage`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_post_tags_with_usage`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_post_tags_with_usage`  AS SELECT `pt`.`tag_id` AS `tag_id`, `pt`.`tag_name` AS `tag_name`, `pt`.`usage_count` AS `usage_count`, `pt`.`created_at` AS `created_at`, count(`ptr`.`post_id`) AS `current_usage_count`, group_concat(distinct `ptr`.`post_id` separator ',') AS `related_post_ids` FROM (`post_tags` `pt` left join `post_tag_relations` `ptr` on(`pt`.`tag_id` = `ptr`.`tag_id`)) GROUP BY `pt`.`tag_id`, `pt`.`tag_name`, `pt`.`usage_count`, `pt`.`created_at` ORDER BY `pt`.`usage_count` DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_recent_user_registrations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_recent_user_registrations`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_recent_user_registrations`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`user_type` AS `user_type`, `u`.`phone` AS `phone`, `u`.`is_verified` AS `is_verified`, `u`.`created_at` AS `created_at`, `p`.`full_name` AS `full_name`, `p`.`district` AS `district`, `p`.`upazila` AS `upazila`, `p`.`verification_status` AS `verification_status`, to_days(curdate()) - to_days(cast(`u`.`created_at` as date)) AS `days_since_registration` FROM (`users` `u` left join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) WHERE `u`.`created_at` >= current_timestamp() - interval 30 day ORDER BY `u`.`created_at` DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_system_settings_management`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_system_settings_management`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_system_settings_management`  AS SELECT `ss`.`setting_id` AS `setting_id`, `ss`.`setting_key` AS `setting_key`, `ss`.`setting_value` AS `setting_value`, `ss`.`setting_type` AS `setting_type`, `ss`.`description` AS `description`, `ss`.`is_public` AS `is_public`, `ss`.`updated_at` AS `updated_at`, `ss`.`created_at` AS `created_at`, `ss`.`updated_by` AS `updated_by`, `updater_prof`.`full_name` AS `updated_by_name`, `updater_u`.`user_type` AS `updated_by_type`, CASE WHEN `ss`.`setting_key` like 'app_%' THEN 'Application' WHEN `ss`.`setting_key` like 'notification_%' THEN 'Notifications' WHEN `ss`.`setting_key` like 'market_%' THEN 'Marketplace' WHEN `ss`.`setting_key` like 'weather_%' THEN 'Weather' WHEN `ss`.`setting_key` like 'security_%' THEN 'Security' WHEN `ss`.`setting_key` like 'system_%' THEN 'System' ELSE 'General' END AS `setting_category`, CASE WHEN `ss`.`is_public` = 1 THEN 'Public' ELSE 'Admin Only' END AS `access_level` FROM ((`system_settings` `ss` left join `users` `updater_u` on(`ss`.`updated_by` = `updater_u`.`user_id`)) left join `user_profiles` `updater_prof` on(`updater_u`.`user_id` = `updater_prof`.`user_id`)) ORDER BY CASE WHEN `ss`.`setting_key` like 'app_%' THEN 'Application' WHEN `ss`.`setting_key` like 'notification_%' THEN 'Notifications' WHEN `ss`.`setting_key` like 'market_%' THEN 'Marketplace' WHEN `ss`.`setting_key` like 'weather_%' THEN 'Weather' WHEN `ss`.`setting_key` like 'security_%' THEN 'Security' WHEN `ss`.`setting_key` like 'system_%' THEN 'System' ELSE 'General' END ASC, `ss`.`setting_key` ASC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_treatment_chemicals_complete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_treatment_chemicals_complete`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_treatment_chemicals_complete`  AS SELECT `tc`.`chemical_id` AS `chemical_id`, `tc`.`treatment_id` AS `treatment_id`, `tc`.`chemical_name` AS `chemical_name`, `tc`.`chemical_type` AS `chemical_type`, `tc`.`dose_per_acre` AS `dose_per_acre`, `tc`.`dose_unit` AS `dose_unit`, `tc`.`price_per_unit` AS `price_per_unit`, `tc`.`application_notes` AS `application_notes`, `tc`.`safety_precautions` AS `safety_precautions`, `tc`.`application_method` AS `application_method`, `tc`.`created_at` AS `chemical_created_at`, `dt`.`disease_name` AS `disease_name`, `dt`.`disease_name_bn` AS `disease_name_bn`, `dt`.`probability_percentage` AS `probability_percentage`, `dt`.`estimated_cost` AS `total_treatment_cost`, `d`.`diagnosis_id` AS `diagnosis_id`, `d`.`crop_type` AS `crop_type`, `d`.`farm_area` AS `farm_area`, `d`.`area_unit` AS `area_unit`, CASE WHEN `d`.`area_unit` = 'acre' THEN `tc`.`dose_per_acre`* `tc`.`price_per_unit` * `d`.`farm_area` WHEN `d`.`area_unit` = 'bigha' THEN `tc`.`dose_per_acre`* `tc`.`price_per_unit` * (`d`.`farm_area` * 0.33) WHEN `d`.`area_unit` = 'katha' THEN `tc`.`dose_per_acre`* `tc`.`price_per_unit` * (`d`.`farm_area` * 0.0165) ELSE `tc`.`dose_per_acre`* `tc`.`price_per_unit` * `d`.`farm_area` END AS `estimated_chemical_cost_for_farm`, `farmer_prof`.`full_name` AS `farmer_name`, `farmer_prof`.`district` AS `farmer_district` FROM ((((`treatment_chemicals` `tc` join `disease_treatments` `dt` on(`tc`.`treatment_id` = `dt`.`treatment_id`)) join `diagnoses` `d` on(`dt`.`diagnosis_id` = `d`.`diagnosis_id`)) join `users` `farmer_u` on(`d`.`farmer_id` = `farmer_u`.`user_id`)) left join `user_profiles` `farmer_prof` on(`farmer_u`.`user_id` = `farmer_prof`.`user_id`));

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_trending_tags_monthly`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_trending_tags_monthly`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_trending_tags_monthly`  AS SELECT `pt`.`tag_id` AS `tag_id`, `pt`.`tag_name` AS `tag_name`, count(`ptr`.`post_id`) AS `usage_last_30_days`, count(distinct `p`.`author_id`) AS `unique_users_using`, avg(`p`.`likes_count` + `p`.`comments_count` + `p`.`shares_count`) AS `avg_engagement_per_post`, max(`p`.`created_at`) AS `last_used_at` FROM ((`post_tags` `pt` join `post_tag_relations` `ptr` on(`pt`.`tag_id` = `ptr`.`tag_id`)) join `posts` `p` on(`ptr`.`post_id` = `p`.`post_id`)) WHERE `p`.`created_at` >= current_timestamp() - interval 30 day AND `p`.`is_deleted` = 0 GROUP BY `pt`.`tag_id`, `pt`.`tag_name` HAVING `usage_last_30_days` >= 3 ORDER BY count(`ptr`.`post_id`) DESC, avg(`p`.`likes_count` + `p`.`comments_count` + `p`.`shares_count`) DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_user_complete_info`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_user_complete_info`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_complete_info`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`user_type` AS `user_type`, `u`.`phone` AS `phone`, `u`.`is_verified` AS `is_verified`, `u`.`is_active` AS `is_active`, `u`.`created_at` AS `user_created_at`, `u`.`updated_at` AS `user_updated_at`, `p`.`profile_id` AS `profile_id`, `p`.`full_name` AS `full_name`, `p`.`nid_number` AS `nid_number`, `p`.`date_of_birth` AS `date_of_birth`, `p`.`father_name` AS `father_name`, `p`.`mother_name` AS `mother_name`, `p`.`address` AS `address`, `p`.`district` AS `district`, `p`.`upazila` AS `upazila`, `p`.`division` AS `division`, `p`.`profile_photo_url` AS `profile_photo_url`, `p`.`verification_status` AS `verification_status`, `p`.`verified_at` AS `verified_at`, `p`.`created_at` AS `profile_created_at`, `verifier`.`full_name` AS `verified_by_name` FROM ((`users` `u` left join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) left join `user_profiles` `verifier` on(`p`.`verified_by` = `verifier`.`user_id`));

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_user_sessions_management`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_user_sessions_management`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_sessions_management`  AS SELECT `us`.`session_id` AS `session_id`, `us`.`session_token` AS `session_token`, `us`.`device_info` AS `device_info`, `us`.`ip_address` AS `ip_address`, `us`.`is_active` AS `is_active`, `us`.`expires_at` AS `expires_at`, `us`.`created_at` AS `created_at`, to_days(`us`.`expires_at`) - to_days(current_timestamp()) AS `days_until_expiry`, CASE WHEN `us`.`expires_at` < current_timestamp() THEN 'Expired' WHEN `us`.`is_active` = 0 THEN 'Inactive' WHEN to_days(`us`.`expires_at`) - to_days(current_timestamp()) <= 3 THEN 'Expiring Soon' ELSE 'Active' END AS `session_status`, `us`.`user_id` AS `user_id`, `prof`.`full_name` AS `user_name`, `prof`.`district` AS `user_district`, `u`.`user_type` AS `user_type`, `u`.`phone` AS `phone`, `u`.`email` AS `email`, timestampdiff(HOUR,`us`.`created_at`,coalesce(`us`.`expires_at`,current_timestamp())) AS `total_session_hours` FROM ((`user_sessions` `us` join `users` `u` on(`us`.`user_id` = `u`.`user_id`)) left join `user_profiles` `prof` on(`u`.`user_id` = `prof`.`user_id`)) ORDER BY `us`.`created_at` DESC;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_user_social_activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_user_social_activity`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_social_activity`  AS SELECT `u`.`user_id` AS `user_id`, `prof`.`full_name` AS `full_name`, `prof`.`district` AS `district`, `u`.`user_type` AS `user_type`, count(distinct `p`.`post_id`) AS `total_posts`, count(distinct case when `p`.`created_at` >= current_timestamp() - interval 30 day then `p`.`post_id` end) AS `posts_last_30_days`, avg(`p`.`likes_count`) AS `avg_post_likes`, avg(`p`.`comments_count`) AS `avg_post_comments`, count(distinct `c`.`comment_id`) AS `total_comments`, count(distinct case when `c`.`created_at` >= current_timestamp() - interval 30 day then `c`.`comment_id` end) AS `comments_last_30_days`, count(distinct `pl`.`like_id`) AS `total_likes_given`, count(distinct case when `pl`.`liked_at` >= current_timestamp() - interval 30 day then `pl`.`like_id` end) AS `likes_given_last_30_days` FROM ((((`users` `u` left join `user_profiles` `prof` on(`u`.`user_id` = `prof`.`user_id`)) left join `posts` `p` on(`u`.`user_id` = `p`.`author_id` and `p`.`is_deleted` = 0)) left join `comments` `c` on(`u`.`user_id` = `c`.`author_id` and `c`.`is_deleted` = 0)) left join `post_likes` `pl` on(`u`.`user_id` = `pl`.`user_id`)) GROUP BY `u`.`user_id`, `prof`.`full_name`, `prof`.`district`, `u`.`user_type`;

-- -----------------------------------------------------
-- View `langol_krishi_sahayak`.`v_user_statistics_by_district`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `langol_krishi_sahayak`.`v_user_statistics_by_district`;
USE `langol_krishi_sahayak`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_user_statistics_by_district`  AS SELECT `p`.`district` AS `district`, `p`.`division` AS `division`, `u`.`user_type` AS `user_type`, count(0) AS `total_users`, sum(case when `u`.`is_verified` = 1 then 1 else 0 end) AS `verified_users`, sum(case when `p`.`verification_status` = 'verified' then 1 else 0 end) AS `profile_verified_users`, sum(case when `u`.`is_active` = 1 then 1 else 0 end) AS `active_users` FROM (`users` `u` join `user_profiles` `p` on(`u`.`user_id` = `p`.`user_id`)) GROUP BY `p`.`district`, `p`.`division`, `u`.`user_type` ORDER BY `p`.`division` ASC, `p`.`district` ASC, `u`.`user_type` ASC;
USE `langol_krishi_sahayak`;

DELIMITER $$
USE `langol_krishi_sahayak`$$
CREATE TRIGGER `update_post_comments_count` AFTER INSERT ON `comments` FOR EACH ROW BEGIN

    UPDATE `posts`

    SET `comments_count` = (

        SELECT COUNT(*) FROM `comments`

        WHERE `post_id` = NEW.`post_id` AND `is_deleted` = FALSE

    )

    WHERE `post_id` = NEW.`post_id`;

END$$

USE `langol_krishi_sahayak`$$
CREATE DEFINER = CURRENT_USER TRIGGER `langol_krishi_sahayak`.`comment_likes_AFTER_INSERT` AFTER INSERT ON `comment_likes` FOR EACH ROW
BEGIN

END
$$

USE `langol_krishi_sahayak`$$
CREATE DEFINER = CURRENT_USER TRIGGER `langol_krishi_sahayak`.`consultation_responses_AFTER_INSERT` AFTER INSERT ON `consultation_responses` FOR EACH ROW
BEGIN

END
$$

USE `langol_krishi_sahayak`$$
CREATE TRIGGER `update_expert_rating` AFTER INSERT ON `consultation_responses` FOR EACH ROW BEGIN

    UPDATE `expert_qualifications`

    SET `total_consultations` = `total_consultations` + 1

    WHERE `user_id` = NEW.`expert_id`;

END$$

USE `langol_krishi_sahayak`$$
CREATE DEFINER = CURRENT_USER TRIGGER `langol_krishi_sahayak`.`marketplace_listing_saves_AFTER_INSERT` AFTER INSERT ON `marketplace_listing_saves` FOR EACH ROW
BEGIN

END
$$

USE `langol_krishi_sahayak`$$
CREATE DEFINER = CURRENT_USER TRIGGER `langol_krishi_sahayak`.`notifications_AFTER_UPDATE` AFTER UPDATE ON `notifications` FOR EACH ROW
BEGIN

END
$$

USE `langol_krishi_sahayak`$$
CREATE DEFINER = CURRENT_USER TRIGGER `langol_krishi_sahayak`.`post_likes_AFTER_INSERT` AFTER INSERT ON `post_likes` FOR EACH ROW
BEGIN

END
$$

USE `langol_krishi_sahayak`$$
CREATE DEFINER = CURRENT_USER TRIGGER `langol_krishi_sahayak`.`post_likes_AFTER_DELETE` AFTER DELETE ON `post_likes` FOR EACH ROW
BEGIN

END
$$

USE `langol_krishi_sahayak`$$
CREATE TRIGGER `update_post_likes_count` AFTER INSERT ON `post_likes` FOR EACH ROW BEGIN

    UPDATE `posts`

    SET `likes_count` = (

        SELECT COUNT(*) FROM `post_likes`

        WHERE `post_id` = NEW.`post_id`

    )

    WHERE `post_id` = NEW.`post_id`;

END$$

USE `langol_krishi_sahayak`$$
CREATE TRIGGER `update_post_likes_count_delete` AFTER DELETE ON `post_likes` FOR EACH ROW BEGIN

    UPDATE `posts`

    SET `likes_count` = (

        SELECT COUNT(*) FROM `post_likes`

        WHERE `post_id` = OLD.`post_id`

    )

    WHERE `post_id` = OLD.`post_id`;

END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
