<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobTitle;
use Illuminate\Http\Request;

class JobTitleController extends Controller
{
    public function index()
    {
        return JobTitle::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_titles,name',
        ]);

        $jobTitle = JobTitle::create($validated);

        return response()->json($jobTitle, 201);
    }

    public function show($id)
    {
        $jobTitle = JobTitle::findOrFail($id);
        return response()->json($jobTitle);
    }

    public function update(Request $request, $id)
    {
        $jobTitle = JobTitle::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_titles,name,' . $id,
        ]);

        $jobTitle->update($validated);

        return response()->json($jobTitle);
    }

    public function destroy($id)
    {
        $jobTitle = JobTitle::findOrFail($id);
        $jobTitle->delete();

        return response()->json(null, 204);
    }
}
