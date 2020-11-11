import El from './cache-selectors';
import pageLoader from '@WebsiteGlobal/page-loader';
import sendForm from './send-form';



function setEvents() {
    El.form.self.onsubmit = sendForm;
}



export default async function() {
    setEvents();
    pageLoader.hide();
}
