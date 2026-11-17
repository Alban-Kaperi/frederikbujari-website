import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import PostForm from '@/components/admin/post-form';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/admin/posts';

type Props = {
    languages: Record<string, string>;
    post: {
        id: number;
        title: string;
        body: string;
        translations: Record<string, { title: string; body: string }>;
        thumbnailUrl: string;
        publicUrl: string;
    };
};

export default function AdminPostsEdit({ languages, post }: Props) {
    return (
        <>
            <Head title={`Edit: ${post.title}`} />

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <Link
                    href={index()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-stone hover:text-ink"
                >
                    <ArrowLeft className="size-4" />
                    All posts
                </Link>
                <Button variant="outline" asChild>
                    <a href={post.publicUrl} target="_blank" rel="noopener">
                        <ExternalLink />
                        View on website
                    </a>
                </Button>
            </div>
            {/* Files can't be sent with PUT, so the form posts with Laravel's _method=PUT override. */}
            <PostForm
                form={PostController.update.form.put(post.id)}
                languages={languages}
                post={post}
                submitLabel="Save changes"
            />
        </>
    );
}
