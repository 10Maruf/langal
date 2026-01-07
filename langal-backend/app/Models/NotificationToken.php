<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationToken extends Model
{
    use HasFactory;

    protected $table = 'notification_tokens';
    protected $primaryKey = 'token_id';

    protected $fillable = [
        'user_id',
        'fcm_token',
        'device_type',
        'device_name',
        'app_version',
        'is_active',
        'last_used_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_used_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Scope for active tokens
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for a specific device type
     */
    public function scopeForDevice($query, string $deviceType)
    {
        return $query->where('device_type', $deviceType);
    }

    /**
     * Update last used timestamp
     */
    public function touchLastUsed(): void
    {
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Deactivate token
     */
    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    /**
     * Activate token
     */
    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    /**
     * Register or update FCM token for a user
     */
    public static function registerToken(
        int $userId,
        string $fcmToken,
        string $deviceType = 'android',
        ?string $deviceName = null,
        ?string $appVersion = null
    ): self {
        return self::updateOrCreate(
            [
                'user_id' => $userId,
                'fcm_token' => $fcmToken,
            ],
            [
                'device_type' => $deviceType,
                'device_name' => $deviceName,
                'app_version' => $appVersion,
                'is_active' => true,
                'last_used_at' => now(),
            ]
        );
    }

    /**
     * Get all active tokens for a user
     */
    public static function getActiveTokensForUser(int $userId): array
    {
        return self::where('user_id', $userId)
            ->active()
            ->pluck('fcm_token')
            ->toArray();
    }

    /**
     * Cleanup old inactive tokens
     */
    public static function cleanupOldTokens(int $daysOld = 30): int
    {
        return self::where('is_active', false)
            ->where('updated_at', '<', now()->subDays($daysOld))
            ->delete();
    }
}
