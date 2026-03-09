<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MapController extends Controller
{

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->maps()->exists() && $user->maps()->count() >= 5) {
            abort(403, 'Map limit reached');
        }

        $data = $request->validate([
            'base.src' => ['required', 'string'],
            'pointers' => ['required', 'array', 'min:1', 'max:30'],
        ]);

        $map = DB::transaction(function () use ($data, $user) {
            $map = Map::create([
                'user_id' => $user->id,
                'base_src' => $data['base']['src']
            ]);

            foreach ($data['pointers'] as $pointer) {
                $map->pointers()->create([
                    'asset_src' => $pointer['src'],
                    'name' => $pointer['name'] ?? null,
                    'x' => $pointer['x'],
                    'y' => $pointer['y'],
                    'width' => $pointer['width'] ?? 8,
                    'height' => $pointer['height'] ?? 8,
                    'trigger' => $pointer['trigger'] ?? 'disabled',
                    'animate' => $pointer['animate'] ?? false,
                    'placement' => $pointer['placement'] ?? null,
                    'offset' => $pointer['offset'] ?? 0,
                    'title' => $pointer['title'] ?? null,
                    'description' => $pointer['description'] ?? null,
                    'link' => $pointer['link'] ?? null,
                    'target' => $pointer['target'] ?? '_self',
                ]);
            }

            return $map;
        });

        return Inertia::render('MapBuilder', [
            'map_id' => $map->id
        ]);
    }

    public function update(Request $request, $id)
    {
        $map = $request->user()->maps()->with('pointers')->findOrFail($id);

        $validated = $request->validate([
            'base.src' => ['required','string'],
            'pointers' => ['array'],
        ]);

        DB::transaction(function () use ($map, $validated) {

            $map->update([
                'base_src' => $validated['base']['src'],
            ]);

            $map->pointers()->delete();

            foreach ($validated['pointers'] ?? [] as $pointer) {
                $map->pointers()->create([
                    'x' => $pointer['x'],
                    'y' => $pointer['y'],
                    'width' => $pointer['width'],
                    'height' => $pointer['height'],
                    'trigger' => $pointer['trigger'],
                    'placement' => $pointer['placement'],
                    'animate' => $pointer['animate'] ?? false,
                    'asset_src' => $pointer['asset_src'] ?? $pointer['src'],
                    'title' => $pointer['title'] ?? null,
                    'description' => $pointer['description'] ?? null,
                    'link' => $pointer['link'] ?? null,
                    'target' => $pointer['target'] ?? "_self" ?? null,
                ]);
            }
        });

        return Inertia::render('MapBuilderEdit', [
            'map_id' => $map->id
        ]);
    }

    public function destroy(Map $map)
    {
        $this->authorize('delete', $map);

        $map->delete();

        return back();
    }
}
