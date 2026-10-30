import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ColSize = number | 'auto';

export interface ContainerProps extends ComponentPropsWithRef<'div'> {
    fluid?: boolean;
    breakpoint?: Breakpoint;
}

export const Container: FC<ContainerProps> = ({ fluid, breakpoint, className, ...props }) => (
    <div
        {...props}
        className={classNames(
            breakpoint ? `${breakpoint}:container` : fluid ? 'container-fluid' : 'container',
            className
        )}
    />
);

export const Row: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('row', className)} />
);

export interface ColProps extends ComponentPropsWithRef<'div'> {
    span?: ColSize;
    sm?: ColSize;
    md?: ColSize;
    lg?: ColSize;
    xl?: ColSize;
    '2xl'?: ColSize;
}

export const Col: FC<ColProps> = ({ span, sm, md, lg, xl, '2xl': xxl, className, ...props }) => {
    const sizes: [Breakpoint, ColSize | undefined][] = [
        ['sm', sm],
        ['md', md],
        ['lg', lg],
        ['xl', xl],
        ['2xl', xxl]
    ];
    const sized = sizes.some(([, size]) => size !== undefined);

    return (
        <div
            {...props}
            className={classNames(
                !span && !sized && 'col',
                span !== undefined && `col-${span}`,
                sizes.map(
                    ([breakpoint, size]) => size !== undefined && `${breakpoint}:col-${size}`
                ),
                className
            )}
        />
    );
};
