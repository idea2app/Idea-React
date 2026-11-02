import { FC, HTMLAttributes } from 'react';

import { Spinner } from '../Spinner';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
    opaque?: boolean;
}

export const Loading: FC<LoadingProps> = ({
    className = '',
    children = 'Loading...',
    opaque = false,
    ...props
}) => (
    <div
        className={`fixed-top h-100 w-100 d-flex justify-content-center align-items-center ${opaque ? 'opacity-100' : 'opacity-25'} bg-black ${className}`}
        {...props}
    >
        <Spinner theme="success" />

        <span className="ms-3 fg-white">{children}</span>
    </div>
);

Loading.displayName = 'Loading';
