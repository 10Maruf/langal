<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'appointment_id' => $this->appointment_id,
            'farmer_id' => $this->farmer_id,
            'expert_id' => $this->expert_id,
            'appointment_date' => $this->appointment_date?->format('Y-m-d'),
            'appointment_date_bn' => $this->getBanglaDate(),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'consultation_type' => $this->consultation_type,
            'consultation_type_bn' => $this->type_bn,
            'status' => $this->status,
            'status_bn' => $this->status_bn,
            'problem_description' => $this->problem_description,
            'problem_description_bn' => $this->problem_description_bn,
            'crop_type' => $this->crop_type,
            'urgency_level' => $this->urgency_level,
            'urgency_level_bn' => $this->urgency_level_bn,
            'farmer_notes' => $this->farmer_notes,
            'expert_notes' => $this->expert_notes,
            'cancellation_reason' => $this->cancellation_reason,
            'rescheduled_from' => $this->rescheduled_from,
            'agora_channel_name' => $this->agora_channel_name,
            
            // Relationships
            'farmer' => new UserResource($this->whenLoaded('farmer')),
            'expert' => new UserResource($this->whenLoaded('expert')),
            'expert_qualification' => new ExpertResource($this->whenLoaded('expertQualification')),
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
            'prescription' => new PrescriptionResource($this->whenLoaded('prescription')),
            'feedback' => new FeedbackResource($this->whenLoaded('feedback')),
            'calls' => CallResource::collection($this->whenLoaded('calls')),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get Bangla formatted date
     */
    private function getBanglaDate(): ?string
    {
        if (!$this->appointment_date) {
            return null;
        }

        $months = [
            1 => 'জানুয়ারি', 2 => 'ফেব্রুয়ারি', 3 => 'মার্চ',
            4 => 'এপ্রিল', 5 => 'মে', 6 => 'জুন',
            7 => 'জুলাই', 8 => 'আগস্ট', 9 => 'সেপ্টেম্বর',
            10 => 'অক্টোবর', 11 => 'নভেম্বর', 12 => 'ডিসেম্বর',
        ];

        $day = $this->toBanglaNumber($this->appointment_date->day);
        $month = $months[$this->appointment_date->month];
        $year = $this->toBanglaNumber($this->appointment_date->year);

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
