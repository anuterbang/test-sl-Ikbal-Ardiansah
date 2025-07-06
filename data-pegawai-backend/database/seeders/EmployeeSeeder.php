<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('employees')->insert([
            'nip' => '20240701001',
            'name' => 'Ikbal',
            'email' => 'ikbal@example.com',
            'password' => Hash::make('Yahoo365'),
            'phone_number' => '08123456789',
            'department_id' => 1,
            'position_id' => 1,
            'address' => 'Jl. Melati',
            'hire_date' => '2024-07-01'
        ]);
    }
}
