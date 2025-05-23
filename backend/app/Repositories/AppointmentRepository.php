<?php

namespace App\Repositories;

use App\Models\Appointment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AppointmentRepository
{
    public function getFilteredAppointments($filters = [], $limit = 10, $offset = 0)
    {
        $query = Appointment::with(['client', 'user']);

        if (!empty($filters['client_name'])) {
            $query->whereHas('client', function ($q) use ($filters) {
                $q->where('full_name', 'like', '%' . $filters['client_name'] . '%');
            });
        }
        if (!empty($filters['date'])) {
            $query->where('date', $filters['date']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $total = $query->count();
        $appointments = $query->orderBy('date', 'desc')
            ->orderBy('time', 'asc')
            ->skip($offset)
            ->take($limit)
            ->get();

        return [
            'appointments' => $appointments,
            'total' => $total,
        ];
    }

    public function create(array $data)
    {
        Storage::disk('public')->makeDirectory('appointments/before');
        Storage::disk('public')->makeDirectory('appointments/after');

        if (isset($data['before_photo']) && $data['before_photo'] instanceof UploadedFile) {
            $path = $data['before_photo']->store('appointments/before', 'public');
            $data['before_photo'] = '/storage/' . $path;
        }
        if (isset($data['after_photo']) && $data['after_photo'] instanceof UploadedFile) {
            $path = $data['after_photo']->store('appointments/after', 'public');
            $data['after_photo'] = '/storage/' . $path;
        }
        return Appointment::create($data);
    }

    public function findById($id)
    {
        return Appointment::with(['client', 'user'])->find($id);
    }

    public function update($id, array $data)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return null;
        }
        Storage::disk('public')->makeDirectory('appointments/before');
        Storage::disk('public')->makeDirectory('appointments/after');

        if (isset($data['before_photo']) && $data['before_photo'] instanceof UploadedFile) {
            $path = $data['before_photo']->store('appointments/before', 'public');
            $data['before_photo'] = '/storage/' . $path;
        }
        if (isset($data['after_photo']) && $data['after_photo'] instanceof UploadedFile) {
            $path = $data['after_photo']->store('appointments/after', 'public');
            $data['after_photo'] = '/storage/' . $path;
        }
        $appointment->update($data);
        return $appointment;
    }

    public function delete($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return false;
        }
        return $appointment->delete();
    }
}