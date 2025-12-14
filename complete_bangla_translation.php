<?php
/**
 * Complete and detailed Bangla translation for ALL remaining locations
 * This includes individual post offices and any remaining upazilas
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Starting detailed Bangla translation...\n\n";
    
    // Extended comprehensive translations for specific locations
    $specificTranslations = [
        // Post Offices - Dhaka specific
        'Dhaka GPO' => 'ঢাকা জিপিও',
        'Dhaka Sadar HO' => 'ঢাকা সদর এইচও',
        'Wari TSO' => 'ওয়ারী টিএসও',
        'Gendaria TSO' => 'গেন্ডারিয়া টিএসও',
        'New Market TSO' => 'নিউমার্কেট টিএসও',
        'Dhaka Cantonment TSO' => 'ঢাকা সেনানিবাস টিএসও',
        'Jigatala TSO' => 'জিগাতলা টিএসও',
        'Posta TSO' => 'পোস্তা টিএসও',
        'Banani TSO' => 'বনানী টিএসও',
        'Gulshan Model Town' => 'গুলশান মডেল টাউন',
        'Dhania TSO' => 'ধানিয়া টিএসও',
        'Khilgaon TSO' => 'খিলগাঁও টিএসও',
        'Khilkhet TSO' => 'খিলক্ষেত টিএসও',
        'Lalbag TSO' => 'লালবাগ টিএসও',
        'Mirpur TSO' => 'মিরপুর টিএসও',
        'Mohammadpur TSO' => 'মোহাম্মদপুর টিএসও',
        'Motijheel TSO' => 'মতিঝিল টিএসও',
        'Ramna TSO' => 'রমনা টিএসও',
        'Tejgaon TSO' => 'তেজগাঁও টিএসও',
        'Uttara TSO' => 'উত্তরা টিএসও',
        'Mohakhali TSO' => 'মহাখালী টিএসও',
        'Shahbag TSO' => 'শাহবাগ টিএসও',
        'Badda TSO' => 'বাড্ডা টিএসও',
        'Kafrul TSO' => 'কাফরুল টিএসও',
        'Pallabi TSO' => 'পল্লবী টিএসও',
        'Rampura TSO' => 'রামপুরা টিএসও',
        'Cantonment Board' => 'সেনানিবাস বোর্ড',
        'Bangshal TSO' => 'বংশাল টিএসও',
        'Kotwali TSO' => 'কোতোয়ালী টিএসও',
        'Sutrapur TSO' => 'সূত্রাপুর টিএসও',
        'Kamrangirchar TSO' => 'কামরাঙ্গীরচর টিএসও',
        'Hazaribag TSO' => 'হাজারীবাগ টিএসও',
        'Kalabagan TSO' => 'কলাবাগান টিএসও',
        'Dhanmondi TSO' => 'ধানমন্ডি টিএসও',
        'Adabor TSO' => 'আদাবর টিএসও',
        'Shyampur TSO' => 'শ্যামপুর টিএসও',
        'Jatrabari TSO' => 'যাত্রাবাড়ী টিএসও',
        'Demra TSO' => 'ডেমরা টিএসও',
        'Matuail' => 'মাতুয়াইল',
        'Sarulia' => 'সারুলিয়া',
        
        // Dhamrai area
        'Dhamrai' => 'ধামরাই',
        'Kamalpur' => 'কমলপুর',
        
        // Joypara area
        'Joypara' => 'জয়পাড়া',
        'Narisha' => 'নারিশা',
        'Palamganj' => 'পলমগঞ্জ',
        
        // Keraniganj area
        'Ati' => 'আটি',
        'Dhaka Jute Mills' => 'ঢাকা পাটকল',
        'Kalatia' => 'কলাতিয়া',
        'Keraniganj' => 'কেরানীগঞ্জ',
        
        // Savar area
        'Amin Bazar' => 'আমিন বাজার',
        'Ashulia' => 'আশুলিয়া',
        'Baipayl' => 'বাইপাইল',
        'Banogram' => 'বানোগ্রাম',
        'Dhamrai' => 'ধামরাই',
        'EPZ' => 'ইপিজেড',
        'Jahangirnagar University' => 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়',
        'Savar' => 'সাভার',
        'Savar Cantt' => 'সাভার সেনানিবাস',
        'Savar Cantt.' => 'সাভার সেনানিবাস',
        
        // Nawabganj area
        'Nawabganj' => 'নবাবগঞ্জ',
        
        // Dohar area
        'Dohar' => 'দোহার',
        
        // Gazipur areas
        'Gazipur Sadar' => 'গাজীপুর সদর',
        'Tongi' => 'টঙ্গী',
        'Joydevpur' => 'জয়দেবপুর',
        'Board Bazar' => 'বোর্ড বাজার',
        'Chandna' => 'চান্দনা',
        'Konabari' => 'কোনাবাড়ী',
        'Rajendrapur' => 'রাজেন্দ্রপুর',
        'Rajendrapur Cantt' => 'রাজেন্দ্রপুর সেনানিবাস',
        'Pubail' => 'পুবাইল',
        'Sreepur' => 'শ্রীপুর',
        'Kaliakair' => 'কালিয়াকৈর',
        'Kapasia' => 'কাপাসিয়া',
        
        // Tangail areas
        'Tangail' => 'টাঙ্গাইল',
        'Elenga' => 'এলেঙ্গা',
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
        
        // Narayanganj areas
        'Narayanganj' => 'নারায়ণগঞ্জ',
        'Araihazar' => 'আড়াইহাজার',
        'Bandar' => 'বন্দর',
        'Fatullah' => 'ফতুল্লাহ',
        'Kanchpur' => 'কাঁচপুর',
        'Rupganj' => 'রূপগঞ্জ',
        'Sonargaon' => 'সোনারগাঁও',
        'Siddirgonj' => 'সিদ্ধিরগঞ্জ',
        'Adamjee Nagar' => 'আদমজী নগর',
        
        // Common area types
        'Bazar' => 'বাজার',
        'Bandar' => 'বন্দর',
        'Nagar' => 'নগর',
        'Pur' => 'পুর',
        'Ganj' => 'গঞ্জ',
        'Hat' => 'হাট',
        'Para' => 'পাড়া',
        'Char' => 'চর',
        'Danga' => 'ডাঙ্গা',
        'Kanda' => 'কান্দা',
        'Kathi' => 'কাঠি',
        'Patti' => 'পট্টি',
        
        // Industrial/Special areas
        'Industrial Area' => 'শিল্প এলাকা',
        'Housing' => 'হাউজিং',
        'Housing Estate' => 'হাউজিং এস্টেট',
        'Model Town' => 'মডেল টাউন',
        'Sector' => 'সেক্টর',
        'Block' => 'ব্লক',
        'Phase' => 'ফেজ',
        'Project' => 'প্রকল্প',
        'Colony' => 'কলোনি',
        'Staff Quarter' => 'স্টাফ কোয়ার্টার',
        'Residential Area' => 'আবাসিক এলাকা',
        
        // Educational institutions
        'Dhaka University' => 'ঢাকা বিশ্ববিদ্যালয়',
        'BUET' => 'বুয়েট',
        'Medical College' => 'মেডিকেল কলেজ',
        'Engineering College' => 'ইঞ্জিনিয়ারিং কলেজ',
        'Polytechnic' => 'পলিটেকনিক',
        'Politechnic' => 'পলিটেকনিক',
        'Teachers Training College' => 'শিক্ষক প্রশিক্ষণ কলেজ',
        
        // Transport hubs
        'Airport' => 'বিমানবন্দর',
        'Railway' => 'রেলওয়ে',
        'Station' => 'স্টেশন',
        'Terminal' => 'টার্মিনাল',
        'Boat Terminal' => 'নৌ-টার্মিনাল',
        
        // Government/Official
        'Secretariat' => 'সচিবালয়',
        'Parliament' => 'সংসদ',
        'Court' => 'আদালত',
        'Municipal' => 'পৌর',
        'Thana' => 'থানা',
        'Fire Brigade' => 'ফায়ার ব্রিগেড',
        
        // Narayanganj detailed
        'Munshiganj' => 'মুন্সিগঞ্জ',
        'Lohajang' => 'লোহাজং',
        'Sirajdikhan' => 'সিরাজদিখান',
        'Sreenagar' => 'শ্রীনগর',
        'Gazaria' => 'গজারিয়া',
        'Tongibari' => 'টংগীবাড়ী',
        
        // Manikganj detailed
        'Manikganj' => 'মানিকগঞ্জ',
        'Singair' => 'সিংগাইর',
        'Shibalaya' => 'শিবালয়',
        'Saturia' => 'সাটুরিয়া',
        'Harirampur' => 'হরিরামপুর',
        'Ghior' => 'ঘিওর',
        'Daulatpur' => 'দৌলতপুর',
        
        // Additional common words
        'Road' => 'রোড',
        'Avenue' => 'এভিনিউ',
        'Lane' => 'লেন',
        'Crossing' => 'ক্রসিং',
        'Circle' => 'সার্কেল',
        'Gate' => 'গেট',
        'Bridge' => 'সেতু',
        'New' => 'নতুন',
        'Old' => 'পুরাতন',
        'North' => 'উত্তর',
        'South' => 'দক্ষিণ',
        'East' => 'পূর্ব',
        'West' => 'পশ্চিম',
        'Central' => 'কেন্দ্রীয়',
        'Main' => 'প্রধান',
    ];
    
    echo "Applying specific translations...\n";
    $updateCount = 0;
    
    // Update post offices
    foreach ($specificTranslations as $en => $bn) {
        // Exact match for post office
        $stmt = $pdo->prepare("UPDATE `location` SET `post_office_bn` = :bn WHERE `post_office` = :en");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $updateCount += $stmt->rowCount();
        
        // Also check in upazila
        $stmt = $pdo->prepare("UPDATE `location` SET `upazila_bn` = :bn WHERE `upazila` = :en AND (`upazila_bn` IS NULL OR `upazila_bn` = :en)");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $updateCount += $stmt->rowCount();
    }
    
    echo "✓ Updated $updateCount records with specific translations\n\n";
    
    // Apply partial replacements for compound names
    echo "Applying pattern-based translations for compound names...\n";
    $replacementCount = 0;
    
    foreach ($specificTranslations as $en => $bn) {
        // Replace parts in post office names
        $stmt = $pdo->prepare("
            UPDATE `location` 
            SET `post_office_bn` = REPLACE(`post_office_bn`, :en, :bn)
            WHERE `post_office_bn` LIKE CONCAT('%', :en, '%')
        ");
        $stmt->execute([':en' => $en, ':bn' => $bn]);
        $replacementCount += $stmt->rowCount();
        
        // Replace parts in upazila names
        $stmt = $pdo->prepare("
            UPDATE `location` 
            SET `upazila_bn` = REPLACE(`upazila_bn`, :en, :bn)
            WHERE `upazila_bn` LIKE CONCAT('%', :en, '%')
        ");
        $stmt->execute([':en' => $en, ':bn' => $bn]);
        $replacementCount += $stmt->rowCount();
    }
    
    echo "✓ Applied pattern replacements to $replacementCount instances\n\n";
    
    // Final statistics
    $stats = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN division_bn != division THEN 1 END) as division_fully_translated,
            COUNT(CASE WHEN district_bn != district THEN 1 END) as district_fully_translated,
            COUNT(CASE WHEN upazila_bn != upazila THEN 1 END) as upazila_fully_translated,
            COUNT(CASE WHEN post_office_bn != post_office THEN 1 END) as post_office_fully_translated
        FROM `location`
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "=================================\n";
    echo "Final Translation Summary:\n";
    echo "=================================\n";
    echo "Total Records: {$stats['total']}\n";
    echo "Divisions (Fully Bangla): {$stats['division_fully_translated']}/{$stats['total']}\n";
    echo "Districts (Fully Bangla): {$stats['district_fully_translated']}/{$stats['total']}\n";
    echo "Upazilas (Fully Bangla): {$stats['upazila_fully_translated']}/{$stats['total']}\n";
    echo "Post Offices (Fully Bangla): {$stats['post_office_fully_translated']}/{$stats['total']}\n";
    echo "=================================\n\n";
    
    // Show improved samples
    echo "Sample data after detailed translation:\n";
    echo "=================================\n";
    $samples = $pdo->query("SELECT * FROM `location` ORDER BY RAND() LIMIT 15");
    while ($row = $samples->fetch(PDO::FETCH_ASSOC)) {
        echo "\n✓ পোস্টাল: {$row['postal_code']}\n";
        echo "  পোস্ট অফিস: {$row['post_office_bn']}\n";
        echo "  উপজেলা: {$row['upazila_bn']}\n";
        echo "  জেলা: {$row['district_bn']}\n";
        echo "  বিভাগ: {$row['division_bn']}\n";
    }
    
    echo "\n=================================\n";
    echo "✓✓✓ All translations completed! ✓✓✓\n";
    echo "=================================\n";
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage() . "\n");
}
