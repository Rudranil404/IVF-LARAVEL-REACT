<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'login_type' => 'required|in:super_admin,clinic' // ⚠️ Require portal type
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials. Please try again.'], 401);
        }

        $isSuperAdmin = $user->hasRole('super_admin');

        // ⚠️ STRICT CROSS-LOGIN PREVENTION
        if ($request->login_type === 'super_admin' && !$isSuperAdmin) {
            return response()->json(['message' => 'Access Denied: You do not have Super Admin privileges.'], 403);
        }

        if ($request->login_type === 'clinic' && $isSuperAdmin) {
            return response()->json(['message' => 'Access Denied: Super Admins must use the Central Admin Portal.'], 403);
        }

        // If passed, issue token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user->load('roles', 'clinic')
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}