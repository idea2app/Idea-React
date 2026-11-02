'use client';

import type Chips from 'bootstrap/js/src/chips.js';
import classNames from 'classnames';
import { ComponentPropsWithoutRef, ComponentPropsWithRef, FC, forwardRef, Ref } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ComponentTheme } from '../Button';
import { Icon, IconProps } from '../Icon';
import { FormPlugin } from './Plugin';
import { FormValidationProps } from './Primitives';

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

export type ChipInputProps = ComponentPropsWithoutRef<'div'> &
    FormValidationProps & {
        theme?: ComponentTheme;
        separator?: string | null;
        allowDuplicates?: boolean;
        maxChips?: number | null;
        createOnBlur?: boolean;
        dismissible?: boolean;
        placeholder?: string;
        onValuesChange?: (values: string[]) => unknown;
    };

interface ChipInputComponentProps extends ChipInputProps {
    forwardedRef?: Ref<HTMLDivElement>;
}

class ChipInputComponent extends FormPlugin<ChipInputComponentProps, Pick<Chips, 'dispose'>> {
    protected configurationChanged = (previous: ChipInputComponentProps) =>
        previous.separator !== this.props.separator ||
        previous.allowDuplicates !== this.props.allowDuplicates ||
        previous.maxChips !== this.props.maxChips ||
        previous.createOnBlur !== this.props.createOnBlur ||
        previous.dismissible !== this.props.dismissible ||
        previous.placeholder !== this.props.placeholder;

    protected load = async () => {
        const [{ default: Plugin }, { default: EventHandler }] = await Promise.all([
            import('bootstrap/js/src/chips.js'),
            import('bootstrap/js/src/dom/event-handler.js')
        ]);
        const {
            separator = ',',
            allowDuplicates = false,
            maxChips = null,
            createOnBlur = true,
            dismissible = true,
            placeholder = ''
        } = this.props;

        return (element: HTMLDivElement) => {
            const instance = Plugin.getOrCreateInstance(element, {
                separator,
                allowDuplicates,
                maxChips,
                createOnBlur,
                dismissible,
                placeholder,
                dismissIcon: renderToStaticMarkup(<Icon name="x-lg" aria-hidden="true" />)
            });
            element.addEventListener('change.bs.chips', this.handleValuesChange);

            return {
                dispose: () => {
                    element.removeEventListener('change.bs.chips', this.handleValuesChange);
                    EventHandler.off(element, '.bs.chips');
                    instance.dispose();
                }
            };
        };
    };

    private handleValuesChange = (event: Event) =>
        this.props.onValuesChange?.((event as Event & { values: string[] }).values);

    private setRef = (element: HTMLDivElement | null) => {
        this.element.current = element;
        const { forwardedRef } = this.props;

        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
    };

    render() {
        const {
            className,
            theme,
            separator,
            allowDuplicates,
            maxChips,
            createOnBlur,
            dismissible: _dismissible,
            placeholder: _placeholder,
            onValuesChange: _onValuesChange,
            forwardedRef: _forwardedRef,
            validation,
            ...props
        } = this.props;

        return (
            <div
                {...props}
                ref={this.setRef}
                className={classNames(
                    'chip-input',
                    theme && `theme-${theme}`,
                    validation && `is-${validation}`,
                    className
                )}
                data-bs-chips=""
                data-bs-separator={separator}
                data-bs-allow-duplicates={allowDuplicates}
                data-bs-max-chips={maxChips}
                data-bs-create-on-blur={createOnBlur}
            />
        );
    }
}

export const ChipInput = forwardRef<HTMLDivElement, ChipInputProps>((props, forwardedRef) => (
    <ChipInputComponent {...props} forwardedRef={forwardedRef} />
));

ChipInput.displayName = 'ChipInput';
