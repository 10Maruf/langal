<?php
/**
 * Add Bangla columns to location table
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Database connection successful!\n\n";
    
    // Add Bangla columns
    echo "Adding Bangla columns to location table...\n";
    
    $alterQueries = [
        "ALTER TABLE `location` ADD COLUMN `post_office_bn` VARCHAR(100) NULL AFTER `post_office`",
        "ALTER TABLE `location` ADD COLUMN `upazila_bn` VARCHAR(100) NULL AFTER `upazila`",
        "ALTER TABLE `location` ADD COLUMN `district_bn` VARCHAR(100) NULL AFTER `district`",
        "ALTER TABLE `location` ADD COLUMN `division_bn` VARCHAR(100) NULL AFTER `division`"
    ];
    
    foreach ($alterQueries as $query) {
        try {
            $pdo->exec($query);
            echo "✓ Column added\n";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
                echo "- Column already exists\n";
            } else {
                throw $e;
            }
        }
    }
    
    echo "\n=================================\n";
    echo "Bangla columns added successfully!\n";
    echo "=================================\n\n";
    
    // Sample Bangla translations (you can expand this)
    echo "Adding sample Bangla translations...\n\n";
    
    $translations = [
        // Divisions
        "UPDATE `location` SET `division_bn` = 'ঢাকা' WHERE `division` = 'Dhaka'",
        "UPDATE `location` SET `division_bn` = 'চট্টগ্রাম' WHERE `division` = 'Chattogram'",
        "UPDATE `location` SET `division_bn` = 'রাজশাহী' WHERE `division` = 'Rajshahi'",
        "UPDATE `location` SET `division_bn` = 'খুলনা' WHERE `division` = 'Khulna'",
        "UPDATE `location` SET `division_bn` = 'বরিশাল' WHERE `division` = 'Barishal'",
        "UPDATE `location` SET `division_bn` = 'সিলেট' WHERE `division` = 'Sylhet'",
        "UPDATE `location` SET `division_bn` = 'রংপুর' WHERE `division` = 'Rangpur'",
        "UPDATE `location` SET `division_bn` = 'ময়মনসিংহ' WHERE `division` = 'Mymensingh'",
        
        // Sample Districts
        "UPDATE `location` SET `district_bn` = 'ঢাকা' WHERE `district` = 'Dhaka'",
        "UPDATE `location` SET `district_bn` = 'চট্টগ্রাম' WHERE `district` = 'Chattogram'",
        "UPDATE `location` SET `district_bn` = 'সিলেট' WHERE `district` = 'Sylhet'",
        "UPDATE `location` SET `district_bn` = 'রাজশাহী' WHERE `district` = 'Rajshahi'",
        "UPDATE `location` SET `district_bn` = 'খুলনা' WHERE `district` = 'Khulna'",
        "UPDATE `location` SET `district_bn` = 'বরিশাল' WHERE `district` = 'Barishal'",
        "UPDATE `location` SET `district_bn` = 'রংপুর' WHERE `district` = 'Rangpur'",
        "UPDATE `location` SET `district_bn` = 'ময়মনসিংহ' WHERE `district` = 'Mymensingh'",
        "UPDATE `location` SET `district_bn` = 'কুমিল্লা' WHERE `district` = 'Cumilla'",
        "UPDATE `location` SET `district_bn` = 'যশোর' WHERE `district` = 'Jashore'",
        
        // For other locations, copy English to Bangla as placeholder
        "UPDATE `location` SET `post_office_bn` = `post_office` WHERE `post_office_bn` IS NULL",
        "UPDATE `location` SET `upazila_bn` = `upazila` WHERE `upazila_bn` IS NULL",
        "UPDATE `location` SET `district_bn` = `district` WHERE `district_bn` IS NULL",
        "UPDATE `location` SET `division_bn` = `division` WHERE `division_bn` IS NULL"
    ];
    
    foreach ($translations as $query) {
        $pdo->exec($query);
    }
    
    echo "✓ Sample translations added\n\n";
    
    // Show sample data
    echo "Sample data with Bangla:\n";
    $sample = $pdo->query("SELECT postal_code, post_office, post_office_bn, upazila, upazila_bn, district, district_bn, division, division_bn FROM `location` LIMIT 5");
    while ($row = $sample->fetch(PDO::FETCH_ASSOC)) {
        echo "\nPostal: {$row['postal_code']}\n";
        echo "  Post Office: {$row['post_office']} / {$row['post_office_bn']}\n";
        echo "  Upazila: {$row['upazila']} / {$row['upazila_bn']}\n";
        echo "  District: {$row['district']} / {$row['district_bn']}\n";
        echo "  Division: {$row['division']} / {$row['division_bn']}\n";
    }
    
    echo "\n=================================\n";
    echo "Note: You can now update individual Bangla names as needed.\n";
    echo "=================================\n";
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage() . "\n");
}
