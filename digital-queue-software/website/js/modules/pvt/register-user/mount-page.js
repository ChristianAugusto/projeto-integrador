import pageLoader from '@WebsiteGlobal/page-loader';
import El from './cache-selectors';
import sendForm from './send-form';



function setEvents(){
    El.form.self.onsubmit = sendForm;

    El.form.userEmail.onkeyup = function(){
        El.form.userEmail.classList.remove('in-use');
    };
}




export default async function() {
    setEvents();
    pageLoader.hide();
}
