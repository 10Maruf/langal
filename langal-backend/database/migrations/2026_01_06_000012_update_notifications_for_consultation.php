<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Update notifications table with new columns for better notification system
     */
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (!Schema::hasColumn('notifications', 'notification_category')) {
                $table->enum('notification_category', [
                    'system',
                    'appointment', 
                    'message',
                    'call',
                    'reminder',
                    'feedback',
                    'prescription',
                    'marketing'
                ])->default('system')->after('notification_type');
            }
            
            if (!Schema::hasColumn('notifications', 'priority')) {
                $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal')
                      ->after('notification_category');
            }
            
            if (!Schema::hasColumn('notifications', 'action_url')) {
                $table->string('action_url', 255)->nullable()->comment('Deep link URL')
                      ->after('priority');
            }
            
            if (!Schema::hasColumn('notifications', 'action_type')) {
                $table->string('action_type', 50)->nullable()
                      ->after('action_url');
            }
            
            if (!Schema::hasColumn('notifications', 'image_url')) {
                $table->string('image_url', 500)->nullable()
                      ->after('action_type');
            }
            
            if (!Schema::hasColumn('notifications', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()
                      ->after('read_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $columns = [
                'notification_category',
                'priority',
                'action_url',
                'action_type',
                'image_url',
                'expires_at'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('notifications', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
