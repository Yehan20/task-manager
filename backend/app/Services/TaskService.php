<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\TaskAlreadyCompletedExpection;
use App\Models\Task;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{

    /**
     * Display a listing of the resource based on the user no user passed returns all posts
     * @return \Illuminate\Database\Eloquent\Collection;
     */
    public function allPaginated(null|User $user, int $limit = 10): LengthAwarePaginator
    {

        return Task::byUser($user)->latest()->paginate($limit);
    }


    public function filterTasksByStatusPaginated(?User $user, string $status, int $limit = 10): LengthAwarePaginator
    {

        return Task::byUser($user)->where('status', $status)->latest()->paginate($limit)->withQueryString();
    }


    public function create(array $attributes): Task
    {
        $task = Task::create($attributes);
        
        return  $task->refresh();
    }

    public function update(array $attributes, int $id): Task
    {

        $task =  Task::findOrFail($id);

        $task->update($attributes);

        return $task;
    }
    public function find(int $id): Task
    {

        return Task::findOrFail($id);
    }

    public function delete(int $id): bool
    {
        $task = Task::findOrFail($id);

        return $task->delete();
    }

    public function complete(int $id): Task
    {
        $task =  Task::findOrFail($id);

        if ($task->status === 'completed') {
            throw new  TaskAlreadyCompletedExpection();
        }

        $task->status = 'completed';
        $task->save();
        return $task;
    }
}
