<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobTitle extends Model
{
    protected $fillable = ['name'];

    public function positions()
    {
        return $this->hasMany(Position::class);
    }
}
