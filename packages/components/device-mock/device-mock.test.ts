import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, getShadowElement, renderWebComponent, waitForComponent } from '../../../test/utils/test-helpers';
import { defineDeviceMock } from './device-mock-define.js';

beforeAll(() => {
  defineDeviceMock();
});

function flushMicrotask(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

function expectFrameGeometry(el: Element, expected: {
  viewBox: string;
  x: string;
  y: string;
  width: string;
  height: string;
  rx: string;
  strokeWidth: string;
}): void {
  const frame = getShadowElement<SVGSVGElement>(el, '[part="frame"]');
  const frameShape = getShadowElement<SVGRectElement>(el, '[part="frame-shape"]');

  expect(frame?.getAttribute('viewBox')).toBe(expected.viewBox);
  expect(frameShape?.getAttribute('x')).toBe(expected.x);
  expect(frameShape?.getAttribute('y')).toBe(expected.y);
  expect(frameShape?.getAttribute('width')).toBe(expected.width);
  expect(frameShape?.getAttribute('height')).toBe(expected.height);
  expect(frameShape?.getAttribute('rx')).toBe(expected.rx);
  expect(frameShape?.getAttribute('stroke-width')).toBe(expected.strokeWidth);
}

const FRAME_GEOMETRY = {
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
} as const;

describe('DadsDeviceMock', () => {
  afterEach(() => {
    cleanup();
  });

  it('基本構造をレンダリングする', async () => {
    const el = renderWebComponent('<dads-device-mock></dads-device-mock>');

    await waitForComponent('dads-device-mock');

    expect(el).toBeInTheDocument();
    expect(getShadowElement(el, '[part="base"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="frame"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="frame-shape"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="screen"]')).toBeInTheDocument();
    expect(getShadowElement(el, '[part="safe-area"]')).toBeInTheDocument();
  });

  it('device が不正値の場合は mobile に正規化される', async () => {
    const el = renderWebComponent('<dads-device-mock device="unknown"></dads-device-mock>');

    await waitForComponent('dads-device-mock');

    expect(el.getAttribute('device')).toBe('mobile');
    expectFrameGeometry(el, FRAME_GEOMETRY.mobile);
  });

  it('device 切替で SVG属性（viewBox / rect / stroke-width）を反映する', async () => {
    const el = renderWebComponent('<dads-device-mock device="tablet"></dads-device-mock>');

    await waitForComponent('dads-device-mock');

    expectFrameGeometry(el, FRAME_GEOMETRY.tablet);

    el.setAttribute('device', 'desktop');
    await flushMicrotask();
    expectFrameGeometry(el, FRAME_GEOMETRY.desktop);

    el.setAttribute('device', 'mobile');
    await flushMicrotask();
    expectFrameGeometry(el, FRAME_GEOMETRY.mobile);
  });

  it('default slot に子要素を配置できる', async () => {
    const el = renderWebComponent(`
      <dads-device-mock>
        <div id="device-content">content</div>
      </dads-device-mock>
    `);

    await waitForComponent('dads-device-mock');

    expect(el.querySelector('#device-content')?.textContent).toBe('content');
  });

  it('visible-height 属性でフレーム切り取り状態と表示高さトークンを同期できる', async () => {
    const el = renderWebComponent('<dads-device-mock visible-height="220px"></dads-device-mock>');
    await waitForComponent('dads-device-mock');

    expect(el.hasAttribute('data-frame-clipped')).toBe(true);
    expect(el.style.getPropertyValue('--dads-device-mock-visible-height')).toBe('220px');

    el.setAttribute('visible-height', '18rem');
    await flushMicrotask();
    expect(el.hasAttribute('data-frame-clipped')).toBe(true);
    expect(el.style.getPropertyValue('--dads-device-mock-visible-height')).toBe('18rem');

    el.removeAttribute('visible-height');
    await flushMicrotask();
    expect(el.hasAttribute('data-frame-clipped')).toBe(false);
    expect(el.style.getPropertyValue('--dads-device-mock-visible-height')).toBe('');
  });
});
