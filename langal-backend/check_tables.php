<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Field Data Collection Table Columns ===\n\n";

try {
    $columns = DB::select('SHOW COLUMNS FROM field_data_collection');
    foreach ($columns as $col) {
        echo "{$col->Field} ({$col->Type})\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
