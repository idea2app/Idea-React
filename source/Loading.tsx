import { FC, HTMLAttributes } from 'react';

import { Spinner } from './Spinner';

export type LoadingProps = HTMLAttributes<HTMLDivElement>;

export const Loading: FC<LoadingProps> = ({
    className = '',
    children = 'Loading...',
    ...props
}) => (
    <div
        className={`fixed-top h-100 w-100 d-flex justify-content-center align-items-center opacity-25 bg-black ${className}`}
        {...props}
    >
        <Spinner theme="success" />

        <span className="ms-3 fg-white">{children}</span>
    </div>
);

Loading.displayName = 'Loading';
