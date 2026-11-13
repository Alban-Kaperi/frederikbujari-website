/** Typography for post text. Used on the public post page and in the admin preview. */
export const postBodyClassName =
    'text-[1.1rem] leading-[1.8] text-stone break-words [&_em]:italic [&_p+p]:mt-6 [&_strong]:font-bold [&_strong]:text-ink';

function escapeHtml(text: string): string {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

/**
 * Preview of App\Support\PostBody::toHtml(): **bold**, *italic*, line breaks
 * and paragraphs. The server output is what visitors see; keep the two in step.
 */
export function postBodyToHtml(text: string): string {
    return text
        .trim()
        .split(/(?:\r\n|\r|\n){2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => {
            const html = escapeHtml(paragraph)
                .replace(
                    /\*\*(?=\S)([\s\S]+?)(?<=\S)\*\*/g,
                    '<strong>$1</strong>',
                )
                .replace(
                    /(?<!\*)\*(?=[^\s*])([\s\S]+?)(?<=[^\s*])\*(?!\*)/g,
                    '<em>$1</em>',
                )
                .replace(/\r\n|\r|\n/g, '<br>\n');

            return `<p>${html}</p>`;
        })
        .join('\n');
}
