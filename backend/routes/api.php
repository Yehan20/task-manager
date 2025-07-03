<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompleteTaskController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->group(function () {
    
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    Route::middleware('auth:api')->group(function () {

        Route::controller(AuthController::class)->group(function () {
            Route::post('logout', 'logout');
            Route::get('me', 'me');
        });
        
        Route::patch('tasks/{task}/complete',CompleteTaskController::class);
        Route::resource('tasks',TaskController::class);
    });
});
