<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpertAvailability extends Model
{
    use HasFactory;

    protected $table = 'expert_availability';
    protected $primaryKey = 'availability_id';

    protected $fillable = [
        'expert_id',
        'day_of_week',
        'start_time',
        'end_time',
        'slot_duration_minutes',
        'max_appointments',
        'is_available',
        'consultation_types',
        'notes'
    ];

    protected function casts(): array
    {
        return [
            'slot_duration_minutes' => 'integer',
            'max_appointments' => 'integer',
            'is_available' => 'boolean',
            'consultation_types' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get day name in Bangla
     */
    public function getDayNameBnAttribute(): string
    {
        $days = [
            0 => 'রবিবার',
            1 => 'সোমবার',
            2 => 'মঙ্গলবার',
            3 => 'বুধবার',
            4 => 'বৃহস্পতিবার',
            5 => 'শুক্রবার',
            6 => 'শনিবার',
        ];
        return $days[$this->day_of_week] ?? '';
    }

    /**
     * Get day name in English
     */
    public function getDayNameEnAttribute(): string
    {
        $days = [
            0 => 'Sunday',
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
        ];
        return $days[$this->day_of_week] ?? '';
    }

    /**
     * Relationship with Expert
     */
    public function expert()
    {
        return $this->belongsTo(Expert::class, 'expert_id', 'user_id');
    }

    /**
     * Relationship with User (Expert)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'expert_id', 'user_id');
    }

    /**
     * Scope for active availability
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for specific day
     */
    public function scopeForDay($query, int $dayOfWeek)
    {
        return $query->where('day_of_week', $dayOfWeek);
    }

    /**
     * Generate time slots for this availability
     */
    public function generateTimeSlots(): array
    {
        $slots = [];
        $start = strtotime($this->start_time);
        $end = strtotime($this->end_time);
        $duration = $this->slot_duration_minutes * 60;

        while ($start + $duration <= $end) {
            $slots[] = [
                'start' => date('H:i', $start),
                'end' => date('H:i', $start + $duration),
            ];
            $start += $duration;
        }

        return $slots;
    }
}
