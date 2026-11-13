<?php

use App\Mail\ContactRequestReceived;
use App\Models\ContactRequest;
use Illuminate\Support\Facades\Mail;

function validContactRequest(array $overrides = []): array
{
    return [
        'name' => 'Arta Krasniqi',
        'email' => 'arta@example.com',
        'message' => 'I would like a quotation for company formation.',
        'locale' => 'sq',
        ...$overrides,
    ];
}

test('a contact request is stored and emailed to the configured recipient', function () {
    Mail::fake();
    config(['site.contact.recipient' => 'office@example.com']);

    $this->from(route('localized.home', ['locale' => 'en']))
        ->post(route('contact.store'), validContactRequest())
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('localized.home', ['locale' => 'en']));

    $contactRequest = ContactRequest::sole();

    expect($contactRequest->only('name', 'email', 'message', 'locale'))
        ->toBe(validContactRequest());

    Mail::assertSent(ContactRequestReceived::class, fn (ContactRequestReceived $mail) => $mail->hasTo('office@example.com')
        && $mail->hasReplyTo('arta@example.com')
        && $mail->contactRequest->is($contactRequest));
});

test('a contact request is stored without email when no recipient is configured', function () {
    Mail::fake();
    config(['site.contact.recipient' => null]);

    $this->post(route('contact.store'), validContactRequest())->assertSessionHasNoErrors();

    expect(ContactRequest::count())->toBe(1);
    Mail::assertNothingSent();
});

test('a contact request requires name, email and message', function () {
    $this->post(route('contact.store'), ['locale' => 'en'])
        ->assertSessionHasErrors([
            'name' => 'The name field is required.',
            'email' => 'The email field is required.',
            'message' => 'The message field is required.',
        ]);

    expect(ContactRequest::count())->toBe(0);
});

test('a contact request is rejected for invalid input', function (array $overrides, string $field) {
    $this->post(route('contact.store'), validContactRequest($overrides))
        ->assertSessionHasErrors($field);

    expect(ContactRequest::count())->toBe(0);
})->with([
    'invalid email' => [['email' => 'not-an-email'], 'email'],
    'unsupported locale' => [['locale' => 'de'], 'locale'],
    'message too long' => [['message' => str_repeat('a', 5001)], 'message'],
    'honeypot filled by a bot' => [['website' => 'https://spam.example'], 'website'],
]);

test('contact requests are rate limited', function () {
    Mail::fake();

    foreach (range(1, 5) as $attempt) {
        $this->post(route('contact.store'), validContactRequest())->assertRedirect();
    }

    $this->post(route('contact.store'), validContactRequest())->assertTooManyRequests();

    expect(ContactRequest::count())->toBe(5);
});
