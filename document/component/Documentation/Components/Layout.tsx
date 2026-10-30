import { PropsWithChildren } from 'react';

import nextConfig from '../../../next.config';

const components = [
    { label: 'Accordion', slug: 'accordion' },
    { label: 'Alert', slug: 'alert' },
    { label: 'Avatar', slug: 'avatar' },
    { label: 'Badge', slug: 'badge' },
    { label: 'Breadcrumb', slug: 'breadcrumb' },
    { label: 'Button', slug: 'button' },
    { label: 'Button group', slug: 'button-group' },
    { label: 'Card', slug: 'card' },
    { label: 'Carousel', slug: 'carousel' },
    { label: 'Close button', slug: 'close-button' },
    { label: 'Collapse', slug: 'collapse' },
    { label: 'Dialog', slug: 'dialog' },
    { label: 'Drawer', slug: 'drawer' },
    { label: 'List group', slug: 'list-group' },
    { label: 'Menu', slug: 'menu' },
    { label: 'Nav', slug: 'nav' },
    { label: 'Nav overflow', slug: 'nav-overflow' },
    { label: 'Navbar', slug: 'navbar' },
    { label: 'Pagination', slug: 'pagination' },
    { label: 'Placeholder', slug: 'placeholder' },
    { label: 'Popover', slug: 'overlay-box' },
    { label: 'Progress', slug: 'progress' },
    { label: 'Scrollspy', slug: 'scrollspy' },
    { label: 'Spinner', slug: 'spinner' },
    { label: 'Stepper', slug: 'stepper' },
    { label: 'Tab', slug: 'tab' },
    { label: 'Toasts', slug: 'toasts' },
    { label: 'Toggler', slug: 'toggler' },
    { label: 'Tooltip', slug: 'overlay-box' }
];
const localComponents = new Set([
    'badge',
    'button',
    'dialog',
    'menu',
    'navbar',
    'overlay-box',
    'spinner',
    'toasts'
]);

export function ComponentsLayout({ children }: PropsWithChildren) {
    const basePath = nextConfig.basePath || '';

    return (
        <div className="container-xxl py-4">
            <div className="row g-4">
                <aside className="col-12 col-lg-3">
                    <nav
                        className="position-sticky top-0 overflow-y-auto"
                        aria-label="Bootstrap component documentation"
                    >
                        <a className="nav-link fw-semibold" href={`${basePath}/components/`}>
                            Components
                        </a>
                        <ul className="nav nav-underline flex-column">
                            {components.map(({ label, slug }) => (
                                <li key={slug + label} className="nav-item">
                                    <a
                                        className="nav-link py-1"
                                        href={
                                            localComponents.has(slug)
                                                ? `${basePath}/components/${slug}/`
                                                : `https://getbootstrap.com/docs/6.0/components/${slug}/`
                                        }
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <a
                            className="nav-link fw-semibold mt-3"
                            href={`${basePath}/components/idea-react/`}
                        >
                            Idea React extensions
                        </a>
                    </nav>
                </aside>
                <main id="content" className="col-12 col-lg-9">
                    {children}
                </main>
            </div>
        </div>
    );
}
