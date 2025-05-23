<?php

namespace App\Repositories;

use App\Models\Client;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ClientRepository
{
    public function getAll()
    {
        return Client::all();
    }

    public function findById(int $id)
    {
        return Client::find($id);
    }

    public function create(array $data)
    {
        Storage::disk('public')->makeDirectory('clients');
        if (isset($data['before_photo']) && $data['before_photo'] instanceof UploadedFile) {
            $path = $data['before_photo']->store('clients', 'public');
            $data['before_photo'] = '/storage/' . $path;
        }
        return Client::create($data);
    }

    public function update(int $id, array $data)
    {
        $client = $this->findById($id);
        if (!$client) {
            return false;
        }
        Storage::disk('public')->makeDirectory('clients');
        if (isset($data['before_photo']) && $data['before_photo'] instanceof UploadedFile) {
            $path = $data['before_photo']->store('clients', 'public');
            $data['before_photo'] = '/storage/' . $path;
        }
        $client->update($data);
        return $client;
    }

    public function delete(int $id)
    {
        $client = $this->findById($id);
        if (!$client) {
            return false;
        }
        return $client->delete();
    }

    /**
     * Obtém todos os clientes com filtros opcionais.
     *
     * @param array $filters
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getFilteredClients(array $filters, int $limit = 10, int $offset = 0)
    {
        $query = Client::query();

        // Aplica filtros
        if (!empty($filters['full_name'])) {
            $query->where('full_name', 'like', '%' . $filters['full_name'] . '%');
        }

        if (!empty($filters['cpf'])) {
            $query->where('cpf', $filters['cpf']);
        }

        if (!empty($filters['email'])) {
            $query->where('email', 'like', '%' . $filters['email'] . '%');
        }

        if (!empty($filters['phone'])) {
            $query->where('phone', 'like', '%' . $filters['phone'] . '%');
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Seleciona apenas os campos desejados
        $query->select('id', 'full_name', 'cpf', 'phone', 'email', 'status', 'created_at');

        // Paginação
        $total = $query->count();
        $clients = $query->limit($limit)->offset($offset)->get();

        return [
            'total' => $total,
            'clients' => $clients,
        ];
    }
}