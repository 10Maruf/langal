<?php
/**
 * Add post_office column to location table and re-import data
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
    
    echo "Database connection successful!\n\n";
    
    // Check if post_office column exists
    $result = $pdo->query("SHOW COLUMNS FROM `location` LIKE 'post_office'");
    
    if ($result->rowCount() == 0) {
        echo "Adding 'post_office' column to location table...\n";
        $pdo->exec("ALTER TABLE `location` ADD COLUMN `post_office` VARCHAR(100) NULL AFTER `postal_code`");
        echo "Column added successfully!\n\n";
    } else {
        echo "'post_office' column already exists.\n\n";
    }
    
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
    
    // Prepare insert statement with post_office
    $stmt = $pdo->prepare("
        INSERT INTO `location` (postal_code, post_office, district, upazila, division) 
        VALUES (:postal_code, :post_office, :district, :upazila, :division)
        ON DUPLICATE KEY UPDATE 
            post_office = VALUES(post_office),
            district = VALUES(district),
            upazila = VALUES(upazila),
            division = VALUES(division)
    ");
    
    $count = 0;
    $errors = 0;
    
    echo "Importing data...\n\n";
    
    // Read and insert data
    while (($data = fgetcsv($handle)) !== false) {
        try {
            // CSV columns: postal_code, post_office, upazila, district, division
            $stmt->execute([
                ':postal_code' => (int)$data[0],
                ':post_office' => $data[1],  // Now including post_office
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
    
    // Show sample data with post_office
    echo "\nSample data (first 5 records with post_office):\n";
    $sample = $pdo->query("SELECT * FROM `location` LIMIT 5");
    while ($row = $sample->fetch(PDO::FETCH_ASSOC)) {
        echo "  - Postal: {$row['postal_code']}, Post Office: {$row['post_office']}, Upazila: {$row['upazila']}, District: {$row['district']}, Division: {$row['division']}\n";
    }
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage() . "\n");
}
