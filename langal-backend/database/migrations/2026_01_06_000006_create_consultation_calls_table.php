<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Audio/Video Call Records (Agora integration)
     */
    public function up(): void
    {
        Schema::create('consultation_calls', function (Blueprint $table) {
            $table->bigIncrements('call_id');
            $table->unsignedInteger('appointment_id');
            $table->integer('caller_id')->comment('Who initiated the call');
            $table->integer('callee_id')->comment('Who received the call');
            
            // Call Details
            $table->enum('call_type', ['audio', 'video']);
            $table->enum('call_status', [
                'ringing',
                'answered',
                'busy',
                'rejected',
                'missed',
                'ended',
                'failed'
            ])->default('ringing');
            
            // Agora Details
            $table->string('agora_channel', 100);
            $table->string('agora_app_id', 50)->nullable();
            $table->unsignedInteger('caller_uid')->nullable()->comment('Agora UID for caller');
            $table->unsignedInteger('callee_uid')->nullable()->comment('Agora UID for callee');
            
            // Duration & Quality
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->unsignedInteger('max_duration_seconds')->default(1200)->comment('Default 20 min limit');
            $table->decimal('quality_score', 3, 2)->nullable()->comment('Call quality 0-5');
            
            // Timestamps
            $table->timestamp('initiated_at')->useCurrent();
            $table->timestamp('answered_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->enum('end_reason', ['normal', 'timeout', 'network_error', 'user_hangup', 'system'])->nullable();
            
            // Recording (optional future feature)
            $table->boolean('is_recorded')->default(false);
            $table->string('recording_url', 500)->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('appointment_id', 'idx_call_appointment');
            $table->index('caller_id', 'idx_call_caller');
            $table->index('callee_id', 'idx_call_callee');
            $table->index('call_status', 'idx_call_status');
            $table->index('agora_channel', 'idx_call_channel');
            
            // Foreign Keys
            $table->foreign('appointment_id')
                  ->references('appointment_id')
                  ->on('consultation_appointments')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreign('caller_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreign('callee_id')
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
        Schema::dropIfExists('consultation_calls');
    }
};
