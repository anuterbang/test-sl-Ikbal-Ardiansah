<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('employees', function (Blueprint $table) {
        $table->id();
        $table->string('nip')->unique();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('phone_number');
        $table->foreignId('department_id')->constrained()->onDelete('cascade');
        $table->foreignId('position_id')->constrained()->onDelete('cascade');
        $table->text('address')->nullable();
        $table->date('hire_date');
        $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
