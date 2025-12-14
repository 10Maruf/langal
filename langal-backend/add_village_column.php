<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Adding 'village' column to user_profiles ===\n\n";

// Check current columns
$columns = DB::getSchemaBuilder()->getColumnListing('user_profiles');
echo "Current columns:\n" . implode(', ', $columns) . "\n\n";

// Check if village column already exists
if (in_array('village', $columns)) {
    echo "✓ 'village' column already exists!\n";
} else {
    echo "Adding 'village' column after 'post_office'...\n";
    
    // Find appropriate position - after post_office or after address
    if (in_array('post_office', $columns)) {
        DB::statement("ALTER TABLE user_profiles ADD COLUMN village VARCHAR(100) NULL AFTER post_office");
    } elseif (in_array('address', $columns)) {
        DB::statement("ALTER TABLE user_profiles ADD COLUMN village VARCHAR(100) NULL AFTER address");
    } else {
        DB::statement("ALTER TABLE user_profiles ADD COLUMN village VARCHAR(100) NULL");
    }
    
    echo "✓ 'village' column added successfully!\n";
}

// Verify
echo "\nUpdated columns:\n";
$columns = DB::getSchemaBuilder()->getColumnListing('user_profiles');
echo implode(', ', $columns) . "\n";

echo "\nDone!\n";
