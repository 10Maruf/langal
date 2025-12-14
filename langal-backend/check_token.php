<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check last token
$token = Illuminate\Support\Facades\DB::table('personal_access_tokens')
    ->orderBy('id', 'desc')
    ->first();

echo "Last Token:\n";
echo "ID: " . $token->id . "\n";
echo "Tokenable Type: " . $token->tokenable_type . "\n";
echo "Tokenable ID: " . $token->tokenable_id . "\n";
echo "Name: " . $token->name . "\n";
echo "Created: " . $token->created_at . "\n";
