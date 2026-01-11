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
            $table->unsignedBigInteger('farmer_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            $table->unsignedBigInteger('farmer_id')->nullable(false)->change();
        });
    }
};
