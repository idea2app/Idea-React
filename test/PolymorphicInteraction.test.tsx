import assert from 'node:assert/strict';
import { it } from 'node:test';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ComponentPropsWithRef, createRef, forwardRef } from 'react';

import {
    Alert,
    AsProps,
    Button,
    Card,
    Checkbox,
    FormRange,
    HorizontalMarqueeBox,
    NavLink,
    OTPInput,
    polymorphic,
    ScrollNav,
    Table,
    TypeEcho
} from '../source';

interface RouterLinkProps extends Omit<ComponentPropsWithRef<'a'>, 'href'> {
    to: string;
    replace?: boolean;
}

const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
    ({ to, replace, ...props }, ref) => (
        <a {...props} ref={ref} href={to} data-replace={replace || undefined} />
    )
);
RouterLink.displayName = 'RouterLink';

const CustomInput = forwardRef<
    HTMLInputElement,
    ComponentPropsWithRef<'input'> & { tracking: string }
>(({ tracking, ...props }, ref) => <input {...props} ref={ref} data-tracking={tracking} />);

CustomInput.displayName = 'CustomInput';

it('adds polymorphic typing without wrapping or replacing a component', () => {
    const Original = ({ as: Root = 'div', ...props }: ComponentPropsWithRef<'div'> & AsProps) => (
        <Root {...props} />
    );
    Original.displayName = 'Original';

    const Surface = polymorphic<ComponentPropsWithRef<'div'>>(Original);

    assert.equal(Surface, Original);
    assert.equal(Surface.displayName, 'Original');
});

it('switches intrinsic roots without losing styles, children, attributes or refs', () => {
    const anchor = createRef<HTMLAnchorElement>();
    const button = createRef<HTMLButtonElement>();
    const { rerender } = render(
        <Card ref={anchor} as="a" href="/docs" className="custom" aria-label="News">
            News
        </Card>
    );
    assert.equal(screen.getByRole('link', { name: 'News' }), anchor.current);
    assert.equal(anchor.current?.className, 'card custom');
    assert.equal(anchor.current?.getAttribute('href'), '/docs');
    assert.equal(anchor.current?.getAttribute('as'), null);

    rerender(
        <Card ref={button} as="button" type="button" className="custom">
            News
        </Card>
    );
    assert.equal(anchor.current, null);
    assert.equal(screen.getByRole('button', { name: 'News' }), button.current);
    assert.equal(button.current?.className, 'card custom');
});

it('merges router props with button styling and preserves disabled navigation behavior', t => {
    const clicked = t.mock.fn();
    const ref = createRef<HTMLAnchorElement>();
    const { rerender } = render(
        <Button
            ref={ref}
            as={RouterLink}
            to="/docs"
            variant="solid"
            theme="primary"
            replace
            onClick={clicked}
        >
            Documentation
        </Button>
    );
    const link = screen.getByRole('link', { name: 'Documentation' });

    assert.equal(ref.current, link);
    assert.equal(link.className, 'btn-solid theme-primary');
    assert.equal(link.getAttribute('href'), '/docs');
    assert.equal(link.getAttribute('data-replace'), 'true');
    assert.equal(link.getAttribute('type'), null);

    fireEvent.click(link);

    assert.equal(clicked.mock.callCount(), 1);

    rerender(
        <Button as={RouterLink} to="/docs" disabled onClick={clicked}>
            Documentation
        </Button>
    );
    assert.equal(link.getAttribute('aria-disabled'), 'true');
    assert.equal(link.getAttribute('tabindex'), '-1');
    assert.equal(fireEvent.click(link), false);
    assert.equal(clicked.mock.callCount(), 1);
});

it('forwards active state through a custom root', () => {
    render(
        <Button as={RouterLink} to="/settings" role="button" active>
            Settings
        </Button>
    );
    const button = screen.getByRole('button', { name: 'Settings' });

    assert.equal(button.tagName, 'A');
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.ok(button.classList.contains('active'));

    fireEvent.click(button);

    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.ok(button.classList.contains('active'));
});

it('composes library wrappers without discarding either wrapper class', () => {
    render(
        <Button as={NavLink} href="/docs" theme="primary" active>
            Documentation
        </Button>
    );
    const link = screen.getByRole('link', { name: 'Documentation' });

    assert.ok(link.classList.contains('btn'));
    assert.ok(link.classList.contains('theme-primary'));
    assert.ok(link.classList.contains('nav-link'));
    assert.ok(link.classList.contains('active'));
});

it('forwards checkbox refs through a custom input without losing indeterminate state', () => {
    const ref = createRef<HTMLInputElement>();

    render(
        <Checkbox
            ref={ref}
            as={CustomInput}
            tracking="agreement"
            aria-label="Agreement"
            indeterminate
        />
    );
    assert.equal(ref.current, screen.getByLabelText('Agreement'));
    assert.equal(ref.current?.type, 'checkbox');
    assert.equal(ref.current?.indeterminate, true);
    assert.equal(ref.current?.dataset.tracking, 'agreement');
});

it('switches responsive table roots while preserving the table and forwarding events once', t => {
    const ref = createRef<HTMLElement>();
    const clicked = t.mock.fn();

    render(
        <Table
            ref={ref}
            as="section"
            className="custom"
            aria-label="Results"
            responsive
            onClick={clicked}
        >
            <tbody>
                <tr>
                    <td>Result</td>
                </tr>
            </tbody>
        </Table>
    );
    assert.equal(ref.current?.tagName, 'SECTION');
    assert.ok(ref.current?.classList.contains('table-responsive'));
    assert.ok(ref.current?.classList.contains('custom'));
    assert.equal(ref.current?.querySelector('table')?.className, 'table');
    assert.equal(ref.current?.getAttribute('aria-label'), 'Results');

    fireEvent.click(screen.getByText('Result'));

    assert.equal(clicked.mock.callCount(), 1);
});

