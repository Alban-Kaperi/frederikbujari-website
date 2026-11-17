import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import PostForm from '@/components/admin/post-form';
import { index } from '@/routes/admin/posts';

type Props = {
    languages: Record<string, string>;
};

export default function AdminPostsCreate({ languages }: Props) {
    return (
        <>
            <Head title="New post" />

            <Link
                href={index()}
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-stone hover:text-ink"
            >
                <ArrowLeft className="size-4" />
                All posts
            </Link>
            <PostForm
                form={PostController.store.form()}
                languages={languages}
                submitLabel="Publish post"
            />
        </>
    );
}
