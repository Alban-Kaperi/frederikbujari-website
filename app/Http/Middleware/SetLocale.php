<?php

namespace App\Http\Middleware;

use App\Support\LocalizedPage;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Set the application language from the "{locale}" route prefix (or the default language
     * when there is none) and drop the prefix, so controllers only receive their own parameters.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $route = $request->route();

        App::setLocale($route->parameter('locale') ?? LocalizedPage::defaultLocale());

        $route->forgetParameter('locale');

        return $next($request);
    }
}
