import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

export interface ImageProps extends ComponentPropsWithRef<'img'> {
    fluid?: boolean;
    thumbnail?: boolean;
}

export const Image: FC<ImageProps> = ({ fluid, thumbnail, className, ...props }) => (
    <img
        {...props}
        className={classNames({ 'img-fluid': fluid, 'img-thumbnail': thumbnail }, className)}
    />
);

Image.displayName = 'Image';
