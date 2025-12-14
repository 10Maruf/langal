<?php
/**
 * Final complete translation for Chattogram division - All remaining locations
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Final Complete Translation - Chattogram Division\n\n";
    
    // All remaining upazila translations
    $upazilaTranslations = [
        'Dagonbhuia' => 'ডাগনভূঁইয়া',
        'Davidhar' => 'দাবিদহর',
        'Diginala' => 'দিঘীনালা',
        'Jaldi' => 'জালদী',
        'Jarachhari' => 'জুরাছড়ি',
        'Kalampati' => 'কালামপাটি',
        'Langalkot' => 'লাঙ্গলকোট',
        'Longachh' => 'লংগাচ্ছা',
        'Marishya' => 'মারিশ্যা',
        'Naikhong' => 'নাইখং',
        'Naniachhar' => 'নানিয়ারচর',
        'Patia Head Office' => 'পটিয়া প্রধান কার্যালয়',
        'Rajsthali' => 'রাজস্থলী',
        'Ramghar Head Office' => 'রামগড় প্রধান কার্যালয়',
        'Roanchhari' => 'রোয়াংছড়ি',
    ];
    
    // All remaining post office translations
    $postOfficeTranslations = [
        'Chandura' => 'চান্দুরা',
        'Chhilonia' => 'ছিলোনিয়া',
        'Chiora' => 'চিওড়া',
        'Chitt. Customs Acca' => 'চট্টগ্রাম কাস্টমস একাডেমি',
        'Chitt. Sailers Colon' => 'চট্টগ্রাম নাবিক কলোনি',
        'Chotoshi' => 'ছোটশি',
        'Choumohani' => 'চৌমুহনী',
        'Choupalli' => 'চৌপল্লী',
        'Chunti' => 'চুনতি',
        'Dagondhuia' => 'ডাগনধুঁইয়া',
        'Dagonbhuia' => 'ডাগনভূঁইয়া',
        'Davidhar' => 'দাবিদহর',
        'Dhalua' => 'ঢালুয়া',
        'Dhamair' => 'ধামাইর',
        'Dhamtee' => 'ধামটি',
        'Diginala' => 'দিঘীনালা',
        'Dolta' => 'দোলতা',
        'Dudmukha' => 'দুধমুখা',
        'Eidga' => 'ঈদগাহ',
        'Export Processing' => 'এক্সপোর্ট প্রসেসিং জোন',
        'Fandauk' => 'ফান্দাউক',
        'Firozshah' => 'ফিরোজশাহ',
        'Gahira' => 'গাহিরা',
        'Gandamara' => 'গান্দামারা',
        'Gangamandal' => 'গঙ্গামন্ডল',
        'Gangasagar' => 'গঙ্গাসাগর',
        'Gorduara' => 'গর্দুয়ারা',
        'Gridkaliandia' => 'গ্রিডকালিন্দিয়া',
        'Gunabati' => 'গুনবতী',
        'Halishshar' => 'হালিশহর',
        'Harualchhari' => 'হারুয়ালছড়ি',
        'Hnila' => 'হ্নীলা',
        'Islamia Madrasha' => 'ইসলামিয়া মাদ্রাসা',
        'Jaldi' => 'জালদী',
        'Jaldia Merine Accade' => 'জালদিয়া মেরিন একাডেমি',
        'Jarachhari' => 'জুরাছড়ি',
        'Joyag' => 'জয়াগ',
        'Kadurkhal' => 'কাদুরখাল',
        'Kalampati' => 'কালামপাটি',
        'Kallyandi' => 'কাল্যান্ডী',
        'Khan Bahadur' => 'খান বাহাদুর',
        'Kundeshwari' => 'কুন্দেশ্বরী',
        'Kuti' => 'কুটি',
        'Langalkot' => 'লাঙ্গলকোট',
        'Laxmichhari' => 'লক্ষীছড়ি',
        'Longachh' => 'লংগাচ্ছা',
        'Marishya' => 'মারিশ্যা',
        'Middle Patenga' => 'মধ্য পাতেঙ্গা',
        'Mohamuni' => 'মহামুনি',
        'Mohard' => 'মোহরদ',
        'Nadona' => 'নাদোনা',
        'Nagerdighirpar' => 'নগরদীঘিরপাড়',
        'Naikhong' => 'নাইখং',
        'Nanichhar' => 'নানিয়ারচর',
        'Naniachhar' => 'নানিয়ারচর',
        'Padua' => 'পাডুয়া',
        'Pahartoli' => 'পাহাড়তলী',
        'Palla' => 'পাল্লা',
        'Paroikora' => 'পারইকোড়া',
        'Pashchim Kherihar Al' => 'পশ্চিম খেড়িহার আলী',
        'Patia Head Office' => 'পটিয়া প্রধান কার্যালয়',
        'Poun' => 'পউন',
        'Rajsthali' => 'রাজস্থলী',
        'Rakhallia' => 'রাখাল্লিয়া',
        'Ramghar Head Office' => 'রামগড় প্রধান কার্যালয়',
        'Roanchhari' => 'রোয়াংছড়ি',
        'Sarial' => 'সারিয়াল',
        'Saroatoli' => 'সারোয়াতলী',
        'Senbag' => 'সেনবাগ',
        'Shingbahura' => 'শিংবাহুড়া',
        'Solla' => 'সোল্লা',
        'St.Martin' => 'সেন্ট মার্টিন',
        'T.P. Lamua' => 'টি.পি. লামুয়া',
        'Talshahar' => 'তালশহর',
        'Tangirpar' => 'টাঙ্গিরপাড়',
        'Wazedia' => 'ওয়াজেদিয়া',
        'Zhilanja' => 'ঝিলঞ্জা',
    ];
    
    echo "Step 1: Translating remaining upazilas...\n";
    $count = 0;
    foreach ($upazilaTranslations as $en => $bn) {
        $stmt = $pdo->prepare("
            UPDATE location 
            SET upazila_bn = :bn 
            WHERE (upazila = :en OR upazila_bn = :en)
            AND division = 'Chattogram'
        ");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $c = $stmt->rowCount();
        if ($c > 0) {
            echo "  ✓ $en → $bn ($c records)\n";
            $count += $c;
        }
    }
    echo "Total upazila fixes: $count\n\n";
    
    echo "Step 2: Translating remaining post offices...\n";
    $count = 0;
    foreach ($postOfficeTranslations as $en => $bn) {
        $stmt = $pdo->prepare("
            UPDATE location 
            SET post_office_bn = :bn 
            WHERE (post_office = :en OR post_office_bn = :en)
            AND division = 'Chattogram'
        ");
        $stmt->execute([':bn' => $bn, ':en' => $en]);
        $c = $stmt->rowCount();
        if ($c > 0) {
            echo "  ✓ $en → $bn ($c records)\n";
            $count += $c;
        }
    }
    echo "Total post office fixes: $count\n\n";
    
    // Final statistics
    $stats = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN district_bn REGEXP '[অ-ৰ]' THEN 1 END) as dist_bn,
            COUNT(CASE WHEN upazila_bn REGEXP '[অ-ৰ]' THEN 1 END) as upz_bn,
            COUNT(CASE WHEN post_office_bn REGEXP '[অ-ৰ]' THEN 1 END) as po_bn
        FROM location 
        WHERE division = 'Chattogram'
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "============================================\n";
    echo "FINAL CHATTOGRAM DIVISION STATUS:\n";
    echo "============================================\n";
    echo "Total Records: {$stats['total']}\n";
    echo "Districts (বাংলা): {$stats['dist_bn']}/{$stats['total']} (" . round(($stats['dist_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Upazilas (বাংলা): {$stats['upz_bn']}/{$stats['total']} (" . round(($stats['upz_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Post Offices (বাংলা): {$stats['po_bn']}/{$stats['total']} (" . round(($stats['po_bn']/$stats['total'])*100, 1) . "%)\n\n";
    
    // Check remaining
    $remaining = $pdo->query("
        SELECT COUNT(*) as cnt
        FROM location 
        WHERE division = 'Chattogram'
        AND post_office = post_office_bn 
        AND post_office NOT REGEXP '[অ-ৰ]'
    ")->fetch(PDO::FETCH_ASSOC);
    
    if ($remaining['cnt'] > 0) {
        echo "⚠ Still {$remaining['cnt']} post offices need translation\n\n";
        
        echo "Sample remaining:\n";
        $sample = $pdo->query("
            SELECT DISTINCT post_office 
            FROM location 
            WHERE division = 'Chattogram'
            AND post_office = post_office_bn 
            AND post_office NOT REGEXP '[অ-ৰ]'
            LIMIT 10
        ");
        while ($row = $sample->fetch(PDO::FETCH_ASSOC)) {
            echo "  - {$row['post_office']}\n";
        }
    } else {
        echo "✅ All locations have Bangla translations!\n";
    }
    
    echo "\nRandom verification samples:\n";
    $samples = $pdo->query("
        SELECT postal_code, post_office_bn, upazila_bn, district_bn 
        FROM location 
        WHERE division = 'Chattogram' 
        ORDER BY RAND() 
        LIMIT 10
    ");
    
    while ($row = $samples->fetch(PDO::FETCH_ASSOC)) {
        $hasBangla = (preg_match('/[অ-ৰ]/', $row['post_office_bn']) && 
                      preg_match('/[অ-ৰ]/', $row['upazila_bn']) && 
                      preg_match('/[অ-ৰ]/', $row['district_bn']));
        $icon = $hasBangla ? '✓' : '✗';
        echo "$icon {$row['postal_code']}: {$row['post_office_bn']}, {$row['upazila_bn']}, {$row['district_bn']}\n";
    }
    
    echo "\n✅ CHATTOGRAM DIVISION TRANSLATION COMPLETE!\n";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
