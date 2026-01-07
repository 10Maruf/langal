<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Farmer Feedback & Ratings for Experts
     */
    public function up(): void
    {
        Schema::create('consultation_feedback', function (Blueprint $table) {
            $table->increments('feedback_id');
            $table->unsignedInteger('appointment_id');
            $table->integer('farmer_id');
            $table->integer('expert_id');
            
            // Ratings (1-5 stars)
            $table->unsignedTinyInteger('overall_rating')->comment('1-5 stars');
            $table->unsignedTinyInteger('communication_rating')->nullable()->comment('1-5 stars');
            $table->unsignedTinyInteger('knowledge_rating')->nullable()->comment('1-5 stars');
            $table->unsignedTinyInteger('helpfulness_rating')->nullable()->comment('1-5 stars');
            
            // Review
            $table->text('review_text')->nullable();
            $table->text('review_text_bn')->nullable()->comment('Bangla review');
            
            // Moderation
            $table->boolean('is_approved')->default(true)->comment('Admin moderation');
            $table->boolean('is_public')->default(true)->comment('Show on expert profile');
            $table->string('admin_notes', 255)->nullable();
            
            // Response from Expert
            $table->text('expert_response')->nullable();
            $table->timestamp('response_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->unique('appointment_id', 'uk_feedback_appointment');
            $table->index('farmer_id', 'idx_feedback_farmer');
            $table->index('expert_id', 'idx_feedback_expert');
            $table->index('overall_rating', 'idx_feedback_rating');
            $table->index(['expert_id', 'is_approved', 'overall_rating'], 'idx_feedback_expert_approved');
            
            // Foreign Keys
            $table->foreign('appointment_id')
                  ->references('appointment_id')
                  ->on('consultation_appointments')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreign('farmer_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
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
        Schema::dropIfExists('consultation_feedback');
    }
};
