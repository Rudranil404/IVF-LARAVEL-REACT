<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('clinic_id'); // Link to the clinic
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('phone');
            $table->date('date_of_birth')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};