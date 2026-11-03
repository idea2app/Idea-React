import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { ComponentTheme } from './Button';
import { polymorphic } from './Polymorphic';

export interface CardProps extends ComponentPropsWithRef<'div'> {
    row?: boolean;
    body?: boolean;
    theme?: ComponentTheme;
    subtle?: boolean;
    translucent?: boolean;
}

export const Card = polymorphic<CardProps>(
    ({ as: Root = 'div', row, body, theme, subtle, translucent, className, ...props }) => (
        <Root
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
    )
);

export interface CardImageProps extends ComponentPropsWithRef<'img'> {
    placement?: 'top' | 'bottom' | 'start' | 'end';
}

export const CardImage = polymorphic<CardImageProps>(
    ({ as: Root = 'img', placement, className, ...props }) => (
        <Root
            {...props}
            className={classNames(placement ? `card-img-${placement}` : 'card-img', className)}
        />
    )
);

export const CardSubtitle = polymorphic<ComponentPropsWithRef<'p'>>(
    ({ as: Root = 'p', className, ...props }) => (
        <Root {...props} className={classNames('card-subtitle', className)} />
    )
);

export const CardGroup = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-group', className)} />
    )
);

export const CardImageOverlay = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-img-overlay', className)} />
    )
);

export const CardHeader = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-header', className)} />
    )
);

export const CardBody = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-body', className)} />
    )
);

export const CardFooter = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-footer', className)} />
    )
);

export const CardTitle = polymorphic<ComponentPropsWithRef<'h4'>>(
    ({ as: Root = 'h4', className, ...props }) => (
        <Root {...props} className={classNames('card-title', className)} />
    )
);

export const CardText = polymorphic<ComponentPropsWithRef<'p'>>(
    ({ as: Root = 'p', className, ...props }) => (
        <Root {...props} className={classNames('card-text', className)} />
    )
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
