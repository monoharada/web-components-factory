export type A11yAnnotationCategory =
  | 'semantics'
  | 'keyboard'
  | 'zoom'
  | 'states'
  | 'labels'
  | 'motion';

export type A11yAnnotationContent = string | readonly string[];

export type A11yCalloutPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type A11yElementScope = 'light' | 'shadow';

export type A11yElementHost = 'target' | 'annotate';

export type A11yElementRef =
  | {
      host?: A11yElementHost;
      hostSelector?: string;
      scope?: 'light';
      selector: string;
    }
  | {
      host?: A11yElementHost;
      hostSelector?: string;
      scope: 'shadow';
      selector: string;
    };

export type A11yCalloutMode = 'marker' | 'panel' | 'both';

export type A11yCalloutTargetHint = 'auto' | 'box' | 'none';

export type A11yCallout = Readonly<{
  id: string;
  title: string;
  /**
   * 画面上のタグ（コールアウト）に表示する短い文字列。
   * 省略時は、ターゲット要素の role/aria 等から自動生成します。
   */
  label?: string;
  /**
   * マーカー表示のヒント（枠の表示可否）
   * - auto: 既定（他の注釈対象を包含している場合のみ枠を表示）
   * - box: 常に枠を表示
   * - none: 常に枠を非表示
   */
  targetHint?: A11yCalloutTargetHint;
  description?: string;
  category?: A11yAnnotationCategory;
  mode?: A11yCalloutMode;
  target: A11yElementRef;
  placement?: A11yCalloutPlacement;
}>;

export type A11yAnnotations = Readonly<{
  version: 1;
  summary?: string;
  categories: Partial<Record<A11yAnnotationCategory, A11yAnnotationContent>>;
  callouts?: readonly A11yCallout[];
}>;
