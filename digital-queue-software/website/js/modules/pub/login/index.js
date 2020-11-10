import Form from './form';
import mountPage from './mount-page';



export default {
    init() {
        mountPage();
        Form.init();
    }
};
