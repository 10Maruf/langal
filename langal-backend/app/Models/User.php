<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'user_id';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'email',
        'password_hash',
        'user_type',
        'phone',
        'is_verified',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the password for authentication
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /**
     * Check if user is a farmer
     */
    public function isFarmer(): bool
    {
        return $this->user_type === 'farmer';
    }

    /**
     * Check if user is a customer
     */
    public function isCustomer(): bool
    {
        return $this->user_type === 'customer';
    }

    /**
     * Relationship with farmer profile
     */
    public function farmer()
    {
        return $this->hasOne(Farmer::class, 'user_id', 'user_id');
    }

    /**
     * Relationship with customer business details
     */
    public function customerBusiness()
    {
        return $this->hasOne(CustomerBusinessDetail::class, 'user_id', 'user_id');
    }

    /**
     * Relationship with user profile
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'user_id', 'user_id');
    }

    /**
     * Relationship with OTPs
     */
    public function otps()
    {
        return $this->hasMany(Otp::class, 'user_id', 'user_id');
    }
}
