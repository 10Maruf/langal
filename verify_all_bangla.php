<?php
/**
 * Final Verification of All Bangla Columns
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    
    echo "Final Verification of Database...\n\n";
    
    // Check for any English characters in _bn columns
    $sql = "
        SELECT COUNT(*) as cnt 
        FROM location 
        WHERE post_office_bn REGEXP '[A-Za-z]' 
           OR upazila_bn REGEXP '[A-Za-z]' 
           OR district_bn REGEXP '[A-Za-z]' 
           OR division_bn REGEXP '[A-Za-z]'
    ";
    
    $count = $pdo->query($sql)->fetchColumn();
    
    if ($count == 0) {
        echo "✅ SUCCESS: No English characters found in Bangla columns!\n";
    } else {
        echo "❌ WARNING: Found $count records with English characters.\n";
        
        $rows = $pdo->query("
            SELECT postal_code, post_office_bn, upazila_bn 
            FROM location 
            WHERE post_office_bn REGEXP '[A-Za-z]' 
               OR upazila_bn REGEXP '[A-Za-z]'
            LIMIT 10
        ");
        
        while ($row = $rows->fetch(PDO::FETCH_ASSOC)) {
            echo "  - {$row['postal_code']}: {$row['post_office_bn']}, {$row['upazila_bn']}\n";
        }
    }
    
    // Check for empty Bangla columns
    $sql = "
        SELECT COUNT(*) as cnt 
        FROM location 
        WHERE post_office_bn = '' OR post_office_bn IS NULL
           OR upazila_bn = '' OR upazila_bn IS NULL
    ";
    
    $empty = $pdo->query($sql)->fetchColumn();
    
    if ($empty == 0) {
        echo "✅ SUCCESS: No empty Bangla columns found!\n";
    } else {
        echo "❌ WARNING: Found $empty records with empty Bangla columns.\n";
    }
    
    // Show some stats
    $stats = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(DISTINCT division_bn) as divs,
            COUNT(DISTINCT district_bn) as dists,
            COUNT(DISTINCT upazila_bn) as upzs
        FROM location
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "\nDatabase Stats:\n";
    echo "Total Locations: {$stats['total']}\n";
    echo "Divisions: {$stats['divs']}\n";
    echo "Districts: {$stats['dists']}\n";
    echo "Upazilas: {$stats['upzs']}\n";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
