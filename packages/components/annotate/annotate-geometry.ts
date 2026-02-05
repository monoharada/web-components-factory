export type Point = Readonly<{ x: number; y: number }>;
export type Rect = Readonly<{ left: number; top: number; width: number; height: number }>;

type Segment = Readonly<{ a: Point; b: Point }>;

function rectRight(r: Rect): number {
  return r.left + r.width;
}

function rectBottom(r: Rect): number {
  return r.top + r.height;
}

function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function fmt(n: number): string {
  // Keep output stable/readable while avoiding long floats in SVG path data.
  const rounded = Math.round(n * 100) / 100;
  return String(rounded);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function rectCenter(rect: Rect): Point {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function computeInsetPx(targetRect: Rect, minInsetPx: number, ratio: number): number {
  const minDim = Math.max(0, Math.min(targetRect.width, targetRect.height));
  const r = Number.isFinite(ratio) ? ratio : 0;
  const base = minDim * r;
  const minInset = Number.isFinite(minInsetPx) ? minInsetPx : 0;
  return clamp(base, minInset, minDim * 0.49);
}

function pointInRectInterior(p: Point, r: Rect): boolean {
  return p.x > r.left && p.x < rectRight(r) && p.y > r.top && p.y < rectBottom(r);
}

function pointOnRectBoundary(p: Point, r: Rect, eps = 1e-6): boolean {
  const right = rectRight(r);
  const bottom = rectBottom(r);
  const onX = Math.abs(p.x - r.left) <= eps || Math.abs(p.x - right) <= eps;
  const onY = Math.abs(p.y - r.top) <= eps || Math.abs(p.y - bottom) <= eps;
  const withinX = p.x >= r.left - eps && p.x <= right + eps;
  const withinY = p.y >= r.top - eps && p.y <= bottom + eps;
  return (onX && withinY) || (onY && withinX);
}

function normalizePoints(points: Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && last.x === p.x && last.y === p.y) continue;
    out.push(p);
  }
  // If we ended up with only a move point, keep it; caller can decide.
  return out;
}

