<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $data = [
            'feedback_id' => $this->feedback_id,
            'appointment_id' => $this->appointment_id,
            'overall_rating' => $this->overall_rating,
            'overall_rating_bn' => $this->toBanglaNumber($this->overall_rating),
            'communication_rating' => $this->communication_rating,
            'knowledge_rating' => $this->knowledge_rating,
            'helpfulness_rating' => $this->helpfulness_rating,
            'review_text' => $this->review_text,
            'review_text_bn' => $this->review_text_bn,
            'would_recommend' => $this->would_recommend,
            'tags' => $this->tags ? json_decode($this->tags, true) : [],
            'created_at' => $this->created_at?->toISOString(),
            'created_at_bn' => $this->getCreatedAtBn(),
        ];

        // Only include farmer info if not anonymous
        if (!$this->is_anonymous) {
            $data['farmer_id'] = $this->farmer_id;
            $data['farmer'] = new UserResource($this->whenLoaded('farmer'));
        } else {
            $data['farmer_name'] = 'বেনামী';
            $data['is_anonymous'] = true;
        }

        return $data;
    }

    /**
     * Get created at in Bangla format
     */
    private function getCreatedAtBn(): ?string
    {
        if (!$this->created_at) {
            return null;
        }

        $months = [
            1 => 'জানুয়ারি', 2 => 'ফেব্রুয়ারি', 3 => 'মার্চ',
            4 => 'এপ্রিল', 5 => 'মে', 6 => 'জুন',
            7 => 'জুলাই', 8 => 'আগস্ট', 9 => 'সেপ্টেম্বর',
            10 => 'অক্টোবর', 11 => 'নভেম্বর', 12 => 'ডিসেম্বর',
        ];

        $day = $this->toBanglaNumber($this->created_at->day);
        $month = $months[$this->created_at->month];
        $year = $this->toBanglaNumber($this->created_at->year);

        return "{$day} {$month}, {$year}";
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
