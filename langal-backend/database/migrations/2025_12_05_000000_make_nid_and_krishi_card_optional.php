<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Make NID number and Krishi Card number optional (nullable)
     * But at least one must be provided (enforced at application level)
     */
    public function up(): void
    {
        // Modify user_profiles table - make nid_number nullable
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('nid_number', 17)->nullable()->change();
        });

        // Modify farmer_details table - make krishi_card_number nullable
        Schema::table('farmer_details', function (Blueprint $table) {
            $table->string('krishi_card_number', 20)->nullable()->change();
        });

        // Drop unique constraint on nid_number if exists and recreate as nullable unique
        DB::statement('ALTER TABLE user_profiles DROP INDEX IF EXISTS nid_number');
        DB::statement('ALTER TABLE user_profiles ADD UNIQUE KEY nid_number (nid_number)');
        
        // Drop unique constraint on krishi_card_number if exists and recreate as nullable unique
        DB::statement('ALTER TABLE farmer_details DROP INDEX IF EXISTS krishi_card_number');
        DB::statement('ALTER TABLE farmer_details ADD UNIQUE KEY krishi_card_number (krishi_card_number)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: Reversing this migration might fail if there are NULL values in the database
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('nid_number', 17)->nullable(false)->change();
        });

        Schema::table('farmer_details', function (Blueprint $table) {
            $table->string('krishi_card_number', 20)->nullable(false)->change();
        });
    }
};
