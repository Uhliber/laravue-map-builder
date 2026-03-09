<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckMapLimit
{
    const MAP_LIMIT = 5;

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->maps()->count() >= self::MAP_LIMIT) {
            if ($request->header('X-Inertia')) {
                return redirect()->route('dashboard')->with('error', 'Map limit reached (5)')->inertia();
            }

            return redirect()->route('dashboard')->with('error', 'Map limit reached (5)');
        }

        return $next($request);
    }
}
