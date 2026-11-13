import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from '@/components/site/language-switcher';
import type { Site, SiteNavItem } from '@/types/site';

type Props = {
    site: Site;
    navItems: SiteNavItem[];
    contactHref: string;
    activeKey?: SiteNavItem['key'];
};

export default function SiteHeader({
    site,
    navItems,
    contactHref,
    activeKey,
}: Props) {
    const { content, contact } = site;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-40 border-b border-hairline/70 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85">
            <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8 xl:h-24 xl:px-0">
                <a href={site.homeUrl} className="shrink-0" onClick={closeMenu}>
                    <img
                        src="/images/logo-dark.webp"
                        alt="Saint Matthew Merchant LLC"
                        width={900}
                        height={223}
                        className="h-8 w-auto sm:h-9 xl:h-11"
                    />
                </a>

                <nav
                    className="hidden items-center gap-7 xl:flex"
                    aria-label="Main"
                >
                    <ul className="flex items-center gap-7">
                        {navItems.map((item) => (
                            <li key={item.key}>
                                <a
                                    href={item.href}
                                    aria-current={
                                        item.key === activeKey
                                            ? 'page'
                                            : undefined
                                    }
                                    className="text-[0.95rem] text-ink transition-colors hover:text-bronze-deep aria-[current=page]:text-bronze-deep"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-3">
                        {contact.phoneUrl && (
                            <a
                                href={contact.phoneUrl}
                                className="inline-flex items-center gap-2 border border-ink px-4.5 py-3 text-[0.95rem] font-medium text-ink transition-colors hover:bg-ink hover:text-ivory"
                            >
                                <Phone className="size-4" aria-hidden="true" />
                                {content.call_us}
                            </a>
                        )}
                        <a
                            href={contactHref}
                            className="border border-ink bg-ink px-5 py-3 text-[0.95rem] font-medium text-ivory transition-colors hover:bg-ink/85"
                        >
                            {content.nav.contact}
                        </a>
                    </div>
                    <div className="border-l border-hairline pl-3">
                        <LanguageSwitcher site={site} />
                    </div>
                </nav>

                <div className="-mr-2 flex items-center gap-1 xl:hidden">
                    {contact.phoneUrl && (
                        <a
                            href={contact.phoneUrl}
                            aria-label={`${content.call_us}: ${contact.phone}`}
                            className="inline-flex size-11 items-center justify-center text-ink"
                        >
                            <Phone className="size-5" aria-hidden="true" />
                        </a>
                    )}
                    <LanguageSwitcher site={site} />
                    <button
                        type="button"
                        className="inline-flex size-11 items-center justify-center text-ink"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={
                            isMenuOpen ? content.close_menu : content.open_menu
                        }
                        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                    </button>
                </div>
            </div>

            <nav
                id="mobile-menu"
                aria-label="Mobile"
                hidden={!isMenuOpen}
                className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-hairline/70 bg-ivory xl:hidden"
            >
                <ul className="flex flex-col px-5 py-2 sm:px-8">
                    {navItems.map((item) => (
                        <li key={item.key}>
                            <a
                                href={item.href}
                                onClick={closeMenu}
                                aria-current={
                                    item.key === activeKey ? 'page' : undefined
                                }
                                className="block border-b border-hairline/60 py-4 font-display text-2xl text-ink aria-[current=page]:text-bronze-deep"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col gap-3 px-5 pt-3 pb-6 sm:flex-row sm:px-8">
                    {contact.phoneUrl && (
                        <a
                            href={contact.phoneUrl}
                            className="inline-flex items-center justify-center gap-2 border border-ink px-5 py-3.5 text-sm font-medium text-ink"
                        >
                            <Phone className="size-4" aria-hidden="true" />
                            {content.call_us}
                        </a>
                    )}
                    <a
                        href={contactHref}
                        onClick={closeMenu}
                        className="bg-ink px-5 py-3.5 text-center text-sm font-medium text-ivory"
                    >
                        {content.nav.contact}
                    </a>
                </div>
            </nav>
        </header>
    );
}
