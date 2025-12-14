<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TTSDebugController extends Controller
{
    public function testAPI(Request $request)
    {
        $apiKey = env('HUGGINGFACE_API_KEY');
        $model = 'facebook/mms-tts-ben';
        $text = 'test';

        $result = [
            'api_key_configured' => !empty($apiKey),
            'api_key_preview' => substr($apiKey, 0, 10) . '...',
            'model' => $model,
            'endpoint' => "https://router.huggingface.co/models/{$model}",
        ];

        try {
            $response = Http::timeout(10)
                ->withOptions(['verify' => false])
                ->withHeaders([
                    'Authorization' => "Bearer {$apiKey}",
                ])
                ->post("https://router.huggingface.co/models/{$model}", [
                    'inputs' => $text,
                    'options' => ['wait_for_model' => true]
                ]);

            $result['http_code'] = $response->status();
            $result['response_body'] = $response->body();
            $result['response_json'] = $response->json();
            $result['success'] = $response->successful();

        } catch (\Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return response()->json($result, 200);
    }
}
