<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;

// Get a user with a valid token
$token = DB::table('personal_access_tokens')->orderBy('id', 'desc')->first();
$user = User::find($token->tokenable_id);

echo "User ID: " . $user->user_id . "\n";
echo "User Phone: " . $user->phone . "\n";

// Get the actual token string (we need to hash compare, but for testing we need the plain token)
// Let's just create a new token for testing
$newToken = $user->createToken('test-token', ['farmer'])->plainTextToken;
echo "\nNew Token for testing: " . $newToken . "\n";

// Now simulate API call 
$payload = [
    'seller_id' => $user->user_id,
    'category_id' => 1,
    'title' => 'API Test Listing',
    'description' => 'Test from PHP script',
    'price' => 500,
    'currency' => 'BDT',
    'listing_type' => 'sell',
    'location' => 'ঢাকা',
    'contact_phone' => $user->phone,
    'tags' => [],
    'images' => [],
];

echo "\nPayload being sent:\n";
print_r($payload);

// Make HTTP request
$ch = curl_init('http://localhost:8000/api/marketplace');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $newToken,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "\nHTTP Status: " . $httpCode . "\n";
echo "Response: " . $response . "\n";
