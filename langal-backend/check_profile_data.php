<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$user = User::where('user_type', 'expert')
    ->with(['profile', 'expert'])
    ->latest()
    ->first();

if (!$user) {
    echo "No expert user found\n";
    exit;
}

echo "========================================\n";
echo "User ID: {$user->user_id}\n";
echo "Phone: {$user->phone}\n";
echo "========================================\n\n";

if ($user->profile) {
    echo "Profile Photo Path (DB): {$user->profile->profile_photo_url}\n";
    echo "Profile Photo Full URL: {$user->profile->profile_photo_url_full}\n";

    $fullPath = storage_path('app/public/' . $user->profile->profile_photo_url);
    echo "File exists on disk: " . (file_exists($fullPath) ? 'YES' : 'NO') . "\n";
    if (file_exists($fullPath)) {
        echo "File size: " . filesize($fullPath) . " bytes\n";
    }
} else {
    echo "No profile found\n";
}

echo "\n========================================\n\n";

if ($user->expert) {
    echo "Certification Path (DB): {$user->expert->certification_document}\n";
    echo "Certification Full URL: {$user->expert->certification_document_url_full}\n";

    $fullPath = storage_path('app/public/' . $user->expert->certification_document);
    echo "File exists on disk: " . (file_exists($fullPath) ? 'YES' : 'NO') . "\n";
    if (file_exists($fullPath)) {
        echo "File size: " . filesize($fullPath) . " bytes\n";
    }
} else {
    echo "No expert data found\n";
}

echo "\n========================================\n";
echo "Storage Path: " . storage_path('app/public') . "\n";
echo "Public Path: " . public_path('storage') . "\n";
echo "Symlink exists: " . (is_link(public_path('storage')) ? 'YES' : 'NO') . "\n";
if (is_link(public_path('storage'))) {
    echo "Symlink target: " . readlink(public_path('storage')) . "\n";
}
echo "========================================\n";
