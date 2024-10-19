import { FC, HTMLAttributes } from 'react';
import { Spinner } from 'react-bootstrap';

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
        <Spinner animation="border" variant="success" />

        <span className="ml-3 text-white">{children}</span>
    </div>
);

Loading.displayName = 'Loading';
