import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { store } from '@/routes/contact';
import type { SiteContent, SiteLocale } from '@/types/site';

type Props = {
    labels: SiteContent['clients']['form'];
    locale: SiteLocale;
};

const fieldClassName =
    'w-full border border-hairline bg-white px-4 py-3 text-base text-ink transition-colors outline-none focus:border-bronze-deep focus:ring-2 focus:ring-bronze/40 aria-invalid:border-red-600';

export default function ContactForm({ labels, locale }: Props) {
    return (
        <Form
            {...store.form()}
            options={{ preserveScroll: true }}
            resetOnSuccess
            className="flex flex-col gap-6 border border-hairline bg-paper p-6 sm:p-10"
        >
            {({ errors, processing, wasSuccessful }) => (
                <>
                    <input type="hidden" name="locale" value={locale} />

                    {/* Honeypot: hidden from people, filled in by spam bots. */}
                    <div className="hidden" aria-hidden="true">
                        <label htmlFor="website">Website</label>
                        <input
                            id="website"
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-ink"
                        >
                            {labels.name}
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            aria-invalid={errors.name ? true : undefined}
                            className={fieldClassName}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-ink"
                        >
                            {labels.email}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            aria-invalid={errors.email ? true : undefined}
                            className={fieldClassName}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label
                            htmlFor="message"
                            className="text-sm font-medium text-ink"
                        >
                            {labels.message}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            required
                            aria-invalid={errors.message ? true : undefined}
                            className={`${fieldClassName} resize-y`}
                        />
                        <InputError message={errors.message} />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-ink px-6 py-4 text-base font-medium text-ivory transition-colors hover:bg-ink/85 disabled:cursor-wait disabled:opacity-70"
                    >
                        {processing ? labels.sending : labels.submit}
                    </button>

                    <p
                        role="status"
                        className="text-sm text-bronze-deep empty:hidden"
                    >
                        {wasSuccessful ? labels.success : ''}
                    </p>
                </>
            )}
        </Form>
    );
}
