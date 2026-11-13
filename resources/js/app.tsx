import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Saint Matthew Merchant';

void createInertiaApp({
    title: (title) => {
        if (!title) {
            return appName;
        }

        return title.includes(appName) ? title : `${title} - ${appName}`;
    },
    layout: (name) => {
        switch (true) {
            // Public website pages render their own SiteLayout.
            case name === 'home':
            case name.startsWith('posts/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AdminLayout, SettingsLayout];
            default:
                return AdminLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <>
                {app}
                <Toaster />
            </>
        );
    },
    progress: {
        color: '#d2b27a',
    },
});
