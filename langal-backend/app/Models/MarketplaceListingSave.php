<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketplaceListingSave extends Model
{
    use HasFactory;

    protected $table = 'marketplace_listing_saves';
    protected $primaryKey = 'save_id';

    public $timestamps = true; // saved_at acts as created_at; updated_at may not exist
    const CREATED_AT = 'saved_at';
    const UPDATED_AT = null; // no updated_at column

    protected $fillable = [
        'listing_id',
        'user_id',
    ];

    protected $casts = [
        'saved_at' => 'datetime',
    ];

    public function listing()
    {
        return $this->belongsTo(MarketplaceListing::class, 'listing_id', 'listing_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
