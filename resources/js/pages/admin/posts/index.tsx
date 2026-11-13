import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Admin/PostController';
import PageHeader from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { create } from '@/routes/admin/posts';

type Props = {
    posts: {
        data: {
            id: number;
            title: string;
            thumbnailUrl: string;
            createdAt: string;
            publicUrl: string;
        }[];
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

export default function AdminPostsIndex({ posts }: Props) {
    return (
        <>
            <Head title="Posts" />

            <PageHeader
                eyebrow="Content"
                title="Posts"
                description="Articles shown on the website’s Posts page, newest first."
                actions={
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New post
                        </Link>
                    </Button>
                }
            />

            {posts.data.length === 0 ? (
                <div className="flex flex-col items-center gap-4 border border-dashed border-hairline bg-paper p-12 text-center text-muted-stone">
                    No posts yet.
                    <Button asChild>
                        <Link href={create()}>Write the first post</Link>
                    </Button>
                </div>
            ) : (
                <ul className="divide-y divide-hairline border border-hairline bg-paper/60">
                    {posts.data.map((post) => (
                        <li
                            key={post.id}
                            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                        >
                            <img
                                src={post.thumbnailUrl}
                                alt=""
                                className="aspect-[4/3] w-full bg-sand object-cover sm:w-28"
                            />
                            <div className="min-w-0 flex-1">
                                <Link
                                    href={PostController.edit(post.id)}
                                    className="font-display text-2xl leading-tight break-words hover:text-bronze-deep"
                                >
                                    {post.title}
                                </Link>
                                <p className="mt-1 text-sm text-muted-stone">
                                    Published {post.createdAt}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <a
                                        href={post.publicUrl}
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        <ExternalLink />
                                        View
                                    </a>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={PostController.edit(post.id)}>
                                        <Pencil />
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-danger hover:bg-danger/10"
                                    asChild
                                >
                                    <Link
                                        href={PostController.destroy(post.id)}
                                        as="button"
                                        onBefore={() =>
                                            window.confirm(
                                                `Delete “${post.title}”? This cannot be undone.`,
                                            )
                                        }
                                    >
                                        <Trash2 />
                                        Delete
                                    </Link>
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {(posts.prev_page_url || posts.next_page_url) && (
                <div className="mt-6 flex justify-between">
                    {posts.prev_page_url ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={posts.prev_page_url}>Previous</Link>
                        </Button>
                    ) : (
                        <span />
                    )}
                    {posts.next_page_url && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={posts.next_page_url}>Next</Link>
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}
