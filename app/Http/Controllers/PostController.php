<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\LocalizedPage;
use Illuminate\Support\Facades\App;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * List the published posts, newest first.
     */
    public function index(): Response
    {
        $locale = App::getLocale();

        $posts = Post::query()
            ->latest()
            ->paginate(9)
            ->through(fn (Post $post): array => [
                'id' => $post->id,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'thumbnailUrl' => $post->thumbnail_url,
                'date' => $post->created_at->locale($locale)->isoFormat('LL'),
                'dateTime' => $post->created_at->toAtomString(),
                'url' => LocalizedPage::url('posts.show', $locale, ['post' => $post->slug]),
            ]);

        return LocalizedPage::render('posts/index', 'posts.index', [], [
            'posts' => $posts,
        ], [
            'title' => __('site.posts.meta_title'),
            'description' => __('site.posts.meta_description'),
        ]);
    }

    /**
     * Show a single post.
     */
    public function show(Post $post): Response
    {
        $locale = App::getLocale();

        return LocalizedPage::render('posts/show', 'posts.show', ['post' => $post->slug], [
            'post' => [
                'title' => $post->title,
                'bodyHtml' => $post->body_html,
                'thumbnailUrl' => $post->thumbnail_url,
                'date' => $post->created_at->locale($locale)->isoFormat('LL'),
                'dateTime' => $post->created_at->toAtomString(),
            ],
        ], [
            'title' => $post->title.' — Saint Matthew Merchant LLC',
            'description' => $post->excerpt,
            'image' => $post->thumbnail_url,
            'type' => 'article',
            'schema' => [
                '@type' => 'BlogPosting',
                'headline' => $post->title,
                'description' => $post->excerpt,
                'image' => $post->thumbnail_url,
                'datePublished' => $post->created_at->toAtomString(),
                'dateModified' => $post->updated_at->toAtomString(),
                'mainEntityOfPage' => LocalizedPage::url('posts.show', $locale, ['post' => $post->slug]),
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'Saint Matthew Merchant LLC',
                    'logo' => asset('images/logo-dark.png'),
                ],
            ],
        ]);
    }
}
