-- Add marketplace_listing_id support to posts table
-- This migration adds support for linking social feed posts to marketplace listings

-- Check if column already exists (it should based on schema)
ALTER TABLE `posts` 
MODIFY COLUMN `marketplace_listing_id` INT NULL DEFAULT NULL COMMENT 'Reference to marketplace listing for bazar type posts';

-- Add foreign key constraint if not exists
-- Note: Only add if marketplace_listings table exists
SET @dbname = DATABASE();
SET @tablename = 'posts';
SET @constraintname = 'fk_posts_marketplace_listing';
SET @columnname = 'marketplace_listing_id';

SET @query = CONCAT('
SELECT COUNT(*) INTO @constraint_exists
FROM information_schema.TABLE_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = ''', @dbname, '''
AND TABLE_NAME = ''', @tablename, '''
AND CONSTRAINT_NAME = ''', @constraintname, '''
AND CONSTRAINT_TYPE = ''FOREIGN KEY''
');

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key if it doesn't exist and marketplace_listings table exists
SET @add_fk = IF(@constraint_exists = 0 AND 
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = @dbname AND table_name = 'marketplace_listings'),
    CONCAT('ALTER TABLE `', @tablename, '` ADD CONSTRAINT `', @constraintname, '` ',
           'FOREIGN KEY (`', @columnname, '`) REFERENCES `marketplace_listings`(`listing_id`) ',
           'ON DELETE SET NULL ON UPDATE CASCADE'),
    'SELECT ''Foreign key already exists or marketplace_listings table not found'' AS status'
);

PREPARE stmt FROM @add_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_marketplace_listing 
ON posts(marketplace_listing_id);

-- Migration complete
SELECT 'Marketplace listing reference migration completed successfully' AS status;
