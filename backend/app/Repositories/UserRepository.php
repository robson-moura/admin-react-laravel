<?php
namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function findByEmail(string $email): ?User
    {
        return $this->user->where('email', $email)->first();
    }

    public function validatePassword(User $user, string $password): bool
    {
        return Hash::check($password, $user->password);
    }

    public function getAll()
    {
        return $this->user->all();
    }

    public function findById($id)
    {
        return $this->user->find($id);
    }

    public function create(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        return $this->user->create($data);
    }

    public function update($id, array $data)
    {
        $user = $this->user->find($id);

        if (!$user) {
            return null;
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return $user;
    }

    public function delete($id)
    {
        $user = $this->user->find($id);

        if (!$user) {
            return false;
        }

        return $user->delete();
    }

    public function getFilteredUsers($filters, $limit, $offset)
    {
        // Cria a query inicial
        $query = User::query();

        // Aplica filtros, se existirem
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (!empty($filters['email'])) {
            $query->where('email', 'like', '%' . $filters['email'] . '%');
        }

        // Seleciona apenas os campos desejados
        $query->select(['id', 'name', 'email', 'created_at']);

        // Conta o total de registros considerando os filtros
        $total = $query->count();

        // Aplica paginação
        $users = $query->skip($offset)->take($limit)->get();

        return [
            'users' => $users,
            'total' => $total,
        ];
    }
}