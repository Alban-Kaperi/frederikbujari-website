import type { ReactNode } from 'react';
import { home } from '@/routes';

type Props = {
    title?: string;
    description?: string;
    children: ReactNode;
};

/** Sign-in and password screens for the admin, in the website's style. */
export default function AuthLayout({
    title = '',
    description = '',
    children,
}: Props) {
    return (
        <div className="grid min-h-dvh bg-ivory font-sans text-ink lg:grid-cols-[1.05fr_1fr]">
            <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-ink p-12 text-ivory lg:flex xl:p-16">
                <img
                    src="/images/hero-1280.webp"
                    alt=""
                    className="absolute inset-0 -z-20 size-full object-cover object-[60%_center]"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-ink/70"
                />
                <a href={home().url} className="self-start">
                    <img
                        src="/images/logo-light.webp"
                        alt="Saint Matthew Merchant LLC"
                        width={900}
                        height={223}
                        className="h-12 w-auto"
                    />
                </a>
                <figure className="max-w-md">
                    <blockquote className="font-display text-4xl leading-tight xl:text-5xl">
                        “If you fail to plan, you are planning to fail.”
                    </blockquote>
                    <figcaption className="mt-5 text-xs font-medium tracking-[0.28em] text-bronze uppercase">
                        Benjamin Franklin
                    </figcaption>
                </figure>
            </aside>

            <main className="flex flex-col px-5 py-10 sm:px-10 lg:justify-center lg:px-16">
                <a href={home().url} className="mb-12 self-start lg:hidden">
                    <img
                        src="/images/logo-dark.webp"
                        alt="Saint Matthew Merchant LLC"
                        width={900}
                        height={223}
                        className="h-10 w-auto"
                    />
                </a>
                <div className="w-full max-w-md lg:mx-auto">
                    <p className="text-xs font-medium tracking-[0.28em] text-bronze-deep uppercase">
                        Admin
                    </p>
                    <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-3 text-[0.95rem] text-muted-stone">
                            {description}
                        </p>
                    )}
                    <div className="mt-10">{children}</div>
                </div>
            </main>
        </div>
    );
}
