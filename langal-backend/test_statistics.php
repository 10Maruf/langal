<?php
/**
 * Test Statistics API
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Statistics API ===\n\n";

// Check if data exists
$count = \DB::table('field_data_collection')
    ->where('division', 'চট্টগ্রাম')
    ->where('district', 'নোয়াখালী')
    ->where('upazila', 'বেগমগঞ্জ')
    ->whereYear('created_at', 2025)
    ->count();

echo "Records found in database: $count\n\n";

// Make HTTP request to API with ENGLISH year
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/api/data-operator/statistics');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'division' => 'চট্টগ্রাম',
    'district' => 'নোয়াখালী',
    'upazila' => 'বেগমগঞ্জ',
    'scope_level' => 'upazila',
    'period_type' => 'yearly',
    'selected_year' => '2025',  // ENGLISH numerals
    'farmer_type' => 'all'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $httpCode\n\n";

$data = json_decode($response, true);

if (isset($data['success']) && $data['success']) {
    echo "=== Overview Stats ===\n";
    print_r($data['data']['overview'] ?? []);
    
    echo "\n=== Location Breakdown ===\n";
    print_r($data['data']['locationBreakdown'] ?? []);
    
    echo "\n=== Reports - Farmer List (first 3) ===\n";
    $farmers = $data['data']['reports']['farmer'] ?? [];
    print_r(array_slice($farmers, 0, 3));
    
    echo "\n=== Reports - CropWise ===\n";
    print_r($data['data']['reports']['cropWise'] ?? []);
    
} else {
    echo "Error: " . ($data['message'] ?? 'Unknown error') . "\n";
    print_r($data);
}
