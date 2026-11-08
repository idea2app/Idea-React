import classNames from 'classnames';
import { FC } from 'react';

import { Stack } from '../../../source/Base/Stack';
import { Icon } from '../../../source/Extension/Icon';
import nextConfig from '../../next.config.ts';
import * as style from './style.module.less';

type NavLink = Record<'label' | 'slug', string> & { heading?: string };
type NavGroup = Record<
    'label' | 'icon' | 'iconClassName' | 'href' | 'itemHref' | 'slug',
    string
> & {
    items: readonly NavLink[];
};

const components: NavLink[] = [
    { label: 'Accordion', slug: 'accordion' },
    { label: 'Alert', slug: 'alert' },
    { label: 'Avatar', slug: 'avatar' },
    { label: 'Badge', slug: 'badge', heading: 'Badges' },
    { label: 'Breadcrumb', slug: 'breadcrumb' },
    { label: 'Button', slug: 'button' },
    { label: 'Button group', slug: 'button-group' },
    { label: 'Card', slug: 'card', heading: 'Cards' },
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
    { label: 'Popover', slug: 'popover' },
    { label: 'Progress', slug: 'progress' },
    { label: 'Scrollspy', slug: 'scrollspy' },
    { label: 'Spinner', slug: 'spinner', heading: 'Spinners' },
    { label: 'Stepper', slug: 'stepper' },
    { label: 'Tab', slug: 'tab' },
    { label: 'Toasts', slug: 'toasts' },
    { label: 'Toggler', slug: 'toggler' },
    { label: 'Tooltip', slug: 'tooltip', heading: 'Tooltips' }
];
const extensions: NavLink[] = [
    { label: 'Click boundary', slug: 'click-boundary' },
    { label: 'Code block', slug: 'code-block' },
    { label: 'Countdown', slug: 'countdown' },
    { label: 'Dialog model', slug: 'dialog-model' },
    { label: 'Editor', slug: 'editor' },
    { label: 'Markdown view', slug: 'markdown-view' },
    { label: 'Horizontal marquee', slug: 'horizontal-marquee' },
    { label: 'Icon', slug: 'icon' },
    { label: 'Live TSX', slug: 'live-tsx' },
    { label: 'Loading', slug: 'loading' },
    { label: 'Month calendar', slug: 'month-calendar' },
    { label: 'Nameplate', slug: 'nameplate' },
    { label: 'Overlay box', slug: 'overlay-box' },
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
const forms: NavLink[] = [
    { label: 'Overview', slug: '' },
    { label: 'Field', slug: 'field' },
    { label: 'Form control', slug: 'form-control', heading: 'Form controls' },
    { label: 'Checkbox', slug: 'checkbox' },
    { label: 'Chips', slug: 'chips' },
    { label: 'Radio', slug: 'radio' },
    { label: 'Switch', slug: 'switch' },
    { label: 'Range', slug: 'range' },
    { label: 'Input group', slug: 'input-group' },
    { label: 'Floating labels', slug: 'floating-labels' },
    { label: 'Form adorn', slug: 'form-adorn' },
    { label: 'Combobox', slug: 'combobox' },
    { label: 'Datepicker', slug: 'datepicker' },
    { label: 'OTP input', slug: 'otp-input' },
    { label: 'Password strength', slug: 'password-strength' },
    { label: 'Layout', slug: 'layout' },
    { label: 'Validation', slug: 'validation' }
];
const guides: NavLink[] = [
    { label: 'Install', slug: 'install' },
    { label: 'Parcel', slug: 'parcel' },
    { label: 'Vite', slug: 'vite' },
    { label: 'Webpack', slug: 'webpack' },
    { label: 'ViNext', slug: 'next' }
];
export const documentGroups: NavGroup[] = [
    {
        label: 'Guides',
        icon: 'rocket-takeoff',
        iconClassName: 'fg-accent',
        href: 'guides/',
        itemHref: 'guides/',
        slug: 'guides',
        items: guides
    },
    {
        label: 'Components',
        icon: 'menu-button-wide-fill',
        iconClassName: 'fg-info',
        href: 'components/',
        itemHref: 'components/',
        slug: 'components',
        items: components
    },
    {
        label: 'Layout',
        icon: 'grid',
        iconClassName: 'fg-info',
        href: 'layout/grid/',
        itemHref: 'layout/',
        slug: 'layout',
        items: [{ label: 'Grid', slug: 'grid', heading: 'Grid system' }]
    },
    {
        label: 'Content',
        icon: 'body-text',
        iconClassName: 'fg-info',
        href: 'content/images/',
        itemHref: 'content/',
        slug: 'content',
        items: [
            { label: 'Images', slug: 'images' },
            { label: 'Tables', slug: 'tables' }
        ]
    },
    {
        label: 'Forms',
        icon: 'ui-checks',
        iconClassName: 'fg-primary',
        href: 'forms/',
        itemHref: 'forms/',
        slug: 'forms',
        items: forms
    },
    {
        label: 'Extensions',
        icon: 'puzzle-fill',
        iconClassName: 'fg-accent',
        href: 'extensions/',
        itemHref: 'extensions/',
        slug: 'extensions',
        items: extensions
    }
];
const basePath = nextConfig.basePath || '';

export interface DocumentSidebarProps {
    active?: string;
}

export const DocumentSidebar: FC<DocumentSidebarProps> = ({ active }) => (
    <nav
        className={`d-flex flex-column pb-3 ${style.sidebar}`}
        aria-label="Documentation navigation"
    >
        {documentGroups.map(
            ({ label, icon, iconClassName, href, itemHref, slug: groupSlug, items }) => (
                <Stack key={label} className="py-2">
                    <strong className="d-flex align-items-center gap-1 fw-semibold">
                        <Icon name={icon} className={iconClassName} aria-hidden="true" />
                        <a
                            className="fg-body text-decoration-none"
                            href={`${basePath}/${href}`}
                            aria-current={active === groupSlug ? 'page' : undefined}
                        >
                            {label}
                        </a>
                    </strong>
                    <ul className="nav flex-column mt-1">
                        {items.map(({ label, slug }) => {
                            const current = active === slug || (active === groupSlug && !slug);

                            return (
                                <li key={label} className="nav-item">
                                    <a
                                        className={classNames(
                                            'nav-link border-0',
                                            style.sidebarLink,
                                            {
                                                active: current
                                            }
                                        )}
                                        href={`${basePath}/${itemHref}${slug ? `${slug}/` : ''}`}
                                        aria-current={current ? 'page' : undefined}
                                    >
                                        {label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </Stack>
            )
        )}
    </nav>
);
