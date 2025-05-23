<?php
namespace App\Repositories;

use App\Models\Profile;

class ProfileRepository
{
    protected $profile;

    public function __construct(Profile $profile)
    {
        $this->profile = $profile;
    }

    public function findById(int $id)
    {
        return $this->profile->find($id);
    }

    public function create(array $data)
    {
        return $this->profile->create($data);
    }

    public function update(int $id, array $data)
    {
        $profile = $this->findById($id);

        if (!$profile) {
            return false;
        }

        $profile->update($data);
        return $profile;
    }

    public function delete(int $id)
    {
        $profile = $this->findById($id);

        if (!$profile) {
            return false;
        }

        return $profile->delete();
    }

    /**
     * Obtém todos os perfis com filtros opcionais.
     *
     * @param array $filters
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getFilteredProfiles(array $filters, int $limit = 10, int $offset = 0)
    {
        $query = $this->profile->query();

        // Aplica filtros
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        // Não use select aqui, para acessar os accessors do model

        // Paginação
        $total = $query->count();
        $profiles = $query->limit($limit)->offset($offset)->get();

        // Agora o accessor active_label estará disponível
        $profiles = $profiles->map(function ($profile) {
            return [
                'id' => $profile->id,
                'name' => $profile->name,
                'active' => $profile->active,
                'created_at' => $profile->created_at,
            ];
        });

        return [
            'total' => $total,
            'profiles' => $profiles,
        ];
    }
}