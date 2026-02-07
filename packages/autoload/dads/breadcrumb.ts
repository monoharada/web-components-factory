/**
 * wc-autoloader アダプター: dads-breadcrumb
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsBreadcrumb, defineDefaultBreadcrumb } from '../../components/breadcrumb/index.js';

// dads-breadcrumb と dads-breadcrumb-item の両方を登録
defineDefaultBreadcrumb();

export default DadsBreadcrumb;
