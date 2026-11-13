import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import PostBodyEditor from '@/components/admin/post-body-editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    /** A Wayfinder form definition, e.g. PostController.store.form(). */
    form: { action: string; method: 'get' | 'post' };
    post?: {
        title: string;
        body: string;
        thumbnailUrl: string;
    };
    submitLabel: string;
};

export default function PostForm({ form, post, submitLabel }: Props) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null,
    );

    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    const showThumbnailPreview = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        setThumbnailPreview(file ? URL.createObjectURL(file) : null);
    };

    const previewUrl = thumbnailPreview ?? post?.thumbnailUrl;

    return (
        <Form {...form} className="grid max-w-4xl gap-8">
            {({ errors, processing, progress }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={post?.title}
                            required
                            maxLength={255}
                            aria-invalid={errors.title ? true : undefined}
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt=""
                                    className="aspect-[4/3] w-full border border-hairline bg-sand object-cover sm:w-56"
                                />
                            )}
                            <div className="grid flex-1 gap-2">
                                <Input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    required={!post}
                                    onChange={showThumbnailPreview}
                                    aria-invalid={
                                        errors.thumbnail ? true : undefined
                                    }
                                />
                                <p className="text-sm text-muted-stone">
                                    JPG, PNG or WebP, up to 5 MB. A landscape
                                    image of at least 1200 × 800 px looks best.
                                    {post &&
                                        ' Leave empty to keep the current image.'}
                                </p>
                                {progress && (
                                    <progress
                                        value={progress.percentage}
                                        max="100"
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </div>
                        <InputError message={errors.thumbnail} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="body">Description</Label>
                        <PostBodyEditor
                            id="body"
                            name="body"
                            defaultValue={post?.body}
                            invalid={Boolean(errors.body)}
                        />
                        <p className="text-sm text-muted-stone">
                            Select text and use the <strong>B</strong> and{' '}
                            <em>I</em> buttons (or Ctrl+B / Ctrl+I). Press Enter
                            for a new line, and leave an empty line to start a
                            new paragraph.
                        </p>
                        <InputError message={errors.body} />
                    </div>

                    <div>
                        <Button type="submit" size="lg" disabled={processing}>
                            {submitLabel}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
