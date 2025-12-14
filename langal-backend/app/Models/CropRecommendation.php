<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropRecommendation extends Model
{
    use HasFactory;

    protected $table = 'crop_recommendations';
    protected $primaryKey = 'recommendation_id';

    protected $fillable = [
        'farmer_id',
        'location',
        'division',
        'district',
        'upazila',
        'soil_type',
        'season',
        'crop_type',
        'land_size',
        'land_unit',
        'budget',
        'recommended_crops',
        'climate_data',
        'weather_data',
        'soil_analysis',
        'market_analysis',
        'profitability_analysis',
        'crop_images',
        'ai_model',
        'ai_prompt',
        'ai_response',
        'expert_id',
    ];

    protected $casts = [
        'recommended_crops' => 'array',
        'climate_data' => 'array',
        'weather_data' => 'array',
        'soil_analysis' => 'array',
        'market_analysis' => 'array',
        'profitability_analysis' => 'array',
        'crop_images' => 'array',
        'land_size' => 'decimal:2',
        'budget' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    /**
     * Get the farmer that owns this recommendation
     */
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id', 'user_id');
    }

    /**
     * Get the expert that created this recommendation
     */
    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id', 'user_id');
    }

    /**
     * Get selected crops for this recommendation
     */
    public function selectedCrops()
    {
        return $this->hasMany(FarmerSelectedCrop::class, 'recommendation_id', 'recommendation_id');
    }
}
