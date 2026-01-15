<?php

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['OPENAI_API_KEY'] ?? '';

echo "🔑 Testing OpenAI API Key...\n";
echo "API Key: " . substr($apiKey, 0, 20) . "...\n\n";

if (empty($apiKey)) {
    echo "❌ ERROR: API key not found in .env file\n";
    exit(1);
}

echo "📤 Making test API call...\n\n";

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => 'https://api.openai.com/v1/models',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "HTTP Status Code: $httpCode\n";

if ($error) {
    echo "❌ cURL Error: $error\n";
    exit(1);
}

if ($httpCode === 200) {
    echo "✅ SUCCESS! API key is ACTIVE and working\n\n";
    
    $data = json_decode($response, true);
    if (isset($data['data'])) {
        echo "Available models: " . count($data['data']) . "\n";
        echo "First 5 models:\n";
        foreach (array_slice($data['data'], 0, 5) as $model) {
            echo "  - " . $model['id'] . "\n";
        }
    }
} elseif ($httpCode === 401) {
    echo "❌ FAILED: API key is INVALID or EXPIRED\n";
    echo "Response: $response\n";
} elseif ($httpCode === 429) {
    echo "⚠️  WARNING: Rate limit exceeded\n";
    echo "Response: $response\n";
} else {
    echo "❌ FAILED: Unexpected error\n";
    echo "Response: $response\n";
}
