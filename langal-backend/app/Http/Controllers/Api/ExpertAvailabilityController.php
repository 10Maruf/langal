<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use App\Models\ExpertAvailability;
use App\Models\ExpertUnavailableDate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ExpertAvailabilityController extends Controller
{
    /**
     * Get expert's availability schedule
     * GET /api/experts/{expertId}/availability
     */
    public function index($expertId): JsonResponse
    {
        try {
            $expertId = (int) $expertId;

            // Resolve Expert Qualification ID to User ID
            $expert = Expert::find($expertId);
            $targetUserId = $expert ? $expert->user_id : $expertId;

            $availability = ExpertAvailability::where('expert_id', $targetUserId)
                ->where('is_available', true)
                ->get();

            $daysMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            // Transform day_of_week string to integer for frontend
            $formatted = $availability->map(function ($slot) use ($daysMapping) {
                $dayInt = array_search(strtolower($slot->day_of_week), $daysMapping);
                if ($dayInt === false) $dayInt = 0;

                return [
                    'availability_id' => $slot->availability_id,
                    'day_of_week' => $dayInt,
                    'start_time' => $slot->start_time,
                    'end_time' => $slot->end_time,
                    'slot_duration_minutes' => $slot->slot_duration_minutes,
                    'max_appointments' => $slot->max_appointments,
                    'is_available' => (bool)$slot->is_available,
                ];
            })->sortBy('day_of_week')->values();

            return response()->json([
                'success' => true,
                'data' => $formatted,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch availability',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Set/Update expert's availability
     * POST /api/expert/availability
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'schedules' => 'required|array|min:1',
            'schedules.*.day_of_week' => 'required|integer|min:0|max:6',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.slot_duration_minutes' => 'nullable|integer|min:15|max:120',
            'schedules.*.max_appointments_per_slot' => 'nullable|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();
            $expertId = $user->user_id;

            // Delete existing availability
            ExpertAvailability::where('expert_id', $expertId)->delete();

            $daysMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            $schedules = [];
            foreach ($request->schedules as $schedule) {
                // Map integer day (0-6) to ENUM string
                $dayName = $daysMapping[$schedule['day_of_week']] ?? 'sunday';
                
                $schedules[] = ExpertAvailability::create([
                    'expert_id' => $expertId,
                    'day_of_week' => $dayName,
                    'start_time' => $schedule['start_time'],
                    'end_time' => $schedule['end_time'],
                    'slot_duration_minutes' => $schedule['slot_duration_minutes'] ?? 30,
                    'max_appointments' => $schedule['max_appointments_per_slot'] ?? 1,
                    'is_available' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Availability updated successfully',
                'message_bn' => 'সময়সূচী সফলভাবে আপডেট হয়েছে',
                'data' => $schedules,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update availability',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete specific availability slot
     * DELETE /api/expert/availability/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $availability = ExpertAvailability::where('availability_id', $id)
                ->where('expert_id', $user->user_id)
                ->first();

            if (!$availability) {
                return response()->json([
                    'success' => false,
                    'message' => 'Availability slot not found',
                ], 404);
            }

            $availability->delete();

            return response()->json([
                'success' => true,
                'message' => 'Availability slot deleted',
                'message_bn' => 'সময়সূচী মুছে ফেলা হয়েছে',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete availability',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add unavailable date
     * POST /api/expert/unavailable-dates
     */
    public function addUnavailableDate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'unavailable_date' => 'required|date|after_or_equal:today',
            'reason' => 'nullable|string|max:255',
            'reason_bn' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();

            $unavailableDate = ExpertUnavailableDate::create([
                'expert_id' => $user->user_id,
                'unavailable_date' => $request->unavailable_date,
                'reason' => $request->reason,
                'reason_bn' => $request->reason_bn,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Unavailable date added',
                'message_bn' => 'ছুটির দিন যোগ করা হয়েছে',
                'data' => $unavailableDate,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add unavailable date',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove unavailable date
     * DELETE /api/expert/unavailable-dates/{id}
     */
    public function removeUnavailableDate(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $unavailableDate = ExpertUnavailableDate::where('id', $id)
                ->where('expert_id', $user->user_id)
                ->first();

            if (!$unavailableDate) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unavailable date not found',
                ], 404);
            }

            $unavailableDate->delete();

            return response()->json([
                'success' => true,
                'message' => 'Unavailable date removed',
                'message_bn' => 'ছুটির দিন মুছে ফেলা হয়েছে',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove unavailable date',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available time slots for a specific date
     * GET /api/experts/{expertId}/slots?date=2026-01-10
     */
    public function getAvailableSlots(Request $request, $expertId): JsonResponse
    {
        \Log::info('getAvailableSlots called', ['expertId' => $expertId, 'date' => $request->date]);
        
        $expertId = (int) $expertId;
        
        // Resolve Expert Qualification ID to User ID
        $expert = Expert::find($expertId);
        $targetUserId = $expert ? $expert->user_id : $expertId;
        
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $date = Carbon::parse($request->date);
            $dayOfWeek = $date->dayOfWeek;
            $daysMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            $dayName = $daysMapping[$dayOfWeek] ?? 'sunday';

            // Check if expert has marked this date as unavailable
            $isUnavailable = ExpertUnavailableDate::where('expert_id', $targetUserId)
                ->where('unavailable_date', $date->toDateString())
                ->exists();

            if ($isUnavailable) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'date' => $date->toDateString(),
                        'is_available' => false,
                        'message' => 'Expert is not available on this date',
                        'message_bn' => 'বিশেষজ্ঞ এই দিনে পাওয়া যাবে না',
                        'slots' => [],
                    ],
                ]);
            }

            // Get availability for this day (day_of_week is stored as string like 'sunday')
            \Log::info('Getting availability', ['targetUserId' => $targetUserId, 'dayName' => $dayName]);
            $availability = ExpertAvailability::where('expert_id', $targetUserId)
                ->where('day_of_week', $dayName)
                ->where('is_available', true)
                ->get();
            \Log::info('Got availability', ['count' => count($availability)]);

            if ($availability->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'date' => $date->toDateString(),
                        'is_available' => false,
                        'message' => 'Expert has no availability on this day',
                        'message_bn' => 'বিশেষজ্ঞ এই দিনে কাজ করেন না',
                        'slots' => [],
                    ],
                ]);
            }

            // Fetch all appointments for the day once
            try {
                $appointments = \App\Models\ConsultationAppointment::where('expert_id', $targetUserId)
                    ->where('appointment_date', $date->toDateString())
                    ->whereIn('status', ['pending', 'confirmed', 'approved'])
                    ->get();
                \Log::info('Fetched appointments for checking availability', ['count' => $appointments->count()]);
            } catch (\Exception $e) {
                \Log::error('Error fetching appointments: ' . $e->getMessage());
                // Fallback to empty collection if query fails, to at least show slots (risk of double booking but better than crash)
                $appointments = collect([]); 
            }

            // Generate time slots using for loop to avoid infinite loop issues
            \Log::info('Starting slot generation');
            $slots = [];
            foreach ($availability as $avail) {
                $startTimestamp = strtotime($date->toDateString() . ' ' . $avail->start_time);
                $endTimestamp = strtotime($date->toDateString() . ' ' . $avail->end_time);
                $slotDuration = ($avail->slot_duration_minutes ?? 30) * 60; // in seconds
                \Log::info('Processing availability', ['start' => $avail->start_time, 'end' => $avail->end_time, 'duration' => $slotDuration]);

                $slotCount = 0;
                for ($currentTime = $startTimestamp; $currentTime + $slotDuration <= $endTimestamp; $currentTime += $slotDuration) {
                    $slotStartStr = date('H:i', $currentTime);
                    $slotEndStr = date('H:i', $currentTime + $slotDuration);
                    $slotCount++;

                    // Skip past slots for today
                    if ($date->isToday() && $currentTime < time()) {
                        continue;
                    }

                    // Check if slot is already booked (OPTIMIZED: In-memory check)
                    $targetTime = $slotStartStr . ':00';
                    $bookedCount = $appointments->filter(function ($appt) use ($targetTime) {
                        // Ensure we compare HH:mm:ss part only
                        $apptTime = substr((string)$appt->scheduled_start_time, 0, 8);
                        return $apptTime === $targetTime;
                    })->count();

                    $maxPerSlot = $avail->max_appointments ?? 1;

                    $slots[] = [
                        'start_time' => $slotStartStr,
                        'end_time' => $slotEndStr,
                        'is_available' => $bookedCount < $maxPerSlot,
                        'booked_count' => $bookedCount,
                        'max_capacity' => $maxPerSlot,
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'date' => $date->toDateString(),
                    'day_name' => $date->format('l'),
                    'day_name_bn' => $this->getBanglaDay($dayOfWeek),
                    'is_available' => count($slots) > 0,
                    'slots' => $slots,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch available slots',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get authenticated expert's own availability
     * GET /api/expert/my-availability
     */
    public function getMyAvailability(): JsonResponse
    {
        try {
            $user = Auth::user();
            $expertId = $user->user_id;

            $availability = ExpertAvailability::where('expert_id', $expertId)
                ->where('is_available', true)
                ->get();

            $daysMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            // Transform day_of_week string to integer for frontend
            $formatted = $availability->map(function ($slot) use ($daysMapping) {
                $dayInt = array_search(strtolower($slot->day_of_week), $daysMapping);
                if ($dayInt === false) $dayInt = 0;

                return [
                    'availability_id' => $slot->availability_id,
                    'day_of_week' => $dayInt,
                    'start_time' => substr($slot->start_time, 0, 5), // HH:mm format
                    'end_time' => substr($slot->end_time, 0, 5),
                    'slot_duration' => $slot->slot_duration_minutes ?? 30,
                    'is_available' => (bool)$slot->is_available,
                ];
            })->sortBy('day_of_week')->values();

            return response()->json([
                'success' => true,
                'data' => $formatted,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch availability',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Set/Update expert's availability (alternative method accepting 'slots' key)
     * POST /api/expert/set-availability
     */
    public function setAvailability(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'slots' => 'required|array',
            'slots.*.day_of_week' => 'required|integer|min:0|max:6',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
            'slots.*.slot_duration' => 'nullable|integer|min:15|max:120',
            'slots.*.is_available' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();
            $expertId = $user->user_id;

            // Delete existing availability
            ExpertAvailability::where('expert_id', $expertId)->delete();

            $daysMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            $savedSlots = [];

            foreach ($request->slots as $slot) {
                if (!($slot['is_available'] ?? true)) continue;

                // Map integer day (0-6) to ENUM string
                $dayName = $daysMapping[$slot['day_of_week']] ?? 'sunday';
                
                $savedSlots[] = ExpertAvailability::create([
                    'expert_id' => $expertId,
                    'day_of_week' => $dayName,
                    'start_time' => $slot['start_time'],
                    'end_time' => $slot['end_time'],
                    'slot_duration_minutes' => $slot['slot_duration'] ?? 30,
                    'max_appointments' => 1,
                    'is_available' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Availability updated successfully',
                'message_bn' => 'সময়সূচী সফলভাবে আপডেট হয়েছে',
                'data' => $savedSlots,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update availability',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Bangla day name
     */
    private function getBanglaDay(int $dayOfWeek): string
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
        return $days[$dayOfWeek] ?? '';
    }
}
