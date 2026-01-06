/**
 * wc-autoloader アダプター: dads-accordion-item-details
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsAccordionItemDetails, defineDefaultAccordion } from '../../components/accordion/index.js';

// defineDefaultAccordion は内部で重複登録をチェックするため安全に呼び出せる
defineDefaultAccordion();

export default DadsAccordionItemDetails;
