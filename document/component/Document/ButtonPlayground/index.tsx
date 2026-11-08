'use client';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ChangeEvent, Component } from 'react';

import { Button, ButtonProps, ComponentTheme } from '../../../../source/Base/Button';
import { ButtonGroup } from '../../../../source/Base/ButtonGroup';
import { ToggleButton } from '../../../../source/Base/ToggleButton';
import { Icon } from '../../../../source/Extension/Icon';
import { FormLabel, FormSelect } from '../../../../source/Form';
import { DocumentCodeExample } from '../Example';

const colors = [
    'primary',
    'accent',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'inverse'
] as const satisfies readonly ComponentTheme[];
const variants = ['styled', 'solid', 'outline', 'subtle', 'text'] as const;
const sizes = [
    { value: 'xs', label: 'Extra small' },
    { value: 'sm', label: 'Small' },
    { value: '', label: 'Medium' },
    { value: 'lg', label: 'Large' }
] as const;
const rounding = ['default', 'pill', 'square'] as const;

@observer
export class DocumentButtonPlayground extends Component {
    @observable accessor color: (typeof colors)[number] = 'primary';
    @observable accessor variant: (typeof variants)[number] = 'styled';
    @observable accessor size: (typeof sizes)[number]['value'] = '';
    @observable accessor rounded: (typeof rounding)[number] = 'default';

    @action
    handleChange = ({
        currentTarget: { name, value }
    }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (name) {
            case 'button-playground-color': {
                const color = colors.find(color => color === value);
                if (color) this.color = color;
                break;
            }
            case 'button-playground-style': {
                const variant = variants.find(variant => variant === value);
                if (variant) this.variant = variant;
                break;
            }
            case 'button-playground-size': {
                const size = sizes.find(size => size.value === value);
                if (size) this.size = size.value;
                break;
            }
            case 'button-playground-rounded': {
                const rounded = rounding.find(rounded => rounded === value);
                if (rounded) this.rounded = rounded;
                break;
            }
        }
    };

    renderColor = (color: (typeof colors)[number]) => (
        <option key={color} value={color}>
            {color[0].toUpperCase() + color.slice(1)}
        </option>
    );

    renderSize = ({ value, label }: (typeof sizes)[number]) => (
        <option key={value} value={value}>
            {label}
        </option>
    );

    renderVariant = (variant: (typeof variants)[number]) => (
        <ToggleButton
            key={variant}
            type="radio"
            name="button-playground-style"
            value={variant}
            variant="outline"
            theme="secondary"
            checked={this.variant === variant}
            onChange={this.handleChange}
        >
            {variant}
        </ToggleButton>
    );

    renderRounding = (rounded: (typeof rounding)[number]) => (
        <ToggleButton
            key={rounded}
            type="radio"
            name="button-playground-rounded"
            value={rounded}
            variant="outline"
            theme="secondary"
            checked={this.rounded === rounded}
            onChange={this.handleChange}
        >
            {rounded}
        </ToggleButton>
    );

    renderPreview = () => {
        const { color, variant, size, rounded } = this;
        const className =
            rounded === 'default' ? undefined : rounded === 'pill' ? 'rounded-pill' : 'rounded-0';
        const props: ButtonProps = {
            variant: variant === 'styled' ? 'solid' : variant,
            styled: variant === 'styled',
            theme: color,
            size: size || undefined,
            className
        };

        return (
            <div className="d-flex flex-wrap align-items-center gap-2">
                <Button {...props}>Button</Button>
                <Button {...props}>
                    <Icon name="arrow-left" aria-hidden="true" />
                    Left icon
                </Button>
                <Button {...props}>
                    Right icon
                    <Icon name="arrow-right" aria-hidden="true" />
                </Button>
                <Button {...props} aria-label="Icon only" icon>
                    <Icon name="plus-lg" aria-hidden="true" />
                </Button>
            </div>
        );
    };

    render() {
        return (
            <section aria-label="Button playground">
                <div className="bg-1 p-3 fs-sm rounded-3 d-flex flex-wrap gap-3">
                    <div>
                        <FormLabel htmlFor="button-playground-color" className="fw-semibold">
                            Color
                        </FormLabel>
                        <FormSelect
                            id="button-playground-color"
                            name="button-playground-color"
                            value={this.color}
                            onChange={this.handleChange}
                        >
                            {colors.map(this.renderColor)}
                        </FormSelect>
                    </div>
                    <fieldset className="border-0 p-0 m-0 min-w-0 max-w-100">
                        <legend className="fs-sm fw-semibold">Style</legend>
                        <div className="overflow-auto">
                            <ButtonGroup
                                size="sm"
                                aria-label="Button style"
                                className="text-capitalize"
                            >
                                {variants.map(this.renderVariant)}
                            </ButtonGroup>
                        </div>
                    </fieldset>
                    <div>
                        <FormLabel htmlFor="button-playground-size" className="fw-semibold">
                            Size
                        </FormLabel>
                        <FormSelect
                            id="button-playground-size"
                            name="button-playground-size"
                            value={this.size}
                            onChange={this.handleChange}
                        >
                            {sizes.map(this.renderSize)}
                        </FormSelect>
                    </div>
                    <fieldset className="border-0 p-0 m-0 min-w-0 max-w-100">
                        <legend className="fs-sm fw-semibold">Rounded</legend>
                        <div className="overflow-auto">
                            <ButtonGroup
                                size="sm"
                                aria-label="Button rounded"
                                className="text-capitalize"
                            >
                                {rounding.map(this.renderRounding)}
                            </ButtonGroup>
                        </div>
                    </fieldset>
                </div>

                <div className="mt-3 overflow-auto">
                    <DocumentCodeExample>{this.renderPreview()}</DocumentCodeExample>
                </div>
            </section>
        );
    }
}
