<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(
 *     name="Users",
 *     description="CRUD operations for users"
 * )
 */
class UserController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @OA\Get(
     *     path="/users",
     *     summary="Get all users",
     *     tags={"Users"},
     *     @OA\Response(
     *         response=200,
     *         description="List of users",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);

        $filters = [
            'name' => $request->get('name'),
            'cpf' => $request->get('cpf'),
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'status' => $request->get('status'),
        ];

        $result = $this->userRepository->getFilteredUsers($filters, $limit, $offset);

        $columns = [
            ['label' => 'Nome', 'field' => 'name'],
            ['label' => 'CPF', 'field' => 'cpf'],
            ['label' => 'Telefone', 'field' => 'phone'],
            ['label' => 'E-mail', 'field' => 'email'],
            ['label' => 'Status', 'field' => 'status'],
            ['label' => 'Data Cadastro', 'field' => 'created_at'],
        ];

        return response()->json([
            'data' => $result['users'],
            'columns' => $columns,
            'total' => $result['total'],
            'offset' => $offset,
            'limit' => $limit,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/users",
     *     summary="Create a new user",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="johndoe@example.com"),
     *             @OA\Property(property="password", type="string", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     )
     * )
     */
    public function store(UserRequest $request)
    {        
   
        $validatedData = $request->validated(); // Obtém os dados validados

        // Usa o repositório para criar o usuário
        $user = $this->userRepository->create($validatedData);

        return response()->json(['message' => 'Usuário criado com sucesso!', 'user' => $user], 201);
    }

    /**
     * @OA\Get(
     *     path="/users/{id}",
     *     summary="Get a user by ID",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the user",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User details",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     )
     * )
     */
    public function show($id)
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * @OA\Put(
     *     path="/users/{id}",
     *     summary="Update a user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the user",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", example="johndoe@example.com"),
     *             @OA\Property(property="password", type="string", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     )
     * )
     */
    public function update(UserRequest $request, $id)
    {
        Log::debug($request); // Log para depuração
        $validatedData = $request->validated(); // Obtém os dados validados

        // Usa o repositório para atualizar o usuário
        $updated = $this->userRepository->update($id, $validatedData);

        if (!$updated) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        return response()->json(['message' => 'Usuário atualizado com sucesso!'], 200);
    }

    /**
     * @OA\Delete(
     *     path="/users/{id}",
     *     summary="Delete a user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the user",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Usuário Removido com sucesso"
     *     )
     * )
     */
    public function destroy($id)
    {
        $deleted = $this->userRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        return response()->json(['message' => 'Usuário Removido com sucesso!'], 200);
    }
}