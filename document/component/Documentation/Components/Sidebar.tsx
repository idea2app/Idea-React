import classNames from 'classnames';
import { FC } from 'react';

import { Icon } from '../../../../source/Icon';
import nextConfig from '../../../next.config';
import * as style from './style.module.less';

type NavLink = Record<'label' | 'slug', string>;
type NavGroup = Record<'label' | 'icon' | 'iconClassName' | 'href' | 'slug', string> & {
    items: readonly NavLink[];
};

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
const groups: NavGroup[] = [
    {
        label: 'Components',
        icon: 'menu-button-wide-fill',
        iconClassName: 'fg-info',
        href: '',
        slug: 'components',
        items: components
    },
    {
        label: 'Extensions',
        icon: 'puzzle-fill',
        iconClassName: 'fg-accent',
        href: 'idea-react/',
        slug: 'idea-react',
        items: extensions
    }
];
const basePath = nextConfig.basePath || '';

export interface SidebarProps {
    active?: string;
}

export const Sidebar: FC<SidebarProps> = ({ active }) => (
    <nav className={`d-flex flex-column pb-3 ${style.sidebar}`} aria-label="Components navigation">
        {groups.map(({ label, icon, iconClassName, href, slug: groupSlug, items }) => (
            <div key={label} className="vstack py-2">
                <strong className="d-flex align-items-center gap-1 fw-semibold">
                    <Icon name={icon} className={iconClassName} aria-hidden="true" />
                    <a
                        className="fg-body text-decoration-none"
                        href={`${basePath}/components/${href}`}
                        aria-current={active === groupSlug ? 'page' : undefined}
                    >
                        {label}
                    </a>
                </strong>
                <ul className="nav flex-column mt-1">
                    {items.map(({ label, slug }) => {
                        const current = active === slug;

                        return (
                            <li key={label} className="nav-item">
                                <a
                                    className={classNames('nav-link border-0', style.sidebarLink, {
                                        active: current
                                    })}
                                    href={`${basePath}/components/${slug}/`}
                                    aria-current={current ? 'page' : undefined}
                                >
                                    {label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        ))}
    </nav>
);
