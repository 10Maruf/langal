<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Chat/Messaging System between farmer & expert
     */
    public function up(): void
    {
        Schema::create('consultation_messages', function (Blueprint $table) {
            $table->bigIncrements('message_id');
            $table->unsignedInteger('appointment_id')->nullable()->comment('FK to appointment (optional)');
            $table->string('conversation_id', 50)->comment('Unique conversation ID');
            $table->integer('sender_id');
            $table->integer('receiver_id');
            
            // Message Content
            $table->enum('message_type', ['text', 'image', 'audio', 'file', 'system'])->default('text');
            $table->text('content');
            $table->string('attachment_url', 500)->nullable();
            $table->string('attachment_type', 50)->nullable()->comment('MIME type');
            $table->string('attachment_name', 255)->nullable();
            $table->unsignedInteger('attachment_size')->nullable()->comment('File size in bytes');
            
            // Status
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->integer('deleted_by')->nullable();
            
            // Metadata
            $table->unsignedBigInteger('reply_to_message_id')->nullable()->comment('For reply feature');
            $table->json('metadata')->nullable()->comment('Extra data (e.g., image dimensions)');
            
            $table->timestamps();
            
            // Indexes
            $table->index('conversation_id', 'idx_message_conversation');
            $table->index('sender_id', 'idx_message_sender');
            $table->index('receiver_id', 'idx_message_receiver');
            $table->index('appointment_id', 'idx_message_appointment');
            $table->index('created_at', 'idx_message_created');
            $table->index(['receiver_id', 'is_read'], 'idx_message_unread');
            $table->index(['receiver_id', 'is_read', 'created_at'], 'idx_messages_unread');
            
            // Foreign Keys
            $table->foreign('sender_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreign('receiver_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->foreign('appointment_id')
                  ->references('appointment_id')
                  ->on('consultation_appointments')
                  ->onDelete('set null')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_messages');
    }
};
