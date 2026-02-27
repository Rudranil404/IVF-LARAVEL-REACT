<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\User;
// use App\Models\Patient; // Uncomment when you build the Patient model
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        // ---------------------------------------------------
        // SUPER ADMIN STATS (Sees Everything)
        // ---------------------------------------------------
        if ($user->hasRole('super_admin')) {
            return response()->json([
                'role' => 'super_admin',
                'stats' => [
                    'total_clinics' => Clinic::whereNull('parent_clinic_id')->count(),
                    'active_clinics' => Clinic::where('is_active', true)->whereNull('parent_clinic_id')->count(),
                    'total_branches' => Clinic::whereNotNull('parent_clinic_id')->count(),
                    'total_users' => User::count(),
                ]
            ]);
        }

        // ---------------------------------------------------
        // CLINIC ADMIN STATS (Scoped strictly to their Clinic ID)
        // ---------------------------------------------------
        if ($user->hasRole('clinic_admin')) {
            $clinicId = $user->clinic_id;
            $clinic = Clinic::with('branches')->find($clinicId);

            return response()->json([
                'role' => 'clinic_admin',
                'clinic_name' => $clinic->name,
                'stats' => [
                    // Scope everything to this specific clinic!
                    'branches' => $clinic->branches->count(),
                    'staff_count' => User::where('clinic_id', $clinicId)->count(),
                    // 'total_patients' => Patient::where('clinic_id', $clinicId)->count(), // Add later
                    'total_patients' => 0, // Placeholder
                    'today_appointments' => 0, // Placeholder
                ]
            ]);
        }

        return response()->json(['message' => 'Unauthorized role'], 403);
    }
}