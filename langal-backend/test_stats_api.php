<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Testing Statistics API Query ===\n\n";

// Test query similar to what API does
echo "Test 1: Query with division 'চট্টগ্রাম':\n";
try {
    $query = DB::table('field_data_collection as fdc')
        ->where('fdc.division', 'চট্টগ্রাম')
        ->whereYear('fdc.created_at', 2026);
    
    $count = $query->count();
    echo "  Found: {$count} records\n";
    
    if ($count > 0) {
        $samples = $query->limit(2)->get(['fdc.id', 'fdc.farmer_name', 'fdc.crop_type', 'fdc.land_size']);
        foreach ($samples as $s) {
            echo "  - ID {$s->id}: {$s->farmer_name}, crop: {$s->crop_type}, land: {$s->land_size}\n";
        }
    }
} catch (\Exception $e) {
    echo "  ERROR: " . $e->getMessage() . "\n";
}

echo "\nTest 2: Query with division 'খুলনা':\n";
try {
    $query = DB::table('field_data_collection as fdc')
        ->where('fdc.division', 'খুলনা')
        ->whereYear('fdc.created_at', 2026);
    
    $count = $query->count();
    echo "  Found: {$count} records\n";
} catch (\Exception $e) {
    echo "  ERROR: " . $e->getMessage() . "\n";
}

echo "\nTest 3: Query with empty division:\n";
try {
    $query = DB::table('field_data_collection as fdc')
        ->where('fdc.division', '')
        ->whereYear('fdc.created_at', 2026);
    
    $count = $query->count();
    echo "  Found: {$count} records with empty division\n";
    echo "  ⚠️ These records won't show up in statistics!\n";
} catch (\Exception $e) {
    echo "  ERROR: " . $e->getMessage() . "\n";
}
