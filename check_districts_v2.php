<?php
$pdo = new PDO('mysql:host=localhost;dbname=langol_krishi_sahayak;charset=utf8mb4', 'root', '');

echo "Checking Districts:\n";
$stmt = $pdo->query("SELECT district, district_bn FROM location WHERE district_bn REGEXP '[A-Za-z]' GROUP BY district");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "{$row['district']} -> {$row['district_bn']}\n";
}

echo "\nChecking Divisions:\n";
$stmt = $pdo->query("SELECT division, division_bn FROM location WHERE division_bn REGEXP '[A-Za-z]' GROUP BY division");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "{$row['division']} -> {$row['division_bn']}\n";
}
