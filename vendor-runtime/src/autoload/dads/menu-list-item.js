/**
 * wc-autoloader アダプター: dads-menu-list-item
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsMenuListItem, defineMenuList } from '../../components/menu-list/index.js';
// NOTE: defineMenuList は dads-menu-list / dads-menu-list-item の両方を登録する
defineMenuList();
export default DadsMenuListItem;
