import React, { FC, PropsWithoutRef } from 'react';

import { Avatar } from './Avatar';

export type NameplateProps = PropsWithoutRef<{ avatar: string; name: string }>;

export const Nameplate: FC<NameplateProps> = ({ avatar, name }) => (
    <>
        <Avatar size={2} style={{ marginRight: '0.5rem' }} src={avatar} />

        <span className="align-middle">{name}</span>
    </>
);

Nameplate.displayName = 'Nameplate';
