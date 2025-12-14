<?php
$pdo = new PDO('mysql:host=localhost;dbname=langol_krishi_sahayak;charset=utf8mb4', 'root', '');
$r = $pdo->query("SELECT * FROM location WHERE postal_code=1360")->fetch(PDO::FETCH_ASSOC);
print_r($r);
