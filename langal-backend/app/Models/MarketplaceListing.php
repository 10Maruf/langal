<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketplaceListing extends Model
{
    use HasFactory;

    protected $table = 'marketplace_listings';
    protected $primaryKey = 'listing_id';

    public $timestamps = true; // created_at, updated_at present

    /**
     * Mass-assignable attributes. NOTE: Keep minimal to avoid mismatch with dump omissions.
     */
    protected $fillable = [
        'seller_id',
        'category_id',
        'title',
        'description',
        'price',
        'currency',
        'status',
        'listing_type', // rent / sell / buy / service
        'postal_code', // FK to location table for filtering
        'village', // village name
        'full_location_bn', // full location display string in Bangla
        'contact_phone',
        'contact_email',
        'tags', // JSON array
        'images', // JSON array of image paths
        'is_featured',
        'views_count',
        'saves_count',
        'contacts_count',
        'expires_at',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'price' => 'decimal:2',
        'tags' => 'array',
        'images' => 'array', // Auto JSON encode/decode
        'views_count' => 'integer',
        'saves_count' => 'integer',
        'contacts_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(MarketplaceCategory::class, 'category_id', 'category_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id', 'user_id');
    }

    public function saves(): HasMany
    {
        return $this->hasMany(MarketplaceListingSave::class, 'listing_id', 'listing_id');
    }
}
