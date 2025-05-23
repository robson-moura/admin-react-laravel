<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta solicitação.
     */
    public function authorize()
    {
        return true; // Permite que qualquer usuário faça a solicitação
    }

    /**
     * Regras de validação para a solicitação.
     */
    public function rules()
    {
        $userId = $this->route('id'); // Obtém o ID do usuário para validação única no update

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $userId,
            'cpf' => 'required|cpf|unique:users,cpf,' . $userId,
            'rg' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|in:Masculino,Feminino,Outro',
            'marital_status' => 'nullable|string|in:Solteiro(a),Casado(a),Divorciado(a),Viúvo(a)',
            'phone' => 'nullable|string|max:20',
            'address_street' => 'nullable|string|max:255',
            'address_number' => 'nullable|string|max:20',
            'address_complement' => 'nullable|string|max:255',
            'address_neighborhood' => 'nullable|string|max:255',
            'address_city' => 'nullable|string|max:255',
            'address_state' => 'nullable|string|max:255',
            'address_zip_code' => 'nullable|string|max:20',
            'photo' => 'nullable|max:2048',
            'profile_id' => 'required|exists:profiles,id', // <-- campo obrigatório
        ];
    }

    /**
     * Mensagens de erro personalizadas.
     */
    public function messages()
    {
        return [
            'name.required' => 'O campo Nome é obrigatório.',
            'email.required' => 'O campo E-mail é obrigatório.',
            'email.email' => 'O E-mail informado não é válido.',
            'email.unique' => 'O E-mail informado já está em uso.',
            'cpf.required' => 'O campo CPF é obrigatório.',
            'cpf.cpf' => 'O CPF informado não é válido.',
            'cpf.unique' => 'O CPF informado já está em uso.',
            'birth_date.date' => 'A Data de Nascimento deve ser uma data válida.',
            'gender.in' => 'O campo Gênero deve ser Masculino, Feminino ou Outro.',
            'marital_status.in' => 'O Estado Civil deve ser Solteiro(a), Casado(a), Divorciado(a) ou Viúvo(a).',
            'profile_id.required' => 'O campo Perfil é obrigatório.', // <-- mensagem personalizada
            'profile_id.exists' => 'O perfil selecionado não existe.',
        ];
    }
}
