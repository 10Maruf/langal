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
        // Farmer personal info (merged from field_data_farmers)
        'farmer_name',
        'farmer_phone',
        'farmer_nid',
        'farmer_email',
        'farmer_dob',
        'farmer_father',
        'farmer_mother',
        'farmer_occupation',
        'farmer_land_ownership',
        'farmer_address',
        // Location info
        'division',
        'division_bn',
        'district',
        'district_bn',
        'upazila',
        'upazila_bn',
        'village',
        'post_office',
        'post_office_bn',
        'postal_code',
        // Land details
        'land_size',
        'land_size_unit',
        'land_service_date',
        'irrigation_status',
        // Crop info
        'season',
        'crop_type',
        'production_amount',
        'production_unit',
        // Fertilizer info
        'organic_fertilizer_application',
        'fertilizer_application',
        // Market & financial info
        'market_price',
        'expenses',
        // Additional info
        'ph_value',
        'available_resources',
        'collection_year',
        'notes',
        // Verification
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
        'farmer_dob' => 'date',
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
            $this->upazila,
            $this->district,
            $this->division,
        ]);
        
        return implode(', ', $parts);
    }
}
