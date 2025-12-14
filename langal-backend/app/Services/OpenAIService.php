<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class OpenAIService
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl = 'https://api.openai.com/v1';

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
        $this->model = config('services.openai.model', 'gpt-4o-mini');
    }

    /**
     * Generate crop recommendations using AI
     */
    public function generateCropRecommendation(array $params): array
    {
        $location = $params['location'] ?? '';
        $division = $params['division'] ?? '';
        $district = $params['district'] ?? '';
        $upazila = $params['upazila'] ?? '';
        $season = $params['season'] ?? '';
        $cropType = $params['crop_type'] ?? '';
        $landSize = $params['land_size'] ?? null;
        $budget = $params['budget'] ?? null;
        $soilType = $params['soil_type'] ?? '';
        $weatherData = $params['weather_data'] ?? null;

        // Build location string
        $locationStr = implode(', ', array_filter([$upazila, $district, $division]));
        if (empty($locationStr)) {
            $locationStr = $location;
        }

        // Get season info in Bangla
        $seasonInfo = $this->getSeasonInfo($season);

        // Get crop type info in Bangla
        $cropTypeInfo = $this->getCropTypeInfo($cropType);

        $prompt = $this->buildPrompt([
            'location' => $locationStr,
            'season' => $season,
            'season_bn' => $seasonInfo['name_bn'],
            'season_period' => $seasonInfo['period'],
            'crop_type' => $cropType,
            'crop_type_bn' => $cropTypeInfo['name_bn'],
            'land_size' => $landSize,
            'budget' => $budget,
            'soil_type' => $soilType,
            'weather_data' => $weatherData,
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->withOptions([
                'verify' => false, // Skip SSL verification for local development
            ])->timeout(60)->post($this->baseUrl . '/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->getSystemPrompt()
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 4000,
                'response_format' => ['type' => 'json_object']
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? '';
                
                $recommendations = json_decode($content, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('OpenAI response JSON parse error', ['content' => $content]);
                    return $this->getFallbackRecommendations($season, $cropType);
                }

                return [
                    'success' => true,
                    'recommendations' => $recommendations,
                    'model' => $this->model,
                    'prompt' => $prompt,
                    'raw_response' => $content
                ];
            }

            Log::error('OpenAI API error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return $this->getFallbackRecommendations($season, $cropType);

        } catch (\Exception $e) {
            Log::error('OpenAI service exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->getFallbackRecommendations($season, $cropType);
        }
    }

    /**
     * Build the AI prompt
     */
    protected function buildPrompt(array $params): string
    {
        $location = $params['location'];
        $seasonBn = $params['season_bn'];
        $seasonPeriod = $params['season_period'];
        $cropTypeBn = $params['crop_type_bn'];
        $landSize = $params['land_size'];
        $budget = $params['budget'];
        $weatherData = $params['weather_data'] ?? null;

        $prompt = "বাংলাদেশের কৃষকের জন্য ফসল সুপারিশ দাও।\n\n";
        $prompt .= "📍 অবস্থান: {$location}\n";
        $prompt .= "🗓️ মৌসুম: {$seasonBn} ({$seasonPeriod})\n";
        
        if ($cropTypeBn) {
            $prompt .= "🌱 ফসলের ধরন: {$cropTypeBn}\n";
        }
        
        if ($landSize) {
            $prompt .= "📐 জমির পরিমাণ: {$landSize} বিঘা\n";
        }
        
        if ($budget) {
            $prompt .= "💰 বাজেট: ৳{$budget}\n";
        }

        // Add weather data if available
        if ($weatherData) {
            $prompt .= "\n🌤️ বর্তমান আবহাওয়া:\n";
            if (isset($weatherData['temperature'])) {
                $prompt .= "   - তাপমাত্রা: {$weatherData['temperature']}°সে\n";
            }
            if (isset($weatherData['humidity'])) {
                $prompt .= "   - আর্দ্রতা: {$weatherData['humidity']}%\n";
            }
            if (isset($weatherData['rainfall_chance'])) {
                $prompt .= "   - বৃষ্টির সম্ভাবনা: {$weatherData['rainfall_chance']}%\n";
            }
            if (isset($weatherData['description'])) {
                $prompt .= "   - অবস্থা: {$weatherData['description']}\n";
            }
            if (isset($weatherData['forecast']) && $weatherData['forecast']) {
                $prompt .= "   - পূর্বাভাস: {$weatherData['forecast']}\n";
            }
            $prompt .= "\nআবহাওয়া বিবেচনায় নিয়ে সুপারিশ দাও।\n";
        }

        $prompt .= "\nএই তথ্যের ভিত্তিতে সবচেয়ে উপযুক্ত ৫-৮টি ফসলের সুপারিশ দাও।";

        return $prompt;
    }

    /**
     * Get system prompt for AI
     */
    protected function getSystemPrompt(): string
    {
        return <<<PROMPT
তুমি একজন বাংলাদেশের কৃষি বিশেষজ্ঞ। তোমার কাজ হলো কৃষকদের জন্য সেরা ফসল সুপারিশ দেওয়া।

তোমাকে JSON ফরম্যাটে উত্তর দিতে হবে নিচের structure অনুযায়ী:

{
  "crops": [
    {
      "name": "ফসলের ইংরেজি নাম",
      "name_bn": "ফসলের বাংলা নাম",
      "type": "crop_type_key (rice/vegetables/fruits/spices/pulses/oilseeds/fiber/wheat/maize/tubers)",
      "cost_per_bigha": 0,
      "yield_per_bigha": "0 মণ/কেজি",
      "market_price": "৳0/কেজি",
      "duration_days": 0,
      "profit_per_bigha": 0,
      "difficulty": "easy/medium/hard",
      "water_requirement": "low/medium/high",
      "description_bn": "সংক্ষিপ্ত বিবরণ বাংলায়",
      "cost_breakdown": {
        "seed": 0,
        "fertilizer": 0,
        "pesticide": 0,
        "irrigation": 0,
        "labor": 0,
        "other": 0
      },
      "cultivation_plan": [
        {
          "phase": "পর্যায়ের নাম",
          "days": "Day X-Y",
          "tasks": ["কাজ ১", "কাজ ২"]
        }
      ],
      "fertilizer_schedule": [
        {
          "timing": "কখন",
          "fertilizers": [
            {"name": "সারের নাম", "amount": "পরিমাণ/বিঘা"}
          ]
        }
      ],
      "risks": ["ঝুঁকি ১", "ঝুঁকি ২"],
      "tips": ["টিপস ১", "টিপস ২"]
    }
  ],
  "season_tips": "এই মৌসুমে সাধারণ পরামর্শ",
  "weather_advisory": "আবহাওয়া সংক্রান্ত পরামর্শ"
}

গুরুত্বপূর্ণ নির্দেশনা:
1. সব তথ্য বাংলাদেশের প্রেক্ষাপটে দিতে হবে
2. খরচ ও দাম বাংলাদেশি টাকায় (বর্তমান বাজার দর অনুযায়ী)
3. জমির পরিমাপ বিঘায় (1 বিঘা = 0.33 একর)
4. স্থানীয় জাত ও পদ্ধতি প্রাধান্য দিতে হবে
5. বাস্তবসম্মত তথ্য দিতে হবে
6. profit_per_bigha = (yield × market_price) - cost_per_bigha
PROMPT;
    }

    /**
     * Get season information
     */
    protected function getSeasonInfo(string $seasonKey): array
    {
        $seasons = [
            'rabi' => [
                'name_bn' => 'রবি মৌসুম',
                'period' => '১৬ অক্টোবর - ১৫ মার্চ',
                'description' => 'শীতকালীন ফসল'
            ],
            'kharif1' => [
                'name_bn' => 'খরিফ-১ মৌসুম',
                'period' => '১৬ মার্চ - ১৫ জুলাই',
                'description' => 'গ্রীষ্মকালীন ফসল'
            ],
            'kharif2' => [
                'name_bn' => 'খরিফ-২ মৌসুম',
                'period' => '১৬ জুলাই - ১৫ অক্টোবর',
                'description' => 'বর্ষাকালীন ফসল'
            ]
        ];

        return $seasons[$seasonKey] ?? [
            'name_bn' => $seasonKey,
            'period' => '',
            'description' => ''
        ];
    }

    /**
     * Get crop type information
     */
    protected function getCropTypeInfo(string $typeKey): array
    {
        $types = [
            'rice' => ['name_bn' => 'ধান', 'icon' => '🌾'],
            'vegetables' => ['name_bn' => 'সবজি', 'icon' => '🥬'],
            'fruits' => ['name_bn' => 'ফল', 'icon' => '🍎'],
            'spices' => ['name_bn' => 'মসলা', 'icon' => '🌶️'],
            'pulses' => ['name_bn' => 'ডাল', 'icon' => '🫘'],
            'oilseeds' => ['name_bn' => 'তৈলবীজ', 'icon' => '🌻'],
            'fiber' => ['name_bn' => 'আঁশ ফসল', 'icon' => '🧵'],
            'wheat' => ['name_bn' => 'গম', 'icon' => '🌾'],
            'maize' => ['name_bn' => 'ভুট্টা', 'icon' => '🌽'],
            'tubers' => ['name_bn' => 'কন্দ ফসল', 'icon' => '🥔'],
            'all' => ['name_bn' => 'সব ধরনের', 'icon' => '🌱'],
        ];

        return $types[$typeKey] ?? ['name_bn' => '', 'icon' => '🌱'];
    }

    /**
     * Fallback recommendations when AI fails
     */
    protected function getFallbackRecommendations(string $season, string $cropType): array
    {
        $fallback = $this->getLocalRecommendations($season, $cropType);
        
        return [
            'success' => true,
            'recommendations' => $fallback,
            'model' => 'fallback',
            'prompt' => '',
            'raw_response' => '',
            'is_fallback' => true
        ];
    }

    /**
     * Get local/cached recommendations
     */
    protected function getLocalRecommendations(string $season, string $cropType): array
    {
        // Fallback data based on Bangladesh agriculture
        $data = [
            'rabi' => [
                [
                    'name' => 'Potato',
                    'name_bn' => 'আলু',
                    'type' => 'tubers',
                    'cost_per_bigha' => 15000,
                    'yield_per_bigha' => '80 মণ',
                    'market_price' => '৳25/কেজি',
                    'duration_days' => 90,
                    'profit_per_bigha' => 65000,
                    'difficulty' => 'easy',
                    'water_requirement' => 'medium',
                    'description_bn' => 'রবি মৌসুমের অন্যতম প্রধান ফসল। শীতকালে চাষ করা হয়।',
                    'cost_breakdown' => [
                        'seed' => 8000,
                        'fertilizer' => 3000,
                        'pesticide' => 1000,
                        'irrigation' => 1500,
                        'labor' => 1000,
                        'other' => 500
                    ],
                    'cultivation_plan' => [
                        ['phase' => 'জমি প্রস্তুতি', 'days' => 'Day 1-7', 'tasks' => ['জমি চাষ', 'সার প্রয়োগ', 'আলু বপন']],
                        ['phase' => 'পরিচর্যা', 'days' => 'Day 30-45', 'tasks' => ['সেচ', 'আগাছা পরিষ্কার', 'মাটি তোলা']],
                        ['phase' => 'সংগ্রহ', 'days' => 'Day 85-95', 'tasks' => ['আলু তোলা', 'শুকানো', 'সংরক্ষণ']]
                    ],
                    'fertilizer_schedule' => [
                        ['timing' => 'বপনের সময়', 'fertilizers' => [['name' => 'ইউরিয়া', 'amount' => '৫ কেজি/বিঘা'], ['name' => 'টিএসপি', 'amount' => '৮ কেজি/বিঘা']]],
                        ['timing' => '৩০ দিন পর', 'fertilizers' => [['name' => 'ইউরিয়া', 'amount' => '৫ কেজি/বিঘা']]]
                    ],
                    'risks' => ['মড়ক রোগ', 'পোকামাকড়'],
                    'tips' => ['সুস্থ বীজ আলু ব্যবহার করুন', 'পানি জমতে দেবেন না']
                ],
                [
                    'name' => 'Wheat',
                    'name_bn' => 'গম',
                    'type' => 'wheat',
                    'cost_per_bigha' => 8000,
                    'yield_per_bigha' => '১২ মণ',
                    'market_price' => '৳35/কেজি',
                    'duration_days' => 120,
                    'profit_per_bigha' => 8800,
                    'difficulty' => 'easy',
                    'water_requirement' => 'low',
                    'description_bn' => 'শীতকালীন দানা জাতীয় ফসল।',
                    'cost_breakdown' => ['seed' => 1500, 'fertilizer' => 3000, 'pesticide' => 500, 'irrigation' => 1500, 'labor' => 1000, 'other' => 500],
                    'cultivation_plan' => [
                        ['phase' => 'বপন', 'days' => 'Day 1-5', 'tasks' => ['জমি প্রস্তুতি', 'বীজ বপন']],
                        ['phase' => 'পরিচর্যা', 'days' => 'Day 20-60', 'tasks' => ['সেচ', 'সার প্রয়োগ']],
                        ['phase' => 'সংগ্রহ', 'days' => 'Day 115-125', 'tasks' => ['কাটা', 'মাড়াই']]
                    ],
                    'fertilizer_schedule' => [],
                    'risks' => ['মরিচা রোগ'],
                    'tips' => ['সঠিক সময়ে বপন করুন']
                ],
                [
                    'name' => 'Mustard',
                    'name_bn' => 'সরিষা',
                    'type' => 'oilseeds',
                    'cost_per_bigha' => 5000,
                    'yield_per_bigha' => '৪ মণ',
                    'market_price' => '৳150/কেজি',
                    'duration_days' => 95,
                    'profit_per_bigha' => 19000,
                    'difficulty' => 'easy',
                    'water_requirement' => 'low',
                    'description_bn' => 'তৈলবীজ ফসল, শীতকালে চাষ হয়।',
                    'cost_breakdown' => ['seed' => 800, 'fertilizer' => 2000, 'pesticide' => 500, 'irrigation' => 800, 'labor' => 600, 'other' => 300],
                    'cultivation_plan' => [],
                    'fertilizer_schedule' => [],
                    'risks' => ['জাব পোকা'],
                    'tips' => ['ফুল আসার সময় সেচ দিন']
                ],
                [
                    'name' => 'Tomato',
                    'name_bn' => 'টমেটো',
                    'type' => 'vegetables',
                    'cost_per_bigha' => 18000,
                    'yield_per_bigha' => '১২০ মণ',
                    'market_price' => '৳30/কেজি',
                    'duration_days' => 110,
                    'profit_per_bigha' => 126000,
                    'difficulty' => 'medium',
                    'water_requirement' => 'medium',
                    'description_bn' => 'জনপ্রিয় সবজি, ভালো দাম পাওয়া যায়।',
                    'cost_breakdown' => ['seed' => 2000, 'fertilizer' => 5000, 'pesticide' => 3000, 'irrigation' => 3000, 'labor' => 4000, 'other' => 1000],
                    'cultivation_plan' => [],
                    'fertilizer_schedule' => [],
                    'risks' => ['ভাইরাস রোগ', 'ফল ফাটা'],
                    'tips' => ['মাচায় চাষ করুন', 'নিয়মিত পরিচর্যা করুন']
                ]
            ],
            'kharif1' => [
                [
                    'name' => 'Aus Rice',
                    'name_bn' => 'আউশ ধান',
                    'type' => 'rice',
                    'cost_per_bigha' => 12000,
                    'yield_per_bigha' => '১৫ মণ',
                    'market_price' => '৳30/কেজি',
                    'duration_days' => 110,
                    'profit_per_bigha' => 6000,
                    'difficulty' => 'easy',
                    'water_requirement' => 'high',
                    'description_bn' => 'গ্রীষ্মকালীন ধান।',
                    'cost_breakdown' => ['seed' => 1500, 'fertilizer' => 4000, 'pesticide' => 1500, 'irrigation' => 2500, 'labor' => 2000, 'other' => 500],
                    'cultivation_plan' => [],
                    'fertilizer_schedule' => [],
                    'risks' => ['বন্যা', 'পোকামাকড়'],
                    'tips' => ['উঁচু জমি নির্বাচন করুন']
                ],
                [
                    'name' => 'Jute',
                    'name_bn' => 'পাট',
                    'type' => 'fiber',
                    'cost_per_bigha' => 8000,
                    'yield_per_bigha' => '৮ মণ',
                    'market_price' => '৳80/কেজি',
                    'duration_days' => 120,
                    'profit_per_bigha' => 17600,
                    'difficulty' => 'medium',
                    'water_requirement' => 'high',
                    'description_bn' => 'সোনালি আঁশ, বাংলাদেশের প্রধান অর্থকরী ফসল।',
                    'cost_breakdown' => ['seed' => 500, 'fertilizer' => 3000, 'pesticide' => 1000, 'irrigation' => 1500, 'labor' => 1500, 'other' => 500],
                    'cultivation_plan' => [],
                    'fertilizer_schedule' => [],
                    'risks' => ['পানি দূষণ'],
                    'tips' => ['পানি জমে থাকা জমি নির্বাচন করুন']
                ],
                [
                    'name' => 'Cucumber',
                    'name_bn' => 'শসা',
                    'type' => 'vegetables',
                    'cost_per_bigha' => 10000,
                    'yield_per_bigha' => '৬০ মণ',
                    'market_price' => '৳25/কেজি',
                    'duration_days' => 60,
                    'profit_per_bigha' => 50000,
                    'difficulty' => 'easy',
                    'water_requirement' => 'medium',
                    'description_bn' => 'দ্রুত বর্ধনশীল সবজি।',
                    'cost_breakdown' => ['seed' => 1500, 'fertilizer' => 3000, 'pesticide' => 1500, 'irrigation' => 2000, 'labor' => 1500, 'other' => 500],
                    'cultivation_plan' => [],
                    'fertilizer_schedule' => [],
                    'risks' => ['ফল মাছি'],
                    'tips' => ['মাচায় চাষ করুন']
                ]
            ],
            'kharif2' => [
                [
                    'name' => 'Aman Rice',
                    'name_bn' => 'আমন ধান',
                    'type' => 'rice',
                    'cost_per_bigha' => 10000,
                    'yield_per_bigha' => '১৮ মণ',
                    'market_price' => '৳28/কেজি',
                    'duration_days' => 130,
                    'profit_per_bigha' => 10160,
                    'difficulty' => 'easy',
                    'water_requirement' => 'high',
                    'description_bn' => 'বর্ষা মৌসুমের প্রধান ধান ফসল।',
                    'cost_breakdown' => ['seed' => 1200, 'fertilizer' => 3500, 'pesticide' => 1300, 'irrigation' => 1500, 'labor' => 2000, 'other' => 500],
                    'cultivation_plan' => [
                        ['phase' => 'বীজতলা', 'days' => 'Day 1-25', 'tasks' => ['বীজ বপন', 'চারা তৈরি']],
                        ['phase' => 'রোপণ', 'days' => 'Day 25-30', 'tasks' => ['জমি প্রস্তুতি', 'চারা রোপণ']],
                        ['phase' => 'পরিচর্যা', 'days' => 'Day 40-90', 'tasks' => ['সার প্রয়োগ', 'আগাছা দমন']],
                        ['phase' => 'সংগ্রহ', 'days' => 'Day 125-135', 'tasks' => ['ধান কাটা', 'মাড়াই']]
                    ],
                    'fertilizer_schedule' => [
                        ['timing' => 'রোপণের ৭ দিন পর', 'fertilizers' => [['name' => 'ইউরিয়া', 'amount' => '৬ কেজি/বিঘা']]],
                        ['timing' => 'কুশি পর্যায়ে', 'fertilizers' => [['name' => 'ইউরিয়া', 'amount' => '৬ কেজি/বিঘা']]]
                    ],
                    'risks' => ['বন্যা', 'মাজরা পোকা'],
                    'tips' => ['উচ্চ ফলনশীল জাত ব্যবহার করুন']
                ],
                [
                    'name' => 'Brinjal',
                    'name_bn' => 'বেগুন',
                    'type' => 'vegetables',
                    'cost_per_bigha' => 12000,
                    'yield_per_bigha' => '৮০ মণ',
                    'market_price' => '৳35/কেজি',
                    'duration_days' => 120,
                    'profit_per_bigha' => 100000,
                    'difficulty' => 'medium',
                    'water_requirement' => 'medium',
                    'description_bn' => 'সারা বছর চাষযোগ্য সবজি।',
                    'cost_breakdown' => ['seed' => 1000, 'fertilizer' => 4000, 'pesticide' => 2500, 'irrigation' => 2000, 'labor' => 2000, 'other' => 500],
                    'cultivation_plan' => [],
                    'fertilizer_schedule' => [],
                    'risks' => ['ডগা ও ফল ছিদ্রকারী পোকা'],
                    'tips' => ['ফেরোমন ফাঁদ ব্যবহার করুন']
                ]
            ]
        ];

        $seasonData = $data[$season] ?? $data['rabi'];
        
        // Filter by crop type if specified
        if ($cropType && $cropType !== 'all') {
            $seasonData = array_filter($seasonData, fn($crop) => $crop['type'] === $cropType);
            $seasonData = array_values($seasonData);
        }

        return [
            'crops' => $seasonData,
            'season_tips' => 'এই মৌসুমে নিয়মিত জমি পরিদর্শন করুন এবং সঠিক সময়ে সার ও সেচ দিন।',
            'weather_advisory' => 'আবহাওয়ার পূর্বাভাস দেখে কাজ করুন।'
        ];
    }
}
