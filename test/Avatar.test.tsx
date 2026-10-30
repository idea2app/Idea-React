import assert from 'node:assert/strict';
import { it } from 'node:test';

import { render, screen } from '@testing-library/react';

import { Avatar, AvatarStack } from '../source/Avatar';

it('renders an official Bootstrap 6 image avatar with size and theme classes', () => {
    const { rerender, container } = render(
        <Avatar size="lg" src="https://github.com/idea2app.png" alt="idea2app" />
    );
    const image = screen.getByRole('img', { name: 'idea2app' });

    assert.equal(image.className, 'avatar-img');
    assert.equal(image.parentElement!.className, 'avatar avatar-lg');

    rerender(
        <Avatar theme="primary" subtle>
            AB
        </Avatar>
    );

    assert.equal(
        container.querySelector('.avatar')!.className,
        'avatar theme-primary avatar-subtle'
    );
    assert.equal(screen.getByText('AB').textContent, 'AB');
});

it('applies a custom numeric size through the --bs-avatar-size variable', () => {
    const { container } = render(<Avatar size={6}>CD</Avatar>);
    const avatar = container.querySelector<HTMLSpanElement>('.avatar')!;

    assert.equal(avatar.className, 'avatar');
    assert.equal(avatar.style.getPropertyValue('--bs-avatar-size'), '6rem');
});

it('announces a status indicator with an accessible label', () => {
    render(<Avatar src="https://github.com/idea2app.png" alt="idea2app" status="online" />);
    const status = screen.getByRole('img', { name: 'online' });

    assert.equal(status.className, 'avatar-status status-online');

    render(
        <Avatar
            src="https://github.com/idea2app.png"
            alt="busy"
            status="busy"
            statusLabel="In a call"
        />
    );

    assert.equal(
        screen.getByRole('img', { name: 'In a call' }).className,
        'avatar-status status-busy'
    );
});

it('stacks avatars with an optional stack size', () => {
    const { container } = render(
        <AvatarStack size="sm">
            <Avatar>AB</Avatar>
            <Avatar>CD</Avatar>
        </AvatarStack>
    );
    const stack = container.querySelector<HTMLDivElement>('.avatar-stack')!;

    assert.equal(stack.className, 'avatar-stack avatar-stack-sm');
    assert.equal(stack.querySelectorAll('.avatar').length, 2);
});
