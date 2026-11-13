import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SiteContent } from '@/types/site';

type Props = {
    url: string;
    labels: SiteContent['whatsapp'];
};

const dismissedStorageKey = 'whatsapp-bubble-dismissed';

/**
 * Floating WhatsApp button. It is sticky inside the page, so it follows the viewport
 * while scrolling and comes to rest just above the footer instead of covering it.
 */
export default function WhatsAppButton({ url, labels }: Props) {
    const [isBubbleVisible, setIsBubbleVisible] = useState(false);

    useEffect(() => {
        let wasDismissed = false;

        try {
            wasDismissed =
                window.localStorage.getItem(dismissedStorageKey) === '1';
        } catch {
            // Storage can be blocked (private mode); the bubble then just shows again.
        }

        if (wasDismissed) {
            return;
        }

        const timer = window.setTimeout(() => setIsBubbleVisible(true), 1200);

        return () => window.clearTimeout(timer);
    }, []);

    const dismissBubble = () => {
        setIsBubbleVisible(false);

        try {
            window.localStorage.setItem(dismissedStorageKey, '1');
        } catch {
            // Ignore: dismissal only lasts for this page view.
        }
    };

    return (
        <div className="pointer-events-none sticky bottom-0 z-30 h-0">
            <div className="absolute right-4 bottom-4 flex items-center gap-3 sm:right-6 sm:bottom-6">
                {isBubbleVisible && (
                    <div className="pointer-events-auto flex animate-in items-center gap-2 duration-300 fade-in slide-in-from-right-2">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener"
                            className="border border-hairline bg-paper px-4 py-3 text-[0.95rem] text-ink shadow-[0_8px_30px_rgb(23_19_15/0.12)] transition-colors hover:border-bronze-deep"
                        >
                            {labels.bubble}
                        </a>
                        <button
                            type="button"
                            onClick={dismissBubble}
                            aria-label={labels.dismiss}
                            className="inline-flex size-7 items-center justify-center rounded-full bg-ink text-ivory transition-colors hover:bg-ink/80"
                        >
                            <X className="size-3.5" aria-hidden="true" />
                        </button>
                    </div>
                )}

                <a
                    href={url}
                    target="_blank"
                    rel="noopener"
                    aria-label={labels.label}
                    className="pointer-events-auto inline-flex size-14 items-center justify-center rounded-full bg-ink text-bronze shadow-[0_10px_30px_rgb(23_19_15/0.35)] ring-1 ring-bronze/50 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-bronze focus-visible:outline-none sm:size-16"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="size-7 fill-current sm:size-8"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
