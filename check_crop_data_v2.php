<?php
$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'langol_krishi_sahayak';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the latest selected crop
$sql = "SELECT * FROM farmer_selected_crops ORDER BY selection_id DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "Last Selected Crop Data (selected_crops table):\n";
    print_r($row);
    
    // Also get the crop detail to see field names
    if (isset($row['recommendation_id'])) {
        $recId = $row['recommendation_id'];
        $recSql = "SELECT * FROM crop_recommendations WHERE id = $recId";
        $recResult = $conn->query($recSql);
        if ($recResult->num_rows > 0) {
            echo "\nRecommendation Data (crop_recommendations table):\n";
            print_r($recResult->fetch_assoc());
        }
    }
} else {
    echo "No selected crops found.";
}
?>