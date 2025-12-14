<?php
$pdo = new PDO('mysql:host=localhost;dbname=langol_krishi_sahayak', 'root', '');

echo "Checking Missing Districts:\n";
echo "===========================\n\n";

// Check Maulvibazar
$stmt = $pdo->query("SELECT DISTINCT district, district_bn FROM location WHERE district LIKE '%aulvi%'");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "{$row['district']} → {$row['district_bn']}\n";
}

// Check Chapainawabganj  
$stmt = $pdo->query("SELECT DISTINCT district, district_bn FROM location WHERE district LIKE '%hapai%' OR district LIKE '%awab%'");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "{$row['district']} → {$row['district_bn']}\n";
}

echo "\nAll unique districts:\n";
echo "===========================\n";
$stmt = $pdo->query("SELECT DISTINCT district, district_bn FROM location ORDER BY district");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $status = ($row['district'] != $row['district_bn']) ? '✓' : '✗';
    echo "$status {$row['district']} → {$row['district_bn']}\n";
}
