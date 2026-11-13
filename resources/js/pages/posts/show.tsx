import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { postBodyClassName } from '@/components/site/post-body';
import SiteLayout from '@/components/site/site-layout';
import type { Site } from '@/types/site';

type Props = {
    site: Site;
    post: {
        title: string;
        bodyHtml: string;
        thumbnailUrl: string;
        date: string;
        dateTime: string;
    };
};

export default function PostsShow({ site, post }: Props) {
    const { content } = site;

    return (
        <>
            <Head title={`${post.title} — Saint Matthew Merchant LLC`} />

            <SiteLayout site={site} activeKey="posts">
                <article className="pt-12 pb-20 sm:pt-16 sm:pb-28">
                    <header className="mx-auto flex w-full max-w-[52rem] flex-col gap-6 px-5 sm:px-8">
                        <Link
                            href={site.postsUrl}
                            className="inline-flex items-center gap-2 self-start text-sm font-medium text-stone transition-colors hover:text-bronze-deep"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            {content.posts.back}
                        </Link>
                        <time
                            dateTime={post.dateTime}
                            className="mt-4 text-xs font-medium tracking-[0.2em] text-bronze-deep uppercase"
                        >
                            {post.date}
                        </time>
                        <h1 className="font-display text-[2.5rem] leading-[1.08] font-normal tracking-[-0.01em] break-words sm:text-5xl lg:text-[3.6rem]">
                            {post.title}
                        </h1>
                    </header>

                    <div className="mx-auto mt-10 w-full max-w-[1200px] sm:mt-14 sm:px-8 xl:px-0">
                        <img
                            src={post.thumbnailUrl}
                            alt=""
                            width={1200}
                            height={675}
                            fetchPriority="high"
                            className="aspect-[16/9] w-full bg-sand object-cover"
                        />
                    </div>

                    <div
                        className={`mx-auto mt-12 w-full max-w-[44rem] px-5 sm:mt-16 sm:px-8 ${postBodyClassName}`}
                        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                    />
                </article>
            </SiteLayout>
        </>
    );
}
