<?php
/**
 * Import translated locations from CSV to Database
 */

$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Importing translated locations...\n";
    
    $csvFile = 'locations_translated.csv';
    if (!file_exists($csvFile)) {
        die("Error: $csvFile not found.\n");
    }
    
    $handle = fopen($csvFile, "r");
    
    // Get headers
    $headers = fgetcsv($handle);
    $headerMap = array_flip($headers);
    
    $stmt = $pdo->prepare("
        UPDATE location 
        SET 
            post_office_bn = :post_office_bn,
            upazila_bn = :upazila_bn,
            district_bn = :district_bn,
            division_bn = :division_bn
        WHERE 
            postal_code = :postal_code AND 
            post_office = :post_office AND 
            upazila = :upazila AND 
            district = :district AND 
            division = :division
    ");
    
    $count = 0;
    $updated = 0;
    
    while (($data = fgetcsv($handle)) !== FALSE) {
        $row = [];
        foreach ($headerMap as $col => $index) {
            $row[$col] = $data[$index] ?? '';
        }
        
        // Execute update
        $stmt->execute([
            ':post_office_bn' => $row['post_office_bn'],
            ':upazila_bn' => $row['upazila_bn'],
            ':district_bn' => $row['district_bn'],
            ':division_bn' => $row['division_bn'],
            ':postal_code' => $row['postal_code'],
            ':post_office' => $row['post_office'],
            ':upazila' => $row['upazila'],
            ':district' => $row['district'],
            ':division' => $row['division']
        ]);
        
        $updated += $stmt->rowCount();
        $count++;
        
        if ($count % 100 == 0) {
            echo "Processed $count rows...\n";
        }
    }
    
    fclose($handle);
    
    echo "\nDone! Processed $count rows. Updated $updated records.\n";
    
    // Verify
    $stats = $pdo->query("
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN post_office_bn REGEXP '[অ-ৰ]' THEN 1 END) as po_bn,
            COUNT(CASE WHEN upazila_bn REGEXP '[অ-ৰ]' THEN 1 END) as upz_bn,
            COUNT(CASE WHEN district_bn REGEXP '[অ-ৰ]' THEN 1 END) as dist_bn,
            COUNT(CASE WHEN division_bn REGEXP '[অ-ৰ]' THEN 1 END) as div_bn
        FROM location
    ")->fetch(PDO::FETCH_ASSOC);
    
    echo "\nFinal Statistics:\n";
    echo "Total Records: {$stats['total']}\n";
    echo "Post Offices (Bangla): {$stats['po_bn']} (" . round(($stats['po_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Upazilas (Bangla): {$stats['upz_bn']} (" . round(($stats['upz_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Districts (Bangla): {$stats['dist_bn']} (" . round(($stats['dist_bn']/$stats['total'])*100, 1) . "%)\n";
    echo "Divisions (Bangla): {$stats['div_bn']} (" . round(($stats['div_bn']/$stats['total'])*100, 1) . "%)\n";

} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
