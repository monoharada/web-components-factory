/**
 * wc-autoloader アダプター: dads-device-mock
 * このファイルがインポートされるとコンポーネントが自動登録される
 */
import { DadsDeviceMock, defineDefaultDeviceMock } from '../../components/device-mock/index.js';

defineDefaultDeviceMock();

export default DadsDeviceMock;
