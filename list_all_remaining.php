<?php
$pdo = new PDO('mysql:host=localhost;dbname=langol_krishi_sahayak;charset=utf8mb4', 'root', '');

$result = $pdo->query("
    SELECT postal_code, post_office, post_office_bn, upazila_bn, district_bn
    FROM location 
    WHERE division='Chattogram' 
    AND (post_office_bn REGEXP '[A-Za-z]' OR upazila_bn REGEXP '[A-Za-z]')
    ORDER BY post_office
");

$list = [];
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    $list[] = $row;
}

// Group by original post office name for easier translation
$grouped = [];
foreach ($list as $row) {
    $key = $row['post_office'];
    if (!isset($grouped[$key])) {
        $grouped[$key] = $row;
    }
}

echo "All remaining mixed text entries (" . count($list) . " total, " . count($grouped) . " unique):\n\n";
foreach ($grouped as $po => $row) {
    echo "$po → {$row['post_office_bn']}\n";
}
