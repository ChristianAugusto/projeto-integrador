import El from './cache-selectors';
import pageCache from './page-cache';
import closeLightbox from './close-lightbox';
import {
    ROUTES,
    SERVER_ERROR_MESSAGE
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
        const newDigitalQueueUser = {
            digitalQueueId: pageCache.digitalQueue.id,
            document: El.registerLightbox.form.digitalQueueUserDocument.value.trim().replace(
                new RegExp(El.registerLightbox.form.digitalQueueUserDocument.getAttribute('data-replace-regex'), 'gmi'),
                ''
            ),
            name: El.registerLightbox.form.digitalQueueUserName.value.trim(),
            email: El.registerLightbox.form.digitalQueueUserEmail.value.trim(),
            telephone: El.registerLightbox.form.digitalQueueUserTelephone.value.trim(),
            documentType: El.registerLightbox.form.digitalQueueUserDocumentType.value,
            nationality: El.registerLightbox.form.digitalQueueUserNationality.value.trim(),
            transportId: Number(El.registerLightbox.form.digitalQueueUserTransport.value),
            appointment: El.registerLightbox.form.digitalQueueUserAppointment.value.trim()
        };


        const validateDocumentResult = await validateDocument(
            newDigitalQueueUser.digitalQueueId, newDigitalQueueUser.document, newDigitalQueueUser.documentType
        );

        if (!validateDocumentResult) {
            El.registerLightbox.form.digitalQueueUserDocument.classList.add('in-use');
            El.registerLightbox.form.digitalQueueUserDocumentType.classList.add('in-use');

            alert('Combinação de Tipo de documento e documento já utilizada');

            return false;
        }


        const response = await fetch(ROUTES.api.pub.digitalQueuesUsers, {
            method: 'PUT',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(newDigitalQueueUser)
        });

        const responseObj = await response.json();

        if (responseObj.created) {
            alert(`Seu registro foi inserido com sucesso, seu atendimento será às ${newDigitalQueueUser.appointment}`);
            closeLightbox();
            window.location.reload();
        }

        return true;
    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return false;
    }
}
