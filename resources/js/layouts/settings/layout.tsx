import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import PageHeader from '@/components/admin/page-header';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const tabs = [
    { title: 'Profile', href: edit().url },
    { title: 'Password', href: editSecurity().url },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            <PageHeader
                eyebrow="Account"
                title="Your account"
                description="Your login details for this admin area."
            />

            <nav
                aria-label="Account"
                className="-mt-4 mb-10 flex gap-6 border-b border-hairline"
            >
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={
                            isCurrentUrl(tab.href) ? 'page' : undefined
                        }
                        className="-mb-px border-b-2 border-transparent pb-3 text-[0.95rem] text-muted-stone transition-colors hover:text-ink aria-[current=page]:border-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
                    >
                        {tab.title}
                    </Link>
                ))}
            </nav>

            <div className="max-w-xl space-y-14">{children}</div>
        </>
    );
}
