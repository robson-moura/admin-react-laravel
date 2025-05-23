<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            // Informações pessoais
            $table->string('full_name'); // Nome completo
            $table->date('birth_date'); // Data de nascimento
            $table->string('gender');
            $table->string('marital_status')->nullable(); // Estado civil
            $table->string('cpf')->unique(); // CPF
            $table->string('rg')->nullable(); // RG
            $table->string('profession')->nullable(); // Profissão
            $table->string('nationality')->nullable(); // Nacionalidade
            $table->string('place_of_birth')->nullable(); // Naturalidade

            // Contato
            $table->string('phone'); // Telefone
            $table->string('landline')->nullable(); // Telefone fixo
            $table->string('email')->unique(); // E-mail
            $table->string('whatsapp')->nullable(); // WhatsApp

            // Endereço
            $table->string('zip_code'); // CEP
            $table->string('address'); // Endereço
            $table->string('number'); // Número
            $table->string('complement')->nullable(); // Complemento
            $table->string('neighborhood'); // Bairro
            $table->string('city'); // Cidade
            $table->string('state'); // Estado

            // Informações de saúde
            $table->decimal('weight', 5, 2)->nullable(); // Peso
            $table->decimal('height', 4, 2)->nullable(); // Altura
            $table->text('chronic_diseases')->nullable(); // Doenças crônicas
            $table->text('allergies')->nullable(); // Alergias
            $table->text('medications')->nullable(); // Medicamentos contínuos
            $table->text('previous_surgeries')->nullable(); // Cirurgias anteriores
            $table->text('family_history')->nullable(); // Histórico familiar
            $table->boolean('pregnant_or_breastfeeding')->nullable(); // Grávida ou amamentando
            $table->boolean('uses_birth_control')->nullable(); // Uso de anticoncepcional
            $table->text('lifestyle')->nullable(); // Hábitos
            $table->text('main_complaint')->nullable(); // Queixa principal

            // Informações estéticas
            $table->string('skin_type')->nullable(); // Tipo de pele
            $table->string('hair_type')->nullable(); // Tipo de cabelo
            $table->text('treatment_areas')->nullable(); // Áreas de interesse para tratamento
            $table->text('aesthetic_goals')->nullable(); // Objetivos estéticos
            $table->string('before_photo')->nullable(); // Foto inicial (opcional)

            // Administrativo
            $table->text('notes')->nullable(); // Observações gerais
            $table->boolean('consent_to_treatment')->nullable(); // Consentimento para tratamento
            $table->boolean('accepts_promotions')->default(false); // Aceita receber promoções
            $table->enum('status', ['active', 'inactive'])->default('active'); // Status do cliente

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('clients');
    }
};
