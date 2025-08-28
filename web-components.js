/* ---------------------------------------------------------------------------
 * Web‑Component Utility Library – TypeScript (strict) ★ no any / no Array.forEach
 * ---------------------------------------------------------------------------*/
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _View_fragment, _View_refs, _ViewTemplate_fragment, _ViewTemplate_html, _WebComponentDefinition_type, _WebComponentDefinition_name, _WebComponentDefinition_template, _WebComponentDefinition_styles, _WebComponentDefinition_registry, _WebComponentDefinition_shadowOptions, _WebComponentDefinition_elemOptions, _WebComponentDefinition_componentAttribute, _WebComponentDefinition_byProp, _WebComponentDefinition_byAttr, _WebComponent_instances, _WebComponent_view, _WebComponent_def, _WebComponent_init, _WebComponent_sr, _WebComponent_dsd, _WebComponent_setup, _WebComponent_finish, _WebComponent_ensureView, _FormComponent_disabled, _ElementSelection_instances, _ElementSelection_elements, _ElementSelection_current, _ElementSelection_clamp;
// ---------------------------------------------------------------------
// AdoptableStyles ------------------------------------------------------
// ---------------------------------------------------------------------
const styleCache = new Map();
const emptySheets = Object.freeze([]);
function valueToSheet(v) {
    return typeof v === 'string' ? AdoptableStyles.for(v) : v;
}
export const AdoptableStyles = Object.freeze({
    normalize(v) {
        if (Array.isArray(v))
            return v.map(valueToSheet);
        if (v)
            return [valueToSheet(v)];
        return emptySheets;
    },
    for(cssText) {
        const cached = styleCache.get(cssText);
        if (cached)
            return cached;
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        styleCache.set(cssText, sheet);
        return sheet;
    },
});
export function css(strings, ...values) {
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
export class View {
    get refs() {
        return __classPrivateFieldGet(this, _View_refs, "f");
    }
    constructor(fragment) {
        _View_fragment.set(this, void 0);
        _View_refs.set(this, Object.create(null));
        __classPrivateFieldSet(this, _View_fragment, fragment, "f");
        const elements = __classPrivateFieldGet(this, _View_fragment, "f").querySelectorAll('[id]');
        for (const el of elements) {
            __classPrivateFieldGet(this, _View_refs, "f")[el.id] = el;
        }
    }
    appendTo(node) {
        node.appendChild(__classPrivateFieldGet(this, _View_fragment, "f"));
    }
}
_View_fragment = new WeakMap(), _View_refs = new WeakMap();
const templateCache = new Map();
export class ViewTemplate {
    constructor(html) {
        _ViewTemplate_fragment.set(this, void 0);
        _ViewTemplate_html.set(this, void 0);
        __classPrivateFieldSet(this, _ViewTemplate_html, html, "f");
    }
    create() {
        if (!__classPrivateFieldGet(this, _ViewTemplate_fragment, "f")) {
            const t = document.createElement('template');
            t.innerHTML = __classPrivateFieldGet(this, _ViewTemplate_html, "f");
            __classPrivateFieldSet(this, _ViewTemplate_fragment, document.adoptNode(t.content), "f");
        }
        return new View(__classPrivateFieldGet(this, _ViewTemplate_fragment, "f").cloneNode(true));
    }
    hydrate(sr) {
        return new View(sr);
    }
    toString() {
        return __classPrivateFieldGet(this, _ViewTemplate_html, "f");
    }
    static for(htmlText) {
        const cached = templateCache.get(htmlText);
        if (cached)
            return cached;
        const t = new ViewTemplate(htmlText);
        templateCache.set(htmlText, t);
        return t;
    }
}
_ViewTemplate_fragment = new WeakMap(), _ViewTemplate_html = new WeakMap();
export function html(strings, ...values) {
    let out = '';
    for (let i = 0, end = strings.length - 1; i < end; ++i) {
        out += strings[i];
        const v = values[i];
        out += Array.isArray(v) ? v.join('') : String(v);
    }
    out += strings[strings.length - 1];
    return ViewTemplate.for(out);
}
function invokeCallback(instance, cbName, oldVal, newVal) {
    const obj = instance;
    const fn = obj[cbName];
    if (typeof fn === 'function') {
        fn.call(instance, oldVal, newVal);
    }
}
function BaseAttr(property, attribute = property) {
    const cb = `${property}Changed`;
    return {
        attribute,
        attributeChangedCallback(instance, oldVal, newVal) {
            invokeCallback(instance, cb, oldVal, newVal);
        },
    };
}
export const ContentAttr = (name) => BaseAttr(name);
export function PropertyAttr(property, attribute = property) {
    return Object.assign(BaseAttr(property, attribute), {
        property,
        getValue: (el) => el.getAttribute(attribute),
        setValue: (el, v) => {
            if (v == null)
                el.removeAttribute(attribute);
            else
                el.setAttribute(attribute, String(v));
        },
    });
}
PropertyAttr.is = (v) => typeof v === 'object' && v !== null && 'property' in v;
export function BooleanAttr(property, attribute = property) {
    return Object.assign(BaseAttr(property, attribute), {
        property,
        getValue: (el) => el.hasAttribute(attribute),
        setValue: (el, v) => el.toggleAttribute(attribute, Boolean(v)),
    });
}
export function TransferringPropertyAttr(target, property, attribute = property, remove = false) {
    const cb = `${property}Changed`;
    const lock = new WeakSet();
    return {
        property,
        attribute,
        getValue(i) {
            const trg = i.refs[target];
            if (trg && typeof trg.getAttribute === 'function') {
                return trg.getAttribute(attribute);
            }
            return undefined;
        },
        setValue(i, v) {
            const trg = i.refs[target];
            if (!trg || !(trg instanceof HTMLElement))
                return;
            const old = trg.getAttribute(attribute);
            if (v == null)
                trg.removeAttribute(attribute);
            else
                trg.setAttribute(attribute, String(v));
            invokeCallback(i, cb, old, v);
        },
        tryTransfer(i) {
            if (lock.has(i))
                return false;
            lock.add(i);
            const trg = i.refs[target];
            if (!trg)
                return false;
            const val = i.getAttribute(attribute);
            if (remove)
                i.removeAttribute(attribute);
            if (val == null) {
                trg.removeAttribute(attribute);
            }
            else {
                trg.setAttribute(attribute, val);
            }
            lock.delete(i);
            return true;
        },
        attributeChangedCallback(i, o, n) {
            if (this.tryTransfer?.(i))
                invokeCallback(i, cb, o, n);
        },
    };
}
export function NonReflectingPropertyAttr(property, attribute = property) {
    const cb = `${property}Changed`;
    const field = new WeakMap();
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
const initial = new WeakMap();
export const Attribute = Object.freeze({
    normalize(arr) {
        if (!arr)
            return [];
        return arr.map((a) => (typeof a === 'string' ? PropertyAttr(a) : a));
    },
    captureInitialValue(obj, key, v) {
        let rec = initial.get(obj);
        if (!rec) {
            rec = {};
            initial.set(obj, rec);
        }
        rec[key] = v;
    },
    restoreInitialValues(obj) {
        const rec = initial.get(obj);
        if (!rec)
            return;
        for (const k of Object.keys(rec)) {
            if (!(k in obj))
                obj[k] = rec[k];
        }
        initial.delete(obj);
    },
});
const defByType = new WeakMap();
const ctorSecret = Symbol('ctor');
export class WebComponentDefinition {
    constructor(secret, type, cfg) {
        _WebComponentDefinition_type.set(this, void 0);
        _WebComponentDefinition_name.set(this, void 0);
        _WebComponentDefinition_template.set(this, void 0);
        _WebComponentDefinition_styles.set(this, void 0);
        _WebComponentDefinition_registry.set(this, void 0);
        _WebComponentDefinition_shadowOptions.set(this, void 0);
        _WebComponentDefinition_elemOptions.set(this, void 0);
        _WebComponentDefinition_componentAttribute.set(this, void 0);
        _WebComponentDefinition_byProp.set(this, new Map());
        _WebComponentDefinition_byAttr.set(this, new Map());
        if (secret !== ctorSecret)
            throw new Error('Use compose()');
        __classPrivateFieldSet(this, _WebComponentDefinition_type, type, "f");
        __classPrivateFieldSet(this, _WebComponentDefinition_name, cfg.name, "f");
        __classPrivateFieldSet(this, _WebComponentDefinition_template, cfg.template ?? null, "f");
        __classPrivateFieldSet(this, _WebComponentDefinition_styles, AdoptableStyles.normalize(cfg.styles), "f");
        __classPrivateFieldSet(this, _WebComponentDefinition_registry, cfg.registry ?? customElements, "f");
        __classPrivateFieldSet(this, _WebComponentDefinition_shadowOptions, cfg.shadowOptions === undefined ? { mode: 'open' } : cfg.shadowOptions || undefined, "f");
        __classPrivateFieldSet(this, _WebComponentDefinition_elemOptions, { ...cfg.elementOptions }, "f");
        __classPrivateFieldSet(this, _WebComponentDefinition_componentAttribute, cfg.componentAttribute ?? 'data-sa-component', "f");
        for (const a of Attribute.normalize(cfg.attributes)) {
            __classPrivateFieldGet(this, _WebComponentDefinition_byAttr, "f").set(a.attribute?.toLowerCase?.() ?? a.attribute, a);
            if ('property' in a && a.property) {
                __classPrivateFieldGet(this, _WebComponentDefinition_byProp, "f").set(a.property, a);
                Object.defineProperty(type.prototype, a.property, {
                    configurable: true,
                    get() {
                        return a.getValue?.(this);
                    },
                    set(v) {
                        a.setValue?.(this, v);
                    },
                });
            }
        }
        defByType.set(type, this);
    }
    get name() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_name, "f");
    }
    get template() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_template, "f");
    }
    get styles() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_styles, "f");
    }
    get shadowOptions() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_shadowOptions, "f");
    }
    get elementOptions() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_elemOptions, "f");
    }
    get componentAttribute() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_componentAttribute, "f");
    }
    get attributes() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_byAttr, "f").values();
    }
    get properties() {
        return __classPrivateFieldGet(this, _WebComponentDefinition_byProp, "f").values();
    }
    getAttribute(attr) {
        return __classPrivateFieldGet(this, _WebComponentDefinition_byAttr, "f").get(attr);
    }
    define(reg = __classPrivateFieldGet(this, _WebComponentDefinition_registry, "f")) {
        if (!reg.get(__classPrivateFieldGet(this, _WebComponentDefinition_name, "f")))
            reg.define(__classPrivateFieldGet(this, _WebComponentDefinition_name, "f"), __classPrivateFieldGet(this, _WebComponentDefinition_type, "f"), __classPrivateFieldGet(this, _WebComponentDefinition_elemOptions, "f"));
        return this;
    }
    static compose(base, cfg) {
        if (defByType.has(base)) {
            // @ts-ignore - TS thinks this needs a mixin constructor, but it leads to other issues.
            const Derived = class extends base {
            };
            return new WebComponentDefinition(ctorSecret, Derived, cfg);
        }
        return new WebComponentDefinition(ctorSecret, base, cfg);
    }
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    static forType(type) {
        return defByType.get(type);
    }
}
_WebComponentDefinition_type = new WeakMap(), _WebComponentDefinition_name = new WeakMap(), _WebComponentDefinition_template = new WeakMap(), _WebComponentDefinition_styles = new WeakMap(), _WebComponentDefinition_registry = new WeakMap(), _WebComponentDefinition_shadowOptions = new WeakMap(), _WebComponentDefinition_elemOptions = new WeakMap(), _WebComponentDefinition_componentAttribute = new WeakMap(), _WebComponentDefinition_byProp = new WeakMap(), _WebComponentDefinition_byAttr = new WeakMap();
// ---------------------------------------------------------------------
// WebComponent ---------------------------------------------------------
// ---------------------------------------------------------------------
const defaultEvt = { bubbles: true, composed: true, cancelable: true };
export class WebComponent extends HTMLElement {
    static get observedAttributes() {
        const def = WebComponentDefinition.forType(WebComponent) ??
            WebComponentDefinition.compose(WebComponent, {
                name: 'dummy',
            });
        return Array.from(def.attributes).map((a) => a.attribute);
    }
    constructor() {
        super();
        _WebComponent_instances.add(this);
        _WebComponent_view.set(this, null);
        _WebComponent_def.set(this, void 0);
        _WebComponent_init.set(this, false);
        _WebComponent_sr.set(this, void 0);
        _WebComponent_dsd.set(this, false);
        __classPrivateFieldGet(this, _WebComponent_instances, "m", _WebComponent_setup).call(this);
    }
    connectedCallback() {
        // Web componentsの識別用属性を追加
        const attr = this.definition.componentAttribute;
        if (attr !== false) {
            this.setAttribute(attr, '');
        }
        __classPrivateFieldGet(this, _WebComponent_instances, "m", _WebComponent_finish).call(this);
    }
    attributeChangedCallback(name, o, n) {
        this.definition.getAttribute(name)?.attributeChangedCallback?.(this, o, n);
    }
    // --- public ---------------------------------------------------------
    get refs() {
        __classPrivateFieldGet(this, _WebComponent_instances, "m", _WebComponent_ensureView).call(this);
        return __classPrivateFieldGet(this, _WebComponent_view, "f")?.refs;
    }
    get definition() {
        if (__classPrivateFieldGet(this, _WebComponent_def, "f") !== undefined)
            return __classPrivateFieldGet(this, _WebComponent_def, "f");
        const def = WebComponentDefinition.forType(this.constructor);
        if (!def)
            throw new Error('WebComponentDefinitionが見つかりません。');
        __classPrivateFieldSet(this, _WebComponent_def, def, "f");
        return def;
    }
    emitEvent(type, detail, opts) {
        if (!this.isConnected)
            return false;
        return this.dispatchEvent(new CustomEvent(type, { ...defaultEvt, ...opts, detail }));
    }
    forwardEvent(e) {
        requestAnimationFrame(() => this.dispatchEvent(e));
    }
    static define(cfg) {
        // 静的コンテキストで 'this' を使うのを避けるため、明示的に型アサーションを行う
        // biome-ignore lint/complexity/noThisInStatic: <explanation>
        const ctor = this;
        // definition プロパティが存在する場合のみ取得
        const definition = Object.prototype.hasOwnProperty.call(ctor, 'definition')
            ? ctor.definition
            : undefined;
        // cfg または definition のいずれかを優先して取得
        const config = cfg ?? definition;
        if (!config) {
            throw new Error('WebComponentConfig が指定されていません。');
        }
        WebComponentDefinition.compose(ctor, config).define();
        return ctor;
    }
    static compose(cfg) {
        // 'this' を静的コンテキストで使うのを避けるため、型アサーションを明示的に行う
        const ctor = WebComponent;
        return WebComponentDefinition.compose(ctor, cfg);
    }
}
_WebComponent_view = new WeakMap(), _WebComponent_def = new WeakMap(), _WebComponent_init = new WeakMap(), _WebComponent_sr = new WeakMap(), _WebComponent_dsd = new WeakMap(), _WebComponent_instances = new WeakSet(), _WebComponent_setup = function _WebComponent_setup() {
    const { shadowOptions, styles } = this.definition;
    if (shadowOptions) {
        if (this.shadowRoot) {
            __classPrivateFieldSet(this, _WebComponent_sr, this.shadowRoot, "f");
            __classPrivateFieldSet(this, _WebComponent_dsd, true, "f");
        }
        else
            __classPrivateFieldSet(this, _WebComponent_sr, this.attachShadow(shadowOptions), "f");
    }
    if (!__classPrivateFieldGet(this, _WebComponent_dsd, "f")) {
        const target = __classPrivateFieldGet(this, _WebComponent_sr, "f")
            ? __classPrivateFieldGet(this, _WebComponent_sr, "f").adoptedStyleSheets
            : this.getRootNode().adoptedStyleSheets;
        for (const s of styles)
            target.push(s);
    }
    for (const p of this.definition.properties) {
        const prop = p.property;
        if (prop && Object.prototype.hasOwnProperty.call(this, prop)) {
            const v = this[prop];
            delete this[prop];
            Attribute.captureInitialValue(this, prop, v);
        }
    }
}, _WebComponent_finish = function _WebComponent_finish() {
    if (__classPrivateFieldGet(this, _WebComponent_init, "f"))
        return;
    __classPrivateFieldGet(this, _WebComponent_instances, "m", _WebComponent_ensureView).call(this);
    Attribute.restoreInitialValues(this);
    if (__classPrivateFieldGet(this, _WebComponent_view, "f") && !__classPrivateFieldGet(this, _WebComponent_dsd, "f"))
        __classPrivateFieldGet(this, _WebComponent_view, "f").appendTo(__classPrivateFieldGet(this, _WebComponent_sr, "f") ?? this);
    __classPrivateFieldSet(this, _WebComponent_init, true, "f");
}, _WebComponent_ensureView = function _WebComponent_ensureView() {
    if (__classPrivateFieldGet(this, _WebComponent_view, "f") || __classPrivateFieldGet(this, _WebComponent_init, "f"))
        return;
    const tmpl = this.definition.template;
    if (!tmpl)
        return;
    if (__classPrivateFieldGet(this, _WebComponent_dsd, "f")) {
        if (!__classPrivateFieldGet(this, _WebComponent_sr, "f"))
            return;
        __classPrivateFieldSet(this, _WebComponent_view, tmpl.hydrate(__classPrivateFieldGet(this, _WebComponent_sr, "f")), "f");
    }
    else {
        __classPrivateFieldSet(this, _WebComponent_view, tmpl.create(), "f");
    }
};
// FormComponent --------------------------------------------------------
// ---------------------------------------------------------------------
export class FormComponent extends WebComponent {
    constructor() {
        super();
        _FormComponent_disabled.set(this, false);
        this._internals = this.attachInternals();
    }
    get disabled() {
        return __classPrivateFieldGet(this, _FormComponent_disabled, "f");
    }
    set disabled(v) {
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
    formDisabledCallback(disabled) {
        __classPrivateFieldSet(this, _FormComponent_disabled, disabled, "f");
    }
}
_FormComponent_disabled = new WeakMap();
FormComponent.formAssociated = true;
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
});
export const Orientation = Object.freeze({
    horizontal: 'horizontal',
    vertical: 'vertical',
});
export class ElementSelection {
    constructor(elements, current) {
        _ElementSelection_instances.add(this);
        _ElementSelection_elements.set(this, void 0);
        _ElementSelection_current.set(this, void 0);
        __classPrivateFieldSet(this, _ElementSelection_elements, elements, "f");
        __classPrivateFieldSet(this, _ElementSelection_current, current, "f");
    }
    get currentIndex() {
        return __classPrivateFieldGet(this, _ElementSelection_elements, "f").indexOf(__classPrivateFieldGet(this, _ElementSelection_current, "f"));
    }
    get first() {
        return __classPrivateFieldGet(this, _ElementSelection_elements, "f")[0];
    }
    get last() {
        return __classPrivateFieldGet(this, _ElementSelection_elements, "f")[__classPrivateFieldGet(this, _ElementSelection_elements, "f").length - 1];
    }
    get next() {
        const i = __classPrivateFieldGet(this, _ElementSelection_instances, "m", _ElementSelection_clamp).call(this, this.currentIndex + 1);
        return __classPrivateFieldGet(this, _ElementSelection_elements, "f")[i];
    }
    get previous() {
        const i = __classPrivateFieldGet(this, _ElementSelection_instances, "m", _ElementSelection_clamp).call(this, this.currentIndex - 1);
        return __classPrivateFieldGet(this, _ElementSelection_elements, "f")[i];
    }
    forEach(cb) {
        __classPrivateFieldGet(this, _ElementSelection_elements, "f").forEach((el, idx) => cb(el, el === __classPrivateFieldGet(this, _ElementSelection_current, "f"), idx));
    }
    processKey(event, cb, orientation = Orientation.vertical) {
        const dir = getComputedStyle(__classPrivateFieldGet(this, _ElementSelection_current, "f")).direction;
        const prevKey = orientation === Orientation.vertical
            ? Keys.arrowUp
            : dir === 'rtl'
                ? Keys.arrowRight
                : Keys.arrowLeft;
        const nextKey = orientation === Orientation.vertical
            ? Keys.arrowDown
            : dir === 'rtl'
                ? Keys.arrowLeft
                : Keys.arrowRight;
        let target;
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
        if (target)
            cb(target);
    }
    static includingSimilarPeersOf(selected, filter) {
        const parent = selected.parentElement;
        if (!parent) {
            throw new Error('親要素が存在しません。');
        }
        const peers = Array.from(parent.children);
        const matched = peers.filter(filter ?? ((e) => e.localName === selected.localName && !e.hasAttribute('hidden')));
        return new ElementSelection(matched, selected);
    }
}
_ElementSelection_elements = new WeakMap(), _ElementSelection_current = new WeakMap(), _ElementSelection_instances = new WeakSet(), _ElementSelection_clamp = function _ElementSelection_clamp(i) {
    return i < 0 ? 0 : i >= __classPrivateFieldGet(this, _ElementSelection_elements, "f").length ? __classPrivateFieldGet(this, _ElementSelection_elements, "f").length - 1 : i;
};
