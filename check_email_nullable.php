<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/langal-backend/vendor/autoload.php';
$app = require __DIR__ . '/langal-backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$columns = DB::select('SHOW COLUMNS FROM user_profiles WHERE Field = "profile_photo_url"');
print_r($columns);
