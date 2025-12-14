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
        Schema::table('marketplace_listings', function (Blueprint $table) {
            // Increase location field to 255 to accommodate full Bangla location strings
            // Format: "গ্রাম: X, ডাকঘর: Y, উপজেলা: Z, জেলা: A, বিভাগ: B (পোস্টাল কোড: C)"
            $table->string('location', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marketplace_listings', function (Blueprint $table) {
            $table->string('location', 100)->change();
        });
    }
};
