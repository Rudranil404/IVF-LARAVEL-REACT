<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;

class ClinicController extends Controller
{
    public function index()
    {
        return response()->json(Clinic::with('branches')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clinics,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'parent_clinic_id' => 'nullable|exists:clinics,id',
            'max_branches' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        $clinic = Clinic::create($validated);
        return response()->json($clinic, 201);
    }

    public function show(Clinic $clinic)
    {
        return response()->json($clinic->load('patients', 'branches'));
    }

    public function update(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:clinics,email,' . $clinic->id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'is_active' => 'boolean'
        ]);

        $clinic->update($validated);
        return response()->json($clinic);
    }

    public function destroy(Clinic $clinic)
    {
        $clinic->delete();
        return response()->json(['message' => 'Clinic deleted successfully']);
    }
}