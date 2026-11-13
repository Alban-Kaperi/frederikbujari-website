import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import PageHeader from '@/components/admin/page-header';
import PostForm from '@/components/admin/post-form';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/admin/posts';

type Props = {
    post: {
        id: number;
        title: string;
        body: string;
        thumbnailUrl: string;
        publicUrl: string;
    };
};

export default function AdminPostsEdit({ post }: Props) {
    return (
        <>
            <Head title={`Edit: ${post.title}`} />

            <Link
                href={index()}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-stone hover:text-ink"
            >
                <ArrowLeft className="size-4" />
                All posts
            </Link>

            <PageHeader
                eyebrow="Edit post"
                title={post.title}
                description="Changes go live as soon as you save."
                actions={
                    <Button variant="outline" asChild>
                        <a href={post.publicUrl} target="_blank" rel="noopener">
                            <ExternalLink />
                            View on website
                        </a>
                    </Button>
                }
            />
            {/* Files can't be sent with PUT, so the form posts with Laravel's _method=PUT override. */}
            <PostForm
                form={PostController.update.form.put(post.id)}
                post={post}
                submitLabel="Save changes"
            />
        </>
    );
}
