'use client';

import { FC } from 'react';

import * as IdeaReact from '../../../../source';
import { LiveTSX } from '../../../../source/LiveTSX';

export const LiveRunner: FC<{ code: string }> = ({ code }) => (
    <LiveTSX scope={IdeaReact}>{code}</LiveTSX>
);
