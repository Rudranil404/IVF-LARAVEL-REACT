<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\User;
use Carbon\Carbon; // <-- IF THIS WAS MISSING, IT CAUSES THE 500 ERROR
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; // <-- Required for error logging

class ClinicController extends Controller
{
    public function index()
    {
        $clinics = Clinic::whereNull('parent_clinic_id')->with('branches')->get();
        return response()->json($clinics);
    }

    public function provision(Request $request)
    {
        // 1. Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            
            'expiry_date' => 'required|date',
            'max_branches' => 'nullable|integer|min:0',
            
            'clinic_contacts' => 'required|string', 
            
            'has_branch' => 'required|in:true,false,1,0',
            'branch_name' => 'required_if:has_branch,true',
            'branch_address_1' => 'required_if:has_branch,true',
            'branch_country' => 'required_if:has_branch,true',
            'branch_state' => 'required_if:has_branch,true',
            'branch_zip' => 'required_if:has_branch,true',
        ]);

        DB::beginTransaction();

        try {
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('clinics/logos', 'public');
            }

            // SAFE DECODE
            $clinicContacts = json_decode($request->clinic_contacts, true) ?? [];

            // AUTOMATIC DATE CALCULATIONS
            $expiryDate = Carbon::parse($request->expiry_date);
            $firstWarning = $expiryDate->copy()->subMonths(3);
            $secondWarning = $expiryDate->copy()->subWeeks(1);

            // Create Master Clinic
            $clinic = Clinic::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'logo_path' => $logoPath,
                'max_branches' => $request->max_branches ?? 0,
                'expiry_date' => $expiryDate,
                'first_warning_date' => $firstWarning,
                'second_warning_date' => $secondWarning,
                'contacts' => $clinicContacts,
                'is_active' => true,
            ]);

            // Create Clinic Admin
            $adminUser = User::create([
                'name' => 'Admin - ' . $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'clinic_id' => $clinic->id,
            ]);
            $adminUser->assignRole('clinic_admin');

            // Create Branch if requested
            $hasBranch = filter_var($request->has_branch, FILTER_VALIDATE_BOOLEAN);
            if ($hasBranch) {
                $branchContacts = json_decode($request->branch_contacts, true) ?? [];
                $fullBranchAddress = sprintf(
                    "%s %s, %s, %s %s", 
                    $request->branch_address_1, 
                    $request->branch_address_2 ?? '', 
                    $request->branch_state, 
                    $request->branch_country, 
                    $request->branch_zip
                );

                Clinic::create([
                    'name' => $request->branch_name,
                    'email' => $request->email, 
                    'phone' => $branchContacts[0]['phone'] ?? $request->phone,
                    'address' => trim($fullBranchAddress),
                    'parent_clinic_id' => $clinic->id,
                    'logo_path' => $logoPath,
                    'contacts' => $branchContacts,
                    'is_active' => true,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Clinic Environment Provisioned Successfully',
                'clinic' => $clinic->load('branches')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($logoPath)) Storage::disk('public')->delete($logoPath);

            Log::error('Clinic Provisioning Failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Provisioning Failed: ' . $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $clinic = Clinic::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'email' => 'required|email|unique:clinics,email,' . $id,
            'max_branches' => 'required|integer|min:0',
            'expiry_date' => 'required|date',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'clinic_contacts' => 'required|string',
            
            // Branch validation (only if has_branch is true)
            'has_branch' => 'required',
            'branch_name' => 'required_if:has_branch,true',
            'branch_address_1' => 'required_if:has_branch,true',
            'branch_country' => 'required_if:has_branch,true',
            'branch_state' => 'required_if:has_branch,true',
            'branch_zip' => 'required_if:has_branch,true',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('logo')) {
                if ($clinic->logo_path) Storage::disk('public')->delete($clinic->logo_path);
                $clinic->logo_path = $request->file('logo')->store('clinics/logos', 'public');
            }

            $expiryDate = Carbon::parse($request->expiry_date);
            
            // Update Master Clinic
            $clinic->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'max_branches' => $request->max_branches,
                'expiry_date' => $expiryDate,
                'first_warning_date' => $expiryDate->copy()->subMonths(3),
                'second_warning_date' => $expiryDate->copy()->subWeeks(1),
                'contacts' => json_decode($request->clinic_contacts, true),
            ]);

            // Create New Branch if toggled during edit
            if (filter_var($request->has_branch, FILTER_VALIDATE_BOOLEAN)) {
                $branchContacts = json_decode($request->branch_contacts, true) ?? [];
                $fullBranchAddress = sprintf("%s %s, %s, %s %s", $request->branch_address_1, $request->branch_address_2 ?? '', $request->branch_state, $request->branch_country, $request->branch_zip);

                Clinic::create([
                    'name' => $request->branch_name,
                    'email' => $request->email, 
                    'phone' => $branchContacts[0]['phone'] ?? $request->phone,
                    'address' => trim($fullBranchAddress),
                    'parent_clinic_id' => $clinic->id,
                    'logo_path' => $clinic->logo_path,
                    'contacts' => $branchContacts,
                    'is_active' => true,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Clinic updated successfully', 'clinic' => $clinic]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Update failed', 'error' => $e->getMessage()], 500);
        }
    }
    public function impersonate($id)
    {
        $clinic = Clinic::findOrFail($id);

        // 1. Try to find ANY user attached to this clinic
        $clinicAdmin = User::where('clinic_id', $id)->first();

        // 2. SELF-HEALING: If no user exists (due to old broken data), create one dynamically!
        if (!$clinicAdmin) {
            $clinicAdmin = User::create([
                'name' => 'Admin - ' . $clinic->name,
                'email' => 'admin@clinic' . $clinic->id . '.com',
                'password' => Hash::make('password123'),
                'clinic_id' => $clinic->id,
            ]);
        }

        // 3. SELF-HEALING: Forcefully ensure they have the exact correct Sanctum role
        $role = \Spatie\Permission\Models\Role::findOrCreate('clinic_admin', 'sanctum');
        if (!$clinicAdmin->hasRole('clinic_admin')) {
            $clinicAdmin->assignRole($role);
        }

        // 4. Generate the token and teleport the user
        $token = $clinicAdmin->createToken('impersonation')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $clinicAdmin->load('roles', 'clinic')
        ]);
    }
}