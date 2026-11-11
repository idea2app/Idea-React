import { FC } from 'react';

import {
    Card,
    CardBody,
    CardImage,
    CardProps,
    CardText,
    CardTitle
} from '../../../../source/Base/Card';
import { Placeholder } from '../../../component/Examples/Placeholder';

export interface MasonryCardProps extends Omit<CardProps, 'body'> {
    imageHeight?: number;
    imageLabel?: string;
    description?: string;
    updated?: boolean;
    quote?: boolean;
    figureClassName?: string;
    captionClassName?: string;
}

export const MasonryCard: FC<MasonryCardProps> = ({
    imageHeight,
    imageLabel,
    title,
    description,
    updated,
    quote,
    figureClassName = 'mb-0',
    captionClassName = 'fg-2',
    ...props
}) => {
    const content = title && (
        <>
            <CardTitle as="h5">{title}</CardTitle>
            <CardText>{description}</CardText>
            {updated && (
                <CardText>
                    <small className="fg-2">Last updated 3 mins ago</small>
                </CardText>
            )}
        </>
    );

    return (
        <Card {...props}>
            {imageHeight && (
                <CardImage
                    as={Placeholder}
                    width="100%"
                    height={imageHeight}
                    placement={title ? 'top' : undefined}
                >
                    {imageLabel}
                </CardImage>
            )}
            {quote ? (
                <figure className={figureClassName}>
                    <blockquote className="blockquote">
                        <p>A well-known quote, contained in a blockquote element.</p>
                    </blockquote>
                    <figcaption className={`blockquote-footer mb-0 ${captionClassName}`}>
                        Someone famous in <cite title="Source Title">Source Title</cite>
                    </figcaption>
                </figure>
            ) : (
                content && <CardBody>{content}</CardBody>
            )}
        </Card>
    );
};
MasonryCard.displayName = 'MasonryCard';
