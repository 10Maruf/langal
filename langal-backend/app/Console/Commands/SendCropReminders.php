<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\FarmerSelectedCrop;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SendCropReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crops:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily reminders to farmers based on cultivation timeline';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting crop reminder notifications (Optimized)...');

        // 1. Process crops that are due for notification
        $dueCrops = FarmerSelectedCrop::where('status', 'active')
            ->where('notifications_enabled', true)
            ->where('next_notification_date', '<=', now()->toDateString())
            ->get();

        $notificationsSent = 0;

        foreach ($dueCrops as $crop) {
            try {
                $this->processCropNotification($crop);
                $notificationsSent++;
            } catch (\Exception $e) {
                Log::error('Failed to send crop reminder', [
                    'crop_id' => $crop->selection_id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // 2. Self-healing: Initialize next_notification_date for legacy records
        $legacyCrops = FarmerSelectedCrop::where('status', 'active')
            ->where('notifications_enabled', true)
            ->whereNull('next_notification_date')
            ->whereNotNull('cultivation_plan')
            ->whereNotNull('start_date')
            ->get();

        $initializedCount = 0;
        foreach ($legacyCrops as $crop) {
            if ($this->initializeNextNotificationDate($crop)) {
                $initializedCount++;
            }
        }

        $this->info("Sent {$notificationsSent} notifications. Initialized {$initializedCount} legacy records.");
        return Command::SUCCESS;
    }

    private function processCropNotification(FarmerSelectedCrop $crop)
    {
        $startDate = new \DateTime($crop->start_date);
        $startDate->setTime(0, 0, 0); // Normalize to start of day to ensure correct day difference calculation

        $today = new \DateTime();
        $today->setTime(0, 0, 0); // Normalize to start of day

        // Start checking from the scheduled date
        // If next_notification_date is null, default to today (safety fallback)
        $checkDate = $crop->next_notification_date 
            ? new \DateTime($crop->next_notification_date) 
            : (clone $today);
            
        $checkDate->setTime(0, 0, 0);

        // Safety break to prevent infinite loops or spamming too many notifications
        $loopCount = 0;
        $maxLoops = 10; 

        // Loop to catch up on all missed notifications up to today
        while ($checkDate <= $today && $loopCount < $maxLoops) {
            $loopCount++;
            
            // Calculate which "Day X" this date corresponds to (Day 1 = Start Date)
            $dayDiff = $startDate->diff($checkDate)->days;
            $currentDayNum = $dayDiff + 1; 

            $phaseFound = null;
            $nextPhaseDate = null;
            $minDiffToNext = 9999;

            if (is_array($crop->cultivation_plan)) {
                foreach ($crop->cultivation_plan as $phase) {
                    if (!isset($phase['days'])) continue;

                    if (preg_match('/Day (\d+)/i', $phase['days'], $matches)) {
                        $phaseDay = (int)$matches[1];
                        
                        // Check if this phase matches the date we are processing
                        if ($phaseDay == $currentDayNum) {
                            $phaseFound = $phase;
                        }
                        
                        // Find the NEXT phase after the current check date
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

            // Send notification if a phase was scheduled for this date
            if ($phaseFound) {
                $isMissed = $checkDate < $today;
                $this->sendNotification($crop, $phaseFound, $currentDayNum, !$isMissed, $isMissed);
            }

            // Prepare for next iteration
            if ($nextPhaseDate) {
                $checkDate = $nextPhaseDate;
                $crop->next_notification_date = $checkDate;
                $crop->save(); // Save progress step-by-step
            } else {
                // No more future phases found, mark as completed
                $crop->next_notification_date = null;
                $crop->save();
                break; 
            }
        }
    }

    private function initializeNextNotificationDate(FarmerSelectedCrop $crop): bool
    {
        $startDate = new \DateTime($crop->start_date);
        $startDate->setTime(0, 0, 0); // Normalize

        $today = new \DateTime();
        $today->setTime(0, 0, 0); // Normalize

        $elapsedDays = $startDate->diff($today)->days;
        
        $nextDate = null;
        $minDiff = 9999;

        if (is_array($crop->cultivation_plan)) {
            foreach ($crop->cultivation_plan as $phase) {
                if (!isset($phase['days'])) continue;
                if (preg_match('/Day (\d+)/i', $phase['days'], $matches)) {
                    $phaseDay = (int)$matches[1];
                    
                    // Find the first phase that is in the future or today
                    if ($phaseDay >= $elapsedDays) {
                        $diff = $phaseDay - $elapsedDays;
                        if ($diff < $minDiff) {
                            $minDiff = $diff;
                            $nextDate = (clone $today)->modify("+{$diff} days");
                        }
                    }
                }
            }
        }

        if ($nextDate) {
            $crop->next_notification_date = $nextDate;
            $crop->save();
            return true;
        }
        
        return false;
    }

    private function sendNotification(FarmerSelectedCrop $crop, array $phase, int $dayNumber, bool $isToday = false, bool $isMissed = false): void
    {
        $title = $isMissed
            ? "{$crop->crop_name_bn} - Day {$dayNumber}: {$phase['phase']} (পূর্বের কাজ)"
            : ($isToday 
                ? "{$crop->crop_name_bn} - আজ {$phase['phase']}"
                : "{$crop->crop_name_bn} - আগামীকাল {$phase['phase']}");

        $tasks = isset($phase['tasks']) && is_array($phase['tasks']) 
            ? implode(', ', $phase['tasks'])
            : '';

        $message = $isMissed
            ? "আপনার {$crop->crop_name_bn} চাষে Day {$dayNumber} এ {$phase['phase']} এর কাজ করার কথা ছিল। এখনও না করে থাকলে শীঘ্রই করুন। কাজসমূহ: {$tasks}"
            : ($isToday
                ? "আজ আপনার {$crop->crop_name_bn} চাষে {$phase['phase']} পর্যায়ের কাজ করতে হবে। কাজসমূহ: {$tasks}"
                : "আগামীকাল (Day {$dayNumber}) আপনার {$crop->crop_name_bn} চাষে {$phase['phase']} শুরু হবে। প্রস্তুতি নিন। কাজসমূহ: {$tasks}");

        DB::table('notifications')->insert([
            'notification_type' => 'crop_reminder',
            'title' => $title,
            'message' => $message,
            'recipient_id' => $crop->farmer_id,
            'related_entity_id' => (string) $crop->selection_id,
            'is_read' => false,
            'created_at' => now(),
        ]);

        // Update last notification timestamp
        $crop->last_notification_at = now();
        $crop->save();

        $icon = $isMissed ? '📋' : '✓';
        $this->line("{$icon} Sent: {$title} to farmer {$crop->farmer_id}");
    }
}
