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

function ReadMore({
    label,
    className = '',
}: {
    label: string;
    className?: string;
}) {
    return (
        <span
            aria-hidden="true"
            className={`inline-flex items-center gap-2 text-sm font-medium text-ink ${className}`}
        >
            {label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
    );
}

export default function PostsIndex({ site, posts }: Props) {
    const { content } = site;
    const showFeatured = posts.current_page === 1 && posts.data.length > 1;
    const featured = showFeatured ? posts.data[0] : null;
    const rest = showFeatured ? posts.data.slice(1) : posts.data;

    return (
        <>
            <Head title={content.posts.meta_title} />

            <SiteLayout site={site} activeKey="posts">
                <section
                    aria-labelledby="posts-title"
                    className="border-b border-hairline bg-sand py-16 sm:py-20 lg:py-24"
                >
                    <div
                        className={`${siteContainer} grid gap-8 lg:grid-cols-[1fr_28rem] lg:items-end lg:gap-16`}
                    >
                        <div className="flex flex-col gap-6">
                            <Eyebrow>{content.posts.eyebrow}</Eyebrow>
                            <h1
                                id="posts-title"
                                className="font-display text-[2.8rem] leading-[1.05] font-normal tracking-[-0.01em] sm:text-6xl lg:text-[4.5rem]"
                            >
                                {content.posts.title}
                            </h1>
                        </div>
                        <p className="border-l border-bronze-deep/60 pl-6 text-[1.075rem] leading-[1.75] text-stone">
                            {content.posts.intro}
                        </p>
                    </div>
                </section>

                <section className="py-14 sm:py-20 lg:py-24">
                    <div className={siteContainer}>
                        {posts.data.length === 0 ? (
                            <p className="border border-hairline bg-paper px-6 py-10 text-center text-stone">
                                {content.posts.empty}
                            </p>
                        ) : (
                            <>
                                {featured && (
                                    <article className="group relative grid border border-hairline bg-paper lg:grid-cols-[1.25fr_1fr]">
                                        <div className="overflow-hidden bg-sand">
                                            <img
                                                src={featured.thumbnailUrl}
                                                alt=""
                                                width={1200}
                                                height={800}
                                                fetchPriority="high"
                                                className="aspect-[3/2] size-full object-cover transition-transform duration-700 group-hover:scale-[1.03] lg:aspect-auto"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-5 p-7 sm:p-10 lg:p-14">
                                            <time
                                                dateTime={featured.dateTime}
                                                className="text-xs font-medium tracking-[0.2em] text-bronze-deep uppercase"
                                            >
                                                {featured.date}
                                            </time>
                                            <h2 className="font-display text-[2rem] leading-[1.1] sm:text-4xl lg:text-[2.6rem]">
                                                <Link
                                                    href={featured.url}
                                                    className="after:absolute after:inset-0"
                                                >
                                                    {featured.title}
                                                </Link>
                                            </h2>
                                            <p className="line-clamp-4 leading-relaxed text-stone">
                                                {featured.excerpt}
                                            </p>
                                            <ReadMore
                                                label={content.posts.read_more}
                                            />
                                        </div>
                                    </article>
                                )}

                                {rest.length > 0 && (
                                    <ul
                                        className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${featured ? 'mt-6 sm:mt-8' : ''}`}
                                    >
                                        {rest.map((post) => (
                                            <li key={post.id}>
                                                <article className="group relative flex h-full flex-col border border-hairline bg-paper transition-colors hover:border-ink">
                                                    <div className="overflow-hidden bg-sand">
                                                        <img
                                                            src={
                                                                post.thumbnailUrl
                                                            }
                                                            alt=""
                                                            width={800}
                                                            height={600}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 flex-col gap-3 p-6">
                                                        <time
                                                            dateTime={
                                                                post.dateTime
                                                            }
                                                            className="text-xs font-medium tracking-[0.2em] text-bronze-deep uppercase"
                                                        >
                                                            {post.date}
                                                        </time>
                                                        <h2 className="font-display text-[1.65rem] leading-tight">
                                                            <Link
                                                                href={post.url}
                                                                className="after:absolute after:inset-0"
                                                            >
                                                                {post.title}
                                                            </Link>
                                                        </h2>
                                                        <p className="line-clamp-3 leading-relaxed text-stone">
                                                            {post.excerpt}
                                                        </p>
                                                        <ReadMore
                                                            label={
                                                                content.posts
                                                                    .read_more
                                                            }
                                                            className="mt-auto pt-3"
                                                        />
                                                    </div>
                                                </article>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
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
