<?php

namespace Tests\Feature\Api;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private array $taskData;

    protected function setUp(): void
    {

        parent::setUp();

        $this->user = $this->createUser();
        $this->taskData = $this->createTaskData();
    }

    public function test_returns_paginated_task_list(): void
    {

        Task::factory()->count(10)->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/tasks');

        $response->assertHeader('Content-type', 'application/json')
            ->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }

    public function test_store_task_successfull(): void
    {

        $response = $this->actingAs($this->user)->postJson('/api/tasks', $this->taskData);

        $response->assertHeader('Content-type', 'application/json')
            ->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => $this->taskData['title'],
                    'description' => $this->taskData['description'],

                ],
            ]);
    }

    public function test_update_task_successfull(): void
    {

        $task = Task::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $newData = [
            'title' => 'updated title',
            'description' => 'description',
            'status' => 'pending',
            'priority' => 'low',
            'deadline' => Carbon::today()->addDays(3),
        ];

        $response = $this->actingAs($this->user)->putJson('/api/tasks/'.$task->id, $newData);

        $response->assertHeader('Content-type', 'application/json')
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    'title' => $newData['title'],
                    'description' => $newData['description'],

                ],
            ]);
    }

    public function test_delete_task_successfull(): void
    {

        $task = Task::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->deleteJson('/api/tasks/'.$task->id);

        $response->assertStatus(204);

        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
    }

    public function test_complete_task_successfull(): void
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'api')->patchJson('/api/tasks/'.$task->id.'/complete');

        $response->assertHeader('Content-type', 'application/json')
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'completed',

                ],
            ]);
    }

    public function test_store_task_validation_error(): void
    {

        $response = $this->actingAs($this->user, 'api')->postJson('/api/tasks/', [
            'title' => '',
            'description' => '',
        ]);

        $response->assertStatus(422);
        $response->assertInvalid(['title', 'description']);
    }

    public function test_update_task_validation_error(): void
    {
        $task = Task::factory()->create([

            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'api')->putJson('/api/tasks/'.$task->id, [
            'title' => '',
            'description' => '',
        ]);

        $response->assertStatus(422);
        $response->assertInvalid(['title', 'description']);
    }

    public function test_complete_already_completed_task(): void
    {

        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($this->user, 'api')->patchJson('/api/tasks/'.$task->id.'/complete');

        $response->assertStatus(409);
        $response->assertJsonFragment(['status' => 'error']);
        $response->assertJsonFragment(['message' => 'task is already completed']);
    }

    public function test_store_task_by_passing_invalid_token_authorization_error(): void
    {

        $invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx';

        $response = $this->postJson('/api/tasks', $this->taskData, [
            'Authorization' => 'Bearer '.$invalidToken,
        ]);

        $response->assertHeader('Content-type', 'application/json')
            ->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'Unauthenticated.',
            ]);
    }

    private function createUser(): User
    {

        $user = User::factory()->create();

        return $user;
    }

    private function createTaskData(): array
    {

        return [
            'title' => 'sample title',
            'description' => 'sample description',
            'user_id' => $this->user->id,
            'priority' => 'low',
            'deadline' => Carbon::today()->addDays(3),
        ];
    }
}
