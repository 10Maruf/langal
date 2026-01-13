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
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])
                  ->default('pending')
                  ->after('is_deleted')
                  ->comment('Post approval status by data operator');
            $table->integer('approved_by')->nullable()->after('approval_status')->comment('Data operator who approved/rejected');
            $table->timestamp('approved_at')->nullable()->after('approved_by')->comment('When the post was approved/rejected');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['approval_status', 'approved_by', 'approved_at']);
        });
    }
};
