import type { ReactNode } from 'react';
import SiteHeader from '@/components/site/site-header';
import SocialLinks from '@/components/site/social-links';
import WhatsAppButton from '@/components/site/whatsapp-button';
import type { Site, SiteNavItem } from '@/types/site';

export const siteContainer =
    'mx-auto w-full max-w-[1200px] px-5 sm:px-8 xl:px-0';

type Props = {
    site: Site;
    /** The home page links to its sections with "#about"; other pages link back to the home page. */
    isHome?: boolean;
    activeKey?: SiteNavItem['key'];
    children: ReactNode;
};

export default function SiteLayout({
    site,
    isHome = false,
    activeKey,
    children,
}: Props) {
    const { content } = site;
    const sectionHref = (id: string) =>
        isHome ? `#${id}` : `${site.homeUrl}#${id}`;

    const navItems: SiteNavItem[] = [
        { key: 'about', label: content.nav.about, href: sectionHref('about') },
        {
            key: 'services',
            label: content.nav.services,
            href: sectionHref('services'),
        },
        {
            key: 'targets',
            label: content.nav.targets,
            href: sectionHref('targets'),
        },
        {
            key: 'clients',
            label: content.nav.clients,
            href: sectionHref('clients'),
        },
        { key: 'posts', label: content.nav.posts, href: site.postsUrl },
    ];

    return (
        <div
            id="top"
            className="flex min-h-screen flex-col bg-ivory font-body text-ink antialiased"
        >
            <a
                href="#main"
                className="sr-only z-50 bg-ink px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                {content.skip_to_content}
            </a>

            <SiteHeader
                site={site}
                navItems={navItems}
                contactHref={sectionHref('clients')}
                activeKey={activeKey}
            />

            <main id="main" className="flex-1">
                {children}
            </main>

            {site.contact.whatsappUrl && (
                <WhatsAppButton
                    url={site.contact.whatsappUrl}
                    labels={content.whatsapp}
                />
            )}

            <footer className="bg-ink py-14 text-ivory/80 lg:py-16">
                <div
                    className={`${siteContainer} flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between`}
                >
                    <div className="flex flex-col gap-6">
                        <img
                            src="/images/logo-light.webp"
                            alt="Saint Matthew Merchant LLC"
                            width={900}
                            height={223}
                            loading="lazy"
                            className="h-12 w-auto self-start"
                        />
                        <SocialLinks social={site.social} tone="dark" />
                    </div>
                    <div className="flex flex-col gap-1 text-[0.95rem] leading-relaxed">
                        <p>
                            Saint Matthew Merchant LLC
                            {site.vatNumber &&
                                ` · ${content.footer.vat} ${site.vatNumber}`}
                        </p>
                        <p>{content.footer.established}</p>
                    </div>
                    <nav aria-label="Footer">
                        <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[0.95rem]">
                            {navItems
                                .filter((item) => item.key !== 'clients')
                                .map((item) => (
                                    <li key={item.key}>
                                        <a
                                            href={item.href}
                                            className="transition-colors hover:text-bronze"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            <li>
                                <a
                                    href={sectionHref('clients')}
                                    className="transition-colors hover:text-bronze"
                                >
                                    {content.nav.contact}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
