import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import { ComponentTheme } from './Button';

export interface CardProps extends ComponentPropsWithRef<'div'> {
    row?: boolean;
    body?: boolean;
    theme?: ComponentTheme;
    subtle?: boolean;
    translucent?: boolean;
}

export const Card: FC<CardProps> = ({
    row,
    body,
    theme,
    subtle,
    translucent,
    className,
    ...props
}) => (
    <div
        {...props}
        className={classNames(
            'card',
            {
                'card-row': row,
                'card-body': body,
                'card-subtle': subtle,
                'card-translucent': translucent
            },
            theme && `theme-${theme}`,
            className
        )}
    />
);

export interface CardImageProps extends ComponentPropsWithRef<'img'> {
    placement?: 'top' | 'bottom' | 'start' | 'end';
}

export const CardImage: FC<CardImageProps> = ({ placement, className, ...props }) => (
    <img
        {...props}
        className={classNames(placement ? `card-img-${placement}` : 'card-img', className)}
    />
);

export const CardSubtitle: FC<ComponentPropsWithRef<'p'>> = ({ className, ...props }) => (
    <p {...props} className={classNames('card-subtitle', className)} />
);

export const CardGroup: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('card-group', className)} />
);

export const CardImageOverlay: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('card-img-overlay', className)} />
);

export const CardHeader: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('card-header', className)} />
);

export const CardBody: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('card-body', className)} />
);

export const CardFooter: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('card-footer', className)} />
);

export interface CardTitleProps extends ComponentPropsWithRef<'h4'> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: FC<CardTitleProps> = ({ as: Tag = 'h4', className, ...props }) => (
    <Tag {...props} className={classNames('card-title', className)} />
);

export const CardText: FC<ComponentPropsWithRef<'p'>> = ({ className, ...props }) => (
    <p {...props} className={classNames('card-text', className)} />
);

Card.displayName = 'Card';
CardImage.displayName = 'CardImage';
CardSubtitle.displayName = 'CardSubtitle';
CardGroup.displayName = 'CardGroup';
CardImageOverlay.displayName = 'CardImageOverlay';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardText.displayName = 'CardText';
