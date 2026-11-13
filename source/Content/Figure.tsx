import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';
import { Image, ImageProps } from './Image';

export type FigureProps = ComponentPropsWithRef<'figure'>;

export const Figure = polymorphic<FigureProps>(({ as: Root = 'figure', className, ...props }) => (
    <Root {...props} className={classNames('figure', className)} />
));
Figure.displayName = 'Figure';

export const FigureImage = polymorphic<ImageProps>(
    ({ as: Root = 'img', fluid = true, ...props }) => <Image as={Root} {...props} fluid={fluid} />
);
FigureImage.displayName = 'FigureImage';

export type FigureCaptionProps = ComponentPropsWithRef<'figcaption'>;

export const FigureCaption = polymorphic<FigureCaptionProps>(
    ({ as: Root = 'figcaption', className, ...props }) => (
        <Root {...props} className={classNames('figure-caption', className)} />
    )
);
FigureCaption.displayName = 'FigureCaption';
