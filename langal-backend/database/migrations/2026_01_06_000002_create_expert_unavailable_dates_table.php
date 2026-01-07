<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Expert Unavailable Dates - Expert এর ছুটির দিন
     */
    public function up(): void
    {
        Schema::create('expert_unavailable_dates', function (Blueprint $table) {
            $table->increments('unavailable_id');
            $table->integer('expert_id');
            $table->date('unavailable_date');
            $table->string('reason', 255)->nullable()->comment('Optional reason');
            $table->timestamp('created_at')->useCurrent();
            
            $table->unique(['expert_id', 'unavailable_date'], 'uk_expert_date');
            $table->index('expert_id', 'idx_unavailable_expert');
            $table->index('unavailable_date', 'idx_unavailable_date');
            
            $table->foreign('expert_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expert_unavailable_dates');
    }
};
