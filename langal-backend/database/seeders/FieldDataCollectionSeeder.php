<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FieldDataCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a data operator ID
        $operator = DB::table('data_operators')->first();
        
        if (!$operator) {
            echo "No data operator found. Please login as a data operator first to create field data.\n";
            return;
        }
        
        // Use the correct primary key field name
        $operatorId = $operator->data_operator_id ?? $operator->operator_id ?? null;
        
        if (!$operatorId) {
            echo "Could not determine operator ID field. Available fields: " . implode(', ', array_keys((array)$operator)) . "\n";
            return;
        }
        
        echo "Using operator ID: $operatorId\n";

        $bangladeshiNames = [
            'আব্দুল করিম', 'মোহাম্মদ আলী', 'রহিমা বেগম', 'ফাতেমা খাতুন', 'নাজমুল হক',
            'সালমা আক্তার', 'জাহিদুল ইসলাম', 'রুবিনা আক্তার', 'কামাল হোসেন', 'শাহানা পারভীন',
            'আব্দুর রহমান', 'সুলতানা রহমান', 'মোহাম্মদ শফিকুল', 'নাসরিন জাহান', 'আবুল কালাম',
            'রেহানা আক্তার', 'মোস্তাফিজুর রহমান', 'শামসুন নাহার', 'মোখলেসুর রহমান', 'রোকেয়া খাতুন',
            'জাহাঙ্গীর আলম', 'পারভিন সুলতানা', 'আনোয়ার হোসেন', 'সালেহা বেগম', 'রফিকুল ইসলাম',
            'তাসলিমা আক্তার', 'নুরুল আমিন', 'জাকিয়া সুলতানা', 'শামীম আহমেদ', 'হাসিনা খাতুন',
            'আব্দুল মান্নান', 'নাজমা বেগম', 'ইউনুস আলী', 'মরিয়ম আক্তার', 'আশরাফুল আলম',
            'সাবিনা ইয়াসমিন', 'মনিরুল ইসলাম', 'লায়লা আক্তার', 'সাইফুল ইসলাম', 'রওশন আরা',
            'আলমগীর হোসেন', 'নার্গিস আক্তার', 'হাবিবুর রহমান', 'সুমাইয়া খাতুন', 'আজিজুল হক',
            'শিরিনা বেগম', 'মিজানুর রহমান', 'নাজনিন আক্তার', 'শাহজাহান আলী', 'ফারজানা পারভীন'
        ];

        $crops = [
            'ধান', 'গম', 'ভুট্টা', 'পাট', 'আলু', 'টমেটো', 'বেগুন', 'শসা', 'লাউ', 'মরিচ',
            'সরিষা', 'ডাল', 'পেঁয়াজ', 'রসুন', 'আম', 'কলা', 'পেঁপে', 'কাঁঠাল', 'লিচু', 'তরমুজ'
        ];

        $healthStatuses = ['excellent', 'good', 'fair', 'poor', 'critical'];
        
        $diseases = [
            ['name' => 'পাতা পোড়া রোগ', 'severity' => 'medium'],
            ['name' => 'মাজরা পোকা', 'severity' => 'high'],
            ['name' => 'ব্লাস্ট রোগ', 'severity' => 'medium'],
            ['name' => 'পাতা মোড়ানো রোগ', 'severity' => 'low'],
            ['name' => 'ছত্রাক আক্রমণ', 'severity' => 'medium']
        ];

        $fertilizers = [
            ['name' => 'ইউরিয়া', 'unit' => 'কেজি'],
            ['name' => 'টিএসপি', 'unit' => 'কেজি'],
            ['name' => 'এমওপি', 'unit' => 'কেজি'],
            ['name' => 'জিপসাম', 'unit' => 'কেজি'],
            ['name' => 'জৈব সার', 'unit' => 'কেজি']
        ];

        $pesticides = [
            ['name' => 'ম্যালাথিয়ন', 'unit' => 'মিলি'],
            ['name' => 'সাইপারমেথ্রিন', 'unit' => 'মিলি'],
            ['name' => 'কার্বারিল', 'unit' => 'গ্রাম'],
            ['name' => 'জৈব কীটনাশক', 'unit' => 'মিলি']
        ];

        $divisions = [
            ['name' => 'ঢাকা', 'districts' => [
                ['name' => 'ঢাকা', 'upazilas' => ['সাভার', 'কেরানীগঞ্জ', 'ধামরাই', 'দোহার']],
                ['name' => 'গাজীপুর', 'upazilas' => ['কালিগঞ্জ', 'কালিয়াকৈর', 'কাপাসিয়া', 'শ্রীপুর']],
                ['name' => 'নরসিংদী', 'upazilas' => ['রায়পুরা', 'মনোহরদী', 'পলাশ', 'শিবপুর']],
            ]],
            ['name' => 'চট্টগ্রাম', 'districts' => [
                ['name' => 'চট্টগ্রাম', 'upazilas' => ['আনোয়ারা', 'বোয়ালখালী', 'পটিয়া', 'সাতকানিয়া']],
                ['name' => 'কক্সবাজার', 'upazilas' => ['চকরিয়া', 'রামু', 'উখিয়া', 'টেকনাফ']],
            ]],
            ['name' => 'রাজশাহী', 'districts' => [
                ['name' => 'রাজশাহী', 'upazilas' => ['পবা', 'চারঘাট', 'মোহনপুর', 'তানোর']],
                ['name' => 'নাটোর', 'upazilas' => ['বড়াইগ্রাম', 'গুরুদাসপুর', 'লালপুর', 'নলডাঙ্গা']],
            ]],
            ['name' => 'খুলনা', 'districts' => [
                ['name' => 'খুলনা', 'upazilas' => ['ডুমুরিয়া', 'দিঘলিয়া', 'কয়রা', 'পাইকগাছা']],
                ['name' => 'যশোর', 'upazilas' => ['অভয়নগর', 'বাঘারপাড়া', 'চৌগাছা', 'ঝিকরগাছা']],
            ]],
            ['name' => 'বরিশাল', 'districts' => [
                ['name' => 'বরিশাল', 'upazilas' => ['আগৈলঝাড়া', 'বাবুগঞ্জ', 'বাকেরগঞ্জ', 'বানারীপাড়া']],
                ['name' => 'পটুয়াখালী', 'upazilas' => ['বাউফল', 'দশমিনা', 'গলাচিপা', 'কলাপাড়া']],
            ]]
        ];

        $villages = [
            'রামপুর', 'শ্যামপুর', 'কামারপাড়া', 'চাঁদপুর', 'বাদলপুর', 'সোনারপুর', 'মধুপুর', 
            'বাঁশবাড়ীয়া', 'পাথরঘাটা', 'তেঁতুলতলা', 'আমবাগান', 'জামবাগান', 'কাঠালবাড়ী', 
            'বেলতলা', 'নারিকেলবাড়ী', 'পুকুরপাড়', 'ঘাটপাড়া', 'নদীপাড়া', 'হাটবাজার', 'চরপাড়া'
        ];

        echo "Seeding 50 field data collection records...\n";

        // First, create 50 manual farmers
        $manualFarmerIds = [];
        for ($i = 0; $i < 50; $i++) {
            $farmerName = $bangladeshiNames[array_rand($bangladeshiNames)];
            $farmerPhone = '01' . rand(3, 9) . rand(10000000, 99999999);
            
            $division = $divisions[array_rand($divisions)];
            $district = $division['districts'][array_rand($division['districts'])];
            $upazila = $district['upazilas'][array_rand($district['upazilas'])];
            $union = 'ইউনিয়ন ' . ($i % 10 + 1);
            $village = $villages[array_rand($villages)];
            $address = $village . ', ' . $union . ', ' . $upazila . ', ' . $district['name'];
            
            $farmerId = DB::table('field_data_farmers')->insertGetId([
                'full_name' => $farmerName,
                'nid_number' => rand(1000000000, 9999999999),
                'phone' => $farmerPhone,
                'email' => null,
                'date_of_birth' => date('Y-m-d', strtotime('-' . rand(25, 65) . ' years')),
                'father_name' => $bangladeshiNames[array_rand($bangladeshiNames)],
                'mother_name' => $bangladeshiNames[array_rand($bangladeshiNames)],
                'address' => $address,
                'district' => $district['name'],
                'upazila' => $upazila,
                'occupation' => 'কৃষক',
                'land_ownership' => ['নিজস্ব', 'ভাগচাষ', 'ইজারা'][array_rand(['নিজস্ব', 'ভাগচাষ', 'ইজারা'])],
                'created_by' => $operatorId,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            $manualFarmerIds[] = $farmerId;
        }
        
        echo "Created 50 manual farmers...\n";

        for ($i = 0; $i < 50; $i++) {
            // Random location
            $division = $divisions[array_rand($divisions)];
            $district = $division['districts'][array_rand($division['districts'])];
            $upazila = $district['upazilas'][array_rand($district['upazilas'])];
            $union = 'ইউনিয়ন ' . ($i % 10 + 1);
            $village = $villages[array_rand($villages)];

            // Random farmer data
            $farmerName = $bangladeshiNames[array_rand($bangladeshiNames)];
            $farmerPhone = '01' . rand(3, 9) . rand(10000000, 99999999);
            $farmerAddress = $village . ', ' . $union . ', ' . $upazila . ', ' . $district['name'];
            
            // Random crop and land
            $cropType = $crops[array_rand($crops)];
            $landSize = rand(50, 500) / 100; // 0.5 to 5.0
            $landUnit = ['একর', 'বিঘা', 'কাঠা'][array_rand(['একর', 'বিঘা', 'কাঠা'])];
            
            // Random season
            $seasons = ['রবি', 'খরিফ', 'খরিফ-২'];
            $season = $seasons[array_rand($seasons)];
            
            // Random fertilizers - build text string
            $numFertilizers = rand(1, 3);
            $fertilizersText = [];
            for ($f = 0; $f < $numFertilizers; $f++) {
                $fert = $fertilizers[array_rand($fertilizers)];
                $fertilizersText[] = $fert['name'] . ' ' . rand(5, 50) . ' ' . $fert['unit'];
            }
            $fertilizerApplication = implode(', ', $fertilizersText);
            
            // Random organic fertilizer
            $organicOptions = ['গোবর সার', 'কম্পোস্ট', 'সবুজ সার', 'কেঁচো কম্পোস্ট'];
            $organicFertilizer = rand(0, 1) ? $organicOptions[array_rand($organicOptions)] . ' ' . rand(5, 30) . ' কেজি' : '';
            
            // Random irrigation
            $irrigationOptions = ['নলকূপ', 'খাল', 'পুকুর', 'বৃষ্টির পানি'];
            $irrigationStatus = $irrigationOptions[array_rand($irrigationOptions)];
            
            // Random GPS coordinates (Bangladesh area)
            $latitude = 22 + (rand(0, 400) / 100); // 22.00 to 26.00
            $longitude = 88 + (rand(0, 400) / 100); // 88.00 to 92.00
            
            // Random soil pH
            $phValue = 5.5 + (rand(0, 200) / 100); // 5.5 to 7.5
            
            // Random market price and production
            $marketPrice = rand(1000, 5000);
            $productionAmount = rand(500, 5000);
            $productionUnit = ['কেজি', 'মণ', 'টন'][array_rand(['কেজি', 'মণ', 'টন'])];
            $expenses = rand(5000, 50000);
            
            // Random year
            $collectionYear = date('Y') - rand(0, 1);
            
            // Random date within last 60 days
            $landServiceDate = date('Y-m-d', strtotime('-' . rand(0, 60) . ' days'));
            
            // Verification status
            $verificationStatuses = ['pending', 'pending', 'verified', 'verified', 'rejected'];
            $verificationStatus = $verificationStatuses[array_rand($verificationStatuses)];

            DB::table('field_data_collection')->insert([
                'data_operator_id' => $operatorId,
                'farmer_id' => $operatorId, // Required field - use operator_id as placeholder
                'manual_farmer_id' => $manualFarmerIds[$i], // Link to manually created farmer
                'farmer_name' => $farmerName,
                'farmer_address' => $farmerAddress,
                'farmer_phone' => $farmerPhone,
                'land_size' => $landSize,
                'land_size_unit' => $landUnit,
                'livestock_info' => rand(0, 1) ? 'গরু ' . rand(1, 5) . ' টি, ছাগল ' . rand(1, 10) . ' টি' : null,
                'land_service_date' => $landServiceDate,
                'irrigation_status' => $irrigationStatus,
                'season' => $season,
                'crop_type' => $cropType,
                'organic_fertilizer_application' => $organicFertilizer,
                'fertilizer_application' => $fertilizerApplication,
                'tree_fertilizer_info' => rand(0, 1) ? 'আম গাছ ' . rand(5, 20) . ' টি, কাঁঠাল গাছ ' . rand(3, 15) . ' টি' : null,
                'market_price' => $marketPrice,
                'ph_value' => $phValue,
                'expenses' => $expenses,
                'production_amount' => $productionAmount,
                'production_unit' => $productionUnit,
                'crop_calculation' => 'মোট উৎপাদন: ' . $productionAmount . ' ' . $productionUnit . ', খরচ: ' . $expenses . ' টাকা, বিক্রয়: ' . ($productionAmount * $marketPrice) . ' টাকা',
                'available_resources' => 'ট্রাক্টর, পাওয়ার টিলার',
                'seminar_name' => rand(0, 1) ? 'আধুনিক কৃষি প্রশিক্ষণ ' . $collectionYear : null,
                'identity_number' => 'FDC-' . $collectionYear . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'collection_year' => $collectionYear,
                'notes' => 'মাঠ পরিদর্শনের সময় সংগৃহীত তথ্য।',
                'division' => $division['name'],
                'district' => $district['name'],
                'upazila' => $upazila,
                'union' => $union,
                'village' => $village,
                'postal_code' => rand(1000, 9999),
                'latitude' => $latitude,
                'longitude' => $longitude,
                'verification_status' => $verificationStatus,
                'verification_notes' => $verificationStatus == 'rejected' ? 'তথ্য যাচাই করে পুনরায় জমা দিন' : null,
                'verified_at' => $verificationStatus == 'verified' ? date('Y-m-d H:i:s', strtotime($landServiceDate . ' +' . rand(1, 48) . ' hours')) : null,
                'verified_by' => $verificationStatus == 'verified' ? $operatorId : null,
                'created_at' => $landServiceDate . ' ' . rand(8, 18) . ':' . rand(10, 59) . ':' . rand(10, 59),
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            if (($i + 1) % 10 == 0) {
                echo ($i + 1) . " records inserted...\n";
            }
        }

        echo "Successfully seeded 50 field data collection records!\n";
    }
}
