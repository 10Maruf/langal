<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConsultationMessage extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'consultation_messages';
    protected $primaryKey = 'message_id';

    // Message type constants
    const TYPE_TEXT = 'text';
    const TYPE_IMAGE = 'image';
    const TYPE_AUDIO = 'audio';
    const TYPE_FILE = 'file';
    const TYPE_SYSTEM = 'system';

    protected $fillable = [
        'appointment_id',
        'sender_id',
        'message_type',
        'content',
        'content_bn',
        'media_url',
        'media_thumbnail',
        'is_read',
        'read_at',
        'is_edited',
        'edited_at',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
            'is_edited' => 'boolean',
            'edited_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public $timestamps = true;

    protected $appends = ['media_url_full', 'time_ago', 'time_ago_bn'];

    /**
     * Get full media URL
     */
    public function getMediaUrlFullAttribute(): ?string
    {
        if ($this->media_url) {
            if (filter_var($this->media_url, FILTER_VALIDATE_URL)) {
                return $this->media_url;
            }
            
            try {
                return \Illuminate\Support\Facades\Storage::disk('azure')->url($this->media_url);
            } catch (\Exception $e) {
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                
                if ($accountName && $container) {
                    return sprintf(
                        'https://%s.blob.core.windows.net/%s/%s',
                        $accountName,
                        $container,
                        $this->media_url
                    );
                }
                return null;
            }
        }
        return null;
    }

    /**
     * Get sent_at attribute (alias for created_at)
     */
    public function getSentAtAttribute()
    {
        return $this->created_at;
    }

    /**
     * Get time ago in English
     */
    public function getTimeAgoAttribute(): string
    {
        if (!$this->created_at) return '';
        return $this->created_at->diffForHumans();
    }

    /**
     * Get time ago in Bangla
     */
    public function getTimeAgoBnAttribute(): string
    {
        if (!$this->created_at) return '';
        
        $diff = now()->diff($this->created_at);
        
        if ($diff->y > 0) return $diff->y . ' বছর আগে';
        if ($diff->m > 0) return $diff->m . ' মাস আগে';
        if ($diff->d > 0) return $diff->d . ' দিন আগে';
        if ($diff->h > 0) return $diff->h . ' ঘন্টা আগে';
        if ($diff->i > 0) return $diff->i . ' মিনিট আগে';
        return 'এইমাত্র';
    }

    /**
     * Relationship with Appointment
     */
    public function appointment()
    {
        return $this->belongsTo(ConsultationAppointment::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with Sender
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_id');
    }

    /**
     * Scope for unread messages
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope for a specific appointment
     */
    public function scopeForAppointment($query, int $appointmentId)
    {
        return $query->where('appointment_id', $appointmentId);
    }

    /**
     * Mark as read
     */
    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
    }

    /**
     * Edit message
     */
    public function editContent(string $newContent, ?string $newContentBn = null): void
    {
        $this->update([
            'content' => $newContent,
            'content_bn' => $newContentBn,
            'is_edited' => true,
            'edited_at' => now(),
        ]);
    }

    /**
     * Check if message is from farmer
     */
    public function isFromFarmer(): bool
    {
        return $this->sender && $this->sender->isFarmer();
    }

    /**
     * Check if message is from expert
     */
    public function isFromExpert(): bool
    {
        return $this->sender && $this->sender->isExpert();
    }
}
