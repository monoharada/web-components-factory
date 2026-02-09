/**
 * @module device-mock
 * デバイス画面モックコンポーネント
 * @version 1.0.0
 */

import { PropertyAttr, WebComponent, html } from '../../core/web-components.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { deviceMockTokens } from './device-mock-tokens.js';
import { deviceMockStyles } from './device-mock-styles.js';

type DadsDeviceMockDevice = 'desktop' | 'tablet' | 'mobile';

const DEFAULT_DEVICE = 'mobile' as const;

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
} as const satisfies Record<DadsDeviceMockDevice, {
  viewBox: string;
  x: string;
  y: string;
  width: string;
  height: string;
  rx: string;
  strokeWidth: string;
}>;

function normalizeDevice(value: string | null): DadsDeviceMockDevice {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'desktop' || normalized === 'tablet' || normalized === 'mobile') {
    return normalized;
  }
  return DEFAULT_DEVICE;
}

function normalizeVisibleHeight(value: string | null): string | null {
  if (value === null) return null;
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
  #frame: SVGSVGElement | null = null;
  #frameShape: SVGRectElement | null = null;

  static definition = {
    name: 'dads-device-mock',
    template: html`
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
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        deviceMockTokens,
        deviceMockStyles,
      ],
      'minimal',
    ),
    attributes: [PropertyAttr('device'), PropertyAttr('visible-height')],
  };

  declare device: DadsDeviceMockDevice;

  connectedCallback(): void {
    super.connectedCallback();

    this.#frame = this.shadowRoot?.querySelector('[part="frame"]') as SVGSVGElement | null;
    this.#frameShape = this.shadowRoot?.querySelector('[part="frame-shape"]') as SVGRectElement | null;

    this.#syncDeviceState();
    this.#syncVisibleHeight();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!this.isConnected) return;
    if (oldValue === newValue) return;
    if (name === 'device') {
      this.#syncDeviceState();
      return;
    }

    if (name === 'visible-height') {
      this.#syncVisibleHeight();
    }
  }

  #syncDeviceState(): void {
    const normalized = normalizeDevice(this.getAttribute('device'));
    if (this.getAttribute('device') !== normalized) {
      this.setAttribute('device', normalized);
      return;
    }

    this.setAttribute('data-device-kind', normalized);
    this.#syncFrameGeometry(normalized);
  }

  #syncFrameGeometry(device: DadsDeviceMockDevice): void {
    const frame = this.#frame;
    const frameShape = this.#frameShape;
    if (!frame || !frameShape) return;

    const config = DEVICE_FRAME_CONFIG[device];
    frame.setAttribute('viewBox', config.viewBox);
    frameShape.setAttribute('x', config.x);
    frameShape.setAttribute('y', config.y);
    frameShape.setAttribute('width', config.width);
    frameShape.setAttribute('height', config.height);
    frameShape.setAttribute('rx', config.rx);
    frameShape.setAttribute('stroke-width', config.strokeWidth);
  }

  #syncVisibleHeight(): void {
    const normalized = normalizeVisibleHeight(this.getAttribute('visible-height'));
    if (normalized === null) {
      this.removeAttribute('data-frame-clipped');
      this.style.removeProperty('--dads-device-mock-visible-height');
      return;
    }
    this.setAttribute('data-frame-clipped', '');
    this.style.setProperty('--dads-device-mock-visible-height', normalized);
  }
}
