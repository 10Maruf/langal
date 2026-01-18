<?php

namespace App\Services;

use App\Models\NotificationQueue;
use App\Models\NotificationToken;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected $fcmServerKey;
    protected $fcmUrl = 'https://fcm.googleapis.com/fcm/send';

    public function __construct()
    {
        $this->fcmServerKey = config('services.fcm.server_key');
    }

    /**
     * Send notification to a specific user
     * 
     * @param int $userId
     * @param string $title
     * @param string $body
     * @param array $data Additional data payload
     * @param string $priority 'normal' or 'high'
     * @return bool
     */
    public function sendToUser(
        int $userId,
        string $title,
        string $body,
        array $data = [],
        string $priority = 'normal'
    ): bool {
        try {
            // ALWAYS save notification to database first (for in-app notifications)
            $this->saveNotificationToDatabase($userId, $title, $body, $data, $priority);

            // Get user's device tokens for push notification
            $tokens = NotificationToken::where('user_id', $userId)
                ->where('is_active', true)
                ->pluck('device_token')
                ->toArray();

            if (empty($tokens)) {
                // No device tokens, but notification is saved to DB
                Log::info('No device tokens for user, notification saved to DB only', ['user_id' => $userId]);
                return true; // Return true since DB notification was saved
            }

            // Send to FCM for push notification
            $result = $this->sendFcmNotification($tokens, $title, $body, $data, $priority);

            return $result;
        } catch (\Exception $e) {
            Log::error('Failed to send notification', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send notification to multiple users
     */
    public function sendToUsers(
        array $userIds,
        string $title,
        string $body,
        array $data = [],
        string $priority = 'normal'
    ): array {
        $results = [];
        
        foreach ($userIds as $userId) {
            $results[$userId] = $this->sendToUser($userId, $title, $body, $data, $priority);
        }

        return $results;
    }

    /**
     * Send notification to a topic
     */
    public function sendToTopic(
        string $topic,
        string $title,
        string $body,
        array $data = []
    ): bool {
        try {
            $payload = [
                'to' => '/topics/' . $topic,
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    'sound' => 'default',
                ],
                'data' => $data,
            ];

            return $this->sendToFcm($payload);
        } catch (\Exception $e) {
            Log::error('Failed to send topic notification', [
                'topic' => $topic,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send FCM notification
     */
    private function sendFcmNotification(
        array $tokens,
        string $title,
        string $body,
        array $data,
        string $priority
    ): bool {
        if (empty($this->fcmServerKey)) {
            Log::warning('FCM server key not configured');
            return false;
        }

        $payload = [
            'registration_ids' => $tokens,
            'notification' => [
                'title' => $title,
                'body' => $body,
                'sound' => 'default',
                'badge' => 1,
                'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
            ],
            'data' => array_merge($data, [
                'title' => $title,
                'body' => $body,
                'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
            ]),
            'priority' => $priority,
            'content_available' => true,
        ];

        // For call notifications, add high priority settings
        if (isset($data['type']) && in_array($data['type'], ['incoming_call', 'call_ended'])) {
            $payload['priority'] = 'high';
            $payload['android'] = [
                'priority' => 'high',
                'notification' => [
                    'channel_id' => 'call_channel',
                    'sound' => 'ringtone',
                ],
            ];
        }

        return $this->sendToFcm($payload);
    }

    /**
     * Send payload to FCM
     */
    private function sendToFcm(array $payload): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'key=' . $this->fcmServerKey,
                'Content-Type' => 'application/json',
            ])->post($this->fcmUrl, $payload);

            if ($response->successful()) {
                $result = $response->json();
                
                // Handle failed tokens
                if (isset($result['results'])) {
                    $this->handleFcmResults($payload['registration_ids'] ?? [], $result['results']);
                }

                return ($result['success'] ?? 0) > 0;
            }

            Log::error('FCM request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('FCM request exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Handle FCM response results
     */
    private function handleFcmResults(array $tokens, array $results): void
    {
        foreach ($results as $index => $result) {
            if (isset($result['error'])) {
                $token = $tokens[$index] ?? null;
                
                if ($token && in_array($result['error'], ['NotRegistered', 'InvalidRegistration'])) {
                    // Deactivate invalid token
                    NotificationToken::where('device_token', $token)
                        ->update(['is_active' => false]);
                }
            }
        }
    }

    /**
     * Queue notification for later delivery
     */
    private function queueNotification(
        int $userId,
        string $title,
        string $body,
        array $data,
        string $priority
    ): void {
        NotificationQueue::create([
            'user_id' => $userId,
            'notification_type' => $data['type'] ?? 'general',
            'title' => $title,
            'body' => $body,
            'data' => json_encode($data),
            'priority' => $priority,
            'status' => 'pending',
        ]);
    }

    /**
     * Save notification directly to database
     */
    private function saveNotificationToDatabase(
        int $userId,
        string $title,
        string $body,
        array $data,
        string $priority = 'normal'
    ): void {
        try {
            // Get notification type from data
            $notificationType = $data['type'] ?? 'system';
            
            // Map notification types to valid notification_type values
            $typeMapping = [
                'new_appointment' => 'consultation_request',
                'appointment_confirmed' => 'consultation_request',
                'appointment_rejected' => 'consultation_request',
                'appointment_cancelled' => 'consultation_request',
                'appointment_reminder' => 'consultation_request',
                'incoming_call' => 'consultation_request',
                'marketplace_approved' => 'marketplace_update',
                'marketplace_rejected' => 'marketplace_update',
                'post_approved' => 'post_update',
                'post_rejected' => 'post_update',
            ];
            
            $dbNotificationType = $typeMapping[$notificationType] ?? 'system';
            
            // Map to valid notification_category enum values
            $categoryMapping = [
                'new_appointment' => 'appointment',
                'appointment_confirmed' => 'appointment',
                'appointment_rejected' => 'appointment',
                'appointment_cancelled' => 'appointment',
                'appointment_reminder' => 'reminder',
                'incoming_call' => 'call',
                'marketplace_approved' => 'system',
                'marketplace_rejected' => 'system',
                'post_approved' => 'system',
                'post_rejected' => 'system',
            ];
            
            $dbCategory = $categoryMapping[$notificationType] ?? 'system';
            
            // Determine related entity ID
            $relatedEntityId = null;
            if (isset($data['appointment_id'])) {
                $relatedEntityId = (string)$data['appointment_id'];
            } elseif (isset($data['listing_id'])) {
                $relatedEntityId = (string)$data['listing_id'];
            } elseif (isset($data['post_id'])) {
                $relatedEntityId = (string)$data['post_id'];
            } elseif (isset($data['related_entity_id'])) {
                $relatedEntityId = $data['related_entity_id'];
            }
            
            // Insert directly into notifications table (notification_id is auto-increment)
            \Illuminate\Support\Facades\DB::table('notifications')->insert([
                'recipient_id' => $userId,
                'sender_id' => $data['sender_id'] ?? null,
                'notification_type' => $dbNotificationType,
                'notification_category' => $dbCategory,
                'priority' => $priority,
                'title' => $title,
                'message' => $body,
                'related_entity_id' => $relatedEntityId,
                'is_read' => 0,
                'created_at' => now(),
            ]);
            
            Log::info('Notification saved to database', [
                'user_id' => $userId,
                'type' => $dbNotificationType,
                'category' => $dbCategory,
                'title' => $title,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to save notification to database', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Register device token
     */
    public function registerToken(int $userId, string $token, string $deviceType = 'android'): NotificationToken
    {
        // Deactivate existing tokens for this device
        NotificationToken::where('device_token', $token)->update(['is_active' => false]);

        // Create or update token
        return NotificationToken::updateOrCreate(
            ['user_id' => $userId, 'device_token' => $token],
            [
                'device_type' => $deviceType,
                'is_active' => true,
                'last_used_at' => now(),
            ]
        );
    }

    /**
     * Unregister device token
     */
    public function unregisterToken(string $token): bool
    {
        return NotificationToken::where('device_token', $token)
            ->update(['is_active' => false]) > 0;
    }

    /**
     * Process queued notifications
     * This should be called by a scheduled job
     */
    public function processQueue(): int
    {
        $processed = 0;
        
        $pendingNotifications = NotificationQueue::where('status', 'pending')
            ->where('retry_count', '<', 3)
            ->limit(100)
            ->get();

        foreach ($pendingNotifications as $notification) {
            $tokens = NotificationToken::where('user_id', $notification->user_id)
                ->where('is_active', true)
                ->pluck('device_token')
                ->toArray();

            if (!empty($tokens)) {
                $data = json_decode($notification->data, true) ?? [];
                $success = $this->sendFcmNotification(
                    $tokens,
                    $notification->title,
                    $notification->body,
                    $data,
                    $notification->priority
                );

                if ($success) {
                    $notification->update([
                        'status' => 'sent',
                        'sent_at' => now(),
                    ]);
                    $processed++;
                } else {
                    $notification->increment('retry_count');
                    if ($notification->retry_count >= 3) {
                        $notification->update(['status' => 'failed']);
                    }
                }
            }
        }

        return $processed;
    }

    /**
     * Send appointment reminder
     */
    public function sendAppointmentReminder(
        int $userId,
        int $appointmentId,
        string $expertName,
        string $time,
        int $minutesBefore = 30
    ): bool {
        $title = 'পরামর্শের রিমাইন্ডার';
        $body = "{$minutesBefore} মিনিট পরে {$expertName} এর সাথে আপনার পরামর্শ শুরু হবে";

        return $this->sendToUser($userId, $title, $body, [
            'type' => 'appointment_reminder',
            'appointment_id' => $appointmentId,
            'minutes_before' => $minutesBefore,
        ], 'high');
    }
}
