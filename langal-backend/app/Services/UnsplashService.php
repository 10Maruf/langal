<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class UnsplashService
{
    protected string $accessKey;
    protected string $baseUrl = 'https://api.unsplash.com';
    protected int $cacheMinutes = 1440; // 24 hours

    public function __construct()
    {
        $this->accessKey = config('services.unsplash.access_key');
    }

    /**
     * Search for crop images
     */
    public function searchCropImage(string $cropName, string $cropNameBn = ''): ?array
    {
        // Create cache key
        $cacheKey = 'unsplash_crop_' . md5($cropName);
        
        // Check cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Build search query
            $searchQuery = $this->buildSearchQuery($cropName);
            
            $response = Http::withHeaders([
                'Authorization' => 'Client-ID ' . $this->accessKey,
            ])->withOptions([
                'verify' => false, // Skip SSL verification for local development
            ])->get($this->baseUrl . '/search/photos', [
                'query' => $searchQuery,
                'per_page' => 3,
                'orientation' => 'landscape',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $results = $data['results'] ?? [];

                if (count($results) > 0) {
                    $image = [
                        'id' => $results[0]['id'],
                        'url' => $results[0]['urls']['regular'] ?? $results[0]['urls']['small'],
                        'thumb' => $results[0]['urls']['thumb'],
                        'small' => $results[0]['urls']['small'],
                        'alt' => $results[0]['alt_description'] ?? $cropName,
                        'photographer' => $results[0]['user']['name'] ?? 'Unknown',
                        'photographer_url' => $results[0]['user']['links']['html'] ?? '',
                        'download_location' => $results[0]['links']['download_location'] ?? '',
                    ];

                    // Cache the result
                    Cache::put($cacheKey, $image, now()->addMinutes($this->cacheMinutes));
                    
                    return $image;
                }
            }

            Log::warning('Unsplash search returned no results', ['query' => $searchQuery]);
            
        } catch (\Exception $e) {
            Log::error('Unsplash API error', [
                'message' => $e->getMessage(),
                'crop' => $cropName
            ]);
        }

        // Return fallback image
        return $this->getFallbackImage($cropName);
    }

    /**
     * Get multiple crop images at once
     */
    public function getCropImages(array $crops): array
    {
        $images = [];
        
        foreach ($crops as $crop) {
            $name = is_array($crop) ? ($crop['name'] ?? $crop['name_bn'] ?? '') : $crop;
            $nameBn = is_array($crop) ? ($crop['name_bn'] ?? '') : '';
            
            if ($name) {
                $image = $this->searchCropImage($name, $nameBn);
                $images[$name] = $image;
            }
        }
        
        return $images;
    }

    /**
     * Build search query for better results
     */
    protected function buildSearchQuery(string $cropName): string
    {
        // Map crop names to better search terms
        $searchMap = [
            // Rice varieties
            'Aman Rice' => 'rice paddy field',
            'Aus Rice' => 'rice paddy green',
            'Boro Rice' => 'rice harvest',
            'আমন ধান' => 'rice paddy field',
            'আউশ ধান' => 'rice paddy green',
            'বোরো ধান' => 'rice harvest',
            
            // Vegetables
            'Potato' => 'potato harvest',
            'আলু' => 'potato harvest',
            'Tomato' => 'tomato plant',
            'টমেটো' => 'tomato plant',
            'Brinjal' => 'eggplant field',
            'বেগুন' => 'eggplant field',
            'Cucumber' => 'cucumber vine',
            'শসা' => 'cucumber vine',
            'Cauliflower' => 'cauliflower field',
            'ফুলকপি' => 'cauliflower field',
            'Cabbage' => 'cabbage field',
            'বাঁধাকপি' => 'cabbage field',
            'Onion' => 'onion field',
            'পেঁয়াজ' => 'onion field',
            'Garlic' => 'garlic harvest',
            'রসুন' => 'garlic harvest',
            'Chili' => 'chili pepper plant',
            'মরিচ' => 'chili pepper plant',
            
            // Oilseeds
            'Mustard' => 'mustard flower field yellow',
            'সরিষা' => 'mustard flower field yellow',
            'Sesame' => 'sesame plant',
            'তিল' => 'sesame plant',
            'Peanut' => 'peanut plant',
            'চিনাবাদাম' => 'peanut plant',
            
            // Grains
            'Wheat' => 'wheat field golden',
            'গম' => 'wheat field golden',
            'Maize' => 'corn field',
            'ভুট্টা' => 'corn field',
            
            // Pulses
            'Lentil' => 'lentil plant',
            'মসুর' => 'lentil plant',
            'Chickpea' => 'chickpea plant',
            'ছোলা' => 'chickpea plant',
            'Mung Bean' => 'mung bean plant',
            'মুগডাল' => 'mung bean plant',
            
            // Fiber
            'Jute' => 'jute field green',
            'পাট' => 'jute field green',
            
            // Fruits
            'Mango' => 'mango tree fruit',
            'আম' => 'mango tree fruit',
            'Banana' => 'banana plantation',
            'কলা' => 'banana plantation',
            'Papaya' => 'papaya tree',
            'পেঁপে' => 'papaya tree',
            'Watermelon' => 'watermelon field',
            'তরমুজ' => 'watermelon field',
            
            // Spices
            'Turmeric' => 'turmeric root',
            'হলুদ' => 'turmeric root',
            'Ginger' => 'ginger root',
            'আদা' => 'ginger root',
            'Coriander' => 'coriander plant',
            'ধনিয়া' => 'coriander plant',
        ];

        // Check if we have a mapping
        if (isset($searchMap[$cropName])) {
            return $searchMap[$cropName];
        }

        // Default: add 'farming' or 'crop' to the query
        return $cropName . ' farming crop';
    }

    /**
     * Get fallback image when API fails or no results
     */
    protected function getFallbackImage(string $cropName): array
    {
        // Map crop types to fallback images
        $fallbacks = [
            'rice' => 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800',
            'wheat' => 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
            'vegetables' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
            'fruits' => 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800',
            'default' => 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        ];

        // Determine crop category
        $category = 'default';
        $cropLower = strtolower($cropName);
        
        if (str_contains($cropLower, 'rice') || str_contains($cropLower, 'ধান')) {
            $category = 'rice';
        } elseif (str_contains($cropLower, 'wheat') || str_contains($cropLower, 'গম')) {
            $category = 'wheat';
        } elseif (str_contains($cropLower, 'tomato') || str_contains($cropLower, 'potato') || 
                  str_contains($cropLower, 'brinjal') || str_contains($cropLower, 'সবজি')) {
            $category = 'vegetables';
        } elseif (str_contains($cropLower, 'mango') || str_contains($cropLower, 'banana') || 
                  str_contains($cropLower, 'ফল')) {
            $category = 'fruits';
        }

        return [
            'id' => 'fallback_' . $category,
            'url' => $fallbacks[$category],
            'thumb' => $fallbacks[$category],
            'small' => $fallbacks[$category],
            'alt' => $cropName,
            'photographer' => 'Unsplash',
            'photographer_url' => 'https://unsplash.com',
            'is_fallback' => true,
        ];
    }

    /**
     * Trigger download tracking (Unsplash API requirement)
     */
    public function trackDownload(string $downloadLocation): void
    {
        try {
            Http::withHeaders([
                'Authorization' => 'Client-ID ' . $this->accessKey,
            ])->get($downloadLocation);
        } catch (\Exception $e) {
            Log::warning('Unsplash download tracking failed', ['error' => $e->getMessage()]);
        }
    }
}
