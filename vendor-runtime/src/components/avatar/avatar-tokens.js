/**
 * Avatarコンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';
const avatarTokensText = `
  :host {
    --dads-avatar-background: var(--color-neutral-solid-gray-420, #949494);
    --dads-avatar-text-color: white;
  }
`;
export const avatarTokens = css `${avatarTokensText}`;
