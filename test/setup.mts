import './register.mts';

import { after,afterEach } from 'node:test';

import { Window } from 'happy-dom';

const browser = new Window({ url: 'http://localhost/' });

for (const key of [
    'window',
    'document',
    'navigator',
    'Element',
    'HTMLElement',
    'HTMLDialogElement',
    'Node',
    'MutationObserver',
    'getComputedStyle'
] as const) {
    Object.defineProperty(globalThis, key, {
        configurable: true,
        value: browser[key]
    });
}
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
    configurable: true,
    writable: true,
    value: true
});

const { cleanup } = await import('@testing-library/react');

afterEach(() => {
    cleanup();
});

after(() => browser.happyDOM.close());

HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
};
HTMLDialogElement.prototype.show = function () {
    this.open = true;
};
HTMLDialogElement.prototype.close = function () {
    this.open = false;
};
