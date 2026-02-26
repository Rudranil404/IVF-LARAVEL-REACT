<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $clinicAdminRole = Role::firstOrCreate(['name' => 'clinic_admin', 'guard_name' => 'web']);

        // 2. Create the first Super Admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'super@admin.com'],
            [
                'name' => 'Main Super Admin',
                'password' => Hash::make('password123'), // Default password
            ]
        );

        // 3. Assign Role
        $superAdmin->assignRole($superAdminRole);
    }
}