<?php
/**
 * Import locations data from CSV to database
 */

// Database configuration
$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Database connection successful!\n";
    
    // Read CSV file
    $csvFile = __DIR__ . '/locations.csv';
    
    if (!file_exists($csvFile)) {
        die("Error: CSV file not found at $csvFile\n");
    }
    
    $handle = fopen($csvFile, 'r');
    
    if ($handle === false) {
        die("Error: Could not open CSV file\n");
    }
    
    // Skip header row
    $header = fgetcsv($handle);
    echo "CSV columns: " . implode(', ', $header) . "\n\n";
    
    // Note: Not clearing existing data due to foreign key constraints
    // Data will be inserted or updated based on postal_code
    
    // Prepare insert statement
    $stmt = $pdo->prepare("
        INSERT INTO `location` (postal_code, district, upazila, division) 
        VALUES (:postal_code, :district, :upazila, :division)
        ON DUPLICATE KEY UPDATE 
            district = VALUES(district),
            upazila = VALUES(upazila),
            division = VALUES(division)
    ");
    
    $count = 0;
    $errors = 0;
    
    // Read and insert data
    while (($data = fgetcsv($handle)) !== false) {
        try {
            // CSV columns: postal_code, post_office, upazila, district, division
            $stmt->execute([
                ':postal_code' => (int)$data[0],
                ':district' => $data[3],
                ':upazila' => $data[2],
                ':division' => $data[4]
            ]);
            $count++;
            
            if ($count % 100 == 0) {
                echo "Imported $count records...\n";
            }
        } catch (PDOException $e) {
            $errors++;
            echo "Error importing row " . ($count + $errors) . ": " . $e->getMessage() . "\n";
        }
    }
    
    fclose($handle);
    
    echo "\n=================================\n";
    echo "Import completed!\n";
    echo "Successfully imported: $count records\n";
    echo "Errors: $errors\n";
    echo "=================================\n";
    
    // Show summary
    $result = $pdo->query("SELECT COUNT(*) as total FROM `location`");
    $total = $result->fetch(PDO::FETCH_ASSOC);
    echo "\nTotal records in database: " . $total['total'] . "\n";
    
    // Show sample data
    echo "\nSample data (first 5 records):\n";
    $sample = $pdo->query("SELECT * FROM `location` LIMIT 5");
    while ($row = $sample->fetch(PDO::FETCH_ASSOC)) {
        echo "  - Postal: {$row['postal_code']}, District: {$row['district']}, Upazila: {$row['upazila']}, Division: {$row['division']}\n";
    }
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage() . "\n");
}