function toPath(points: Point[]): string {
  const pts = normalizePoints(points);
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${fmt(pts[0]!.x)} ${fmt(pts[0]!.y)}`;
  const [first, ...rest] = pts;
  return [
    `M ${fmt(first.x)} ${fmt(first.y)}`,
    ...rest.map((p) => `L ${fmt(p.x)} ${fmt(p.y)}`),
  ].join(' ');
}

export function pickTagStartPoint(tagRect: Rect, targetCenter: Point): Point {
  const left = tagRect.left;
  const top = tagRect.top;
  const right = rectRight(tagRect);
  const bottom = rectBottom(tagRect);

  const corners: Point[] = [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
  ];

  let best = corners[0]!;
  let bestD = dist2(best, targetCenter);
  for (let i = 1; i < corners.length; i += 1) {
    const p = corners[i]!;
    const d = dist2(p, targetCenter);
    if (d < bestD) {
      best = p;
      bestD = d;
    }
  }
  return best;
}

/**
 * start→center のレイ（線分）と矩形の交点（startから最初に当たる点）を返す。
 * - start が矩形内の場合は、境界へ出る交点を返す
 * - 交点が求まらない場合は null
 */
export function intersectRayRect(start: Point, center: Point, rect: Rect): Point | null {
  const dx = center.x - start.x;
  const dy = center.y - start.y;
  if (dx === 0 && dy === 0) return null;

  const left = rect.left;
  const top = rect.top;
  const right = rectRight(rect);
  const bottom = rectBottom(rect);

  const candidates: Array<{ t: number; p: Point }> = [];

  const pushIfValid = (t: number, p: Point) => {
    if (!Number.isFinite(t)) return;
    if (t < 0 || t > 1) return;
    const withinX = p.x >= left - 1e-6 && p.x <= right + 1e-6;
    const withinY = p.y >= top - 1e-6 && p.y <= bottom + 1e-6;
    if (!withinX || !withinY) return;
    if (!pointOnRectBoundary(p, rect)) return;
    candidates.push({ t, p });
  };

  if (dx !== 0) {
    const tLeft = (left - start.x) / dx;
    pushIfValid(tLeft, { x: left, y: start.y + tLeft * dy });
    const tRight = (right - start.x) / dx;
    pushIfValid(tRight, { x: right, y: start.y + tRight * dy });
  }

  if (dy !== 0) {
    const tTop = (top - start.y) / dy;
    pushIfValid(tTop, { x: start.x + tTop * dx, y: top });
    const tBottom = (bottom - start.y) / dy;
    pushIfValid(tBottom, { x: start.x + tBottom * dx, y: bottom });
  }

  if (candidates.length === 0) return null;

  // start が矩形内の場合、t=0の境界点は意味がないので除外して「出口」を探す
  const startInside =
    start.x > left && start.x < right && start.y > top && start.y < bottom;
  const filtered = startInside ? candidates.filter((c) => c.t > 1e-6) : candidates;
  const list = filtered.length > 0 ? filtered : candidates;

  list.sort((a, b) => a.t - b.t);
  return list[0]!.p;
}

export function pickRectBoundaryPoint(from: Point, to: Point, rect: Rect): Point | null {
  return intersectRayRect(from, to, rect);
}

export function clampBoundaryPointAwayFromCorners(
  p: Point,
  rect: Rect,
  marginPx: number,
  dir: Point
): Point {
  const margin = Math.max(0, marginPx);
  if (margin === 0) return p;

  const left = rect.left;
  const top = rect.top;
  const right = rectRight(rect);
  const bottom = rectBottom(rect);

  const eps = 1e-6;
  const onLeft = Math.abs(p.x - left) <= eps;
  const onRight = Math.abs(p.x - right) <= eps;
  const onTop = Math.abs(p.y - top) <= eps;
  const onBottom = Math.abs(p.y - bottom) <= eps;

  const clampX = () => clamp(p.x, left + margin, right - margin);
  const clampY = () => clamp(p.y, top + margin, bottom - margin);

  // Corner: choose edge based on predominant direction (horizontal vs vertical).
  const isCorner = (onLeft || onRight) && (onTop || onBottom);
  if (isCorner) {
    const preferVerticalEdge = Math.abs(dir.x) >= Math.abs(dir.y);
    if (preferVerticalEdge) {
      const x = onLeft ? left : right;
      return { x, y: clampY() };
    }
    const y = onTop ? top : bottom;
    return { x: clampX(), y };
  }

  if (onLeft) return { x: left, y: clampY() };
  if (onRight) return { x: right, y: clampY() };
  if (onTop) return { x: clampX(), y: top };
  if (onBottom) return { x: clampX(), y: bottom };

  return p;
}

function segmentIntersectsRectInterior(seg: Segment, rect: Rect): boolean {
  // Axis-aligned segments only (our candidates are straight or orthogonal).
  const ax = seg.a.x;
  const ay = seg.a.y;
  const bx = seg.b.x;
  const by = seg.b.y;

  const left = rect.left;
  const top = rect.top;
  const right = rectRight(rect);
  const bottom = rectBottom(rect);

  if (ax === bx) {
    const x = ax;
    if (!(x > left && x < right)) return false;
    const y1 = Math.min(ay, by);
    const y2 = Math.max(ay, by);
    const overlap1 = Math.max(y1, top);
    const overlap2 = Math.min(y2, bottom);
    return overlap2 > overlap1 && overlap1 < bottom && overlap2 > top;
  }

  if (ay === by) {
    const y = ay;
    if (!(y > top && y < bottom)) return false;
    const x1 = Math.min(ax, bx);
    const x2 = Math.max(ax, bx);
    const overlap1 = Math.max(x1, left);
    const overlap2 = Math.min(x2, right);
    return overlap2 > overlap1 && overlap1 < right && overlap2 > left;
  }

  // Non-axis-aligned: treat as no interior intersection for our scoring purposes.
  return false;
}
function pathLength(points: Point[]): number {
  let sum = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    sum += Math.hypot(dx, dy);
  }
  return sum;
}

function scoreLPath(points: Point[], targetRect: Rect): number {
  // points: [start, bend, end]
  const bend = points[1]!;
  let score = pathLength(points);

  if (pointInRectInterior(bend, targetRect)) score += 10000;

  // First segment should avoid cutting through the target interior.
  const first: Segment = { a: points[0]!, b: points[1]! };
  if (segmentIntersectsRectInterior(first, targetRect)) score += 1000;

  return score;
}

export function buildAutoPath(start: Point, end: Point, targetRect: Rect): string {
  const straight = [start, end];
  const straightLen = pathLength(straight);

  const hv = [start, { x: end.x, y: start.y }, end];
  const vh = [start, { x: start.x, y: end.y }, end];

  const hvScore = scoreLPath(hv, targetRect);
  const vhScore = scoreLPath(vh, targetRect);

  // Prefer L-shape unless it is significantly worse than straight.
  const bestLScore = hvScore <= vhScore ? hvScore : vhScore;
  const bestLPoints = hvScore <= vhScore ? hv : vh;

  if (bestLScore <= straightLen * 1.3) {
    return toPath(bestLPoints);
  }
  return toPath(straight);
}

export function insetPointTowards(hit: Point, center: Point, insetPx: number): Point {
  if (insetPx <= 0) return hit;
  const dx = center.x - hit.x;
  const dy = center.y - hit.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return hit;
  const step = clamp(insetPx, 0, len);
  return { x: hit.x + (dx / len) * step, y: hit.y + (dy / len) * step };
}
