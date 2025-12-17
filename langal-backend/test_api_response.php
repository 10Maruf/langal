<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\User;

// Get latest expert user
$user = User::where('user_type', 'expert')
    ->with(['profile', 'expert'])
    ->latest()
    ->first();

if (!$user) {
    echo "No expert user found\n";
    exit;
}

// Simulate the API response
$userData = $user->toArray();

echo "API Response Structure:\n";
echo "======================\n\n";
echo json_encode([
    'success' => true,
    'data' => [
        'user' => $userData
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

echo "\n\n======================\n";
echo "Profile Photo URL Full: " . ($user->profile->profile_photo_url_full ?? 'NULL') . "\n";
echo "Certification URL Full: " . ($user->expert->certification_document_url_full ?? 'NULL') . "\n";
