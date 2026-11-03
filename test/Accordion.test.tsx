import assert from 'node:assert/strict';
import { it, mock } from 'node:test';

import { fireEvent, render, screen } from '@testing-library/react';

import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    AccordionToggle
} from '../source/Accordion';

it('renders native exclusive, compact, themed, flush and spaced accordions', () => {
    const { container } = render(
        <Accordion theme="primary" size="sm" className="custom" flush gap>
            <AccordionItem name="example" open>
                <AccordionHeader>First</AccordionHeader>
                <AccordionBody>Body</AccordionBody>
            </AccordionItem>
            <AccordionItem name="example">
                <AccordionHeader icon={false}>Second</AccordionHeader>
            </AccordionItem>
        </Accordion>
    );
    assert.equal(
        container.firstElementChild?.className,
        'accordion theme-primary accordion-sm accordion-flush accordion-gap custom'
    );
    assert.equal(container.querySelector('details')?.getAttribute('name'), 'example');
    assert.equal(container.querySelector('details')?.open, true);
    assert.equal(container.querySelector('summary')?.className, 'accordion-header');
    assert.equal(container.querySelector('.accordion-body')?.textContent, 'Body');
    assert.equal(container.querySelectorAll('.accordion-icon').length, 1);
});

it('expands and collapses all direct items, preserving nested groups and native names', () => {
    const onClick = mock.fn();

    const { container } = render(
        <>
            <AccordionToggle
                target="#all"
                variant="subtle"
                theme="secondary"
                size="sm"
                onClick={onClick}
            >
                Toggle all
            </AccordionToggle>
            <Accordion id="all">
                <AccordionItem name="outer" open>
                    <AccordionHeader>First</AccordionHeader>
                    <AccordionBody>
                        <Accordion>
                            <AccordionItem name="inner">
                                <AccordionHeader>Nested</AccordionHeader>
                            </AccordionItem>
                        </Accordion>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem name="outer">
                    <AccordionHeader>Second</AccordionHeader>
                </AccordionItem>
            </Accordion>
        </>
    );
    const button = screen.getByRole('button', { name: 'Toggle all' });
    const [first, nested, second] = [...container.querySelectorAll('details')];

    assert.equal(button.className, 'btn-subtle theme-secondary btn-sm');

    fireEvent.click(button);

    assert.equal(button.getAttribute('aria-expanded'), 'true');
    assert.equal(first.open && second.open, true);
    assert.equal(first.hasAttribute('name'), false);
    assert.equal(nested.open, false);
    assert.equal(nested.getAttribute('name'), 'inner');

    fireEvent.click(button);

    assert.equal(first.open || second.open, false);
    assert.equal(first.getAttribute('name'), 'outer');
    assert.equal(second.getAttribute('name'), 'outer');
    assert.equal(onClick.mock.callCount(), 2);
});
