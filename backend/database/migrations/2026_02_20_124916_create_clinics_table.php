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
        Schema::create('clinics', function (Blueprint $table) {
            $table->id();
            
            // Core Profile
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('logo_path')->nullable();
            
            // Dynamic Contacts Array (Stores Phone, Name, Position)
            $table->json('contacts')->nullable();
            
            // Branch Architecture (Self-referencing foreign key)
            $table->unsignedBigInteger('parent_clinic_id')->nullable()->comment('Null means this is a Master Clinic');
            
            // Subscription Management
            $table->integer('max_branches')->default(0);
            $table->date('expiry_date')->nullable();
            $table->date('first_warning_date')->nullable();
            $table->date('second_warning_date')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('parent_clinic_id')
                  ->references('id')
                  ->on('clinics')
                  ->onDelete('cascade'); // If master clinic is deleted, branches are deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clinics');
    }
};