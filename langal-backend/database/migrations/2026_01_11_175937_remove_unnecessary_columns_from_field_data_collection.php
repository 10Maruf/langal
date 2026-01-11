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
        Schema::table('field_data_collection', function (Blueprint $table) {
            // Remove GPS columns (user requested GPS removal)
            $table->dropColumn(['latitude', 'longitude']);
            
            // Remove unused data collection columns
            $table->dropColumn([
                'livestock_info',
                'tree_fertilizer_info',
                'seminar_name',
                'identity_number',
                'crop_calculation'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            // Restore GPS columns
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Restore removed columns
            $table->string('livestock_info')->nullable();
            $table->text('tree_fertilizer_info')->nullable();
            $table->string('seminar_name')->nullable();
            $table->string('identity_number')->nullable();
            $table->string('crop_calculation')->nullable();
        });
    }
};
