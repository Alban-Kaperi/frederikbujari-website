<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Models\Post;
use App\Support\LocalizedPage;
use App\Support\ThumbnailImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * List all posts for the admin.
     */
    public function index(): Response
    {
        return Inertia::render('admin/posts/index', [
            'posts' => Post::query()
                ->latest()
                ->paginate(20)
                ->through(fn (Post $post): array => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'thumbnailUrl' => $post->thumbnail_url,
                    'createdAt' => $post->created_at->isoFormat('LL'),
                    'publicUrl' => LocalizedPage::url('posts.show', LocalizedPage::defaultLocale(), ['post' => $post->slug]),
                ]),
        ]);
    }

    /**
     * Show the form for writing a new post.
     */
    public function create(): Response
    {
        return Inertia::render('admin/posts/create', [
            'languages' => LocalizedPage::languageNames(),
        ]);
    }

    /**
     * Publish a new post.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        Post::create([
            ...$request->postContent(),
            'thumbnail_path' => ThumbnailImage::store($request->file('thumbnail')),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post published.')]);

        return to_route('admin.posts.index');
    }

    /**
     * Show the form for editing a post.
     */
    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'languages' => LocalizedPage::languageNames(),
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'body' => $post->body,
                'translations' => $post->translations ?? (object) [],
                'thumbnailUrl' => $post->thumbnail_url,
                'publicUrl' => LocalizedPage::url('posts.show', LocalizedPage::defaultLocale(), ['post' => $post->slug]),
            ],
        ]);
    }

    /**
     * Save changes to a post, replacing the thumbnail when a new one is uploaded.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post->fill($request->postContent());

        if ($request->hasFile('thumbnail')) {
            $previousThumbnail = $post->thumbnail_path;
            $post->thumbnail_path = ThumbnailImage::store($request->file('thumbnail'));
        }

        $post->save();

        if (isset($previousThumbnail)) {
            Storage::disk('public')->delete($previousThumbnail);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post updated.')]);

        return to_route('admin.posts.index');
    }

    /**
     * Delete a post and its thumbnail.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post deleted.')]);

        return to_route('admin.posts.index');
    }
}
