import { describe, it, expect, vi } from 'vitest';
import { CommandStore, resolveCommandTarget } from './command-store';

describe('command-store', () => {
  it('resolveCommandTarget: id を解決できる', () => {
    const root = document.createElement('div');
    const target = document.createElement('div');
    target.id = 'target-id';
    root.appendChild(target);

    expect(resolveCommandTarget(root, 'target-id')).toBe(target);
  });

  it('resolveCommandTarget: selector を解決できる', () => {
    const root = document.createElement('div');
    const target = document.createElement('div');
    target.id = 'target-id';
    root.appendChild(target);

    expect(resolveCommandTarget(root, '#target-id')).toBe(target);
  });

  it('invokeFromElement: target が preventDefault() すると store handler は呼ばれない', () => {
    const root = document.createElement('div');
    const target = document.createElement('div');
    target.id = 'target-id';
    root.appendChild(target);

    const invoker = document.createElement('button');
    invoker.setAttribute('commandfor', 'target-id');
    invoker.setAttribute('command', 'remove');

    const store = new CommandStore();
    const handler = vi.fn();
    store.on('remove', handler);

    const commandListener = vi.fn((event: Event) => {
      event.preventDefault();
    });
    target.addEventListener('dads-command', commandListener);

    store.invokeFromElement(invoker, { root, originalEvent: null });

    expect(commandListener).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledTimes(0);
  });

  it('invokeFromElement: target 未処理の場合は store handler が呼ばれる', () => {
    const root = document.createElement('div');
    const target = document.createElement('div');
    target.id = 'target-id';
    root.appendChild(target);

    const invoker = document.createElement('button');
    invoker.setAttribute('commandfor', 'target-id');
    invoker.setAttribute('command', 'remove');

    const store = new CommandStore();
    const handler = vi.fn();
    store.on('remove', handler);

    store.invokeFromElement(invoker, { root, originalEvent: null });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]?.command).toBe('remove');
    expect(handler.mock.calls[0]?.[0]?.target).toBe(target);
  });

  it('bind: click で invoke できる', () => {
    const root = document.createElement('div');
    const target = document.createElement('div');
    target.id = 'target-id';
    root.appendChild(target);

    const invoker = document.createElement('button');
    invoker.setAttribute('commandfor', 'target-id');
    invoker.setAttribute('command', 'remove');
    root.appendChild(invoker);

    const store = new CommandStore();
    const handler = vi.fn();
    store.on('remove', handler);

    const cleanup = store.bind(root);
    invoker.click();
    cleanup();

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

