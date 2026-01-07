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
            'date_of_birth' => 'date:Y-m-d',
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
            $url = $this->profile_photo_url;

            // If it's not a URL, generate one using Storage facade
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                try {
                    $url = \Illuminate\Support\Facades\Storage::disk('azure')->url($url);
                } catch (\Exception $e) {
                    // Fallback: construct Azure URL manually
                    $accountName = config('filesystems.disks.azure.name');
                    $container = config('filesystems.disks.azure.container');
                    
                    if ($accountName && $container) {
                        $url = sprintf(
                            'https://%s.blob.core.windows.net/%s/%s',
                            $accountName,
                            $container,
                            $this->profile_photo_url
                        );
                    }
                }
            }

            // Check if the URL is localhost or 127.0.0.1 (misconfiguration or legacy data)
            if (str_contains($url, 'localhost') || str_contains($url, '127.0.0.1')) {
                // Extract the relative path
                // Remove http://localhost:8000/storage/ or similar
                $path = parse_url($url, PHP_URL_PATH);
                // Remove leading /storage/ if present (common in Laravel local driver)
                $path = preg_replace('#^/storage/#', '', $path);
                // Remove leading slash
                $path = ltrim($path, '/');
                
                // Force Azure URL construction
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                
                if ($accountName && $container) {
                    return sprintf(
                        'https://%s.blob.core.windows.net/%s/%s',
                        $accountName,
                        $container,
                        $path
                    );
                }
            }

            return $url;
        }
        
        // Return default avatar if no photo
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->full_name ?? 'User') . '&color=7F9CF5&background=EBF4FF';
    }

    /**
     * Get full URL for NID photo
     */
    public function getNidPhotoUrlFullAttribute(): ?string
    {
        if ($this->nid_photo_url) {
            if (filter_var($this->nid_photo_url, FILTER_VALIDATE_URL)) {
                return $this->nid_photo_url;
            }
            try {
                return \Illuminate\Support\Facades\Storage::disk('azure')->url($this->nid_photo_url);
            } catch (\Exception $e) {
                // Fallback: construct Azure URL manually
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                
                if ($accountName && $container) {
                    return sprintf(
                        'https://%s.blob.core.windows.net/%s/%s',
                        $accountName,
                        $container,
                        $this->nid_photo_url
                    );
                }
                return null;
            }
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
        return $this->verification_status === 'approved';
    }
}