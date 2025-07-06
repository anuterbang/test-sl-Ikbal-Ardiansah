<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Position;


class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) // ✅ terima parameter Request
    {
        if ($request->has('department_id')) {
        return response()->json(
            Position::where('department_id', $request->department_id)->get()
        );
    }
         return response()->json(Position::all());
    }

    public function store(Request $request) { /* ... */ }
    public function show(string $id) { /* ... */ }
    public function update(Request $request, string $id) { /* ... */ }
    public function destroy(string $id) { /* ... */ }
}