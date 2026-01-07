<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'message_id' => $this->message_id,
            'appointment_id' => $this->appointment_id,
            'sender_id' => $this->sender_id,
            'message_type' => $this->message_type,
            'message_type_bn' => $this->getMessageTypeBn(),
            'content' => $this->content,
            'content_bn' => $this->content_bn,
            'media_url' => $this->media_url_full,
            'media_thumbnail' => $this->media_thumbnail,
            'is_read' => $this->is_read,
            'read_at' => $this->read_at?->toISOString(),
            'is_edited' => $this->is_edited,
            'edited_at' => $this->edited_at?->toISOString(),
            'sent_at' => $this->sent_at?->toISOString(),
            'time_ago' => $this->time_ago,
            'time_ago_bn' => $this->time_ago_bn,
            
            // Sender info
            'sender' => new UserResource($this->whenLoaded('sender')),
            
            // Is current user the sender
            'is_mine' => $this->sender_id === request()->user()?->user_id,
        ];
    }

    /**
     * Get message type in Bangla
     */
    private function getMessageTypeBn(): string
    {
        $types = [
            'text' => 'টেক্সট',
            'image' => 'ছবি',
            'audio' => 'অডিও',
            'file' => 'ফাইল',
            'system' => 'সিস্টেম',
        ];

        return $types[$this->message_type] ?? $this->message_type;
    }
}
