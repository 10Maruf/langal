<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConversationParticipant extends Model
{
    use HasFactory;

    protected $table = 'conversation_participants';
    protected $primaryKey = 'participant_id';

    protected $fillable = [
        'appointment_id',
        'user_id',
        'last_read_at',
        'is_typing',
        'is_online',
    ];

    protected function casts(): array
    {
        return [
            'last_read_at' => 'datetime',
            'is_typing' => 'boolean',
            'is_online' => 'boolean',
            'joined_at' => 'datetime',
        ];
    }

    public $timestamps = false;

    /**
     * Boot method to set joined_at
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->joined_at = now();
        });
    }

    /**
     * Relationship with Appointment
     */
    public function appointment()
    {
        return $this->belongsTo(ConsultationAppointment::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Scope for online participants
     */
    public function scopeOnline($query)
    {
        return $query->where('is_online', true);
    }

    /**
     * Mark as read
     */
    public function markAsRead(): void
    {
        $this->update(['last_read_at' => now()]);
    }

    /**
     * Set typing status
     */
    public function setTyping(bool $isTyping): void
    {
        $this->update(['is_typing' => $isTyping]);
    }

    /**
     * Set online status
     */
    public function setOnline(bool $isOnline): void
    {
        $this->update(['is_online' => $isOnline]);
    }

    /**
     * Get unread messages count for this participant
     */
    public function getUnreadCountAttribute(): int
    {
        return ConsultationMessage::where('appointment_id', $this->appointment_id)
            ->where('sender_id', '!=', $this->user_id)
            ->where(function ($query) {
                $query->whereNull($this->last_read_at)
                    ->orWhere('created_at', '>', $this->last_read_at);
            })
            ->count();
    }
}
