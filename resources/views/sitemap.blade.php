{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
@foreach ($pages as $page)
@foreach ($page['alternates'] as $url)
    <url>
        <loc>{{ $url }}</loc>
@foreach ($page['alternates'] as $alternateLocale => $alternateUrl)
        <xhtml:link rel="alternate" hreflang="{{ $alternateLocale }}" href="{{ $alternateUrl }}" />
@endforeach
@if ($page['lastModified'])
        <lastmod>{{ \Illuminate\Support\Carbon::parse($page['lastModified'])->toAtomString() }}</lastmod>
@endif
        <priority>{{ $page['priority'] }}</priority>
    </url>
@endforeach
@endforeach
</urlset>
