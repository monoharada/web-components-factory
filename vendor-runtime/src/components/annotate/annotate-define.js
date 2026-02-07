/**
 * Annotateコンポーネント定義関数
 * ドキュメンテーション用途（アクセシビリティ注釈）
 */
import { DadsAnnotate } from './annotate.js';
import { WebComponentDefinition } from '../../core/web-components.js';
import { getConfig } from '../../config.js';
/**
 * Annotateコンポーネントを定義
 * @param registry - カスタムエレメントレジストリ（省略時はgetConfig()のregistryを使用）
 */
export function defineAnnotate(registry) {
    const effectiveRegistry = registry ?? getConfig().registry;
    const name = 'a11y-annotate';
    if (!effectiveRegistry.get(name)) {
        const def = { ...DadsAnnotate.definition, name, registry: effectiveRegistry };
        WebComponentDefinition.compose(DadsAnnotate, def).define(effectiveRegistry);
    }
}
/**
 * デフォルト名での登録
 */
export function defineDefaultAnnotate() {
    defineAnnotate();
}
