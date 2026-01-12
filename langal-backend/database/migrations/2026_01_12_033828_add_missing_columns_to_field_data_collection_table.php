<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds all missing columns for comprehensive field data collection
     */
    public function up(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            // Collection Date
            $table->date('collection_date')->nullable()->after('data_operator_id');
            
            // Crop Information Details
            $table->string('crop_name')->nullable()->after('crop_type');
            $table->string('crop_name_en')->nullable()->after('crop_name');
            $table->string('crop_variety')->nullable()->after('crop_name_en');
            $table->date('planting_date')->nullable()->after('crop_variety');
            $table->date('expected_harvest_date')->nullable()->after('planting_date');
            $table->string('current_growth_stage')->nullable()->after('expected_harvest_date');
            $table->enum('crop_health_status', ['excellent', 'good', 'fair', 'poor', 'critical'])->nullable()->after('current_growth_stage');
            $table->json('diseases_found')->nullable()->after('crop_health_status');
            $table->enum('pest_infestation', ['none', 'low', 'medium', 'high', 'severe'])->nullable()->after('diseases_found');
            $table->enum('disease_severity', ['none', 'low', 'medium', 'high', 'critical'])->nullable()->after('pest_infestation');
            $table->text('secondary_crops')->nullable()->after('season');
            $table->string('crop_frequency')->nullable()->after('secondary_crops');
            $table->text('crop_rotation')->nullable()->after('crop_frequency');
            
            // Land Details (Additional)
            $table->decimal('land_area_in_acres', 10, 2)->nullable()->after('land_size_unit');
            $table->decimal('land_area_in_decimal', 10, 2)->nullable()->after('land_area_in_acres');
            $table->string('land_type')->nullable()->after('land_area_in_decimal')->comment('উঁচু/নিচু/মাঝারি');
            $table->string('land_ownership_type')->nullable()->after('land_type')->comment('নিজস্ব/লিজ/বর্গা');
            $table->decimal('total_land', 10, 2)->nullable()->after('land_ownership_type');
            $table->decimal('cultivable_land', 10, 2)->nullable()->after('total_land');
            $table->integer('number_of_plots')->nullable()->after('cultivable_land');
            $table->enum('is_cultivable', ['yes', 'no'])->nullable()->after('number_of_plots');
            $table->enum('irrigation_facility', ['yes', 'no'])->nullable()->after('irrigation_status');
            $table->string('irrigation_type')->nullable()->after('irrigation_facility')->comment('প্রাকৃতিক/কৃত্রিম');
            $table->string('irrigation_source')->nullable()->after('irrigation_type')->comment('নলকূপ/পুকুর/খাল/বৃষ্টি');
            
            // Seeds Information
            $table->string('seeds_source')->nullable()->after('crop_rotation')->comment('সরকারি/বেসরকারি/নিজস্ব');
            $table->text('seed_dealers')->nullable()->after('seeds_source');
            
            // Chemical Fertilizers (Detailed)
            $table->decimal('urea_amount', 10, 2)->nullable()->after('fertilizer_application')->comment('কেজি');
            $table->decimal('tsp_amount', 10, 2)->nullable()->after('urea_amount')->comment('কেজি');
            $table->decimal('mp_amount', 10, 2)->nullable()->after('tsp_amount')->comment('কেজি');
            $table->decimal('dap_amount', 10, 2)->nullable()->after('mp_amount')->comment('কেজি');
            $table->decimal('gypsum_amount', 10, 2)->nullable()->after('dap_amount')->comment('কেজি');
            $table->decimal('zinc_amount', 10, 2)->nullable()->after('gypsum_amount')->comment('কেজি');
            
            // Organic Fertilizers (Detailed)
            $table->decimal('cow_dung', 10, 2)->nullable()->after('zinc_amount')->comment('কেজি');
            $table->decimal('compost', 10, 2)->nullable()->after('cow_dung')->comment('কেজি');
            $table->decimal('vermicompost', 10, 2)->nullable()->after('compost')->comment('কেজি');
            
            // Pesticides
            $table->text('insecticide_names')->nullable()->after('vermicompost');
            $table->text('fungicide_names')->nullable()->after('insecticide_names');
            $table->text('herbicide_names')->nullable()->after('fungicide_names');
            $table->string('pesticide_usage_amount')->nullable()->after('herbicide_names');
            $table->text('fertilizer_dealers')->nullable()->after('pesticide_usage_amount');
            $table->text('pesticide_dealers')->nullable()->after('fertilizer_dealers');
            
            // Soil & Environment
            $table->string('soil_type')->nullable()->after('ph_value')->comment('দোআঁশ/বেলে/এঁটেল');
            $table->decimal('soil_ph_level', 4, 2)->nullable()->after('soil_type');
            $table->string('soil_moisture_level')->nullable()->after('soil_ph_level');
            $table->decimal('current_temperature', 5, 2)->nullable()->after('soil_moisture_level')->comment('সেলসিয়াস');
            $table->decimal('rainfall_last_7_days', 8, 2)->nullable()->after('current_temperature')->comment('মিলিমিটার');
            
            // Market Information
            $table->decimal('current_market_price', 10, 2)->nullable()->after('market_price');
            $table->decimal('expected_price', 10, 2)->nullable()->after('current_market_price');
            $table->string('local_market_name')->nullable()->after('expected_price');
            $table->decimal('local_market_distance', 8, 2)->nullable()->after('local_market_name')->comment('কিলোমিটার');
            $table->string('distant_market_name')->nullable()->after('local_market_distance');
            $table->decimal('distant_market_distance', 8, 2)->nullable()->after('distant_market_name')->comment('কিলোমিটার');
            $table->string('profitable_market')->nullable()->after('distant_market_distance')->comment('স্থানীয়/দূরবর্তী');
            $table->decimal('transport_cost', 10, 2)->nullable()->after('profitable_market');
            $table->string('agricultural_officer_name')->nullable()->after('transport_cost');
            $table->string('officer_contact')->nullable()->after('agricultural_officer_name');
            $table->text('market_suggestions')->nullable()->after('officer_contact');
            
            // Financial Information (Detailed)
            $table->decimal('seed_cost', 10, 2)->nullable()->after('expenses');
            $table->decimal('fertilizer_cost', 10, 2)->nullable()->after('seed_cost');
            $table->decimal('pesticide_cost', 10, 2)->nullable()->after('fertilizer_cost');
            $table->decimal('labor_cost', 10, 2)->nullable()->after('pesticide_cost');
            $table->decimal('irrigation_cost', 10, 2)->nullable()->after('labor_cost');
            $table->decimal('land_preparation_cost', 10, 2)->nullable()->after('irrigation_cost');
            $table->decimal('equipment_rent', 10, 2)->nullable()->after('land_preparation_cost');
            $table->decimal('transport_cost_production', 10, 2)->nullable()->after('equipment_rent');
            $table->decimal('total_expenses', 10, 2)->nullable()->after('transport_cost_production');
            $table->decimal('total_production', 10, 2)->nullable()->after('production_unit');
            $table->decimal('sold_quantity', 10, 2)->nullable()->after('total_production');
            $table->decimal('sale_price', 10, 2)->nullable()->after('sold_quantity');
            $table->decimal('total_income', 10, 2)->nullable()->after('sale_price');
            $table->decimal('net_profit', 10, 2)->nullable()->after('total_income');
            
            // Additional Disease & Pest Info
            $table->text('disease_name')->nullable()->after('disease_severity');
            $table->text('pest_attack')->nullable()->after('disease_name');
            $table->string('severity_level')->nullable()->after('pest_attack')->comment('কম/মাঝারি/বেশি/অতি বেশি');
            
            // Challenges
            $table->json('challenges')->nullable()->after('severity_level')->comment('সেচ সমস্যা, সার ঘাটতি, বাজার সমস্যা, etc.');
            
            // Farmer Additional Info
            $table->string('farmer_education')->nullable()->after('farmer_land_ownership')->comment('নিরক্ষর/প্রাথমিক/মাধ্যমিক/উচ্চমাধ্যমিক');
            $table->integer('farming_experience')->nullable()->after('farmer_education')->comment('বছর');
            $table->enum('training_received', ['yes', 'no', 'partial'])->nullable()->after('farming_experience');
            $table->enum('bank_loan_taken', ['yes', 'no'])->nullable()->after('training_received');
            $table->decimal('loan_amount', 10, 2)->nullable()->after('bank_loan_taken');
            
            // Follow-up
            $table->enum('follow_up_required', ['yes', 'no'])->nullable()->after('notes');
            $table->date('follow_up_date')->nullable()->after('follow_up_required');
            
            // Data Operator Remarks
            $table->text('data_operator_remarks')->nullable()->after('follow_up_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('field_data_collection', function (Blueprint $table) {
            $table->dropColumn([
                'collection_date',
                'crop_name',
                'crop_name_en',
                'crop_variety',
                'planting_date',
                'expected_harvest_date',
                'current_growth_stage',
                'crop_health_status',
                'diseases_found',
                'pest_infestation',
                'disease_severity',
                'secondary_crops',
                'crop_frequency',
                'crop_rotation',
                'land_area_in_acres',
                'land_area_in_decimal',
                'land_type',
                'land_ownership_type',
                'total_land',
                'cultivable_land',
                'number_of_plots',
                'is_cultivable',
                'irrigation_facility',
                'irrigation_type',
                'irrigation_source',
                'seeds_source',
                'seed_dealers',
                'urea_amount',
                'tsp_amount',
                'mp_amount',
                'dap_amount',
                'gypsum_amount',
                'zinc_amount',
                'cow_dung',
                'compost',
                'vermicompost',
                'insecticide_names',
                'fungicide_names',
                'herbicide_names',
                'pesticide_usage_amount',
                'fertilizer_dealers',
                'pesticide_dealers',
                'soil_type',
                'soil_ph_level',
                'soil_moisture_level',
                'current_temperature',
                'rainfall_last_7_days',
                'current_market_price',
                'expected_price',
                'local_market_name',
                'local_market_distance',
                'distant_market_name',
                'distant_market_distance',
                'profitable_market',
                'transport_cost',
                'agricultural_officer_name',
                'officer_contact',
                'market_suggestions',
                'seed_cost',
                'fertilizer_cost',
                'pesticide_cost',
                'labor_cost',
                'irrigation_cost',
                'land_preparation_cost',
                'equipment_rent',
                'transport_cost_production',
                'total_expenses',
                'total_production',
                'sold_quantity',
                'sale_price',
                'total_income',
                'net_profit',
                'disease_name',
                'pest_attack',
                'severity_level',
                'challenges',
                'farmer_education',
                'farming_experience',
                'training_received',
                'bank_loan_taken',
                'loan_amount',
                'follow_up_required',
                'follow_up_date',
                'data_operator_remarks',
            ]);
        });
    }
};
