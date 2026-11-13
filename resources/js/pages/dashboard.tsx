import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Plus } from 'lucide-react';
import PageHeader from '@/components/admin/page-header';
import RequestRow from '@/components/admin/request-row';
import type { AdminContactRequest } from '@/components/admin/request-row';
import { Button } from '@/components/ui/button';
import { create, edit, index as postsIndex } from '@/routes/admin/posts';
import { index as requestsIndex } from '@/routes/admin/requests';

type Props = {
    stats: {
        unreadRequests: number;
        requestsThisMonth: number;
        totalRequests: number;
        posts: number;
    };
    latestRequests: AdminContactRequest[];
    latestPosts: {
        id: number;
        title: string;
        thumbnailUrl: string;
        createdAt: string;
    }[];
};

function greeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good morning';
    }

    return hour < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Dashboard({
    stats,
    latestRequests,
    latestPosts,
}: Props) {
    const { auth } = usePage().props;
    const firstName = auth.user.name.split(' ')[0];

    const statCards = [
        {
            label: 'New requests',
            value: stats.unreadRequests,
            href: requestsIndex({ query: { filter: 'unread' } }),
            highlight: stats.unreadRequests > 0,
        },
        {
            label: 'Requests this month',
            value: stats.requestsThisMonth,
            href: requestsIndex(),
        },
        {
            label: 'All requests',
            value: stats.totalRequests,
            href: requestsIndex(),
        },
        { label: 'Published posts', value: stats.posts, href: postsIndex() },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <PageHeader
                eyebrow="Dashboard"
                title={`${greeting()}, ${firstName}.`}
                description={
                    stats.unreadRequests > 0
                        ? `You have ${stats.unreadRequests} new ${stats.unreadRequests === 1 ? 'request' : 'requests'} from the website.`
                        : 'You are up to date — there are no new requests.'
                }
                actions={
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New post
                        </Link>
                    </Button>
                }
            />

            <section
                aria-label="Overview"
                className="grid grid-cols-2 border-t border-l border-hairline lg:grid-cols-4"
            >
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className={`flex flex-col gap-3 border-r border-b border-hairline p-5 transition-colors sm:p-6 ${card.highlight ? 'bg-ink text-ivory hover:bg-ink/90' : 'bg-paper hover:bg-sand/60'}`}
                    >
                        <span
                            className={`text-xs font-medium tracking-[0.2em] uppercase ${card.highlight ? 'text-bronze' : 'text-muted-stone'}`}
                        >
                            {card.label}
                        </span>
                        <span className="font-display text-5xl leading-none">
                            {card.value}
                        </span>
                    </Link>
                ))}
            </section>

            <div className="mt-12 grid gap-12 xl:grid-cols-[1.6fr_1fr]">
                <section aria-labelledby="latest-requests">
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                        <h2
                            id="latest-requests"
                            className="font-display text-3xl"
                        >
                            Latest requests
                        </h2>
                        <Link
                            href={requestsIndex()}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-bronze-deep"
                        >
                            All requests
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {latestRequests.length === 0 ? (
                        <p className="border border-dashed border-hairline bg-paper p-8 text-center text-sm text-muted-stone">
                            Requests sent through the website’s contact form
                            will appear here.
                        </p>
                    ) : (
                        <div className="divide-y divide-hairline border border-hairline bg-paper/60">
                            {latestRequests.map((request) => (
                                <RequestRow
                                    key={request.id}
                                    request={request}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section aria-labelledby="latest-posts">
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                        <h2 id="latest-posts" className="font-display text-3xl">
                            Latest posts
                        </h2>
                        <Link
                            href={postsIndex()}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-bronze-deep"
                        >
                            All posts
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {latestPosts.length === 0 ? (
                        <div className="flex flex-col items-start gap-4 border border-dashed border-hairline bg-paper p-8 text-sm text-muted-stone">
                            No posts yet. Articles you publish appear on the
                            website’s Posts page.
                            <Button variant="outline" size="sm" asChild>
                                <Link href={create()}>
                                    Write the first post
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {latestPosts.map((post) => (
                                <li key={post.id}>
                                    <Link
                                        href={edit(post.id)}
                                        className="flex items-center gap-4 border border-hairline bg-paper/60 p-3 transition-colors hover:border-ink"
                                    >
                                        <img
                                            src={post.thumbnailUrl}
                                            alt=""
                                            className="aspect-[4/3] w-20 shrink-0 bg-sand object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="line-clamp-2 font-medium">
                                                {post.title}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-stone">
                                                {post.createdAt}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}
