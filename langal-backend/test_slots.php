<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing slot generation with booking check...\n";

try {
    $date = '2026-01-11';
    $targetUserId = 71;
    
    $availability = \App\Models\ExpertAvailability::where('expert_id', $targetUserId)
        ->where('day_of_week', 'sunday')
        ->where('is_available', true)
        ->get();
    
    echo "Found " . count($availability) . " availability records\n";
    
    $slots = [];
    foreach ($availability as $avail) {
        echo "\nProcessing: Start={$avail->start_time}, End={$avail->end_time}, Duration={$avail->slot_duration_minutes}min\n";
        
        $startTimestamp = strtotime($date . ' ' . $avail->start_time);
        $endTimestamp = strtotime($date . ' ' . $avail->end_time);
        $slotDuration = ($avail->slot_duration_minutes ?? 30) * 60;
        
        $count = 0;
        for ($currentTime = $startTimestamp; $currentTime + $slotDuration <= $endTimestamp; $currentTime += $slotDuration) {
            $count++;
            $slotStartStr = date('H:i', $currentTime);
            $slotEndStr = date('H:i', $currentTime + $slotDuration);
            
            // Check if slot is already booked
            $bookedCount = \App\Models\ConsultationAppointment::where('expert_id', $targetUserId)
                ->where('scheduled_date', $date)
                ->where('scheduled_start_time', $slotStartStr . ':00')
                ->whereIn('status', ['pending', 'confirmed'])
                ->count();

            $maxPerSlot = $avail->max_appointments ?? 1;
            
            $slots[] = [
                'start_time' => $slotStartStr,
                'end_time' => $slotEndStr,
                'is_available' => $bookedCount < $maxPerSlot,
                'booked_count' => $bookedCount,
                'max_capacity' => $maxPerSlot,
            ];
            
            // Safety limit
            if ($count > 200) {
                echo "  WARNING: Breaking after 200 slots!\n";
                break;
            }
        }
        echo "  Generated $count slots for this availability\n";
    }
    
    echo "\nTotal slots generated: " . count($slots) . "\n";
    echo "First 5 slots:\n";
    for ($i = 0; $i < min(5, count($slots)); $i++) {
        echo "  " . $slots[$i]['start_time'] . " - " . $slots[$i]['end_time'] . " | Available: " . ($slots[$i]['is_available'] ? 'Yes' : 'No') . "\n";
    }
    
    echo "\nDone!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
