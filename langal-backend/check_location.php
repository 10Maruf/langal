<?php
$conn = new mysqli('127.0.0.1', 'root', '', 'langol_krishi_sahayak');

echo "=== Location Table Structure ===\n\n";
$result = $conn->query('DESCRIBE location');
while($row = $result->fetch_assoc()) { 
    echo $row['Field'] . ' (' . $row['Type'] . ') - Key: ' . $row['Key'] . "\n"; 
}

echo "\n=== Sample Location Data ===\n\n";
$result = $conn->query('SELECT * FROM location LIMIT 5');
while($row = $result->fetch_assoc()) { 
    print_r($row);
}

$conn->close();
