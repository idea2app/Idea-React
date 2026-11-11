import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { ComponentTheme } from '../Base/Button';
import { Icon, IconProps } from '../Extension/Icon';
import { polymorphic } from '../Helper/Polymorphic';

export type ChipProps = ComponentPropsWithRef<'span'> & {
    active?: boolean;
    theme?: ComponentTheme;
    type?: ComponentPropsWithRef<'button'>['type'];
};

export const Chip = polymorphic<ChipProps>(
    ({ as: Root = 'span', className, active, theme, type = 'button', ...props }) => (
        <Root
            {...props}
            className={classNames('chip', { active }, theme && `theme-${theme}`, className)}
            type={Root === 'button' ? type : undefined}
            aria-pressed={Root === 'button' ? active : undefined}
        />
    )
);
Chip.displayName = 'Chip';

export const ChipIcon = polymorphic<IconProps>(({ as: RootAs, className, ...props }) => (
    <Icon as={RootAs} {...props} className={classNames('chip-icon', className)} />
));

ChipIcon.displayName = 'ChipIcon';

export const ChipImage = polymorphic<ComponentPropsWithRef<'img'>>(
    ({ as: Root = 'img', className, alt = '', ...props }) => (
        <Root {...props} alt={alt} className={classNames('chip-img', className)} />
    )
);

ChipImage.displayName = 'ChipImage';

export const ChipDismiss = polymorphic<ComponentPropsWithRef<'button'>>(
    ({ as: Root = 'button', className, children, 'aria-label': label = 'Remove', ...props }) => (
        <Root
            {...props}
            type="button"
            aria-label={label}
            className={classNames('chip-dismiss', className)}
        >
            {children ?? <Icon name="x-lg" />}
        </Root>
    )
);
ChipDismiss.displayName = 'ChipDismiss';
