<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'name',
        'email',
        'phone',
        'date_of_birth',
    ];

    // Get the clinic this patient belongs to
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }
}