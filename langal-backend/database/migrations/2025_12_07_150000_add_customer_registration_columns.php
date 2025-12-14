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
        // Add custom_business_type column to customer_business_details
        Schema::table('customer_business_details', function (Blueprint $table) {
            if (!Schema::hasColumn('customer_business_details', 'custom_business_type')) {
                $table->string('custom_business_type', 100)->nullable()->after('business_type')
                    ->comment('Custom business type when business_type is "other"');
            }
        });

        // Add nid_photo_url column to user_profiles
        Schema::table('user_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('user_profiles', 'nid_photo_url')) {
                $table->string('nid_photo_url', 255)->nullable()->after('profile_photo_url')
                    ->comment('NID photo URL for verification');
            }
            if (!Schema::hasColumn('user_profiles', 'village')) {
                $table->string('village', 100)->nullable()->after('postal_code')
                    ->comment('Village/Area name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_business_details', function (Blueprint $table) {
            if (Schema::hasColumn('customer_business_details', 'custom_business_type')) {
                $table->dropColumn('custom_business_type');
            }
        });

        Schema::table('user_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('user_profiles', 'nid_photo_url')) {
                $table->dropColumn('nid_photo_url');
            }
        });
    }
};
