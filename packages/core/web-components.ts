/* ---------------------------------------------------------------------------
 * Web‑Component Utility Library – TypeScript (strict) ★ no any / no Array.forEach
 * ---------------------------------------------------------------------------*/

/* eslint-disable prefer-const */

// ----------------------------------------------------------- ----------
// shared helpers -------------------------------------------------------
// ---------------------------------------------------------------------

/** "object with arbitrary keys" を表すユーティリティ */
export type Dict = Record<string, unknown>;

// ---------------------------------------------------------------------
// AdoptableStyles ------------------------------------------------------
// ---------------------------------------------------------------------

const styleCache = new Map<string, CSSStyleSheet>();
const emptySheets: readonly CSSStyleSheet[] = Object.freeze([]);

function valueToSheet(v: string | CSSStyleSheet): CSSStyleSheet {
  return typeof v === 'string' ? AdoptableStyles.for(v) : v;
}

export interface AdoptableStylesStatic {
  normalize(
    v?: string | CSSStyleSheet | (string | CSSStyleSheet)[] | null,
  ): readonly CSSStyleSheet[];
  for(cssText: string): CSSStyleSheet;
}

export const AdoptableStyles: AdoptableStylesStatic = Object.freeze({
  normalize(v?: string | CSSStyleSheet | (string | CSSStyleSheet)[] | null) {
    if (Array.isArray(v)) return v.map(valueToSheet);
    if (v) return [valueToSheet(v)];
    return emptySheets;
  },
  for(cssText: string) {
    const cached = styleCache.get(cssText);
    if (cached) return cached;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    styleCache.set(cssText, sheet);
    return sheet;
  },
});

export function css(strings: TemplateStringsArray, ...values: unknown[]): CSSStyleSheet {
  let out = '';
  for (let i = 0, end = strings.length - 1; i < end; ++i) {
    out += strings[i] + String(values[i]);
  }
  out += strings[strings.length - 1];
  return AdoptableStyles.for(out.trim());
}

// ---------------------------------------------------------------------
// View / ViewTemplate --------------------------------------------------
// ---------------------------------------------------------------------

export class View<TRefs extends Dict = Dict> {
  #fragment: DocumentFragment;
  #refs: TRefs = Object.create(null);

  get refs(): TRefs {
    return this.#refs;
  }

