import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, MailOpen, Trash2 } from 'lucide-react';
import PageHeader from '@/components/admin/page-header';
import type { AdminContactRequest } from '@/components/admin/request-row';
import { Button } from '@/components/ui/button';
import { destroy, index, unread } from '@/routes/admin/requests';

const languageNames: Record<string, string> = {
    sq: 'Albanian',
    en: 'English',
    it: 'Italian',
};

export default function AdminRequestsShow({
    contactRequest,
}: {
    contactRequest: AdminContactRequest;
}) {
    const replySubject = encodeURIComponent(
        'Re: your request to Saint Matthew Merchant',
    );

    return (
        <>
            <Head title={`Request from ${contactRequest.name}`} />

            <Link
                href={index()}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-stone hover:text-ink"
            >
                <ArrowLeft className="size-4" />
                All requests
            </Link>

            <PageHeader
                eyebrow="Request"
                title={contactRequest.name}
                actions={
                    <>
                        <Button asChild>
                            <a
                                href={`mailto:${contactRequest.email}?subject=${replySubject}`}
                            >
                                <Mail />
                                Reply by email
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={unread(contactRequest.id)} as="button">
                                <MailOpen />
                                Mark as unread
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link
                                href={destroy(contactRequest.id)}
                                as="button"
                                className="text-danger hover:bg-danger/10"
                                onBefore={() =>
                                    window.confirm(
                                        `Delete the request from ${contactRequest.name}? This cannot be undone.`,
                                    )
                                }
                            >
                                <Trash2 />
                                Delete
                            </Link>
                        </Button>
                    </>
                }
            />

            <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
                <article className="border border-hairline bg-paper p-6 sm:p-8">
                    <h2 className="sr-only">Message</h2>
                    <p className="text-[1.05rem] leading-relaxed break-words whitespace-pre-line text-stone">
                        {contactRequest.message}
                    </p>
                </article>

                <dl className="flex flex-col gap-5 text-sm">
                    <div>
                        <dt className="text-xs font-medium tracking-[0.2em] text-muted-stone uppercase">
                            Email
                        </dt>
                        <dd className="mt-1 break-all">
                            <a
                                href={`mailto:${contactRequest.email}`}
                                className="underline decoration-hairline underline-offset-4 hover:decoration-ink"
                            >
                                {contactRequest.email}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium tracking-[0.2em] text-muted-stone uppercase">
                            Received
                        </dt>
                        <dd className="mt-1">
                            {contactRequest.receivedAt}
                            <span className="text-muted-stone">
                                {' '}
                                · {contactRequest.receivedAgo}
                            </span>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium tracking-[0.2em] text-muted-stone uppercase">
                            Website language
                        </dt>
                        <dd className="mt-1">
                            {languageNames[contactRequest.locale] ??
                                contactRequest.locale.toUpperCase()}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}
