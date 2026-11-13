<?php

namespace App\Support;

use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Inertia\Response;

class LocalizedPage
{
    /**
     * Get the languages the website is published in, default language first.
     *
     * @return list<string>
     */
    public static function locales(): array
    {
        return config('site.locales');
    }

    /**
     * Get the language served without a URL prefix.
     */
    public static function defaultLocale(): string
    {
        return self::locales()[0];
    }

    /**
     * Get the absolute URL of a public page in the given language.
     *
     * Public routes are registered twice: "{name}" for the default language
     * and "localized.{name}" under the "{locale}" prefix for the others.
     *
     * @param  array<string, mixed>  $parameters
     */
    public static function url(string $routeName, string $locale, array $parameters = []): string
    {
        return $locale === self::defaultLocale()
            ? route($routeName, $parameters)
            : route('localized.'.$routeName, ['locale' => $locale, ...$parameters]);
    }

    /**
     * Get the URL of a public page in every language, keyed by locale.
     *
     * @param  array<string, mixed>  $parameters
     * @return array<string, string>
     */
    public static function alternates(string $routeName, array $parameters = []): array
    {
        return collect(self::locales())
            ->mapWithKeys(fn (string $locale): array => [$locale => self::url($routeName, $locale, $parameters)])
            ->all();
    }

    /**
     * Render a public page with the shared site chrome and its SEO tags.
     *
     * @param  array<string, mixed>  $routeParameters
     * @param  array<string, mixed>  $props
     * @param  array{title: string, description: string, image?: string|null, type?: string, schema?: array<string, mixed>}  $seo
     */
    public static function render(string $component, string $routeName, array $routeParameters, array $props, array $seo): Response
    {
        $locale = App::getLocale();
        $alternates = self::alternates($routeName, $routeParameters);

        return Inertia::render($component, [
            'site' => [
                'locale' => $locale,
                'alternates' => $alternates,
                'languageNames' => collect(self::locales())
                    ->mapWithKeys(fn (string $code): array => [$code => trans('site.language_name', locale: $code)])
                    ->all(),
                'homeUrl' => self::url('home', $locale),
                'postsUrl' => self::url('posts.index', $locale),
                'content' => trans('site'),
                'contact' => self::contactDetails(),
                'vatNumber' => config('site.vat_number'),
                'social' => self::socialLinks(),
            ],
            ...$props,
        ])->withViewData([
            'seo' => [
                'title' => $seo['title'],
                'description' => $seo['description'],
                'canonical' => $alternates[$locale],
                'ogLocale' => trans('site.meta.og_locale'),
                'type' => $seo['type'] ?? 'website',
                'image' => $seo['image'] ?? asset('images/og-image.jpg'),
                'alternates' => [...$alternates, 'x-default' => $alternates[self::defaultLocale()]],
                'schema' => $seo['schema'] ?? null,
            ],
        ]);
    }

    /**
     * Get every social profile with its link, or null when no link is configured yet.
     *
     * @return array<string, string|null>
     */
    public static function socialLinks(): array
    {
        return array_map(fn (?string $url): ?string => $url ?: null, config('site.social'));
    }

    /**
     * Get the contact details with ready-to-use phone and WhatsApp links.
     *
     * @return array{email: string|null, phone: string|null, phoneUrl: string|null, whatsappUrl: string|null}
     */
    public static function contactDetails(): array
    {
        $phone = config('site.contact.phone');
        $whatsapp = config('site.contact.whatsapp');

        return [
            'email' => config('site.contact.email'),
            'phone' => $phone,
            'phoneUrl' => $phone ? 'tel:'.preg_replace('/[^+\d]/', '', $phone) : null,
            'whatsappUrl' => $whatsapp
                ? 'https://wa.me/'.preg_replace('/\D/', '', $whatsapp).'?text='.rawurlencode(trans('site.whatsapp.message'))
                : null,
        ];
    }
}
