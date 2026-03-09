<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Map;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MapBuilderControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function createPointerPayload($count = 1)
    {
        $pointers = [];

        for ($i = 0; $i < $count; $i++) {
            $pointers[] = [
                'id' => 'pointer-' . $i,
                'src' => '/images/pointer.png',
                'name' => 'Pointer ' . $i,
                'x' => 10,
                'y' => 20,
                'width' => 8,
                'height' => 8,
                'trigger' => 'hover',
                'animate' => false,
            ];
        }

        return $pointers;
    }

    /** @test */
    public function user_can_save_map_when_valid()
    {
        $user = User::factory()->create();

        $payload = [
            'base' => [
                'src' => '/images/base.jpg',
            ],
            'pointers' => $this->createPointerPayload(3),
        ];

        $response = $this
            ->actingAs($user)
            ->postJson('/map-builder', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseCount('maps', 1);
        $this->assertDatabaseCount('map_pointers', 3);
    }

    /** @test */
    public function cannot_save_map_if_pointer_exceeds_limit()
    {
        $user = User::factory()->create();

        $payload = [
            'base' => ['src' => '/images/base.jpg'],
            'pointers' => $this->createPointerPayload(31),
        ];

        $response = $this
            ->actingAs($user)
            ->postJson('/map-builder', $payload);

        $response->assertStatus(422);
    }

    /** @test */
    public function user_cannot_exceed_map_limit()
    {
        $user = User::factory()->create();

        Map::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);

        $payload = [
            'base' => ['src' => '/images/base.jpg'],
            'pointers' => $this->createPointerPayload(1),
        ];

        $response = $this
            ->actingAs($user)
            ->postJson('/map-builder', $payload);

        $response->assertStatus(403);
    }
}
