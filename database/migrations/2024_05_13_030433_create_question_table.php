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
        Schema::create('question', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');  // Adds a foreign key referencing the 'id' in the 'users' table
            $table->string('title');
            $table->integer('likes');
            $table->integer('shares');
            $table->text('content');
            $table->timestamps();

            // Setting up the foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')
                  ->onDelete('cascade');  // Optional: Specifies that deleting a user will delete their questions
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question');
    }
};
