<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    // Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
    ]);

     if ($validator->fails()) {
        return response()->json([
            'status' => 422,
            'errors' => $validator->errors()
        ], 422);
    }

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return response()->json([
        'status' => 201,
        'message' => 'User berhasil terdaftar',
        'token' => $user->createToken('token')->plainTextToken,
        'user'  => $user,
    ], 201);

    }

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json([
            'status' => 401,
            'message' => 'Invalid credentials'
        ], 401);
    }

    return response()->json([
        'status' => 200,
        'message' => 'Login successful',
        'token' => $user->createToken('token')->plainTextToken,
        'user' => $user
    ]);
    }

    // Logout
   public function logout(Request $request)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['message' => 'User tidak terautentikasi'], 401);
    }

    $user->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logout berhasil'
    ]);
}

}
