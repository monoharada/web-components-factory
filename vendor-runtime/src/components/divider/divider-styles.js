/**
 * Dividerコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const dividerStyles = css `
  :host {
    display: block;
    box-sizing: border-box;
    --_dads-divider-margin-block-start: var(--dads-divider-margin-block-start, var(--dads-divider-margin-block));
    --_dads-divider-margin-block-end: var(--dads-divider-margin-block-end, var(--dads-divider-margin-block));
    --_dads-divider-margin-inline-start: var(--dads-divider-margin-inline-start, var(--dads-divider-margin-inline));
    --_dads-divider-margin-inline-end: var(--dads-divider-margin-inline-end, var(--dads-divider-margin-inline));
    --_dads-divider-margin-horizontal-default:
      var(--_dads-divider-margin-block-start)
      var(--_dads-divider-margin-inline-end)
      var(--_dads-divider-margin-block-end)
      var(--_dads-divider-margin-inline-start);
    --_dads-divider-margin-vertical-default:
      var(--_dads-divider-margin-inline-start)
      var(--_dads-divider-margin-block-end)
      var(--_dads-divider-margin-inline-end)
      var(--_dads-divider-margin-block-start);
    --_dads-divider-margin-horizontal:
      var(--dads-divider-margin, var(--_dads-divider-margin-horizontal-default));
    --_dads-divider-margin-vertical:
      var(
        --dads-divider-margin-vertical,
        var(--dads-divider-margin, var(--_dads-divider-margin-vertical-default))
      );
  }

  [part='line'] {
    display: block;
    box-sizing: border-box;
    margin: var(--_dads-divider-margin-horizontal);
    inline-size: 100%;
    block-size: 0;
    border: 0;
    border-block-start-width: var(--dads-divider-width);
    border-block-start-style: var(--dads-divider-style);
    border-block-start-color: var(--dads-divider-color);
  }

  :host([orientation='vertical']) [part='line'] {
    margin: var(--_dads-divider-margin-vertical);
    inline-size: 0;
    block-size: var(--dads-divider-vertical-length);
    border-block-start: 0;
    border-inline-start-width: var(--dads-divider-width);
    border-inline-start-style: var(--dads-divider-style);
    border-inline-start-color: var(--dads-divider-color);
  }

  @media (forced-colors: active) {
    [part='line'] {
      border-block-start-color: CanvasText;
    }

    :host([orientation='vertical']) [part='line'] {
      border-inline-start-color: CanvasText;
    }
  }
`;
