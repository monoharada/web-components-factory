type DadsCommandDetail = Readonly<{
  command: string;
  invoker: Element;
  target: Element | null;
  value: string | null;
  originalEvent: Event | null;
}>;

export type { DadsCommandDetail };

export type CommandHandler = (detail: DadsCommandDetail) => void;

function looksLikeSelector(value: string): boolean {
  const s = value.trim();
  if (s === '') return false;
  const c0 = s[0];
  return c0 === '#' || c0 === '.' || c0 === '[' || c0 === ':' || c0 === '>';
}

function escapeCssIdent(value: string): string {
  // Prefer the platform implementation when available.
  const css = (globalThis as unknown as { CSS?: { escape?: (v: string) => string } }).CSS;
  if (css?.escape) return css.escape(value);
  // Minimal escape for IDs used in querySelector. This is not a full CSS.escape implementation.
  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

export function resolveCommandTarget(root: ParentNode, commandfor: string): Element | null {
  const raw = commandfor.trim();
  if (raw === '') return null;

  // Treat as an ID that points at the root element itself.
  if (!(looksLikeSelector(raw)) && root instanceof Element && root.id === raw) {
    return root;
  }

  if (looksLikeSelector(raw)) {
    const parent = root as ParentNode & { querySelector?: (selectors: string) => Element | null };
    if (!parent.querySelector) return null;
    try {
      return parent.querySelector(raw);
    } catch {
      return null;
    }
  }

  // Treat as an ID.
  if (root instanceof Document) return root.getElementById(raw);

  const maybeGetById = root as unknown as { getElementById?: (id: string) => Element | null };
  if (typeof maybeGetById.getElementById === 'function') {
    return maybeGetById.getElementById(raw);
  }

  const parent = root as ParentNode & { querySelector?: (selectors: string) => Element | null };
  if (!parent.querySelector) return null;
  return parent.querySelector(`#${escapeCssIdent(raw)}`);
}

function findInvokerFromEventTarget(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null;
  // Support "command" being set on a wrapper, with inner icon/text clicks.
  return target.closest('[command]');
}

function findInvokerFromEvent(event: Event): Element | null {
  // Prefer composedPath so shadow DOM retargeting doesn't hide the real invoker.
  const composedPath =
    typeof event.composedPath === 'function' ? (event.composedPath() as unknown[]) : [];
  for (const entry of composedPath) {
    if (!(entry instanceof Element)) continue;
    const invoker = entry.closest('[command]');
    if (invoker) return invoker;
  }
  return findInvokerFromEventTarget(event.target);
}

function isNativeKeyboardInvoker(el: Element): boolean {
  return (
    el instanceof HTMLButtonElement ||
    el instanceof HTMLAnchorElement ||
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  );
}

export class CommandStore {
  #handlersByCommand = new Map<string, Set<CommandHandler>>();

  on(command: string, handler: CommandHandler): () => void {
    const key = command.trim();
    if (key === '') return () => {};
    const existing = this.#handlersByCommand.get(key);
    if (existing) {
      existing.add(handler);
    } else {
      this.#handlersByCommand.set(key, new Set([handler]));
    }
    return () => {
      const set = this.#handlersByCommand.get(key);
      if (!set) return;
      set.delete(handler);
      if (set.size === 0) this.#handlersByCommand.delete(key);
    };
  }

  invokeFromElement(
    invoker: Element,
    options?: Readonly<{ root?: ParentNode; originalEvent?: Event | null }>,
  ): void {
    const command = invoker.getAttribute('command')?.trim() ?? '';
    if (command === '') return;

    const root = options?.root ?? (invoker.getRootNode() as ParentNode);
    const commandfor = invoker.getAttribute('commandfor') ?? '';
    const target = commandfor ? resolveCommandTarget(root, commandfor) : null;
    const value = invoker.getAttribute('value');

    const detail: DadsCommandDetail = {
      command,
      invoker,
      target,
      value,
      originalEvent: options?.originalEvent ?? null,
    };

    if (target) {
      const event = new CustomEvent<DadsCommandDetail>('dads-command', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail,
      });
      target.dispatchEvent(event);
      if (event.defaultPrevented) return;
    }

    const set = this.#handlersByCommand.get(command);
    if (!set) return;
    for (const handler of set) handler(detail);
  }

  bind(root: ParentNode): () => void {
    const parent = root as ParentNode & {
      addEventListener?: (type: string, listener: EventListener) => void;
      removeEventListener?: (type: string, listener: EventListener) => void;
    };
    if (!parent.addEventListener || !parent.removeEventListener) return () => {};

    const onClick: EventListener = (event) => {
      const invoker = findInvokerFromEvent(event as Event);
      if (!invoker) return;
      this.invokeFromElement(invoker, { root, originalEvent: event });
    };

    const onKeyDown: EventListener = (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      const invoker = findInvokerFromEvent(event);
      if (!invoker) return;
      if (isNativeKeyboardInvoker(invoker)) return;

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

export const defaultCommandStore = new CommandStore();
