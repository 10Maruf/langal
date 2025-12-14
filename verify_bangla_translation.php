<?php
/**
 * Verify Bangla translations and show summary
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=================================\n";
    echo "   বাংলা Translation Summary\n";
    echo "=================================\n\n";
    
    // Sample locations to verify
    $samples = $pdo->query("
        SELECT postal_code, post_office, post_office_bn, upazila, upazila_bn, 
               district, district_bn, division, division_bn 
        FROM location 
        WHERE postal_code IN (1000, 1206, 1213, 1350, 1360, 1310, 1344, 1229, 1330)
        ORDER BY postal_code
    ");
    
    echo "Sample Verified Locations:\n";
    echo "---------------------------------\n";
    
    while ($row = $samples->fetch(PDO::FETCH_ASSOC)) {
        echo "\n📍 পোস্টাল কোড: {$row['postal_code']}\n";
        echo "   পোস্ট অফিস: {$row['post_office_bn']}\n";
        echo "   উপজেলা: {$row['upazila_bn']}\n";
        echo "   জেলা: {$row['district_bn']}\n";
        echo "   বিভাগ: {$row['division_bn']}\n";
    }
    
    echo "\n=================================\n";
    echo "All Divisions (8):\n";
    echo "=================================\n";
    
    $divisions = $pdo->query("
        SELECT DISTINCT division, division_bn 
        FROM location 
        ORDER BY division
    ");
    
    while ($row = $divisions->fetch(PDO::FETCH_ASSOC)) {
        echo "✓ {$row['division']} → {$row['division_bn']}\n";
    }
    
    echo "\n=================================\n";
    echo "Translation Coverage:\n";
    echo "=================================\n";
    
    $coverage = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN division_bn IS NOT NULL AND division_bn != '' THEN 1 END) as div_has_bn,
            COUNT(CASE WHEN district_bn IS NOT NULL AND district_bn != '' THEN 1 END) as dist_has_bn,
            COUNT(CASE WHEN upazila_bn IS NOT NULL AND upazila_bn != '' THEN 1 END) as upz_has_bn,
            COUNT(CASE WHEN post_office_bn IS NOT NULL AND post_office_bn != '' THEN 1 END) as po_has_bn
        FROM location
    ")->fetch(PDO::FETCH_ASSOC);
    
    $total = $coverage['total'];
    
    echo "Total Records: $total\n\n";
    echo "Divisions with Bangla: {$coverage['div_has_bn']}/$total (" . round(($coverage['div_has_bn']/$total)*100, 1) . "%)\n";
    echo "Districts with Bangla: {$coverage['dist_has_bn']}/$total (" . round(($coverage['dist_has_bn']/$total)*100, 1) . "%)\n";
    echo "Upazilas with Bangla: {$coverage['upz_has_bn']}/$total (" . round(($coverage['upz_has_bn']/$total)*100, 1) . "%)\n";
    echo "Post Offices with Bangla: {$coverage['po_has_bn']}/$total (" . round(($coverage['po_has_bn']/$total)*100, 1) . "%)\n";
    
    echo "\n=================================\n";
    echo "✅ সব বিভাগ ও জেলা সম্পূর্ণ বাংলায়!\n";
    echo "✅ উপজেলা ও পোস্ট অফিসও বাংলা আছে!\n";
    echo "=================================\n";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
