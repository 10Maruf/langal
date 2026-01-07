<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Expert Availability - Expert দের available time slots
     */
    public function up(): void
    {
        Schema::create('expert_availability', function (Blueprint $table) {
            $table->increments('availability_id');
            $table->integer('expert_id')->comment('FK to users table (expert)');
            $table->enum('day_of_week', ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
            $table->time('start_time')->comment('Slot start time (e.g., 09:00:00)');
            $table->time('end_time')->comment('Slot end time (e.g., 09:30:00)');
            $table->unsignedSmallInteger('slot_duration_minutes')->default(30)->comment('Duration in minutes');
            $table->unsignedTinyInteger('max_appointments')->default(1)->comment('Max bookings per slot');
            $table->boolean('is_available')->default(true)->comment('1=Available, 0=Blocked');
            $table->json('consultation_types')->nullable()->comment('["audio", "video", "chat"]');
            $table->string('notes', 255)->nullable()->comment('Special notes for this slot');
            $table->timestamps();
            
            $table->index('expert_id', 'idx_expert_availability_expert');
            $table->index('day_of_week', 'idx_expert_availability_day');
            $table->index(['start_time', 'end_time'], 'idx_expert_availability_time');
            
            $table->foreign('expert_id')
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
        Schema::dropIfExists('expert_availability');
    }
};
