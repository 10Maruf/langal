<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CallResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'call_id' => $this->call_id,
            'appointment_id' => $this->appointment_id,
            'caller_id' => $this->caller_id,
            'receiver_id' => $this->receiver_id,
            'call_type' => $this->call_type,
            'call_type_bn' => $this->call_type === 'video' ? 'ভিডিও কল' : 'অডিও কল',
            'agora_channel' => $this->agora_channel,
            'status' => $this->status,
            'status_bn' => $this->getStatusBn(),
            'started_at' => $this->started_at?->toISOString(),
            'answered_at' => $this->answered_at?->toISOString(),
            'ended_at' => $this->ended_at?->toISOString(),
            'duration_seconds' => $this->duration_seconds,
            'duration_formatted' => $this->formatDuration(),
            'duration_formatted_bn' => $this->formatDurationBn(),
            'quality_rating' => $this->quality_rating,
            'call_notes' => $this->call_notes,
            
            // Relationships
            'caller' => new UserResource($this->whenLoaded('caller')),
            'receiver' => new UserResource($this->whenLoaded('receiver')),
            'appointment' => new AppointmentResource($this->whenLoaded('appointment')),
        ];
    }

    /**
     * Get status in Bangla
     */
    private function getStatusBn(): string
    {
        $statuses = [
            'ringing' => 'রিং হচ্ছে',
            'ongoing' => 'চলমান',
            'completed' => 'সম্পন্ন',
            'missed' => 'মিস কল',
            'rejected' => 'প্রত্যাখ্যাত',
            'failed' => 'ব্যর্থ',
        ];

        return $statuses[$this->status] ?? $this->status;
    }

    /**
     * Format duration
     */
    private function formatDuration(): string
    {
        if (!$this->duration_seconds) {
            return '0:00';
        }

        $minutes = floor($this->duration_seconds / 60);
        $seconds = $this->duration_seconds % 60;

        return sprintf('%d:%02d', $minutes, $seconds);
    }

    /**
     * Format duration in Bangla
     */
    private function formatDurationBn(): string
    {
        if (!$this->duration_seconds) {
            return '০ মিনিট';
        }

        $minutes = floor($this->duration_seconds / 60);
        $seconds = $this->duration_seconds % 60;

        $banglaMinutes = $this->toBanglaNumber($minutes);
        $banglaSeconds = $this->toBanglaNumber($seconds);

        if ($minutes > 0 && $seconds > 0) {
            return "{$banglaMinutes} মিনিট {$banglaSeconds} সেকেন্ড";
        } elseif ($minutes > 0) {
            return "{$banglaMinutes} মিনিট";
        } else {
            return "{$banglaSeconds} সেকেন্ড";
        }
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
