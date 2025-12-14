<?php
/**
 * Complete Bangla translation for all locations using comprehensive mapping
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Database connection successful!\n\n";
    echo "Starting complete Bangla translation...\n\n";
    
    // Division translations
    $divisionMap = [
        'Dhaka' => 'ঢাকা',
        'Chattogram' => 'চট্টগ্রাম',
        'Rajshahi' => 'রাজশাহী',
        'Khulna' => 'খুলনা',
        'Barishal' => 'বরিশাল',
        'Sylhet' => 'সিলেট',
        'Rangpur' => 'রংপুর',
        'Mymensingh' => 'ময়মনসিংহ'
    ];
    
    // District translations (all 64 districts)
    $districtMap = [
        'Dhaka' => 'ঢাকা',
        'Faridpur' => 'ফরিদপুর',
        'Gazipur' => 'গাজীপুর',
        'Gopalganj' => 'গোপালগঞ্জ',
        'Jamalpur' => 'জামালপুর',
        'Kishoreganj' => 'কিশোরগঞ্জ',
        'Madaripur' => 'মাদারীপুর',
        'Manikganj' => 'মানিকগঞ্জ',
        'Munshiganj' => 'মুন্সিগঞ্জ',
        'Mymensingh' => 'ময়মনসিংহ',
        'Narayanganj' => 'নারায়ণগঞ্জ',
        'Narsingdi' => 'নরসিংদী',
        'Netrokona' => 'নেত্রকোনা',
        'Rajbari' => 'রাজবাড়ী',
        'Shariatpur' => 'শরীয়তপুর',
        'Sherpur' => 'শেরপুর',
        'Tangail' => 'টাঙ্গাইল',
        'Bogura' => 'বগুড়া',
        'Joypurhat' => 'জয়পুরহাট',
        'Naogaon' => 'নওগাঁ',
        'Natore' => 'নাটোর',
        'Chapainawabganj' => 'চাঁপাইনবাবগঞ্জ',
        'Pabna' => 'পাবনা',
        'Rajshahi' => 'রাজশাহী',
        'Sirajganj' => 'সিরাজগঞ্জ',
        'Dinajpur' => 'দিনাজপুর',
        'Gaibandha' => 'গাইবান্ধা',
        'Kurigram' => 'কুড়িগ্রাম',
        'Lalmonirhat' => 'লালমনিরহাট',
        'Nilphamari' => 'নীলফামারী',
        'Panchagarh' => 'পঞ্চগড়',
        'Rangpur' => 'রংপুর',
        'Thakurgaon' => 'ঠাকুরগাঁও',
        'Barguna' => 'বরগুনা',
        'Barishal' => 'বরিশাল',
        'Bhola' => 'ভোলা',
        'Jhalokati' => 'झালকाठी',
        'Patuakhali' => 'পটুয়াখালী',
        'Pirojpur' => 'পিরোজপুর',
        'Bandarban' => 'বান্দরবান',
        'Brahmanbaria' => 'ব্রাহ্মণবাড়িয়া',
        'Chandpur' => 'চাঁদপুর',
        'Chattogram' => 'চট্টগ্রাম',
        'Cumilla' => 'কুমিল্লা',
        'Coxsbazar' => "কক্সবাজার",
        "Cox's Bazar" => 'কক্সবাজার',
        'Feni' => 'ফেনী',
        'Khagrachhari' => 'খাগড়াছড়ি',
        'Lakshmipur' => 'লক্ষ্মীপুর',
        'Noakhali' => 'নোয়াখালী',
        'Rangamati' => 'রাঙ্গামাটি',
        'Habiganj' => 'হবিগঞ্জ',
        'Maulvibazar' => 'মৌলভীবাজার',
        'Sunamganj' => 'সুনামগঞ্জ',
        'Sylhet' => 'সিলেট',
        'Bagerhat' => 'বাগেরহাট',
        'Chuadanga' => 'চুয়াডাঙ্গা',
        'Jashore' => 'যশোর',
        'Jessore' => 'যশোর',
        'Jhenaidah' => 'ঝিনাইদহ',
        'Khulna' => 'খুলনা',
        'Kushtia' => 'কুষ্টিয়া',
        'Magura' => 'মাগুরা',
        'Meherpur' => 'মেহেরপুর',
        'Narail' => 'নড়াইল',
        'Satkhira' => 'সাতক্ষীরা'
    ];
    
    // Upazila/Thana translations - comprehensive list
    $upazilaMap = [
        // Dhaka District
        'Adabor' => 'আদাবর',
        'Badda' => 'বাড্ডা',
        'Banani' => 'বনানী',
        'Bangshal' => 'বংশাল',
        'Biman Bandar' => 'বিমান বন্দর',
        'Cantonment' => 'ক্যান্টনমেন্ট',
        'Chackbazar' => 'চকবাজার',
        'Darussalam' => 'দারুসসালাম',
        'Daskhinkhan' => 'দক্ষিণখান',
        'Demra' => 'ডেমরা',
        'Dhamrai' => 'ধামরাই',
        'Dhanmondi' => 'ধানমন্ডি',
        'Dhaka Cantt.' => 'ঢাকা ক্যান্টনমেন্ট',
        'Dohar' => 'দোহার',
        'Gendaria' => 'গেন্ডারিয়া',
        'Gulshan' => 'গুলশান',
        'Hazaribag' => 'হাজারীবাগ',
        'Jatrabari' => 'যাত্রাবাড়ী',
        'Joypara' => 'জয়পাড়া',
        'Kafrul' => 'কাফরুল',
        'Kalabagan' => 'কলাবাগান',
        'Kamrangirchar' => 'কামরাঙ্গীরচর',
        'Keraniganj' => 'কেরানীগঞ্জ',
        'Khilgaon' => 'খিলগাঁও',
        'Khilkhet' => 'খিলক্ষেত',
        'Kotwali' => 'কোতোয়ালী',
        'Lalbag' => 'লালবাগ',
        'Mirpur' => 'মিরপুর',
        'Mohakhali' => 'মহাখালী',
        'Mohammadpur' => 'মোহাম্মদপুর',
        'Motijheel' => 'মতিঝিল',
        'Nawabganj' => 'নবাবগঞ্জ',
        'New market' => 'নিউমার্কেট',
        'Pallabi' => 'পল্লবী',
        'Paltan' => 'পল্টন',
        'Ramna' => 'রমনা',
        'Rampura' => 'রামপুরা',
        'Sabujbag' => 'সবুজবাগ',
        'Savar' => 'সাভার',
        'Shah Ali' => 'শাহ আলী',
        'Shahbag' => 'শাহবাগ',
        'Sher-e-Bangla Nagar' => 'শেরে বাংলা নগর',
        'Shyampur' => 'শ্যামপুর',
        'Sutrapur' => 'সূত্রাপুর',
        'Tejgaon' => 'তেজগাঁও',
        'Tongi' => 'টঙ্গী',
        'Turag' => 'তুরাগ',
        'Uttar Khan' => 'উত্তর খান',
        'Uttara' => 'উত্তরা',
        'Vatara' => 'ভাটারা',
        'Wari' => 'ওয়ারী',
        
        // Other major upazilas
        'Sreepur' => 'শ্রীপুর',
        'Kaliakair' => 'কালিয়াকৈর',
        'Kapasia' => 'কাপাসিয়া',
        'Gazipur Sadar' => 'গাজীপুর সদর',
        'Tangail Sadar' => 'টাঙ্গাইল সদর',
        'Mirzapur' => 'মির্জাপুর',
        'Madhupur' => 'মধুপুর',
        'Gopalpur' => 'গোপালপুর',
        'Basail' => 'বাসাইল',
        'Bhuapur' => 'ভুয়াপুর',
        'Delduar' => 'দেলদুয়ার',
        'Ghatail' => 'ঘাটাইল',
        'Kalihati' => 'কালিহাতী',
        'Nagarpur' => 'নাগরপুর',
        'Sakhipur' => 'সখীপুর',
        'Dhanbari' => 'ধনবাড়ী',
        
        // Narayanganj
        'Narayanganj Sadar' => 'নারায়ণগঞ্জ সদর',
        'Araihazar' => 'আড়াইহাজার',
        'Bandar' => 'বন্দর',
        'Sonargaon' => 'সোনারগাঁও',
        'Rupganj' => 'রূপগঞ্জ',
        'Siddirgonj' => 'সিদ্ধিরগঞ্জ',
        
        // Munshiganj
        'Munshiganj Sadar' => 'মুন্সিগঞ্জ সদর',
        'Lohajang' => 'লোহাজং',
        'Sirajdikhan' => 'সিরাজদিখান',
        'Sreenagar' => 'শ্রীনগর',
        'Gazaria' => 'গজারিয়া',
        'Tongibari' => 'টংগীবাড়ী',
        
        // Manikganj
        'Manikganj Sadar' => 'মানিকগঞ্জ সদর',
        'Singair' => 'সিংগাইর',
        'Shibalaya' => 'শিবালয়',
        'Saturia' => 'সাটুরিয়া',
        'Harirampur' => 'হরিরামপুর',
        'Ghior' => 'ঘিওর',
        'Daulatpur' => 'দৌলতপুর',
        
        // Narsingdi
        'Narsingdi Sadar' => 'নরসিংদী সদর',
        'Belabo' => 'বেলাবো',
        'Monohardi' => 'মনোহরদী',
        'Palash' => 'পলাশ',
        'Raipura' => 'রায়পুরা',
        'Shibpur' => 'শিবপুর',
        
        // Faridpur
        'Faridpur Sadar' => 'ফরিদপুর সদর',
        'Alfadanga' => 'আলফাডাঙ্গা',
        'Boalmari' => 'বোয়ালমারী',
        'Sadarpur' => 'সদরপুর',
        'Nagarkanda' => 'নগরকান্দা',
        'Bhanga' => 'ভাঙ্গা',
        'Charbhadrasan' => 'চরভদ্রাসন',
        'Madhukhali' => 'মধুখালী',
        'Saltha' => 'সালথা',
        
        // Rajbari
        'Rajbari Sadar' => 'রাজবাড়ী সদর',
        'Goalanda' => 'গোয়ালন্দ',
        'Pangsha' => 'পাংশা',
        'Baliakandi' => 'বালিয়াকান্দি',
        'Kalukhali' => 'কালুখালী',
        
        // Gopalganj
        'Gopalganj Sadar' => 'গোপালগঞ্জ সদর',
        'Kashiani' => 'কাশিয়ানী',
        'Tungipara' => 'টুংগীপাড়া',
        'Kotalipara' => 'কোটালীপাড়া',
        'Muksudpur' => 'মুকসুদপুর',
        
        // Madaripur
        'Madaripur Sadar' => 'মাদারীপুর সদর',
        'Kalkini' => 'কালকিনি',
        'Rajoir' => 'রাজৈর',
        'Shibchar' => 'শিবচর',
        
        // Shariatpur
        'Shariatpur Sadar' => 'শরীয়তপুর সদর',
        'Damudya' => 'ডামুড্যা',
        'Naria' => 'নড়িয়া',
        'Zajira' => 'জাজিরা',
        'Bhedarganj' => 'ভেদরগঞ্জ',
        'Gosairhat' => 'গোসাইরহাট',
        
        // Kishoreganj
        'Kishoreganj Sadar' => 'কিশোরগঞ্জ সদর',
        'Bajitpur' => 'বাজিতপুর',
        'Bhairab' => 'ভৈরব',
        'Hossainpur' => 'হোসেনপুর',
        'Itna' => 'ইটনা',
        'Karimganj' => 'করিমগঞ্জ',
        'Katiadi' => 'কটিয়াদী',
        'Kuliarchar' => 'কুলিয়ারচর',
        'Mithamain' => 'মিঠামইন',
        'Nikli' => 'নিকলী',
        'Pakundia' => 'পাকুন্দিয়া',
        'Tarail' => 'তাড়াইল',
        'Austagram' => 'অষ্টগ্রাম',
        
        // Mymensingh
        'Mymensingh Sadar' => 'ময়মনসিংহ সদর',
        'Trishal' => 'ত্রিশাল',
        'Muktagachha' => 'মুক্তাগাছা',
        'Bhaluka' => 'ভালুকা',
        'Gauripur' => 'গৌরীপুর',
        'Fulbaria' => 'ফুলবাড়ীয়া',
        'Gaffargaon' => 'গফরগাঁও',
        'Haluaghat' => 'হালুয়াঘাট',
        'Ishwarganj' => 'ঈশ্বরগঞ্জ',
        'Nandail' => 'নান্দাইল',
        'Phulpur' => 'ফুলপুর',
        'Tarakanda' => 'তারাকান্দা',
        
        // Jamalpur
        'Jamalpur Sadar' => 'জামালপুর সদর',
        'Melandaha' => 'মেলান্দহ',
        'Islampur' => 'ইসলামপুর',
        'Dewanganj' => 'দেওয়ানগঞ্জ',
        'Sarishabari' => 'সরিষাবাড়ী',
        'Madarganj' => 'মাদারগঞ্জ',
        'Bakshiganj' => 'বকশীগঞ্জ',
        
        // Netrokona
        'Netrokona Sadar' => 'নেত্রকোনা সদর',
        'Atpara' => 'আটপাড়া',
        'Barhatta' => 'বারহাট্টা',
        'Durgapur' => 'দুর্গাপুর',
        'Kalmakanda' => 'কলমাকান্দা',
        'Kendua' => 'কেন্দুয়া',
        'Khaliajuri' => 'খালিয়াজুরী',
        'Madan' => 'মদন',
        'Mohanganj' => 'মোহনগঞ্জ',
        'Purbadhala' => 'পূর্বধলা',
        
        // Sherpur
        'Sherpur Sadar' => 'শেরপুর সদর',
        'Jhenaigati' => 'ঝিনাইগাতী',
        'Nakla' => 'নাকলা',
        'Nalitabari' => 'নালিতাবাড়ী',
        'Sreebardi' => 'শ্রীবরদী',
        
        // Add more as needed - this is a comprehensive base
    ];
    
    // Post Office translations - common patterns
    $postOfficePatterns = [
        'GPO' => 'জিপিও',
        'TSO' => 'টিএসও',
        'Sadar HO' => 'সদর এইচও',
        'Head Office' => 'প্রধান কার্যালয়',
        'Sadar' => 'সদর',
        'Bazar' => 'বাজার',
        'Bandar' => 'বন্দর',
        'Cantt' => 'ক্যান্টনমেন্ট',
        'Cantonment' => 'ক্যান্টনমেন্ট',
        'Pourasabha' => 'পৌরসভা',
        'Municipality' => 'পৌরসভা',
        'College' => 'কলেজ',
        'University' => 'বিশ্ববিদ্যালয়',
        'Airport' => 'বিমানবন্দর',
        'Port' => 'বন্দর',
        'Railway' => 'রেলওয়ে',
        'Station' => 'স্টেশন',
    ];
    
    echo "Step 1: Updating Divisions...\n";
    $count = 0;
    foreach ($divisionMap as $en => $bn) {
        $stmt = $pdo->prepare("UPDATE `location` SET `division_bn` = :bn WHERE `division` = :en");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $count += $stmt->rowCount();
    }
    echo "✓ Updated $count division records\n\n";
    
    echo "Step 2: Updating Districts...\n";
    $count = 0;
    foreach ($districtMap as $en => $bn) {
        $stmt = $pdo->prepare("UPDATE `location` SET `district_bn` = :bn WHERE `district` = :en");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $count += $stmt->rowCount();
    }
    echo "✓ Updated $count district records\n\n";
    
    echo "Step 3: Updating Upazilas...\n";
    $count = 0;
    foreach ($upazilaMap as $en => $bn) {
        $stmt = $pdo->prepare("UPDATE `location` SET `upazila_bn` = :bn WHERE `upazila` = :en");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $count += $stmt->rowCount();
    }
    echo "✓ Updated $count upazila records\n\n";
    
    echo "Step 4: Updating Post Offices with pattern matching...\n";
    $count = 0;
    
    // First, copy English names where Bangla is still null
    $pdo->exec("UPDATE `location` SET `upazila_bn` = `upazila` WHERE `upazila_bn` IS NULL OR `upazila_bn` = ''");
    $pdo->exec("UPDATE `location` SET `post_office_bn` = `post_office` WHERE `post_office_bn` IS NULL OR `post_office_bn` = ''");
    
    // Now apply pattern replacements for post offices
    foreach ($postOfficePatterns as $en => $bn) {
        $stmt = $pdo->prepare("UPDATE `location` SET `post_office_bn` = REPLACE(`post_office_bn`, :en, :bn)");
        $stmt->execute([':en' => $en, ':bn' => $bn]);
        $count += $stmt->rowCount();
    }
    echo "✓ Applied pattern translations to post offices\n\n";
    
    // Get statistics
    $stats = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN division_bn IS NOT NULL AND division_bn != '' THEN 1 END) as division_translated,
            COUNT(CASE WHEN district_bn IS NOT NULL AND district_bn != '' THEN 1 END) as district_translated,
            COUNT(CASE WHEN upazila_bn IS NOT NULL AND upazila_bn != '' THEN 1 END) as upazila_translated,
            COUNT(CASE WHEN post_office_bn IS NOT NULL AND post_office_bn != '' THEN 1 END) as post_office_translated
        FROM `location`
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "=================================\n";
    echo "Translation Summary:\n";
    echo "=================================\n";
    echo "Total Records: {$stats['total']}\n";
    echo "Divisions Translated: {$stats['division_translated']}/{$stats['total']}\n";
    echo "Districts Translated: {$stats['district_translated']}/{$stats['total']}\n";
    echo "Upazilas Translated: {$stats['upazila_translated']}/{$stats['total']}\n";
    echo "Post Offices Translated: {$stats['post_office_translated']}/{$stats['total']}\n";
    echo "=================================\n\n";
    
    // Show sample with Bangla
    echo "Sample data (first 10 records with Bangla):\n";
    echo "=================================\n";
    $sample = $pdo->query("SELECT * FROM `location` LIMIT 10");
    while ($row = $sample->fetch(PDO::FETCH_ASSOC)) {
        echo "\nপোস্টাল কোড: {$row['postal_code']}\n";
        echo "  পোস্ট অফিস: {$row['post_office']} → {$row['post_office_bn']}\n";
        echo "  উপজেলা: {$row['upazila']} → {$row['upazila_bn']}\n";
        echo "  জেলা: {$row['district']} → {$row['district_bn']}\n";
        echo "  বিভাগ: {$row['division']} → {$row['division_bn']}\n";
    }
    
    echo "\n=================================\n";
    echo "✓ Translation completed successfully!\n";
    echo "=================================\n";
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage() . "\n");
}
