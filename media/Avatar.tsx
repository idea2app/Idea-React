import classNames from 'classnames';
import { FC, ImgHTMLAttributes } from 'react';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: number;
}

export const Avatar: FC<AvatarProps> = ({
    className,
    style,
    size = 3,
    ...props
}) => (
    <img
        className={classNames('object-fit-cover rounded-circle', className)}
        style={{
            width: `${size}rem`,
            height: `${size}rem`,
            ...style
        }}
        {...props}
    />
);

Avatar.displayName = 'Avatar';
