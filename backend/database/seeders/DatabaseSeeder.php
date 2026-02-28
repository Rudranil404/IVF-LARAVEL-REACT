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
        // 1. Clear Spatie cache before seeding to prevent conflicts
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Create Roles and explicitly set the guard to 'sanctum' (NOT 'web')
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'sanctum']);
        $clinicAdminRole = Role::firstOrCreate(['name' => 'clinic_admin', 'guard_name' => 'sanctum']);

        // 3. Create the first Super Admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'super@admin.com'],
            [
                'name' => 'Main Super Admin',
                'password' => Hash::make('password123'), // Default password
            ]
        );

        // 4. Assign Role
        $superAdmin->assignRole($superAdminRole);
    }
}