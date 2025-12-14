<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Otp extends Model
{
    use HasFactory;

    protected $table = 'otps';
    protected $primaryKey = 'otp_id';

    protected $fillable = [
        'user_id',
        'phone',
        'otp_code',
        'purpose',
        'expires_at',
        'is_verified',
        'verified_at',
        'attempts',
        'max_attempts',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'verified_at' => 'datetime',
            'is_verified' => 'boolean',
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
     * Check if OTP is expired
     */
    public function isExpired(): bool
    {
        return Carbon::now()->greaterThan($this->expires_at);
    }

    /**
     * Check if OTP is valid (not expired and not verified yet)
     */
    public function isValid(): bool
    {
        return !$this->isExpired() && !$this->is_verified && $this->attempts < $this->max_attempts;
    }

    /**
     * Increment attempt count
     */
    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }

    /**
     * Mark OTP as verified
     */
    public function markAsVerified(): void
    {
        $this->update([
            'is_verified' => true,
            'verified_at' => Carbon::now(),
        ]);
    }

    /**
     * Generate new OTP code
     */
    public static function generateCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Get latest OTP for phone number and purpose
     */
    public static function getLatestForPhone(string $phone, string $purpose = 'login')
    {
        return static::where('phone', $phone)
            ->where('purpose', $purpose)
            ->orderBy('created_at', 'desc')
            ->first();
    }

    /**
     * Create new OTP for phone number
     */
    public static function createForPhone(string $phone, ?int $userId = null, string $purpose = 'login', int $expiryMinutes = 5)
    {
        return static::create([
            'user_id' => $userId,
            'phone' => $phone,
            'otp_code' => static::generateCode(),
            'purpose' => $purpose,
            'expires_at' => Carbon::now()->addMinutes($expiryMinutes),
            'is_verified' => false,
            'attempts' => 0,
            'max_attempts' => 3,
        ]);
    }
}