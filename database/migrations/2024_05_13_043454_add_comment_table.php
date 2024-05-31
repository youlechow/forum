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
        Schema::create('comment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');  // Adds a foreign key referencing the 'id' in the 'users' table
            $table->foreignId('parent_id');
            $table->integer('likes');
            $table->text('content');
            $table->timestamps();

            // Setting up the foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')
                  ->onDelete('cascade');  // Optional: Specifies that deleting a user will delete their questions
            $table->foreign('parent_id')->references('id')->on('answer')
                ->onDelete('cascade');
                });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment');
    }
};
