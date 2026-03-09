<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapPreviewController extends Controller
{
    public function show($id)
    {
        $map = Map::with('pointers')->findOrFail($id);

        return Inertia::render('MapPreview', [
            'map' => $map
        ]);
    }
}
