<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpertUnavailableDate extends Model
{
    use HasFactory;

    protected $table = 'expert_unavailable_dates';
    protected $primaryKey = 'unavailable_id';

    protected $fillable = [
        'expert_id',
        'unavailable_date',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'unavailable_date' => 'date',
            'created_at' => 'datetime',
        ];
    }

    public $timestamps = false;

    /**
     * Boot method to set created_at
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->created_at = now();
        });
    }

    /**
     * Relationship with Expert
     */
    public function expert()
    {
        return $this->belongsTo(Expert::class, 'expert_id', 'user_id');
    }

    /**
     * Relationship with User (Expert)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'expert_id', 'user_id');
    }

    /**
     * Scope for future dates
     */
    public function scopeFuture($query)
    {
        return $query->where('unavailable_date', '>=', now()->toDateString());
    }

    /**
     * Check if a specific date is unavailable for an expert
     */
    public static function isDateUnavailable(int $expertId, string $date): bool
    {
        return self::where('expert_id', $expertId)
            ->where('unavailable_date', $date)
            ->exists();
    }
}
