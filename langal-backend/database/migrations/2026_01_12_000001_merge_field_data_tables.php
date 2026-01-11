<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Merges field_data_farmers into field_data_collection table
     * Removes union field as per requirement
     */
    public function up(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            // Drop union column (not needed)
            if (Schema::hasColumn('field_data_collection', 'union')) {
                $table->dropColumn('union');
            }
            
            // Drop manual_farmer_id as we're merging farmer data directly
            if (Schema::hasColumn('field_data_collection', 'manual_farmer_id')) {
                $table->dropColumn('manual_farmer_id');
            }
            
            // Drop farmer_id (no longer linking to users table)
            if (Schema::hasColumn('field_data_collection', 'farmer_id')) {
                $table->dropColumn('farmer_id');
            }
            
            // Add farmer personal info fields (from field_data_farmers)
            $table->string('farmer_nid', 20)->nullable()->after('farmer_phone');
            $table->string('farmer_email', 100)->nullable()->after('farmer_nid');
            $table->date('farmer_dob')->nullable()->after('farmer_email');
            $table->string('farmer_father')->nullable()->after('farmer_dob');
            $table->string('farmer_mother')->nullable()->after('farmer_father');
            $table->string('farmer_occupation', 100)->default('কৃষক')->after('farmer_mother');
            $table->string('farmer_land_ownership', 50)->nullable()->after('farmer_occupation');
        });
        
        // Drop the field_data_farmers table as it's now merged
        Schema::dropIfExists('field_data_farmers');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate field_data_farmers table
        Schema::create('field_data_farmers', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('nid_number', 20)->nullable();
            $table->string('phone', 15);
            $table->string('email', 100)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->text('address')->nullable();
            $table->string('district', 100)->nullable();
            $table->string('upazila', 100)->nullable();
            $table->string('occupation', 100)->default('কৃষক');
            $table->string('land_ownership', 50)->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->index('phone');
            $table->index('created_by');
        });
        
        Schema::table('field_data_collection', function (Blueprint $table) {
            // Remove new farmer columns
            $table->dropColumn([
                'farmer_nid',
                'farmer_email',
                'farmer_dob',
                'farmer_father',
                'farmer_mother',
                'farmer_occupation',
                'farmer_land_ownership'
            ]);
            
            // Restore old columns
            $table->unsignedBigInteger('farmer_id')->nullable();
            $table->unsignedBigInteger('manual_farmer_id')->nullable();
            $table->string('union', 100)->nullable();
        });
    }
};
