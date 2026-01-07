<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultationAppointment;
use App\Models\ConsultationFeedback;
use App\Models\Expert;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    /**
     * Submit feedback for an appointment
     * POST /api/appointments/{id}/feedback
     */
    public function store(Request $request, int $appointmentId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'overall_rating' => 'required|integer|min:1|max:5',
            'communication_rating' => 'nullable|integer|min:1|max:5',
            'knowledge_rating' => 'nullable|integer|min:1|max:5',
            'helpfulness_rating' => 'nullable|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:1000',
            'review_text_bn' => 'nullable|string|max:1000',
            'is_anonymous' => 'nullable|boolean',
            'would_recommend' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();

            $appointment = ConsultationAppointment::findOrFail($appointmentId);

            // Only farmer can give feedback
            if ($user->user_id !== $appointment->farmer_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only the farmer can submit feedback',
                ], 403);
            }

            // Check if appointment is completed
            if ($appointment->status !== ConsultationAppointment::STATUS_COMPLETED) {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only submit feedback for completed appointments',
                    'message_bn' => 'শুধুমাত্র সম্পন্ন পরামর্শের জন্য রেটিং দেওয়া যায়',
                ], 400);
            }

            // Check if feedback already exists
            $existingFeedback = ConsultationFeedback::where('appointment_id', $appointmentId)->first();
            if ($existingFeedback) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feedback already submitted for this appointment',
                    'message_bn' => 'এই পরামর্শের জন্য ইতিমধ্যে রেটিং দেওয়া হয়েছে',
                ], 400);
            }

            DB::beginTransaction();

            $feedback = ConsultationFeedback::create([
                'appointment_id' => $appointmentId,
                'farmer_id' => $user->user_id,
                'expert_id' => $appointment->expert_id,
                'overall_rating' => $request->overall_rating,
                'communication_rating' => $request->communication_rating,
                'knowledge_rating' => $request->knowledge_rating,
                'helpfulness_rating' => $request->helpfulness_rating,
                'review_text' => $request->review_text,
                'review_text_bn' => $request->review_text_bn,
                'is_anonymous' => $request->is_anonymous ?? false,
                'would_recommend' => $request->would_recommend ?? true,
                'tags' => $request->tags ? json_encode($request->tags) : null,
            ]);

            // Update expert's rating
            $this->updateExpertRating($appointment->expert_id);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Feedback submitted successfully',
                'message_bn' => 'রেটিং সফলভাবে জমা হয়েছে',
                'data' => $feedback,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit feedback',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get feedback for an appointment
     * GET /api/appointments/{id}/feedback
     */
    public function show(int $appointmentId): JsonResponse
    {
        try {
            $user = Auth::user();

            $appointment = ConsultationAppointment::findOrFail($appointmentId);

            // Check access
            if ($user->user_id !== $appointment->farmer_id && $user->user_id !== $appointment->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            $feedback = ConsultationFeedback::where('appointment_id', $appointmentId)
                ->with(['farmer.profile'])
                ->first();

            if (!$feedback) {
                return response()->json([
                    'success' => false,
                    'message' => 'No feedback found for this appointment',
                ], 404);
            }

            // Hide farmer info if anonymous
            if ($feedback->is_anonymous && $user->user_id === $appointment->expert_id) {
                $feedback->makeHidden(['farmer', 'farmer_id']);
            }

            return response()->json([
                'success' => true,
                'data' => $feedback,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get feedback',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all reviews for an expert
     * GET /api/experts/{expertId}/reviews
     */
    public function getExpertReviews(Request $request, $expertId): JsonResponse
    {
        try {
            $expertId = (int) $expertId;
            $perPage = $request->query('per_page', 10);
            $rating = $request->query('rating'); // Filter by rating

            $query = ConsultationFeedback::where('expert_id', $expertId)
                ->with(['farmer.profile', 'appointment'])
                ->orderBy('created_at', 'desc');

            if ($rating) {
                $query->where('overall_rating', $rating);
            }

            $reviews = $query->paginate($perPage);

            // Hide farmer info for anonymous reviews
            $reviews->getCollection()->transform(function ($review) {
                if ($review->is_anonymous) {
                    $review->makeHidden(['farmer', 'farmer_id']);
                    $review->farmer_name = 'বেনামী';
                }
                return $review;
            });

            // Get rating statistics
            $stats = ConsultationFeedback::where('expert_id', $expertId)
                ->selectRaw('
                    COUNT(*) as total_reviews,
                    AVG(overall_rating) as average_rating,
                    SUM(CASE WHEN overall_rating = 5 THEN 1 ELSE 0 END) as five_star,
                    SUM(CASE WHEN overall_rating = 4 THEN 1 ELSE 0 END) as four_star,
                    SUM(CASE WHEN overall_rating = 3 THEN 1 ELSE 0 END) as three_star,
                    SUM(CASE WHEN overall_rating = 2 THEN 1 ELSE 0 END) as two_star,
                    SUM(CASE WHEN overall_rating = 1 THEN 1 ELSE 0 END) as one_star,
                    SUM(CASE WHEN would_recommend = 1 THEN 1 ELSE 0 END) as would_recommend_count
                ')
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'reviews' => $reviews,
                    'statistics' => $stats,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get reviews',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update expert's average rating
     */
    private function updateExpertRating(int $expertId): void
    {
        $stats = ConsultationFeedback::where('expert_id', $expertId)
            ->selectRaw('AVG(overall_rating) as avg_rating, COUNT(*) as total_reviews')
            ->first();

        Expert::where('user_id', $expertId)->update([
            'rating' => round($stats->avg_rating, 2),
            'total_consultations' => $stats->total_reviews,
        ]);
    }

    /**
     * Report a review
     * POST /api/reviews/{id}/report
     */
    public function reportReview(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();

            $feedback = ConsultationFeedback::findOrFail($id);

            // Only expert can report reviews about them
            if ($user->user_id !== $feedback->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $feedback->update([
                'is_reported' => true,
                'report_reason' => $request->reason,
                'reported_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review reported successfully',
                'message_bn' => 'রিভিউ রিপোর্ট করা হয়েছে',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to report review',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
