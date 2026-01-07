<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Push Notification Device Tokens (FCM/APNs)
     */
    public function up(): void
    {
        Schema::create('notification_tokens', function (Blueprint $table) {
            $table->bigIncrements('token_id');
            $table->integer('user_id');
            $table->string('device_token', 500)->comment('FCM/APNs token');
            $table->enum('device_type', ['android', 'ios', 'web']);
            $table->string('device_id', 100)->nullable()->comment('Unique device identifier');
            $table->string('device_name', 100)->nullable();
            $table->string('app_version', 20)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('created_at')->useCurrent();
            
            $table->unique(['user_id', 'device_token'], 'uk_user_device');
            $table->index('user_id', 'idx_token_user');
            $table->index('is_active', 'idx_token_active');
            
            $table->foreign('user_id')
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
        Schema::dropIfExists('notification_tokens');
    }
};
