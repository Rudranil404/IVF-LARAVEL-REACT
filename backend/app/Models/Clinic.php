<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'parent_clinic_id',
        'max_branches',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Get the parent clinic if this is a branch
    public function parentClinic()
    {
        return $this->belongsTo(Clinic::class, 'parent_clinic_id');
    }

    // Get the branches of this clinic
    public function branches()
    {
        return $this->hasMany(Clinic::class, 'parent_clinic_id');
    }

    // Get all patients belonging to this clinic
    public function patients()
    {
        return $this->hasMany(Patient::class);
    }
}