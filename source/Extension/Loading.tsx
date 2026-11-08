import { HTMLAttributes } from 'react';

import { Spinner } from '../Base/Spinner';
import { polymorphic } from '../Helper/Polymorphic';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
    opacity?: number;
}

export const Loading = polymorphic<LoadingProps>(
    ({
        as: Root = 'div',
        className = '',
        children = 'Loading...',
        opacity = 25,
        style,
        ...props
    }) => (
        <Root
            className={`fixed-top h-100 w-100 d-flex justify-content-center align-items-center bg-black ${className}`}
            style={{ ...style, opacity: opacity / 100 }}
            {...props}
        >
            <Spinner theme="success" />

            <span className="ms-3 fg-white">{children}</span>
        </Root>
    )
);
Loading.displayName = 'Loading';
