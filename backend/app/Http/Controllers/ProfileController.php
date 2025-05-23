<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Repositories\ProfileRepository;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    protected $profileRepository;

    public function __construct(ProfileRepository $profileRepository)
    {
        $this->profileRepository = $profileRepository;
    }

    /**
     * Listar todos os perfis (com paginação e filtro por nome)
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);
        $filters = [
            'name' => $request->get('name'),
        ];

        $result = $this->profileRepository->getFilteredProfiles($filters, $limit, $offset);

        $columns = [
            ['label' => 'Perfil', 'field' => 'name'],
            ['label' => 'Ativo', 'field' => 'active_label'],
        ];

        return response()->json([
            'data' => $result['profiles'], // Use diretamente, já está mapeado!
            'columns' => $columns,
            'total' => $result['total'],
            'offset' => $offset,
            'limit' => $limit,
        ]);
    }

    /**
     * Criar um novo perfil
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'active' => 'required|boolean',
        ]);

        $profile = $this->profileRepository->create($validated);

        return response()->json(['message' => 'Perfil criado com sucesso!', 'profile' => $profile], 201);
    }

    /**
     * Exibir um perfil específico
     */
    public function show($id)
    {
        $profile = $this->profileRepository->findById($id);

        if (!$profile) {
            return response()->json(['message' => 'Perfil não encontrado.'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Atualizar um perfil
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'active' => 'required|boolean',
        ]);

        $profile = $this->profileRepository->update($id, $validated);

        if (!$profile) {
            return response()->json(['message' => 'Perfil não encontrado.'], 404);
        }

        return response()->json(['message' => 'Perfil atualizado com sucesso!', 'profile' => $profile], 200);
    }

    /**
     * Remover um perfil
     */
    public function destroy($id)
    {
        $deleted = $this->profileRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Perfil não encontrado.'], 404);
        }

        return response()->json(['message' => 'Perfil removido com sucesso!'], 200);
    }

    /**
     * Obter perfis ativos para combo
     */
    public function combo()
    {
        $profiles = Profile::where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($profiles);
    }
}