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
            $table->date('next_notification_date')->nullable()->after('last_notification_at')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_selected_crops', function (Blueprint $table) {
            $table->dropColumn('next_notification_date');
        });
    }
};
