export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'section';
}) {
    return (
        <header className={variant === 'section' ? '' : 'mb-8 space-y-1'}>
            <h2
                className={
                    variant === 'section'
                        ? 'font-display text-2xl leading-tight'
                        : 'font-display text-3xl leading-tight'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="mt-1 text-sm text-muted-stone">{description}</p>
            )}
        </header>
    );
}
