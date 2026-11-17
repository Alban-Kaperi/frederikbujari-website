import { Form } from '@inertiajs/react';
import { useState } from 'react';
import PostBodyEditor from '@/components/admin/post-body-editor';
import ThumbnailUpload from '@/components/admin/thumbnail-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Content = { title: string; body: string };

type Props = {
    /** A Wayfinder form definition, e.g. PostController.store.form(). */
    form: { action: string; method: 'get' | 'post' };
    /** Language names keyed by locale code; the first one is the main language. */
    languages: Record<string, string>;
    post?: {
        title: string;
        body: string;
        translations: Record<string, Content>;
        thumbnailUrl: string;
    };
    submitLabel: string;
};

export default function PostForm({
    form,
    languages,
    post,
    submitLabel,
}: Props) {
    const codes = Object.keys(languages);
    const mainLanguage = codes[0];

    const [active, setActive] = useState(mainLanguage);
    const [contents, setContents] = useState<Record<string, Content>>(() =>
        Object.fromEntries(
            codes.map((code) => [
                code,
                code === mainLanguage
                    ? { title: post?.title ?? '', body: post?.body ?? '' }
                    : (post?.translations[code] ?? { title: '', body: '' }),
            ]),
        ),
    );

    const update = (code: string, field: keyof Content, value: string) =>
        setContents((current) => ({
            ...current,
            [code]: { ...current[code], [field]: value },
        }));

    const fieldName = (code: string, field: keyof Content) =>
        code === mainLanguage ? field : `translations[${code}][${field}]`;

    const errorKey = (code: string, field: keyof Content) =>
        code === mainLanguage ? field : `translations.${code}.${field}`;

    return (
        <Form
            {...form}
            className="grid max-w-4xl gap-8"
            onError={(errors) => {
                const withError = codes.find((code) =>
                    [errorKey(code, 'title'), errorKey(code, 'body')].some(
                        (key) => key in errors,
                    ),
                );

                if (withError) {
                    setActive(withError);
                }
            }}
        >
            {({ errors, processing, progress }) => {
                const hasError = (code: string) =>
                    Boolean(
                        errors[errorKey(code, 'title')] ||
                        errors[errorKey(code, 'body')],
                    );

                return (
                    <>
                        <div className="grid gap-2">
                            <Label>Language</Label>
                            <div
                                role="tablist"
                                aria-label="Language"
                                className="flex w-fit flex-wrap border border-hairline bg-white p-0.5"
                            >
                                {codes.map((code) => {
                                    const isFilled =
                                        contents[code].title.trim() !== '' &&
                                        contents[code].body.trim() !== '';

                                    return (
                                        <button
                                            key={code}
                                            type="button"
                                            role="tab"
                                            id={`tab-${code}`}
                                            aria-selected={active === code}
                                            aria-controls={`panel-${code}`}
                                            onClick={() => setActive(code)}
                                            className={cn(
                                                'flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                                                active === code
                                                    ? 'bg-ink font-medium text-ivory'
                                                    : 'text-muted-stone hover:text-ink',
                                            )}
                                        >
                                            {languages[code]}
                                            {hasError(code) ? (
                                                <span
                                                    className="size-2 rounded-full bg-danger"
                                                    title="Needs attention"
                                                />
                                            ) : isFilled ? (
                                                <span
                                                    className="size-2 rounded-full bg-bronze"
                                                    title="Written"
                                                />
                                            ) : null}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-sm text-muted-stone">
                                {languages[mainLanguage]} is required. The other
                                languages are optional; visitors see{' '}
                                {languages[mainLanguage]} where a translation is
                                missing.
                            </p>
                        </div>

                        {codes.map((code) => (
                            <div
                                key={code}
                                role="tabpanel"
                                id={`panel-${code}`}
                                aria-labelledby={`tab-${code}`}
                                hidden={active !== code}
                                className="grid gap-8"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor={`title-${code}`}>
                                        Title ({languages[code]})
                                    </Label>
                                    <Input
                                        id={`title-${code}`}
                                        name={fieldName(code, 'title')}
                                        value={contents[code].title}
                                        onChange={(event) =>
                                            update(
                                                code,
                                                'title',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={255}
                                        aria-invalid={
                                            errors[errorKey(code, 'title')]
                                                ? true
                                                : undefined
                                        }
                                    />
                                    <InputError
                                        message={
                                            errors[errorKey(code, 'title')]
                                        }
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="grid gap-2">
                            <Label htmlFor="thumbnail">
                                Thumbnail (same for all languages)
                            </Label>
                            <ThumbnailUpload
                                id="thumbnail"
                                name="thumbnail"
                                currentUrl={post?.thumbnailUrl}
                                invalid={Boolean(errors.thumbnail)}
                                progress={progress?.percentage ?? null}
                            />
                            <InputError message={errors.thumbnail} />
                        </div>

                        {codes.map((code) => (
                            <div
                                key={code}
                                role="tabpanel"
                                id={`panel-body-${code}`}
                                aria-labelledby={`tab-${code}`}
                                hidden={active !== code}
                                className="grid gap-8"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor={`body-${code}`}>
                                        Description ({languages[code]})
                                    </Label>
                                    <PostBodyEditor
                                        id={`body-${code}`}
                                        name={fieldName(code, 'body')}
                                        value={contents[code].body}
                                        onChange={(value) =>
                                            update(code, 'body', value)
                                        }
                                        invalid={Boolean(
                                            errors[errorKey(code, 'body')],
                                        )}
                                    />
                                    <p className="text-sm text-muted-stone">
                                        Select text and use the{' '}
                                        <strong>B</strong> and <em>I</em>{' '}
                                        buttons (or Ctrl+B / Ctrl+I). Press
                                        Enter for a new line, and leave an empty
                                        line to start a new paragraph.
                                    </p>
                                    <InputError
                                        message={errors[errorKey(code, 'body')]}
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                            >
                                {submitLabel}
                            </Button>
                        </div>
                    </>
                );
            }}
        </Form>
    );
}
