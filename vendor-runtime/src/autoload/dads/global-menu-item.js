/**
 * wc-autoloader アダプター: dads-global-menu-item
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsGlobalMenuItem, defineGlobalMenu } from '../../components/global-menu/index.js';
// NOTE: defineGlobalMenu は dads-global-menu / dads-global-menu-item の両方を登録する
defineGlobalMenu();
export default DadsGlobalMenuItem;
