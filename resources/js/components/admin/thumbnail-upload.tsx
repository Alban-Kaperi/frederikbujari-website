import { ImagePlus, Replace, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
    id: string;
    name: string;
    /** The image already saved for the post, shown until a new file is chosen. */
    currentUrl?: string;
    invalid?: boolean;
    progress?: number | null;
};

const formatSize = (bytes: number): string =>
    bytes >= 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Drag-and-drop image picker with a live preview. The native file input stays
 * in the form, so the chosen file is submitted like any other field.
 */
export default function ThumbnailUpload({
    id,
    name,
    currentUrl,
    invalid = false,
    progress = null,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);

            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] ?? null);
    };

    const dropFile = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const dropped = event.dataTransfer.files[0];

        if (
            !dropped ||
            !inputRef.current ||
            !dropped.type.startsWith('image/')
        ) {
            return;
        }

        const transfer = new DataTransfer();
        transfer.items.add(dropped);
        inputRef.current.files = transfer.files;
        setFile(dropped);
    };

    const clearFile = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        setFile(null);
    };

    const shownUrl = previewUrl ?? currentUrl ?? null;

    return (
        <div className="grid gap-3">
            <input
                ref={inputRef}
                id={id}
                name={name}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={chooseFile}
                className="sr-only"
                aria-invalid={invalid || undefined}
            />

            {shownUrl ? (
                <div className="grid gap-4 border border-hairline bg-white p-3 sm:grid-cols-[16rem_1fr] sm:items-center">
                    <img
                        src={shownUrl}
                        alt=""
                        className="aspect-[4/3] w-full bg-sand object-cover"
                    />
                    <div className="grid gap-3">
                        <div className="min-w-0">
                            <p className="truncate font-medium text-ink">
                                {file ? file.name : 'Current thumbnail'}
                            </p>
                            <p className="text-sm text-muted-stone">
                                {file
                                    ? `${formatSize(file.size)} · will be uploaded when you save`
                                    : 'Choose a new image to replace it.'}
                            </p>
                        </div>
                        {progress !== null && (
                            <progress
                                value={progress}
                                max="100"
                                className="w-full"
                            />
                        )}
                        <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="outline" asChild>
                                <label htmlFor={id} className="cursor-pointer">
                                    <Replace />
                                    {file || currentUrl
                                        ? 'Replace image'
                                        : 'Choose image'}
                                </label>
                            </Button>
                            {file && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={clearFile}
                                >
                                    <Trash2 />
                                    {currentUrl ? 'Undo' : 'Remove'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <label
                    htmlFor={id}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={dropFile}
                    className={cn(
                        'flex cursor-pointer flex-col items-center gap-2 border border-dashed bg-paper px-6 py-10 text-center transition-colors hover:border-bronze-deep hover:bg-sand/60 has-[:focus-visible]:ring-2',
                        isDragging
                            ? 'border-bronze-deep bg-sand/60'
                            : 'border-hairline',
                        invalid && 'border-danger',
                    )}
                >
                    <span className="flex size-12 items-center justify-center rounded-full bg-sand text-bronze-deep">
                        <ImagePlus className="size-6" />
                    </span>
                    <span className="font-medium text-ink">
                        Drop an image here, or{' '}
                        <span className="text-bronze-deep underline underline-offset-4">
                            browse
                        </span>
                    </span>
                    <span className="text-sm text-muted-stone">
                        JPG, PNG or WebP, up to 5 MB. A landscape image of at
                        least 1200 × 800 px looks best.
                    </span>
                </label>
            )}

            <p className="sr-only" aria-live="polite">
                {file ? `Selected ${file.name}` : ''}
            </p>
        </div>
    );
}
