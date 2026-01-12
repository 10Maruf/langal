<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Removes legacy/duplicate columns that have been replaced by new comprehensive fields
     */
    public function up(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            // Remove only columns that exist - check each one before dropping
            if (Schema::hasColumn('field_data_collection', 'land_size')) {
                $table->dropColumn('land_size');
            }
            if (Schema::hasColumn('field_data_collection', 'land_size_unit')) {
                $table->dropColumn('land_size_unit');
            }
            if (Schema::hasColumn('field_data_collection', 'fertilizer_application')) {
                $table->dropColumn('fertilizer_application');
            }
            if (Schema::hasColumn('field_data_collection', 'organic_fertilizer_application')) {
                $table->dropColumn('organic_fertilizer_application');
            }
            if (Schema::hasColumn('field_data_collection', 'production_amount')) {
                $table->dropColumn('production_amount');
            }
            if (Schema::hasColumn('field_data_collection', 'production_unit')) {
                $table->dropColumn('production_unit');
            }
            if (Schema::hasColumn('field_data_collection', 'market_price')) {
                $table->dropColumn('market_price');
            }
            if (Schema::hasColumn('field_data_collection', 'expenses')) {
                $table->dropColumn('expenses');
            }
            if (Schema::hasColumn('field_data_collection', 'ph_value')) {
                $table->dropColumn('ph_value');
            }
            if (Schema::hasColumn('field_data_collection', 'crop_type')) {
                $table->dropColumn('crop_type');
            }
            if (Schema::hasColumn('field_data_collection', 'irrigation_status')) {
                $table->dropColumn('irrigation_status');
            }
            if (Schema::hasColumn('field_data_collection', 'land_service_date')) {
                $table->dropColumn('land_service_date');
            }
            if (Schema::hasColumn('field_data_collection', 'tree_fertilizer_info')) {
                $table->dropColumn('tree_fertilizer_info');
            }
            if (Schema::hasColumn('field_data_collection', 'crop_calculation')) {
                $table->dropColumn('crop_calculation');
            }
            if (Schema::hasColumn('field_data_collection', 'available_resources')) {
                $table->dropColumn('available_resources');
            }
            if (Schema::hasColumn('field_data_collection', 'seminar_name')) {
                $table->dropColumn('seminar_name');
            }
            if (Schema::hasColumn('field_data_collection', 'identity_number')) {
                $table->dropColumn('identity_number');
            }
            if (Schema::hasColumn('field_data_collection', 'collection_year')) {
                $table->dropColumn('collection_year');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            // Restore removed columns if needed
            $table->decimal('land_size', 10, 2)->nullable();
            $table->string('land_size_unit')->default('decimal');
            $table->text('fertilizer_application')->nullable();
            $table->text('organic_fertilizer_application')->nullable();
            $table->decimal('production_amount', 10, 2)->nullable();
            $table->string('production_unit')->default('kg');
            $table->decimal('market_price', 10, 2)->nullable();
            $table->decimal('expenses', 10, 2)->nullable();
            $table->decimal('ph_value', 4, 2)->nullable();
            $table->string('crop_type')->nullable();
            $table->string('irrigation_status')->nullable();
            $table->date('land_service_date')->nullable();
            $table->text('tree_fertilizer_info')->nullable();
            $table->string('crop_calculation')->nullable();
            $table->text('available_resources')->nullable();
            $table->string('seminar_name')->nullable();
            $table->string('identity_number')->nullable();
            $table->year('collection_year')->nullable();
        });
    }
};
