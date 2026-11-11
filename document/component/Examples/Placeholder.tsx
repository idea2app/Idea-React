import classNames from 'classnames';
import { Children, FC, isValidElement, PropsWithChildren, ReactNode } from 'react';

export type PlaceholderProps = PropsWithChildren<{
    title?: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    background?: string;
    color?: string;
}>;

const getTextContent = (node: ReactNode): string =>
    Children.toArray(node)
        .map(child =>
            typeof child === 'string' || typeof child === 'number'
                ? String(child)
                : isValidElement<PropsWithChildren>(child)
                  ? getTextContent(child.props.children)
                  : ''
        )
        .join('');

export const Placeholder: FC<PlaceholderProps> = ({
    title,
    className,
    width,
    height,
    background = 'var(--bs-bg-2)',
    color = 'var(--bs-fg-4)',
    children
}) => {
    const placeholderWidth = width ?? 300;
    const placeholderHeight = height ?? 150;
    const hasTitle = title !== undefined;
    const childText = getTextContent(children);
    const hasNumericWidth =
        typeof placeholderWidth === 'number' || /^\d+(?:\.\d+)?$/.test(String(placeholderWidth));
    const label =
        childText ||
        (!hasTitle && hasNumericWidth ? `${placeholderWidth}x${placeholderHeight}` : undefined);
    const accessibleLabel = hasTitle
        ? `${title}: ${placeholderWidth}x${placeholderHeight}`
        : label
          ? `Placeholder: ${label}`
          : undefined;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classNames('bd-placeholder-img', className)}
            width={placeholderWidth}
            height={placeholderHeight}
            preserveAspectRatio="xMidYMid slice"
            role={accessibleLabel ? 'img' : undefined}
            aria-label={accessibleLabel}
            aria-hidden={accessibleLabel ? undefined : true}
        >
            <title>Placeholder</title>

            <rect width="100%" height="100%" fill={background} />
            {label && (
                <text x="50%" y="50%" fill={color} textAnchor="middle" dy=".3em">
                    {label}
                </text>
            )}
        </svg>
    );
};
Placeholder.displayName = 'Placeholder';
