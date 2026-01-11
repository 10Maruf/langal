<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Current Location Data in Database ===\n\n";

$data = DB::table('field_data_collection')
    ->select('division', 'district', 'upazila', DB::raw('COUNT(*) as count'))
    ->whereNotNull('division')
    ->where('division', '!=', '')
    ->groupBy('division', 'district', 'upazila')
    ->orderBy('division')
    ->orderBy('district')
    ->get();

$divisionGroups = [];
foreach ($data as $row) {
    if (!isset($divisionGroups[$row->division])) {
        $divisionGroups[$row->division] = [];
    }
    if (!isset($divisionGroups[$row->division][$row->district])) {
        $divisionGroups[$row->division][$row->district] = [];
    }
    $divisionGroups[$row->division][$row->district][] = [
        'upazila' => $row->upazila,
        'count' => $row->count
    ];
}

foreach ($divisionGroups as $division => $districts) {
    echo "📍 {$division} বিভাগ\n";
    foreach ($districts as $district => $upazilas) {
        $districtTotal = array_sum(array_column($upazilas, 'count'));
        echo "  └─ {$district} জেলা (মোট: {$districtTotal})\n";
        foreach ($upazilas as $upazila) {
            echo "     └─ {$upazila['upazila']} উপজেলা: {$upazila['count']} টি রেকর্ড\n";
        }
    }
    echo "\n";
}

echo "\n=== Division Wise Total ===\n";
$divisionTotals = DB::table('field_data_collection')
    ->select('division', DB::raw('COUNT(*) as total'))
    ->whereNotNull('division')
    ->where('division', '!=', '')
    ->groupBy('division')
    ->orderBy('total', 'desc')
    ->get();

foreach ($divisionTotals as $div) {
    echo "{$div->division}: {$div->total} টি রেকর্ড\n";
}
