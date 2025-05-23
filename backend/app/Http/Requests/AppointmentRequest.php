<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'time' => 'nullable',
            'procedure' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'before_photo' => 'nullable',
            'after_photo' => 'nullable',
            'products_used' => 'nullable',
            'price' => 'nullable|numeric',
            'status' => 'required|in:scheduled,completed,canceled',
        ];
    }
}