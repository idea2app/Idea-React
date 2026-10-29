import './globals.css';

import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
    title: 'Idea React documentation',
    description: 'Idea React documentation built with vinext and MDX.'
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
