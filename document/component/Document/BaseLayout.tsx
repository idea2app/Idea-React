import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

import styles from './BaseLayout.module.less';

export type BaseLayoutProps = PropsWithChildren<{
    title?: string;
    className?: string;
}>;

export const BaseLayout: FC<BaseLayoutProps> = ({ title, className = '', children }) => (
    <>
        <link
            rel="stylesheet"
            href="https://unpkg.com/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css"
        />
        <link
            rel="stylesheet"
            href="https://unpkg.com/bootstrap-icons@1.13.2/font/bootstrap-icons.css"
        />
        {title ? (
            <main
                id="content"
                className={classNames(styles.layout, className)}
                data-example-layout="true"
            >
                <h1 className="visually-hidden">{title} examples</h1>
                {children}
            </main>
        ) : (
            children
        )}
    </>
);

BaseLayout.displayName = 'BaseLayout';
