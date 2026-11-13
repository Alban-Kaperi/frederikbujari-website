import { Facebook, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Site } from '@/types/site';

const profiles = [
    { key: 'facebook', label: 'Facebook', icon: Facebook },
    { key: 'instagram', label: 'Instagram', icon: Instagram },
] as const;

type Props = {
    social: Site['social'];
    /** "dark" for the footer, "light" for ivory sections. */
    tone?: 'dark' | 'light';
    className?: string;
};

/**
 * Facebook and Instagram icons. They are always shown; an icon becomes a link
 * once its profile URL is set in .env (SOCIAL_FACEBOOK_URL, SOCIAL_INSTAGRAM_URL).
 */
export default function SocialLinks({
    social,
    tone = 'light',
    className,
}: Props) {
    const iconClassName = cn(
        'inline-flex size-11 items-center justify-center rounded-full border transition-colors',
        tone === 'dark'
            ? 'border-ink-line text-ivory/80'
            : 'border-ink/30 text-ink',
    );
    const linkClassName =
        tone === 'dark'
            ? 'hover:border-bronze hover:text-bronze'
            : 'hover:border-ink hover:bg-ink hover:text-ivory';

    return (
        <ul className={cn('flex items-center gap-2', className)}>
            {profiles.map((profile) => {
                const url = social[profile.key];
                const icon = (
                    <profile.icon className="size-[18px]" aria-hidden="true" />
                );

                return (
                    <li key={profile.key}>
                        {url ? (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener me"
                                aria-label={profile.label}
                                title={profile.label}
                                className={cn(iconClassName, linkClassName)}
                            >
                                {icon}
                            </a>
                        ) : (
                            <span
                                role="img"
                                aria-label={profile.label}
                                title={profile.label}
                                className={iconClassName}
                            >
                                {icon}
                            </span>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
