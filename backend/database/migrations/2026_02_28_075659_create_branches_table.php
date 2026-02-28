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
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            // Link the branch directly to the clinic
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            
            $table->string('branch_name');
            $table->string('branch_address_1');
            $table->string('branch_address_2')->nullable();
            $table->string('branch_country');
            $table->string('branch_state');
            $table->string('branch_zip');
            
            // ⚠️ We use a JSON column to store the dynamic array of contacts easily!
            $table->json('branch_contacts')->nullable(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
