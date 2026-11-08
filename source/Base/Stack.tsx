import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from '../Helper/Polymorphic';

export type StackDirection = 'horizontal' | 'vertical';

export interface StackProps extends ComponentPropsWithRef<'div'> {
    direction?: StackDirection;
    gap?: number;
}

export const Stack = polymorphic<StackProps>(
    ({ as: Root = 'div', direction = 'vertical', gap, className, ...props }) => (
        <Root
            {...props}
            className={classNames(
                direction === 'horizontal' ? 'hstack' : 'vstack',
                gap !== undefined && `gap-${gap}`,
                className
            )}
        />
    )
);
Stack.displayName = 'Stack';
