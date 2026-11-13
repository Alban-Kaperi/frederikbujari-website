import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function Eyebrow({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <p
            className={cn(
                'text-xs font-medium tracking-[0.28em] text-bronze-deep uppercase',
                className,
            )}
        >
            {children}
        </p>
    );
}
