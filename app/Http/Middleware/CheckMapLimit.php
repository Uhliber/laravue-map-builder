<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckMapLimit
{
    const MAP_LIMIT = 5;

    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()) {
            return $next($request);
        }

        $user = $request->user();

        if ($user->maps()->count() >= self::MAP_LIMIT) {
            if ($request->header('X-Inertia')) {
                return redirect()
                    ->route('dashboard')
                    ->with('error', 'Map limit reached (5)');
            }

            return redirect()
                ->route('dashboard')
                ->with('error', 'Map limit reached (5)');
        }

        return $next($request);
    }
}
