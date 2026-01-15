<?php
require __DIR__ . '/langal-backend/vendor/autoload.php';
$app = require_once __DIR__ . '/langal-backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "--- LAST 5 NOTIFICATIONS ---\n";
    $notifications = DB::table('notifications')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get();
        
    foreach ($notifications as $n) {
        print_r($n);
        /*
        $data = json_decode($n->data, true);
        echo "ID: {$n->id} | Type: {$n->type} | Created: {$n->created_at}\n";
        echo "Title: " . ($data['title'] ?? 'N/A') . "\n";
        echo "Message: " . ($data['message'] ?? 'N/A') . "\n";
        */
        echo "--------------------------\n";
    }

    echo "\n--- CHECKING FOR PLANNED CROP NOTIFICATIONS ---\n";
    // Check if any notifications exist for crops that are still 'planned'
    // This assumes the data contains selection_id
    
    // This is harder to query directly with JSON, but let's just look at the table structure generally
    // by checking if we have any 'CropReminder' type notifications.
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
