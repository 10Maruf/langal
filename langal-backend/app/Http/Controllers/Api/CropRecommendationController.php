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
            
            // Only set start date if explicitly provided. Otherwise null for 'planned' status.
            $inputStartDate = $request->input('start_date');
            $startDate = $inputStartDate ? new \DateTime($inputStartDate) : null;

            foreach ($request->input('crops') as $cropData) {
                // Calculate expected harvest date based on duration
                $duration = $cropData['duration_days'] ?? 90;
                
                $harvestDate = null;
                $nextNotificationDate = null;
                
                if ($startDate) {
                    $harvestDate = (clone $startDate)->modify("+{$duration} days");

                    // Calculate next notification date from cultivation plan
                    if (!empty($cropData['cultivation_plan']) && is_array($cropData['cultivation_plan'])) {
                        foreach ($cropData['cultivation_plan'] as $phase) {
                            if (isset($phase['days'])) {
                                // Extract day number (e.g., "Day 1" or "Day 1-3")
                                if (preg_match('/Day (\d+)/i', $phase['days'], $matches)) {
                                    $dayOffset = (int)$matches[1];
                                    // If day is 0 or 1, set for start date, else add offset
                                    $nextNotificationDate = (clone $startDate)->modify("+" . max(0, $dayOffset - 1) . " days");
                                    break; // Found the first phase
                                }
                            }
                        }
                    }
                }

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
                    'next_notification_date' => $nextNotificationDate,
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
        
        // If starting cultivation (becoming active), reset start date to now
        if ($crop->status === 'active' && $oldStatus === 'planned') {
            $startDate = now();
            $crop->start_date = $startDate->format('Y-m-d H:i:s');
            
            // Recalculate expected harvest date based on duration
            if ($crop->duration_days) {
                $harvestDate = (clone $startDate)->modify("+{$crop->duration_days} days");
                $crop->expected_harvest_date = $harvestDate->format('Y-m-d H:i:s');
            }
            
            // Recalculate next notifications based on new start date
             if ($crop->cultivation_plan && is_array($crop->cultivation_plan)) {
                $nextNotificationDate = null;
                $nextActionDescription = null;
                
                foreach ($crop->cultivation_plan as $phase) {
                    if (isset($phase['days'])) {
                        if (preg_match('/Day (\d+)/i', $phase['days'], $matches)) {
                            $dayOffset = (int)$matches[1];
                            $nextNotificationDate = (clone $startDate)->modify("+" . max(0, $dayOffset - 1) . " days");
                            $nextActionDescription = $phase['phase'];
                            break; 
                        }
                    }
                }
                
                $crop->next_notification_date = $nextNotificationDate;
                $crop->next_action_description = $nextActionDescription;
                
                // Set initial progress
                $crop->progress_percentage = 0;
            }
        }

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
        $today = new \DateTime();
        $today->setTime(0, 0, 0);
        
        $startDate = null;
        $harvestDate = null;

        if ($crop->start_date && $crop->expected_harvest_date) {
            $startDate = new \DateTime($crop->start_date);
            $startDate->setTime(0, 0, 0);
            
            $harvestDate = new \DateTime($crop->expected_harvest_date);
            $harvestDate->setTime(0, 0, 0);

            $totalDays = $startDate->diff($harvestDate)->days;
            
            if ($today < $startDate) {
                // Future start date
                $elapsedDays = 0;
            } else {
                $elapsedDays = $startDate->diff($today)->days;
            }
            
            $remainingDays = $today->diff($harvestDate)->days; // Absolute diff
            
            // Progress percentage
            $progressPercentage = $totalDays > 0 ? min(100, max(0, ($elapsedDays / $totalDays) * 100)) : 0;
        } else {
            // Not started yet
            $totalDays = $crop->duration_days;
            $elapsedDays = 0;
            $remainingDays = $totalDays;
            $progressPercentage = 0;
        }

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
                        if ($startDate) {
                            $nextActionDate = (clone $startDate)->modify("+{$phaseDay} days")->format('Y-m-d');
                        }
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

        // Enrich cultivation_plan with fertilizer data
        $enrichedCultivationPlan = $this->enrichCultivationPlanWithFertilizers($crop);

        return response()->json([
            'success' => true,
            'crop' => array_merge($crop->toArray(), [
                'cultivation_plan' => $enrichedCultivationPlan
            ]),
            'progress' => [
                'percentage' => round($progressPercentage, 1),
                'elapsed_days' => $elapsedDays,
                'remaining_days' => $remainingDays > 0 ? $remainingDays : 0,
                'total_days' => $totalDays,
                'is_overdue' => $harvestDate ? ($today > $harvestDate) : false,
            ],
            'next_action' => $nextAction,
        ]);
    }

    /**
     * Enrich cultivation plan with fertilizer schedule data
     */
    private function enrichCultivationPlanWithFertilizers($crop): array
    {
        $cultivationPlan = $crop->cultivation_plan ?? [];
        $fertilizerSchedule = $crop->fertilizer_schedule ?? [];

        if (empty($cultivationPlan) || empty($fertilizerSchedule)) {
            return $cultivationPlan;
        }

        // Match fertilizers to cultivation phases based on timing keywords
        foreach ($cultivationPlan as &$phase) {
            $phaseName = $phase['phase'] ?? '';
            $matchedFertilizers = [];

            foreach ($fertilizerSchedule as $schedule) {
                $timing = $schedule['timing'] ?? '';
                
                // Check if timing mentions this phase (simple keyword matching)
                if (
                    stripos($timing, $phaseName) !== false ||
                    stripos($phaseName, 'বপন') !== false && stripos($timing, 'বপন') !== false ||
                    stripos($phaseName, 'সার') !== false && stripos($timing, 'সার') !== false ||
                    stripos($phaseName, 'Growth') !== false && stripos($timing, 'Growth') !== false
                ) {
                    $matchedFertilizers = $schedule['fertilizers'] ?? [];
                    break;
                }
            }

            // Add fertilizers and extended info to phase
            $phase['fertilizers'] = $matchedFertilizers;
            
            // Add detailed info based on phase type
            $phase['details'] = $this->getPhaseDetails($phaseName);
            $phase['medicines'] = $this->getPhaseMedicines($phaseName);
            $phase['advice'] = $this->getPhaseAdvice($phaseName);
        }

        return $cultivationPlan;
    }

    /**
     * Get detailed instructions for a phase
     */
    private function getPhaseDetails(string $phaseName): string
    {
        $details = [
            'বপন' => 'জমি ভালোভাবে চাষ দিয়ে মাটি ঝুরঝুরে করে নিন। সারি থেকে সারির দূরত্ব ২৫-৩০ সেমি এবং গাছ থেকে গাছের দূরত্ব ১৫-২০ সেমি রাখুন। বীজ ২-৩ সেমি গভীরে বপন করুন।',
            'Growth' => 'নিয়মিত সেচ দিন এবং আগাছা পরিষ্কার করুন। গাছের গোড়ায় মাটি তুলে দিন। রোগ ও পোকামাকড়ের আক্রমণ লক্ষ্য করুন এবং প্রয়োজনে ব্যবস্থা নিন।',
            'পরিচর্যা' => 'নিয়মিত পরিদর্শন করুন এবং প্রয়োজনীয় যত্ন নিন। সেচ, আগাছা পরিষ্কার এবং মালচিং করুন।',
            'কাটা' => 'ফসল পরিপক্ক হলে সকালে বা বিকেলে সংগ্রহ করুন। রোদের তাপ এড়িয়ে সংগ্রহ করা ভালো। পরিচ্ছন্ন যন্ত্র ব্যবহার করুন।',
            'সংগ্রহ' => 'ফসল সাবধানে সংগ্রহ করুন এবং পরিষ্কার স্থানে রাখুন। দ্রুত বাজারজাত করুন বা সংরক্ষণের ব্যবস্থা করুন।',
        ];

        foreach ($details as $key => $value) {
            if (stripos($phaseName, $key) !== false) {
                return $value;
            }
        }

        return 'এই পর্যায়ে নিয়মিত পরিচর্যা করুন এবং ফসলের অবস্থা পর্যবেক্ষণ করুন।';
    }

    /**
     * Get medicines/pesticides for a phase
     */
    private function getPhaseMedicines(string $phaseName): array
    {
        $medicines = [
            'বপন' => ['ব্যাভিস্টিন (বীজ শোধন)', 'ফুরাডান ৫জি (মাটি শোধন)'],
            'Growth' => ['ইমিডাক্লোপ্রিড ২০ এসএল (পোকা দমন)', 'ম্যানকোজেব ৮০ ডব্লিউপি (রোগ প্রতিরোধ)'],
            'পরিচর্যা' => ['সাইপারমেথ্রিন (পোকা নিয়ন্ত্রণ)', 'কার্বেন্ডাজিম (ছত্রাকনাশক)'],
        ];

        foreach ($medicines as $key => $value) {
            if (stripos($phaseName, $key) !== false) {
                return $value;
            }
        }

        return [];
    }

    /**
     * Get advice/tips for a phase
     */
    private function getPhaseAdvice(string $phaseName): array
    {
        $advice = [
            'বপন' => [
                'মাটিতে পর্যাপ্ত রস থাকলে বপন করুন',
                'বীজের হার সঠিক রাখুন - অতিরিক্ত ঘন বপন করবেন না',
                'সকাল বা বিকেলে বপন করা ভালো',
            ],
            'Growth' => [
                'প্রতি ৭-১০ দিন পর পর গাছ পরীক্ষা করুন',
                'পানি জমতে দেবেন না, নিষ্কাশনের ব্যবস্থা রাখুন',
                'হলুদ বা রোগাক্রান্ত পাতা সরিয়ে ফেলুন',
            ],
            'পরিচর্যা' => [
                'আগাছা নিয়মিত পরিষ্কার করুন',
                'অতিরিক্ত সার প্রয়োগ করবেন না',
                'রোগবালাই দেখা দিলে দ্রুত ব্যবস্থা নিন',
            ],
            'কাটা' => [
                'সঠিক সময়ে সংগ্রহ করুন - কাঁচা বা অতিরিক্ত পাকা হলে মূল্য কমে যায়',
                'পরিষ্কার এবং ধারালো যন্ত্র ব্যবহার করুন',
                'ভাঙা বা ক্ষতিগ্রস্ত ফসল আলাদা করুন',
            ],
            'সংগ্রহ' => [
                'ছায়ায় রাখুন এবং দ্রুত বাজারে নিয়ে যান',
                'পরিচ্ছন্ন ঝুড়ি বা পাত্র ব্যবহার করুন',
                'ফসল মাটিতে ফেলে রাখবেন না',
            ],
        ];

        foreach ($advice as $key => $value) {
            if (stripos($phaseName, $key) !== false) {
                return $value;
            }
        }

        return [
            'নিয়মিত পর্যবেক্ষণ করুন',
            'প্রয়োজনে বিশেষজ্ঞের পরামর্শ নিন',
        ];
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