it('keeps range plugin behavior and form fields inside a selected wrapper root', async () => {
    const ref = createRef<HTMLElement>();
    const { unmount } = render(
        <FormRange ref={ref} as="section" name="volume" defaultValue={25} data-testid="range" />
    );
    const root = screen.getByTestId('range');
    const { default: Range } = await import('bootstrap/js/src/range.js');

    await waitFor(() => assert.ok(Range.getInstance(root)));

    assert.equal(ref.current, root);
    assert.equal(root.tagName, 'SECTION');
    assert.equal(root.querySelector('input')?.name, 'volume');

    fireEvent.input(root.querySelector('input')!, { target: { value: '75' } });

    assert.equal(root.style.getPropertyValue('--bs-range-fill'), '0.75');

    unmount();

    assert.equal(ref.current, null);
    assert.equal(Range.getInstance(root), null);
});

it('keeps OTP plugin slots inside a selected wrapper root and exposes its ref', async () => {
    const ref = createRef<HTMLElement>();
    const { unmount } = render(
        <OTPInput ref={ref} as="section" length={4} name="pin" data-testid="otp" />
    );
    const root = screen.getByTestId('otp');

    await waitFor(() => assert.equal(root.querySelectorAll('.otp-slot').length, 4));

    assert.equal(ref.current, root);
    assert.equal(root.tagName, 'SECTION');
    assert.equal(root.querySelector('input.otp-input')?.getAttribute('name'), 'pin');

    unmount();

    assert.equal(ref.current, null);
});

it('preserves class instance refs when selecting a different root', () => {
    const ref = createRef<Alert<'section'>>();

    render(
        <Alert ref={ref} as="section">
            Notice
        </Alert>
    );
    assert.ok(ref.current instanceof Alert);
    assert.equal(screen.getByRole('alert').tagName, 'SECTION');
});

it('forwards root attributes and styles in both marquee layout branches', () => {
    const { rerender } = render(
        <HorizontalMarqueeBox
            as="section"
            className="custom"
            style={{ color: 'red' }}
            height="2rem"
            data-testid="marquee"
        >
            News
        </HorizontalMarqueeBox>
    );
    const root = screen.getByTestId('marquee');

    assert.equal(root.tagName, 'SECTION');
    assert.ok(root.classList.contains('custom'));
    assert.equal(root.style.color, 'red');
    assert.equal(root.style.getPropertyValue('--scroll-height'), '2rem');
    assert.ok(root.textContent?.includes('News'));

    rerender(
        <HorizontalMarqueeBox
            as="section"
            className="custom"
            style={{ color: 'red' }}
            data-testid="marquee"
        >
            News
        </HorizontalMarqueeBox>
    );
    const updatedRoot = screen.getByTestId('marquee');

    assert.ok(updatedRoot.classList.contains('custom'));
    assert.equal(updatedRoot.style.color, 'red');
    assert.equal(updatedRoot.textContent, 'News');
});

it('forwards ScrollNav refs and attributes to the selected outer root', t => {
    Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        value: window.ResizeObserver
    });
    t.after(() => Reflect.deleteProperty(globalThis, 'ResizeObserver'));

    const ref = createRef<HTMLElement>();
    const clicked = t.mock.fn();

    render(
        <ScrollNav
            ref={ref}
            as="section"
            aria-label="Sections"
            navClassName="justify-content-between"
            onClick={clicked}
        >
            <NavLink href="/docs">Documentation</NavLink>
        </ScrollNav>
    );
    const root = ref.current;

    assert.equal(root?.tagName, 'SECTION');
    assert.equal(root?.getAttribute('aria-label'), 'Sections');
    assert.ok(root?.querySelector('.nav')?.classList.contains('justify-content-between'));

    fireEvent.click(screen.getByRole('link', { name: 'Documentation' }));

    assert.equal(clicked.mock.callCount(), 1);
});

it('forwards TypeEcho refs to its root and releases replaced callback refs', t => {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
        configurable: true,
        value: window.IntersectionObserver
    });
    t.after(() => Reflect.deleteProperty(globalThis, 'IntersectionObserver'));

    const ref = createRef<HTMLElement>();
    const cleanup = t.mock.fn();
    const callback = t.mock.fn((_node: HTMLElement | null) => cleanup);

    const { rerender, unmount } = render(
        <TypeEcho ref={callback} as="section" text="Hello" data-testid="echo" />
    );
    const root = screen.getByTestId('echo');

    assert.equal(callback.mock.calls[0].arguments[0], root);
    assert.equal(root.tagName, 'SECTION');

    rerender(<TypeEcho ref={ref} as="section" text="Hello" data-testid="echo" />);

    assert.equal(cleanup.mock.callCount(), 1);
    assert.equal(callback.mock.callCount(), 1);
    assert.equal(ref.current, root);

    rerender(<TypeEcho ref={ref} as="article" text="Hello" data-testid="echo" />);

    assert.equal(ref.current?.tagName, 'ARTICLE');
    assert.notEqual(ref.current, root);

    unmount();

    assert.equal(ref.current, null);
});
