<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->text('address');
            $table->unsignedBigInteger('parent_clinic_id')->nullable(); // For branch management
            $table->integer('max_branches')->default(0); // Super admin limits branches
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('parent_clinic_id')->references('id')->on('clinics')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinics');
    }
};