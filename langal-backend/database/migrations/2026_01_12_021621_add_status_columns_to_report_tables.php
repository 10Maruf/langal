<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add status columns to post_reports table
        if (!Schema::hasColumn('post_reports', 'status')) {
            Schema::table('post_reports', function (Blueprint $table) {
                $table->string('status')->default('pending')->after('post_type');
                $table->string('reviewed_by')->nullable()->after('status');
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
                $table->text('admin_note')->nullable()->after('reviewed_at');
            });
        }

        // Add status columns to comment_reports table
        if (!Schema::hasColumn('comment_reports', 'status')) {
            Schema::table('comment_reports', function (Blueprint $table) {
                $table->string('status')->default('pending')->after('report_reason');
                $table->string('reviewed_by')->nullable()->after('status');
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
                $table->text('admin_note')->nullable()->after('reviewed_at');
            });
        }
    }

    public function down(): void
    {
        Schema::table('post_reports', function (Blueprint $table) {
            $table->dropColumn(['status', 'reviewed_by', 'reviewed_at', 'admin_note']);
        });

        Schema::table('comment_reports', function (Blueprint $table) {
            $table->dropColumn(['status', 'reviewed_by', 'reviewed_at', 'admin_note']);
        });
    }
};
