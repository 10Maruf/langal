<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrescriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'prescription_id' => $this->prescription_id,
            'appointment_id' => $this->appointment_id,
            'expert_id' => $this->expert_id,
            'farmer_id' => $this->farmer_id,
            'diagnosis' => $this->diagnosis,
            'diagnosis_bn' => $this->diagnosis_bn,
            'prescription_details' => $this->prescription_details,
            'prescription_details_bn' => $this->prescription_details_bn,
            'medications' => $this->medications ? json_decode($this->medications, true) : [],
            'preventive_measures' => $this->preventive_measures,
            'preventive_measures_bn' => $this->preventive_measures_bn,
            'follow_up_required' => $this->follow_up_required,
            'follow_up_date' => $this->follow_up_date?->format('Y-m-d'),
            'follow_up_date_bn' => $this->getFollowUpDateBn(),
            'follow_up_notes' => $this->follow_up_notes,
            'attachments' => $this->getAttachmentUrls(),
            
            // Relationships
            'expert' => new UserResource($this->whenLoaded('expert')),
            'farmer' => new UserResource($this->whenLoaded('farmer')),
            'appointment' => new AppointmentResource($this->whenLoaded('appointment')),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'created_at_bn' => $this->getCreatedAtBn(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get follow up date in Bangla
     */
    private function getFollowUpDateBn(): ?string
    {
        if (!$this->follow_up_date) {
            return null;
        }

        $months = [
            1 => 'জানুয়ারি', 2 => 'ফেব্রুয়ারি', 3 => 'মার্চ',
            4 => 'এপ্রিল', 5 => 'মে', 6 => 'জুন',
            7 => 'জুলাই', 8 => 'আগস্ট', 9 => 'সেপ্টেম্বর',
            10 => 'অক্টোবর', 11 => 'নভেম্বর', 12 => 'ডিসেম্বর',
        ];

        $day = $this->toBanglaNumber($this->follow_up_date->day);
        $month = $months[$this->follow_up_date->month];
        $year = $this->toBanglaNumber($this->follow_up_date->year);

        return "{$day} {$month}, {$year}";
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
     * Get full URLs for attachments
     */
    private function getAttachmentUrls(): array
    {
        if (!$this->attachments) {
            return [];
        }

        $attachments = json_decode($this->attachments, true);
        if (!is_array($attachments)) {
            return [];
        }

        return array_map(function ($path) {
            if (filter_var($path, FILTER_VALIDATE_URL)) {
                return $path;
            }
            
            try {
                return \Illuminate\Support\Facades\Storage::disk('azure')->url($path);
            } catch (\Exception $e) {
                $accountName = config('filesystems.disks.azure.name');
                $container = config('filesystems.disks.azure.container');
                
                if ($accountName && $container) {
                    return sprintf(
                        'https://%s.blob.core.windows.net/%s/%s',
                        $accountName,
                        $container,
                        $path
                    );
                }
                return $path;
            }
        }, $attachments);
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
