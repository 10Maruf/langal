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
        $this->info('Starting crop reminder notifications...');

        // Get all active crops
        $activeCrops = FarmerSelectedCrop::where('status', 'active')
            ->whereNotNull('cultivation_plan')
            ->whereNotNull('start_date')
            ->get();

        $notificationsSent = 0;

        foreach ($activeCrops as $crop) {
            try {
                // Check for missed notifications first
                $missedCount = $this->sendMissedReminders($crop);
                $notificationsSent += $missedCount;
                
                // Then send today's notification
                $sent = $this->checkAndSendReminder($crop);
                if ($sent) {
                    $notificationsSent++;
                }
            } catch (\Exception $e) {
                Log::error('Failed to send crop reminder', [
                    'crop_id' => $crop->selection_id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Sent {$notificationsSent} notifications.");
        return Command::SUCCESS;
    }

    private function sendMissedReminders(FarmerSelectedCrop $crop): int
    {
        if (!$crop->cultivation_plan || !is_array($crop->cultivation_plan)) {
            return 0;
        }

        $startDate = new \DateTime($crop->start_date);
        $today = new \DateTime();
        $lastNotification = $crop->last_notification_at 
            ? new \DateTime($crop->last_notification_at) 
            : null;
        
        // If last notification was sent today, skip missed check
        if ($lastNotification && $lastNotification->format('Y-m-d') === $today->format('Y-m-d')) {
            return 0;
        }

        $elapsedDays = $startDate->diff($today)->days;
        $missedCount = 0;

        // Get the last notification day
        $lastNotificationDay = $lastNotification 
            ? $startDate->diff($lastNotification)->days 
            : -1;

        // Check each phase between last notification and today
        foreach ($crop->cultivation_plan as $phase) {
            if (!isset($phase['days'])) continue;

            if (preg_match('/Day (\d+)/', $phase['days'], $matches)) {
                $phaseDay = (int) $matches[1];

                // If this phase was between last notification and today, send it
                if ($phaseDay > $lastNotificationDay && $phaseDay <= $elapsedDays) {
                    // Check if already sent
                    $alreadySent = DB::table('notifications')
                        ->where('recipient_id', $crop->farmer_id)
                        ->where('notification_type', 'crop_reminder')
                        ->where('related_entity_id', (string) $crop->selection_id)
                        ->where('message', 'like', '%' . $phase['phase'] . '%')
                        ->exists();

                    if (!$alreadySent) {
                        $this->sendNotification($crop, $phase, $phaseDay, true, true);
                        $missedCount++;
                        $this->line("📋 Recovered missed notification for Day {$phaseDay}");
                    }
                }
            }
        }

        return $missedCount;
    }

    private function checkAndSendReminder(FarmerSelectedCrop $crop): bool
    {
        if (!$crop->cultivation_plan || !is_array($crop->cultivation_plan)) {
            return false;
        }

        $startDate = new \DateTime($crop->start_date);
        $today = new \DateTime();
        $elapsedDays = $startDate->diff($today)->days;

        // Check each phase in cultivation plan
        foreach ($crop->cultivation_plan as $phase) {
            if (!isset($phase['days'])) continue;

            // Parse day range (e.g., "Day 10-20", "Day 1-30")
            if (preg_match('/Day (\d+)/', $phase['days'], $matches)) {
                $phaseDay = (int) $matches[1];

                // Send notification 1 day before the phase starts
                $reminderDay = $phaseDay - 1;

                if ($elapsedDays == $reminderDay) {
                    // Check if notification already sent for this phase
                    $alreadySent = DB::table('notifications')
                        ->where('recipient_id', $crop->farmer_id)
                        ->where('notification_type', 'crop_reminder')
                        ->where('related_entity_id', (string) $crop->selection_id)
                        ->where('message', 'like', '%' . $phase['phase'] . '%')
                        ->where('created_at', '>=', $today->format('Y-m-d'))
                        ->exists();

                    if (!$alreadySent) {
                        $this->sendNotification($crop, $phase, $phaseDay);
                        return true;
                    }
                }

                // Send notification on the phase day itself
                if ($elapsedDays == $phaseDay) {
                    $alreadySent = DB::table('notifications')
                        ->where('recipient_id', $crop->farmer_id)
                        ->where('notification_type', 'crop_reminder')
                        ->where('related_entity_id', (string) $crop->selection_id)
                        ->where('message', 'like', '%আজ ' . $phase['phase'] . '%')
                        ->where('created_at', '>=', $today->format('Y-m-d'))
                        ->exists();

                    if (!$alreadySent) {
                        $this->sendNotification($crop, $phase, $phaseDay, true);
                        return true;
                    }
                }
            }
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
