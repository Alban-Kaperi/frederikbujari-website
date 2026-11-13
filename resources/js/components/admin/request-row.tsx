import { Link } from '@inertiajs/react';
import { show } from '@/routes/admin/requests';

export type AdminContactRequest = {
    id: number;
    name: string;
    email: string;
    message: string;
    locale: string;
    isRead: boolean;
    receivedAt: string;
    receivedAgo: string;
};

/** One request in a list; unread requests are marked with a bronze dot and bold name. */
export default function RequestRow({
    request,
}: {
    request: AdminContactRequest;
}) {
    return (
        <Link
            href={show(request.id)}
            className="group flex gap-4 px-5 py-4 transition-colors hover:bg-paper"
        >
            <span
                aria-hidden="true"
                className={`mt-2 size-2 shrink-0 rounded-full ${request.isRead ? 'bg-transparent' : 'bg-bronze'}`}
            />
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p
                        className={`truncate ${request.isRead ? 'text-ink' : 'font-semibold text-ink'}`}
                    >
                        {request.name}
                        <span className="ml-2 text-sm font-normal text-muted-stone">
                            {request.email}
                        </span>
                    </p>
                    <p
                        className="shrink-0 text-xs text-muted-stone"
                        title={request.receivedAt}
                    >
                        {request.receivedAgo}
                    </p>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-stone">
                    {!request.isRead && (
                        <span className="sr-only">Unread. </span>
                    )}
                    {request.message}
                </p>
            </div>
        </Link>
    );
}
