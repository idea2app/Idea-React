import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from './Polymorphic';

export interface ImageProps extends ComponentPropsWithRef<'img'> {
    fluid?: boolean;
    thumbnail?: boolean;
}

export const Image = polymorphic<ImageProps>(
    ({ as: Root = 'img', fluid, thumbnail, className, ...props }) => (
        <Root
            {...props}
            className={classNames({ 'img-fluid': fluid, 'img-thumbnail': thumbnail }, className)}
        />
    )
);
Image.displayName = 'Image';
