import { ComponentPropsWithRef, FC } from 'react';

import { Icon } from '../../../../source/Extension/Icon';

export type CheatsheetSectionProps = ComponentPropsWithRef<'article'> & {
    id: string;
    title: string;
    documentationPath: string;
};

const documentationRoot = 'https://getbootstrap.com/docs/6.0/';

export const CheatsheetSection: FC<CheatsheetSectionProps> = ({
    title,
    documentationPath,
    className = 'my-3',
    children,
    ...props
}) => (
    <article className={className} {...props}>
        <div className="bd-heading xl:sticky-top align-self-start mt-5 mb-3 xl:mt-0 xl:mb-2">
            <h3>{title}</h3>
            <a className="d-flex align-items-center" href={documentationRoot + documentationPath}>
                <Icon name="journal-code" className="me-1 fg-2" />
                Documentation
            </a>
        </div>
        <div>{children}</div>
    </article>
);

CheatsheetSection.displayName = 'CheatsheetSection';
