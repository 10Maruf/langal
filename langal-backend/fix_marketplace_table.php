<?php
/**
 * Fix marketplace_listings table structure
 * Run this script directly to check and fix the table
 */

$host = '127.0.0.1';
$port = 3306;
$database = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

echo "=== Marketplace Listings Table Fix ===\n\n";

try {
    $connection = new mysqli($host, $username, $password, $database, $port);
    
    if ($connection->connect_error) {
        throw new Exception("Connection failed: " . $connection->connect_error);
    }
    
    echo "✅ Connected to database\n\n";
    
    // Check current columns
    echo "📋 Current columns in marketplace_listings:\n";
    $result = $connection->query("DESCRIBE marketplace_listings");
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
        echo "  - {$row['Field']} ({$row['Type']})\n";
    }
    
    echo "\n";
    
    // Check what needs to be done
    $hasLocation = in_array('location', $columns);
    $hasFullLocationBn = in_array('full_location_bn', $columns);
    $hasPostalCode = in_array('postal_code', $columns);
    $hasVillage = in_array('village', $columns);
    
    echo "Status:\n";
    echo "  - location column: " . ($hasLocation ? "YES" : "NO") . "\n";
    echo "  - full_location_bn column: " . ($hasFullLocationBn ? "YES" : "NO") . "\n";
    echo "  - postal_code column: " . ($hasPostalCode ? "YES" : "NO") . "\n";
    echo "  - village column: " . ($hasVillage ? "YES" : "NO") . "\n\n";
    
    // Fix 1: Rename location to full_location_bn if needed
    if ($hasLocation && !$hasFullLocationBn) {
        echo "🔄 Renaming 'location' to 'full_location_bn'...\n";
        $connection->query("ALTER TABLE marketplace_listings CHANGE COLUMN `location` `full_location_bn` VARCHAR(255)");
        echo "✅ Done\n";
    } elseif (!$hasLocation && $hasFullLocationBn) {
        echo "✅ Column already renamed to 'full_location_bn'\n";
    } elseif ($hasLocation && $hasFullLocationBn) {
        echo "⚠️ Both columns exist! Dropping 'location'...\n";
        $connection->query("ALTER TABLE marketplace_listings DROP COLUMN `location`");
        echo "✅ Done\n";
    }
    
    // Fix 2: Add postal_code if missing
    if (!$hasPostalCode) {
        echo "🔄 Adding 'postal_code' column...\n";
        $connection->query("ALTER TABLE marketplace_listings ADD COLUMN `postal_code` INT NULL AFTER `images`");
        echo "✅ Done\n";
        
        // Add index
        echo "🔄 Adding index on postal_code...\n";
        $connection->query("CREATE INDEX idx_postal_code ON marketplace_listings(postal_code)");
        echo "✅ Done\n";
        
        // Add foreign key
        echo "🔄 Adding foreign key to location table...\n";
        $connection->query("ALTER TABLE marketplace_listings ADD CONSTRAINT fk_postal_code FOREIGN KEY (postal_code) REFERENCES location(postal_code) ON DELETE SET NULL");
        echo "✅ Done\n";
    } else {
        echo "✅ postal_code column already exists\n";
    }
    
    // Fix 3: Add village if missing
    if (!$hasVillage) {
        echo "🔄 Adding 'village' column...\n";
        $connection->query("ALTER TABLE marketplace_listings ADD COLUMN `village` VARCHAR(100) NULL AFTER `postal_code`");
        echo "✅ Done\n";
    } else {
        echo "✅ village column already exists\n";
    }
    
    // Show final structure
    echo "\n📋 Final columns in marketplace_listings:\n";
    $result = $connection->query("DESCRIBE marketplace_listings");
    while ($row = $result->fetch_assoc()) {
        echo "  - {$row['Field']} ({$row['Type']})\n";
    }
    
    // Clean up migrations table
    echo "\n🔄 Cleaning up migrations table...\n";
    $connection->query("DELETE FROM migrations WHERE migration LIKE '%restructure_marketplace_location_fields%'");
    echo "✅ Done\n";
    
    echo "\n✅ All fixes completed!\n";
    
    $connection->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
