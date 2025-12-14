<?php
$pdo = new PDO('mysql:host=localhost;dbname=langol_krishi_sahayak;charset=utf8mb4', 'root', '');

echo "Remaining English post offices in Chattogram:\n\n";
$result = $pdo->query("
    SELECT DISTINCT post_office 
    FROM location 
    WHERE division='Chattogram' 
    AND post_office=post_office_bn 
    AND post_office NOT REGEXP '[অ-ৰ]' 
    ORDER BY post_office
");

while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    echo $row['post_office'] . "\n";
}

echo "\n\nRemaining English upazilas:\n\n";
$result = $pdo->query("
    SELECT DISTINCT upazila 
    FROM location 
    WHERE division='Chattogram' 
    AND upazila=upazila_bn 
    AND upazila NOT REGEXP '[অ-ৰ]' 
    ORDER BY upazila
");

while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    echo $row['upazila'] . "\n";
}
