<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        return redirect("/map-preview/{$map->id}");
    }

    public function destroy(Map $map)
    {
        $this->authorize('delete', $map);

        $map->delete();

        return back();
    }
}
