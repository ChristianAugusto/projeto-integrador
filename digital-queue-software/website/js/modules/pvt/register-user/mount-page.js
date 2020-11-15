import pageLoader from '@WebsiteGlobal/page-loader';
import El from './cache-selectors';
import sendForm from './send-form';
import documentMaskChange from '@WebsiteUtils/document-mask-change';



function setMasks() {
    IMask(El.form.userTelephone, {
        mask: '+00 (00) 00000-0000'
    });

    documentMaskChange(
        El.form.userDocumentType,
        El.form.userDocument
    );
}


function setEvents() {
    El.form.self.onsubmit = sendForm;

    El.form.userEmail.onkeyup = function() {
        El.form.userEmail.classList.remove('in-use');
    };
}




export default async function() {
    setMasks();
    setEvents();
    pageLoader.hide();
}
