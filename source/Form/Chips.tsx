import classNames from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import { ComponentTheme } from '../Button';
import { Icon, IconProps } from '../Extension/Icon';

export type ChipProps = ComponentPropsWithRef<'button'> & {
    active?: boolean;
    theme?: ComponentTheme;
};

export const Chip: FC<ChipProps> = ({ className, active, theme, ...props }) => (
    <button
        {...props}
        className={classNames('chip', active && 'active', theme && `theme-${theme}`, className)}
        type="button"
        aria-pressed={active}
    />
);

Chip.displayName = 'Chip';

export const ChipIcon: FC<IconProps> = ({ className, ...props }) => (
    <Icon {...props} className={classNames('chip-icon', className)} />
);

ChipIcon.displayName = 'ChipIcon';

export const ChipImage: FC<ComponentPropsWithRef<'img'>> = ({ className, alt = '', ...props }) => (
    <img {...props} alt={alt} className={classNames('chip-img', className)} />
);

ChipImage.displayName = 'ChipImage';

export const ChipDismiss: FC<ComponentPropsWithRef<'button'>> = ({
    className,
    children,
    'aria-label': label = 'Remove',
    ...props
}) => (
    <button
        {...props}
        type="button"
        aria-label={label}
        className={classNames('chip-dismiss', className)}
    >
        {children ?? <Icon name="x-lg" aria-hidden="true" />}
    </button>
);

ChipDismiss.displayName = 'ChipDismiss';

export type ChipTokenProps = ComponentPropsWithRef<'span'> & Pick<ChipProps, 'active' | 'theme'>;

export const ChipToken: FC<ChipTokenProps> = ({ className, active, theme, ...props }) => (
    <span
        {...props}
        tabIndex={props.tabIndex ?? 0}
        className={classNames('chip', active && 'active', theme && `theme-${theme}`, className)}
    />
);

ChipToken.displayName = 'ChipToken';

export const ChipInputLabel: FC<ComponentPropsWithRef<'label'>> = ({ className, ...props }) => (
    <label {...props} className={classNames('chip-input-label', className)} />
);

ChipInputLabel.displayName = 'ChipInputLabel';
