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
Card.displayName = 'Card';

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
CardImage.displayName = 'CardImage';

export const CardSubtitle = polymorphic<ComponentPropsWithRef<'p'>>(
    ({ as: Root = 'p', className, ...props }) => (
        <Root {...props} className={classNames('card-subtitle', className)} />
    )
);
CardSubtitle.displayName = 'CardSubtitle';

export const CardGroup = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-group', className)} />
    )
);
CardGroup.displayName = 'CardGroup';

export const CardImageOverlay = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-img-overlay', className)} />
    )
);
CardImageOverlay.displayName = 'CardImageOverlay';

export const CardHeader = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-header', className)} />
    )
);
CardHeader.displayName = 'CardHeader';

export const CardBody = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-body', className)} />
    )
);
CardBody.displayName = 'CardBody';

export const CardFooter = polymorphic<ComponentPropsWithRef<'div'>>(
    ({ as: Root = 'div', className, ...props }) => (
        <Root {...props} className={classNames('card-footer', className)} />
    )
);
CardFooter.displayName = 'CardFooter';

export const CardTitle = polymorphic<ComponentPropsWithRef<'h4'>>(
    ({ as: Root = 'h4', className, ...props }) => (
        <Root {...props} className={classNames('card-title', className)} />
    )
);
CardTitle.displayName = 'CardTitle';

export const CardText = polymorphic<ComponentPropsWithRef<'p'>>(
    ({ as: Root = 'p', className, ...props }) => (
        <Root {...props} className={classNames('card-text', className)} />
    )
);
CardText.displayName = 'CardText';
