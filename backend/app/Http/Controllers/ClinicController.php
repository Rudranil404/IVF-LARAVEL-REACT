<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ClinicController extends Controller
{
    /**
     * Display a listing of all clinics (for Super Admin dashboard)
     */
    public function index()
    {
        // Return main clinics with their branches
        $clinics = Clinic::whereNull('parent_clinic_id')->with('branches')->get();
        return response()->json($clinics);
    }

    /**
     * Enterprise Provisioning: Creates Clinic, Admin User, and optional Branch in one Transaction.
     */
    public function provision(Request $request)
    {
        // 1. Validate the massive payload
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048', // 2MB max
            
            // User validations
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed', // Must match password_confirmation
            
            // Subscription validations
            'max_branches' => 'required|integer|min:0',
            'expiry_date' => 'required|date',
            'first_warning_date' => 'required|date',
            'second_warning_date' => 'required|date',
            
            // Contacts Array (Sent as JSON string from React FormData)
            'clinic_contacts' => 'required|string', 
            
            // Branch validation (conditional)
            'has_branch' => 'required|in:true,false,1,0',
            'branch_name' => 'required_if:has_branch,true',
            'branch_address_1' => 'required_if:has_branch,true',
            'branch_country' => 'required_if:has_branch,true',
            'branch_state' => 'required_if:has_branch,true',
            'branch_zip' => 'required_if:has_branch,true',
        ]);

        // Start Database Transaction
        DB::beginTransaction();

        try {
            // 2. Handle File Upload (Logo)
            $logoPath = null;
            if ($request->hasFile('logo')) {
                // Stores in storage/app/public/clinics/logos
                $logoPath = $request->file('logo')->store('clinics/logos', 'public');
            }

            // 3. Decode the JSON contacts sent from React
            $clinicContacts = json_decode($request->clinic_contacts, true);

            // 4. Create the Master Tenant (Clinic)
            $clinic = Clinic::create([
                'name' => $request->name,
                'email' => $request->email, // Primary contact email
                'phone' => $request->phone,
                'address' => $request->address,
                'logo_path' => $logoPath,
                'max_branches' => $request->max_branches,
                'expiry_date' => $request->expiry_date,
                'first_warning_date' => $request->first_warning_date,
                'second_warning_date' => $request->second_warning_date,
                'contacts' => $clinicContacts, // Requires JSON casting in Clinic Model
                'is_active' => true,
            ]);

            // 5. Create the default Clinic Admin User
            $adminUser = User::create([
                'name' => 'Admin - ' . $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'clinic_id' => $clinic->id,
            ]);
            
            // Assign Spatie Role
            $adminUser->assignRole('clinic_admin');

            // 6. Conditionally Create the Branch Clinic
            $hasBranch = filter_var($request->has_branch, FILTER_VALIDATE_BOOLEAN);
            
            if ($hasBranch) {
                $branchContacts = json_decode($request->branch_contacts, true);
                
                // Format the full address from the separate fields
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
                    'phone' => $branchContacts[0]['phone'] ?? $request->phone, // Use first contact's phone or fallback
                    'address' => trim($fullBranchAddress),
                    'parent_clinic_id' => $clinic->id, // Link to master clinic
                    'logo_path' => $logoPath, // Inherit logo
                    'contacts' => $branchContacts,
                    'is_active' => true,
                ]);
            }

            // If everything succeeded, commit the data to the DB
            DB::commit();

            return response()->json([
                'message' => 'Clinic Environment Provisioned Successfully',
                'clinic' => $clinic->load('branches')
            ], 201);

        } catch (\Exception $e) {
            // If anything fails (like a DB error), rollback so we don't have broken data
            DB::rollBack();
            
            // Delete the uploaded logo if DB creation failed to save disk space
            if (isset($logoPath)) Storage::disk('public')->delete($logoPath);

            return response()->json([
                'message' => 'Provisioning Failed due to Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Impersonation feature: Super Admin logs in as the Clinic Admin without a password.
     */
    public function impersonate($id)
    {
        // Ensure only Super Admins can do this
        if (!auth()->user()->hasRole('super_admin')) {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        // Find the specific clinic
        $clinic = Clinic::findOrFail($id);

        // Find the primary administrator user for this specific clinic
        $clinicAdmin = User::where('clinic_id', $clinic->id)->role('clinic_admin')->first();

        if (!$clinicAdmin) {
            return response()->json(['message' => 'This clinic does not have an active administrator account.'], 404);
        }

        // Generate a new temporary Sanctum token for the Clinic Admin
        $token = $clinicAdmin->createToken('impersonation_token')->plainTextToken;

        return response()->json([
            'message' => 'Impersonation successful',
            'access_token' => $token,
            'user' => $clinicAdmin->load('roles', 'clinic')
        ]);
    }
}