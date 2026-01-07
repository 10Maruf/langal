<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpertResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'expert_id' => $this->expert_id,
            'user_id' => $this->user_id,
            'qualification' => $this->qualification,
            'specialization' => $this->specialization,
            'specialization_bn' => $this->getSpecializationBn(),
            'experience_years' => $this->experience_years,
            'experience_years_bn' => $this->toBanglaNumber($this->experience_years) . ' বছর',
            'institution' => $this->institution,
            'consultation_fee' => $this->consultation_fee,
            'consultation_fee_bn' => '৳' . $this->toBanglaNumber(intval($this->consultation_fee)),
            'rating' => round($this->rating, 1),
            'rating_bn' => $this->toBanglaNumber(round($this->rating, 1)),
            'total_consultations' => $this->total_consultations,
            'total_consultations_bn' => $this->toBanglaNumber($this->total_consultations),
            'is_government_approved' => $this->is_government_approved,
            'license_number' => $this->license_number,
            'certification_document_url' => $this->certification_document_url_full,
            'is_available_for_consultation' => $this->is_available_for_consultation ?? true,
            'response_time_hours' => $this->response_time_hours,
            'bio' => $this->bio,
            'bio_bn' => $this->bio_bn,
            
            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'availability' => AvailabilityResource::collection($this->whenLoaded('availability')),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get specialization in Bangla
     */
    private function getSpecializationBn(): ?string
    {
        $specializations = [
            'crop_disease' => 'ফসলের রোগ বিশেষজ্ঞ',
            'pest_control' => 'কীটপতঙ্গ নিয়ন্ত্রণ বিশেষজ্ঞ',
            'soil_science' => 'মৃত্তিকা বিজ্ঞান বিশেষজ্ঞ',
            'irrigation' => 'সেচ বিশেষজ্ঞ',
            'horticulture' => 'উদ্যানতত্ত্ব বিশেষজ্ঞ',
            'agriculture' => 'কৃষি বিশেষজ্ঞ',
            'livestock' => 'পশুপালন বিশেষজ্ঞ',
            'fisheries' => 'মৎস্য বিশেষজ্ঞ',
            'general' => 'সাধারণ কৃষি বিশেষজ্ঞ',
        ];

        return $specializations[$this->specialization] ?? $this->specialization;
    }

    /**
     * Convert number to Bangla
     */
    private function toBanglaNumber($number): string
    {
        $banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        $englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        return str_replace($englishDigits, $banglaDigits, strval($number));
    }
}
