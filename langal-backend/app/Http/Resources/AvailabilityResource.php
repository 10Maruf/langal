<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailabilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'availability_id' => $this->availability_id,
            'expert_id' => $this->expert_id,
            'day_of_week' => $this->day_of_week,
            'day_name' => $this->getDayName(),
            'day_name_bn' => $this->getDayNameBn(),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'time_range' => $this->getTimeRange(),
            'time_range_bn' => $this->getTimeRangeBn(),
            'slot_duration_minutes' => $this->slot_duration_minutes,
            'max_appointments_per_slot' => $this->max_appointments_per_slot,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get day name in English
     */
    private function getDayName(): string
    {
        $days = [
            0 => 'Sunday',
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
        ];

        return $days[$this->day_of_week] ?? '';
    }

    /**
     * Get day name in Bangla
     */
    private function getDayNameBn(): string
    {
        $days = [
            0 => 'রবিবার',
            1 => 'সোমবার',
            2 => 'মঙ্গলবার',
            3 => 'বুধবার',
            4 => 'বৃহস্পতিবার',
            5 => 'শুক্রবার',
            6 => 'শনিবার',
        ];

        return $days[$this->day_of_week] ?? '';
    }

    /**
     * Get time range
     */
    private function getTimeRange(): string
    {
        $start = date('h:i A', strtotime($this->start_time));
        $end = date('h:i A', strtotime($this->end_time));

        return "{$start} - {$end}";
    }

    /**
     * Get time range in Bangla
     */
    private function getTimeRangeBn(): string
    {
        $startHour = date('h', strtotime($this->start_time));
        $startMinute = date('i', strtotime($this->start_time));
        $startAmPm = date('A', strtotime($this->start_time)) === 'AM' ? 'সকাল' : 'বিকাল';

        $endHour = date('h', strtotime($this->end_time));
        $endMinute = date('i', strtotime($this->end_time));
        $endAmPm = date('A', strtotime($this->end_time)) === 'AM' ? 'সকাল' : 'বিকাল';

        $start = $this->toBanglaNumber($startHour) . ':' . $this->toBanglaNumber($startMinute) . ' ' . $startAmPm;
        $end = $this->toBanglaNumber($endHour) . ':' . $this->toBanglaNumber($endMinute) . ' ' . $endAmPm;

        return "{$start} - {$end}";
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
