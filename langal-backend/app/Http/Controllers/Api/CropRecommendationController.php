<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CropRecommendation;
use App\Models\FarmerSelectedCrop;
use App\Services\OpenAIService;
use App\Services\UnsplashService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CropRecommendationController extends Controller
{
    protected OpenAIService $openAIService;
    protected UnsplashService $unsplashService;

    public function __construct(OpenAIService $openAIService, UnsplashService $unsplashService)
    {
        $this->openAIService = $openAIService;
        $this->unsplashService = $unsplashService;
    }

    /**
     * Get available seasons
     */
    public function getSeasons(): JsonResponse
    {
        $seasons = [
            [
                'key' => 'rabi',
                'name_en' => 'Rabi Season',
                'name_bn' => 'রবি মৌসুম',
                'period' => '১৬ অক্টোবর - ১৫ মার্চ',
                'period_en' => 'Oct 16 - Mar 15',
                'description_bn' => 'শীতকালীন ফসল - গম, সরিষা, আলু, মসুর, ছোলা, মটর, টমেটো, ফুলকপি, বাঁধাকপি ইত্যাদি',
                'color' => '#FFB6C1', // Light pink
            ],
            [
                'key' => 'kharif1',
                'name_en' => 'Kharif-1 Season',
                'name_bn' => 'খরিফ-১ মৌসুম',
                'period' => '১৬ মার্চ - ১৫ জুলাই',
                'period_en' => 'Mar 16 - Jul 15',
                'description_bn' => 'গ্রীষ্মকালীন ফসল - আউশ ধান, পাট, ভুট্টা, তিল, মুগডাল, শসা, করলা ইত্যাদি',
                'color' => '#FFFACD', // Light yellow
            ],
            [
                'key' => 'kharif2',
                'name_en' => 'Kharif-2 Season',
                'name_bn' => 'খরিফ-২ মৌসুম',
                'period' => '১৬ জুলাই - ১৫ অক্টোবর',
                'period_en' => 'Jul 16 - Oct 15',
                'description_bn' => 'বর্ষাকালীন ফসল - আমন ধান, পাট, শাকসবজি ইত্যাদি',
                'color' => '#87CEEB', // Light blue
            ],
        ];

        // Auto-detect current season
        $currentSeason = $this->getCurrentSeason();

        return response()->json([
            'success' => true,
            'seasons' => $seasons,
            'current_season' => $currentSeason,
        ]);
    }

    /**
     * Get available crop types
     */
    public function getCropTypes(): JsonResponse
    {
        $types = [
            ['key' => 'all', 'name_en' => 'All Types', 'name_bn' => 'সব ধরন', 'icon' => '🌱'],
            ['key' => 'rice', 'name_en' => 'Rice/Paddy', 'name_bn' => 'ধান', 'icon' => '🌾'],
            ['key' => 'vegetables', 'name_en' => 'Vegetables', 'name_bn' => 'সবজি', 'icon' => '🥬'],
            ['key' => 'fruits', 'name_en' => 'Fruits', 'name_bn' => 'ফল', 'icon' => '🍎'],
            ['key' => 'spices', 'name_en' => 'Spices', 'name_bn' => 'মসলা', 'icon' => '🌶️'],
            ['key' => 'pulses', 'name_en' => 'Pulses/Lentils', 'name_bn' => 'ডাল', 'icon' => '🫘'],
            ['key' => 'oilseeds', 'name_en' => 'Oilseeds', 'name_bn' => 'তৈলবীজ', 'icon' => '🌻'],
            ['key' => 'fiber', 'name_en' => 'Fiber Crops', 'name_bn' => 'আঁশ ফসল', 'icon' => '🧵'],
            ['key' => 'wheat', 'name_en' => 'Wheat', 'name_bn' => 'গম', 'icon' => '🌾'],
            ['key' => 'maize', 'name_en' => 'Maize/Corn', 'name_bn' => 'ভুট্টা', 'icon' => '🌽'],
            ['key' => 'tubers', 'name_en' => 'Tubers', 'name_bn' => 'কন্দ ফসল', 'icon' => '🥔'],
        ];

        return response()->json([
            'success' => true,
            'crop_types' => $types,
        ]);
    }

    /**
     * Generate AI-based crop recommendations
     */
    public function generate(Request $request): JsonResponse
    {
        // Increase execution time to 300 seconds (5 minutes) for AI and Image generation
        set_time_limit(300);

        $validator = Validator::make($request->all(), [
            'location' => 'required|string|max:255',
            'division' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'upazila' => 'nullable|string|max:100',
            'season' => 'required|in:rabi,kharif1,kharif2',
            'crop_type' => 'required|string|max:50',
            'land_size' => 'nullable|numeric|min:0',
            'land_unit' => 'nullable|in:acre,bigha,katha',
            'budget' => 'nullable|numeric|min:0',
            'soil_type' => 'nullable|string|max:50',
            'weather_data' => 'nullable|array',
            'weather_data.temperature' => 'nullable|numeric',
            'weather_data.humidity' => 'nullable|numeric',
            'weather_data.rainfall_chance' => 'nullable|numeric',
            'weather_data.description' => 'nullable|string',
            'weather_data.forecast' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Get AI recommendations with weather data
            $inputData = $request->all();
            $aiResult = $this->openAIService->generateCropRecommendation($inputData);
            
            $recommendations = $aiResult['recommendations'] ?? [];
            $crops = $recommendations['crops'] ?? [];

            // Get images for each crop from Unsplash
            $cropsWithImages = [];
            foreach ($crops as $crop) {
                $cropName = $crop['name'] ?? '';
                $image = $this->unsplashService->searchCropImage($cropName, $crop['name_bn'] ?? '');
                
                $crop['image'] = $image;
                $cropsWithImages[] = $crop;
            }

            // Get user ID if authenticated
            $farmerId = null;
            if (Auth::check()) {
                $farmerId = Auth::id();
            }

            // Save recommendation to database if user is authenticated
            $savedRecommendation = null;
            if ($farmerId) {
                $savedRecommendation = CropRecommendation::create([
                    'farmer_id' => $farmerId,
                    'location' => $request->input('location'),
                    'division' => $request->input('division'),
                    'district' => $request->input('district'),
                    'upazila' => $request->input('upazila'),
                    'season' => $request->input('season'),
                    'crop_type' => $request->input('crop_type'),
                    'land_size' => $request->input('land_size'),
                    'land_unit' => $request->input('land_unit', 'bigha'),
                    'budget' => $request->input('budget'),
                    'soil_type' => $request->input('soil_type'),
                    'recommended_crops' => $cropsWithImages,
                    'ai_model' => $aiResult['model'] ?? 'gpt-4o-mini',
                    'ai_prompt' => $aiResult['prompt'] ?? '',
                    'ai_response' => $aiResult['raw_response'] ?? '',
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Recommendations generated successfully',
                'recommendation_id' => $savedRecommendation?->recommendation_id,
                'data' => [
                    'crops' => $cropsWithImages,
                    'season_tips' => $recommendations['season_tips'] ?? '',
                    'weather_advisory' => $recommendations['weather_advisory'] ?? '',
                ],
                'meta' => [
                    'model' => $aiResult['model'] ?? 'fallback',
                    'is_fallback' => $aiResult['is_fallback'] ?? false,
                    'location' => $request->input('location'),
                    'season' => $request->input('season'),
                    'crop_type' => $request->input('crop_type'),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Crop recommendation generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate recommendations. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get user's recommendation history
     */
    public function history(Request $request): JsonResponse
    {
        $farmerId = Auth::id();

        if (!$farmerId) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $recommendations = CropRecommendation::where('farmer_id', $farmerId)
            ->orderBy('created_at', 'desc')
            ->limit($request->input('limit', 10))
            ->get();

        return response()->json([
            'success' => true,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Get a single recommendation
     */
    public function show(int $id): JsonResponse
    {
        $recommendation = CropRecommendation::with('selectedCrops')->find($id);

        if (!$recommendation) {
            return response()->json([
                'success' => false,
                'message' => 'Recommendation not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'recommendation' => $recommendation,
        ]);
    }

    /**
     * Select crops from recommendations
     */
    public function selectCrops(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'recommendation_id' => 'nullable|integer|exists:crop_recommendations,recommendation_id',
            'crops' => 'required|array|min:1',
            'crops.*.name' => 'required|string',
            'crops.*.name_bn' => 'required|string',
            'crops.*.crop_type' => 'nullable|string',
            'crops.*.duration_days' => 'nullable|integer',
            'crops.*.yield_per_bigha' => 'nullable|string',
            'crops.*.market_price' => 'nullable|string',
            'crops.*.water_requirement' => 'nullable|in:low,medium,high',
            'crops.*.difficulty' => 'nullable|in:easy,medium,hard',
            'crops.*.description_bn' => 'nullable|string',
            'crops.*.season' => 'nullable|string',
            'crops.*.image_url' => 'nullable|string',
            'crops.*.estimated_cost' => 'nullable|numeric',
            'crops.*.estimated_profit' => 'nullable|numeric',
            'crops.*.cultivation_plan' => 'nullable|array',
            'crops.*.cost_breakdown' => 'nullable|array',
            'crops.*.fertilizer_schedule' => 'nullable|array',
            'land_size' => 'nullable|numeric',
            'land_unit' => 'nullable|in:acre,bigha,katha',
            'start_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $farmerId = Auth::id();

        if (!$farmerId) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        try {
            DB::beginTransaction();

            $selectedCrops = [];
            $startDate = $request->input('start_date') ? new \DateTime($request->input('start_date')) : new \DateTime();

            foreach ($request->input('crops') as $cropData) {
                // Calculate expected harvest date based on duration
                $duration = $cropData['duration_days'] ?? 90;
                $harvestDate = (clone $startDate)->modify("+{$duration} days");

                $selectedCrop = FarmerSelectedCrop::create([
                    'farmer_id' => $farmerId,
                    'recommendation_id' => $request->input('recommendation_id'),
                    'crop_name' => $cropData['name'],
                    'crop_name_bn' => $cropData['name_bn'],
                    'crop_type' => $cropData['crop_type'] ?? null,
                    'duration_days' => $cropData['duration_days'] ?? $duration,
                    'yield_per_bigha' => $cropData['yield_per_bigha'] ?? null,
                    'market_price' => $cropData['market_price'] ?? null,
                    'water_requirement' => $cropData['water_requirement'] ?? null,
                    'difficulty' => $cropData['difficulty'] ?? null,
                    'description_bn' => $cropData['description_bn'] ?? null,
                    'season' => $cropData['season'] ?? null,
                    'image_url' => $cropData['image_url'] ?? ($cropData['image']['url'] ?? null),
                    'start_date' => $startDate,
                    'expected_harvest_date' => $harvestDate,
                    'land_size' => $request->input('land_size'),
                    'land_unit' => $request->input('land_unit', 'bigha'),
                    'estimated_cost' => $cropData['estimated_cost'] ?? $cropData['cost_per_bigha'] ?? null,
                    'estimated_profit' => $cropData['estimated_profit'] ?? $cropData['profit_per_bigha'] ?? null,
                    'status' => 'planned',
                    'cultivation_plan' => $cropData['cultivation_plan'] ?? null,
                    'cost_breakdown' => $cropData['cost_breakdown'] ?? null,
                    'fertilizer_schedule' => $cropData['fertilizer_schedule'] ?? null,
                    'notifications_enabled' => true,
                ]);

                $selectedCrops[] = $selectedCrop;

                // Create initial notification for the farmer
                $this->createCropNotification(
                    $farmerId,
                    "আপনি {$cropData['name_bn']} চাষের জন্য নির্বাচন করেছেন।",
                    "শীঘ্রই আপনার চাষাবাদ শুরু করুন। বিস্তারিত পরিকল্পনা দেখতে অ্যাপে যান।",
                    $selectedCrop->selection_id
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Crops selected successfully',
                'selected_crops' => $selectedCrops,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Crop selection failed', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to select crops',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get farmer's selected/active crops
     */
    public function getSelectedCrops(Request $request): JsonResponse
    {
        $farmerId = Auth::id();

        if (!$farmerId) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $status = $request->input('status'); // planned, active, completed, cancelled
        
        $query = FarmerSelectedCrop::where('farmer_id', $farmerId)
            ->with('recommendation')
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        $selectedCrops = $query->get();

        return response()->json([
            'success' => true,
            'selected_crops' => $selectedCrops,
        ]);
    }

    /**
     * Update selected crop status
     */
    public function updateCropStatus(Request $request, int $selectionId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:planned,active,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $farmerId = Auth::id();
        $crop = FarmerSelectedCrop::where('selection_id', $selectionId)
            ->where('farmer_id', $farmerId)
            ->first();

        if (!$crop) {
            return response()->json([
                'success' => false,
                'message' => 'Crop selection not found',
            ], 404);
        }

        $oldStatus = $crop->status;
        $crop->status = $request->input('status');
        
        // If completed, save actual harvest date
        if ($crop->status === 'completed' && !$crop->actual_harvest_date) {
            $crop->actual_harvest_date = now()->format('Y-m-d');
            $crop->progress_percentage = 100;
        }
        
        $crop->save();

        // Create notification for status change
        if ($oldStatus !== $crop->status) {
            $statusBangla = [
                'planned' => 'পরিকল্পিত',
                'active' => 'সক্রিয়',
                'completed' => 'সম্পন্ন',
                'cancelled' => 'বাতিল'
            ];
            $this->createCropNotification(
                $farmerId,
                "{$crop->crop_name_bn} ফসলের স্ট্যাটাস পরিবর্তিত হয়েছে",
                "আপনার {$crop->crop_name_bn} ফসলের স্ট্যাটাস {$statusBangla[$oldStatus]} থেকে {$statusBangla[$crop->status]} এ পরিবর্তিত হয়েছে।",
                $selectionId
            );
        }

        // Send notification based on status change
        $statusMessages = [
            'active' => "আপনার {$crop->crop_name_bn} চাষ শুরু হয়েছে!",
            'completed' => "অভিনন্দন! {$crop->crop_name_bn} চাষ সফলভাবে সম্পন্ন হয়েছে।",
            'cancelled' => "{$crop->crop_name_bn} চাষ বাতিল করা হয়েছে।",
        ];

        if (isset($statusMessages[$request->input('status')])) {
            $this->createCropNotification(
                $farmerId,
                $statusMessages[$request->input('status')],
                '',
                $selectionId
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'crop' => $crop,
        ]);
    }
    /**
     * Remove/Delete a selected crop
     */
    public function removeCrop(int $selectionId): JsonResponse
    {
        $farmerId = Auth::id();
        $crop = FarmerSelectedCrop::where('selection_id', $selectionId)
            ->where('farmer_id', $farmerId)
            ->first();

        if (!$crop) {
            return response()->json([
                'success' => false,
                'message' => 'Crop selection not found',
            ], 404);
        }

        $cropName = $crop->crop_name_bn;
        $crop->delete();

        return response()->json([
            'success' => true,
            'message' => 'Crop removed successfully',
            'crop_name' => $cropName,
        ]);
    }

    /**
     * Get detailed information about a selected crop with progress
     */
    public function getCropDetails(int $selectionId): JsonResponse
    {
        $farmerId = Auth::id();
        $crop = FarmerSelectedCrop::where('selection_id', $selectionId)
            ->where('farmer_id', $farmerId)
            ->first();

        if (!$crop) {
            return response()->json([
                'success' => false,
                'message' => 'Crop not found',
            ], 404);
        }

        // Calculate progress
        $startDate = new \DateTime($crop->start_date);
        $harvestDate = new \DateTime($crop->expected_harvest_date);
        $today = new \DateTime();

        $totalDays = $startDate->diff($harvestDate)->days;
        $elapsedDays = $startDate->diff($today)->days;
        $remainingDays = $today->diff($harvestDate)->days;

        // Progress percentage
        $progressPercentage = $totalDays > 0 ? min(100, max(0, ($elapsedDays / $totalDays) * 100)) : 0;

        // Find next action from cultivation plan
        $nextAction = null;
        $nextActionDate = null;
        $nextActionDescription = null;
        
        if ($crop->cultivation_plan && is_array($crop->cultivation_plan)) {
            foreach ($crop->cultivation_plan as $phase) {
                // Parse day range (e.g., "Day 10-20")
                if (preg_match('/Day (\d+)/', $phase['days'], $matches)) {
                    $phaseDay = (int) $matches[1];
                    if ($elapsedDays < $phaseDay) {
                        $daysUntil = $phaseDay - $elapsedDays;
                        $nextAction = [
                            'phase' => $phase['phase'],
                            'days_until' => $daysUntil,
                            'tasks' => $phase['tasks'] ?? [],
                        ];
                        // Calculate next action date
                        $nextActionDate = (clone $startDate)->modify("+{$phaseDay} days")->format('Y-m-d');
                        $nextActionDescription = $phase['phase'];
                        break;
                    }
                }
            }
        }

        // Update progress in database
        $crop->progress_percentage = round($progressPercentage, 2);
        $crop->next_action_date = $nextActionDate;
        $crop->next_action_description = $nextActionDescription;
        $crop->save();

        return response()->json([
            'success' => true,
            'crop' => $crop,
            'progress' => [
                'percentage' => round($progressPercentage, 1),
                'elapsed_days' => $elapsedDays,
                'remaining_days' => $remainingDays > 0 ? $remainingDays : 0,
                'total_days' => $totalDays,
                'is_overdue' => $today > $harvestDate,
            ],
            'next_action' => $nextAction,
        ]);
    }
    /**
     * Get crop image from Unsplash
     */
    public function getCropImage(Request $request): JsonResponse
    {
        $cropName = $request->input('crop_name');
        $cropNameBn = $request->input('crop_name_bn', '');

        if (!$cropName) {
            return response()->json([
                'success' => false,
                'message' => 'Crop name is required',
            ], 400);
        }

        $image = $this->unsplashService->searchCropImage($cropName, $cropNameBn);

        return response()->json([
            'success' => true,
            'image' => $image,
        ]);
    }

    /**
     * Get current season based on date
     */
    protected function getCurrentSeason(): string
    {
        $now = new \DateTime();
        $month = (int) $now->format('n');
        $day = (int) $now->format('j');

        // Rabi: Oct 16 - Mar 15
        if (($month == 10 && $day >= 16) || $month == 11 || $month == 12 || 
            $month == 1 || $month == 2 || ($month == 3 && $day <= 15)) {
            return 'rabi';
        }
        // Kharif-1: Mar 16 - Jul 15
        elseif (($month == 3 && $day >= 16) || $month == 4 || $month == 5 || 
                $month == 6 || ($month == 7 && $day <= 15)) {
            return 'kharif1';
        }
        // Kharif-2: Jul 16 - Oct 15
        else {
            return 'kharif2';
        }
    }

    /**
     * Create a crop-related notification
     */
    protected function createCropNotification(int $recipientId, string $title, string $message, int $relatedId): void
    {
        try {
            DB::table('notifications')->insert([
                'notification_type' => 'crop_reminder',
                'title' => $title,
                'message' => $message,
                'recipient_id' => $recipientId,
                'related_entity_id' => (string) $relatedId,
                'is_read' => false,
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::warning('Failed to create crop notification', ['error' => $e->getMessage()]);
        }
    }
}
