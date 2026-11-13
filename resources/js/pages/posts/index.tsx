import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import Eyebrow from '@/components/site/eyebrow';
import SiteLayout, { siteContainer } from '@/components/site/site-layout';
import type { Site } from '@/types/site';

type PostSummary = {
    id: number;
    title: string;
    excerpt: string;
    thumbnailUrl: string;
    date: string;
    dateTime: string;
    url: string;
};

type Props = {
    site: Site;
    posts: {
        data: PostSummary[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

export default function PostsIndex({ site, posts }: Props) {
    const { content } = site;

    return (
        <>
            <Head title={content.posts.meta_title} />

            <SiteLayout site={site} activeKey="posts">
                <section
                    aria-labelledby="posts-title"
                    className="border-b border-hairline py-16 sm:py-20 lg:py-24"
                >
                    <div className={`${siteContainer} flex flex-col gap-6`}>
                        <Eyebrow>{content.posts.eyebrow}</Eyebrow>
                        <h1
                            id="posts-title"
                            className="font-display text-[2.8rem] leading-[1.05] font-normal tracking-[-0.01em] sm:text-6xl lg:text-[4.5rem]"
                        >
                            {content.posts.title}
                        </h1>
                        <p className="max-w-[40rem] text-[1.075rem] leading-[1.75] text-stone">
                            {content.posts.intro}
                        </p>
                    </div>
                </section>

                <section className="py-16 sm:py-20 lg:py-24">
                    <div className={siteContainer}>
                        {posts.data.length === 0 ? (
                            <p className="border border-hairline bg-paper px-6 py-10 text-center text-stone">
                                {content.posts.empty}
                            </p>
                        ) : (
                            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.data.map((post) => (
                                    <li key={post.id}>
                                        <article className="group relative flex h-full flex-col">
                                            <div className="overflow-hidden bg-sand">
                                                <img
                                                    src={post.thumbnailUrl}
                                                    alt=""
                                                    width={800}
                                                    height={600}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                            </div>
                                            <time
                                                dateTime={post.dateTime}
                                                className="mt-6 text-xs font-medium tracking-[0.2em] text-bronze-deep uppercase"
                                            >
                                                {post.date}
                                            </time>
                                            <h2 className="mt-3 font-display text-[1.75rem] leading-tight">
                                                <Link
                                                    href={post.url}
                                                    className="after:absolute after:inset-0"
                                                >
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            <p className="mt-3 leading-relaxed text-stone">
                                                {post.excerpt}
                                            </p>
                                            <span
                                                aria-hidden="true"
                                                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink"
                                            >
                                                {content.posts.read_more}
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </article>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {posts.last_page > 1 && (
                            <nav
                                aria-label={content.posts.pagination}
                                className="mt-16 flex items-center justify-between border-t border-hairline pt-8"
                            >
                                {posts.prev_page_url ? (
                                    <Link
                                        href={posts.prev_page_url}
                                        rel="prev"
                                        className="border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-ivory"
                                    >
                                        {content.posts.previous}
                                    </Link>
                                ) : (
                                    <span />
                                )}
                                <span className="text-sm text-stone">
                                    {posts.current_page} / {posts.last_page}
                                </span>
                                {posts.next_page_url ? (
                                    <Link
                                        href={posts.next_page_url}
                                        rel="next"
                                        className="border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-ivory"
                                    >
                                        {content.posts.next}
                                    </Link>
                                ) : (
                                    <span />
                                )}
                            </nav>
                        )}
                    </div>
                </section>
            </SiteLayout>
        </>
    );
}
