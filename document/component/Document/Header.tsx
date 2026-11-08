import { FC, ReactNode } from 'react';

import { MenuItem } from '../../../source/Base/Menu';
import { Navbar } from '../../../source/Base/Navbar';
import { Icon } from '../../../source/Extension/Icon';
import { DropdownMenu } from '../DropdownMenu';

export type DocumentLink = Record<'label' | 'href', string>;

export type DocumentHeaderProps = Record<'links' | 'versions', readonly DocumentLink[]> & {
    version: string;
} & Partial<Record<'homeHref' | 'brand' | 'repositoryHref', string>> &
    Partial<Record<'search' | 'colorMode', ReactNode>>;

export const DocumentHeader: FC<DocumentHeaderProps> = ({
    links,
    versions,
    version,
    homeHref = './',
    search,
    colorMode,
    brand = 'Idea React',
    repositoryHref = 'https://github.com/idea2app/Idea-React'
}) => (
    <header className="sticky-top border-bottom bg-body">
        <a
            className="visually-hidden-focusable position-absolute top-0 start-0 bg-body p-4 z-fixed"
            href="#content"
        >
            Skip to main content
        </a>
        <Navbar
            expand="lg"
            className="d-flex flex-wrap lg:flex-nowrap align-items-center justify-content-between gap-5 px-7 py-4"
            aria-label="Main navigation"
        >
            <div className="d-flex align-items-center gap-5 flex-shrink-0">
                <a
                    className="navbar-brand d-inline-flex fg-accent"
                    href={homeHref}
                    aria-label={`${brand} home`}
                >
                    <Icon name="code-square" size={2} aria-hidden="true" />
                </a>
                <div className="navbar-nav d-none lg:d-flex flex-row align-items-center gap-5">
                    {links.map(({ href, label }) => (
                        <a key={label} className="nav-link" href={href}>
                            {label}
                        </a>
                    ))}
                </div>
                <div className="lg:d-none">
                    <DropdownMenu label="Home">
                        {links.map(({ href, label }) => (
                            <MenuItem key={label} href={href}>
                                {label}
                            </MenuItem>
                        ))}
                    </DropdownMenu>
                </div>
            </div>
            {search}
            <div className="d-flex align-items-center gap-5 ms-auto flex-shrink-0">
                <a className="d-inline-flex fg-2" href={repositoryHref} aria-label="GitHub">
                    <Icon name="github" aria-hidden="true" />
                </a>
                <DropdownMenu
                    label={`v${version.split('.').slice(0, 2).join('.')}`}
                    toggleProps={{ variant: 'link', className: 'nav-link px-1 gap-1' }}
                >
                    {versions.map(({ href, label }) => (
                        <MenuItem key={label} href={href}>
                            {label}
                        </MenuItem>
                    ))}
                </DropdownMenu>
                {colorMode}
                <span id="documentation-navigation-toggle" className="lg:d-none" />
            </div>
        </Navbar>
    </header>
);
