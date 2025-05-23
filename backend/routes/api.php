<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rota de login
Route::post('/login', [AuthController::class, 'login']);

// Rota de documentação
Route::get('/api/documentation', function () {
    return view('l5-swagger::index');
});

// Rotas protegidas pelo middleware 'auth:sanctum'
Route::middleware('auth:sanctum')->group(function () {
    // Rota para obter o usuário autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rota de logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Rotas relacionadas a usuários
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']); // Listar todos os usuários
        Route::post('/', [UserController::class, 'store']); // Criar um novo usuário
        Route::get('/{id}', [UserController::class, 'show']); // Obter um usuário específico
        Route::put('/{id}', [UserController::class, 'update']); // Atualizar um usuário
        Route::delete('/{id}', [UserController::class, 'destroy']); // Deletar um usuário
    });

    // Rotas relacionadas a perfis
    Route::prefix('profiles')->group(function () {
        Route::get('/combo', [ProfileController::class, 'combo']); // Perfis ativos para select/combo
        Route::get('/', [ProfileController::class, 'index']);      // Listar todos os perfis
        Route::post('/', [ProfileController::class, 'store']);     // Criar um novo perfil
        Route::get('/{id}', [ProfileController::class, 'show']);   // Obter um perfil específico
        Route::put('/{id}', [ProfileController::class, 'update']); // Atualizar um perfil
        Route::delete('/{id}', [ProfileController::class, 'destroy']); // Deletar um perfil
    });

    // Rotas relacionadas a clients
    Route::prefix('clients')->group(function () {
        Route::get('/', [\App\Http\Controllers\ClientController::class, 'index']);      // Listar todos os clientes
        Route::post('/', [\App\Http\Controllers\ClientController::class, 'store']);     // Criar um novo cliente
        Route::get('/{id}', [\App\Http\Controllers\ClientController::class, 'show']);   // Obter um cliente específico
        Route::put('/{id}', [\App\Http\Controllers\ClientController::class, 'update']); // Atualizar um cliente
        Route::delete('/{id}', [\App\Http\Controllers\ClientController::class, 'destroy']); // Deletar um cliente
    });

    // Rotas relacionadas a atendimentos
    Route::prefix('appointments')->group(function () {
        Route::get('/', [\App\Http\Controllers\AppointmentController::class, 'index']);      // Listar todos os atendimentos
        Route::post('/', [\App\Http\Controllers\AppointmentController::class, 'store']);     // Criar um novo atendimento
        Route::get('/{id}', [\App\Http\Controllers\AppointmentController::class, 'show']);   // Obter um atendimento específico
        Route::put('/{id}', [\App\Http\Controllers\AppointmentController::class, 'update']); // Atualizar um atendimento
        Route::delete('/{id}', [\App\Http\Controllers\AppointmentController::class, 'destroy']); // Deletar um atendimento
    });
});