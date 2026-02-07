/**
 * wc-autoloader アダプター: dads-accordion-details
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsAccordionDetails, defineDefaultAccordion } from '../../components/accordion/index.js';
// dads-accordion-details と dads-accordion-item-details の両方を登録
defineDefaultAccordion();
export default DadsAccordionDetails;
