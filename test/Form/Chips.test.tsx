import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
    Chip,
    ChipDismiss,
    ChipIcon,
    ChipImage,
    ChipInput,
    ChipInputLabel,
    ChipToken,
    FormGhost
} from '../../source/Form';

it('server-renders static chip components without mounting the form plugin', () => {
    const markup = renderToStaticMarkup(
        <Chip theme="primary" active>
            Static
        </Chip>
    );
    assert.match(markup, /class="chip active theme-primary"/);
    assert.match(markup, />Static<\/button>/);
});

it('renders chips and chip input options', () => {
    render(
        <ChipInput theme="primary" separator="," maxChips={3}>
            <Chip active>React</Chip>
            <FormGhost aria-label="Add tag" />
        </ChipInput>
    );
    assert.equal(screen.getByText('React').className, 'chip active');
    assert.equal(screen.getByLabelText('Add tag').className, 'form-ghost');
    assert.equal(screen.getByText('React').parentElement?.dataset.bsSeparator, ',');
    assert.equal(screen.getByText('React').parentElement?.dataset.bsMaxChips, '3');
});

it('creates and removes chips with native keyboard behavior and configured limits', async () => {
    const changed = mock.fn();
    const { default: Chips } = await import('bootstrap/js/src/chips.js');
    const { unmount } = render(
        <ChipInput maxChips={2} allowDuplicates={false} onValuesChange={changed}>
            <ChipInputLabel htmlFor="tags">Skills</ChipInputLabel>
            <FormGhost id="tags" />
        </ChipInput>
    );
    const input = screen.getByLabelText('Skills') as HTMLInputElement;
    const wrapper = input.parentElement!;

    await waitFor(() => assert.ok(Chips.getInstance(wrapper)));

    input.value = 'React';
    fireEvent.keyDown(input, { key: 'Enter' });
    input.value = 'React';
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.input(input, { target: { value: 'TypeScript,' } });
    input.value = 'Extra';
    fireEvent.keyDown(input, { key: 'Enter' });

    assert.deepEqual(Chips.getInstance(wrapper)?.getValues(), ['React', 'TypeScript']);
    assert.equal(changed.mock.callCount(), 2);

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    assert.deepEqual(Chips.getInstance(wrapper)?.getValues(), ['TypeScript']);

    unmount();

    assert.equal(Chips.getInstance(wrapper), null);
});

it('composes avatar, icon and dismissible token shapes without nested buttons', () => {
    render(
        <ChipToken theme="success" active>
            <ChipImage src="avatar.png" alt="Profile" />
            <ChipIcon name="person" aria-hidden="true" />
            Person
            <ChipDismiss disabled />
        </ChipToken>
    );
    assert.equal(screen.getByRole('img').className, 'chip-img');
    assert.equal(screen.getByRole('button', { name: 'Remove' }).parentElement?.tagName, 'SPAN');
    assert.equal(screen.getByRole('button', { name: 'Remove' }).hasAttribute('disabled'), true);
});
