<?php

use Carbon\Carbon;

require __DIR__ . '/vendor/autoload.php';

// Mock data from user request
$cropData = [
    'selection_id' => 5,
    'start_date' => "2025-12-14T18:00:00.000000Z", // 14th Dec 6 PM UTC
    'next_notification_date' => "2026-01-15",
    'crop_name_bn' => 'গাজর',
    'cultivation_plan' => [
        // Simulating the plan. Since we don't have the full array, I'll reconstruct a likely plan 
        // that would have a notification on Jan 15 (Day 33).
        ['phase' => 'Phase 1', 'days' => 'Day 1-5', 'tasks' => ['Task 1']],
        ['phase' => 'Phase 2', 'days' => 'Day 33-40', 'tasks' => ['Task 2, check this']], // 33rd day from start
        ['phase' => 'Phase 3', 'days' => 'Day 60', 'tasks' => ['Task 3']],
    ]
];

echo "--- Debugging Notification Logic ---\n";
echo "Start Date Raw: " . $cropData['start_date'] . "\n";
echo "Next Notification Date: " . $cropData['next_notification_date'] . "\n";
echo "Current Date (Simulated): 2026-01-16\n";

// Logic reproduction from SendCropReminders.php
try {
    $startDate = new \DateTime($cropData['start_date']);
    // Note: The original code does not explicitly set timezone on $startDate, so it uses the string's offset (Z=UTC)
    $startDate->setTime(0, 0, 0); // <--- FIX APPLIED
    
    // Original code: $today = new \DateTime();
    // We simulate today as Jan 16
    $today = new \DateTime('2026-01-16');
    $today->setTime(0, 0, 0);

    $checkDate = new \DateTime($cropData['next_notification_date']);
    $checkDate->setTime(0, 0, 0);

    echo "\nStart Date Object: " . $startDate->format('Y-m-d H:i:s P') . "\n";
    echo "Check Date Object: " . $checkDate->format('Y-m-d H:i:s P') . "\n";
    echo "Today Object: " . $today->format('Y-m-d H:i:s P') . "\n";

    echo "\nEntering Loop...\n";
    
    $loopCount = 0;
    while ($checkDate <= $today && $loopCount < 10) {
        $loopCount++;
        echo "\n--- Loop #$loopCount ---\n";
        echo "Checking Date: " . $checkDate->format('Y-m-d') . "\n";
        
        // ISSUE POTENTIAL: DateTime::diff uses UTC for comparisons if timezones differ, or local?
        // Let's see what the diff says.
        $dayDiff = $startDate->diff($checkDate)->days;
        // diff()->days returns total absolute days. It truncates time?
        // If Start is Dec 14 18:00 and Check is Jan 15 00:00.
        // Diff is 31 full days + 6 hours. -> days property is 31?
        // Let's verify.
        
        $currentDayNum = $dayDiff + 1;
        
        echo "Day Diff: $dayDiff\n";
        echo "Calculated Current Day Number: $currentDayNum\n";

        $phaseFound = null;
        $nextPhaseDate = null;
        $minDiffToNext = 9999;

        if (is_array($cropData['cultivation_plan'])) {
            foreach ($cropData['cultivation_plan'] as $phase) {
                if (!isset($phase['days'])) continue;

                if (preg_match('/Day (\d+)/i', $phase['days'], $matches)) {
                    $phaseDay = (int)$matches[1];
                    // echo "  Parsing Phase: {$phase['days']} -> $phaseDay\n"; // Debug
                    
                    if ($phaseDay == $currentDayNum) {
                        $phaseFound = $phase;
                        echo "  MATCH FOUND! Phase: {$phase['phase']}\n";
                    }
                    
                    if ($phaseDay > $currentDayNum) {
                        $diff = $phaseDay - $currentDayNum;
                        if ($diff < $minDiffToNext) {
                            $minDiffToNext = $diff;
                            $nextPhaseDate = (clone $checkDate)->modify("+{$diff} days");
                        }
                    }
                }
            }
        }

        if ($phaseFound) {
            echo "  ACTION: Send Notification for {$phaseFound['phase']}\n";
        } else {
            echo "  ACTION: No phase found for this day.\n";
        }

        if ($nextPhaseDate) {
            echo "  Next Phase Scheduled for: " . $nextPhaseDate->format('Y-m-d') . "\n";
            $checkDate = $nextPhaseDate;
        } else {
            echo "  No future phases. Stop.\n";
            break;
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
