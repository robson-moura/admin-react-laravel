<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    // Atributo customizado para exibir "Sim" ou "Não" no campo active_label
    public function getActiveLabelAttribute()
    {
        return $this->active ? 'Sim' : 'Não';
    }
}