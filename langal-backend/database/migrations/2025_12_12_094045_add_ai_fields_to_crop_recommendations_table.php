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
        Schema::table('crop_recommendations', function (Blueprint $table) {
            // AI related fields
            $table->string('ai_model', 50)->default('gpt-4o-mini')->after('expert_id');
            $table->text('ai_prompt')->nullable()->after('ai_model');
            $table->longText('ai_response')->nullable()->after('ai_prompt');
            
            // Enhanced input fields
            $table->string('crop_type', 50)->nullable()->after('season');
            $table->string('division', 100)->nullable()->after('location');
            $table->string('district', 100)->nullable()->after('division');
            $table->string('upazila', 100)->nullable()->after('district');
            
            // Weather and soil
            $table->json('weather_data')->nullable()->after('climate_data');
            $table->json('soil_analysis')->nullable()->after('weather_data');
            
            // Images from Unsplash
            $table->json('crop_images')->nullable()->after('soil_analysis');
            
            // Index for better query performance
            $table->index('crop_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crop_recommendations', function (Blueprint $table) {
            $table->dropIndex(['crop_type']);
            $table->dropColumn([
                'ai_model',
                'ai_prompt', 
                'ai_response',
                'crop_type',
                'division',
                'district',
                'upazila',
                'weather_data',
                'soil_analysis',
                'crop_images'
            ]);
        });
    }
};
