/**
 * @module progress
 * デジタル庁デザインシステム準拠 Progress コンポーネント
 * @version 0.1.0
 */

import {
  html,
  BooleanAttr,
  PropertyAttr,
  TransferringPropertyAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { hasSlotContent } from '../../utils/dom.js';
import { progressTokens } from './progress-tokens.js';
import { progressStyles } from './progress-styles.js';

type ProgressShape = 'linear' | 'circular' | 'segmented';
type ProgressSize = 'sm' | 'md' | 'lg';
type StatusLive = 'off' | 'polite' | 'assertive';
type SegmentMode = 'ratio' | 'steps';

type RefsHost = { refs?: Record<string, unknown> };

const CIRCULAR_RADIUS = 45;
const CIRCULAR_CIRCUMFERENCE = 2 * Math.PI * CIRCULAR_RADIUS;

function getRef<T extends Element>(host: RefsHost, id: string): T | null {
  const el = host.refs?.[id];
  return el instanceof Element ? (el as T) : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function clampInt(value: number, min: number, max: number): number {
  return Math.trunc(clamp(value, min, max));
}

function parseNumber(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseIntNumber(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeShape(value: string | null): ProgressShape {
  if (value === 'circular' || value === 'segmented') return value;
  return 'linear';
}

function normalizeSize(value: string | null): ProgressSize {
  if (value === 'sm' || value === 'lg') return value;
  return 'md';
}

function normalizeStatusLive(value: string | null): StatusLive {
  if (value === 'polite' || value === 'assertive') return value;
  return 'off';
}

function normalizeSegmentMode(value: string | null): SegmentMode {
  return value === 'steps' ? 'steps' : 'ratio';
}

function normalizeOptionalText(value: string | null): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toPercentText(ratio: number): string {
  return `${Math.round(clamp(ratio, 0, 1) * 100)}%`;
}

interface ProgressState {
  shape: ProgressShape;
  size: ProgressSize;
  min: number;
  max: number;
  value: number;
  indeterminate: boolean;
  statusLive: StatusLive;
  explicitValueText: string | null;
  segmentMode: SegmentMode;
  segments: number;
  currentStep: number;
  totalSteps: number;
  ratio: number;
  ariaMin: number;
  ariaMax: number;
  ariaNow: number | null;
  ariaValueText: string;
  segmentCount: number;
  filledSegments: number;
  statusKey: string;
}

/**
 * Progress コンポーネント
 *
 * @customElement dads-progress
 * @tagname dads-progress
 *
 * @slot label - 可視ラベル
 * @slot value-text - 可視値テキスト
 *
 * @csspart root - ルート
 * @csspart label - ラベル領域
 * @csspart bar - 進捗本体（progressbar）
 * @csspart track - linear のトラック
 * @csspart fill - linear のフィル
 * @csspart circular-svg - circular SVG
 * @csspart circular-track - circular トラック
 * @csspart circular-fill - circular フィル
 * @csspart segments - segmented ラッパー
 * @csspart segment - segmented の1区画
 * @csspart segment-fill - segmented の塗り
 * @csspart value-text - 可視値テキスト領域
 * @csspart status - live領域（visually-hidden）
 *
 * @attr {'linear' | 'circular' | 'segmented'} shape - 表示形状
 * @attr {'sm' | 'md' | 'lg'} size - サイズ
 * @attr {string} min - 最小値
 * @attr {string} max - 最大値
 * @attr {string} value - 現在値
 * @attr {boolean} indeterminate - 不確定状態
 * @attr {'off' | 'polite' | 'assertive'} status-live - live通知レベル
 * @attr {string} value-text - aria-valuetext / 可視値の明示上書き
 * @attr {'ratio' | 'steps'} segment-mode - segmented 用モード
 * @attr {string} segments - ratioモード時の分割数
 * @attr {string} current-step - stepsモード時の現在ステップ
 * @attr {string} total-steps - stepsモード時の総ステップ
 *
 * @cssprop --dads-progress-track-color - トラック色
 * @cssprop --dads-progress-fill-color - フィル色
 * @cssprop --dads-progress-height - linear/segmented 高さ
 * @cssprop --dads-progress-radius - 角丸
 * @cssprop --dads-progress-size - circular 直径
 * @cssprop --dads-progress-stroke-width - circular 線幅
 * @cssprop --dads-progress-segment-gap - segmented の間隔
 * @cssprop --dads-progress-animation-duration - アニメーション時間
 * @cssprop --dads-progress-label-color - ラベル色
 * @cssprop --dads-progress-value-color - 値色
 */
export class DadsProgress extends TypographyWebComponent {
  static readonly version = '0.1.0';

  static definition = {
    name: 'dads-progress',
    template: html`
      <div part="root" id="root">
        <div part="label" id="label" hidden>
          <slot name="label" id="label-slot"></slot>
        </div>

        <div part="bar" id="bar" role="progressbar">
          <div part="track" id="track" aria-hidden="true">
            <span part="fill" id="fill"></span>
          </div>

          <svg part="circular-svg" id="circular-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <circle part="circular-track" id="circular-track" cx="50" cy="50" r="45"></circle>
            <circle part="circular-fill" id="circular-fill" cx="50" cy="50" r="45"></circle>
          </svg>

          <div part="segments" id="segments" aria-hidden="true"></div>
        </div>

        <div part="value-text" id="value-text" hidden>
          <slot name="value-text" id="value-text-slot"></slot>
          <span id="value-text-attr"></span>
        </div>

        <p part="visually-hidden status" id="status"></p>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      progressTokens,
      progressStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('shape'),
      PropertyAttr('size'),
      PropertyAttr('min'),
      PropertyAttr('max'),
      PropertyAttr('value'),
      BooleanAttr('indeterminate'),
      PropertyAttr('statusLive', 'status-live'),
      PropertyAttr('valueText', 'value-text'),
      PropertyAttr('segmentMode', 'segment-mode'),
      PropertyAttr('segments'),
      PropertyAttr('currentStep', 'current-step'),
      PropertyAttr('totalSteps', 'total-steps'),
      TransferringPropertyAttr('bar', 'ariaLabel', 'aria-label'),
      TransferringPropertyAttr('bar', 'ariaLabelledby', 'aria-labelledby'),
    ],
  };

  declare shape: string | null;
  declare size: string | null;
  declare min: string | null;
  declare max: string | null;
  declare value: string | null;
  declare indeterminate: boolean;
  declare statusLive: string | null;
  declare valueText: string | null;
  declare segmentMode: string | null;
  declare segments: string | null;
  declare currentStep: string | null;
  declare totalSteps: string | null;

  #labelSlot: HTMLSlotElement | null = null;
  #valueTextSlot: HTMLSlotElement | null = null;
  #lastStatusKey: string | null = null;
  #lastStatusMessage: string | null = null;
  #ready = false;

  connectedCallback(): void {
    super.connectedCallback();

    setDefaultAttributes(this, {
      shape: 'linear',
      size: 'md',
      min: '0',
      max: '100',
      value: '0',
      'status-live': 'off',
      'segment-mode': 'ratio',
      segments: '10',
      'current-step': '0',
      'total-steps': '1',
    });

    this.#labelSlot = getRef<HTMLSlotElement>(this, 'label-slot');
    this.#valueTextSlot = getRef<HTMLSlotElement>(this, 'value-text-slot');

    this.#labelSlot?.addEventListener('slotchange', this.#handleSlotChange);
    this.#valueTextSlot?.addEventListener('slotchange', this.#handleSlotChange);

    this.#ready = true;
    this.#render();
  }

  disconnectedCallback(): void {
    this.#labelSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#valueTextSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#labelSlot = null;
    this.#valueTextSlot = null;
    this.#ready = false;
    super.disconnectedCallback();
  }

  shapeChanged(): void {
    this.#requestRender();
  }

  sizeChanged(): void {
    this.#requestRender();
  }

  minChanged(): void {
    this.#requestRender();
  }

  maxChanged(): void {
    this.#requestRender();
  }

  valueChanged(): void {
    this.#requestRender();
  }

  indeterminateChanged(): void {
    this.#requestRender();
  }

  statusLiveChanged(): void {
    this.#requestRender();
  }

  valueTextChanged(): void {
    this.#requestRender();
  }

  segmentModeChanged(): void {
    this.#requestRender();
  }

  segmentsChanged(): void {
    this.#requestRender();
  }

  currentStepChanged(): void {
    this.#requestRender();
  }

  totalStepsChanged(): void {
    this.#requestRender();
  }

  #handleSlotChange = (): void => {
    this.#syncLabelVisibility();
    this.#syncVisibleValueText();
  };

  #requestRender(): void {
    if (!this.#ready) return;
    this.#render();
  }

  #render(): void {
    const state = this.#resolveState();

    this.#reflectNormalizedAttributes(state);
    this.#syncLabelVisibility();
    this.#syncVisibleValueText();
    this.#syncAria(state);
    this.#syncLinear(state);
    this.#syncCircular(state);
    this.#syncSegments(state);
    this.#syncStatus(state);
  }

  #resolveState(): ProgressState {
    const shape = normalizeShape(this.getAttribute('shape'));
    const size = normalizeSize(this.getAttribute('size'));

    const min = parseNumber(this.getAttribute('min'), 0);
    const maxRaw = parseNumber(this.getAttribute('max'), 100);
    const max = maxRaw <= min ? min + 1 : maxRaw;
    const value = clamp(parseNumber(this.getAttribute('value'), 0), min, max);

    const indeterminate = this.hasAttribute('indeterminate');
    const statusLive = normalizeStatusLive(this.getAttribute('status-live'));
    const explicitValueText = normalizeOptionalText(this.getAttribute('value-text'));

    const segmentMode = normalizeSegmentMode(this.getAttribute('segment-mode'));
    const segments = clampInt(parseIntNumber(this.getAttribute('segments'), 10), 2, 100);
    const totalSteps = clampInt(parseIntNumber(this.getAttribute('total-steps'), 1), 1, 100);
    const currentStep = clampInt(parseIntNumber(this.getAttribute('current-step'), 0), 0, totalSteps);

    let ariaMin = min;
    let ariaMax = max;
    let ariaNow: number | null = value;
    let ratio = clamp((value - min) / (max - min), 0, 1);

    if (shape === 'segmented' && segmentMode === 'steps') {
      ariaMin = 0;
      ariaMax = totalSteps;
      ariaNow = currentStep;
      ratio = clamp(currentStep / totalSteps, 0, 1);
    }

    if (indeterminate) ariaNow = null;

    const ariaValueText = explicitValueText ?? (indeterminate ? '進行中' : toPercentText(ratio));

    let segmentCount = segments;
    let filledSegments = Math.round(ratio * segments);

    if (shape === 'segmented' && segmentMode === 'steps') {
      segmentCount = totalSteps;
      filledSegments = currentStep;
    }

    filledSegments = clampInt(filledSegments, 0, segmentCount);

    const statusKey = indeterminate ? `indeterminate:${ariaValueText}` : `determinate:${toPercentText(ratio)}`;

    return {
      shape,
      size,
      min,
      max,
      value,
      indeterminate,
      statusLive,
      explicitValueText,
      segmentMode,
      segments,
      currentStep,
      totalSteps,
      ratio,
      ariaMin,
      ariaMax,
      ariaNow,
      ariaValueText,
      segmentCount,
      filledSegments,
      statusKey,
    };
  }

  #reflectNormalizedAttributes(state: ProgressState): void {
    this.#setIfDifferent('shape', state.shape);
    this.#setIfDifferent('size', state.size);
    this.#setIfDifferent('min', String(state.min));
    this.#setIfDifferent('max', String(state.max));
    this.#setIfDifferent('value', String(state.value));
    this.#setIfDifferent('status-live', state.statusLive);
    this.#setIfDifferent('segment-mode', state.segmentMode);
    this.#setIfDifferent('segments', String(state.segments));
    this.#setIfDifferent('current-step', String(state.currentStep));
    this.#setIfDifferent('total-steps', String(state.totalSteps));

    const rawValueText = this.getAttribute('value-text');
    if (state.explicitValueText == null && rawValueText != null && rawValueText.trim() === '') {
      this.removeAttribute('value-text');
      return;
    }

    if (state.explicitValueText != null) {
      this.#setIfDifferent('value-text', state.explicitValueText);
    }
  }

  #setIfDifferent(name: string, next: string): void {
    if (this.getAttribute(name) === next) return;
    this.setAttribute(name, next);
  }

  #syncLabelVisibility(): void {
    const label = getRef<HTMLElement>(this, 'label');
    if (!label) return;

    const hasLabel = hasSlotContent(this.#labelSlot) || this.querySelector('[slot="label"]') !== null;
    label.toggleAttribute('hidden', !hasLabel);
  }

  #syncVisibleValueText(): void {
    const valueText = getRef<HTMLElement>(this, 'value-text');
    const valueTextAttr = getRef<HTMLElement>(this, 'value-text-attr');
    if (!valueText || !valueTextAttr) return;

    const hasSlot = hasSlotContent(this.#valueTextSlot) || this.querySelector('[slot="value-text"]') !== null;
    const attrText = normalizeOptionalText(this.getAttribute('value-text'));

    valueTextAttr.textContent = hasSlot ? '' : attrText ?? '';
    valueTextAttr.toggleAttribute('hidden', hasSlot || attrText == null);

    const visible = hasSlot || attrText != null;
    valueText.toggleAttribute('hidden', !visible);
  }

  #syncAria(state: ProgressState): void {
    const bar = getRef<HTMLElement>(this, 'bar');
    if (!bar) return;

    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', String(state.ariaMin));
    bar.setAttribute('aria-valuemax', String(state.ariaMax));

    if (state.ariaNow == null) bar.removeAttribute('aria-valuenow');
    else bar.setAttribute('aria-valuenow', String(state.ariaNow));

    bar.setAttribute('aria-valuetext', state.ariaValueText);
  }

  #syncLinear(state: ProgressState): void {
    const fill = getRef<HTMLElement>(this, 'fill');
    if (!fill) return;

    if (state.indeterminate) {
      fill.style.removeProperty('width');
      return;
    }

    fill.style.width = `${(state.ratio * 100).toFixed(3)}%`;
  }

  #syncCircular(state: ProgressState): void {
    const svg = getRef<SVGElement>(this, 'circular-svg');
    const track = getRef<SVGCircleElement>(this, 'circular-track');
    const fill = getRef<SVGCircleElement>(this, 'circular-fill');
    if (!svg || !track || !fill) return;

    const circumferenceText = CIRCULAR_CIRCUMFERENCE.toFixed(3);
    svg.style.setProperty('--_dads-progress-circumference', circumferenceText);

    track.style.strokeDasharray = circumferenceText;
    fill.style.strokeDasharray = circumferenceText;

    if (state.indeterminate) {
      fill.style.strokeDashoffset = (CIRCULAR_CIRCUMFERENCE * 0.95).toFixed(3);
      return;
    }

    fill.style.strokeDashoffset = (CIRCULAR_CIRCUMFERENCE * (1 - state.ratio)).toFixed(3);
  }

  #syncSegments(state: ProgressState): void {
    const segmentsEl = getRef<HTMLElement>(this, 'segments');
    if (!segmentsEl) return;

    const count = state.segmentCount;
    const nodes = this.#ensureSegmentNodes(segmentsEl, count);
    segmentsEl.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;

    const filledThreshold = state.indeterminate ? count : state.filledSegments;
    for (let i = 0; i < nodes.length; i += 1) {
      nodes[i].setAttribute('data-filled', i < filledThreshold ? 'true' : 'false');
    }
  }

  #ensureSegmentNodes(container: HTMLElement, count: number): HTMLElement[] {
    const nodes = Array.from(container.querySelectorAll<HTMLElement>('[part="segment"]'));

    if (nodes.length < count) {
      const fragment = document.createDocumentFragment();
      for (let i = nodes.length; i < count; i += 1) {
        const segment = document.createElement('span');
        segment.setAttribute('part', 'segment');
        segment.setAttribute('data-filled', 'false');

        const fill = document.createElement('span');
        fill.setAttribute('part', 'segment-fill');

        segment.append(fill);
        fragment.append(segment);
      }
      container.append(fragment);
    }

    if (nodes.length > count) {
      for (let i = nodes.length - 1; i >= count; i -= 1) {
        nodes[i].remove();
      }
    }

    return Array.from(container.querySelectorAll<HTMLElement>('[part="segment"]'));
  }

  #syncStatus(state: ProgressState): void {
    const status = getRef<HTMLElement>(this, 'status');
    if (!status) return;

    if (state.statusLive === 'off') {
      status.removeAttribute('aria-live');
      status.removeAttribute('aria-atomic');
      status.textContent = '';
      this.#lastStatusKey = null;
      this.#lastStatusMessage = null;
      return;
    }

    status.setAttribute('aria-live', state.statusLive);
    status.setAttribute('aria-atomic', 'true');

    const statusChanged = state.statusKey !== this.#lastStatusKey;
    this.#lastStatusKey = state.statusKey;

    if (!statusChanged) return;
    if (state.ariaValueText === this.#lastStatusMessage) return;

    status.textContent = state.ariaValueText;
    this.#lastStatusMessage = state.ariaValueText;
  }
}
