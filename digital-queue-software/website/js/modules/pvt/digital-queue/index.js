import Header from '../header';
import mountPage from './mount-page';
import { loadCacheFromPage } from './page-cache';



export default {
    init() {
        loadCacheFromPage();
        Header.init();
        mountPage();
    }
};
