/**
 * スイッチコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';
export const switchStyles = css `
  /* ========== ホストレベル共通設定 ========== */
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--switch-gap);
    font-family: var(--font-family-sans);
  }

  /* ========== ラッパー ========== */
  [part="wrapper"] {
    display: inline-flex;
    align-items: center;
    gap: var(--switch-gap);
  }

  /* ========== ラベル（左右共通） ========== */
  [part="label-left"],
  [part="label-right"] {
    font-size: var(--switch-label-size);
    color: var(--dads-switch-label-color);
    line-height: var(--line-height-150);
    user-select: none;
    cursor: pointer;
  }

  /* 空のラベルを非表示 */
  [part="label-left"]:empty,
  [part="label-right"]:empty {
    display: none;
  }

  /* ========== スイッチ本体 ========== */
  [part="switch"] {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  /* ========== チェックボックス（視覚的に隠す） ========== */
  [part="checkbox"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ========== トラック ========== */
  [part="track"] {
    position: relative;
    display: inline-block;

    /* プロパティと変数のマッピング（一度だけ定義） */
    width: var(--dads-switch-track-width);
    height: var(--dads-switch-track-height);
    background-color: var(--dads-switch-track-bg);
    border-radius: var(--border-radius-full, 9999px);

    /* アニメーション */
    transition: background-color var(--switch-transition-duration) ease;
  }

  /* ========== ノブ ========== */
  [part="knob"] {
    position: absolute;
    top: var(--switch-knob-offset);
    left: var(--switch-knob-offset);

    /* プロパティと変数のマッピング（一度だけ定義） */
    width: var(--dads-switch-knob-size);
    height: var(--dads-switch-knob-size);
    background-color: var(--dads-switch-knob-bg);
    border-radius: 50%;

    /* アニメーション */
    transition: transform var(--switch-transition-duration) ease;
  }

  /* チェック状態：ノブを右に移動 */
  :host([checked]) [part="knob"] {
    transform: translateX(
      calc(
        var(--dads-switch-track-width) -
        var(--dads-switch-knob-size) -
        var(--switch-knob-offset) * 2
      )
    );
  }

  /* ========== フォーカス状態 ========== */
  [part="checkbox"]:focus-visible + [part="track"] {
    outline: var(--switch-focus-outline-width) solid var(--switch-focus-outline-color);
    outline-offset: var(--switch-focus-ring-width);
    box-shadow: 0 0 0 var(--switch-focus-ring-width) var(--switch-focus-ring-color);
  }

  /* ========== 無効状態 ========== */
  :host([disabled]) {
    opacity: 0.6;
    cursor: not-allowed;
  }

  :host([disabled]) [part="switch"],
  :host([disabled]) [part="label-left"],
  :host([disabled]) [part="label-right"] {
    cursor: not-allowed;
    pointer-events: none;
  }

  :host([disabled]) [part="track"] {
    --dads-switch-track-bg: var(--switch-track-bg-disabled);
  }

  :host([disabled]) [part="knob"] {
    --dads-switch-knob-bg: var(--switch-knob-bg-disabled);
  }

  /* ========== 強制カラーモード対応 ========== */
  @media (forced-colors: active) {
    [part="track"] {
      border: 2px solid CanvasText;
      background-color: Canvas;
    }

    [part="knob"] {
      background-color: CanvasText;
    }

    :host([checked]) [part="track"] {
      background-color: Highlight;
    }

    :host([disabled]) [part="track"] {
      border-color: GrayText;
    }

    :host([disabled]) [part="knob"] {
      background-color: GrayText;
    }

    [part="checkbox"]:focus-visible + [part="track"] {
      outline: 2px solid Highlight;
    }
  }

  /* ========== 印刷対応 ========== */
  @media print {
    [part="track"] {
      /* CSS変数の再代入で上書き（!important回避） */
      --dads-switch-track-bg: transparent;
      border: 2px solid black;
    }

    [part="knob"] {
      /* CSS変数の再代入で上書き（!important回避） */
      --dads-switch-knob-bg: black;
    }
  }

  /* ========== モーション軽減対応 ========== */
  @media (prefers-reduced-motion: reduce) {
    [part="track"],
    [part="knob"] {
      transition: none;
    }
  }
`;
