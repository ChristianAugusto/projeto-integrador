import El from './cache-selectors';
import pageCache from './page-cache';
import closeLightbox from './close-lightbox';
import {
    ROUTES,
    DIGITAL_QUEUES_USER_SUCCESS,
    SERVER_ERROR_MESSAGE,
    DOCUMENT_REGEX
} from '@WebsiteConstants';
import {
    buildHeaders
} from '@WebsiteUtils/api-call';



async function validateDocument(digitalQueueId, document, documentType) {
    try {
        const response = await fetch(ROUTES.api.pub.digitalQueuesUsers, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                digitalQueueId,
                document,
                documentType
            })
        });

        const responseObj = await response.json();

        return responseObj.data.length === 0;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}


export default async function(event) {
    event.preventDefault();

    try {
        const body = {
            digitalQueueId: pageCache.digitalQueue.id,
            document: El.registerLightbox.form.userDocument.value.replace(DOCUMENT_REGEX, ''),
            name: El.registerLightbox.form.userName.value,
            email: El.registerLightbox.form.userEmail.value,
            telephone: El.registerLightbox.form.userTelephone.value,
            documentType: El.registerLightbox.form.userDocumentType.value,
            nationality: El.registerLightbox.form.userNationality.value,
            transportId: Number(El.registerLightbox.form.userTransport.value),
            appointment: El.registerLightbox.form.userAppointment.value
        };


        const validateDocumentResult = await validateDocument(
            body.digitalQueueId, body.document, body.documentType
        );

        if (!validateDocumentResult) {
            El.registerLightbox.form.userDocument.classList.add('in-use');
            El.registerLightbox.form.userDocumentType.classList.add('in-use');
            return false;
        }


        const response = await fetch(ROUTES.api.pub.digitalQueuesUsers, {
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

        return true;
    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return false;
    }
}
