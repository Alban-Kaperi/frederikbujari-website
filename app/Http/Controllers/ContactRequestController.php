<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequestRequest;
use App\Mail\ContactRequestReceived;
use App\Models\ContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactRequestController extends Controller
{
    /**
     * Store a request sent through the website's contact form.
     */
    public function store(StoreContactRequestRequest $request): RedirectResponse
    {
        $contactRequest = ContactRequest::create($request->safe()->except('website'));

        if ($recipient = config('site.contact.recipient')) {
            Mail::to($recipient)->send(new ContactRequestReceived($contactRequest));
        }

        return back();
    }
}
