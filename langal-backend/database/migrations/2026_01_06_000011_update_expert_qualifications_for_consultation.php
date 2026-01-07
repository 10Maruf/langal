<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Update expert_qualifications with new columns for consultation system
     */
    public function up(): void
    {
        Schema::table('expert_qualifications', function (Blueprint $table) {
            // Check and add columns if they don't exist
            if (!Schema::hasColumn('expert_qualifications', 'is_available_for_consultation')) {
                $table->boolean('is_available_for_consultation')->default(true)
                      ->comment('Is expert accepting new consultations')
                      ->after('certification_document');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'response_time_hours')) {
                $table->unsignedTinyInteger('response_time_hours')->default(24)
                      ->comment('Typical response time in hours')
                      ->after('is_available_for_consultation');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'total_audio_calls')) {
                $table->unsignedSmallInteger('total_audio_calls')->default(0)
                      ->after('total_consultations');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'total_video_calls')) {
                $table->unsignedSmallInteger('total_video_calls')->default(0)
                      ->after('total_audio_calls');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'total_chat_sessions')) {
                $table->unsignedSmallInteger('total_chat_sessions')->default(0)
                      ->after('total_video_calls');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'average_rating')) {
                $table->decimal('average_rating', 3, 2)->default(0.00)
                      ->after('rating');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'total_reviews')) {
                $table->unsignedSmallInteger('total_reviews')->default(0)
                      ->after('average_rating');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'bio')) {
                $table->text('bio')->nullable()->comment('Expert bio/introduction')
                      ->after('total_reviews');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'bio_bn')) {
                $table->text('bio_bn')->nullable()->comment('Bangla bio')
                      ->after('bio');
            }
            
            if (!Schema::hasColumn('expert_qualifications', 'languages')) {
                $table->json('languages')->nullable()->comment('["bangla", "english"]')
                      ->after('bio_bn');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expert_qualifications', function (Blueprint $table) {
            $columns = [
                'is_available_for_consultation',
                'response_time_hours',
                'total_audio_calls',
                'total_video_calls',
                'total_chat_sessions',
                'average_rating',
                'total_reviews',
                'bio',
                'bio_bn',
                'languages'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('expert_qualifications', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
