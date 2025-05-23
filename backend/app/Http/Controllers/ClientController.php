<?php

namespace App\Http\Controllers;

use App\Repositories\ClientRepository;
use App\Http\Requests\ClientRequest;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    protected $clientRepository;

    public function __construct(ClientRepository $clientRepository)
    {
        $this->clientRepository = $clientRepository;
    }

    /**
     * Listar todos os clientes (com paginação e filtro)
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);
        $filters = [
            'full_name' => $request->get('full_name'),
            'cpf' => $request->get('cpf'),
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'status' => $request->get('status'),
        ];

        $result = $this->clientRepository->getFilteredClients($filters, $limit, $offset);

        $columns = [
            ['label' => 'Nome', 'field' => 'full_name'],
            ['label' => 'CPF', 'field' => 'cpf'],
            ['label' => 'Telefone', 'field' => 'phone'],
            ['label' => 'E-mail', 'field' => 'email'],
            ['label' => 'Status', 'field' => 'status'],
            ['label' => 'Data Cadastro', 'field' => 'created_at'],
        ];

        return response()->json([
            'data' => $result['clients'],
            'columns' => $columns,
            'total' => $result['total'],
            'offset' => $offset,
            'limit' => $limit,
        ]);
    }

    /**
     * Criar um novo cliente
     */
    public function store(ClientRequest $request)
    {
        $client = $this->clientRepository->create($request->all());
        return response()->json(['message' => 'Cliente criado com sucesso!', 'client' => $client], 201);
    }

    /**
     * Exibir um cliente específico
     */
    public function show($id)
    {
        $client = $this->clientRepository->findById($id);
        if (!$client) {
            return response()->json(['message' => 'Cliente não encontrado.'], 404);
        }
        return response()->json($client);
    }

    /**
     * Atualizar um cliente
     */
    public function update(ClientRequest $request, $id)
    {
        $updated = $this->clientRepository->update($id, $request->all());
        if (!$updated) {
            return response()->json(['message' => 'Cliente não encontrado.'], 404);
        }
        return response()->json(['message' => 'Cliente atualizado com sucesso!', 'client' => $updated], 200);
    }

    /**
     * Remover um cliente
     */
    public function destroy($id)
    {
        $deleted = $this->clientRepository->delete($id);
        if (!$deleted) {
            return response()->json(['message' => 'Cliente não encontrado.'], 404);
        }
        return response()->json(['message' => 'Cliente removido com sucesso!'], 200);
    }
}