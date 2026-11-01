import { FC, ReactNode } from 'react';

import { Icon } from '../../../source/Icon';
import { MenuItem } from '../../../source/Menu';
import { Navbar } from '../../../source/Navbar';
import { DropdownMenu } from '../DropdownMenu';

export type DocumentationLink = Record<'label' | 'href', string>;

export type DocumentationHeaderProps = Record<
    'links' | 'versions',
    readonly DocumentationLink[]
> & {
    version: string;
} & Partial<Record<'homeHref' | 'brand' | 'repositoryHref', string>> &
    Partial<Record<'search' | 'colorMode', ReactNode>>;

export const DocumentationHeader: FC<DocumentationHeaderProps> = ({
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
            className="d-flex flex-wrap align-items-center justify-content-between gap-5 px-7 py-4"
            aria-label="Main navigation"
        >
            <div className="d-flex align-items-center gap-5">
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
            <div className="d-flex align-items-center gap-5 ms-auto">
                <a
                    className="d-none lg:d-inline-flex fg-2"
                    href={repositoryHref}
                    aria-label="GitHub"
                >
                    <Icon name="github" aria-hidden="true" />
                </a>
                <DropdownMenu label={`v${version}`}>
                    {versions.map(({ href, label }) => (
                        <MenuItem key={label} href={href}>
                            {label}
                        </MenuItem>
                    ))}
                </DropdownMenu>
                {colorMode}
            </div>
        </Navbar>
    </header>
);
