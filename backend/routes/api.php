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
    
    // Get current logged-in user
    Route::get('/user', function (Request $request) {
        return response()->json($request->user()->load('roles'));
    });

    // ==========================================
    // SUPER ADMIN ONLY ROUTES
    // ==========================================
    Route::middleware('role:super_admin')->group(function () {
        // ⚠️ CRITICAL: Custom routes MUST go before apiResource!
        Route::post('/clinics/provision', [ClinicController::class, 'provision']);
        Route::post('/clinics/{clinic}/impersonate', [ClinicController::class, 'impersonate']);
    });

    // ==========================================
    // STANDARD RESOURCES
    // ==========================================
    // These must stay at the bottom of the group!
    Route::apiResource('clinics', ClinicController::class);
    Route::apiResource('patients', PatientController::class);
});