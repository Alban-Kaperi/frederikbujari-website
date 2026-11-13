export type SiteLocale = 'sq' | 'en' | 'it';

export type SiteContent = {
    meta: {
        title: string;
        description: string;
        og_locale: string;
    };
    language_name: string;
    skip_to_content: string;
    open_menu: string;
    close_menu: string;
    language_label: string;
    follow_us: string;
    call_us: string;
    choose_language: string;
    nav: {
        about: string;
        services: string;
        targets: string;
        clients: string;
        posts: string;
        contact: string;
    };
    hero: {
        eyebrow: string;
        title_before: string;
        title_highlight: string;
        title_after: string;
        text: string;
        primary_cta: string;
        secondary_cta: string;
        image_alt: string;
    };
    about: {
        eyebrow: string;
        title: string;
        paragraphs: string[];
        milestones: { year: string; title: string; text: string }[];
    };
    services: {
        eyebrow: string;
        title: string;
        items: { title: string; text: string }[];
    };
    targets: {
        eyebrow: string;
        title: string;
        text: string;
        groups: string[];
        image_alt: string;
    };
    clients: {
        eyebrow: string;
        title: string;
        text: string;
        email_label: string;
        phone_label: string;
        offices_label: string;
        offices: string;
        form: {
            name: string;
            email: string;
            message: string;
            submit: string;
            sending: string;
            success: string;
        };
    };
    posts: {
        eyebrow: string;
        title: string;
        intro: string;
        meta_title: string;
        meta_description: string;
        read_more: string;
        empty: string;
        back: string;
        previous: string;
        next: string;
        pagination: string;
    };
    whatsapp: {
        bubble: string;
        label: string;
        dismiss: string;
        message: string;
    };
    footer: {
        vat: string;
        established: string;
        rights: string;
    };
};

export type SiteContact = {
    email: string | null;
    phone: string | null;
    phoneUrl: string | null;
    whatsappUrl: string | null;
};

/** Shared data every public page receives as its `site` prop. */
export type Site = {
    locale: SiteLocale;
    /** This page's URL in every language, in switcher order (default language first). */
    alternates: Record<SiteLocale, string>;
    languageNames: Record<SiteLocale, string>;
    homeUrl: string;
    postsUrl: string;
    content: SiteContent;
    contact: SiteContact;
    vatNumber: string | null;
    /** Social profile links from .env; null until a link is configured. */
    social: Record<'facebook' | 'instagram', string | null>;
};

export type SiteNavItem = {
    key: 'about' | 'services' | 'targets' | 'clients' | 'posts';
    label: string;
    href: string;
};
