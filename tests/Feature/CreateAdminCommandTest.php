<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('it creates a verified admin account', function () {
    $this->artisan('admin:create', ['--email' => 'admin@example.com', '--name' => 'Admin'])
        ->expectsQuestion('Password', 'a-long-test-password')
        ->assertSuccessful();

    $user = User::sole();

    expect($user->email)->toBe('admin@example.com')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(Hash::check('a-long-test-password', $user->password))->toBeTrue();
});

test('running it again for the same email resets the password', function () {
    $user = User::factory()->create(['email' => 'admin@example.com']);

    $this->artisan('admin:create', ['--email' => 'admin@example.com', '--name' => 'Admin'])
        ->expectsQuestion('Password', 'a-new-test-password')
        ->assertSuccessful();

    expect(User::count())->toBe(1)
        ->and(Hash::check('a-new-test-password', $user->fresh()->password))->toBeTrue();
});

test('it rejects an invalid email address', function () {
    $this->artisan('admin:create', ['--email' => 'not-an-email', '--name' => 'Admin'])
        ->expectsQuestion('Password', 'a-long-test-password')
        ->assertFailed();

    expect(User::count())->toBe(0);
});

test('the website offers no public sign-up', function () {
    $this->get('/register')->assertNotFound();
    $this->post('/register', [])->assertNotFound();
});
