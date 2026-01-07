<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultationAppointment;
use App\Models\ConsultationMessage;
use App\Models\ConversationParticipant;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get conversations list
     * GET /api/conversations
     */
    public function getConversations(): JsonResponse
    {
        try {
            $user = Auth::user();

            // Get all appointments with messages
            $query = ConsultationAppointment::with(['farmer.profile', 'expert.profile', 'expertQualification'])
                ->withCount(['messages as unread_count' => function ($query) use ($user) {
                    $query->where('sender_id', '!=', $user->user_id)
                        ->where('is_read', false);
                }])
                ->orderBy('updated_at', 'desc');

            if ($user->user_type === 'farmer') {
                $query->where('farmer_id', $user->user_id);
            } else {
                $query->where('expert_id', $user->user_id);
            }

            $conversations = $query->whereIn('status', ['pending', 'confirmed', 'completed'])
                ->get()
                ->map(function ($appointment) use ($user) {
                    $lastMessage = ConsultationMessage::where('appointment_id', $appointment->appointment_id)
                        ->orderBy('created_at', 'desc')
                        ->first();

                    return [
                        'appointment_id' => $appointment->appointment_id,
                        'partner' => $user->user_type === 'farmer' 
                            ? $appointment->expert 
                            : $appointment->farmer,
                        'partner_profile' => $user->user_type === 'farmer'
                            ? $appointment->expert?->profile
                            : $appointment->farmer?->profile,
                        'last_message' => $lastMessage,
                        'unread_count' => $appointment->unread_count,
                        'consultation_type' => $appointment->consultation_type,
                        'status' => $appointment->status,
                        'appointment_date' => $appointment->appointment_date,
                        'start_time' => $appointment->start_time,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $conversations,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conversations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get messages for an appointment
     * GET /api/conversations/{appointmentId}/messages
     */
    public function getMessages(Request $request, int $appointmentId): JsonResponse
    {
        try {
            $user = Auth::user();
            $perPage = $request->query('per_page', 50);
            $before = $request->query('before'); // For pagination

            $appointment = ConsultationAppointment::findOrFail($appointmentId);

            // Check access
            if ($user->user_id !== $appointment->farmer_id && $user->user_id !== $appointment->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            $query = ConsultationMessage::where('appointment_id', $appointmentId)
                ->with('sender.profile')
                ->orderBy('created_at', 'desc');

            if ($before) {
                $query->where('message_id', '<', $before);
            }

            $messages = $query->paginate($perPage);

            // Mark messages as read
            ConsultationMessage::where('appointment_id', $appointmentId)
                ->where('sender_id', '!=', $user->user_id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'data' => $messages,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch messages',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send a message
     * POST /api/conversations/{appointmentId}/messages
     */
    public function sendMessage(Request $request, int $appointmentId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'message_type' => 'required|in:text,image,audio,file,system',
            'content' => 'required_if:message_type,text|nullable|string|max:2000',
            'content_bn' => 'nullable|string|max:2000',
            'media' => 'required_if:message_type,image,audio,file|nullable|file|max:10240',
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

            // Check access
            if ($user->user_id !== $appointment->farmer_id && $user->user_id !== $appointment->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            $messageData = [
                'appointment_id' => $appointmentId,
                'sender_id' => $user->user_id,
                'message_type' => $request->message_type,
                'content' => $request->content,
                'content_bn' => $request->content_bn,
                'is_read' => false,
            ];

            // Handle media upload
            if ($request->hasFile('media')) {
                $file = $request->file('media');
                $extension = $file->getClientOriginalExtension();
                $filename = 'messages/' . Str::uuid() . '.' . $extension;

                try {
                    Storage::disk('azure')->put($filename, file_get_contents($file));
                    $messageData['media_url'] = $filename;

                    // Generate thumbnail for images
                    if ($request->message_type === 'image') {
                        // Thumbnail logic can be added here
                    }
                } catch (\Exception $e) {
                    // Fallback to local storage
                    Storage::disk('public')->put($filename, file_get_contents($file));
                    $messageData['media_url'] = $filename;
                }
            }

            $message = ConsultationMessage::create($messageData);
            $message->load('sender.profile');

            // Update appointment's updated_at
            $appointment->touch();

            // Send notification to receiver
            $receiverId = $user->user_id === $appointment->farmer_id 
                ? $appointment->expert_id 
                : $appointment->farmer_id;

            $senderName = $user->profile->full_name ?? $user->phone;
            $preview = $request->message_type === 'text' 
                ? Str::limit($request->content, 50) 
                : $this->getMediaTypeLabel($request->message_type);

            $this->notificationService->sendToUser(
                $receiverId,
                'নতুন বার্তা',
                "{$senderName}: {$preview}",
                [
                    'type' => 'new_message',
                    'appointment_id' => $appointmentId,
                    'message_id' => $message->message_id,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $message,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark messages as read
     * POST /api/conversations/{appointmentId}/read
     */
    public function markAsRead(int $appointmentId): JsonResponse
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

            $updated = ConsultationMessage::where('appointment_id', $appointmentId)
                ->where('sender_id', '!=', $user->user_id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => "{$updated} messages marked as read",
                'data' => ['updated_count' => $updated],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark messages as read',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a message
     * DELETE /api/messages/{id}
     */
    public function deleteMessage(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $message = ConsultationMessage::findOrFail($id);

            if ($message->sender_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only delete your own messages',
                ], 403);
            }

            // Soft delete
            $message->delete();

            return response()->json([
                'success' => true,
                'message' => 'Message deleted',
                'message_bn' => 'বার্তা মুছে ফেলা হয়েছে',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get total unread message count
     * GET /api/messages/unread-count
     */
    public function getUnreadCount(): JsonResponse
    {
        try {
            $user = Auth::user();

            // Get all appointment IDs for this user
            $appointmentIds = ConsultationAppointment::where(function ($query) use ($user) {
                $query->where('farmer_id', $user->user_id)
                    ->orWhere('expert_id', $user->user_id);
            })->pluck('appointment_id');

            $unreadCount = ConsultationMessage::whereIn('appointment_id', $appointmentIds)
                ->where('sender_id', '!=', $user->user_id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'data' => ['unread_count' => $unreadCount],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get media type label in Bangla
     */
    private function getMediaTypeLabel(string $type): string
    {
        $labels = [
            'image' => '📷 ছবি',
            'audio' => '🎵 অডিও',
            'file' => '📎 ফাইল',
            'system' => 'সিস্টেম বার্তা',
        ];
        return $labels[$type] ?? $type;
    }
}
