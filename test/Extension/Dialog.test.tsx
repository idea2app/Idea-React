import assert from 'node:assert/strict';
import { it } from 'node:test';

import { Dialog, DialogClose } from '../../source/Extension/Dialog';

it('clears a rejected dialog without producing an extra rejected cleanup promise', async () => {
    const dialog = new Dialog<{ title: string }, string>(() => null);
    const result = dialog.open({ title: 'Choose' });

    assert.equal(dialog.input.title, 'Choose');
    assert.ok(dialog.defer);

    dialog.defer.reject(new DialogClose());

    await assert.rejects(result, DialogClose);
    assert.equal(dialog.defer, undefined);
});

it('does not clear a newer dialog when an earlier request settles', async () => {
    const dialog = new Dialog<{}, string>(() => null);
    const first = dialog.open();
    const firstDefer = dialog.defer!;
    const second = dialog.open();
    const secondDefer = dialog.defer!;

    firstDefer.resolve('first');

    assert.equal(await first, 'first');
    assert.equal(dialog.defer, secondDefer);

    secondDefer.resolve('second');

    assert.equal(await second, 'second');
    assert.equal(dialog.defer, undefined);
});
