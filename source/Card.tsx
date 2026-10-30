import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export const Card: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('card', className)} />
);

export const CardBody: FC<ComponentPropsWithRef<'div'>> = ({ className, ...props }) => (
    <div {...props} className={classNames('card-body', className)} />
);

export const CardTitle: FC<ComponentPropsWithRef<'h3'>> = ({ className, ...props }) => (
    <h3 {...props} className={classNames('card-title', className)} />
);

export const CardText: FC<ComponentPropsWithRef<'p'>> = ({ className, ...props }) => (
    <p {...props} className={classNames('card-text', className)} />
);
