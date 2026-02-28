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
        'parent_clinic_id', // Links a branch to its master clinic
        'logo_path',        // Path to the uploaded logo
        'contacts',         // JSON Array of dynamic phone numbers/roles
        'max_branches',
        'expiry_date',
        'first_warning_date',
        'second_warning_date',
        'is_active',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'is_active' => 'boolean',
        'contacts' => 'array', // Magic: Auto-handles JSON encode/decode
        'expiry_date' => 'date',
        'first_warning_date' => 'date',
        'second_warning_date' => 'date',
    ];

    /**
     * Get the parent clinic if this is a branch (Legacy/Self-referential).
     */
    public function parentClinic()
    {
        return $this->belongsTo(Clinic::class, 'parent_clinic_id');
    }

    /**
     * Get all patients belonging to this clinic.
     */
    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    /**
     * Get all system users/admins associated with this clinic.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get all branch locations associated with this clinic.
     */
    public function branches()
    {
        return $this->hasMany(Branch::class);
    }
}