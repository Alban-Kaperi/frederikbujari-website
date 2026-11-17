<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
});

test('guests are redirected to the login page', function (string $method, Closure $url) {
    $this->{$method}($url())->assertRedirect(route('login'));
})->with([
    'list' => ['get', fn () => route('admin.posts.index')],
    'create' => ['post', fn () => route('admin.posts.store')],
    'update' => ['put', fn () => route('admin.posts.update', Post::factory()->create())],
    'delete' => ['delete', fn () => route('admin.posts.destroy', Post::factory()->create())],
]);

test('the admin sees the list of posts', function () {
    $post = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.posts.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/posts/index')
            ->where('posts.data.0.id', $post->id)
        );
});

test('the admin can publish a post with a thumbnail', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.posts.store'), [
            'title' => 'Si të hapni një kompani',
            'body' => "**Hapi i parë**\nPlanifikimi.",
            'thumbnail' => UploadedFile::fake()->image('cover.jpg', 1200, 800),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.posts.index'));

    $post = Post::sole();

    expect($post->title)->toBe('Si të hapni një kompani')
        ->and($post->slug)->toBe('si-te-hapni-nje-kompani')
        ->and($post->body)->toBe("**Hapi i parë**\nPlanifikimi.");

    Storage::disk('public')->assertExists($post->thumbnail_path);
});

test('a new post needs a title, a description and a thumbnail', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.posts.store'), [])
        ->assertSessionHasErrors(['title', 'body', 'thumbnail']);

    expect(Post::count())->toBe(0);
});

test('the thumbnail must be an image', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.posts.store'), [
            'title' => 'Title',
            'body' => 'Body',
            'thumbnail' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors('thumbnail');

    expect(Post::count())->toBe(0);
});

test('editing a post without a new thumbnail keeps the current one and the slug', function () {
    $post = Post::factory()->create(['title' => 'Old title', 'thumbnail_path' => 'posts/old.jpg']);
    Storage::disk('public')->put('posts/old.jpg', 'image');

    $this->actingAs(User::factory()->create())
        ->put(route('admin.posts.update', $post), [
            'title' => 'New title',
            'body' => 'New *text*',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.posts.index'));

    $post->refresh();

    expect($post->title)->toBe('New title')
        ->and($post->body)->toBe('New *text*')
        ->and($post->slug)->toBe('old-title')
        ->and($post->thumbnail_path)->toBe('posts/old.jpg');

    Storage::disk('public')->assertExists('posts/old.jpg');
});

test('uploading a new thumbnail replaces and deletes the old one', function () {
    $post = Post::factory()->create(['thumbnail_path' => 'posts/old.jpg']);
    Storage::disk('public')->put('posts/old.jpg', 'image');

    $this->actingAs(User::factory()->create())
        ->put(route('admin.posts.update', $post), [
            'title' => $post->title,
            'body' => $post->body,
            'thumbnail' => UploadedFile::fake()->image('new.png'),
        ])
        ->assertSessionHasNoErrors();

    $post->refresh();

    expect($post->thumbnail_path)->not->toBe('posts/old.jpg');
    Storage::disk('public')->assertMissing('posts/old.jpg');
    Storage::disk('public')->assertExists($post->thumbnail_path);
});

test('deleting a post also deletes its thumbnail', function () {
    $post = Post::factory()->create(['thumbnail_path' => 'posts/cover.jpg']);
    Storage::disk('public')->put('posts/cover.jpg', 'image');

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.posts.destroy', $post))
        ->assertRedirect(route('admin.posts.index'));

    $this->assertModelMissing($post);
    Storage::disk('public')->assertMissing('posts/cover.jpg');
});

test('the admin can add translations, and empty or unsupported ones are dropped', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.posts.store'), [
            'title' => 'Titulli',
            'body' => 'Teksti',
            'translations' => [
                'en' => ['title' => 'The title', 'body' => 'The *text*'],
                'it' => ['title' => '', 'body' => ''],
                'de' => ['title' => 'Titel', 'body' => 'Text'],
            ],
            'thumbnail' => UploadedFile::fake()->image('cover.jpg', 1200, 800),
        ])
        ->assertSessionHasNoErrors();

    expect(Post::sole()->translations)->toBe([
        'en' => ['title' => 'The title', 'body' => 'The *text*'],
    ]);
});

test('a translation needs both a title and a description', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.posts.store'), [
            'title' => 'Titulli',
            'body' => 'Teksti',
            'translations' => ['en' => ['title' => 'Only a title', 'body' => '']],
            'thumbnail' => UploadedFile::fake()->image('cover.jpg'),
        ])
        ->assertSessionHasErrors('translations.en.body');

    expect(Post::count())->toBe(0);
});

test('uploaded thumbnails are stored as webp no wider than 1200px', function (string $filename, int $width) {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.posts.store'), [
            'title' => 'Titulli',
            'body' => 'Teksti',
            'thumbnail' => UploadedFile::fake()->image($filename, $width, 600),
        ])
        ->assertSessionHasNoErrors();

    $path = Post::sole()->thumbnail_path;
    [$storedWidth, , $type] = getimagesizefromstring(Storage::disk('public')->get($path));

    expect($path)->toEndWith('.webp')
        ->and($type)->toBe(IMAGETYPE_WEBP)
        ->and($storedWidth)->toBe(min($width, 1200));
})->with([
    'wide jpg is scaled down' => ['cover.jpg', 3000],
    'small png keeps its size' => ['cover.png', 800],
]);
