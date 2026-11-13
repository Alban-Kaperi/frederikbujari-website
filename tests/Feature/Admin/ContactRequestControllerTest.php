<?php

use App\Models\ContactRequest;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function (string $method, Closure $url) {
    $this->{$method}($url())->assertRedirect(route('login'));
})->with([
    'list' => ['get', fn () => route('admin.requests.index')],
    'show' => ['get', fn () => route('admin.requests.show', ContactRequest::factory()->create())],
    'mark unread' => ['patch', fn () => route('admin.requests.unread', ContactRequest::factory()->create())],
    'delete' => ['delete', fn () => route('admin.requests.destroy', ContactRequest::factory()->create())],
]);

test('the admin sees all requests newest first with their read state', function () {
    $older = ContactRequest::factory()->create(['created_at' => now()->subDay(), 'read_at' => now()]);
    $newer = ContactRequest::factory()->create(['created_at' => now()]);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.requests.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/requests/index')
            ->where('filter', 'all')
            ->where('counts', ['all' => 2, 'unread' => 1])
            ->where('requests.data.0.id', $newer->id)
            ->where('requests.data.0.isRead', false)
            ->where('requests.data.1.id', $older->id)
            ->where('requests.data.1.isRead', true)
        );
});

test('the unread filter only lists new requests', function () {
    ContactRequest::factory()->create(['read_at' => now()]);
    $unread = ContactRequest::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.requests.index', ['filter' => 'unread']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('filter', 'unread')
            ->has('requests.data', 1)
            ->where('requests.data.0.id', $unread->id)
        );
});

test('opening a request shows it and marks it as read', function () {
    $contactRequest = ContactRequest::factory()->create(['message' => "Line one\nLine two"]);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.requests.show', $contactRequest))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/requests/show')
            ->where('contactRequest.message', "Line one\nLine two")
            ->where('contactRequest.isRead', true)
        );

    expect($contactRequest->fresh()->read_at)->not->toBeNull();
});

test('a request can be marked as unread again', function () {
    $contactRequest = ContactRequest::factory()->create(['read_at' => now()]);

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.requests.unread', $contactRequest))
        ->assertRedirect(route('admin.requests.index'));

    expect($contactRequest->fresh()->read_at)->toBeNull();
});

test('a request can be deleted', function () {
    $contactRequest = ContactRequest::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.requests.destroy', $contactRequest))
        ->assertRedirect(route('admin.requests.index'));

    $this->assertModelMissing($contactRequest);
});

test('the number of new requests is shared with every admin page for the menu badge', function () {
    ContactRequest::factory()->count(2)->create();
    ContactRequest::factory()->create(['read_at' => now()]);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.posts.index'))
        ->assertInertia(fn (Assert $page) => $page->where('unreadRequestCount', 2));
});
