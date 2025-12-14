<?php
// Export existing good translations to JSON for the Python script
$host = 'localhost';
$dbname = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $translations = [];
    
    // Get good Division translations
    $stmt = $pdo->query("SELECT DISTINCT division, division_bn FROM location WHERE division_bn REGEXP '^[অ-ৰ]+$'");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $translations[$row['division']] = $row['division_bn'];
    }
    
    // Get good District translations
    $stmt = $pdo->query("SELECT DISTINCT district, district_bn FROM location WHERE district_bn REGEXP '^[অ-ৰ]+$'");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $translations[$row['district']] = $row['district_bn'];
    }
    
    // Get good Upazila translations
    $stmt = $pdo->query("SELECT DISTINCT upazila, upazila_bn FROM location WHERE upazila_bn REGEXP '^[অ-ৰ]+$'");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $translations[$row['upazila']] = $row['upazila_bn'];
    }
    
    // Get good Post Office translations
    $stmt = $pdo->query("SELECT DISTINCT post_office, post_office_bn FROM location WHERE post_office_bn REGEXP '^[অ-ৰ]+$'");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $translations[$row['post_office']] = $row['post_office_bn'];
    }
    
    file_put_contents('existing_translations.json', json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Exported " . count($translations) . " existing translations to existing_translations.json";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
