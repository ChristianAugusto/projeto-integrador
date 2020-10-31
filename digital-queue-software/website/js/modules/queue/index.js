import mountPage from './mount-page';
import { loadCache } from './page-cache';



export default {
    init() {
        loadCache();
        mountPage();
    }
};
