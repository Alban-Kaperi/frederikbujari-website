<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactRequestController extends Controller
{
    /**
     * List the requests sent through the website's contact form, newest first.
     */
    public function index(Request $request): Response
    {
        $showUnreadOnly = $request->query('filter') === 'unread';

        return Inertia::render('admin/requests/index', [
            'filter' => $showUnreadOnly ? 'unread' : 'all',
            'counts' => [
                'all' => ContactRequest::count(),
                'unread' => ContactRequest::unread()->count(),
            ],
            'requests' => ContactRequest::query()
                ->when($showUnreadOnly, fn ($query) => $query->unread())
                ->latest()
                ->paginate(20)
                ->withQueryString()
                ->through(fn (ContactRequest $contactRequest): array => $contactRequest->toAdminArray()),
        ]);
    }

    /**
     * Show a request and mark it as read.
     */
    public function show(ContactRequest $contactRequest): Response
    {
        if ($contactRequest->read_at === null) {
            $contactRequest->forceFill(['read_at' => now()])->save();
        }

        return Inertia::render('admin/requests/show', [
            'contactRequest' => $contactRequest->toAdminArray(),
        ]);
    }

    /**
     * Mark a request as unread again, so it shows up as new.
     */
    public function markUnread(ContactRequest $contactRequest): RedirectResponse
    {
        $contactRequest->forceFill(['read_at' => null])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Marked as unread.']);

        return to_route('admin.requests.index');
    }

    /**
     * Delete a request.
     */
    public function destroy(ContactRequest $contactRequest): RedirectResponse
    {
        $contactRequest->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Request deleted.']);

        return to_route('admin.requests.index');
    }
}
