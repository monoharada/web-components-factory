import { describe, it, expect } from 'vitest';
import {
  pickTagStartPoint,
  intersectRayRect,
  buildAutoPath,
  computeInsetPx,
  pickRectBoundaryPoint,
  clampBoundaryPointAwayFromCorners,
  type Rect,
  type Point,
} from './annotate-geometry.js';

describe('annotate-geometry', () => {
  it('pickTagStartPoint() は target center に最も近いタグ角を選ぶ', () => {
    const tagRect: Rect = { left: 10, top: 20, width: 100, height: 50 };
    const center: Point = { x: 500, y: 500 };

    const p = pickTagStartPoint(tagRect, center);
    expect(p).toEqual({ x: 110, y: 70 });
  });

  it('intersectRayRect() は start→center のレイが矩形に入る交点を返す', () => {
    const rect: Rect = { left: 10, top: 10, width: 20, height: 20 };
    const start: Point = { x: 0, y: 0 };
    const center: Point = { x: 30, y: 30 };

    const hit = intersectRayRect(start, center, rect);
    expect(hit).toBeTruthy();
    expect(hit?.x).toBeCloseTo(10, 6);
    expect(hit?.y).toBeCloseTo(10, 6);
  });

  it('buildAutoPath() は L字が十分短い場合は L字を選び、長い場合は直線を選ぶ', () => {
    const targetRect: Rect = { left: 90, top: 0, width: 20, height: 20 };

    const start1: Point = { x: 0, y: 0 };
    const end1: Point = { x: 100, y: 10 };
    const d1 = buildAutoPath(start1, end1, targetRect);
    expect(d1).toBe('M 0 0 L 100 0 L 100 10');

    const start2: Point = { x: 0, y: 0 };
    const end2: Point = { x: 100, y: 100 };
    const d2 = buildAutoPath(start2, end2, targetRect);
    expect(d2).toBe('M 0 0 L 100 100');
  });

  it('buildAutoPath() は折れ点が target 内部に入る L字を避ける', () => {
    const targetRect: Rect = { left: 0, top: 0, width: 100, height: 100 };
    const start: Point = { x: 10, y: 90 };
    const end: Point = { x: 90, y: 10 };

    const d = buildAutoPath(start, end, targetRect);
    expect(d).toBe('M 10 90 L 90 10');
  });

  it('computeInsetPx() は要素サイズに比例して inset を増やす（上限あり）', () => {
    const rectSmall: Rect = { left: 0, top: 0, width: 100, height: 40 }; // minDim=40
    expect(computeInsetPx(rectSmall, 2, 0.35)).toBeCloseTo(14, 6);

    const rectHuge: Rect = { left: 0, top: 0, width: 1000, height: 1000 }; // minDim=1000
    // 0.49 上限に当たり、490 になる
    expect(computeInsetPx(rectHuge, 2, 0.9)).toBeCloseTo(490, 6);
  });

  it('pickRectBoundaryPoint() は from→to の線分が矩形に当たる境界点を返す', () => {
    const rect: Rect = { left: 10, top: 10, width: 20, height: 20 };
    const from: Point = { x: 0, y: 20 };
    const to: Point = { x: 30, y: 20 };

    const hit = pickRectBoundaryPoint(from, to, rect);
    expect(hit).toEqual({ x: 10, y: 20 });
  });

  it('clampBoundaryPointAwayFromCorners() は角付近の境界点を同じ辺上でクランプする', () => {
    const rect: Rect = { left: 100, top: 100, width: 200, height: 100 };
    const hitNearCorner: Point = { x: 100, y: 100 }; // top-left corner (boundary)
    const dir: Point = { x: 1, y: 0.2 };

    const clamped = clampBoundaryPointAwayFromCorners(hitNearCorner, rect, 10, dir);
    // x は left 辺に固定され、y が margin 分だけ下にずれる
    expect(clamped.x).toBe(100);
    expect(clamped.y).toBe(110);
  });
});
