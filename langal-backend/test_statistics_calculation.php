<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Test Statistics API Query ===\n\n";

// Test 1: Simple division query
echo "Test 1: Query রাজশাহী division (2026):\n";
$result = DB::table('field_data_collection as fdc')
    ->where('fdc.division', 'রাজশাহী')
    ->whereYear('fdc.created_at', 2026)
    ->get();

echo "  Found: " . $result->count() . " records\n";
if ($result->count() > 0) {
    echo "  Sample data:\n";
    foreach ($result->take(2) as $row) {
        echo "    - {$row->farmer_name} | {$row->district} | {$row->crop_type}\n";
    }
}

// Test 2: Calculate overview stats
echo "\nTest 2: Calculate Overview Stats:\n";
$totalFarmers = $result->count();
$totalLandArea = $result->sum('land_size');
$uniqueCrops = $result->pluck('crop_type')->filter()->unique()->count();
$averageYield = $result->avg('production_amount') ?? 0;
$totalRevenue = $result->sum(function($item) {
    return ($item->production_amount ?? 0) * ($item->market_price ?? 0);
});
$activeFields = $result->where('verification_status', 'verified')->count();

echo "  Total Farmers: {$totalFarmers}\n";
echo "  Total Land Area: " . round($totalLandArea, 2) . "\n";
echo "  Unique Crops: {$uniqueCrops}\n";
echo "  Average Yield: " . round($averageYield, 2) . "\n";
echo "  Total Revenue: " . round($totalRevenue, 2) . "\n";
echo "  Active Fields: {$activeFields}\n";

// Test 3: Location breakdown
echo "\nTest 3: Location Breakdown (by District):\n";
$grouped = $result->groupBy('district');
foreach ($grouped as $district => $items) {
    if (empty($district)) continue;
    echo "  {$district}: {$items->count()} records\n";
}

// Test 4: Crop distribution
echo "\nTest 4: Crop Distribution:\n";
$crops = $result->pluck('crop_type')->filter();
$cropCounts = [];
foreach ($crops as $crop) {
    if (!isset($cropCounts[$crop])) {
        $cropCounts[$crop] = 0;
    }
    $cropCounts[$crop]++;
}
arsort($cropCounts);
foreach (array_slice($cropCounts, 0, 5) as $crop => $count) {
    $percentage = round(($count / $totalFarmers) * 100, 1);
    echo "  {$crop}: {$count} ({$percentage}%)\n";
}

echo "\n✅ If you see data above, the statistics API should work!\n";
