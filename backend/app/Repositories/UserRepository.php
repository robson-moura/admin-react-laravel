<?php
namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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

    public function findById(int $id)
    {
        return User::find($id);
    }

    public function create(array $data)
    {
        // Garante que a pasta exista
        Storage::disk('public')->makeDirectory('users');

        // Trata o upload da foto se for um arquivo
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $path = $data['photo']->store('users', 'public');
            $data['photo'] = '/storage/' . $path;
        }

        $data['password'] = Hash::make('123456');
        return User::create($data);
    }

    public function update(int $id, array $data)
    {
        $user = $this->findById($id);

        if (!$user) {
            return false;
        }

        // Garante que a pasta exista
        Storage::disk('public')->makeDirectory('users');

        // Trata o upload da foto se for um arquivo
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $path = $data['photo']->store('users', 'public');
            $data['photo'] = '/storage/' . $path;
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $user->update($data);
        Log::debug($user); // Log para depuração

        return $user;
    }

    public function delete(int $id)
    {
        $user = $this->findById($id);

        if (!$user) {
            return false;
        }

        return $user->delete();
    }

    /**
     * Obtém todos os usuários com filtros opcionais.
     *
     * @param array $filters
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getFilteredUsers(array $filters, int $limit = 10, int $offset = 0)
    {
        $query = User::query();

        // Aplica filtros
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (!empty($filters['email'])) {
            $query->where('email', 'like', '%' . $filters['email'] . '%');
        }

        if (!empty($filters['cpf'])) {
            $query->where('cpf', $filters['cpf']);
        }

        if (!empty($filters['phone'])) {
            $query->where('phone', 'like', '%' . $filters['phone'] . '%');
        }

        // Seleciona apenas os campos desejados
        $query->select('id', 'name', 'cpf', 'phone', 'email', 'created_at');

        // Paginação
        $total = $query->count();
        $users = $query->limit($limit)->offset($offset)->get();

        return [
            'total' => $total,
            'users' => $users,
        ];
    }
}