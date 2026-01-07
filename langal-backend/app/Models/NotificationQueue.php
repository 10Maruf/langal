<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationQueue extends Model
{
    use HasFactory;

    protected $table = 'notification_queue';
    protected $primaryKey = 'queue_id';

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_SENT = 'sent';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'title',
        'title_bn',
        'body',
        'body_bn',
        'data_payload',
        'notification_type',
        'priority',
        'status',
        'scheduled_at',
        'sent_at',
        'error_message',
        'retry_count',
        'max_retries',
    ];

    protected function casts(): array
    {
        return [
            'data_payload' => 'array',
            'priority' => 'integer',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
            'retry_count' => 'integer',
            'max_retries' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public $timestamps = false;

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->created_at = now();
            if (!$model->scheduled_at) {
                $model->scheduled_at = now();
            }
        });
    }

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Scope for pending notifications
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for ready to send (scheduled time passed)
     */
    public function scopeReadyToSend($query)
    {
        return $query->where('status', self::STATUS_PENDING)
            ->where('scheduled_at', '<=', now());
    }

    /**
     * Scope for high priority
     */
    public function scopeHighPriority($query)
    {
        return $query->where('priority', '>=', 8);
    }

    /**
     * Scope ordered by priority
     */
    public function scopeByPriority($query)
    {
        return $query->orderBy('priority', 'desc')
            ->orderBy('scheduled_at', 'asc');
    }

    /**
     * Mark as sent
     */
    public function markAsSent(): void
    {
        $this->update([
            'status' => self::STATUS_SENT,
            'sent_at' => now(),
        ]);
    }

    /**
     * Mark as failed
     */
    public function markAsFailed(string $errorMessage): void
    {
        $this->update([
            'status' => self::STATUS_FAILED,
            'error_message' => $errorMessage,
            'retry_count' => $this->retry_count + 1,
        ]);
    }

    /**
     * Check if can retry
     */
    public function canRetry(): bool
    {
        return $this->retry_count < $this->max_retries;
    }

    /**
     * Retry notification
     */
    public function retry(): void
    {
        if ($this->canRetry()) {
            $this->update([
                'status' => self::STATUS_PENDING,
                'scheduled_at' => now()->addMinutes(5 * ($this->retry_count + 1)),
            ]);
        }
    }

    /**
     * Cancel notification
     */
    public function cancel(): void
    {
        $this->update(['status' => self::STATUS_CANCELLED]);
    }

    /**
     * Queue a new notification
     */
    public static function queue(
        int $userId,
        string $title,
        string $body,
        string $type = 'general',
        array $data = [],
        int $priority = 5,
        ?\DateTime $scheduledAt = null,
        ?string $titleBn = null,
        ?string $bodyBn = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'title' => $title,
            'title_bn' => $titleBn,
            'body' => $body,
            'body_bn' => $bodyBn,
            'notification_type' => $type,
            'data_payload' => $data,
            'priority' => $priority,
            'status' => self::STATUS_PENDING,
            'scheduled_at' => $scheduledAt ?? now(),
            'max_retries' => 3,
        ]);
    }

    /**
     * Queue appointment reminder
     */
    public static function queueAppointmentReminder(ConsultationAppointment $appointment): self
    {
        $expert = UserProfile::where('user_id', $appointment->expert_id)->first();
        $expertName = $expert ? ($expert->full_name_bn ?? $expert->full_name ?? 'বিশেষজ্ঞ') : 'বিশেষজ্ঞ';

        return self::queue(
            $appointment->farmer_id,
            'Appointment Reminder',
            "Your consultation with expert is tomorrow at {$appointment->start_time}",
            'appointment_reminder',
            [
                'appointment_id' => $appointment->appointment_id,
                'type' => 'reminder',
            ],
            8,
            $appointment->appointment_date->subDay()->setTime(18, 0),
            'অ্যাপয়েন্টমেন্ট রিমাইন্ডার',
            "আপনার {$expertName} এর সাথে পরামর্শ আগামীকাল {$appointment->start_time} এ"
        );
    }

    /**
     * Queue new appointment notification for expert
     */
    public static function queueNewAppointmentForExpert(ConsultationAppointment $appointment): self
    {
        $farmer = UserProfile::where('user_id', $appointment->farmer_id)->first();
        $farmerName = $farmer ? ($farmer->full_name_bn ?? $farmer->full_name ?? 'কৃষক') : 'কৃষক';

        return self::queue(
            $appointment->expert_id,
            'New Appointment Request',
            "You have a new appointment request",
            'new_appointment',
            [
                'appointment_id' => $appointment->appointment_id,
                'type' => 'new_request',
            ],
            9,
            null,
            'নতুন অ্যাপয়েন্টমেন্ট অনুরোধ',
            "{$farmerName} একটি নতুন পরামর্শ অ্যাপয়েন্টমেন্ট অনুরোধ করেছেন"
        );
    }
}
