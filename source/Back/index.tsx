import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';

import { Icon } from '../Icon';
import styles from './index.module.less';

export type BackProps = PropsWithChildren<{
    className?: string;
    onClick?: Function;
}>;

export function Back({ className, onClick, children }: BackProps) {
    return (
        <div
            className={classnames(
                'd-flex align-items-center',
                'd-print-none',
                styles.back,
                className
            )}
            onClick={() => {
                history.back();
                onClick?.();
            }}
        >
            <Icon name="arrow-bar-left" className="text-primary" size={1.5} />

            <span className="h6 m-0 ml-1">{children}</span>
        </div>
    );
}
