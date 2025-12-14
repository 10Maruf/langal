<?php
// Simple test for Hugging Face TTS API

$text = "আসসালামু আলাইকুম";
$model = "facebook/mms-tts-ben";
$apiKey = "YOUR_HUGGINGFACE_API_KEY_HERE";

echo "Testing Hugging Face TTS API...\n";
echo "Text: $text\n";
echo "Model: $model\n\n";

// Using new Router API (migrated Dec 2025)
$ch = curl_init("https://router.huggingface.co/models/$model");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification for development
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'inputs' => $text,
    'options' => [
        'wait_for_model' => true
    ]
]));

echo "Calling Hugging Face API...\n";

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "CURL Error: $error\n";
    exit(1);
}

if ($httpCode !== 200) {
    echo "Response: " . substr($response, 0, 500) . "\n";
    exit(1);
}

echo "Success! Received audio data: " . strlen($response) . " bytes\n";
echo "\nHugging Face API is working correctly!\n";
