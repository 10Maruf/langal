<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerBusinessDetail extends Model
{
    use HasFactory;

    protected $table = 'customer_business_details';
    protected $primaryKey = 'business_id';

    /**
     * Valid business types for customers
     */
    public const BUSINESS_TYPES = [
        'retailer' => 'খুচরা বিক্রেতা',
        'wholesaler' => 'পাইকারি বিক্রেতা',
        'processor' => 'প্রক্রিয়াজাতকারী',
        'exporter' => 'রপ্তানিকারক',
        'restaurant' => 'রেস্টুরেন্ট',
        'hotel' => 'হোটেল',
        'supermarket' => 'সুপারমার্কেট',
        'grocery' => 'মুদি দোকান',
        'agro_industry' => 'কৃষি শিল্প',
        'food_processing' => 'খাদ্য প্রক্রিয়াজাতকরণ',
        'cold_storage' => 'হিমাগার',
        'transport' => 'পরিবহন',
        'other' => 'অন্যান্য',
    ];

    protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'custom_business_type',
        'trade_license_number',
        'business_address',
        'established_year',
    ];

    protected function casts(): array
    {
        return [
            'established_year' => 'integer',
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
     * Get the display name for the business type
     */
    public function getBusinessTypeDisplayAttribute(): string
    {
        if ($this->business_type === 'other' && $this->custom_business_type) {
            return $this->custom_business_type;
        }
        
        return self::BUSINESS_TYPES[$this->business_type] ?? $this->business_type;
    }

    /**
     * Check if business type is valid
     */
    public static function isValidBusinessType(string $type): bool
    {
        return array_key_exists($type, self::BUSINESS_TYPES);
    }

    /**
     * Get all business types for dropdown
     */
    public static function getBusinessTypesForDropdown(): array
    {
        $types = [];
        foreach (self::BUSINESS_TYPES as $key => $label) {
            $types[] = [
                'value' => $key,
                'label' => $label,
            ];
        }
        return $types;
    }
}
