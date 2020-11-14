import Header from '../header';
import mountPage from './mount-page';



export default {
    init() {
        Header.init();
        mountPage();
    }
};
