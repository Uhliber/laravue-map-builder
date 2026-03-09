<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
{
   $maps = $request->user()
        ->maps()
        ->latest()
        ->withCount('pointers')
        ->get()
        ->map(function ($map) {
            return [
                'id' => $map->id,
                'base_src' => $map->base_src,
                'pointers_count' => $map->pointers_count,
                'created_at' => [
                    'human' => $map->created_at->diffForHumans(),
                    'date' => $map->created_at->format('M j, Y'),
                ],
            ];
        });

    return Inertia::render('Dashboard', [
        'maps' => $maps
    ]);
}
}
