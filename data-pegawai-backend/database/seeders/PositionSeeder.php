<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Position;
use Illuminate\Support\Facades\DB;


class PositionSeeder extends Seeder
{
    public function run()
    {
       DB::table('positions')->insert([
    ['department_id' => 1, 'job_title_id' => 2, 'title' => 'Web Developer'],
    ['department_id' => 1, 'job_title_id' => 2, 'title' => 'Mobile Developer'],
    ['department_id' => 1, 'job_title_id' => 2, 'title' => 'IT Support'],
    
    ['department_id' => 2, 'job_title_id' => 3, 'title' => 'HR Manager'],
    ['department_id' => 2, 'job_title_id' => 2, 'title' => 'Recruiter'],
    
    ['department_id' => 3, 'job_title_id' => 3, 'title' => 'Marketing Lead'],
    ['department_id' => 3, 'job_title_id' => 2, 'title' => 'Content Specialist'],
    
    ['department_id' => 4, 'job_title_id' => 3, 'title' => 'Legal Officer'],
    ['department_id' => 4, 'job_title_id' => 2, 'title' => 'Compliance Analyst'],
]);

    }
}
