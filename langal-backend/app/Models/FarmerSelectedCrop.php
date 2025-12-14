<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmerSelectedCrop extends Model
{
    use HasFactory;

    protected $table = 'farmer_selected_crops';
    protected $primaryKey = 'selection_id';

    protected $fillable = [
        'farmer_id',
        'recommendation_id',
        'crop_name',
        'crop_name_bn',
        'crop_type',
        'duration_days',
        'yield_per_bigha',
        'market_price',
        'water_requirement',
        'difficulty',
        'description_bn',
        'season',
        'image_url',
        'start_date',
        'expected_harvest_date',
        'actual_harvest_date',
        'land_size',
        'land_unit',
        'estimated_cost',
        'estimated_profit',
        'status',
        'progress_percentage',
        'next_action_date',
        'next_action_description',
        'cultivation_plan',
        'cost_breakdown',
        'fertilizer_schedule',
        'notifications_enabled',
        'last_notification_at',
    ];

    protected $casts = [
        'cultivation_plan' => 'array',
        'cost_breakdown' => 'array',
        'fertilizer_schedule' => 'array',
        'land_size' => 'decimal:2',
        'estimated_cost' => 'decimal:2',
        'estimated_profit' => 'decimal:2',
        'notifications_enabled' => 'boolean',
        'start_date' => 'date',
        'expected_harvest_date' => 'date',
        'last_notification_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the farmer that owns this selection
     */
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id', 'user_id');
    }

    /**
     * Get the recommendation this selection belongs to
     */
    public function recommendation()
    {
        return $this->belongsTo(CropRecommendation::class, 'recommendation_id', 'recommendation_id');
    }

    /**
     * Scope for active crops
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for planned crops
     */
    public function scopePlanned($query)
    {
        return $query->where('status', 'planned');
    }

    /**
     * Scope by season
     */
    public function scopeBySeason($query, string $season)
    {
        return $query->where('season', $season);
    }
}
