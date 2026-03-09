<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MapBuilderController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MapPreviewController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\CheckMapLimit;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/map-builder', [MapBuilderController::class, 'index'])
        ->middleware(CheckMapLimit::class)
        ->name('map-builder');

    Route::get('/map-builder/edit/{map}', [MapBuilderController::class, 'edit'])
        ->name('map-builder.edit');

    Route::get('/map-preview', [MapBuilderController::class, 'preview'])
        ->name('map-preview');

    Route::get('/map-preview/{id}', [MapPreviewController::class, 'show'])
        ->name('map-preview.show');
});

Route::post('/maps', [MapController::class, 'store'])
    ->middleware('auth')
    ->name('maps.store');

Route::put('/maps/{map}', [MapController::class, 'update'])
    ->middleware(['auth','verified'])
    ->name('maps.update');

Route::delete('/maps/{map}', [MapController::class, 'destroy'])
    ->middleware(['auth','verified'])
    ->name('maps.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
