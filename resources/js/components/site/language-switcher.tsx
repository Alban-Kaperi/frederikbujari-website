import { Check, ChevronDown, Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Site, SiteLocale } from '@/types/site';

type Props = {
    site: Site;
    className?: string;
};

export default function LanguageSwitcher({ site, className }: Props) {
    const locales = Object.keys(site.alternates) as SiteLocale[];

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger
                aria-label={`${site.content.choose_language}: ${site.languageNames[site.locale]}`}
                className={cn(
                    'inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium tracking-wider text-ink uppercase transition-colors outline-none hover:text-bronze-deep focus-visible:ring-2 focus-visible:ring-bronze/60 data-[state=open]:text-bronze-deep',
                    className,
                )}
            >
                <Globe className="size-4" aria-hidden="true" />
                {site.locale}
                <ChevronDown
                    className="size-3.5 transition-transform in-data-[state=open]:rotate-180"
                    aria-hidden="true"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="min-w-44 rounded-none border-hairline bg-paper p-1.5 font-body text-ink shadow-lg"
            >
                {locales.map((code) => (
                    <DropdownMenuItem
                        key={code}
                        asChild
                        className="cursor-pointer rounded-none px-3 py-2.5 text-[0.95rem] focus:bg-sand focus:text-ink"
                    >
                        {/* Full page load, so <html lang>, canonical and hreflang tags match the language. */}
                        <a
                            href={site.alternates[code]}
                            hrefLang={code}
                            lang={code}
                            aria-current={
                                code === site.locale ? 'page' : undefined
                            }
                        >
                            <span className="w-7 text-xs font-semibold tracking-wider text-bronze-deep uppercase">
                                {code}
                            </span>
                            <span className="flex-1">
                                {site.languageNames[code]}
                            </span>
                            {code === site.locale && (
                                <Check
                                    className="size-4 text-bronze-deep"
                                    aria-hidden="true"
                                />
                            )}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
