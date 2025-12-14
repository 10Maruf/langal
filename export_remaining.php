<?php
$pdo = new PDO('mysql:host=localhost;dbname=langol_krishi_sahayak;charset=utf8mb4', 'root', '');
$stmt = $pdo->query("
    SELECT postal_code, post_office, post_office_bn, upazila_bn 
    FROM location 
    WHERE post_office_bn REGEXP '[A-Za-z]' 
       OR upazila_bn REGEXP '[A-Za-z]'
");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "{$row['postal_code']}|{$row['post_office']}|{$row['post_office_bn']}|{$row['upazila_bn']}\n";
}
