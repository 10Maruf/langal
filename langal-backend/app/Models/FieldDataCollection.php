<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FieldDataCollection extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'field_data_collection';

    protected $fillable = [
        'data_operator_id',
        'farmer_id',
        'manual_farmer_id',
        'farmer_name',
        'farmer_address',
        'farmer_phone',
        'land_size',
        'land_size_unit',
        'land_service_date',
        'irrigation_status',
        'season',
        'crop_type',
        'organic_fertilizer_application',
        'fertilizer_application',
        'market_price',
        'ph_value',
        'expenses',
        'production_amount',
        'production_unit',
        'available_resources',
        'collection_year',
        'notes',
        'division',
        'district',
        'upazila',
        'union',
        'village',
        'postal_code',
        'verification_status',
        'verification_notes',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'land_size' => 'decimal:2',
        'market_price' => 'decimal:2',
        'ph_value' => 'decimal:2',
        'expenses' => 'decimal:2',
        'production_amount' => 'decimal:2',
        'land_service_date' => 'date',
        'verified_at' => 'datetime',
        'collection_year' => 'integer',
    ];

    /**
     * Get the data operator who collected the data
     */
    public function dataOperator()
    {
        return $this->belongsTo(User::class, 'data_operator_id');
    }

    /**
     * Get the farmer for whom data was collected
     */
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    /**
     * Get the user who verified the data
     */
    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Scope for pending verification
     */
    public function scopePending($query)
    {
        return $query->where('verification_status', 'pending');
    }

    /**
     * Scope for verified data
     */
    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'verified');
    }

    /**
     * Scope for rejected data
     */
    public function scopeRejected($query)
    {
        return $query->where('verification_status', 'rejected');
    }

    /**
     * Scope for specific data operator
     */
    public function scopeByOperator($query, $operatorId)
    {
        return $query->where('data_operator_id', $operatorId);
    }

    /**
     * Scope for specific farmer
     */
    public function scopeByFarmer($query, $farmerId)
    {
        return $query->where('farmer_id', $farmerId);
    }

    /**
     * Scope for specific year
     */
    public function scopeByYear($query, $year)
    {
        return $query->where('collection_year', $year);
    }

    /**
     * Get full address
     */
    public function getFullAddressAttribute()
    {
        $parts = array_filter([
            $this->village,
            $this->union,
            $this->upazila,
            $this->district,
            $this->division,
        ]);
        
        return implode(', ', $parts);
    }
}
