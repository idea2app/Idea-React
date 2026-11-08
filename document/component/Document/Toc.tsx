'use client';

import { FC } from 'react';

import { PageNav, PageNavProps } from '../../../source/Extension/PageNav';
import * as style from './style.module.less';

export const Toc: FC<Pick<PageNavProps, 'onItemClick'>> = props => (
    <div className={style.toc}>
        <strong className="d-block fw-semibold mb-2">On this page</strong>

        <PageNav
            {...props}
            rootSelector="#content"
            minDepth={2}
            depth={3}
            aria-label="On this page"
        />
    </div>
);
