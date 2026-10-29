import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
    title: 'Idea React · Advanced components for React',
    description:
        'TypeScript-first React components powered by MobX. Explore dialogs, notifications, editors, timelines, and more.'
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css"
                />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/bootstrap-icons@1.13.1/font/bootstrap-icons.css"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
