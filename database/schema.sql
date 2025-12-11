-- ============================================
-- Cyber TMSAH Database Schema for MySQL
-- Generated from Prisma Schema
-- ============================================

-- Drop database if exists (for fresh install)
-- DROP DATABASE IF EXISTS cyber_tmsah;
-- CREATE DATABASE cyber_tmsah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE cyber_tmsah;

-- ============================================
-- Users table for authentication
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(25) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed',
  `role` ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  `lastLogin` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`),
  UNIQUE KEY `users_email_key` (`email`),
  INDEX `users_username_idx` (`username`),
  INDEX `users_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Schedule items for class schedules
-- ============================================
CREATE TABLE IF NOT EXISTS `schedule_items` (
  `id` VARCHAR(25) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `time` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `instructor` VARCHAR(255) NOT NULL,
  `type` ENUM('lecture', 'lab') NOT NULL,
  `group` ENUM('Group1', 'Group2') NOT NULL,
  `sectionNumber` INT NULL,
  `day` ENUM('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `schedule_items_group_idx` (`group`),
  INDEX `schedule_items_sectionNumber_idx` (`sectionNumber`),
  INDEX `schedule_items_day_idx` (`day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Materials/Subjects
-- ============================================
CREATE TABLE IF NOT EXISTS `materials` (
  `id` VARCHAR(25) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `titleEn` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `descriptionEn` LONGTEXT NOT NULL,
  `icon` VARCHAR(255) NOT NULL COMMENT 'lucide-react icon name',
  `color` VARCHAR(255) NOT NULL COMMENT 'Tailwind color class',
  `articlesCount` INT NOT NULL DEFAULT 0,
  `lastUpdated` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `materials_title_idx` (`title`),
  INDEX `materials_createdAt_idx` (`createdAt`),
  INDEX `materials_updatedAt_idx` (`updatedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Articles within materials
-- ============================================
CREATE TABLE IF NOT EXISTS `articles` (
  `id` VARCHAR(25) NOT NULL,
  `materialId` VARCHAR(25) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `titleEn` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL COMMENT 'HTML content',
  `contentEn` LONGTEXT NOT NULL COMMENT 'HTML content in English',
  `excerpt` LONGTEXT NULL,
  `excerptEn` LONGTEXT NULL,
  `author` VARCHAR(255) NOT NULL,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
  `publishedAt` DATETIME(3) NULL,
  `views` INT NOT NULL DEFAULT 0,
  `tags` JSON NOT NULL DEFAULT ('[]') COMMENT 'Array stored as JSON',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `articles_materialId_idx` (`materialId`),
  INDEX `articles_status_idx` (`status`),
  INDEX `articles_publishedAt_idx` (`publishedAt`),
  INDEX `articles_author_idx` (`author`),
  INDEX `articles_createdAt_idx` (`createdAt`),
  INDEX `articles_updatedAt_idx` (`updatedAt`),
  CONSTRAINT `articles_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `materials` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Downloadable software
-- ============================================
CREATE TABLE IF NOT EXISTS `download_software` (
  `id` VARCHAR(25) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `nameEn` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `descriptionEn` LONGTEXT NOT NULL,
  `icon` VARCHAR(255) NOT NULL COMMENT 'lucide-react icon name',
  `videoUrl` VARCHAR(500) NULL,
  `downloadUrl` VARCHAR(500) NULL,
  `category` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `download_software_name_idx` (`name`),
  INDEX `download_software_category_idx` (`category`),
  INDEX `download_software_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- News articles
-- ============================================
CREATE TABLE IF NOT EXISTS `news_articles` (
  `id` VARCHAR(25) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `titleEn` VARCHAR(255) NOT NULL,
  `subjectId` VARCHAR(255) NOT NULL,
  `subjectTitle` VARCHAR(255) NOT NULL,
  `subjectTitleEn` VARCHAR(255) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
  `publishedAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `news_articles_status_idx` (`status`),
  INDEX `news_articles_publishedAt_idx` (`publishedAt`),
  INDEX `news_articles_subjectId_idx` (`subjectId`),
  INDEX `news_articles_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Static pages (About, Contact, Terms, Privacy, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS `pages` (
  `id` VARCHAR(25) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `titleEn` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL COMMENT 'HTML content',
  `contentEn` LONGTEXT NOT NULL COMMENT 'HTML content in English',
  `metaDescription` LONGTEXT NULL,
  `metaDescriptionEn` LONGTEXT NULL,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
  `order` INT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_slug_key` (`slug`),
  INDEX `pages_slug_idx` (`slug`),
  INDEX `pages_status_idx` (`status`),
  INDEX `pages_order_idx` (`order`),
  INDEX `pages_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Password reset tokens
-- ============================================
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` VARCHAR(25) NOT NULL,
  `userId` VARCHAR(25) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `used` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `password_reset_tokens_token_key` (`token`),
  INDEX `password_reset_tokens_userId_idx` (`userId`),
  INDEX `password_reset_tokens_token_idx` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- API request logs for monitoring
-- ============================================
CREATE TABLE IF NOT EXISTS `api_logs` (
  `id` VARCHAR(25) NOT NULL,
  `method` VARCHAR(10) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `statusCode` INT NOT NULL,
  `responseTime` INT NOT NULL COMMENT 'milliseconds',
  `ipAddress` VARCHAR(45) NULL,
  `userAgent` LONGTEXT NULL,
  `userId` VARCHAR(25) NULL,
  `error` LONGTEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `api_logs_path_idx` (`path`),
  INDEX `api_logs_statusCode_idx` (`statusCode`),
  INDEX `api_logs_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Notes:
-- ============================================
-- 1. PasswordResetToken.userId references User.id but relation is optional
--    to avoid circular dependencies. Handle manually in code.
-- 2. Tags in articles table are stored as JSON array: ["tag1", "tag2"]
-- 3. All IDs use VARCHAR(25) to support cuid() format
-- 4. All timestamps use DATETIME(3) for millisecond precision
-- 5. updatedAt fields are automatically updated using ON UPDATE CURRENT_TIMESTAMP(3)
-- 6. Character set is utf8mb4 for full Unicode support (including emojis)

