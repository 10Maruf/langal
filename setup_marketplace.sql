-- Quick Setup for Marketplace
-- Run this SQL in phpMyAdmin or MySQL terminal

USE langol_krishi_sahayak;

-- Check if categories already exist
SELECT COUNT(*) as category_count FROM marketplace_categories;

-- If count is 0, run these INSERT statements:

INSERT IGNORE INTO
    `marketplace_categories` (
        `category_id`,
        `category_name`,
        `category_name_bn`,
        `description`,
        `icon_url`,
        `is_active`,
        `sort_order`
    )
VALUES (
        1,
        'crops',
        'ফসল ও শাকসবজি',
        'সব ধরনের ফসল, শাকসবজি এবং কৃষিপণ্য',
        '🌾',
        1,
        1
    ),
    (
        2,
        'machinery',
        'যন্ত্রপাতি',
        'কৃষি যন্ত্রপাতি, ট্রাক্টর, পাওয়ার টিলার ইত্যাদি',
        '🚜',
        1,
        2
    ),
    (
        3,
        'fertilizer',
        'সার ও কীটনাশক',
        'রাসায়নিক সার, জৈব সার, কীটনাশক',
        '🧪',
        1,
        3
    ),
    (
        4,
        'seeds',
        'বীজ ও চারা',
        'উন্নত জাতের বীজ, চারা, কলম',
        '🌱',
        1,
        4
    ),
    (
        5,
        'livestock',
        'গবাদি পশু',
        'গরু, ছাগল, মুরগি, হাঁস ইত্যাদি',
        '🐄',
        1,
        5
    ),
    (
        6,
        'tools',
        'হাতিয়ার',
        'কোদাল, কাস্তে, লাঙল ও অন্যান্য হাতিয়ার',
        '🔧',
        1,
        6
    ),
    (
        7,
        'other',
        'অন্যান্য',
        'অন্যান্য কৃষি সম্পর্কিত পণ্য ও সেবা',
        '📦',
        1,
        7
    );

-- Verify insertion
SELECT * FROM marketplace_categories ORDER BY sort_order;

-- Show success message
SELECT 'Marketplace categories setup complete!' as status;