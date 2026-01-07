<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultationAppointment;
use App\Models\ConsultationCall;
use App\Services\AgoraService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CallController extends Controller
{
    protected $agoraService;
    protected $notificationService;

    public function __construct(AgoraService $agoraService, NotificationService $notificationService)
    {
        $this->agoraService = $agoraService;
        $this->notificationService = $notificationService;
    }

    /**
     * Generate Agora token for call
     * POST /api/calls/token
     */
    public function generateToken(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|integer|exists:consultation_appointments,appointment_id',
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

            $appointment = ConsultationAppointment::findOrFail($request->appointment_id);

            // Check access
            if ($user->user_id !== $appointment->farmer_id && $user->user_id !== $appointment->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            // Check if appointment is confirmed
            if ($appointment->status !== ConsultationAppointment::STATUS_CONFIRMED) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment must be confirmed to join call',
                    'message_bn' => 'কল করতে পরামর্শ নিশ্চিত হতে হবে',
                ], 400);
            }

            // Generate Agora token with UID 0 for flexibility
            // UID 0 allows any client to join with any UID
            $channelName = $appointment->agora_channel_name;
            $uid = 0; // Use 0 to allow any UID to join
            $role = 'publisher'; // Both can publish
            $expireTime = 3600; // 1 hour

            $token = $this->agoraService->generateToken($channelName, $uid, $role, $expireTime);

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token,
                    'channel_name' => $channelName,
                    'uid' => $uid,
                    'app_id' => config('services.agora.app_id'),
                    'expire_time' => $expireTime,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate token',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Start a call
     * POST /api/calls/start
     */
    public function startCall(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|integer|exists:consultation_appointments,appointment_id',
            'call_type' => 'required|in:audio,video',
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

            $appointment = ConsultationAppointment::findOrFail($request->appointment_id);

            // Check access
            if ($user->user_id !== $appointment->farmer_id && $user->user_id !== $appointment->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            // Check if there's already an active call
            $existingCall = ConsultationCall::where('appointment_id', $request->appointment_id)
                ->whereIn('call_status', ['ringing', 'ongoing'])
                ->first();

            if ($existingCall) {
                 // Reuse the existing call session instead of blocking
                 // This ensures users can rejoin if they disconnect or refresh
                 $token = $this->agoraService->generateToken(
                    $existingCall->agora_channel,
                    0, // Use UID 0 to allow any UID to join
                    'publisher',
                    3600
                );

                return response()->json([
                    'success' => true,
                    'message' => 'Rejoining active call',
                    'message_bn' => 'চলমান কলে যুক্ত হচ্ছেন',
                    'data' => [
                        'call' => $existingCall,
                        'token' => $token,
                        'channel_name' => $existingCall->agora_channel,
                        'app_id' => config('services.agora.app_id'),
                    ],
                ]);
            }

            // Create call record
            $call = ConsultationCall::create([
                'appointment_id' => $request->appointment_id,
                'caller_id' => $user->user_id,
                'callee_id' => $user->user_id === $appointment->farmer_id 
                    ? $appointment->expert_id 
                    : $appointment->farmer_id,
                'call_type' => $request->call_type,
                'agora_channel' => $appointment->agora_channel_name,
                'call_status' => 'ringing',
                'initiated_at' => now(),
            ]);

            // Generate token for caller with UID 0
            $token = $this->agoraService->generateToken(
                $appointment->agora_channel_name,
                0, // Use UID 0 to allow any UID to join
                'publisher',
                3600
            );

            // Notify receiver
            $receiverId = $call->callee_id;
            $callerName = $user->profile->full_name ?? $user->phone;
            $callTypeLabel = $request->call_type === 'video' ? 'ভিডিও কল' : 'অডিও কল';

            $this->notificationService->sendToUser(
                $receiverId,
                'ইনকামিং কল',
                "{$callerName} আপনাকে {$callTypeLabel} করছেন",
                [
                    'type' => 'incoming_call',
                    'call_id' => $call->call_id,
                    'appointment_id' => $request->appointment_id,
                    'call_type' => $request->call_type,
                    'channel_name' => $appointment->agora_channel_name,
                    'caller_name' => $callerName,
                ],
                'high'
            );

            return response()->json([
                'success' => true,
                'message' => 'Call initiated',
                'message_bn' => 'কল শুরু হয়েছে',
                'data' => [
                    'call' => $call,
                    'token' => $token,
                    'channel_name' => $appointment->agora_channel_name,
                    'app_id' => config('services.agora.app_id'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start call',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Answer a call
     * PUT /api/calls/{id}/answer
     */
    public function answerCall(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $call = ConsultationCall::with('appointment')->findOrFail($id);

            if ($call->callee_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not the receiver of this call',
                ], 403);
            }

            if ($call->call_status !== 'ringing') {
                return response()->json([
                    'success' => false,
                    'message' => 'Call is not ringing',
                ], 400);
            }

            $call->update([
                'call_status' => ConsultationCall::STATUS_ONGOING,
                'answered_at' => now(),
            ]);

            // Generate token for receiver with UID 0
            $token = $this->agoraService->generateToken(
                $call->agora_channel,
                0, // Use UID 0 to allow any UID to join
                'publisher',
                3600
            );

            return response()->json([
                'success' => true,
                'message' => 'Call answered',
                'data' => [
                    'call' => $call,
                    'token' => $token,
                    'channel_name' => $call->agora_channel,
                    'app_id' => config('services.agora.app_id'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to answer call',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject a call
     * PUT /api/calls/{id}/reject
     */
    public function rejectCall(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $call = ConsultationCall::findOrFail($id);

            if ($call->callee_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not the receiver of this call',
                ], 403);
            }

            if ($call->call_status !== 'ringing') {
                return response()->json([
                    'success' => false,
                    'message' => 'Call is not ringing',
                ], 400);
            }

            $call->update([
                'call_status' => 'rejected',
                'ended_at' => now(),
            ]);

            // Notify caller
            $this->notificationService->sendToUser(
                $call->caller_id,
                'কল প্রত্যাখ্যান',
                'আপনার কল প্রত্যাখ্যান করা হয়েছে',
                [
                    'type' => 'call_rejected',
                    'call_id' => $call->call_id,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Call rejected',
                'message_bn' => 'কল প্রত্যাখ্যান করা হয়েছে',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject call',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * End a call
     * PUT /api/calls/{id}/end
     */
    public function endCall(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $call = ConsultationCall::findOrFail($id);

            // Check if user is part of the call
            if ($call->caller_id !== $user->user_id && $call->callee_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not part of this call',
                ], 403);
            }

            if (in_array($call->call_status, [ConsultationCall::STATUS_COMPLETED, 'failed', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Call is already ended',
                ], 400);
            }

            $endedAt = now();
            $duration = null;

            if ($call->answered_at) {
                $duration = Carbon::parse($call->answered_at)->diffInSeconds($endedAt);
            }

            $call->update([
                'call_status' => ConsultationCall::STATUS_COMPLETED,
                'ended_at' => $endedAt,
                'duration_seconds' => $duration,
            ]);

            // Notify other party
            $otherUserId = $call->caller_id === $user->user_id 
                ? $call->callee_id 
                : $call->caller_id;

            $this->notificationService->sendToUser(
                $otherUserId,
                'কল শেষ',
                'কল শেষ হয়েছে',
                [
                    'type' => 'call_ended',
                    'call_id' => $call->call_id,
                    'duration' => $duration,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Call ended',
                'message_bn' => 'কল শেষ হয়েছে',
                'data' => [
                    'duration_seconds' => $duration,
                    'duration_formatted' => $this->formatDuration($duration),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to end call',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get call status
     * GET /api/calls/{id}/status
     */
    public function getStatus(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $call = ConsultationCall::with(['caller.profile', 'callee.profile'])
                ->findOrFail($id);

            // Check if user is part of the call
            if ($call->caller_id !== $user->user_id && $call->callee_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not part of this call',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $call,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Call not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Get call history for an appointment
     * GET /api/appointments/{appointmentId}/calls
     */
    public function getCallHistory(int $appointmentId): JsonResponse
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

            $calls = ConsultationCall::where('appointment_id', $appointmentId)
                ->with(['caller.profile', 'receiver.profile'])
                ->orderBy('started_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $calls,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get call history',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Format duration to human readable
     */
    private function formatDuration(?int $seconds): string
    {
        if (!$seconds) return '0:00';

        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;

        return sprintf('%d:%02d', $minutes, $remainingSeconds);
    }
}
