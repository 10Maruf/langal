<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Statistics Data Check ===\n\n";

$count = DB::table('field_data_collection')->count();
echo "Total records in field_data_collection: $count\n\n";

if ($count > 0) {
    echo "Data by Division:\n";
    $divisions = DB::table('field_data_collection')
        ->select('division', DB::raw('COUNT(*) as count'))
        ->groupBy('division')
        ->get();
    
    foreach ($divisions as $div) {
        echo "  {$div->division}: {$div->count} records\n";
    }
    
    echo "\nRecent 3 records:\n";
    $recent = DB::table('field_data_collection')
        ->select('id', 'division', 'district', 'upazila', 'farmer_name', 'crop_type', 'created_at')
        ->orderBy('id', 'desc')
        ->limit(3)
        ->get();
    
    foreach ($recent as $r) {
        echo "  ID: {$r->id} | {$r->farmer_name} | {$r->division}/{$r->district}/{$r->upazila} | {$r->crop_type} | {$r->created_at}\n";
    }
    
    echo "\nTesting query with 'fdc' alias:\n";
    try {
        $testQuery = DB::table('field_data_collection as fdc')
            ->where('fdc.division', $divisions[0]->division)
            ->whereYear('fdc.created_at', date('Y'))
            ->count();
        echo "  Query successful! Found {$testQuery} records for division: {$divisions[0]->division}, year: " . date('Y') . "\n";
    } catch (\Exception $e) {
        echo "  Query failed: " . $e->getMessage() . "\n";
    }
} else {
    echo "No data found in table!\n";
}