  constructor(fragment: DocumentFragment) {
    this.#fragment = fragment;
    const elements = this.#fragment.querySelectorAll<HTMLElement>('[id]');
    for (const el of elements) {
      (this.#refs as Dict)[el.id] = el;
    }
  }

  appendTo(node: Node): void {
    node.appendChild(this.#fragment);
  }
}

const templateCache = new Map<string, ViewTemplate>();

export class ViewTemplate {
  #fragment?: DocumentFragment;
  #html: string;

  constructor(html: string) {
    this.#html = html;
  }

  create(): View {
    if (!this.#fragment) {
      const t = document.createElement('template');
      t.innerHTML = this.#html;
      this.#fragment = document.adoptNode(t.content);
    }
    return new View(this.#fragment.cloneNode(true) as DocumentFragment);
  }

  hydrate(sr: ShadowRoot): View {
    return new View(sr as unknown as DocumentFragment);
  }
  toString(): string {
    return this.#html;
  }

  static for(htmlText: string): ViewTemplate {
    const cached = templateCache.get(htmlText);
    if (cached) return cached;
    const t = new ViewTemplate(htmlText);
    templateCache.set(htmlText, t);
    return t;
  }
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): ViewTemplate {
  let out = '';
  for (let i = 0, end = strings.length - 1; i < end; ++i) {
    out += strings[i];
    const v = values[i];
    out += Array.isArray(v) ? v.join('') : String(v);
  }
  out += strings[strings.length - 1];
  return ViewTemplate.for(out);
}

// ---------------------------------------------------------------------
// Attribute helpers ----------------------------------------------------
// ---------------------------------------------------------------------

export interface AttrBehavior {
  attribute: string;
  property?: string;
  getValue?(instance: HTMLElement): unknown;
  setValue?(instance: HTMLElement, value: unknown): void;
  tryTransfer?(instance: HTMLElement): boolean;
  attributeChangedCallback?(
    instance: HTMLElement,
    oldValue: string | null,
    newValue: string | null,
  ): void;
}

function invokeCallback(
  instance: HTMLElement,
  cbName: string,
  oldVal: unknown,
  newVal: unknown,
): void {
  const obj = instance as unknown as Dict;
  const fn = obj[cbName];
  if (typeof fn === 'function') {
    (fn as (o: unknown, n: unknown) => void).call(instance, oldVal, newVal);
  }
}

function BaseAttr(property: string, attribute = property): AttrBehavior {
  const cb = `${property}Changed`;
  return {
    attribute,
    attributeChangedCallback(instance, oldVal, newVal) {
      invokeCallback(instance, cb, oldVal, newVal);
    },
  };
}

export const ContentAttr = (name: string): AttrBehavior => BaseAttr(name);

export function PropertyAttr(
  property: string,
  attribute = property,
): AttrBehavior & { property: string } {
  return Object.assign(BaseAttr(property, attribute), {
    property,
    getValue: (el: HTMLElement) => el.getAttribute(attribute),
    setValue: (el: HTMLElement, v: unknown) => {
      if (v == null) el.removeAttribute(attribute);
      else el.setAttribute(attribute, String(v));
    },
  });
}
PropertyAttr.is = (v: unknown): v is AttrBehavior & { property: string } =>
  typeof v === 'object' && v !== null && 'property' in v;

export function BooleanAttr(
  property: string,
  attribute = property,
): AttrBehavior & { property: string } {
  return Object.assign(BaseAttr(property, attribute), {
    property,
    getValue: (el: HTMLElement) => el.hasAttribute(attribute),
    setValue: (el: HTMLElement, v: unknown) => el.toggleAttribute(attribute, Boolean(v)),
  });
}

export function TransferringPropertyAttr(
  target: string,
  property: string,
  attribute = property,
  remove = false,
): AttrBehavior & { property: string } {
  const cb = `${property}Changed`;
  const lock = new WeakSet<HTMLElement>();
  return {
    property,
    attribute,
    getValue(i) {
      const trg = (i as ViewInstance).refs[target];
      if (trg && typeof (trg as HTMLElement).getAttribute === 'function') {
        return (trg as HTMLElement).getAttribute(attribute);
      }
      return undefined;
    },
    setValue(i, v) {
      const trg = (i as ViewInstance).refs[target];
      if (!trg || !(trg instanceof HTMLElement)) return;
      const old = trg.getAttribute(attribute);
      if (v == null) trg.removeAttribute(attribute);
      else trg.setAttribute(attribute, String(v));
      invokeCallback(i, cb, old, v);
    },
    tryTransfer(i) {
      if (lock.has(i)) return false;
      lock.add(i);
      const trg = (i as ViewInstance).refs[target];
      if (!trg) return false;
      const val = (i as HTMLElement).getAttribute(attribute);
      if (remove) (i as HTMLElement).removeAttribute(attribute);
      if (val == null) {
        (trg as HTMLElement).removeAttribute(attribute);
      } else {
        (trg as HTMLElement).setAttribute(attribute, val);
      }
      lock.delete(i);
      return true;
    },
    attributeChangedCallback(i, o, n) {
      if (this.tryTransfer?.(i)) invokeCallback(i, cb, o, n);
    },
  };
}

export function NonReflectingPropertyAttr(
  property: string,
  attribute = property,
): AttrBehavior & { property: string } {
  const cb = `${property}Changed`;
  const field = new WeakMap<HTMLElement, unknown>();
  return {
    property,
    attribute,
    getValue(i) {
      return field.get(i);
    },
    setValue(i, v) {
      const old = field.get(i);
      field.set(i, v);
      invokeCallback(i, cb, old, v);
    },
    attributeChangedCallback(i, o, n) {
      if (!field.has(i)) {
        field.set(i, n);
        invokeCallback(i, cb, o, n);
      }
    },
  };
}

// capture / restore initial values ------------------------------------
const initial = new WeakMap<object, Dict>();
export const Attribute = Object.freeze({
  normalize(arr?: (string | AttrBehavior)[] | null): AttrBehavior[] {
    if (!arr) return [];
    return arr.map((a) => (typeof a === 'string' ? PropertyAttr(a) : a));
  },
  captureInitialValue(obj: object, key: string, v: unknown) {
    let rec = initial.get(obj);
    if (!rec) {
      rec = {};
      initial.set(obj, rec);
    }
    rec[key] = v;
  },
  restoreInitialValues(obj: Dict) {
    const rec = initial.get(obj);
    if (!rec) return;
    for (const k of Object.keys(rec)) {
      if (!(k in obj)) obj[k] = rec[k];
    }
    initial.delete(obj);
  },
});

// ---------------------------------------------------------------------
// WebComponentDefinition ----------------------------------------------
// ---------------------------------------------------------------------

type ViewInstance = HTMLElement & { refs: Dict };

export type WebComponentConfig<T extends typeof WebComponent = typeof WebComponent> = {
  name: string;
  template?: ViewTemplate | null;
  styles?: string | CSSStyleSheet | (string | CSSStyleSheet)[];
  registry?: CustomElementRegistry;
  shadowOptions?: ShadowRootInit | null;
  elementOptions?: ElementDefinitionOptions;
  attributes?: (string | AttrBehavior)[];
  componentAttribute?: string | false; // コンポーネント識別用属性
} & Partial<Pick<T, 'observedAttributes'>>;

const defByType = new WeakMap<object, WebComponentDefinition>();
const ctorSecret = Symbol('ctor');

export class WebComponentDefinition {
  #type: typeof WebComponent;
  #name: string;
  #template: ViewTemplate | null;
  #styles: readonly CSSStyleSheet[];
  #registry: CustomElementRegistry;
  #shadowOptions?: ShadowRootInit;
  #elemOptions: ElementDefinitionOptions;
  #componentAttribute: string | false;
  #byProp = new Map<string, AttrBehavior>();
  #byAttr = new Map<string, AttrBehavior>();

  constructor(secret: symbol, type: typeof WebComponent, cfg: WebComponentConfig) {
    if (secret !== ctorSecret) throw new Error('Use compose()');
    this.#type = type;
    this.#name = cfg.name;
    this.#template = cfg.template ?? null;
    this.#styles = AdoptableStyles.normalize(cfg.styles);
    this.#registry = cfg.registry ?? customElements;
    this.#shadowOptions =
      cfg.shadowOptions === undefined ? { mode: 'open' } : cfg.shadowOptions || undefined;
    this.#elemOptions = { ...cfg.elementOptions };
    this.#componentAttribute = cfg.componentAttribute ?? 'data-sa-component';

    for (const a of Attribute.normalize(cfg.attributes)) {
      this.#byAttr.set(a.attribute?.toLowerCase?.() ?? a.attribute, a);
      if ('property' in a && a.property) {
        this.#byProp.set(a.property, a);
        Object.defineProperty(type.prototype, a.property, {
          configurable: true,
          get() {
            return a.getValue?.(this as HTMLElement);
          },
          set(v) {
            a.setValue?.(this as HTMLElement, v);
          },
        });
      }
    }

    defByType.set(type, this);
  }

  get name() {
    return this.#name;
  }
  get template() {
    return this.#template;
  }
  get styles() {
    return this.#styles;
  }
  get shadowOptions() {
    return this.#shadowOptions;
  }
  get elementOptions() {
    return this.#elemOptions;
  }
  get componentAttribute() {
    return this.#componentAttribute;
  }
  get attributes() {
    return this.#byAttr.values();
  }
  get properties() {
    return this.#byProp.values();
  }

  getAttribute(attr: string) {
    return this.#byAttr.get(attr);
  }

  define(reg: CustomElementRegistry = this.#registry): this {
    if (!reg.get(this.#name))
      reg.define(this.#name, this.#type as CustomElementConstructor, this.#elemOptions);
    return this;
  }

  static compose<B extends typeof WebComponent>(
    base: B,
    cfg: WebComponentConfig,
  ): WebComponentDefinition {
    if (defByType.has(base)) {
      // @ts-ignore - TS thinks this needs a mixin constructor, but it leads to other issues.
      const Derived = class extends base {};
      return new WebComponentDefinition(ctorSecret, Derived, cfg);
    }
    return new WebComponentDefinition(ctorSecret, base as unknown as typeof WebComponent, cfg);
  }

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  static forType(type: Function) {
    return defByType.get(type);
  }
}

// ---------------------------------------------------------------------
// WebComponent ---------------------------------------------------------
// ---------------------------------------------------------------------

const defaultEvt: CustomEventInit = { bubbles: true, composed: true, cancelable: true };

export class WebComponent extends HTMLElement {
  #view: View | null = null;
  #def?: WebComponentDefinition;
  #init = false;
  #sr?: ShadowRoot;
  #dsd = false;

  static get observedAttributes(): string[] {
    const def =
      WebComponentDefinition.forType(this) ??
      WebComponentDefinition.compose(this as unknown as typeof WebComponent, {
        name: 'dummy',
      });
    return Array.from(def.attributes).map((a) => a.attribute);
  }

  constructor() {
    super();
    this.#setup();
  }

  connectedCallback() {
    // Web componentsの識別用属性を追加
    const attr = this.definition.componentAttribute;
    if (attr !== false) {
      this.setAttribute(attr, '');
    }
    this.#finish();
  }

  attributeChangedCallback(name: string, o: string | null, n: string | null) {
    this.definition.getAttribute(name)?.attributeChangedCallback?.(this, o, n);
  }

  // --- public ---------------------------------------------------------
  get refs() {
    this.#ensureView();
    return this.#view?.refs;
  }

  get definition() {
    if (this.#def !== undefined) return this.#def;
    const def = WebComponentDefinition.forType(this.constructor);
    if (!def) throw new Error('WebComponentDefinitionが見つかりません。');
    this.#def = def;
    return def;
  }

  emitEvent<T>(type: string, detail?: T, opts?: CustomEventInit<T>) {
    if (!this.isConnected) return false;
    return this.dispatchEvent(new CustomEvent(type, { ...defaultEvt, ...opts, detail }));
  }
  forwardEvent(e: Event) {
    requestAnimationFrame(() => this.dispatchEvent(e));
  }

  static define(cfg?: WebComponentConfig): typeof WebComponent {
    // 静的コンテキストで 'this' を使うのを避けるため、明示的に型アサーションを行う
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    const ctor = this as typeof WebComponent;
    // definition プロパティが存在する場合のみ取得
    const definition = Object.prototype.hasOwnProperty.call(ctor, 'definition')
      ? (ctor as { definition?: WebComponentConfig }).definition
      : undefined;
    // cfg または definition のいずれかを優先して取得
    const config = cfg ?? definition;
    if (!config) {
      throw new Error('WebComponentConfig が指定されていません。');
    }
    WebComponentDefinition.compose(ctor, config).define();
    return ctor;
  }

  static compose(cfg: WebComponentConfig): WebComponentDefinition {
    // 'this' を静的コンテキストで使うのを避けるため、型アサーションを明示的に行う
    const ctor = WebComponent as typeof WebComponent;
    return WebComponentDefinition.compose(ctor, cfg);
  }

  // --- private --------------------------------------------------------
  #setup() {
    const { shadowOptions, styles } = this.definition;
    if (shadowOptions) {
      if (this.shadowRoot) {
        this.#sr = this.shadowRoot;
        this.#dsd = true;
      } else this.#sr = this.attachShadow(shadowOptions);
    }
    if (!this.#dsd && styles.length > 0) {
      const mergeSheets = (current: unknown, next: readonly CSSStyleSheet[]) => {
        const base = (() => {
          if (Array.isArray(current)) return current;
          if (!current) return [];
          try {
            return Array.from(current as ArrayLike<CSSStyleSheet>);
          } catch {
            return [];
          }
        })();
        return [...base, ...next];
      };

      if (this.#sr) {
        // Shadow DOMの場合、adoptedStyleSheetsを新しい配列で置き換える
        this.#sr.adoptedStyleSheets = mergeSheets(this.#sr.adoptedStyleSheets, styles);
      } else {
        // Light DOMの場合
        const root = this.getRootNode() as Document | ShadowRoot;
        // happy-dom等の環境では adoptedStyleSheets が配列ではない場合がある
        (root as Document | ShadowRoot).adoptedStyleSheets = mergeSheets(
          (root as Document | ShadowRoot).adoptedStyleSheets,
          styles,
        );
      }
    }
    for (const p of this.definition.properties) {
      const prop = p.property;
      if (prop && Object.prototype.hasOwnProperty.call(this, prop)) {
        const v = (this as Dict)[prop];
        delete (this as Dict)[prop];
        Attribute.captureInitialValue(this, prop, v);
      }
    }
  }

  #finish() {
    if (this.#init) return;
    this.#ensureView();
    Attribute.restoreInitialValues(this as Dict);
    if (this.#view && !this.#dsd) this.#view.appendTo(this.#sr ?? this);
    this.#init = true;
  }

  #ensureView() {
    if (this.#view || this.#init) return;
    const tmpl = this.definition.template;
    if (!tmpl) return;
    if (this.#dsd) {
      if (!this.#sr) return;
      this.#view = tmpl.hydrate(this.#sr);
    } else {
      this.#view = tmpl.create();
    }
  }
}
// FormComponent --------------------------------------------------------
// ---------------------------------------------------------------------

export class FormComponent extends WebComponent {
  static readonly formAssociated = true;
  #disabled = false;
  readonly _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  get disabled() {
    return this.#disabled;
  }
  set disabled(v: boolean) {
    this.toggleAttribute('disabled', v);
  }

  get form() {
    return this._internals.form;
  }
  get name() {
    return this.getAttribute('name');
  }
  get type() {
    return this.localName;
  }
  get validity() {
    return this._internals.validity;
  }
  get validationMessage() {
    return this._internals.validationMessage;
  }
  get willValidate() {
    return this._internals.willValidate;
  }

  checkValidity() {
    return this._internals.checkValidity();
  }
  reportValidity() {
    return this._internals.reportValidity();
  }
  formDisabledCallback(disabled: boolean) {
    this.#disabled = disabled;
  }
}

// ---------------------------------------------------------------------
// Keys / Orientation / ElementSelection --------------------------------
// ---------------------------------------------------------------------

export const Keys = Object.freeze({
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  home: 'Home',
  end: 'End',
  enter: 'Enter',
  space: ' ',
} as const);
export type KeyName = (typeof Keys)[keyof typeof Keys];

export const Orientation = Object.freeze({
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const);
export type OrientationValue = (typeof Orientation)[keyof typeof Orientation];

export class ElementSelection<T extends Element = Element> {
  #elements: T[];
  #current: T;
  constructor(elements: T[], current: T) {
    this.#elements = elements;
    this.#current = current;
  }

  get currentIndex() {
    return this.#elements.indexOf(this.#current);
  }
  get first() {
    return this.#elements[0];
  }
  get last() {
    return this.#elements[this.#elements.length - 1];
  }
  get next() {
    const i = this.#clamp(this.currentIndex + 1);
    return this.#elements[i];
  }
  get previous() {
    const i = this.#clamp(this.currentIndex - 1);
    return this.#elements[i];
  }

  forEach(cb: (el: T, isCurrent: boolean, index: number) => void): void {
    let idx = 0;
    for (const el of this.#elements) {
      cb(el, el === this.#current, idx);
      idx += 1;
    }
  }

  processKey(
    event: KeyboardEvent,
    cb: (el: T) => void,
    orientation: OrientationValue = Orientation.vertical,
  ) {
    const dir = getComputedStyle(this.#current).direction;
    const isVertical = orientation === Orientation.vertical;
    const isRtl = dir === 'rtl';

    let prevKey: KeyName;
    let nextKey: KeyName;

    if (isVertical) {
      prevKey = Keys.arrowUp;
      nextKey = Keys.arrowDown;
    } else if (isRtl) {
      prevKey = Keys.arrowRight;
      nextKey = Keys.arrowLeft;
    } else {
      prevKey = Keys.arrowLeft;
      nextKey = Keys.arrowRight;
    }

    let target: T | undefined;
    switch (event.key) {
      case prevKey:
        event.preventDefault();
        target = this.previous;
        break;
      case nextKey:
        event.preventDefault();
        target = this.next;
        break;
      case Keys.home:
        target = this.first;
        break;
      case Keys.end:
        target = this.last;
        break;
    }
    if (target) cb(target);
  }

  #clamp(i: number): number {
    if (i < 0) return 0;
    if (i >= this.#elements.length) return this.#elements.length - 1;
    return i;
  }

  static includingSimilarPeersOf<U extends Element>(
    selected: U,
    filter?: (el: U) => boolean,
  ): ElementSelection<U> {
    const parent = selected.parentElement;
    if (!parent) {
      throw new Error('親要素が存在しません。');
    }
    const peers = Array.from(parent.children) as U[];
    const matched = peers.filter(
      filter ?? ((e) => e.localName === selected.localName && !e.hasAttribute('hidden')),
    );
    return new ElementSelection(matched, selected);
  }
}
