<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationAppointment extends Model
{
    use HasFactory;

    protected $table = 'consultation_appointments';
    protected $primaryKey = 'appointment_id';

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_COMPLETED = 'completed';
    const STATUS_NO_SHOW = 'no_show';

    // Type constants
    const TYPE_AUDIO = 'audio_call';
    const TYPE_VIDEO = 'video_call';
    const TYPE_CHAT = 'chat';

    protected $fillable = [
        'farmer_id',
        'expert_id',
        'appointment_date',
        'start_time',
        'end_time',
        'consultation_type',
        'status',
        'problem_description',
        'problem_description_bn',
        'crop_type',
        'urgency_level',
        'farmer_notes',
        'expert_notes',
        'cancellation_reason',
        'cancelled_by',
        'rescheduled_from',
        'reminder_sent',
        'agora_channel_name',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'date',
            'urgency_level' => 'integer',
            'reminder_sent' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected $appends = ['status_bn', 'type_bn', 'urgency_level_bn', 'scheduled_at', 'duration_minutes'];

    /**
     * Get scheduled_at attribute
     */
    public function getScheduledAtAttribute(): string
    {
        return $this->appointment_date->format('Y-m-d') . 'T' . $this->start_time;
    }

    /**
     * Get duration_minutes attribute
     */
    public function getDurationMinutesAttribute(): int
    {
        if (!$this->end_time || !$this->start_time) {
            return 0; // Default or handle appropriately
        }
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        return $start->diffInMinutes($end);
    }

    /**
     * Get status in Bangla
     */
    public function getStatusBnAttribute(): string
    {
        $statuses = [
            'pending' => 'অপেক্ষমাণ',
            'confirmed' => 'নিশ্চিত',
            'cancelled' => 'বাতিল',
            'completed' => 'সম্পন্ন',
            'no_show' => 'অনুপস্থিত',
        ];
        return $statuses[$this->status] ?? $this->status;
    }

    /**
     * Get consultation type in Bangla
     */
    public function getTypeBnAttribute(): string
    {
        $types = [
            'audio_call' => 'অডিও কল',
            'video_call' => 'ভিডিও কল',
            'chat' => 'চ্যাট',
        ];
        return $types[$this->consultation_type] ?? $this->consultation_type;
    }

    /**
     * Get urgency level in Bangla
     */
    public function getUrgencyLevelBnAttribute(): string
    {
        $levels = [
            1 => 'সাধারণ',
            2 => 'মাঝারি',
            3 => 'জরুরি',
        ];
        return $levels[$this->urgency_level] ?? 'সাধারণ';
    }

    /**
     * Relationship with Farmer (User)
     */
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id', 'user_id');
    }

    /**
     * Relationship with Farmer Details
     */
    public function farmerDetails()
    {
        return $this->belongsTo(Farmer::class, 'farmer_id', 'user_id');
    }

    /**
     * Relationship with Expert (User)
     */
    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id', 'user_id');
    }

    /**
     * Relationship with Expert Qualifications
     */
    public function expertQualifications()
    {
        return $this->belongsTo(Expert::class, 'expert_id', 'user_id');
    }

    /**
     * Relationship with cancelled by user
     */
    public function cancelledByUser()
    {
        return $this->belongsTo(User::class, 'cancelled_by', 'user_id');
    }

    /**
     * Relationship with rescheduled from appointment
     */
    public function rescheduledFrom()
    {
        return $this->belongsTo(self::class, 'rescheduled_from', 'appointment_id');
    }

    /**
     * Relationship with expert qualification
     */
    public function expertQualification()
    {
        return $this->hasOne(Expert::class, 'user_id', 'expert_id');
    }

    /**
     * Relationship with messages (through conversation)
     */
    public function messages()
    {
        return $this->hasMany(ConsultationMessage::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with calls
     */
    public function calls()
    {
        return $this->hasMany(ConsultationCall::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with feedback
     */
    public function feedback()
    {
        return $this->hasOne(ConsultationFeedback::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with prescription
     */
    public function prescription()
    {
        return $this->hasOne(ConsultationPrescription::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Scope for pending appointments
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for confirmed appointments
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    /**
     * Scope for upcoming appointments
     */
    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>=', now()->toDateString())
            ->whereIn('status', [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }

    /**
     * Scope for today's appointments
     */
    public function scopeToday($query)
    {
        return $query->where('appointment_date', now()->toDateString());
    }

    /**
     * Scope for a specific farmer
     */
    public function scopeForFarmer($query, int $farmerId)
    {
        return $query->where('farmer_id', $farmerId);
    }

    /**
     * Scope for a specific expert
     */
    public function scopeForExpert($query, int $expertId)
    {
        return $query->where('expert_id', $expertId);
    }

    /**
     * Check if appointment can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }

    /**
     * Check if appointment can be rescheduled
     */
    public function canBeRescheduled(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED])
            && $this->appointment_date >= now()->toDateString();
    }

    /**
     * Generate Agora channel name
     */
    public function generateAgoraChannel(): string
    {
        $channel = 'consultation_' . $this->appointment_id . '_' . time();
        $this->update(['agora_channel_name' => $channel]);
        return $channel;
    }
}
