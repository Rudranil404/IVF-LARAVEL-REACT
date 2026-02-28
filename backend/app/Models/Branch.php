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
    ];

    // Automatically convert JSON to Array when fetching from DB
    protected $casts = [
        'branch_contacts' => 'array',
    ];

    // Relationship back to Clinic
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}