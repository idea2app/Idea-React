import { ComponentPropsWithRef, ElementType } from 'react';

import { polymorphic } from '../../Helper/Polymorphic';
import { TypeEchoContent } from './Content';

export interface TypeEchoProps extends ComponentPropsWithRef<'pre'> {
    text: string;
    intervals?: number;
}

export const TypeEcho = polymorphic<TypeEchoProps>(
    ({ as: RootAs, text, intervals, ref, ...props }) => (
        <TypeEchoContent<ElementType>
            as={RootAs}
            {...props}
            rootRef={ref}
            text={text}
            intervals={intervals}
        />
    )
);
TypeEcho.displayName = 'TypeEcho';
