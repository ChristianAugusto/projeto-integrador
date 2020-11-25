import Cookies from 'js-cookie';
import IMask from 'imask';

import El from './cache-selectors';
import getDigitalQueueData from './get-digital-queue-data';
import buildTimeSlices from './build-time-slices';
import overlay from '@WebsiteGlobal/overlay';
import pageLoader from '@WebsiteGlobal/page-loader';
import pageCache from './page-cache';
import closeLightbox from './close-lightbox';
import openLightbox from './open-lightbox';
import sendForm from './send-form';
import documentMaskChange from '@WebsiteUtils/document-mask-change';
import {
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';



const DIGITAL_QUEUE_USER_FORM_COOKIE_NAME = 'digital-queue-user-form';


function timeSliceClickCallback(timeStringValue) {
    El.registerLightbox.form.digitalQueueUserAppointment.value = timeStringValue;
    openLightbox();
}


function saveFormData() {
    Cookies.set(
        DIGITAL_QUEUE_USER_FORM_COOKIE_NAME, JSON.stringify(pageCache.form),
        {
            expires: new Date(new Date().getTime() + 60*60*5) // 5 min
        }
    );
}


function setMasks() {
    IMask(El.registerLightbox.form.digitalQueueUserTelephone, {
        mask: '+00 (00) 00000-0000'
    });

    documentMaskChange(
        El.registerLightbox.form.digitalQueueUserDocumentType,
        El.registerLightbox.form.digitalQueueUserDocument
    );
}


function setEvents() {
    El.registerLightbox.closeLightbox.onclick = closeLightbox;

    overlay.el.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (event) {
        switch (event.key) {
        case 'Escape':
            closeLightbox();
        }
    });
    El.registerLightbox.form.self.onsubmit = sendForm;

    /* Form fields */
    El.registerLightbox.form.digitalQueueUserName.onkeyup = function() {
        pageCache.form.digitalQueueUserName = El.registerLightbox.form.digitalQueueUserName.value.trim();
        saveFormData();
    };

    El.registerLightbox.form.digitalQueueUserEmail.onkeyup = function() {
        pageCache.form.digitalQueueUserEmail = El.registerLightbox.form.digitalQueueUserEmail.value.trim();
        saveFormData();
    };

    El.registerLightbox.form.digitalQueueUserTelephone.onkeyup = function() {
        pageCache.form.digitalQueueUserTelephone = 
            El.registerLightbox.form.digitalQueueUserTelephone.value.trim();
        saveFormData();
    };

    El.registerLightbox.form.digitalQueueUserDocumentType.onchange = function() {
        pageCache.form.digitalQueueUserDocumentType = 
            El.registerLightbox.form.digitalQueueUserDocumentType.value.trim();
        saveFormData();
        El.registerLightbox.form.digitalQueueUserDocument.classList.remove('in-use');
        El.registerLightbox.form.digitalQueueUserDocumentType.classList.remove('in-use');
    };

    El.registerLightbox.form.digitalQueueUserDocument.onkeyup = function() {
        pageCache.form.digitalQueueUserDocument = 
            El.registerLightbox.form.digitalQueueUserDocument.value.trim();
        saveFormData();
        El.registerLightbox.form.digitalQueueUserDocument.classList.remove('in-use');
        El.registerLightbox.form.digitalQueueUserDocumentType.classList.remove('in-use');
    };

    El.registerLightbox.form.digitalQueueUserNationality.onkeyup = function() {
        pageCache.form.digitalQueueUserNationality = 
            El.registerLightbox.form.digitalQueueUserNationality.value.trim();
        saveFormData();
    };

    El.registerLightbox.form.digitalQueueUserTransport.onchange = function() {
        pageCache.form.digitalQueueUserTransportId = 
            El.registerLightbox.form.digitalQueueUserTransport.value.trim();
        saveFormData();
    };
}


function fillFormInputs() {
    const cookieValue = Cookies.get(DIGITAL_QUEUE_USER_FORM_COOKIE_NAME);

    if (!cookieValue) {
        return;
    }

    pageCache.form = JSON.parse(cookieValue);

    if (pageCache.form.digitalQueueUserName) {
        El.registerLightbox.form.digitalQueueUserName.value = pageCache.form.digitalQueueUserName;
    }

    if (pageCache.form.digitalQueueUserEmail) {
        El.registerLightbox.form.digitalQueueUserEmail.value = pageCache.form.digitalQueueUserEmail;
    }

    if (pageCache.form.digitalQueueUserTelephone) {
        El.registerLightbox.form.digitalQueueUserTelephone.value = pageCache.form.digitalQueueUserTelephone;
    }

    if (pageCache.form.digitalQueueUserDocumentType) {
        El.registerLightbox.form.digitalQueueUserDocumentType.value = 
            pageCache.form.digitalQueueUserDocumentType;

        El.registerLightbox.form.digitalQueueUserDocumentType.dmc_triggerChange();
    }

    if (pageCache.form.digitalQueueUserDocument) {
        El.registerLightbox.form.digitalQueueUserDocument.value = 
            pageCache.form.digitalQueueUserDocument;

        El.registerLightbox.form.digitalQueueUserDocument.dmc_updateValue();
    }

    if (pageCache.form.digitalQueueUserNationality) {
        El.registerLightbox.form.digitalQueueUserNationality.value =
            pageCache.form.digitalQueueUserNationality;
    }

    if (pageCache.form.digitalQueueUserTransportId) {
        El.registerLightbox.form.digitalQueueUserTransport.value = 
            pageCache.form.digitalQueueUserTransportId;
    }
}


function buildSelectTransports() {
    for (let i = 0; i < pageCache.digitalQueue.transports.length; i++) {
        El.registerLightbox.form.digitalQueueUserTransport.innerHTML += `
            <option value="${pageCache.digitalQueue.transports[i].id}">
                ${pageCache.digitalQueue.transports[i].name}
            </option/
        `;
    }
}



export default async function () {
    try {
        await getDigitalQueueData();
        buildTimeSlices(timeSliceClickCallback);
        buildSelectTransports();
        setMasks();
        fillFormInputs();
        setEvents();
        pageLoader.hide();
    }
    catch (error) {
        console.error(error);
        console.error('Error in mount page');
        alert(SERVER_ERROR_MESSAGE);
        pageLoader.hide();
    }
}
