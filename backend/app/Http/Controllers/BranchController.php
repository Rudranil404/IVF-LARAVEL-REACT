<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Fetch all branches for the currently authenticated clinic.
     */
    public function index(Request $request)
    {
        // 1. Ensure the user has a clinic_id, otherwise return an empty array safely
        $clinicId = $request->user()->clinic_id;
        if (!$clinicId) {
            return response()->json([]);
        }

        // 2. Fetch the branches belonging to this clinic
        $branches = Branch::where('clinic_id', $clinicId)->latest()->get();

        // 3. Ensure the JSON 'contacts' array is never perfectly null when sending to React
        $branches->transform(function ($branch) {
            if (!$branch->branch_contacts) {
                $branch->branch_contacts = [];
            }
            return $branch;
        });
        
        return response()->json($branches);
    }

    /**
     * Create and store a newly registered branch.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'branch_name' => 'required|string',
            'branch_address_1' => 'required|string',
            'branch_address_2' => 'nullable|string',
            'branch_country' => 'required|string',
            'branch_state' => 'required|string',
            'branch_zip' => 'required|string',
            'branch_contacts' => 'nullable|array',
        ]);

        // Automatically assign this branch to the currently logged-in user's clinic
        $data['clinic_id'] = $request->user()->clinic_id;

        // If no contacts were sent from React, ensure we save an empty array, not null
        if (!isset($data['branch_contacts'])) {
            $data['branch_contacts'] = [];
        }

        $branch = Branch::create($data);

        return response()->json($branch, 201);
    }

    /**
     * Update the details of an existing branch.
     */
    public function update(Request $request, $id)
    {
        // Find the branch, ensuring it belongs to this specific clinic
        $branch = Branch::where('clinic_id', $request->user()->clinic_id)->findOrFail($id);

        $data = $request->validate([
            'branch_name' => 'required|string',
            'branch_address_1' => 'required|string',
            'branch_address_2' => 'nullable|string',
            'branch_country' => 'required|string',
            'branch_state' => 'required|string',
            'branch_zip' => 'required|string',
            'branch_contacts' => 'nullable|array',
        ]);

        // Ensure JSON array doesn't corrupt on save if left empty
        if (!isset($data['branch_contacts'])) {
            $data['branch_contacts'] = [];
        }

        $branch->update($data);

        return response()->json($branch);
    }

    /**
     * Toggle the Active/Suspended status of a branch.
     */
    public function toggleStatus(Request $request, $id)
    {
        // Find the branch, ensuring it belongs to this specific clinic
        $branch = Branch::where('clinic_id', $request->user()->clinic_id)->findOrFail($id);
        
        // Flip the boolean value
        $branch->is_active = !$branch->is_active;
        $branch->save();

        return response()->json([
            'message' => 'Branch status updated successfully', 
            'is_active' => $branch->is_active
        ]);
    }

    /**
     * Permanently delete a branch.
     */
    public function destroy(Request $request, $id)
    {
        // Find the branch, ensuring it belongs to this specific clinic
        $branch = Branch::where('clinic_id', $request->user()->clinic_id)->findOrFail($id);
        
        $branch->delete();

        return response()->json(['message' => 'Branch deleted successfully']);
    }
}