<?php
/**
 * Database Setup Script
 * This script creates the database and imports data without requiring PDO MySQL
 */

$host = '127.0.0.1';
$port = 3306;
$database = 'langol_krishi_sahayak';
$username = 'root';
$password = '';

// SQL file to import
$sqlFile = __DIR__ . '/Langal_xampp.sql';

echo "=== Langol Krishi Sahayak Database Setup ===\n";
echo "Host: $host:$port\n";
echo "Database: $database\n";
echo "SQL File: $sqlFile\n\n";

// Check if SQL file exists
if (!file_exists($sqlFile)) {
    echo "❌ Error: SQL file not found at $sqlFile\n";
    exit(1);
}

// Try to connect using mysqli if available
if (extension_loaded('mysqli')) {
    echo "✅ MySQLi extension found. Proceeding with setup...\n";
    
    try {
        // Connect to MySQL server
        $connection = new mysqli($host, $username, $password, '', $port);
        
        if ($connection->connect_error) {
            throw new Exception("Connection failed: " . $connection->connect_error);
        }
        
        echo "✅ Connected to MySQL server\n";
        
        // Create database if not exists
        $createDbQuery = "CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
        if ($connection->query($createDbQuery)) {
            echo "✅ Database '$database' created/exists\n";
        } else {
            throw new Exception("Error creating database: " . $connection->error);
        }
        
        // Select database
        $connection->select_db($database);
        
        // Read and execute SQL file
        echo "📁 Reading SQL file...\n";
        $sqlContent = file_get_contents($sqlFile);
        
        if (!$sqlContent) {
            throw new Exception("Failed to read SQL file");
        }
        
        echo "⚡ Executing SQL commands...\n";
        
        // Split SQL into individual statements
        $statements = array_filter(array_map('trim', explode(';', $sqlContent)));
        
        $successCount = 0;
        $errorCount = 0;
        
        foreach ($statements as $statement) {
            if (empty($statement) || strpos($statement, '--') === 0) {
                continue; // Skip empty statements and comments
            }
            
            if ($connection->query($statement)) {
                $successCount++;
            } else {
                echo "⚠️ Warning: " . $connection->error . "\n";
                $errorCount++;
            }
        }
        
        echo "✅ Database setup completed!\n";
        echo "📊 Statements executed: $successCount\n";
        if ($errorCount > 0) {
            echo "⚠️ Warnings: $errorCount\n";
        }
        
        // Test connection
        echo "\n🧪 Testing database connection...\n";
        $testQuery = "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = '$database'";
        $result = $connection->query($testQuery);
        
        if ($result) {
            $row = $result->fetch_assoc();
            echo "✅ Database has {$row['table_count']} tables\n";
        }
        
        $connection->close();
        
    } catch (Exception $e) {
        echo "❌ Error: " . $e->getMessage() . "\n";
        exit(1);
    }
    
} else {
    echo "❌ MySQLi extension not found.\n";
    echo "💡 You can manually import the SQL file using phpMyAdmin:\n";
    echo "   1. Go to http://localhost/phpmyadmin\n";
    echo "   2. Create database: $database\n";
    echo "   3. Import file: $sqlFile\n";
    exit(1);
}

echo "\n🎉 Database setup successful! You can now use Laravel with the database.\n";
?>