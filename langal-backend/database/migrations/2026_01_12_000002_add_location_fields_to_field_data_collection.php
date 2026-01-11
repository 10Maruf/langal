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
            // Add village column if it doesn't exist
            if (!Schema::hasColumn('field_data_collection', 'village')) {
                $table->string('village', 255)->nullable()->after('upazila');
            }
            
            // Add division_bn, district_bn, upazila_bn, post_office, post_office_bn columns
            if (!Schema::hasColumn('field_data_collection', 'division_bn')) {
                $table->string('division_bn', 100)->nullable()->after('division');
            }
            if (!Schema::hasColumn('field_data_collection', 'district_bn')) {
                $table->string('district_bn', 100)->nullable()->after('district');
            }
            if (!Schema::hasColumn('field_data_collection', 'upazila_bn')) {
                $table->string('upazila_bn', 100)->nullable()->after('upazila');
            }
            if (!Schema::hasColumn('field_data_collection', 'post_office')) {
                $table->string('post_office', 100)->nullable()->after('village');
            }
            if (!Schema::hasColumn('field_data_collection', 'post_office_bn')) {
                $table->string('post_office_bn', 100)->nullable()->after('post_office');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            $table->dropColumn(['village', 'division_bn', 'district_bn', 'upazila_bn', 'post_office', 'post_office_bn']);
        });
    }
};
