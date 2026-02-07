/**
 * wc-autoloader アダプター: dads-breadcrumb-item
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsBreadcrumbItem, defineDefaultBreadcrumb } from '../../components/breadcrumb/index.js';

// defineDefaultBreadcrumb は内部で重複登録をチェックするため安全に呼び出せる
defineDefaultBreadcrumb();

export default DadsBreadcrumbItem;
