<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <style>
            html {
                background-color: #f5f1e8;
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @isset($seo)
            <meta name="description" content="{{ $seo['description'] }}">
            <meta name="theme-color" content="#17130f">
            <link rel="canonical" href="{{ $seo['canonical'] }}">
            @foreach ($seo['alternates'] as $hreflang => $url)
                <link rel="alternate" hreflang="{{ $hreflang }}" href="{{ $url }}">
            @endforeach

            <meta property="og:type" content="{{ $seo['type'] }}">
            <meta property="og:site_name" content="Saint Matthew Merchant LLC">
            <meta property="og:title" content="{{ $seo['title'] }}">
            <meta property="og:description" content="{{ $seo['description'] }}">
            <meta property="og:url" content="{{ $seo['canonical'] }}">
            <meta property="og:image" content="{{ $seo['image'] }}">
            <meta property="og:locale" content="{{ $seo['ogLocale'] }}">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="{{ $seo['title'] }}">
            <meta name="twitter:description" content="{{ $seo['description'] }}">
            <meta name="twitter:image" content="{{ $seo['image'] }}">

            @if ($page['component'] === 'home')
                <link rel="preload" as="image" href="/images/hero-1280.webp" imagesrcset="/images/hero-768.webp 768w, /images/hero-1280.webp 1280w, /images/hero-2400.webp 2400w" imagesizes="100vw" fetchpriority="high">
            @endif

            @if ($seo['schema'])
                <script type="application/ld+json">
                    {!! json_encode(array_filter(['@context' => 'https://schema.org', ...$seo['schema']]), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) !!}
                </script>
            @endif
        @endisset

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $seo['title'] ?? config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans text-ink antialiased">
        <x-inertia::app />
    </body>
</html>
