'use client';

import { FC } from 'react';

import { PageNav } from '../../../../source/PageNav';
import * as style from './style.module.less';

export const Toc: FC = () => (
    <div className={style.toc} aria-label="On this page">
        <strong className="d-block fw-semibold mb-2">On this page</strong>

        <PageNav rootSelector="#content" minDepth={2} depth={3} />
    </div>
);
