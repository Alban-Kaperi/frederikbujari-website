<?php

namespace App\Http\Controllers;

use App\Models\ContactRequest;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin overview: request and post counts, the newest requests and the newest posts.
     */
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'unreadRequests' => ContactRequest::unread()->count(),
                'requestsThisMonth' => ContactRequest::where('created_at', '>=', now()->startOfMonth())->count(),
                'totalRequests' => ContactRequest::count(),
                'posts' => Post::count(),
            ],
            'latestRequests' => ContactRequest::query()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (ContactRequest $contactRequest): array => $contactRequest->toAdminArray()),
            'latestPosts' => Post::query()
                ->latest()
                ->limit(3)
                ->get()
                ->map(fn (Post $post): array => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'thumbnailUrl' => $post->thumbnail_url,
                    'createdAt' => $post->created_at->isoFormat('D MMM YYYY'),
                ]),
        ]);
    }
}
