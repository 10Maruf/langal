<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationFeedback extends Model
{
    use HasFactory;

    protected $table = 'consultation_feedback';
    protected $primaryKey = 'feedback_id';

    protected $fillable = [
        'appointment_id',
        'farmer_id',
        'expert_id',
        'overall_rating',
        'communication_rating',
        'knowledge_rating',
        'helpfulness_rating',
        'review_text',
        'review_text_bn',
        'is_anonymous',
        'would_recommend',
        'tags',
        'is_reported',
        'report_reason',
        'reported_at',
        'expert_response',
        'expert_response_bn',
        'responded_at',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'overall_rating' => 'integer',
            'communication_rating' => 'integer',
            'knowledge_rating' => 'integer',
            'helpfulness_rating' => 'integer',
            'is_anonymous' => 'boolean',
            'would_recommend' => 'boolean',
            'tags' => 'array',
            'is_reported' => 'boolean',
            'responded_at' => 'datetime',
            'is_featured' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected $appends = ['rating_text', 'rating_text_bn', 'average_sub_rating'];

    /**
     * Get rating text
     */
    public function getRatingTextAttribute(): string
    {
        $texts = [
            1 => 'Poor',
            2 => 'Fair',
            3 => 'Good',
            4 => 'Very Good',
            5 => 'Excellent',
        ];
        return $texts[$this->overall_rating] ?? '';
    }

    /**
     * Get rating text in Bangla
     */
    public function getRatingTextBnAttribute(): string
    {
        $texts = [
            1 => 'খারাপ',
            2 => 'মোটামুটি',
            3 => 'ভালো',
            4 => 'অনেক ভালো',
            5 => 'চমৎকার',
        ];
        return $texts[$this->overall_rating] ?? '';
    }

    /**
     * Get average of sub-ratings
     */
    public function getAverageSubRatingAttribute(): float
    {
        $ratings = array_filter([
            $this->communication_rating,
            $this->knowledge_rating,
            $this->helpfulness_rating,
        ]);
        
        if (empty($ratings)) return 0;
        return round(array_sum($ratings) / count($ratings), 1);
    }

    /**
     * Relationship with Appointment
     */
    public function appointment()
    {
        return $this->belongsTo(ConsultationAppointment::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with Farmer
     */
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id', 'user_id');
    }

    /**
     * Relationship with Expert
     */
    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id', 'user_id');
    }

    /**
     * Scope for featured reviews
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for high ratings (4+)
     */
    public function scopeHighRating($query)
    {
        return $query->where('overall_rating', '>=', 4);
    }

    /**
     * Scope for a specific expert
     */
    public function scopeForExpert($query, int $expertId)
    {
        return $query->where('expert_id', $expertId);
    }

    /**
     * Add expert response
     */
    public function addExpertResponse(string $response, ?string $responseBn = null): void
    {
        $this->update([
            'expert_response' => $response,
            'expert_response_bn' => $responseBn,
            'responded_at' => now(),
        ]);
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(): void
    {
        $this->update(['is_featured' => !$this->is_featured]);
    }

    /**
     * Get farmer display name (considering anonymous)
     */
    public function getFarmerDisplayNameAttribute(): string
    {
        if ($this->is_anonymous) {
            return 'বেনামী কৃষক';
        }
        
        $profile = UserProfile::where('user_id', $this->farmer_id)->first();
        return $profile ? ($profile->full_name_bn ?? $profile->full_name ?? 'কৃষক') : 'কৃষক';
    }
}
