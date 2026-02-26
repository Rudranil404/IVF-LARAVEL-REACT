<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('clinics', function (Blueprint $table) {
        $table->string('logo_path')->nullable()->after('address');
        $table->date('expiry_date')->nullable()->after('max_branches');
        $table->date('first_warning_date')->nullable()->after('expiry_date');
        $table->date('second_warning_date')->nullable()->after('first_warning_date');
    });
}
};
