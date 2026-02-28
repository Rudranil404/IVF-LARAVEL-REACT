<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'branch_name',
        'branch_address_1',
        'branch_address_2',
        'branch_country',
        'branch_state',
        'branch_zip',
        'branch_contacts',
        'is_active', // ⚠️ CRITICAL: This must be here!
    ];

    protected $casts = [
        'branch_contacts' => 'array',
        'is_active' => 'boolean', // ⚠️ Add this to ensure it casts correctly
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}