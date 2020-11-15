export default {
    digitalQueue: {
        id: document.getElementById('js--queue-id'),
        timeSlices: document.getElementById('js--queue-time-slices'),
    },
    registerLightbox: {
        self: document.getElementById('js--register-lightbox'),
        closeLightbox: document.getElementById('js--close-register-lightbox'),
        form: {
            self: document.getElementById('js--queue-register-form'),
            digitalQueueUserName: document.getElementById('js--user-name'),
            digitalQueueUserEmail: document.getElementById('js--user-email'),
            digitalQueueUserTelephone: document.getElementById('js--user-telephone'),
            digitalQueueUserDocumentType: document.getElementById('js--user-documentType'),
            digitalQueueUserDocument: document.getElementById('js--user-document'),
            digitalQueueUserNationality: document.getElementById('js--user-nationality'),
            digitalQueueUserTransport: document.getElementById('js--user-transport'),
            digitalQueueUserAppointment: document.getElementById('js--user-appointment')
        }
    }
};
