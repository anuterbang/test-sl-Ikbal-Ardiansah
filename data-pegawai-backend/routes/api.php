<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\JobTitleController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/nip/generate', [EmployeeController::class, 'generateNip']);

Route::get('/test-route', function () {
    return response()->json(['status' => 'Route file is loaded']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('positions', PositionController::class);
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    Route::post('/employees', [EmployeeController::class, 'store']);       
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);  
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/positions', [PositionController::class, 'index']);
    Route::apiResource('job_titles', JobTitleController::class);
    Route::post('/employees/check-email', [EmployeeController::class, 'checkEmail']);

});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


