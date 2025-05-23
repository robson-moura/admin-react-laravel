<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $clientId = $this->route('id');
        return [
            // Informações pessoais
            'full_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'required|string|max:20',
            'marital_status' => 'nullable|string|max:50',
            'cpf' => 'required|string|max:20|unique:clients,cpf,' . $clientId,
            'rg' => 'nullable|string|max:30',
            'profession' => 'nullable|string|max:100',
            'nationality' => 'nullable|string|max:50',
            'place_of_birth' => 'nullable|string|max:100',

            // Contato
            'phone' => 'required|string|max:20',
            'landline' => 'nullable|string|max:20',
            'email' => 'required|email|max:100|unique:clients,email,' . $clientId,
            'whatsapp' => 'nullable|string|max:20',

            // Endereço
            'zip_code' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'number' => 'required|string|max:20',
            'complement' => 'nullable|string|max:100',
            'neighborhood' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:2',

            // Informações de saúde
            'weight' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'chronic_diseases' => 'nullable|string',
            'allergies' => 'nullable|string',
            'medications' => 'nullable|string',
            'previous_surgeries' => 'nullable|string',
            'family_history' => 'nullable|string',
            'pregnant_or_breastfeeding' => 'nullable|boolean',
            'uses_birth_control' => 'nullable|boolean',
            'lifestyle' => 'nullable|string',
            'main_complaint' => 'nullable|string',

            // Informações estéticas
            'skin_type' => 'nullable|string|max:50',
            'hair_type' => 'nullable|string|max:50',
            'treatment_areas' => 'nullable|string',
            'aesthetic_goals' => 'nullable|string',
            'before_photo' => 'nullable|max:255',

            // Administrativo
            'notes' => 'nullable|string',
            'consent_to_treatment' => 'nullable|boolean',
            'accepts_promotions' => 'nullable|boolean',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages()
    {
        return [
            'full_name.required' => 'O campo Nome Completo é obrigatório.',
            'birth_date.required' => 'O campo Data de Nascimento é obrigatório.',
            'gender.required' => 'O campo Gênero é obrigatório.',
            'cpf.required' => 'O campo CPF é obrigatório.',
            'cpf.unique' => 'O CPF informado já está em uso.',
            'email.required' => 'O campo E-mail é obrigatório.',
            'email.email' => 'O E-mail informado não é válido.',
            'email.unique' => 'O E-mail informado já está em uso.',
            'phone.required' => 'O campo Telefone é obrigatório.',
            'zip_code.required' => 'O campo CEP é obrigatório.',
            'address.required' => 'O campo Endereço é obrigatório.',
            'number.required' => 'O campo Número é obrigatório.',
            'neighborhood.required' => 'O campo Bairro é obrigatório.',
            'city.required' => 'O campo Cidade é obrigatório.',
            'state.required' => 'O campo Estado é obrigatório.',
            'status.required' => 'O campo Status é obrigatório.',
            'status.in' => 'O status deve ser ativo ou inativo.',
        ];
    }
}