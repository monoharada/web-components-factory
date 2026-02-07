var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CommandStore_handlersByCommand;
function looksLikeSelector(value) {
    const s = value.trim();
    if (s === '')
        return false;
    const c0 = s[0];
    return c0 === '#' || c0 === '.' || c0 === '[' || c0 === ':' || c0 === '>';
}
function escapeCssIdent(value) {
    // Prefer the platform implementation when available.
    const css = globalThis.CSS;
    if (css?.escape)
        return css.escape(value);
    // Minimal escape for IDs used in querySelector. This is not a full CSS.escape implementation.
    return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}
export function resolveCommandTarget(root, commandfor) {
    const raw = commandfor.trim();
    if (raw === '')
        return null;
    // Treat as an ID that points at the root element itself.
    if (!(looksLikeSelector(raw)) && root instanceof Element && root.id === raw) {
        return root;
    }
    if (looksLikeSelector(raw)) {
        const parent = root;
        if (!parent.querySelector)
            return null;
        try {
            return parent.querySelector(raw);
        }
        catch {
            return null;
        }
    }
    // Treat as an ID.
    if (root instanceof Document)
        return root.getElementById(raw);
    const maybeGetById = root;
    if (typeof maybeGetById.getElementById === 'function') {
        return maybeGetById.getElementById(raw);
    }
    const parent = root;
    if (!parent.querySelector)
        return null;
    return parent.querySelector(`#${escapeCssIdent(raw)}`);
}
function findInvokerFromEventTarget(target) {
    if (!(target instanceof Element))
        return null;
    // Support "command" being set on a wrapper, with inner icon/text clicks.
    return target.closest('[command]');
}
function findInvokerFromEvent(event) {
    // Prefer composedPath so shadow DOM retargeting doesn't hide the real invoker.
    const composedPath = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (const entry of composedPath) {
        if (!(entry instanceof Element))
            continue;
        const invoker = entry.closest('[command]');
        if (invoker)
            return invoker;
    }
    return findInvokerFromEventTarget(event.target);
}
function isNativeKeyboardInvoker(el) {
    return (el instanceof HTMLButtonElement ||
        el instanceof HTMLAnchorElement ||
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement);
}
export class CommandStore {
    constructor() {
        _CommandStore_handlersByCommand.set(this, new Map());
    }
    on(command, handler) {
        const key = command.trim();
        if (key === '')
            return () => { };
        const existing = __classPrivateFieldGet(this, _CommandStore_handlersByCommand, "f").get(key);
        if (existing) {
            existing.add(handler);
        }
        else {
            __classPrivateFieldGet(this, _CommandStore_handlersByCommand, "f").set(key, new Set([handler]));
        }
        return () => {
            const set = __classPrivateFieldGet(this, _CommandStore_handlersByCommand, "f").get(key);
            if (!set)
                return;
            set.delete(handler);
            if (set.size === 0)
                __classPrivateFieldGet(this, _CommandStore_handlersByCommand, "f").delete(key);
        };
    }
    invokeFromElement(invoker, options) {
        const command = invoker.getAttribute('command')?.trim() ?? '';
        if (command === '')
            return;
        const root = options?.root ?? invoker.getRootNode();
        const commandfor = invoker.getAttribute('commandfor') ?? '';
        const target = commandfor ? resolveCommandTarget(root, commandfor) : null;
        const value = invoker.getAttribute('value');
        const detail = {
            command,
            invoker,
            target,
            value,
            originalEvent: options?.originalEvent ?? null,
        };
        if (target) {
            const event = new CustomEvent('dads-command', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail,
            });
            target.dispatchEvent(event);
            if (event.defaultPrevented)
                return;
        }
        const set = __classPrivateFieldGet(this, _CommandStore_handlersByCommand, "f").get(command);
        if (!set)
            return;
        for (const handler of set)
            handler(detail);
    }
    bind(root) {
        const parent = root;
        if (!parent.addEventListener || !parent.removeEventListener)
            return () => { };
        const onClick = (event) => {
            const invoker = findInvokerFromEvent(event);
            if (!invoker)
                return;
            this.invokeFromElement(invoker, { root, originalEvent: event });
        };
        const onKeyDown = (event) => {
            if (!(event instanceof KeyboardEvent))
                return;
            if (event.key !== 'Enter' && event.key !== ' ')
                return;
            const invoker = findInvokerFromEvent(event);
            if (!invoker)
                return;
            if (isNativeKeyboardInvoker(invoker))
                return;
            event.preventDefault();
            this.invokeFromElement(invoker, { root, originalEvent: event });
        };
        parent.addEventListener('click', onClick);
        parent.addEventListener('keydown', onKeyDown);
        return () => {
            parent.removeEventListener('click', onClick);
            parent.removeEventListener('keydown', onKeyDown);
        };
    }
}
_CommandStore_handlersByCommand = new WeakMap();
export const defaultCommandStore = new CommandStore();
