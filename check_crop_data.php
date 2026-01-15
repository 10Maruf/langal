<?php
require_once 'langal-backend/db_connection.php';

// Get the latest selected crop
$sql = "SELECT * FROM selected_crops ORDER BY selection_id DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "Last Selected Crop Data:\n";
    print_r($row);
    
    // Also get the crop detail to see field names
    if (isset($row['recommendation_id'])) {
        $recId = $row['recommendation_id'];
        $recSql = "SELECT * FROM crop_recommendations WHERE id = $recId";
        $recResult = $conn->query($recSql);
        if ($recResult->num_rows > 0) {
            echo "\nRecommendation Data:\n";
            print_r($recResult->fetch_assoc());
        }
    }
} else {
    echo "No selected crops found.";
}
?>