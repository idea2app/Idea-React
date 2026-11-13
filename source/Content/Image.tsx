import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export interface ImageProps extends ComponentPropsWithRef<'img'> {
    fluid?: boolean;
    thumbnail?: boolean;
    rounded?: boolean;
    roundedCircle?: boolean;
}

export const Image = polymorphic<ImageProps>(
    ({ as: Root = 'img', fluid, thumbnail, rounded, roundedCircle, className, ...props }) => (
        <Root
            {...props}
            className={classNames(
                {
                    'img-fluid': fluid,
                    'img-thumbnail': thumbnail,
                    rounded,
                    'rounded-circle': roundedCircle
                },
                className
            )}
        />
    )
);
Image.displayName = 'Image';
