import { FC, PropsWithChildren } from 'react';

import nextConfig from '../../../next.config';
import { DocumentationLayout } from '../Components/Layout';

const pages = [
    ['Overview', ''],
    ['Field', 'field'],
    ['Form control', 'form-control'],
    ['Checkbox', 'checkbox'],
    ['Radio', 'radio'],
    ['Switch', 'switch'],
    ['Range', 'range'],
    ['Input group', 'input-group'],
    ['Floating labels', 'floating-labels'],
    ['Form adorn', 'form-adorn'],
    ['Chips', 'chips'],
    ['Combobox', 'combobox'],
    ['Datepicker', 'datepicker'],
    ['OTP input', 'otp-input'],
    ['Password strength', 'password-strength'],
    ['Layout', 'layout'],
    ['Validation', 'validation']
] as const;

export interface FormDocsLayoutProps extends PropsWithChildren {
    active: (typeof pages)[number][1];
}

export const FormDocsLayout: FC<FormDocsLayoutProps> = ({ active, children }) => (
    <DocumentationLayout active={active || 'forms'}>
        <nav className="nav nav-pills flex-wrap gap-1 mb-4" aria-label="Forms documentation">
            {pages.map(([label, slug]) => (
                <a
                    key={label}
                    className={active === slug ? 'nav-link active' : 'nav-link'}
                    href={`${nextConfig.basePath || ''}/forms/${slug ? `${slug}/` : ''}`}
                    aria-current={active === slug ? 'page' : undefined}
                >
                    {label}
                </a>
            ))}
        </nav>
        {children}
        <p className="small mt-5">
            Adapted from the{' '}
            <a
                href={`https://getbootstrap.com/docs/6.0/forms/${active ? `${active}/` : 'overview/'}`}
            >
                Bootstrap 6 Forms documentation
            </a>
            , licensed under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
        </p>
    </DocumentationLayout>
);
