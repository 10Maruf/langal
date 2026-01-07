<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationPrescription extends Model
{
    use HasFactory;

    protected $table = 'consultation_prescriptions';
    protected $primaryKey = 'prescription_id';

    protected $fillable = [
        'appointment_id',
        'expert_id',
        'farmer_id',
        'diagnosis',
        'diagnosis_bn',
        'recommended_actions',
        'recommended_actions_bn',
        'medicines',
        'fertilizers',
        'pesticides',
        'irrigation_advice',
        'irrigation_advice_bn',
        'general_tips',
        'general_tips_bn',
        'follow_up_date',
        'follow_up_notes',
        'follow_up_notes_bn',
        'attachments',
        'is_viewed',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'medicines' => 'array',
            'fertilizers' => 'array',
            'pesticides' => 'array',
            'attachments' => 'array',
            'follow_up_date' => 'date',
            'is_viewed' => 'boolean',
            'viewed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected $appends = ['has_follow_up', 'days_until_follow_up'];

    /**
     * Check if prescription has follow-up
     */
    public function getHasFollowUpAttribute(): bool
    {
        return !empty($this->follow_up_date);
    }

    /**
     * Get days until follow-up
     */
    public function getDaysUntilFollowUpAttribute(): ?int
    {
        if (!$this->follow_up_date) return null;
        
        $diff = now()->startOfDay()->diffInDays($this->follow_up_date, false);
        return $diff;
    }

    /**
     * Relationship with Appointment
     */
    public function appointment()
    {
        return $this->belongsTo(ConsultationAppointment::class, 'appointment_id', 'appointment_id');
    }

    /**
     * Relationship with Expert
     */
    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id', 'user_id');
    }

    /**
     * Relationship with Expert Qualifications
     */
    public function expertQualifications()
    {
        return $this->belongsTo(Expert::class, 'expert_id', 'user_id');
    }

    /**
     * Relationship with Farmer
     */
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id', 'user_id');
    }

    /**
     * Mark as viewed
     */
    public function markAsViewed(): void
    {
        if (!$this->is_viewed) {
            $this->update([
                'is_viewed' => true,
                'viewed_at' => now(),
            ]);
        }
    }

    /**
     * Add attachment
     */
    public function addAttachment(string $url, string $type = 'image'): void
    {
        $attachments = $this->attachments ?? [];
        $attachments[] = [
            'url' => $url,
            'type' => $type,
            'added_at' => now()->toISOString(),
        ];
        $this->update(['attachments' => $attachments]);
    }

    /**
     * Add medicine recommendation
     */
    public function addMedicine(string $name, string $dosage, string $frequency, ?string $notes = null): void
    {
        $medicines = $this->medicines ?? [];
        $medicines[] = [
            'name' => $name,
            'dosage' => $dosage,
            'frequency' => $frequency,
            'notes' => $notes,
        ];
        $this->update(['medicines' => $medicines]);
    }

    /**
     * Add fertilizer recommendation
     */
    public function addFertilizer(string $name, string $quantity, string $application_method, ?string $notes = null): void
    {
        $fertilizers = $this->fertilizers ?? [];
        $fertilizers[] = [
            'name' => $name,
            'quantity' => $quantity,
            'application_method' => $application_method,
            'notes' => $notes,
        ];
        $this->update(['fertilizers' => $fertilizers]);
    }

    /**
     * Add pesticide recommendation
     */
    public function addPesticide(string $name, string $concentration, string $application_method, ?string $safety_notes = null): void
    {
        $pesticides = $this->pesticides ?? [];
        $pesticides[] = [
            'name' => $name,
            'concentration' => $concentration,
            'application_method' => $application_method,
            'safety_notes' => $safety_notes,
        ];
        $this->update(['pesticides' => $pesticides]);
    }

    /**
     * Scope for unviewed prescriptions
     */
    public function scopeUnviewed($query)
    {
        return $query->where('is_viewed', false);
    }

    /**
     * Scope for prescriptions with upcoming follow-up
     */
    public function scopeUpcomingFollowUp($query, int $days = 7)
    {
        return $query->whereNotNull('follow_up_date')
            ->where('follow_up_date', '>=', now()->toDateString())
            ->where('follow_up_date', '<=', now()->addDays($days)->toDateString());
    }

    /**
     * Scope for a specific farmer
     */
    public function scopeForFarmer($query, int $farmerId)
    {
        return $query->where('farmer_id', $farmerId);
    }

    /**
     * Scope for a specific expert
     */
    public function scopeForExpert($query, int $expertId)
    {
        return $query->where('expert_id', $expertId);
    }
}
