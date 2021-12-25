import type { PropsWithoutRef } from 'react';

import { Avatar } from './Avatar';

export type NameplateProps = PropsWithoutRef<{ avatar: string; name: string }>;

export function Nameplate({ avatar, name }: NameplateProps) {
    return (
        <>
            <Avatar size={2} style={{ marginRight: '0.5rem' }} src={avatar} />

            <span className="align-middle">{name}</span>
        </>
    );
}
