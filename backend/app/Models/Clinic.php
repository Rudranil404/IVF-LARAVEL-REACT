<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clinic extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'logo_path',
        'contacts',
        'parent_clinic_id',
        'max_branches',
        'expiry_date',
        'first_warning_date',
        'second_warning_date',
        'is_active',
    ];

    protected $casts = [
        'contacts' => 'array',
        'is_active' => 'boolean',
        'expiry_date' => 'date',
        'first_warning_date' => 'date',
        'second_warning_date' => 'date',
    ];

    /**
     * Get the Master Clinic (Parent)
     */
    public function masterClinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class, 'parent_clinic_id');
    }

    /**
     * Get all Sub-Branches (Children)
     * This replaces your old 'Branch::class' call
     */
    public function branches(): HasMany
    {
        return $this->hasMany(Clinic::class, 'parent_clinic_id');
    }

    public function patients(): HasMany
    {
        return $this->hasMany(Patient::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}