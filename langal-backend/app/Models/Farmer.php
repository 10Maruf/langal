<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    use HasFactory;

    protected $table = 'farmer_details';
    protected $primaryKey = 'farmer_id';

    protected $fillable = [
        'user_id',
        'farm_size',
        'farm_size_unit',
        'farm_type',
        'experience_years',
        'land_ownership',
        'registration_date',
        'krishi_card_number',
        'additional_info',
    ];

    protected function casts(): array
    {
        return [
            'farm_size' => 'decimal:2',
            'registration_date' => 'date',
            'additional_info' => 'array',
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
     * Get farmer's consultations
     */
    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'farmer_id', 'user_id');
    }

    /**
     * Get farmer's diagnoses
     */
    public function diagnoses()
    {
        return $this->hasMany(Diagnosis::class, 'farmer_id', 'user_id');
    }
}