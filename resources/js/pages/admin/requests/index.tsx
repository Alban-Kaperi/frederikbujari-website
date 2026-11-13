import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/components/admin/page-header';
import RequestRow from '@/components/admin/request-row';
import type { AdminContactRequest } from '@/components/admin/request-row';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/admin/requests';

type Props = {
    filter: 'all' | 'unread';
    counts: { all: number; unread: number };
    requests: {
        data: AdminContactRequest[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

export default function AdminRequestsIndex({
    filter,
    counts,
    requests,
}: Props) {
    const filters = [
        { key: 'all', label: 'All', count: counts.all, href: index() },
        {
            key: 'unread',
            label: 'New',
            count: counts.unread,
            href: index({ query: { filter: 'unread' } }),
        },
    ] as const;

    return (
        <>
            <Head title="Requests" />

            <PageHeader
                eyebrow="Inbox"
                title="Requests"
                description="Every message sent through the website’s contact form. They are also emailed to you; opening one here marks it as read."
            />

            <nav
                aria-label="Filter requests"
                className="mb-6 flex gap-6 border-b border-hairline"
            >
                {filters.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        aria-current={filter === item.key ? 'page' : undefined}
                        className="-mb-px inline-flex items-center gap-2 border-b-2 border-transparent pb-3 text-[0.95rem] text-muted-stone hover:text-ink aria-[current=page]:border-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
                    >
                        {item.label}
                        <span className="bg-sand px-1.5 py-0.5 text-xs text-ink">
                            {item.count}
                        </span>
                    </Link>
                ))}
            </nav>

            {requests.data.length === 0 ? (
                <p className="border border-dashed border-hairline bg-paper p-10 text-center text-muted-stone">
                    {filter === 'unread'
                        ? 'No new requests. You have read everything.'
                        : 'No requests yet. Messages sent through the website’s contact form will appear here.'}
                </p>
            ) : (
                <div className="divide-y divide-hairline border border-hairline bg-paper/60">
                    {requests.data.map((request) => (
                        <RequestRow key={request.id} request={request} />
                    ))}
                </div>
            )}

            {requests.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    {requests.prev_page_url ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={requests.prev_page_url}>Previous</Link>
                        </Button>
                    ) : (
                        <span />
                    )}
                    <span className="text-sm text-muted-stone">
                        Page {requests.current_page} of {requests.last_page}
                    </span>
                    {requests.next_page_url ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={requests.next_page_url}>Next</Link>
                        </Button>
                    ) : (
                        <span />
                    )}
                </div>
            )}
        </>
    );
}
