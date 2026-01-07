<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationCall extends Model
{
    use HasFactory;

    protected $table = 'consultation_calls';
    protected $primaryKey = 'call_id';

    // Call type constants
    const TYPE_AUDIO = 'audio';
    const TYPE_VIDEO = 'video';

    // Call status constants
    const STATUS_INITIATED = 'initiated';
    const STATUS_RINGING = 'ringing';
    const STATUS_ONGOING = 'answered';
    const STATUS_COMPLETED = 'ended';
    const STATUS_MISSED = 'missed';
    const STATUS_REJECTED = 'rejected';
    const STATUS_FAILED = 'failed';

    protected $fillable = [
        'appointment_id',
        'caller_id',
        'callee_id',
        'call_type',
        'call_status',
        'agora_channel',
        'agora_token',
        'initiated_at',
        'answered_at',
        'ended_at',
        'duration_seconds',
        'end_reason',
        'quality_score',
        'recording_url',
    ];

    protected function casts(): array
    {
        return [
            'initiated_at' => 'datetime',
            'answered_at' => 'datetime',
            'ended_at' => 'datetime',
            'duration_seconds' => 'integer',
            'quality_score' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public $timestamps = true;

    protected $appends = ['duration_formatted', 'duration_formatted_bn', 'status_bn', 'type_bn'];

    /**
     * Get formatted duration
     */
    public function getDurationFormattedAttribute(): string
    {
        if (!$this->duration_seconds) return '0:00';
        
        $minutes = floor($this->duration_seconds / 60);
        $seconds = $this->duration_seconds % 60;
        
        if ($minutes >= 60) {
            $hours = floor($minutes / 60);
            $minutes = $minutes % 60;
            return sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
        }
        
        return sprintf('%d:%02d', $minutes, $seconds);
    }

    /**
     * Get formatted duration in Bangla
     */
    public function getDurationFormattedBnAttribute(): string
    {
        if (!$this->duration_seconds) return '০ মিনিট';
        
        $minutes = floor($this->duration_seconds / 60);
        $seconds = $this->duration_seconds % 60;
        $banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        
        $result = '';
        if ($minutes >= 60) {
            $hours = floor($minutes / 60);
            $minutes = $minutes % 60;
            $result = $this->toBanglaNumber($hours, $banglaNumbers) . ' ঘন্টা ';
        }
        
        if ($minutes > 0) {
            $result .= $this->toBanglaNumber($minutes, $banglaNumbers) . ' মিনিট ';
        }
        
        if ($seconds > 0 && $minutes < 60) {
            $result .= $this->toBanglaNumber($seconds, $banglaNumbers) . ' সেকেন্ড';
        }
        
        return trim($result);
    }

    private function toBanglaNumber($number, $banglaNumbers): string
    {
        $result = '';
        foreach (str_split((string)$number) as $digit) {
            $result .= $banglaNumbers[$digit];
        }
        return $result;
    }

    /**
     * Get status in Bangla
     */
    public function getStatusBnAttribute(): string
    {
        $statuses = [
            'initiated' => 'শুরু হয়েছে',
            'ringing' => 'রিং হচ্ছে',
            'ongoing' => 'চলমান',
            'completed' => 'সম্পন্ন',
            'missed' => 'মিসড',
            'rejected' => 'প্রত্যাখ্যাত',
            'failed' => 'ব্যর্থ',
        ];
        return $statuses[$this->call_status] ?? $this->call_status;
    }

    /**
     * Get call type in Bangla
     */
    public function getTypeBnAttribute(): string
    {
        $types = [
            'audio' => 'অডিও কল',
            'video' => 'ভিডিও কল',
        ];
        return $types[$this->call_type] ?? $this->call_type;
    }

    /**
     * Relationship with Appointment
     */
    public function appointment()
    {
        return $this->belongsTo(ConsultationAppointment::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with Caller
     */
    public function caller()
    {
        return $this->belongsTo(User::class, 'caller_id', 'user_id');
    }

    /**
     * Relationship with Receiver (Callee)
     */
    public function callee()
    {
        return $this->belongsTo(User::class, 'callee_id', 'user_id');
    }

    /**
     * Relationship with Receiver (Alias for callee)
     */
    public function receiver()
    {
        return $this->callee();
    }

    /**
     * Start the call
     */
    public function start(): void
    {
        $this->update([
            'call_status' => self::STATUS_RINGING,
            'initiated_at' => now(),
        ]);
    }

    /**
     * Answer the call
     */
    public function answer(): void
    {
        $this->update([
            'call_status' => self::STATUS_ONGOING,
            'answered_at' => now(),
        ]);
    }

    /**
     * End the call
     */
    public function end(string $reason = 'normal'): void
    {
        $duration = 0;
        if ($this->answered_at) {
            $duration = now()->diffInSeconds($this->answered_at);
        }

        $this->update([
            'call_status' => self::STATUS_COMPLETED,
            'ended_at' => now(),
            'duration_seconds' => $duration,
            'end_reason' => $reason,
        ]);
    }

    /**
     * Mark as missed
     */
    public function markAsMissed(): void
    {
        $this->update([
            'call_status' => self::STATUS_MISSED,
            'ended_at' => now(),
            'end_reason' => 'no_answer',
        ]);
    }

    /**
     * Reject the call
     */
    public function reject(): void
    {
        $this->update([
            'call_status' => self::STATUS_REJECTED,
            'ended_at' => now(),
            'end_reason' => 'rejected',
        ]);
    }

    /**
     * Set quality score
     */
    public function setQualityScore(int $score): void
    {
        $this->update(['quality_score' => min(5, max(1, $score))]);
    }

    /**
     * Scope for completed calls
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope for a specific user (as caller or receiver)
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('caller_id', $userId)
              ->orWhere('receiver_id', $userId);
        });
    }
}
