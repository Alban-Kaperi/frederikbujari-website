<?php

use App\Models\ContactRequest;
use App\Models\Post;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('the dashboard summarises requests and posts', function () {
    ContactRequest::factory()->create(['created_at' => now()->subMonths(2), 'read_at' => now()]);
    ContactRequest::factory()->count(2)->create(['created_at' => now()]);
    $latestPost = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('stats', [
                'unreadRequests' => 2,
                'requestsThisMonth' => 2,
                'totalRequests' => 3,
                'posts' => 1,
            ])
            ->has('latestRequests', 3)
            ->where('latestPosts.0.id', $latestPost->id)
        );
});
