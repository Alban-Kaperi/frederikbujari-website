<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\LocalizedPage;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Render the XML sitemap: every public page in every language, with its alternates.
     */
    public function __invoke(): Response
    {
        $pages = collect([
            ['alternates' => LocalizedPage::alternates('home'), 'lastModified' => null, 'priority' => '1.0'],
            ['alternates' => LocalizedPage::alternates('posts.index'), 'lastModified' => Post::max('updated_at'), 'priority' => '0.8'],
        ])->concat(
            Post::query()->latest()->get(['slug', 'updated_at'])->map(fn (Post $post): array => [
                'alternates' => LocalizedPage::alternates('posts.show', ['post' => $post->slug]),
                'lastModified' => $post->updated_at,
                'priority' => '0.6',
            ]),
        );

        return response()
            ->view('sitemap', ['pages' => $pages])
            ->header('Content-Type', 'application/xml');
    }
}
