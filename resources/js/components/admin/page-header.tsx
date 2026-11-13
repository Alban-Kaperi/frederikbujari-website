import type { ReactNode } from 'react';

type Props = {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
};

/** Heading block at the top of every admin page. */
export default function PageHeader({
    eyebrow,
    title,
    description,
    actions,
}: Props) {
    return (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-hairline pb-6 lg:mb-10">
            <div className="flex min-w-0 flex-col gap-2">
                {eyebrow && (
                    <p className="text-xs font-medium tracking-[0.28em] text-bronze-deep uppercase">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-display text-4xl leading-tight break-words lg:text-5xl">
                    {title}
                </h1>
                {description && (
                    <p className="max-w-2xl text-[0.95rem] text-muted-stone">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-3">
                    {actions}
                </div>
            )}
        </header>
    );
}
