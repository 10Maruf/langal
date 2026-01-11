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
            $table->unsignedBigInteger('created_by')->nullable(); // data_operator_id
            $table->timestamps();

            // Index only - will add foreign key constraint later if needed
            $table->index('phone');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_data_farmers');
    }
};
