<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        return response()->json(Patient::with('clinic')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'clinic_id' => 'required|exists:clinics,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:patients,email',
            'phone' => 'required|string|max:20',
            'date_of_birth' => 'nullable|date',
        ]);

        $patient = Patient::create($validated);
        return response()->json($patient, 201);
    }

    public function show(Patient $patient)
    {
        return response()->json($patient->load('clinic'));
    }

    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'clinic_id' => 'sometimes|exists:clinics,id',
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|unique:patients,email,' . $patient->id,
            'phone' => 'sometimes|string|max:20',
            'date_of_birth' => 'nullable|date',
        ]);

        $patient->update($validated);
        return response()->json($patient);
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }
}