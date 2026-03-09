<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MapPointer extends Model
{
    protected $fillable = [
        'map_id',
        'asset_src',
        'name',
        'x',
        'y',
        'width',
        'height',
        'trigger',
        'animate',
        'placement',
        'offset',
        'title',
        'description',
        'link',
        'target',
    ];

    public function map()
    {
        return $this->belongsTo(Map::class);
    }
}
