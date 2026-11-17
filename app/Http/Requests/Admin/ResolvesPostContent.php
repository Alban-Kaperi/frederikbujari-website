<?php

namespace App\Http\Requests\Admin;

use App\Support\LocalizedPage;

trait ResolvesPostContent
{
    /**
     * The validated post text: the main language, plus every translation that was filled in
     * (a translation needs both its title and its description).
     *
     * @return array{title: string, body: string, translations: array<string, array{title: string, body: string}>}
     */
    public function postContent(): array
    {
        $validated = $this->validated();
        $translations = [];

        foreach (array_slice(LocalizedPage::locales(), 1) as $locale) {
            $title = $validated['translations'][$locale]['title'] ?? null;
            $body = $validated['translations'][$locale]['body'] ?? null;

            if (filled($title) && filled($body)) {
                $translations[$locale] = ['title' => $title, 'body' => $body];
            }
        }

        return [
            'title' => $validated['title'],
            'body' => $validated['body'],
            'translations' => $translations,
        ];
    }
}
