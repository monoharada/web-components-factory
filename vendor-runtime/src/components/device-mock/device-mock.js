/**
 * @module device-mock
 * デバイス画面モックコンポーネント
 * @version 1.0.0
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsDeviceMock_instances, _DadsDeviceMock_frame, _DadsDeviceMock_frameShape, _DadsDeviceMock_syncDeviceState, _DadsDeviceMock_syncFrameGeometry, _DadsDeviceMock_syncVisibleHeight;
import { PropertyAttr, WebComponent, html } from '../../core/web-components.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { deviceMockTokens } from './device-mock-tokens.js';
import { deviceMockStyles } from './device-mock-styles.js';
const DEFAULT_DEVICE = 'mobile';
const DEVICE_FRAME_CONFIG = {
    desktop: {
        viewBox: '0 0 1454 1038',
        x: '3.5',
        y: '3.5',
        width: '1447',
        height: '1031',
        rx: '11.5',
        strokeWidth: '7',
    },
    tablet: {
        viewBox: '0 0 782 1038',
        x: '3.5',
        y: '3.5',
        width: '775',
        height: '1031',
        rx: '19.5',
        strokeWidth: '7',
    },
    mobile: {
        viewBox: '0 0 405 864',
        x: '3',
        y: '3',
        width: '399',
        height: '858',
        rx: '27',
        strokeWidth: '6',
    },
};
function normalizeDevice(value) {
    const normalized = value?.trim().toLowerCase();
    if (normalized === 'desktop' || normalized === 'tablet' || normalized === 'mobile') {
        return normalized;
    }
    return DEFAULT_DEVICE;
}
function normalizeVisibleHeight(value) {
    if (value === null)
        return null;
    const normalized = value.trim();
    return normalized === '' ? null : normalized;
}
/**
 * デバイスモック
 *
 * desktop / tablet / mobile の端末フレームと safe-area コンテナを提供します。
 *
 * @customElement dads-device-mock
 * @tagname dads-device-mock
 *
 * @slot default - safe-area 内に配置するコンテンツ
 *
 * @csspart base - 外側ラッパー
 * @csspart frame - 端末フレーム SVG
 * @csspart frame-shape - 端末枠線の矩形
 * @csspart screen - 画面領域
 * @csspart safe-area - safe-area コンテンツ領域
 *
 * @attr {'desktop'|'tablet'|'mobile'} device - デバイス種別
 * @attr {string} visible-height - モック全体の可視高さ（例: 220px, 16rem）
 *
 * @cssprop --dads-device-mock-frame-width - フレーム幅
 * @cssprop --dads-device-mock-aspect-ratio - フレーム比率
 * @cssprop --dads-device-mock-screen-inset - 画面領域の内側余白
 * @cssprop --dads-device-mock-screen-radius - 画面領域の角丸
 * @cssprop --dads-device-mock-safe-area-top - 上部safe-area
 * @cssprop --dads-device-mock-screen-background - 画面背景色
 * @cssprop --dads-device-mock-frame-stroke-width - フレーム線幅
 * @cssprop --dads-device-mock-frame-stroke-color - フレーム線色
 * @cssprop --dads-device-mock-visible-height - モック全体の可視高さ（未指定時は全高）
 */
export class DadsDeviceMock extends WebComponent {
    constructor() {
        super(...arguments);
        _DadsDeviceMock_instances.add(this);
        _DadsDeviceMock_frame.set(this, null);
        _DadsDeviceMock_frameShape.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsDeviceMock_frame, this.shadowRoot?.querySelector('[part="frame"]'), "f");
        __classPrivateFieldSet(this, _DadsDeviceMock_frameShape, this.shadowRoot?.querySelector('[part="frame-shape"]'), "f");
        __classPrivateFieldGet(this, _DadsDeviceMock_instances, "m", _DadsDeviceMock_syncDeviceState).call(this);
        __classPrivateFieldGet(this, _DadsDeviceMock_instances, "m", _DadsDeviceMock_syncVisibleHeight).call(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isConnected)
            return;
        if (oldValue === newValue)
            return;
        if (name === 'device') {
            __classPrivateFieldGet(this, _DadsDeviceMock_instances, "m", _DadsDeviceMock_syncDeviceState).call(this);
            return;
        }
        if (name === 'visible-height') {
            __classPrivateFieldGet(this, _DadsDeviceMock_instances, "m", _DadsDeviceMock_syncVisibleHeight).call(this);
        }
    }
}
_DadsDeviceMock_frame = new WeakMap(), _DadsDeviceMock_frameShape = new WeakMap(), _DadsDeviceMock_instances = new WeakSet(), _DadsDeviceMock_syncDeviceState = function _DadsDeviceMock_syncDeviceState() {
    const normalized = normalizeDevice(this.getAttribute('device'));
    if (this.getAttribute('device') !== normalized) {
        this.setAttribute('device', normalized);
        return;
    }
    this.setAttribute('data-device-kind', normalized);
    __classPrivateFieldGet(this, _DadsDeviceMock_instances, "m", _DadsDeviceMock_syncFrameGeometry).call(this, normalized);
}, _DadsDeviceMock_syncFrameGeometry = function _DadsDeviceMock_syncFrameGeometry(device) {
    const frame = __classPrivateFieldGet(this, _DadsDeviceMock_frame, "f");
    const frameShape = __classPrivateFieldGet(this, _DadsDeviceMock_frameShape, "f");
    if (!frame || !frameShape)
        return;
    const config = DEVICE_FRAME_CONFIG[device];
    frame.setAttribute('viewBox', config.viewBox);
    frameShape.setAttribute('x', config.x);
    frameShape.setAttribute('y', config.y);
    frameShape.setAttribute('width', config.width);
    frameShape.setAttribute('height', config.height);
    frameShape.setAttribute('rx', config.rx);
    frameShape.setAttribute('stroke-width', config.strokeWidth);
}, _DadsDeviceMock_syncVisibleHeight = function _DadsDeviceMock_syncVisibleHeight() {
    const normalized = normalizeVisibleHeight(this.getAttribute('visible-height'));
    if (normalized === null) {
        this.removeAttribute('data-frame-clipped');
        this.style.removeProperty('--dads-device-mock-visible-height');
        return;
    }
    this.setAttribute('data-frame-clipped', '');
    this.style.setProperty('--dads-device-mock-visible-height', normalized);
};
DadsDeviceMock.definition = {
    name: 'dads-device-mock',
    template: html `
      <div part="base">
        <div id="canvas">
          <svg part="frame" viewBox="0 0 405 864" aria-hidden="true" focusable="false">
            <rect part="frame-shape" x="3" y="3" width="399" height="858" rx="27" stroke-width="6"></rect>
          </svg>
          <div part="screen">
            <div part="safe-area">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        deviceMockTokens,
        deviceMockStyles,
    ], 'minimal'),
    attributes: [PropertyAttr('device'), PropertyAttr('visible-height')],
};
