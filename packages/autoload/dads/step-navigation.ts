/**
 * wc-autoloader アダプター: dads-step-navigation
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsStepNavigation, defineDefaultStepNavigation } from '../../components/step-navigation/index.js';

// dads-step-navigation と dads-step-navigation-item の両方を登録
defineDefaultStepNavigation();

export default DadsStepNavigation;

