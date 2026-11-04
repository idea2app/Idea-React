import classNames from 'classnames';
import { ComponentPropsWithRef } from 'react';

import { ComponentTheme } from '../Button';
import { Icon, IconProps } from '../Extension/Icon';
import { polymorphic } from '../Polymorphic';

export type ChipProps = ComponentPropsWithRef<'button'> & {
    active?: boolean;
    theme?: ComponentTheme;
};

export const Chip = polymorphic<ChipProps>(
    ({ as: Root = 'button', className, active, theme, ...props }) => (
        <Root
            {...props}
            className={classNames('chip', { active }, theme && `theme-${theme}`, className)}
            type="button"
            aria-pressed={active}
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
            {children ?? <Icon name="x-lg" aria-hidden="true" />}
        </Root>
    )
);
ChipDismiss.displayName = 'ChipDismiss';

export type ChipTokenProps = ComponentPropsWithRef<'span'> & Pick<ChipProps, 'active' | 'theme'>;

export const ChipToken = polymorphic<ChipTokenProps>(
    ({ as: Root = 'span', className, active, theme, ...props }) => (
        <Root
            {...props}
            tabIndex={props.tabIndex ?? 0}
            className={classNames('chip', { active }, theme && `theme-${theme}`, className)}
        />
    )
);
ChipToken.displayName = 'ChipToken';

export const ChipInputLabel = polymorphic<ComponentPropsWithRef<'label'>>(
    ({ as: Root = 'label', className, ...props }) => (
        <Root {...props} className={classNames('chip-input-label', className)} />
    )
);
ChipInputLabel.displayName = 'ChipInputLabel';
