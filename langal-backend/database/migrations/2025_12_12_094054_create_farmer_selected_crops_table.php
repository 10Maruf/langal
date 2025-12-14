<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('farmer_selected_crops', function (Blueprint $table) {
            $table->id('selection_id');
            $table->integer('farmer_id'); // Match with users.user_id (int)
            $table->unsignedBigInteger('recommendation_id')->nullable();
            
            // Crop details
            $table->string('crop_name', 100);
            $table->string('crop_name_bn', 100);
            $table->string('crop_type', 50)->nullable();
            $table->string('season', 30)->nullable();
            $table->string('image_url', 500)->nullable();
            
            // Dates
            $table->date('start_date')->nullable();
            $table->date('expected_harvest_date')->nullable();
            
            // Land and financials
            $table->decimal('land_size', 8, 2)->nullable();
            $table->enum('land_unit', ['acre', 'bigha', 'katha'])->default('bigha');
            $table->decimal('estimated_cost', 12, 2)->nullable();
            $table->decimal('estimated_profit', 12, 2)->nullable();
            
            // Status
            $table->enum('status', ['planned', 'active', 'completed', 'cancelled'])->default('planned');
            
            // Cultivation details from AI
            $table->json('cultivation_plan')->nullable();
            $table->json('cost_breakdown')->nullable();
            $table->json('fertilizer_schedule')->nullable();
            
            // Notifications
            $table->boolean('notifications_enabled')->default(true);
            $table->timestamp('last_notification_at')->nullable();
            
            $table->timestamps();
            
            // Foreign keys - without foreign key constraints for flexibility
            // $table->foreign('farmer_id')->references('user_id')->on('users')->onDelete('cascade');
            // $table->foreign('recommendation_id')->references('id')->on('crop_recommendations')->onDelete('set null');
            
            // Indexes
            $table->index('farmer_id');
            $table->index('status');
            $table->index('season');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farmer_selected_crops');
    }
};
