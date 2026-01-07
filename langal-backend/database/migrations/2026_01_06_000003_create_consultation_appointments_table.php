<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Main Appointment Booking Table
     */
    public function up(): void
    {
        Schema::create('consultation_appointments', function (Blueprint $table) {
            $table->increments('appointment_id');
            $table->integer('farmer_id')->comment('FK to users (farmer)');
            $table->integer('expert_id')->comment('FK to users (expert)');
            
            // Scheduling Details
            $table->date('appointment_date');
            $table->time('start_time');
            $table->time('end_time');
            
            // Consultation Type
            $table->string('consultation_type')->default('audio_call');
            
            // Status Management
            $table->string('status')->default('pending');
            
            // Problem Details
            $table->text('problem_description')->nullable();
            $table->text('problem_description_bn')->nullable();
            $table->string('crop_type')->nullable();
            $table->integer('urgency_level')->default(1)->comment('1: Low, 2: Medium, 3: High');
            
            // Notes
            $table->text('farmer_notes')->nullable();
            $table->text('expert_notes')->nullable();
            
            // Cancellation & Rescheduling
            $table->text('cancellation_reason')->nullable();
            $table->integer('cancelled_by')->nullable();
            $table->integer('rescheduled_from')->nullable();
            
            // System
            $table->boolean('reminder_sent')->default(false);
            $table->string('agora_channel_name')->nullable();
            
            $table->timestamps();

            // Foreign keys (assuming users table uses id or user_id)
            // $table->foreign('farmer_id')->references('user_id')->on('users');
            // $table->foreign('expert_id')->references('user_id')->on('users');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('consultation_appointments');
        Schema::enableForeignKeyConstraints();
    }
};
