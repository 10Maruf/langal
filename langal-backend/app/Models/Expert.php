<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expert extends Model
{
    use HasFactory;

    protected $table = 'expert_qualifications';
    protected $primaryKey = 'expert_id';

    protected $fillable = [
        'user_id',
        'qualification',
        'specialization',
        'experience_years',
        'institution',
        'consultation_fee',
        'rating',
        'total_consultations',
        'is_government_approved',
        'license_number',
        'certification_document',
    ];

    protected function casts(): array
    {
        return [
            'experience_years' => 'integer',
            'consultation_fee' => 'decimal:2',
            'rating' => 'float',
            'total_consultations' => 'integer',
            'is_government_approved' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected $appends = ['certification_document_url_full'];

    /**
     * Get full URL for certification document
     */
    public function getCertificationDocumentUrlFullAttribute(): ?string
    {
        if ($this->certification_document) {
            if (filter_var($this->certification_document, FILTER_VALIDATE_URL)) {
                return $this->certification_document;
            }
            
            try {
                // Try to get URL from storage
                return \Illuminate\Support\Facades\Storage::disk('azure')->url($this->certification_document);
            } catch (\Exception $e) {
                // Fallback: construct Azure URL manually
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                
                if ($accountName && $container) {
                    return sprintf(
                        'https://%s.blob.core.windows.net/%s/%s',
                        $accountName,
                        $container,
                        $this->certification_document
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
     * Get expert's consultations
     */
    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'expert_id', 'user_id');
    }

    /**
     * Get expert's consultation responses
     */
    public function consultationResponses()
    {
        return $this->hasMany(ConsultationResponse::class, 'expert_id', 'user_id');
    }

    /**
     * Get expert's crop recommendations
     */
    public function cropRecommendations()
    {
        return $this->hasMany(CropRecommendation::class, 'expert_id', 'user_id');
    }
}
