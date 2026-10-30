import { PropsWithChildren } from 'react';

import { Sidebar } from './Sidebar';
import { Toc } from './Toc';

export interface ComponentsLayoutProps extends PropsWithChildren {
    active?: string;
}

export function ComponentsLayout({ active, children }: ComponentsLayoutProps) {
    return (
        <div className="container py-4">
            <div className="row g-5">
                <aside className="col-12 lg:col-3">
                    <Sidebar active={active} />
                </aside>
                <div className="col-12 lg:col-9">
                    <div className="row g-5">
                        <main id="content" className="col-12 lg:col-9">
                            {children}
                        </main>
                        <aside className="col-12 lg:col-3 d-none lg:d-block">
                            <Toc />
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
