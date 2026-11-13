import { Bold, Italic } from 'lucide-react';
import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { postBodyClassName, postBodyToHtml } from '@/components/site/post-body';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
    id: string;
    name: string;
    defaultValue?: string;
    invalid?: boolean;
};

type Mode = 'write' | 'preview';

/**
 * Text editor for posts. Bold and italic are stored as **bold** and *italic*;
 * line breaks and blank lines between paragraphs are kept as written.
 */
export default function PostBodyEditor({
    id,
    name,
    defaultValue = '',
    invalid = false,
}: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState(defaultValue);
    const [mode, setMode] = useState<Mode>('write');

    const wrapSelection = (marker: string) => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        const { selectionStart: start, selectionEnd: end } = textarea;
        const selected = value.slice(start, end);
        const isWrapped =
            value.slice(start - marker.length, start) === marker &&
            value.slice(end, end + marker.length) === marker;

        const nextValue = isWrapped
            ? value.slice(0, start - marker.length) +
              selected +
              value.slice(end + marker.length)
            : value.slice(0, start) +
              marker +
              selected +
              marker +
              value.slice(end);
        const offset = isWrapped ? -marker.length : marker.length;

        setValue(nextValue);

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start + offset, end + offset);
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (!(event.ctrlKey || event.metaKey)) {
            return;
        }

        if (event.key.toLowerCase() === 'b') {
            event.preventDefault();
            wrapSelection('**');
        }

        if (event.key.toLowerCase() === 'i') {
            event.preventDefault();
            wrapSelection('*');
        }
    };

    return (
        <div
            className={cn(
                'overflow-hidden border border-hairline bg-white focus-within:border-bronze-deep focus-within:ring-2 focus-within:ring-bronze/40',
                invalid && 'border-danger',
            )}
        >
            <div className="flex items-center justify-between gap-2 border-b border-hairline bg-paper px-2 py-1.5">
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Bold (Ctrl+B)"
                        aria-label="Bold"
                        disabled={mode === 'preview'}
                        onClick={() => wrapSelection('**')}
                    >
                        <Bold />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Italic (Ctrl+I)"
                        aria-label="Italic"
                        disabled={mode === 'preview'}
                        onClick={() => wrapSelection('*')}
                    >
                        <Italic />
                    </Button>
                </div>
                <div className="flex border border-hairline bg-white p-0.5 text-sm">
                    {(['write', 'preview'] as const).map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setMode(option)}
                            aria-pressed={mode === option}
                            className="px-3 py-1 text-muted-stone capitalize aria-pressed:bg-ink aria-pressed:font-medium aria-pressed:text-ivory"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <textarea
                ref={textareaRef}
                id={id}
                name={name}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={16}
                required
                aria-invalid={invalid || undefined}
                hidden={mode === 'preview'}
                className="block w-full resize-y bg-transparent px-4 py-3 text-base leading-relaxed outline-none md:text-sm"
            />

            {mode === 'preview' && (
                <div
                    className={`min-h-80 bg-ivory px-6 py-5 ${postBodyClassName}`}
                    dangerouslySetInnerHTML={{ __html: postBodyToHtml(value) }}
                />
            )}
        </div>
    );
}
