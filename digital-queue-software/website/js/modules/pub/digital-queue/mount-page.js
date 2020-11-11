import Cookies from 'js-cookie';

import El from './cache-selectors';
import getDigitalQueueData from './get-digital-queue-data';
import buildTimeSlices from './build-time-slices';
import overlay from '@WebsiteGlobal/overlay';
import page from '@WebsiteGlobal/page';
import pageLoader from '@WebsiteGlobal/page-loader';
import pageCache from './page-cache';
import closeLightbox from './close-lightbox';
import sendForm from './send-form';
import {
    DIGITAL_QUEUE_USER_FORM_COOKIE_NAME,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';



function timeSliceClickCallback(timeStringValue) {
    El.registerLightbox.form.userAppointment.value = timeStringValue;

    page.blockScroll();
    overlay.show();

    El.registerLightbox.self.classList.add('is--visible');
}

function saveFormData() {
    Cookies.set(
        DIGITAL_QUEUE_USER_FORM_COOKIE_NAME, JSON.stringify(pageCache.form),
        {
            expires: new Date(new Date().getTime() + 60*60*24*365*20) // 20 years
        }
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
    El.registerLightbox.form.userName.addEventListener('keyup', function(event) {
        pageCache.form.name = event.target.value.trim();
        saveFormData();
    });
    El.registerLightbox.form.userEmail.addEventListener('keyup', function(event) {
        pageCache.form.email = event.target.value.trim();
        saveFormData();
    });
    El.registerLightbox.form.userTelephone.addEventListener('keyup', function(event) {
        pageCache.form.telephone = event.target.value.trim();
        saveFormData();
    });
    El.registerLightbox.form.userDocumentType.addEventListener('change', function(event) {
        pageCache.form.documentType = event.target.value.trim();
        saveFormData();
        El.registerLightbox.form.userDocument.classList.remove('in-use');
        El.registerLightbox.form.userDocumentType.classList.remove('in-use');
    });
    El.registerLightbox.form.userDocument.addEventListener('keyup', function(event) {
        pageCache.form.document = event.target.value.trim();
        saveFormData();
        El.registerLightbox.form.userDocument.classList.remove('in-use');
        El.registerLightbox.form.userDocumentType.classList.remove('in-use');
    });
    El.registerLightbox.form.userNationality.addEventListener('keyup', function(event) {
        pageCache.form.nationality = event.target.value.trim();
        saveFormData();
    });
    El.registerLightbox.form.userTransport.addEventListener('change', function(event) {
        pageCache.form.transportId = event.target.value.trim();
        saveFormData();
    });
}

function fillFormInputs() {
    const cookieValue = Cookies.get(DIGITAL_QUEUE_USER_FORM_COOKIE_NAME);

    if (!cookieValue) {
        return;
    }

    pageCache.form = JSON.parse(cookieValue);

    if (pageCache.form.name) {
        El.registerLightbox.form.userName.value = pageCache.form.name;
    }

    if (pageCache.form.email) {
        El.registerLightbox.form.userEmail.value = pageCache.form.email;
    }

    if (pageCache.form.telephone) {
        El.registerLightbox.form.userTelephone.value = pageCache.form.telephone;
    }

    if (pageCache.form.documentType) {
        El.registerLightbox.form.userDocumentType
            .querySelector(`option[value="${pageCache.form.documentType}"]`)
            .setAttribute('selected', 'selected');
    }

    if (pageCache.form.document) {
        El.registerLightbox.form.userDocument.value = pageCache.form.document;
    }

    if (pageCache.form.nationality) {
        El.registerLightbox.form.userNationality.value = pageCache.form.nationality;
    }

    if (pageCache.form.transportId) {
        const optionWithValue = El.registerLightbox.form.userTransport
            .querySelector(`option[value="${pageCache.form.transportId}"]`);

        if (optionWithValue) {
            optionWithValue.setAttribute('selected', 'selected');
        }
    }
}

function buildSelectTransports() {
    for (let i = 0; i < pageCache.digitalQueue.transports.length; i++) {
        El.registerLightbox.form.userTransport.innerHTML += `
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
