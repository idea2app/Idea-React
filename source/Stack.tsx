import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { polymorphic } from './Polymorphic';

export type StackDirection = 'horizontal' | 'vertical';

export interface StackProps extends ComponentPropsWithRef<'div'> {
    direction?: StackDirection;
}

export const Stack = polymorphic<StackProps>(
    ({ as: Root = 'div', direction = 'vertical', className, ...props }) => (
        <Root
            {...props}
            className={classNames(direction === 'horizontal' ? 'hstack' : 'vstack', className)}
        />
    )
);

Stack.displayName = 'Stack';
