<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Permitir que qualquer usuário acesse
    }

    public function rules()
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['email'] = 'sometimes|email|unique:users,email,' . $this->route('id');
            $rules['password'] = 'sometimes|string|min:6';
            $rules['name'] = 'sometimes|string|max:255';
        }

        return $rules;
    }
}
