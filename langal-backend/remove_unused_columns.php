<?php
/**
 * Remove unnecessary location ID columns from marketplace_listings
 * Keep only: postal_code, village, full_location_bn
 */

$conn = new mysqli('127.0.0.1', 'root', '', 'langol_krishi_sahayak');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "=== Removing Unnecessary Location ID Columns ===\n\n";

// Check current columns
$result = $conn->query("SHOW COLUMNS FROM marketplace_listings WHERE Field IN ('division_id', 'district_id', 'upazila_id', 'post_office_id')");
$columnsToRemove = [];
while ($row = $result->fetch_assoc()) {
    $columnsToRemove[] = $row['Field'];
}

echo "Columns to remove: " . implode(', ', $columnsToRemove) . "\n\n";

if (count($columnsToRemove) > 0) {
    // Drop each column
    foreach ($columnsToRemove as $column) {
        echo "🔄 Dropping column: $column...\n";
        $sql = "ALTER TABLE marketplace_listings DROP COLUMN `$column`";
        if ($conn->query($sql)) {
            echo "✅ Dropped: $column\n";
        } else {
            echo "❌ Error dropping $column: " . $conn->error . "\n";
        }
    }
} else {
    echo "✅ No unnecessary columns found\n";
}

echo "\n=== Final Table Structure ===\n\n";
$result = $conn->query("DESCRIBE marketplace_listings");
while ($row = $result->fetch_assoc()) {
    echo "  - {$row['Field']} ({$row['Type']})\n";
}

$conn->close();

echo "\n✅ Done!\n";
