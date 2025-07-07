<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    public function __construct(protected TaskService $taskService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $user = Auth::user();
        $limit = (int) $request->query('limit') ?? 0;

        if ($request->query('status')) {

            return TaskResource::collection(
                $this->taskService->filterTasksByStatusPaginated($user, $request->query('status'), $limit)
            );
        }

        return TaskResource::collection($this->taskService->allPaginated($user, $limit));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {

        $task = $this->taskService->create(array_merge($request->validated(),
            ['user_id' => Auth::user()->id]));

        return new TaskResource($task);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {

        Gate::authorize('view', $task);

        return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, Task $task)
    {

        Gate::authorize('update', $task);

        $task = $this->taskService->update($request->validated(), $task->id);

        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {

        Gate::authorize('delete', $task);

        $this->taskService->delete($task->id);

        return response()->noContent();
    }
}
