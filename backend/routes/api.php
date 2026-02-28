<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

// Public Auth Route
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Require Login Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [App\Http\Controllers\DashboardController::class, 'stats']);
    
    // Get current logged-in user safely (handles null clinics for Super Admins)
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('roles');
        
        // Only load the clinic relationship if the user actually belongs to one
        if ($user->clinic_id !== null) {
            $user->load('clinic');
        }
        
        return response()->json($user);
    });

    // ==========================================
    // SUPER ADMIN ONLY ROUTES
    // ==========================================
    // ⚠️ CRITICAL: Added ',sanctum' to force Spatie to use API tokens!
    Route::middleware('role:super_admin,sanctum')->group(function () {
        // Custom routes MUST go before apiResource!
        Route::post('/clinics/provision', [ClinicController::class, 'provision']);
        Route::post('/clinics/{clinic}/impersonate', [ClinicController::class, 'impersonate']);
        
        // Moved inside Super Admin group to secure standard clinic endpoints
        Route::apiResource('clinics', ClinicController::class);
    });
    
    // ==========================================
    // STANDARD RESOURCES (For Clinic Admins & Staff)
    // ==========================================
    // These must stay at the bottom of the group!
    Route::apiResource('patients', PatientController::class);
});