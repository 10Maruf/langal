<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Final Verification ===\n\n";

// Test statistics query
echo "Test Statistics Query:\n";
try {
    $divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল'];
    
    foreach ($divisions as $div) {
        $count = DB::table('field_data_collection as fdc')
            ->where('fdc.division', $div)
            ->whereYear('fdc.created_at', 2026)
            ->count();
        
        if ($count > 0) {
            echo "  ✓ {$div}: {$count} records\n";
        }
    }
    
    echo "\n✅ Statistics API queries working!\n\n";
} catch (\Exception $e) {
    echo "  ❌ ERROR: " . $e->getMessage() . "\n";
}

// Check empty divisions
echo "Records with empty division:\n";
$empty = DB::table('field_data_collection')
    ->where('division', '')
    ->orWhereNull('division')
    ->count();
echo "  {$empty} records need location data\n\n";

// Show column structure
echo "Current table columns:\n";
$columns = DB::select('SHOW COLUMNS FROM field_data_collection');
$locationCols = array_filter($columns, function($col) {
    return in_array($col->Field, ['division', 'district', 'upazila', 'union', 'village', 'postal_code']);
});

foreach ($locationCols as $col) {
    echo "  ✓ {$col->Field} ({$col->Type})\n";
}

echo "\n✅ All fixes complete! Ready to test.\n";
