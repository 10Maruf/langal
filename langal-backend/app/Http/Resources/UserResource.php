<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'phone' => $this->phone,
            'user_type' => $this->user_type,
            'user_type_bn' => $this->getUserTypeBn(),
            'is_active' => $this->is_active,
            'is_verified' => $this->is_verified,
            
            // Profile info
            'profile' => $this->whenLoaded('profile', function () {
                return [
                    'full_name' => $this->profile->full_name,
                    'full_name_bn' => $this->profile->full_name_bn,
                    'avatar_url' => $this->profile->avatar_url_full ?? null,
                    'division' => $this->profile->division,
                    'division_bn' => $this->profile->division_bn,
                    'district' => $this->profile->district,
                    'district_bn' => $this->profile->district_bn,
                    'upazila' => $this->profile->upazila,
                    'upazila_bn' => $this->profile->upazila_bn,
                ];
            }),
            
            // Farmer specific
            'farmer' => $this->whenLoaded('farmer', function () {
                return [
                    'farm_size' => $this->farmer->farm_size,
                    'primary_crops' => $this->farmer->primary_crops,
                ];
            }),
            
            // Expert specific
            'expert' => new ExpertResource($this->whenLoaded('expert')),
            
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    /**
     * Get user type in Bangla
     */
    private function getUserTypeBn(): string
    {
        $types = [
            'farmer' => 'কৃষক',
            'customer' => 'ক্রেতা',
            'expert' => 'বিশেষজ্ঞ',
            'data_operator' => 'ডাটা অপারেটর',
            'admin' => 'অ্যাডমিন',
        ];

        return $types[$this->user_type] ?? $this->user_type;
    }
}
