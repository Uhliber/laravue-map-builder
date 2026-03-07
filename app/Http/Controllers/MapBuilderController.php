<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class MapBuilderController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('MapBuilder', [
            // You can pass props here later
        ]);
    }
}
