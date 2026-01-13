<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use App\Models\User;
use App\Models\ConsultationFeedback;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExpertController extends Controller
{
    /**
     * Get list of all active experts
     * GET /api/experts
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Expert::with(['user.profile'])
                ->whereHas('user', function ($q) {
                    $q->where('is_active', true)
                      ->where('user_type', 'expert');
                });

            // Filter by specialization
            if ($request->has('specialization') && $request->specialization) {
                $query->where('specialization', $request->specialization);
            }

            // Search by name
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->whereHas('user.profile', function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('full_name_bn', 'like', "%{$search}%");
                });
            }

            // Get paginated results
            $perPage = $request->get('per_page', 20);
            $experts = $query->paginate($perPage);

            // Transform the data
            $transformedExperts = $experts->getCollection()->map(function ($expert) {
                $feedbackStats = ConsultationFeedback::where('expert_id', $expert->user_id)
                    ->selectRaw('AVG(overall_rating) as avg_rating, COUNT(*) as total_reviews')
                    ->first();

                return [
                    'id' => $expert->id,
                    'user_id' => $expert->user_id,
                    'expert_id' => $expert->expert_id,
                    'specialization' => $expert->specialization,
                    'specialization_bn' => $this->getSpecializationBn($expert->specialization),
                    'bio' => $expert->bio,
                    'experience_years' => $expert->experience_years,
                    'consultation_fee' => $expert->consultation_fee,
                    'rating' => round($feedbackStats->avg_rating ?? 0, 1),
                    'total_reviews' => $feedbackStats->total_reviews ?? 0,
                    'total_consultations' => $expert->total_consultations ?? 0,
                    'is_available' => $expert->is_available ?? true,
                    'response_time' => $expert->response_time ?? 'সাধারণত ১ ঘন্টার মধ্যে',
                    'languages' => $expert->languages ?? ['বাংলা'],
                    'user' => [
                        'id' => $expert->user->user_id,
                        'phone' => $expert->user->phone,
                        'profile' => $expert->user->profile ? [
                            'full_name' => $expert->user->profile->full_name,
                            'full_name_bn' => $expert->user->profile->full_name_bn ?? $expert->user->profile->full_name,
                            'profile_photo_url' => $expert->user->profile->profile_photo_url,
                        ] : null,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedExperts,
                'pagination' => [
                    'current_page' => $experts->currentPage(),
                    'last_page' => $experts->lastPage(),
                    'per_page' => $experts->perPage(),
                    'total' => $experts->total(),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch experts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get expert details by ID
     * GET /api/experts/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $expert = Expert::with(['user.profile'])
                ->whereHas('user', function ($q) {
                    $q->where('is_active', true);
                })
                ->find($id);

            if (!$expert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expert not found',
                ], 404);
            }

            // Get feedback stats
            $feedbackStats = ConsultationFeedback::where('expert_id', $expert->user_id)
                ->selectRaw('AVG(overall_rating) as avg_rating, COUNT(*) as total_reviews')
                ->first();

            // Get recent reviews
            $recentReviews = ConsultationFeedback::with(['appointment.farmer.user.profile'])
                ->where('expert_id', $expert->user_id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($feedback) {
                    return [
                        'id' => $feedback->feedback_id,
                        'rating' => $feedback->overall_rating,
                        'comment' => $feedback->review_text,
                        'tags' => $feedback->tags,
                        'created_at' => $feedback->created_at,
                        'farmer' => $feedback->appointment?->farmer?->user?->profile ? [
                            'name' => $feedback->appointment->farmer->user->profile->full_name_bn ?? 
                                     $feedback->appointment->farmer->user->profile->full_name,
                            'avatar' => $feedback->appointment->farmer->user->profile->profile_photo_url,
                        ] : null,
                    ];
                });

            $data = [
                'id' => $expert->expert_id, // Map using correct PK
                'expert_id' => $expert->expert_id, // Ensure explicit ID is available
                'user_id' => $expert->user_id,
                'specialization' => $expert->specialization,
                'specialization_bn' => $this->getSpecializationBn($expert->specialization),
                'bio' => $expert->bio,
                'experience_years' => $expert->experience_years,
                'consultation_fee' => $expert->consultation_fee,
                'rating' => round($feedbackStats->avg_rating ?? 0, 1),
                'total_reviews' => $feedbackStats->total_reviews ?? 0,
                'is_available' => $expert->is_available ?? true,
                'response_time' => $expert->response_time ?? 'সাধারণত ১ ঘন্টার মধ্যে',
                'languages' => $expert->languages ?? ['বাংলা'],
                'qualifications' => $expert->qualifications ?? [],
                'expertise_areas' => $expert->expertise_areas ?? [],
                'total_consultations' => $expert->total_consultations ?? 0,
                'recent_feedbacks' => $recentReviews,
                'user' => [
                    'id' => $expert->user->user_id,
                    'phone' => $expert->user->phone,
                    'profile' => $expert->user->profile ? [
                        'full_name' => $expert->user->profile->full_name,
                        'full_name_bn' => $expert->user->profile->full_name_bn ?? $expert->user->profile->full_name,
                        'profile_photo_url' => $expert->user->profile->profile_photo_url,
                        'avatar_url' => $expert->user->profile->profile_photo_url,
                    ] : null,
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch expert details',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Bengali name for specialization
     */
    private function getSpecializationBn($specialization): string
    {
        $translations = [
            'crop_disease' => 'ফসলের রোগ',
            'pest_control' => 'কীটপতঙ্গ নিয়ন্ত্রণ',
            'soil_science' => 'মাটি বিজ্ঞান',
            'irrigation' => 'সেচ ব্যবস্থা',
            'horticulture' => 'উদ্যানতত্ত্ব',
            'livestock' => 'পশুপালন',
            'fisheries' => 'মৎস্য চাষ',
            'organic_farming' => 'জৈব চাষ',
            'seed_production' => 'বীজ উৎপাদন',
            'agricultural_economics' => 'কৃষি অর্থনীতি',
        ];

        return $translations[$specialization] ?? $specialization;
    }
}
