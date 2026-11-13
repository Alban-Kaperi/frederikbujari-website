<?php

use App\Http\Controllers\Admin\ContactRequestController as AdminContactRequestController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\ContactRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\SetLocale;
use App\Support\LocalizedPage;
use Illuminate\Support\Facades\Route;

/*
| Public pages are registered twice: without a prefix for the default language
| (Albanian), and under "/{locale}" for the other languages, named "localized.*".
| See App\Support\LocalizedPage::url() for building links between them.
*/
$publicPages = function (): void {
    Route::get('/', HomeController::class)->name('home');
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');
};

Route::middleware(SetLocale::class)->group($publicPages);

Route::get('sitemap.xml', SitemapController::class)->name('sitemap');

Route::get('robots.txt', fn () => response('User-agent: *
Disallow: /dashboard
Disallow: /settings

Sitemap: '.route('sitemap').'
')
    ->header('Content-Type', 'text/plain'))
    ->name('robots');

Route::post('contact', [ContactRequestController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('dashboard/posts', AdminPostController::class)
        ->except('show')
        ->names('admin.posts');

    Route::get('dashboard/requests', [AdminContactRequestController::class, 'index'])->name('admin.requests.index');
    Route::get('dashboard/requests/{contactRequest}', [AdminContactRequestController::class, 'show'])->name('admin.requests.show');
    Route::patch('dashboard/requests/{contactRequest}/unread', [AdminContactRequestController::class, 'markUnread'])->name('admin.requests.unread');
    Route::delete('dashboard/requests/{contactRequest}', [AdminContactRequestController::class, 'destroy'])->name('admin.requests.destroy');
});

require __DIR__.'/settings.php';

Route::prefix('{locale}')
    ->whereIn('locale', array_slice(LocalizedPage::locales(), 1))
    ->name('localized.')
    ->middleware(SetLocale::class)
    ->group($publicPages);
