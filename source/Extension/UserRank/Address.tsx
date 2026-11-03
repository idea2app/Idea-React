import { FC } from 'react';

import { Icon } from '../Icon';

export type UserAddressProps = Partial<Record<'email' | 'website', string>>;

export const UserAddress: FC<UserAddressProps> = ({ email, website }) => (
    <address className="mb-0 d-flex justify-content-around gap-2">
        {email && (
            <a rel="noreferrer" target="_blank" href={'mailto:' + email}>
                <Icon name="envelope" />
            </a>
        )}
        {website && (
            <a rel="noreferrer" target="_blank" href={website}>
                <Icon name="globe2" />
            </a>
        )}
    </address>
);
