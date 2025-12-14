<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $table = 'user_profiles';
    protected $primaryKey = 'profile_id';

    protected $fillable = [
        'user_id',
        'full_name',
        'nid_number',
        'date_of_birth',
        'father_name',
        'mother_name',
        'address',
        'village',
        'postal_code',
        'profile_photo_url',
        'nid_photo_url',
        'verification_status',
        'verified_by',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'verified_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Append accessor attributes
     */
    protected $appends = ['profile_photo_url_full', 'nid_photo_url_full'];

    /**
     * Get full URL for profile photo
     */
    public function getProfilePhotoUrlFullAttribute(): ?string
    {
        if ($this->profile_photo_url) {
            return asset('storage/' . $this->profile_photo_url);
        }
        return null;
    }

    /**
     * Get full URL for NID photo
     */
    public function getNidPhotoUrlFullAttribute(): ?string
    {
        if ($this->nid_photo_url) {
            return asset('storage/' . $this->nid_photo_url);
        }
        return null;
    }

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Check if profile is verified
     */
    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }
}