<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {

        parent::setUp();

        $this->user = $this->createUser();
    }

    public function test_new_users_can_register(): void
    {

        $payload = [
            'name' => 'arthur',
            'email' => 'arthur@test.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $response = $this->postJson('/api/register', $payload);

        $this->assertNotEmpty($response->json('authorization.token'));

        $response->assertStatus(201);
        $response->assertJson([
            'data' => [
                'name' => $payload['name'],
                'email' => $payload['email'],
            ],
        ]);
    }

    public function test_users_can_login_and_validate_jwt_and_logout(): void
    {

        $response = $this->postJson('/api/login', [
            'email' => $this->user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);

        $this->assertNotEmpty($response->json('authorization.token'));

        $response->assertJson([
            'data' => [
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
        ]);
        $token = $response->json('authorization.token');

        auth()->forgetGuards();
        app('tymon.jwt')->unsetToken();

        $response = $this->getJson('api/me');
        $response->assertStatus(401);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)->getJson('api/me');
        $response->assertStatus(200);

        $response = $this->postJson('/api/logout')->assertStatus(200)->assertJsonFragment(['message' => 'Successfully logged out']);
    }

    public function test_users_cannot_register_with_same_email(): void
    {

        $payload = [
            'name' => 'arthur',
            'email' => $this->user->email,
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422);
        $response->assertInvalid(['email']);
    }

    public function test_users_cannot_login_with_invalid_credintials(): void
    {

        $response = $this->postJson('/api/login', [
            'email' => 'wronguser@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(401);

        $response->assertJsonStructure([
            'status',
            'message',
        ]);
    }

    private function createUser(): User
    {

        return User::factory()->create();
    }
}
