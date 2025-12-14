<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketplaceCategory extends Model
{
    use HasFactory;

    protected $table = 'marketplace_categories';
    protected $primaryKey = 'category_id';

    public $timestamps = true; // created_at, updated_at exist per SQL dump

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id', 'category_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id', 'category_id');
    }

    public function listings()
    {
        return $this->hasMany(MarketplaceListing::class, 'category_id', 'category_id');
    }
}
