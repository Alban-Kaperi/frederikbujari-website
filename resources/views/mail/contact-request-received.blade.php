<x-mail::message>
# New request from the website

**Name:** {{ $contactRequest->name }}<br>
**Email:** {{ $contactRequest->email }}<br>
**Language:** {{ strtoupper($contactRequest->locale) }}

<x-mail::panel>
{{ $contactRequest->message }}
</x-mail::panel>

Reply to this email to answer {{ $contactRequest->name }} directly.
</x-mail::message>
