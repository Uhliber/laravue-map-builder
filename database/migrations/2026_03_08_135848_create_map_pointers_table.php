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
        Schema::create('map_pointers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('map_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('asset_src');

            $table->string('name')->nullable();

            $table->decimal('x', 8, 5);
            $table->decimal('y', 8, 5);

            $table->decimal('width', 5, 2)->default(8);
            $table->decimal('height', 5, 2)->default(8);

            $table->string('trigger')->default('disabled');
            $table->boolean('animate')->default(false);

            $table->string('placement')->nullable();
            $table->integer('offset')->default(0);

            $table->string('title')->nullable();
            $table->text('description')->nullable();

            $table->string('link')->nullable();
            $table->string('target')->default('_self');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('map_pointers');
    }
};
