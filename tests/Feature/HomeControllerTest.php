<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the home page renders in albanian at the root url', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertSee('<html lang="sq"', false)
        ->assertSee('<link rel="canonical" href="'.route('home').'">', false)
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('site.locale', 'sq')
            ->where('site.content.nav.about', 'Rreth nesh')
        );
});

test('the home page renders in the requested language', function (string $locale, string $aboutLabel) {
    $url = route('localized.home', ['locale' => $locale]);

    $this->get($url)
        ->assertOk()
        ->assertSee('<html lang="'.$locale.'"', false)
        ->assertSee('<link rel="canonical" href="'.$url.'">', false)
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.locale', $locale)
            ->where('site.content.nav.about', $aboutLabel)
        );
})->with([
    'english' => ['en', 'About us'],
    'italian' => ['it', 'Su di noi'],
]);

test('the language switcher lists albanian, english and italian in that order', function () {
    $this->get(route('localized.home', ['locale' => 'it']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.alternates', [
                'sq' => route('home'),
                'en' => route('localized.home', ['locale' => 'en']),
                'it' => route('localized.home', ['locale' => 'it']),
            ])
            ->where('site.languageNames', ['sq' => 'Shqip', 'en' => 'English', 'it' => 'Italiano'])
        );
});

test('every language version links to all alternates', function () {
    $this->get(route('localized.home', ['locale' => 'it']))
        ->assertSee('<link rel="alternate" hreflang="sq" href="'.route('home').'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.route('localized.home', ['locale' => 'en']).'">', false)
        ->assertSee('<link rel="alternate" hreflang="it" href="'.route('localized.home', ['locale' => 'it']).'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.route('home').'">', false);
});

test('unsupported or default language prefixes return 404', function (string $path) {
    $this->get($path)->assertNotFound();
})->with(['/sq', '/de']);

test('the phone number is turned into call and whatsapp links', function () {
    config(['site.contact.phone' => '+355 69 680 0707', 'site.contact.whatsapp' => '+355 69 680 0707']);

    $this->get(route('localized.home', ['locale' => 'en']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.contact.phone', '+355 69 680 0707')
            ->where('site.contact.phoneUrl', 'tel:+355696800707')
            ->where('site.contact.whatsappUrl', 'https://wa.me/355696800707?text='.rawurlencode('Hello Saint Matthew Merchant, I would like some information.'))
        );
});

test('contact links are left out when no details are configured', function () {
    config(['site.contact.email' => null, 'site.contact.phone' => null, 'site.contact.whatsapp' => null]);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.contact.email', null)
            ->where('site.contact.phoneUrl', null)
            ->where('site.contact.whatsappUrl', null)
        );
});

test('social profiles are always shared, with null until a link is set', function () {
    config(['site.social' => ['facebook' => 'https://www.facebook.com/example', 'instagram' => '']]);

    $this->get(route('home'))
        ->assertSee('"sameAs":["https://www.facebook.com/example"]', false)
        ->assertInertia(fn (Assert $page) => $page
            ->where('site.social', ['facebook' => 'https://www.facebook.com/example', 'instagram' => null])
        );
});

test('the vat number comes from the configuration', function () {
    config(['site.vat_number' => '123456789']);

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->where('site.vatNumber', '123456789'));
});
