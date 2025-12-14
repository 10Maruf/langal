<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TTSController extends Controller
{
    /**
     * Proxy Hugging Face TTS API to bypass CORS
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateSpeech(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'text' => 'required|string|max:5000',
                'model' => 'string|max:200'
            ]);

            $text = $validated['text'];
            $model = $validated['model'] ?? 'facebook/mms-tts-ben';

            // Get Hugging Face API key from environment
            $hfApiKey = env('HUGGINGFACE_API_KEY');
            
            if (!$hfApiKey) {
                return response()->json([
                    'error' => 'Hugging Face API key not configured'
                ], 500);
            }

            // Available models for Bengali TTS
            $allowedModels = [
                'facebook/mms-tts-ben',
                'mnatrb/VitsModel-Bangla-Female',
                'sanchit-gandhi/whisper-small-bn'
            ];

            if (!in_array($model, $allowedModels)) {
                return response()->json([
                    'error' => 'Invalid model specified'
                ], 400);
            }

            Log::info('TTS Request', [
                'model' => $model,
                'text_length' => strlen($text),
                'text_preview' => substr($text, 0, 100)
            ]);

            // Call Hugging Face Router API (new endpoint as of Dec 2025)
            // The API migrated from api-inference.huggingface.co to router.huggingface.co
            $response = Http::timeout(60)
                ->withOptions([
                    'verify' => false, // Disable SSL verification for development
                ])
                ->withHeaders([
                    'Authorization' => "Bearer {$hfApiKey}",
                ])
                ->post("https://router.huggingface.co/models/{$model}", [
                    'inputs' => $text,
                    'options' => [
                        'wait_for_model' => true
                    ]
                ]);

            if ($response->failed()) {
                Log::error('Hugging Face API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return response()->json([
                    'error' => 'Hugging Face API request failed',
                    'details' => $response->json()
                ], $response->status());
            }

            // Return audio file
            return response($response->body())
                ->header('Content-Type', 'audio/flac')
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('TTS Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Server error occurred',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available TTS models
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getModels()
    {
        return response()->json([
            'models' => [
                [
                    'id' => 'facebook/mms-tts-ben',
                    'name' => 'Meta MMS Bengali',
                    'description' => 'High-quality Bengali TTS from Meta (Recommended)',
                    'language' => 'bn',
                    'quality' => 'high'
                ],
                [
                    'id' => 'mnatrb/VitsModel-Bangla-Female',
                    'name' => 'VITS Bengali Female',
                    'description' => 'Female voice Bengali TTS',
                    'language' => 'bn',
                    'quality' => 'medium'
                ],
                [
                    'id' => 'sanchit-gandhi/whisper-small-bn',
                    'name' => 'Whisper Bengali',
                    'description' => 'Whisper-based Bengali TTS',
                    'language' => 'bn',
                    'quality' => 'medium'
                ]
            ]
        ]);
    }

    /**
     * Health check endpoint
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function healthCheck()
    {
        $hfApiKey = env('HUGGINGFACE_API_KEY');
        
        return response()->json([
            'status' => 'ok',
            'api_key_configured' => !empty($hfApiKey),
            'timestamp' => now()->toIso8601String()
        ]);
    }
}
