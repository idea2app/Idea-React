import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

export type ExampleLayoutProps = PropsWithChildren<
    Record<'title', string> & { className?: string; styleText?: string }
>;

export const ExampleLayout: FC<ExampleLayoutProps> = ({
    title,
    className,
    styleText,
    children
}) => (
    <main id="content" className={classNames(className)}>
        {styleText && <style>{styleText}</style>}
        <h1 className="visually-hidden">{title} examples</h1>
        {children}
    </main>
);

ExampleLayout.displayName = 'ExampleLayout';
