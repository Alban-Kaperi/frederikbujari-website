<?php

use App\Models\Post;
use Inertia\Testing\AssertableInertia as Assert;

test('the posts page lists posts newest first', function () {
    $older = Post::factory()->create(['created_at' => now()->subWeek()]);
    $newer = Post::factory()->create(['created_at' => now()]);

    $this->get(route('posts.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('posts/index')
            ->where('site.locale', 'sq')
            ->where('posts.data.0.id', $newer->id)
            ->where('posts.data.0.url', route('posts.show', $newer))
            ->where('posts.data.1.id', $older->id)
        );
});

test('post links stay in the language being browsed', function () {
    $post = Post::factory()->create();

    $this->get(route('localized.posts.index', ['locale' => 'en']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.locale', 'en')
            ->where('posts.data.0.url', route('localized.posts.show', ['locale' => 'en', 'post' => $post]))
        );
});

test('a post page shows the formatted text and its own seo tags', function () {
    $post = Post::factory()->create([
        'title' => 'Pagesat moderne',
        'body' => "Hello **world** and *friends*\nsecond line",
        'thumbnail_path' => 'posts/cover.jpg',
    ]);

    $this->get(route('localized.posts.show', ['locale' => 'en', 'post' => $post]))
        ->assertOk()
        ->assertSee('<meta property="og:type" content="article">', false)
        ->assertSee('<meta property="og:image" content="'.$post->thumbnail_url.'">', false)
        ->assertSee('<meta name="description" content="Hello world and friends second line">', false)
        ->assertSee('<link rel="alternate" hreflang="sq" href="'.route('posts.show', $post).'">', false)
        ->assertSee('"@type":"BlogPosting"', false)
        ->assertInertia(fn (Assert $page) => $page
            ->component('posts/show')
            ->where('post.title', 'Pagesat moderne')
            ->where('post.bodyHtml', "<p>Hello <strong>world</strong> and <em>friends</em><br>\nsecond line</p>")
        );
});

test('a post is found by its slug', function () {
    $post = Post::factory()->create(['title' => 'Hapja e një biznesi të ri']);

    expect($post->slug)->toBe('hapja-e-nje-biznesi-te-ri');

    $this->get('/posts/hapja-e-nje-biznesi-te-ri')->assertOk();
    $this->get('/posts/'.$post->id)->assertNotFound();
});

test('posts with the same title get different slugs', function () {
    $first = Post::factory()->create(['title' => 'Lajme']);
    $second = Post::factory()->create(['title' => 'Lajme']);

    expect($first->slug)->toBe('lajme')
        ->and($second->slug)->toBe('lajme-2');
});
