import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import {
    Stepper,
    StepperButton,
    StepperItem,
    StepperLink,
    StepperNav,
    StepperOverflow
} from '../source/Base/Stepper';

it('renders vertical and responsive horizontal steppers with rich themed items', () => {
    const { container, rerender } = render(
        <StepperOverflow>
            <Stepper horizontal="sm" className="w-100">
                <StepperItem theme="success" active>
                    Create account
                </StepperItem>
                <StepperItem aria-current="step">
                    <strong>Profile</strong>
                    <small>Complete your profile</small>
                </StepperItem>
            </Stepper>
        </StepperOverflow>
    );
    assert.equal(container.firstElementChild?.className, 'stepper-overflow');
    assert.equal(screen.getByRole('list').className, 'stepper sm:stepper-horizontal w-100');
    assert.equal(screen.getAllByRole('listitem')[0].className, 'stepper-item active theme-success');
    assert.equal(screen.getAllByRole('listitem')[1].getAttribute('aria-current'), 'step');

    rerender(
        <StepperNav aria-label="Checkout" horizontal>
            <StepperLink href="/cart" active>
                Cart
            </StepperLink>
        </StepperNav>
    );
    assert.equal(screen.getByRole('navigation').className, 'stepper stepper-horizontal');
    assert.equal(screen.getByRole('link').className, 'stepper-item active');

    rerender(
        <StepperNav>
            <StepperButton active disabled>
                Current step
            </StepperButton>
        </StepperNav>
    );
    assert.equal(
        screen.getByRole('button').className,
        'stepper-item p-0 border-0 bg-transparent active'
    );
    assert.equal(screen.getByRole('button').getAttribute('type'), 'button');
    assert.equal(screen.getByRole('button').hasAttribute('disabled'), true);

    rerender(
        <Stepper>
            <StepperItem>Vertical</StepperItem>
        </Stepper>
    );
    assert.equal(screen.getByRole('list').className, 'stepper');
});
