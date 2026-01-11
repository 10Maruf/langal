<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FieldDataFarmer extends Model
{
    use HasFactory;

    protected $table = 'field_data_farmers';

    protected $fillable = [
        'full_name',
        'nid_number',
        'phone',
        'email',
        'date_of_birth',
        'father_name',
        'mother_name',
        'address',
        'district',
        'upazila',
        'occupation',
        'land_ownership',
        'created_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the data operator who created this farmer entry
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }
}
