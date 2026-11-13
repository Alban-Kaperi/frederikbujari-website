import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useFlashToast } from '@/hooks/use-flash-toast';

function Toaster({ ...props }: ToasterProps) {
    useFlashToast();

    return (
        <Sonner
            theme="light"
            className="toaster group"
            position="bottom-right"
            toastOptions={{
                className: 'font-sans !rounded-none',
            }}
            style={
                {
                    '--normal-bg': '#17130f',
                    '--normal-text': '#f5f1e8',
                    '--normal-border': '#17130f',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
