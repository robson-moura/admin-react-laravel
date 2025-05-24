<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Client extends Model
{
    protected $fillable = [
        'full_name',
        'birth_date',
        'gender',
        'marital_status',
        'cpf',
        'rg',
        'profession',
        'nationality',
        'place_of_birth',
        'phone',
        'landline',
        'email',
        'whatsapp',
        'zip_code',
        'address',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'weight',
        'height',
        'chronic_diseases',
        'allergies',
        'medications',
        'previous_surgeries',
        'family_history',
        'pregnant_or_breastfeeding',
        'uses_birth_control',
        'lifestyle',
        'main_complaint',
        'skin_type',
        'hair_type',
        'treatment_areas',
        'aesthetic_goals',
        'before_photo',
        'notes',
        'consent_to_treatment',
        'accepts_promotions',
        'status',
    ];

    /**
     * Accessor para formatar o campo created_at no padrão brasileiro.
     *
     * @return string
     */
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y');
    }

    public function getBeforePhotoAttribute($value)
    {
        if (!$value) {
            return null;
        }
        // Gera a URL completa
        return url($value);
    }

    public function getStatusAttribute($value)
    {
        // Tradução simples dos status
        $map = [
            'active' => 'Ativo',
            'inactive' => 'Inativo',
            'pending' => 'Pendente',
            'canceled' => 'Cancelado',
        ];
        return $map[$value] ?? ucfirst($value);
    }
}