import classNames from 'classnames';
import { CSSProperties, FC, ReactNode } from 'react';

export type PlaceholderProps = {
    width?: number | string;
    height?: number | string;
    background?: string;
    color?: string;
    text?: ReactNode | false;
    title?: ReactNode | false;
    className?: string;
};

export const Placeholder: FC<PlaceholderProps> = ({
    width,
    height,
    background = 'var(--bs-secondary-color)',
    color = 'var(--bs-body-bg)',
    text = 'Placeholder',
    title,
    className
}) => {
    const style: CSSProperties = { width, height, backgroundColor: background, color };
    const label = title === false ? undefined : title || text || undefined;

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
