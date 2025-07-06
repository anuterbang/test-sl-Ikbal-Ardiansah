<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'nip',
        'name',
        'email',
        'phone_number',
        'department_id',
        'position_id',
        'address',
        'job_title_id',
        'hire_date'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function jobTitle()
    {
        return $this->belongsTo(JobTitle::class);
    }

}
