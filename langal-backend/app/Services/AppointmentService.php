<?php

namespace App\Services;

use App\Models\ConsultationAppointment;
use App\Models\ExpertAvailability;
use App\Models\ExpertUnavailableDate;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AppointmentService
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get available slots for an expert on a specific date
     */
    public function getAvailableSlots(int $expertId, string $date): array
    {
        $dateObj = Carbon::parse($date);
        $dayOfWeek = $dateObj->dayOfWeek;

        // Check if expert is unavailable on this date
        $isUnavailable = ExpertUnavailableDate::where('expert_id', $expertId)
            ->where('unavailable_date', $date)
            ->exists();

        if ($isUnavailable) {
            return [
                'is_available' => false,
                'reason' => 'Expert is unavailable on this date',
                'slots' => [],
            ];
        }

        // Get availability schedule for this day
        $schedules = ExpertAvailability::where('expert_id', $expertId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->get();

        if ($schedules->isEmpty()) {
            return [
                'is_available' => false,
                'reason' => 'Expert does not work on this day',
                'slots' => [],
            ];
        }

        // Get booked appointments for this date
        $bookedAppointments = ConsultationAppointment::where('expert_id', $expertId)
            ->where('appointment_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get()
            ->groupBy('start_time');

        $slots = [];
        
        foreach ($schedules as $schedule) {
            $startTime = Carbon::parse($date . ' ' . $schedule->start_time);
            $endTime = Carbon::parse($date . ' ' . $schedule->end_time);
            $slotDuration = $schedule->slot_duration_minutes;

            while ($startTime->copy()->addMinutes($slotDuration)->lte($endTime)) {
                $slotStart = $startTime->copy();
                $slotEnd = $startTime->copy()->addMinutes($slotDuration);
                $startTime->addMinutes($slotDuration);

                // Skip past slots for today
                if ($dateObj->isToday() && $slotStart->lt(now())) {
                    continue;
                }

                $timeKey = $slotStart->format('H:i:s');
                $bookedCount = isset($bookedAppointments[$timeKey]) 
                    ? count($bookedAppointments[$timeKey]) 
                    : 0;

                $isAvailable = $bookedCount < $schedule->max_appointments_per_slot;

                $slots[] = [
                    'start_time' => $slotStart->format('H:i'),
                    'end_time' => $slotEnd->format('H:i'),
                    'is_available' => $isAvailable,
                    'remaining_capacity' => $schedule->max_appointments_per_slot - $bookedCount,
                ];
            }
        }

        return [
            'is_available' => count($slots) > 0,
            'slots' => $slots,
        ];
    }

    /**
     * Get upcoming appointments that need reminders
     */
    public function getAppointmentsNeedingReminder(int $minutesBefore = 30): Collection
    {
        $targetTime = now()->addMinutes($minutesBefore);
        
        return ConsultationAppointment::where('status', 'confirmed')
            ->where('appointment_date', $targetTime->toDateString())
            ->where('start_time', $targetTime->format('H:i:s'))
            ->where('reminder_sent', false)
            ->with(['farmer', 'expert.profile'])
            ->get();
    }

    /**
     * Send reminders for upcoming appointments
     */
    public function sendReminders(int $minutesBefore = 30): int
    {
        $appointments = $this->getAppointmentsNeedingReminder($minutesBefore);
        $sentCount = 0;

        foreach ($appointments as $appointment) {
            $expertName = $appointment->expert?->profile?->full_name ?? 'বিশেষজ্ঞ';
            $time = Carbon::parse($appointment->start_time)->format('h:i A');

            // Send to farmer
            $this->notificationService->sendAppointmentReminder(
                $appointment->farmer_id,
                $appointment->appointment_id,
                $expertName,
                $time,
                $minutesBefore
            );

            // Send to expert
            $farmerName = $appointment->farmer?->profile?->full_name ?? 'কৃষক';
            $this->notificationService->sendToUser(
                $appointment->expert_id,
                'পরামর্শের রিমাইন্ডার',
                "{$minutesBefore} মিনিট পরে {$farmerName} এর সাথে আপনার পরামর্শ শুরু হবে",
                [
                    'type' => 'appointment_reminder',
                    'appointment_id' => $appointment->appointment_id,
                ],
                'high'
            );

            // Mark reminder as sent
            $appointment->update(['reminder_sent' => true]);
            $sentCount++;
        }

        return $sentCount;
    }

    /**
     * Auto-cancel no-show appointments
     */
    public function handleNoShows(): int
    {
        $cutoffTime = now()->subMinutes(15);

        $noShows = ConsultationAppointment::where('status', 'confirmed')
            ->where(function ($query) use ($cutoffTime) {
                $query->where('appointment_date', '<', $cutoffTime->toDateString())
                    ->orWhere(function ($q) use ($cutoffTime) {
                        $q->where('appointment_date', $cutoffTime->toDateString())
                            ->where('start_time', '<', $cutoffTime->format('H:i:s'));
                    });
            })
            ->get();

        $count = 0;
        foreach ($noShows as $appointment) {
            // Check if there was any call activity
            $hasCallActivity = $appointment->calls()
                ->whereIn('status', ['ongoing', 'completed'])
                ->exists();

            if (!$hasCallActivity) {
                $appointment->update(['status' => 'no_show']);

                // Notify both parties
                $this->notificationService->sendToUser(
                    $appointment->farmer_id,
                    'পরামর্শ বাতিল',
                    'সময়মতো যোগ না দেওয়ায় পরামর্শ বাতিল হয়েছে',
                    ['type' => 'no_show', 'appointment_id' => $appointment->appointment_id]
                );

                $this->notificationService->sendToUser(
                    $appointment->expert_id,
                    'পরামর্শ বাতিল',
                    'কৃষক যোগ না দেওয়ায় পরামর্শ বাতিল হয়েছে',
                    ['type' => 'no_show', 'appointment_id' => $appointment->appointment_id]
                );

                $count++;
            }
        }

        return $count;
    }

    /**
     * Get appointment statistics for an expert
     */
    public function getExpertStats(int $expertId): array
    {
        $today = now()->toDateString();
        $thisMonth = now()->startOfMonth()->toDateString();

        return [
            'today' => [
                'total' => ConsultationAppointment::where('expert_id', $expertId)
                    ->where('appointment_date', $today)
                    ->count(),
                'pending' => ConsultationAppointment::where('expert_id', $expertId)
                    ->where('appointment_date', $today)
                    ->where('status', 'pending')
                    ->count(),
                'confirmed' => ConsultationAppointment::where('expert_id', $expertId)
                    ->where('appointment_date', $today)
                    ->where('status', 'confirmed')
                    ->count(),
            ],
            'this_month' => [
                'total' => ConsultationAppointment::where('expert_id', $expertId)
                    ->where('appointment_date', '>=', $thisMonth)
                    ->count(),
                'completed' => ConsultationAppointment::where('expert_id', $expertId)
                    ->where('appointment_date', '>=', $thisMonth)
                    ->where('status', 'completed')
                    ->count(),
            ],
            'all_time' => [
                'total' => ConsultationAppointment::where('expert_id', $expertId)->count(),
                'completed' => ConsultationAppointment::where('expert_id', $expertId)
                    ->where('status', 'completed')
                    ->count(),
            ],
        ];
    }

    /**
     * Get appointment statistics for a farmer
     */
    public function getFarmerStats(int $farmerId): array
    {
        return [
            'total' => ConsultationAppointment::where('farmer_id', $farmerId)->count(),
            'completed' => ConsultationAppointment::where('farmer_id', $farmerId)
                ->where('status', 'completed')
                ->count(),
            'upcoming' => ConsultationAppointment::where('farmer_id', $farmerId)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where(function ($query) {
                    $query->where('appointment_date', '>', now()->toDateString())
                        ->orWhere(function ($q) {
                            $q->where('appointment_date', now()->toDateString())
                                ->where('start_time', '>=', now()->format('H:i:s'));
                        });
                })
                ->count(),
        ];
    }

    /**
     * Check if a slot is available
     */
    public function isSlotAvailable(int $expertId, string $date, string $time): bool
    {
        // Check unavailable dates
        $isUnavailable = ExpertUnavailableDate::where('expert_id', $expertId)
            ->where('unavailable_date', $date)
            ->exists();

        if ($isUnavailable) {
            return false;
        }

        // Check availability schedule
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;
        $schedule = ExpertAvailability::where('expert_id', $expertId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->where('start_time', '<=', $time)
            ->where('end_time', '>', $time)
            ->first();

        if (!$schedule) {
            return false;
        }

        // Check existing bookings
        $bookedCount = ConsultationAppointment::where('expert_id', $expertId)
            ->where('appointment_date', $date)
            ->where('start_time', $time . ':00')
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        return $bookedCount < $schedule->max_appointments_per_slot;
    }
}
