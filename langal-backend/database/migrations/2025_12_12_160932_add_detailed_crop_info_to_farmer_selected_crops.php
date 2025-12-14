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
        Schema::table('farmer_selected_crops', function (Blueprint $table) {
            $table->integer('duration_days')->nullable()->after('crop_type');
            $table->string('yield_per_bigha', 100)->nullable()->after('duration_days');
            $table->string('market_price', 100)->nullable()->after('yield_per_bigha');
            $table->enum('water_requirement', ['low', 'medium', 'high'])->nullable()->after('market_price');
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->nullable()->after('water_requirement');
            $table->text('description_bn')->nullable()->after('difficulty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_selected_crops', function (Blueprint $table) {
            $table->dropColumn([
                'duration_days',
                'yield_per_bigha',
                'market_price',
                'water_requirement',
                'difficulty',
                'description_bn'
            ]);
        });
    }
};
