<?php

namespace App\Http\Controllers;

use App\Repositories\AppointmentRepository;
use App\Http\Requests\AppointmentRequest;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    protected $appointmentRepository;

    public function __construct(AppointmentRepository $appointmentRepository)
    {
        $this->appointmentRepository = $appointmentRepository;
    }

    // Listar todos os atendimentos (com paginação e filtro)
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);
        $filters = [
            'client_name' => $request->get('client_name'),
            'date' => $request->get('date'),
            'status' => $request->get('status'),
        ];

        $result = $this->appointmentRepository->getFilteredAppointments($filters, $limit, $offset);

        $columns = [
            ['label' => 'Cliente', 'field' => 'client.full_name'],
            ['label' => 'Profissional', 'field' => 'user.name'],
            ['label' => 'Data', 'field' => 'date_br'],
            ['label' => 'Hora', 'field' => 'time'],
            ['label' => 'Procedimento', 'field' => 'procedure'],
            ['label' => 'Status', 'field' => 'status'],
        ];

        return response()->json([
            'data' => $result['appointments'],
            'columns' => $columns,
            'total' => $result['total'],
            'offset' => $offset,
            'limit' => $limit,
        ]);
    }

    // Criar um novo atendimento
    public function store(AppointmentRequest $request)
    {
        $appointment = $this->appointmentRepository->create($request->all());
        return response()->json(['message' => 'Atendimento criado com sucesso!', 'appointment' => $appointment], 201);
    }

    // Exibir um atendimento específico
    public function show($id)
    {
        $appointment = $this->appointmentRepository->findById($id);
        if (!$appointment) {
            return response()->json(['message' => 'Atendimento não encontrado.'], 404);
        }
        return response()->json($appointment);
    }

    // Atualizar um atendimento
    public function update(AppointmentRequest $request, $id)
    {
        $updated = $this->appointmentRepository->update($id, $request->all());
        if (!$updated) {
            return response()->json(['message' => 'Atendimento não encontrado.'], 404);
        }
        return response()->json(['message' => 'Atendimento atualizado com sucesso!', 'appointment' => $updated], 200);
    }

    // Remover um atendimento
    public function destroy($id)
    {
        $deleted = $this->appointmentRepository->delete($id);
        if (!$deleted) {
            return response()->json(['message' => 'Atendimento não encontrado.'], 404);
        }
        return response()->json(['message' => 'Atendimento removido com sucesso!'], 200);
    }
}