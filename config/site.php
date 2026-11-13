<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Locales
    |--------------------------------------------------------------------------
    |
    | The languages the public website is published in, in the order they
    | are listed in the language switcher. The first entry is the default
    | language and is served without a prefix ("/", "/posts"); the others
    | are served under "/{locale}" (for example "/en" and "/it/posts").
    |
    */

    'locales' => ['sq', 'en', 'it'],

    /*
    |--------------------------------------------------------------------------
    | Contact Details
    |--------------------------------------------------------------------------
    |
    | Shown in the header, the Clients section and the WhatsApp button.
    | Requests sent through the website form are emailed to "recipient"
    | when it is set; they are always stored in "contact_requests".
    | "whatsapp" defaults to the phone number. Write numbers in the
    | international format, for example "+355 69 680 0707".
    |
    */

    'contact' => [
        'recipient' => env('CONTACT_RECIPIENT'),
        'email' => env('CONTACT_EMAIL'),
        'phone' => env('CONTACT_PHONE'),
        'whatsapp' => env('CONTACT_WHATSAPP', env('CONTACT_PHONE')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Company & Social Profiles
    |--------------------------------------------------------------------------
    |
    | The VAT number is shown in the footer. Social links are shown as icons
    | in the footer and the Clients section; until a link is set, the icon
    | is shown without a link.
    |
    */

    'vat_number' => env('SITE_VAT_NUMBER'),

    'social' => [
        'facebook' => env('SOCIAL_FACEBOOK_URL'),
        'instagram' => env('SOCIAL_INSTAGRAM_URL'),
    ],

];
