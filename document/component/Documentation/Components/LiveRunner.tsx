'use client';

import { FC } from 'react';

import * as IdeaReact from '../../../../source';
import { LiveTSX } from '../../../../source/Extension/LiveTSX';

export const LiveRunner: FC<{ code: string }> = ({ code }) => (
    <LiveTSX scope={IdeaReact}>{code}</LiveTSX>
);
