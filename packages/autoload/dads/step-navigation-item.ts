/**
 * wc-autoloader アダプター: dads-step-navigation-item
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsStepNavigationItem, defineDefaultStepNavigation } from '../../components/step-navigation/index.js';

// defineDefaultStepNavigation は内部で重複登録をチェックするため安全に呼び出せる
defineDefaultStepNavigation();

export default DadsStepNavigationItem;

