<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Expert Prescriptions - Advice after consultation
     */
    public function up(): void
    {
        Schema::create('consultation_prescriptions', function (Blueprint $table) {
            $table->increments('prescription_id');
            $table->unsignedInteger('appointment_id');
            $table->integer('expert_id');
            $table->integer('farmer_id');
            
            // Diagnosis
            $table->text('diagnosis')->comment('Problem diagnosis');
            $table->text('diagnosis_bn')->nullable()->comment('Bangla diagnosis');
            
            // Prescription/Advice
            $table->text('prescription')->comment('Recommended treatment/action');
            $table->text('prescription_bn')->nullable()->comment('Bangla prescription');
            
            // Recommendations (JSON array)
            $table->json('recommended_products')->nullable()->comment('[{"name": "...", "dosage": "...", "usage": "..."}]');
            $table->json('recommended_actions')->nullable()->comment('["action1", "action2"]');
            
            // Follow-up
            $table->boolean('follow_up_needed')->default(false);
            $table->date('follow_up_date')->nullable();
            $table->text('follow_up_notes')->nullable();
            
            // Severity
            $table->enum('severity', ['mild', 'moderate', 'severe', 'critical'])->default('moderate');
            
            // Attachments
            $table->json('attachments')->nullable()->comment('Array of attachment URLs');
            
            // Status
            $table->boolean('is_sent_to_farmer')->default(true);
            $table->boolean('is_read_by_farmer')->default(false);
            $table->timestamp('read_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('appointment_id', 'idx_prescription_appointment');
            $table->index('expert_id', 'idx_prescription_expert');
            $table->index('farmer_id', 'idx_prescription_farmer');
            
            // Foreign Keys
            $table->foreign('appointment_id')
                  ->references('appointment_id')
                  ->on('consultation_appointments')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreign('expert_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreign('farmer_id')
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
        Schema::dropIfExists('consultation_prescriptions');
    }
};
