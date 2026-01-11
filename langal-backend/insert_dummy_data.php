<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$crops = ['ধান', 'পাট', 'গম', 'ভুট্টা', 'আলু', 'টমেটো', 'বেগুন', 'শসা', 'মরিচ', 'পেঁয়াজ'];
$seasons = ['রবি', 'খরিফ-১', 'খরিফ-২'];
$villages = ['পূর্ব ভবানী জীবনপুর', 'পশ্চিম ভবানী জীবনপুর', 'উত্তর ভবানী জীবনপুর', 'দক্ষিণ ভবানী জীবনপুর', 'মধ্য ভবানী জীবনপুর'];
$fertilizers = ['ইউরিয়া', 'TSP', 'MOP', 'DAP', 'জিপসাম'];
$names = [
    'রহিম উদ্দিন', 'করিম মিয়া', 'জামাল হোসেন', 'সালাম আহমেদ', 'নূর মোহাম্মদ',
    'আবু বকর', 'ইব্রাহিম খান', 'ইসমাইল হক', 'মোস্তফা করিম', 'আলী আকবর',
    'হাসান মাহমুদ', 'রাশিদ আহমেদ', 'ফরিদ উদ্দিন', 'শফিক মিয়া', 'আজিজ রহমান',
    'বাদল মিয়া', 'সাইফুল ইসলাম', 'মজিবুর রহমান', 'আনোয়ার হোসেন', 'কামাল উদ্দিন'
];

echo "Inserting 20 dummy records for postal code 3837...\n";

for ($i = 0; $i < 20; $i++) {
    DB::table('field_data_collection')->insert([
        'data_operator_id' => 1,
        'farmer_id' => 1,
        'farmer_name' => $names[$i],
        'farmer_phone' => '017' . rand(10000000, 99999999),
        'farmer_address' => $villages[array_rand($villages)] . ', ভবানী জীবনপুর, বেগমগঞ্জ',
        'division' => 'চট্টগ্রাম',
        'district' => 'নোয়াখালী',
        'upazila' => 'বেগমগঞ্জ',
        'union' => 'ভবানী জীবনপুর',
        'village' => $villages[array_rand($villages)],
        'postal_code' => '3837',
        'crop_type' => $crops[array_rand($crops)],
        'season' => $seasons[array_rand($seasons)],
        'land_size' => rand(10, 100) / 10,
        'land_size_unit' => 'bigha',
        'production_amount' => rand(50, 500),
        'production_unit' => 'kg',
        'market_price' => rand(20, 80),
        'expenses' => rand(5000, 20000),
        'fertilizer_application' => $fertilizers[array_rand($fertilizers)] . ', ' . $fertilizers[array_rand($fertilizers)],
        'organic_fertilizer_application' => 'গোবর সার, কম্পোস্ট',
        'irrigation_status' => rand(0, 1) ? 'সেচ সুবিধা আছে' : 'সেচ সুবিধা নেই',
        'verification_status' => 'verified',
        'notes' => null,
        'created_at' => '2025-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT) . ' ' . rand(8, 18) . ':' . str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT) . ':00',
        'updated_at' => now(),
    ]);
    echo "Inserted record " . ($i + 1) . ": " . $names[$i] . "\n";
}

echo "\n✅ Successfully inserted 20 dummy records!\n";
echo "Location: চট্টগ্রাম > নোয়াখালী > বেগমগঞ্জ > ভবানী জীবনপুর (Postal: 3837)\n";
echo "Year: 2025\n";
