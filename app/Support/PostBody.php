<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Formats the text of a post written in the admin editor.
 *
 * Supported formatting: **bold**, *italic*, line breaks, and blank lines between paragraphs.
 * Everything else is escaped, so the result is always safe to output as HTML.
 */
class PostBody
{
    /** **text**: the text must not start or end with a space. */
    private const BOLD = '/\*\*(?=\S)(.+?)(?<=\S)\*\*/s';

    /** *text*: a single asterisk on each side, not touching a space or another asterisk. */
    private const ITALIC = '/(?<!\*)\*(?=[^\s*])(.+?)(?<=[^\s*])\*(?!\*)/s';

    /**
     * Convert post text to HTML paragraphs.
     */
    public static function toHtml(string $text): string
    {
        $paragraphs = preg_split('/\R{2,}/', trim($text)) ?: [];

        return collect($paragraphs)
            ->map(fn (string $paragraph): string => trim($paragraph))
            ->filter()
            ->map(function (string $paragraph): string {
                $html = e($paragraph);
                $html = preg_replace(self::BOLD, '<strong>$1</strong>', $html);
                $html = preg_replace(self::ITALIC, '<em>$1</em>', $html);

                return '<p>'.preg_replace('/\R/', "<br>\n", $html).'</p>';
            })
            ->implode("\n");
    }

    /**
     * Get the post text without formatting marks, shortened for listings and meta descriptions.
     */
    public static function excerpt(string $text, int $limit = 160): string
    {
        $plain = preg_replace([self::BOLD, self::ITALIC], '$1', $text);

        return Str::limit(Str::squish($plain), $limit);
    }
}
