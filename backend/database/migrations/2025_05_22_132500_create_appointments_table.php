<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade'); // Relação com cliente
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Relação com usuario

            $table->date('date'); // Data do atendimento
            $table->time('time')->nullable(); // Hora (opcional)
            $table->string('procedure'); // Procedimento realizado
            $table->text('notes')->nullable(); // Observações do atendimento
            $table->string('before_photo')->nullable(); // Foto antes
            $table->string('after_photo')->nullable(); // Foto depois
            $table->json('products_used')->nullable(); // Produtos utilizados (JSON opcional)
            $table->decimal('price', 10, 2)->nullable(); // Valor cobrado
            $table->enum('status', ['scheduled', 'completed', 'canceled'])->default('completed'); // Status do atendimento

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('appointments');
    }
};