import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';

export type SectionProps = PropsWithChildren<{
    className?: string;
    title: string;
}>;

export function Section({ className, title, children }: SectionProps) {
    return (
        <section
            className={classNames(
                'border',
                'bg-white',
                'mt-3',
                'p-3',
                className
            )}
        >
            <h2 className="h3">{title}</h2>

            {children}
        </section>
    );
}

export function SubSection({ className, title, children }: SectionProps) {
    return (
        <>
            <h3 className={classNames('h5', className)}>{title}</h3>

            {children}
        </>
    );
}
