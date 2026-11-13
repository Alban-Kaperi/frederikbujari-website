<?php

use App\Models\Post;

test('the sitemap lists every page in every language', function () {
    $post = Post::factory()->create(['title' => 'Hapja e një biznesi']);

    $this->get(route('sitemap'))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml')
        ->assertSee('<loc>'.route('home').'</loc>', false)
        ->assertSee('<loc>'.route('localized.home', ['locale' => 'en']).'</loc>', false)
        ->assertSee('<loc>'.route('localized.home', ['locale' => 'it']).'</loc>', false)
        ->assertSee('<loc>'.route('posts.index').'</loc>', false)
        ->assertSee('<loc>'.route('posts.show', $post).'</loc>', false)
        ->assertSee('<loc>'.route('localized.posts.show', ['locale' => 'it', 'post' => $post]).'</loc>', false);
});

test('robots.txt points crawlers to the sitemap', function () {
    $this->get(route('robots'))
        ->assertOk()
        ->assertSee('Sitemap: '.route('sitemap'));
});
