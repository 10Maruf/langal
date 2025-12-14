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
            $table->decimal('progress_percentage', 5, 2)->default(0)->after('status');
            $table->date('next_action_date')->nullable()->after('progress_percentage');
            $table->text('next_action_description')->nullable()->after('next_action_date');
            $table->date('actual_harvest_date')->nullable()->after('expected_harvest_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_selected_crops', function (Blueprint $table) {
            $table->dropColumn(['progress_percentage', 'next_action_date', 'next_action_description', 'actual_harvest_date']);
        });
    }
};
