<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Ensure all text columns support Bangla (UTF-8) characters properly
     */
    public function up(): void
    {
        // Set database default charset to utf8mb4 (supports Bangla and all Unicode)
        DB::statement('ALTER DATABASE ' . DB::getDatabaseName() . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        
        // Ensure user_profiles table columns support Bangla
        DB::statement('ALTER TABLE user_profiles 
            MODIFY COLUMN full_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY COLUMN father_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
            MODIFY COLUMN mother_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
            MODIFY COLUMN address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL
        ');
        
        // Ensure farmer_details table columns support Bangla
        DB::statement('ALTER TABLE farmer_details 
            MODIFY COLUMN farm_type VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
            MODIFY COLUMN land_ownership VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse charset changes
    }
};
