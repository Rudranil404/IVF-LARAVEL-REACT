<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Super Admin creates a Clinic Admin
    public function createClinicAdmin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'clinic_id' => 'required|exists:clinics,id', // Make sure the clinic exists
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'clinic_id' => $validated['clinic_id'], // Need to add clinic_id to users migration!
        ]);

        // Assign Spatie Role
        $user->assignRole('clinic_admin');

        return response()->json(['message' => 'Clinic Admin created successfully!', 'user' => $user], 201);
    }
}