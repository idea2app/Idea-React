import classNames from 'classnames';
import { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react';

export type PlaceholderProps = PropsWithChildren<{
    width?: number | string;
    height?: number | string;
    background?: string;
    color?: string;
    title?: ReactNode | false;
    className?: string;
}>;

export const Placeholder: FC<PlaceholderProps> = ({
    width,
    height,
    background = 'var(--bs-secondary-color)',
    color = 'var(--bs-body-bg)',
    children = 'Placeholder',
    title,
    className
}) => {
    const style: CSSProperties = { width, height, backgroundColor: background, color };
    const label = title === false ? undefined : title || children || undefined;

    return (
        <div
            className={classNames('d-flex align-items-center justify-content-center', className)}
            style={style}
        >
            {label && <span>{label}</span>}
        </div>
    );
};

Placeholder.displayName = 'Placeholder';
