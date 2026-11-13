<?php

namespace App\Http\Controllers;

use App\Support\LocalizedPage;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Show the home page in the current language.
     */
    public function __invoke(): Response
    {
        return LocalizedPage::render('home', 'home', [], [], [
            'title' => __('site.meta.title'),
            'description' => __('site.meta.description'),
            'schema' => [
                '@type' => 'Organization',
                'name' => 'Saint Matthew Merchant LLC',
                'url' => LocalizedPage::url('home', LocalizedPage::defaultLocale()),
                'logo' => asset('images/logo-dark.png'),
                'image' => asset('images/og-image.jpg'),
                'description' => __('site.meta.description'),
                'foundingDate' => '2016',
                'vatID' => config('site.vat_number'),
                'email' => config('site.contact.email'),
                'telephone' => config('site.contact.phone'),
                'sameAs' => array_values(array_filter(LocalizedPage::socialLinks())),
                'areaServed' => ['Kosovo', 'Albania', 'North Macedonia'],
                'address' => [
                    ['@type' => 'PostalAddress', 'addressCountry' => 'XK'],
                    ['@type' => 'PostalAddress', 'addressLocality' => 'Tirana', 'addressCountry' => 'AL'],
                    ['@type' => 'PostalAddress', 'addressLocality' => 'Skopje', 'addressCountry' => 'MK'],
                ],
            ],
        ]);
    }
}
