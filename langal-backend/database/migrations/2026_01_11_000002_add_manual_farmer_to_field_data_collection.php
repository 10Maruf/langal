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
            $table->unsignedBigInteger('manual_farmer_id')->nullable()->after('farmer_id');
            
            // Index only - foreign key constraint omitted to avoid issues
            $table->index('manual_farmer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            $table->dropForeign(['manual_farmer_id']);
            $table->dropColumn('manual_farmer_id');
        });
    }
};
