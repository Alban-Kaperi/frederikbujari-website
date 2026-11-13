import { Link, router, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    FileText,
    Inbox,
    LayoutDashboard,
    LogOut,
    Menu,
    UserRound,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { dashboard, home, logout } from '@/routes';
import { index as postsIndex } from '@/routes/admin/posts';
import { index as requestsIndex } from '@/routes/admin/requests';
import { edit as editProfile } from '@/routes/profile';

type NavigationItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    /** Also highlight the item on pages below this URL. */
    matchChildren?: boolean;
    badge?: number | null;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { auth, unreadRequestCount } = usePage().props;
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation: NavigationItem[] = [
        { title: 'Dashboard', href: dashboard().url, icon: LayoutDashboard },
        {
            title: 'Requests',
            href: requestsIndex().url,
            icon: Inbox,
            matchChildren: true,
            badge: unreadRequestCount,
        },
        {
            title: 'Posts',
            href: postsIndex().url,
            icon: FileText,
            matchChildren: true,
        },
        {
            title: 'Account',
            href: editProfile().url,
            icon: UserRound,
            matchChildren: true,
        },
    ];

    const isActive = (item: NavigationItem) =>
        item.matchChildren
            ? isCurrentOrParentUrl(item.href)
            : isCurrentUrl(item.href);

    const navigationLinks = (
        <ul className="flex flex-col gap-1">
            {navigation.map((item) => (
                <li key={item.title}>
                    <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={isActive(item) ? 'page' : undefined}
                        className="group flex items-center gap-3 border-l-2 border-transparent px-4 py-3 text-[0.95rem] text-ivory/70 transition-colors hover:bg-ivory/5 hover:text-ivory aria-[current=page]:border-bronze aria-[current=page]:bg-ivory/[0.07] aria-[current=page]:text-ivory"
                    >
                        <item.icon
                            className="size-[18px] text-ivory/50 group-aria-[current=page]:text-bronze"
                            aria-hidden="true"
                        />
                        <span className="flex-1">{item.title}</span>
                        {item.badge ? (
                            <span className="min-w-6 bg-bronze px-1.5 py-0.5 text-center text-xs font-semibold text-ink">
                                {item.badge}
                            </span>
                        ) : null}
                    </Link>
                </li>
            ))}
        </ul>
    );

    const accountFooter = (
        <div className="flex flex-col gap-1 border-t border-ink-line/70 pt-4">
            <a
                href={home().url}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-ivory/70 transition-colors hover:text-ivory"
            >
                <ExternalLink className="size-4" aria-hidden="true" />
                View website
            </a>
            <div className="mt-2 flex items-center justify-between gap-3 px-4 py-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ivory">
                        {auth.user.name}
                    </p>
                    <p className="truncate text-xs text-ivory/50">
                        {auth.user.email}
                    </p>
                </div>
                <Link
                    href={logout()}
                    as="button"
                    onClick={() => router.flushAll()}
                    aria-label="Log out"
                    title="Log out"
                    className="inline-flex size-9 shrink-0 items-center justify-center text-ivory/60 transition-colors hover:bg-ivory/10 hover:text-ivory"
                    data-test="logout-button"
                >
                    <LogOut className="size-4" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-ivory font-sans text-ink">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-ink px-4 py-8 lg:flex">
                <Link href={dashboard()} className="mb-10 px-4">
                    <img
                        src="/images/logo-light.webp"
                        alt="Saint Matthew Merchant LLC"
                        width={900}
                        height={223}
                        className="h-11 w-auto"
                    />
                </Link>
                <p className="mb-3 px-4 text-[0.7rem] font-medium tracking-[0.28em] text-bronze uppercase">
                    Admin
                </p>
                <nav aria-label="Admin" className="flex-1">
                    {navigationLinks}
                </nav>
                {accountFooter}
            </aside>

            {/* Mobile top bar */}
            <header className="sticky top-0 z-30 bg-ink lg:hidden">
                <div className="flex h-16 items-center justify-between px-4">
                    <Link href={dashboard()}>
                        <img
                            src="/images/logo-light.webp"
                            alt="Saint Matthew Merchant LLC"
                            width={900}
                            height={223}
                            className="h-8 w-auto"
                        />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                        aria-expanded={isMenuOpen}
                        aria-controls="admin-mobile-menu"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className="relative inline-flex size-11 items-center justify-center text-ivory"
                    >
                        {isMenuOpen ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                        {!isMenuOpen && unreadRequestCount ? (
                            <span className="absolute top-2 right-2 size-2.5 rounded-full bg-bronze" />
                        ) : null}
                    </button>
                </div>
                <nav
                    id="admin-mobile-menu"
                    aria-label="Admin"
                    hidden={!isMenuOpen}
                    className="border-t border-ink-line/70 px-2 pt-2 pb-4"
                >
                    {navigationLinks}
                    <div className="mt-3">{accountFooter}</div>
                </nav>
            </header>

            <main className="lg:pl-72">
                <div
                    className={cn(
                        'mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-12 lg:py-12',
                    )}
                >
                    {children}
                </div>
            </main>
        </div>
    );
}
