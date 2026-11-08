import classNames from 'classnames';
import { FC } from 'react';

import { Image } from '../../../../source/Content/Images';
import styles from './style.module.css';

export interface DocumentCarouselImageProps {
    children: string;
    width?: number;
    height?: number;
    color?: string;
    background?: string;
    large?: boolean;
    rounded?: boolean;
}

export const DocumentCarouselImage: FC<DocumentCarouselImageProps> = ({
    children,
    width = 800,
    height = 400,
    color = '#555',
    background = '#777',
    large = true,
    rounded
}) => (
    <Image
        as="svg"
        xmlns="http://www.w3.org/2000/svg"
        className={classNames('d-block w-100', styles.placeholder, {
            [styles.large]: large,
            'rounded-5': rounded
        })}
        width={width}
        height={height}
        role="img"
        aria-label={`Placeholder: ${children}`}
        preserveAspectRatio="xMidYMid slice"
    >
        <title>Placeholder</title>
        <rect width="100%" height="100%" fill={background} />
        <text x="50%" y="50%" fill={color} dy=".3em">
            {children}
        </text>
    </Image>
);
