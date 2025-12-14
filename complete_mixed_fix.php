<?php
/**
 * Complete fix for ALL remaining mixed English-Bangla text
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Complete cleanup of mixed text...\n\n";
    
    // All suffix/prefix patterns
    $patterns = [
        // Common suffixes
        'pur' => 'পুর',
        'para' => 'পাড়া',
        'ganj' => 'গঞ্জ',
        'gram' => 'গ্রাম',
        'bad' => 'বাদ',
        'abad' => 'আবাদ',
        'nagar' => 'নগর',
        'hat' => 'হাট',
        'bazar' => 'বাজার',
        'kanda' => 'কান্দা',
        'char' => 'চর',
        'danga' => 'ডাঙ্গা',
        'kathi' => 'কাঠি',
        'khali' => 'খালী',
        'gachha' => 'গাছা',
        'gacha' => 'গাছা',
        'tala' => 'তলা',
        'kati' => 'কাঠি',
        'hat' => 'হাট',
        'hati' => 'হাটি',
        'bari' => 'বাড়ী',
        'dari' => 'দাড়ী',
        'gari' => 'গাড়ী',
        'mari' => 'মাড়ী',
        
        // Specific problem cases
        'Hat' => 'হাট',
        'kaar' => 'কার',
        'garh' => 'গড়',
        'Pur' => 'পুর',
        'Ganj' => 'গঞ্জ',
        'Para' => 'পাড়া',
        'Nagar' => 'নগর',
        'Hat' => 'হাট',
    ];
    
    echo "Applying pattern fixes...\n";
    $count = 0;
    
    foreach ($patterns as $en => $bn) {
        // Fix upazilas
        $stmt = $pdo->prepare("UPDATE location SET upazila_bn = REPLACE(upazila_bn, :en, :bn) WHERE upazila_bn LIKE CONCAT('%', :en, '%')");
        $stmt->execute([':en' => $en, ':bn' => $bn]);
        $count += $stmt->rowCount();
        
        // Fix post offices
        $stmt = $pdo->prepare("UPDATE location SET post_office_bn = REPLACE(post_office_bn, :en, :bn) WHERE post_office_bn LIKE CONCAT('%', :en, '%')");
        $stmt->execute([':en' => $en, ':bn' => $bn]);
        $count += $stmt->rowCount();
    }
    
    echo "✓ Fixed $count pattern instances\n\n";
    
    // Specific complete word fixes for common locations
    $specificFixes = [
        'সূত্রাpur' => 'সূত্রাপুর',
        'মোহাম্মদpur' => 'মোহাম্মদপুর',
        'মিরpur' => 'মিরপুর',
        'কেরানীganj' => 'কেরানীগঞ্জ',
        'নবাবganj' => 'নবাবগঞ্জ',
        'জয়para' => 'জয়পাড়া',
        'নারায়ণganj' => 'নারায়ণগঞ্জ',
        'সিদ্ধিরganj' => 'সিদ্ধিরগঞ্জ',
        'রূপganj' => 'রূপগঞ্জ',
        'মুন্সিganj' => 'মুন্সিগঞ্জ',
        'charভদ্রাসন' => 'চর ভদ্রাসন',
        'Chouddaগ্রাম' => 'চৌদ্দগ্রাম',
        'Kuriগ্রাম' => 'কুড়িগ্রাম',
        'Madinআbad' => 'মদিনাবাদ',
        'Ostaগ্রাম' => 'অষ্টগ্রাম',
        'আক্কেলpur' => 'আক্কেলপুর',
        'আটpara' => 'আটপাড়া',
        'আলফাdanga' => 'আলফাডাঙ্গা',
        'আলমdanga' => 'আলমডাঙ্গা',
        'আলাইpur' => 'আলাইপুর',
        'ইসলামpur' => 'ইসলামপুর',
        'উজিরpur' => 'উজিরপুর',
        'উলিpur' => 'উলিপুর',
        'রাজারHat' => 'রাজারহাট',
        'বেগমganj' => 'বেগমগঞ্জ',
        'মুরাদnagar' => 'মুরাদনগর',
        'Khod মোহনpur' => 'খোদ মোহনপুর',
        'Susung দুর্গাpur' => 'সুসং দুর্গাপুর',
    ];
    
    echo "Applying specific complete word fixes...\n";
    $fixCount = 0;
    
    foreach ($specificFixes as $mixed => $correct) {
        $stmt = $pdo->prepare("UPDATE location SET upazila_bn = :correct WHERE upazila_bn = :mixed");
        $stmt->execute([':correct' => $correct, ':mixed' => $mixed]);
        $fixCount += $stmt->rowCount();
        
        $stmt = $pdo->prepare("UPDATE location SET post_office_bn = :correct WHERE post_office_bn = :mixed");
        $stmt->execute([':correct' => $correct, ':mixed' => $mixed]);
        $fixCount += $stmt->rowCount();
    }
    
    echo "✓ Fixed $fixCount specific words\n\n";
    
    // Final verification
    echo "=================================\n";
    echo "Final Status:\n";
    echo "=================================\n\n";
    
    $mixedUpz = $pdo->query("SELECT COUNT(*) as cnt FROM location WHERE upazila_bn REGEXP '[A-Za-z][অ-ৰ]|[অ-ৰ][A-Za-z]'")->fetch(PDO::FETCH_ASSOC);
    $mixedPO = $pdo->query("SELECT COUNT(*) as cnt FROM location WHERE post_office_bn REGEXP '[A-Za-z][অ-ৰ]|[অ-ৰ][A-Za-z]'")->fetch(PDO::FETCH_ASSOC);
    
    echo "Upazilas with mixed text: {$mixedUpz['cnt']}\n";
    echo "Post offices with mixed text: {$mixedPO['cnt']}\n\n";
    
    // Overall Bangla coverage
    $stats = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN upazila_bn REGEXP '[অ-ৰ]' THEN 1 END) as upz_bn,
            COUNT(CASE WHEN post_office_bn REGEXP '[অ-ৰ]' THEN 1 END) as po_bn
        FROM location
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "Overall Bangla Coverage:\n";
    echo "Upazilas: {$stats['upz_bn']}/{$stats['total']} (" . round(($stats['upz_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Post Offices: {$stats['po_bn']}/{$stats['total']} (" . round(($stats['po_bn']/$stats['total'])*100, 1) . "%)\n\n";
    
    echo "=================================\n";
    echo "Sample Locations (Random 10):\n";
    echo "=================================\n";
    
    $samples = $pdo->query("SELECT postal_code, post_office_bn, upazila_bn, district_bn, division_bn FROM location ORDER BY RAND() LIMIT 10");
    
    while ($row = $samples->fetch(PDO::FETCH_ASSOC)) {
        $hasMixed = preg_match('/[A-Za-z][অ-ৰ]|[অ-ৰ][A-Za-z]/', $row['upazila_bn'] . $row['post_office_bn']);
        $icon = $hasMixed ? '⚠' : '✓';
        echo "\n$icon {$row['postal_code']}: {$row['post_office_bn']}\n";
        echo "   → {$row['upazila_bn']}, {$row['district_bn']}, {$row['division_bn']}\n";
    }
    
    echo "\n=================================\n";
    echo "✅ Cleanup Complete!\n";
    echo "=================================\n";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
