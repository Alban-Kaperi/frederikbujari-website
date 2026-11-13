import { Head } from '@inertiajs/react';
import ContactForm from '@/components/site/contact-form';
import Eyebrow from '@/components/site/eyebrow';
import SiteLayout, {
    siteContainer as container,
} from '@/components/site/site-layout';
import SocialLinks from '@/components/site/social-links';
import type { Site } from '@/types/site';

type Props = {
    site: Site;
};

const sectionHeading =
    'font-display text-[2.6rem] leading-[1.08] font-normal tracking-[-0.01em] sm:text-5xl lg:text-[3.65rem]';

export default function Home({ site }: Props) {
    const { content, contact } = site;

    return (
        <>
            <Head title={content.meta.title} />

            <SiteLayout site={site} isHome>
                {/* Hero */}
                <section
                    aria-labelledby="hero-title"
                    className="relative isolate overflow-hidden bg-ink text-ivory"
                >
                    <img
                        src="/images/hero-1280.webp"
                        srcSet="/images/hero-768.webp 768w, /images/hero-1280.webp 1280w, /images/hero-2400.webp 2400w"
                        sizes="100vw"
                        alt={content.hero.image_alt}
                        width={2400}
                        height={1472}
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 size-full object-cover object-[60%_center]"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-ink/60 bg-linear-to-r from-ink/40 to-transparent"
                    />

                    <div
                        className={`${container} flex flex-col gap-8 pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-26 lg:pb-30`}
                    >
                        <p className="text-xs font-medium tracking-[0.28em] text-bronze uppercase">
                            {content.hero.eyebrow}
                        </p>
                        <h1
                            id="hero-title"
                            className="max-w-[52rem] font-display text-[3.1rem] leading-[1.02] font-normal tracking-[-0.01em] sm:text-7xl lg:text-[5.6rem]"
                        >
                            {content.hero.title_before}{' '}
                            <em className="text-bronze">
                                {content.hero.title_highlight}
                            </em>{' '}
                            {content.hero.title_after}
                        </h1>
                        <p className="max-w-[36rem] text-lg leading-relaxed text-ivory/90 sm:text-[1.2rem]">
                            {content.hero.text}
                        </p>
                        <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                            <a
                                href="#clients"
                                className="bg-bronze px-8 py-4.5 text-center text-base font-medium text-ink transition-colors hover:bg-[#dcc08e]"
                            >
                                {content.hero.primary_cta}
                            </a>
                            <a
                                href="#services"
                                className="border border-ivory/80 px-8 py-4.5 text-center text-base font-medium text-ivory transition-colors hover:bg-ivory hover:text-ink"
                            >
                                {content.hero.secondary_cta}
                            </a>
                        </div>
                    </div>
                </section>

                {/* About us */}
                <section
                    id="about"
                    aria-labelledby="about-title"
                    className="scroll-mt-18 py-20 sm:py-28 lg:scroll-mt-24 lg:py-32"
                >
                    <div className={container}>
                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                            <div className="flex flex-col gap-6">
                                <Eyebrow>{content.about.eyebrow}</Eyebrow>
                                <h2 id="about-title" className={sectionHeading}>
                                    {content.about.title}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-6 text-[1.075rem] leading-[1.75] text-stone lg:pt-0.5">
                                {content.about.paragraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <ol className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-20 lg:mt-20 lg:grid-cols-4 lg:gap-8">
                            {content.about.milestones.map((milestone) => (
                                <li
                                    key={milestone.year}
                                    className="flex flex-col border-t border-ink/70 pt-6"
                                >
                                    <span className="font-display text-5xl leading-none">
                                        {milestone.year}
                                    </span>
                                    <span className="mt-4 font-medium text-ink">
                                        {milestone.title}
                                    </span>
                                    <span className="mt-1 text-sm text-stone">
                                        {milestone.text}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Services */}
                <section
                    id="services"
                    aria-labelledby="services-title"
                    className="scroll-mt-18 bg-ink py-20 text-ivory sm:py-28 lg:scroll-mt-24 lg:py-32"
                >
                    <div className={container}>
                        <div className="flex flex-col gap-6">
                            <Eyebrow className="text-bronze">
                                {content.services.eyebrow}
                            </Eyebrow>
                            <h2
                                id="services-title"
                                className={`${sectionHeading} max-w-[42rem]`}
                            >
                                {content.services.title}
                            </h2>
                        </div>

                        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                            {content.services.items.map((service, index) => (
                                <li
                                    key={service.title}
                                    className="flex flex-col border-t border-ink-line pt-7"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="font-display text-4xl text-bronze"
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="mt-5 text-xl leading-snug font-medium">
                                        {service.title}
                                    </h3>
                                    <p className="mt-3 leading-relaxed text-ivory/75">
                                        {service.text}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Our targets */}
                <section
                    id="targets"
                    aria-labelledby="targets-title"
                    className="scroll-mt-18 py-20 sm:py-28 lg:scroll-mt-24 lg:py-28"
                >
                    <div
                        className={`${container} grid items-center gap-12 lg:grid-cols-[560px_1fr] lg:gap-20`}
                    >
                        <picture>
                            <source
                                media="(min-width: 768px)"
                                srcSet="/images/targets-1200.webp"
                            />
                            <img
                                src="/images/targets-700.webp"
                                alt={content.targets.image_alt}
                                width={1200}
                                height={579}
                                loading="lazy"
                                decoding="async"
                                className="aspect-[4/3] w-full object-cover lg:aspect-[560/520]"
                            />
                        </picture>

                        <div className="flex flex-col gap-6">
                            <Eyebrow>{content.targets.eyebrow}</Eyebrow>
                            <h2 id="targets-title" className={sectionHeading}>
                                {content.targets.title}
                            </h2>
                            <p className="text-[1.075rem] leading-[1.75] text-stone">
                                {content.targets.text}
                            </p>
                            <ul className="flex flex-wrap gap-2.5 pt-4">
                                {content.targets.groups.map((group) => (
                                    <li
                                        key={group}
                                        className="rounded-full border border-ink px-5 py-3 text-sm text-ink"
                                    >
                                        {group}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Clients / contact */}
                <section
                    id="clients"
                    aria-labelledby="clients-title"
                    className="scroll-mt-18 border-t border-hairline bg-sand py-20 sm:py-28 lg:scroll-mt-24 lg:py-26"
                >
                    <div
                        className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-16`}
                    >
                        <div className="flex flex-col gap-6">
                            <Eyebrow>{content.clients.eyebrow}</Eyebrow>
                            <h2 id="clients-title" className={sectionHeading}>
                                {content.clients.title}
                            </h2>
                            <p className="text-[1.075rem] text-stone">
                                {content.clients.text}
                            </p>

                            <dl className="mt-6 flex flex-col gap-6">
                                {contact.email && (
                                    <div className="flex flex-col gap-1.5">
                                        <dt className="text-xs font-medium tracking-[0.2em] text-stone/80 uppercase">
                                            {content.clients.email_label}
                                        </dt>
                                        <dd>
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-[1.075rem] break-all underline-offset-4 hover:underline"
                                            >
                                                {contact.email}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="flex flex-col gap-1.5">
                                        <dt className="text-xs font-medium tracking-[0.2em] text-stone/80 uppercase">
                                            {content.clients.phone_label}
                                        </dt>
                                        <dd>
                                            <a
                                                href={
                                                    contact.phoneUrl ??
                                                    undefined
                                                }
                                                className="text-[1.075rem] underline-offset-4 hover:underline"
                                            >
                                                {contact.phone}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                <div className="flex flex-col gap-1.5">
                                    <dt className="text-xs font-medium tracking-[0.2em] text-stone/80 uppercase">
                                        {content.clients.offices_label}
                                    </dt>
                                    <dd className="text-[1.075rem]">
                                        {content.clients.offices}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <dt className="text-xs font-medium tracking-[0.2em] text-stone/80 uppercase">
                                        {content.follow_us}
                                    </dt>
                                    <dd>
                                        <SocialLinks social={site.social} />
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <ContactForm
                            labels={content.clients.form}
                            locale={site.locale}
                        />
                    </div>
                </section>
            </SiteLayout>
        </>
    );
}
