<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'base_src',
        'published'
    ];

    public function pointers()
    {
        return $this->hasMany(MapPointer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
