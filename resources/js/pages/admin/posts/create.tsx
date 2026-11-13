import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import PageHeader from '@/components/admin/page-header';
import PostForm from '@/components/admin/post-form';
import { index } from '@/routes/admin/posts';

export default function AdminPostsCreate() {
    return (
        <>
            <Head title="New post" />

            <Link
                href={index()}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-stone hover:text-ink"
            >
                <ArrowLeft className="size-4" />
                All posts
            </Link>

            <PageHeader
                eyebrow="Posts"
                title="New post"
                description="It appears on the website’s Posts page as soon as you publish it."
            />
            <PostForm
                form={PostController.store.form()}
                submitLabel="Publish post"
            />
        </>
    );
}
