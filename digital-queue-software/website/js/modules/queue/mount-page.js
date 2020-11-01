import Cookies from 'js-cookie';
import IMask from 'imask';

import El from './cache-selectors';
import getQueueData from './get-queue-data';
import buildTimeSlices from './build-time-slices';
import overlay from '../global/overlay';
import page from '../global/page';
import pageCache from './page-cache';
import {
    DIGITAL_QUEUES_USERS_API,
    DIGITAL_QUEUES_USER_SUCCESS,
    SERVER_ERROR_MESSAGE,
    DOCUMENT_REGEX,
    DIGITAL_QUEUE_USER_FORM_COOKIE_NAME
} from '@WebsiteConstants';
import {
    buildHeaders
} from '@WebsiteUtils/api-call';



function timeSliceClickCallback(timeStringValue) {
    El.registerLightbox.form.userAppointment.value = timeStringValue;

    page.blockScroll();
    overlay.showOverlay();

    El.registerLightbox.self.classList.add('is--visible');
}

function closeLightbox() {
    page.unblockScroll();
    overlay.hideOverlay();
    El.registerLightbox.self.classList.remove('is--visible');
}

async function sendForm(event) {
    event.preventDefault();

    try {
        const body = {
            digitalQueueId: pageCache.queue.id,
            document: El.registerLightbox.form.userDocument.value.replace(DOCUMENT_REGEX, ''),
            name: El.registerLightbox.form.userName.value,
            email: El.registerLightbox.form.userEmail.value,
            telephone: El.registerLightbox.form.userTelephone.value,
            documentType: El.registerLightbox.form.userDocumentType.value,
            nationality: El.registerLightbox.form.userNationality.value,
            transportId: Number(El.registerLightbox.form.userTransport.value),
            appointment: El.registerLightbox.form.userAppointment.value
        };

        const response = await fetch(DIGITAL_QUEUES_USERS_API, {
            method: 'PUT',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(body)
        });

        const responseObj = await response.json();

        if (responseObj.created) {
            alert(DIGITAL_QUEUES_USER_SUCCESS(body.appointment));

            closeLightbox();
        }

    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return null;
    }
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
        pageCache.form.name = event.target.value;
        saveFormData();
    });
    El.registerLightbox.form.userEmail.addEventListener('keyup', function(event) {
        pageCache.form.email = event.target.value;
        saveFormData();
    });
    El.registerLightbox.form.userTelephone.addEventListener('keyup', function(event) {
        pageCache.form.telephone = event.target.value;
        saveFormData();
    });
    El.registerLightbox.form.userDocumentType.addEventListener('change', function(event) {
        pageCache.form.documentType = event.target.value;
        saveFormData();
    });
    El.registerLightbox.form.userDocument.addEventListener('keyup', function(event) {
        pageCache.form.document = event.target.value;
        saveFormData();
    });
    El.registerLightbox.form.userNationality.addEventListener('keyup', function(event) {
        pageCache.form.nationality = event.target.value;
        saveFormData();
    });
    El.registerLightbox.form.userTransport.addEventListener('change', function(event) {
        pageCache.form.transportId = event.target.value;
        saveFormData();
    });
}

function fillFormInputs() {
    pageCache.form = JSON.parse(Cookies.get(DIGITAL_QUEUE_USER_FORM_COOKIE_NAME));
    saveFormData();

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
        El.registerLightbox.form.userTransport
            .querySelector(`option[value="${pageCache.form.transportId}"]`)
            .setAttribute('selected', 'selected');
    }
}

function buildSelectTransports() {
    for (let i = 0; i < pageCache.queueTransports.length; i++) {
        El.registerLightbox.form.userTransport.innerHTML += `
            <option value="${pageCache.queueTransports[i].id}">
                ${pageCache.queueTransports[i].name}
            </option/
        `;
    }
}

function setMasks() {
    IMask(
        El.registerLightbox.form.userTelephone,
        {
            mask: '+00 (00) 00000-0000'
        }
    );

    /*
        TODO (Opcional): Adicionar máscarás e mudar dependendo do tipo de documento
    */
}



export default async function () {
    try {
        await getQueueData();
        buildTimeSlices(timeSliceClickCallback);
        buildSelectTransports();
        fillFormInputs();
        setMasks();
        setEvents();
    } catch (error) {
        console.error(error);
        console.error('Error in mount page');
    }
}
