<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; 
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with(['department', 'position.jobTitle', 'jobTitle'])->get();
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nip' => 'required|string|unique:employees,nip',
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone_number' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'job_title_id' => 'required|exists:job_titles,id',
            'address' => 'nullable|string',
            'hire_date' => 'nullable|date',
        ]);

        $position = Position::with('jobTitle')->findOrFail($request->position_id);

        $employee = Employee::create([
            'nip' => $request->nip,
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'department_id' => $request->department_id,
            'position_id' => $request->position_id,
            'job_title_id' => $request->job_title_id, 
            'address' => $request->address,
            'hire_date' => $request->hire_date,
        ]);

        return response()->json($employee->load(['department', 'position.jobTitle']));
    }

    public function show($id)
    {
        $employee = Employee::with(['department', 'position.jobTitle'])->findOrFail($id);
        return response()->json($employee);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nip' => 'required|string|unique:employees,nip,' . $id,
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone_number' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'address' => 'nullable|string',
            'hire_date' => 'nullable|date',
        ]);

        $employee = Employee::findOrFail($id);
        $position = Position::with('jobTitle')->findOrFail($request->position_id);

        $employee->update([
            'nip' => $request->nip,
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'department_id' => $request->department_id,
            'position_id' => $request->position_id,
            'job_title_id' => $request->job_title_id,
            'address' => $request->address,
            'hire_date' => $request->hire_date,
        ]);

        return response()->json($employee->load(['department', 'position.jobTitle']));
        
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Pegawai berhasil dihapus.']);
    }

    public function checkEmail(Request $request)
    {
    $request->validate([
        'email' => 'required|email',
    ]);

    $query = Employee::where('email', $request->email);

    if ($request->filled('exclude_id')) {
        $query->where('id', '!=', $request->exclude_id);
    }

    $exists = $query->exists();

    return response()->json(['exists' => $exists]);
    }

    public function generateNip()   
    {
    $latest = Employee::latest()->first();
    $nextNumber = $latest ? intval(substr($latest->nip, -3)) + 1 : 1;
    $newNip = now()->format('Ymd') . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

    return response()->json(['nip' => $newNip]);
    }
}
