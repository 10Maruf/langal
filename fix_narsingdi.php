<?php
$pdo = new PDO('mysql:host=localhost;dbname=langol_krishi_sahayak;charset=utf8mb4', 'root', '');
$pdo->exec("UPDATE location SET district_bn = 'নরসিংদী' WHERE district = 'Narsingdi'");
echo "Fixed Narsingdi.\n";
