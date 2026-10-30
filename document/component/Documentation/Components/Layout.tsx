import { PropsWithChildren } from 'react';

import { Icon } from '../../../../source/Icon';
import nextConfig from '../../../next.config';
import * as style from './style.module.less';
import { Toc } from './Toc';

type NavLink = Record<'label' | 'slug', string>;

const components: NavLink[] = [
    { label: 'Avatar', slug: 'avatar' },
    { label: 'Badge', slug: 'badge' },
    { label: 'Button', slug: 'button' },
    { label: 'Dialog', slug: 'dialog' },
    { label: 'Menu', slug: 'menu' },
    { label: 'Navbar', slug: 'navbar' },
    { label: 'Popover & tooltip', slug: 'overlay-box' },
    { label: 'Spinner', slug: 'spinner' },
    { label: 'Toasts', slug: 'toasts' }
];
const extensions: NavLink[] = [
    { label: 'Click boundary', slug: 'click-boundary' },
    { label: 'Code block', slug: 'code-block' },
    { label: 'Countdown', slug: 'countdown' },
    { label: 'Editor', slug: 'editor' },
    { label: 'Editor HTML', slug: 'editor-html' },
    { label: 'Horizontal marquee', slug: 'horizontal-marquee' },
    { label: 'Icon', slug: 'icon' },
    { label: 'Live TSX', slug: 'live-tsx' },
    { label: 'Loading', slug: 'loading' },
    { label: 'Month calendar', slug: 'month-calendar' },
    { label: 'Nameplate', slug: 'nameplate' },
    { label: 'Page nav', slug: 'page-nav' },
    { label: 'Scroll nav', slug: 'scroll-nav' },
    { label: 'Select', slug: 'select' },
    { label: 'Share box', slug: 'share-box' },
    { label: 'Spinner button', slug: 'spinner-button' },
    { label: 'Table spinner', slug: 'table-spinner' },
    { label: 'Text truncate', slug: 'text-truncate' },
    { label: 'Time', slug: 'time' },
    { label: 'Time distance', slug: 'time-distance' },
    { label: 'Timeline', slug: 'timeline' },
    { label: 'Type echo', slug: 'type-echo' },
    { label: 'User rank', slug: 'user-rank' },
    { label: 'Vertical marquee', slug: 'vertical-marquee' },
    { label: 'Zodiac bar', slug: 'zodiac-bar' }
];
const groups = [
    {
        label: 'Components',
        icon: 'menu-button-wide-fill',
        iconClassName: 'fg-info',
        href: '',
        items: components
    },
    {
        label: 'Extensions',
        icon: 'puzzle-fill',
        iconClassName: 'fg-accent',
        href: 'idea-react/',
        items: extensions
    }
];
const basePath = nextConfig.basePath || '';

export function ComponentsLayout({ children }: PropsWithChildren) {
    return (
        <div className="container py-4">
            <div className="row g-5">
                <aside className="col-12 lg:col-3">
                    <nav
                        className={`d-flex flex-column pb-3 ${style.sidebar}`}
                        aria-label="Components navigation"
                    >
                        {groups.map(({ label, icon, iconClassName, href, items }) => (
                            <div key={label} className="vstack py-2">
                                <strong className="d-flex align-items-center gap-1 fw-semibold">
                                    <Icon
                                        name={icon}
                                        className={iconClassName}
                                        aria-hidden="true"
                                    />
                                    <a
                                        className="fg-body text-decoration-none"
                                        href={`${basePath}/components/${href}`}
                                    >
                                        {label}
                                    </a>
                                </strong>
                                <ul className="nav flex-column mt-1">
                                    {items.map(({ label, slug }) => (
                                        <li key={label} className="nav-item">
                                            <a
                                                className={`nav-link border-0 ${style.sidebarLink}`}
                                                href={`${basePath}/components/${slug}/`}
                                            >
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
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
