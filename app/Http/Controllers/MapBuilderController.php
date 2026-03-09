<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MapBuilderController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('MapBuilder', [
            'map' => null,
        ]);
    }

    public function preview()
    {
        return Inertia::render('MapPreview');
    }

    public function edit(Request $request, $id)
    {

        $map = $request->user()->maps()->with('pointers')->findOrFail($id);

        return Inertia::render('MapBuilderEdit', [
            'map' => [
                'id' => $map->id,
                'base' => [
                    'id' => $map->base_id,
                    'src' => $map->base_src,
                ],
                'pointers' => $map->pointers->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'x' => $p->x,
                        'y' => $p->y,
                        'width' => $p->width,
                        'height' => $p->height,
                        'trigger' => $p->trigger,
                        'animate' => $p->animate,
                        'asset_src' => $p->asset_src,
                        'title' => $p->title,
                        'description' => $p->description,
                        'link' => $p->link,
                        'target' => $p->target,
                    ];
                }),
            ],
        ]);
    }
}
