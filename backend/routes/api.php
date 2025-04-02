<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

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
});