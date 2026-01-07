<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Conversation Participants - Track who's in each conversation
     */
    public function up(): void
    {
        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->bigIncrements('participant_id');
            $table->string('conversation_id', 50);
            $table->integer('user_id');
            $table->enum('role', ['farmer', 'expert']);
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('last_read_at')->nullable();
            $table->unsignedBigInteger('last_message_id')->nullable();
            $table->boolean('is_muted')->default(false);
            $table->boolean('is_blocked')->default(false);
            $table->boolean('is_archived')->default(false);
            
            $table->unique(['conversation_id', 'user_id'], 'uk_conversation_user');
            $table->index('user_id', 'idx_participant_user');
            $table->index('conversation_id', 'idx_participant_conversation');
            
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
        Schema::dropIfExists('conversation_participants');
    }
};
