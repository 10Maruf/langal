<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Notification Sending Queue (Background job)
     */
    public function up(): void
    {
        Schema::create('notification_queue', function (Blueprint $table) {
            $table->bigIncrements('queue_id');
            $table->integer('user_id');
            $table->string('notification_type', 50)->comment('appointment_request, call_reminder, etc.');
            $table->enum('channel', ['push', 'sms', 'email', 'in_app'])->default('push');
            
            // Content
            $table->string('title', 255);
            $table->string('title_bn', 255)->nullable();
            $table->text('body');
            $table->text('body_bn')->nullable();
            $table->json('data')->nullable()->comment('Extra payload data');
            $table->string('image_url', 500)->nullable();
            
            // Scheduling
            $table->timestamp('scheduled_at')->useCurrent()->comment('When to send');
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal');
            
            // Status
            $table->enum('status', ['pending', 'sent', 'failed', 'cancelled'])->default('pending');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->unsignedTinyInteger('max_attempts')->default(3);
            $table->timestamp('sent_at')->nullable();
            $table->text('error_message')->nullable();
            
            // Reference
            $table->string('related_entity_type', 50)->nullable()->comment('appointment, message, etc.');
            $table->string('related_entity_id', 50)->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id', 'idx_queue_user');
            $table->index('status', 'idx_queue_status');
            $table->index(['scheduled_at', 'status'], 'idx_queue_scheduled');
            $table->index('notification_type', 'idx_queue_type');
            
            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_queue');
    }
};
